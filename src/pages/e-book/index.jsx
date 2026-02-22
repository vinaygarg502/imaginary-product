import React, { useState, useEffect, useMemo } from "react";
import Icon from "@/components/AppIcon";
import BlockRenderer from "./components/BlockRenderer";

const Ebook = () => {
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);

  /* ---------------- Worker Load ---------------- */

  useEffect(() => {
    const worker = new Worker(
      new URL("../../workers/blockWorkers.js", import.meta.url),
      { type: "module" }
    );

    worker.postMessage({ count: 500 });

    worker.onmessage = (event) => {
      setBlocks(event.data.blocks || []);
      setIsLoading(false);
    };

    return () => worker.terminate();
  }, []);

  /* ---------------- Drag & Drop ---------------- */

  const handleDragStart = (blockId) => {
    setDraggedBlock(blockId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();

    if (!draggedBlock || draggedBlock === targetId) return;

    setBlocks((prev) => {
      const draggedIndex = prev.findIndex((b) => b.id === draggedBlock);
      const targetIndex = prev.findIndex((b) => b.id === targetId);

      const updated = [...prev];
      const [removed] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, removed);

      return updated;
    });

    setDraggedBlock(null);
  };

  /* ---------------- Edit ---------------- */

  const handleBlockEdit = (blockId, newContent) => {
    setEditingBlock(blockId);

    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? { ...block, content: newContent }
          : block
      )
    );
  };

  /* ---------------- Stats (Memoized) ---------------- */

  const stats = useMemo(() => {
    let totalWords = 0;
    let totalImages = 0;
    let totalCode = 0;

    blocks.forEach((block) => {
      if (
        block.type === "paragraph" ||
        block.type === "heading"
      ) {
        totalWords += block.content?.split(" ")?.length || 0;
      }
      if (block.type === "image") totalImages++;
      if (block.type === "code") totalCode++;
    });

    return { totalWords, totalImages, totalCode };
  }, [blocks]);

  /* ---------------- Loading ---------------- */

  if (isLoading) {
    return (
        <main className="pt-[76px] flex items-center justify-center h-screen">
          <div className="text-center">
            <Icon
              name="Loader2"
              className="w-12 h-12 animate-spin text-primary mx-auto mb-4"
            />
            <p className="text-muted-foreground">
              Loading blocks in Web Worker...
            </p>
          </div>
        </main>
    );
  }

  /* ---------------- Render ---------------- */

  return (

      <main className="pt-[76px] pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <Icon
                  name="AlertTriangle"
                  className="w-6 h-6 text-red-500"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  E book
                </h1>
                <p className="text-muted-foreground mt-1">
                  Optimized Version
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {blocks.map((block) => (
              <div
                key={block.id}
                draggable
                onDragStart={() => handleDragStart(block.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, block.id)}
                className={`transition-all ${
                  draggedBlock === block.id
                    ? "opacity-50"
                    : ""
                } ${
                  editingBlock === block.id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
              >
                <BlockRenderer
                  block={block}
                  onEdit={(content) =>
                    handleBlockEdit(block.id, content)
                  }
                  isEditing={editingBlock === block.id}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            <div>Total Words: {stats.totalWords}</div>
            <div>Total Images: {stats.totalImages}</div>
            <div>Total Code Blocks: {stats.totalCode}</div>
          </div>
        </div>
        </main>
  );
};

export default Ebook;