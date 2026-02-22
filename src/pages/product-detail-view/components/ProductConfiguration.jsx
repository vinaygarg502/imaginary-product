import React, { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

const ProductConfiguration = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  /* Reset when product changes */
  useEffect(() => {
    if (!product) return;

    setSelectedColor(product.colors?.[0] ?? null);
    setSelectedSize(product.sizes?.[0] ?? null);
    setQuantity(1);
  }, [product?.id]);

  const incrementQuantity = useCallback(() => {
    setQuantity((prev) =>
      Math.min(Number(prev || 1) + 1, product?.stockCount ?? prev)
    );
  }, [product?.stockCount]);

  const decrementQuantity = useCallback(() => {
    setQuantity((prev) => Math.max(Number(prev || 1) - 1, 1));
  }, []);

  const handleQuantityChange = useCallback((e) => {
    const value = e.target.value;

    // Allow empty while typing
    if (value === "") {
      setQuantity("");
      return;
    }

    const num = Number(value);

    // Allow only positive numbers
    if (!Number.isNaN(num) && num >= 1) {
      setQuantity(num);
    }
  }, []);

  // 🔥 Fix: prevent blank after blur
  const handleBlur = useCallback(() => {
    if (!quantity || Number(quantity) < 1) {
      setQuantity(1);
    }
  }, [quantity]);

  const handleAddToCart = useCallback(() => {
    onAddToCart({
      ...product,
      quantity: Number(quantity) >= 1 ? Number(quantity) : 1,
      selectedColor,
      selectedSize,
    });
  }, [onAddToCart, product, quantity, selectedColor, selectedSize]);

  return (
    <div className="space-y-4 md:space-y-6 bg-card border border-border rounded-lg p-4 md:p-6">
      {/* Color */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-3">
          Color: <span className="text-primary">{selectedColor}</span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {product?.colors?.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-4 py-2 rounded-md border-2 transition-all text-sm md:text-base ${
                selectedColor === color
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted hover:border-muted-foreground"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-3">
          Size: <span className="text-primary">{selectedSize}</span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {product?.sizes?.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-md border-2 transition-all font-medium ${
                selectedSize === size
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted hover:border-muted-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-3">
          Quantity
        </label>

        <div className="flex items-center gap-3">
          <button
            onClick={decrementQuantity}
            disabled={Number(quantity) <= 1}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-muted border border-border rounded-md disabled:opacity-50"
          >
            <Icon name="Minus" size={18} />
          </button>

          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleBlur}
            min="1"
            max={product?.stockCount}
            className="w-16 md:w-20 h-10 md:h-12 text-center bg-background border border-border rounded-md font-mono"
          />

          <button
            onClick={incrementQuantity}
            disabled={Number(quantity) >= product?.stockCount}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-muted border border-border rounded-md disabled:opacity-50"
          >
            <Icon name="Plus" size={18} />
          </button>
        </div>

        <p className="text-xs md:text-sm text-muted-foreground mt-2">
          Maximum {product?.stockCount} items available
        </p>
      </div>

      {/* Action */}
      <div className="space-y-3 pt-4 border-t border-border">
        <Button
          variant="default"
          size="lg"
          fullWidth
          iconName="ShoppingCart"
          iconPosition="left"
          onClick={handleAddToCart}
          disabled={!product?.inStock}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default React.memo(ProductConfiguration);