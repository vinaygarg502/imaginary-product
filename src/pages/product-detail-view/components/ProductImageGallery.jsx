import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "@/components/AppImage";
import Icon from "@/components/AppIcon";

const ProductImageGallery = ({ images = [], productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  /* ---------------- Preload Adjacent Images ---------------- */

  useEffect(() => {
    if (!images.length) return;

    const preload = (index) => {
      if (!images[index]?.medium) return;
      const img = new window.Image();
      img.src = images[index].medium;
    };

    const nextIndex = (selectedImage + 1) % images.length;
    const prevIndex = (selectedImage - 1 + images.length) % images.length;

    preload(nextIndex);
    preload(prevIndex);
  }, [selectedImage, images]);

  /* ---------------- Handlers ---------------- */

  const nextImage = useCallback(() => {
    if (!images.length) return;
    setSelectedImage((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (!images.length) return;
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const thumbnails = useMemo(() => images, [images]);

  /* ---------------- Render ---------------- */

  return (
    <div className="w-full">
      {/* HERO IMAGE (LCP Critical) */}
      <div className="relative bg-muted rounded-lg overflow-hidden mb-4 aspect-[4/5]">
        <Image
          src={images?.[selectedImage]?.medium}
          alt={images?.[selectedImage]?.alt || productName}
          className="w-full h-full object-cover"
          loading="eager"
          fetchpriority="high"
        />

        {/* Previous Button */}
        <button
          onClick={prevImage}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
          aria-label="Previous image"
        >
          <Icon name="ChevronLeft" size={20} />
        </button>

        {/* Next Button */}
        <button
          onClick={nextImage}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
          aria-label="Next image"
        >
          <Icon name="ChevronRight" size={20} />
        </button>

        {/* Counter */}
        <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs md:text-sm font-mono">
          {selectedImage + 1} / {images.length}
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
        {thumbnails.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedImage(index);
            }}
            className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
              selectedImage === index
                ? "border-primary scale-95"
                : "border-border hover:border-muted-foreground"
            }`}
          >
            <Image
              src={image?.thumb}
              alt={image?.alt}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ProductImageGallery);
