import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import ProductImageGallery from "./components/ProductImageGallery";
import ProductInfo from "./components/ProductInfo";
import ProductConfiguration from "./components/ProductConfiguration";
import Icon from "@/components/AppIcon";

// Lazy loaded (below the fold)
const ProductSpecifications = lazy(
  () => import("./components/ProductSpecifications"),
);
const RelatedProducts = lazy(() => import("./components/RelatedProducts"));
const CustomerReviews = lazy(() => import("./components/CustomerReviews"));

const ProductDetailView = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overview");
  const tabsRef = useRef(null);
  const relatedRef = useRef(null);

  const [showTabs, setShowTabs] = useState(false);
  const [showRelated, setShowRelated] = useState(false);

  /* ---------------- INTERSECTION OBSERVER ---------------- */

  useEffect(() => {
    if (!product) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          if (entry.target === tabsRef.current && !showTabs) {
            setShowTabs(true);
            observer.unobserve(tabsRef.current);
          }

          if (entry.target === relatedRef.current) {
            setShowRelated(true);
            observer.unobserve(relatedRef.current);
          }
        });
      },
      {
        rootMargin: "200px",
        threshold: 0,
      },
    );

    if (tabsRef.current) observer.observe(tabsRef.current);
    if (relatedRef.current) observer.observe(relatedRef.current);

    return () => observer.disconnect();
  }, [product]);

  /* ---------------- MEMOIZED VALUES ---------------- */

  const handleAddToCart = useCallback(
    (configuredProduct) => {
      dispatch(
        addToCart({
          id: configuredProduct.id,
          quantity: configuredProduct.quantity,
          selectedColor: configuredProduct.selectedColor,
          selectedSize: configuredProduct.selectedSize,
        }),
      );
    },
    [dispatch],
  );

  const tabs = useMemo(
    () => [
      { id: "overview", label: "Overview", icon: "Info" },
      { id: "specifications", label: "Specifications", icon: "FileText" },
      { id: "reviews", label: "Reviews", icon: "Star" },
    ],
    [],
  );

  /* ---------------- RENDER ---------------- */

  return (
    <div className="pt-[76px] px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm md:text-base mb-6 md:mb-8 overflow-x-auto">
          <button
            onClick={() => navigate("/product-assessment-dashboard")}
            className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
          >
            Dashboard
          </button>
          <Icon
            name="ChevronRight"
            size={16}
            color="var(--color-muted-foreground)"
          />
          <span className="text-foreground font-medium truncate">
            {product?.name}
          </span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-8 md:mb-12">
          {/* Left Column - Images */}
          <div>
            <ProductImageGallery
              images={product?.images}
              productName={product?.name}
            />
          </div>

          {/* Right Column - Info & Configuration */}
          <div className="space-y-6 md:space-y-8">
            <ProductInfo product={product} />
            <ProductConfiguration
              product={product}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* ---------------- TABS SECTION ---------------- */}
        <div ref={tabsRef} className="mb-8 md:mb-12">
          {showTabs && (
            <>
              <div className="border-b border-border overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                  {tabs.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`
                      flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-medium transition-all whitespace-nowrap
                      ${
                        activeTab === tab?.id
                          ? "text-primary border-b-2 border-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    `}
                    >
                      <Icon name={tab?.icon} size={18} />
                      <span className="text-sm md:text-base">{tab?.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-6 md:py-8">
                {activeTab === "overview" && (
                  <div className="prose prose-sm md:prose-base max-w-none">
                    <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                      Product Overview
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                      {product?.description}
                    </p>
                  </div>
                )}

                {activeTab === "specifications" && (
                  <Suspense fallback={<div>Loading specifications...</div>}>
                    <ProductSpecifications
                      specifications={product?.specifications}
                    />
                  </Suspense>
                )}

                {activeTab === "reviews" && (
                  <Suspense fallback={<div>Loading reviews...</div>}>
                    <CustomerReviews
                      productId={product?.id}
                      averageRating={product?.rating}
                      totalReviews={product?.reviewCount}
                    />
                  </Suspense>
                )}
              </div>
            </>
          )}
        </div>

        {/* ---------------- RELATED PRODUCTS ---------------- */}
        <div ref={relatedRef} className="min-h-[200px]">
          {showRelated && (
            <Suspense fallback={<div>Loading related products...</div>}>
              <RelatedProducts
                currentProductId={product?.id}
                category={product?.category}
              />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductDetailView);
