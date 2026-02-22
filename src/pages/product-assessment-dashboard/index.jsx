import React, {
  useState,
  useMemo,
  useCallback,
  useDeferredValue,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadProducts,
  selectAllProducts,
} from "@/features/products/productsSlice";
import { useNavigate } from "react-router-dom";
import FilterToolbar from "./components/FilterToolbar";
import Icon from "@/components/AppIcon";
// import withLoader from "hoc/withLoader";

import ProductGrid from "./components/ProductGrid";

const categories = [
  "electronics",
  "clothing",
  "home",
  "sports",
  "books",
  "toys",
  "beauty",
  "automotive",
];
// const ProductGridWithLoader = withLoader(ProductGrid);

const ProductAssessmentDashboard = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    minPrice: null,
    maxPrice: null,
  });

  const deferredFilters = useDeferredValue(filters);
  const [productCount, setProductCount] = useState(50);
  const [productCountInput, setProductCountInput] = useState("50");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadProducts({ productCount, categories }));
  }, [productCount, dispatch]);

  const products = useSelector(selectAllProducts);
  const loading = useSelector((state) => state.products.loading);

  const filteredProducts = useMemo(() => {
    return products.slice(0, productCount)?.filter((product) => {
      const matchesSearch = product?.name
        ?.toLowerCase()
        ?.includes(deferredFilters?.search?.toLowerCase());
      const matchesCategory =
        deferredFilters?.category === "all" ||
        product?.category === deferredFilters?.category;
      const matchesMinPrice =
        deferredFilters?.minPrice === null ||
        product?.price >= deferredFilters?.minPrice;
      const matchesMaxPrice =
        deferredFilters?.maxPrice === null ||
        product?.price <= deferredFilters?.maxPrice;

      return (
        matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice
      );
    });
  }, [products, deferredFilters, productCount]);

  const handleProductClick = useCallback((product) => {
    navigate(`/products/${product.id}`);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <main className="pt-[76px] px-4 md:px-6 lg:px-8 pb-8">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 mt-6">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Product Catalog
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label
                htmlFor="product-count"
                className="text-sm font-medium text-foreground whitespace-nowrap"
              >
                Products:
              </label>
              <input
                id="product-count"
                type="number"
                min="1"
                max="100000"
                value={productCountInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setProductCountInput(value);

                  if (value === "") return;

                  const parsed = parseInt(value, 10);
                  if (!isNaN(parsed)) {
                    setProductCount(Math.max(1, parsed));
                  }
                }}
                className="w-24 px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-ring/10 border border-ring/20 rounded-md">
              <Icon name="AlertCircle" size={18} color="var(--color-ring)" />
              <span className="text-sm text-ring font-medium whitespace-nowrap">
                {filteredProducts?.length?.toLocaleString()} items
              </span>
            </div>
          </div>
        </div>

        <FilterToolbar
          onFilterChange={handleFilterChange}
          categories={categories}
          totalProducts={productCount}
        />

        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
              Product Catalog
            </h2>
            <span className="text-sm text-muted-foreground">
              Showing {filteredProducts?.length?.toLocaleString()} of{" "}
              {productCount.toLocaleString()}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-[60vh]">
              Loading products...
            </div>
          ) : filteredProducts?.length > 0 ? (
            <ProductGrid
              products={filteredProducts}
              onProductClick={handleProductClick}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 md:py-16">
              <Icon name="PackageX" size={48} color="var(--color-muted)" />
              <p className="text-muted-foreground mt-4">
                No products found matching your filters
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductAssessmentDashboard;
