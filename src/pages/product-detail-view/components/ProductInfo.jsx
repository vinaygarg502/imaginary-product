import React, { useMemo } from 'react';
import Icon from '@/components/AppIcon';

const ProductInfo = ({ product }) => {
  if (!product) return null;

  const {
    price = 0,
    discount = 0,
    rating = 0,
    reviewCount = 0,
    inStock,
    stockCount,
    name,
    sku,
    description,
    features = [],
  } = product;

  // ✅ Stable star array (created once)
  const stars = useMemo(() => Array.from({ length: 5 }), []);

  const finalPrice = price - (price * discount) / 100;
  const savings = price - finalPrice;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
          {name}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          SKU: {sku}
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1">
          {stars.map((_, i) => (
            <Icon
              key={i}
              name="Star"
              size={16}
              color={
                i < Math.floor(rating)
                  ? "var(--color-warning)"
                  : "var(--color-muted)"
              }
              className={
                i < Math.floor(rating)
                  ? "fill-warning"
                  : "fill-muted"
              }
            />
          ))}
        </div>
        <span className="text-sm md:text-base font-medium">
          {rating.toFixed(1)}
        </span>
        <span className="text-sm md:text-base text-muted-foreground">
          ({reviewCount} reviews)
        </span>
      </div>

      {/* Pricing */}
      <div className="bg-muted rounded-lg p-4 md:p-6">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl md:text-4xl lg:text-5xl font-bold">
            ${finalPrice.toFixed(2)}
          </span>

          {discount > 0 && (
            <>
              <span className="text-lg md:text-xl line-through text-muted-foreground">
                ${price.toFixed(2)}
              </span>
              <span className="px-2 py-1 bg-error/20 text-error text-sm md:text-base font-semibold rounded">
                {discount}% OFF
              </span>
            </>
          )}
        </div>

        {discount > 0 && (
          <p className="text-sm md:text-base text-success mt-2">
            You save ${savings.toFixed(2)}
          </p>
        )}
      </div>

      {/* Stock */}
      <div className="flex items-center gap-2">
        <Icon
          name={inStock ? "CheckCircle2" : "XCircle"}
          size={20}
          color={inStock ? "var(--color-success)" : "var(--color-error)"}
        />
        <span
          className={`text-sm md:text-base font-medium ${
            inStock ? "text-success" : "text-error"
          }`}
        >
          {inStock
            ? `In Stock (${stockCount} available)`
            : "Out of Stock"}
        </span>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold mb-2">
          Description
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold mb-3">
          Key Features
        </h2>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Icon
                name="Check"
                size={18}
                color="var(--color-success)"
                className="flex-shrink-0 mt-0.5"
              />
              <span className="text-sm md:text-base">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default React.memo(ProductInfo);