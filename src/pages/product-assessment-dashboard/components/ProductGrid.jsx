import React, { useMemo } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import ProductCard from "./ProductCard";

const Cell = React.memo(({ columnIndex, rowIndex, style, data }) => {
  const { products, columnCount, onProductClick } = data;
  const index = rowIndex * columnCount + columnIndex;
  const product = products[index];

  if (!product) return null;

  return (
    <div style={style} className="p-2">
      <ProductCard product={product} onClick={onProductClick}  fetchpriority={index < columnCount ? "high" : "auto"} />
    </div>
  );
});

const getColumnCount = (width) => {
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
};

const ProductGrid = ({ products, onProductClick }) => {
  return (
    <div className="h-[calc(100vh-200px)]">
      <AutoSizer>
        {(size) => (
          <GridRenderer
            {...size}
            products={products}
            onProductClick={onProductClick}
          />
        )}
      </AutoSizer>
    </div>
  );
};

const GridRenderer = React.memo(({ height, width, products, onProductClick }) => {
  const columnCount = getColumnCount(width);
  const columnWidth = Math.floor(width / columnCount);
  const imageHeight = columnWidth * (4 / 3);
  const contentHeight = 140;
  const rowHeight = imageHeight + contentHeight;
  const rowCount = Math.ceil(products.length / columnCount);


  const itemData = useMemo(
    () => ({ products, columnCount, onProductClick }),
    [products, columnCount, onProductClick]
  );

  return (
    <Grid
      columnCount={columnCount}
      columnWidth={columnWidth}
      height={height}
      rowCount={rowCount}
      rowHeight={rowHeight}
      width={width}
      itemData={itemData}
    >
      {Cell}
    </Grid>
  );
});

export default React.memo(ProductGrid);