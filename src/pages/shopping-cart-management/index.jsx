import React, {
  useState,
  useMemo,
  lazy,
  Suspense,
  useEffect,
  useRef,
} from "react";
import { useSelector, useDispatch } from "react-redux";

import Button from "@/components/ui/Button";
import CartItem from "./components/CartItem";
import CartSummary from "./components/CartSummary";
import EmptyCart from "./components/EmptyCart";

const LiveDataStreamingSvc = lazy(
  () => import("./components/LiveDataStreamingSvc"),
);

const FloatigBoxDemo = lazy(() => import("./components/FloatigBoxDemo"));

const PromiseProblemDemo = lazy(
  () => import("./components/PromiseProblemDemo"),
);

const VideoPlayerDemo = lazy(() => import("./components/VideoPlayerDemo"));

const APIUsecaseDemo = lazy(() => import("./components/APIUsecaseDemo"));

const CheckoutModal = lazy(() => import("./components/CheckoutModal"));

import {
  selectCartWithDetails,
  selectCartSubtotal,
  selectCartCount,
} from "@/features/cart/cartSelectors";

import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from "@/features/cart/cartSlice";

function useInView(rootMargin = "200px") {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

const ShoppingCartManagement = () => {
  const dispatch = useDispatch();
  const [demoRef, demosVisible] = useInView();

  const cartItems = useSelector(selectCartWithDetails);
  const subtotal = useSelector(selectCartSubtotal);
  const itemCount = useSelector(selectCartCount);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  /* ---- Derived Calculations (memoized) ---- */

  const tax = useMemo(() => subtotal * 0.08, [subtotal]);

  const shipping = useMemo(() => (subtotal > 50 ? 0 : 9.99), [subtotal]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon === "SAVE10" && subtotal > 100) return subtotal * 0.1;

    if (appliedCoupon === "SAVE20" && subtotal > 200) return subtotal * 0.2;

    if (appliedCoupon === "FREESHIP") return shipping;

    return 0;
  }, [appliedCoupon, subtotal, shipping]);

  const total = useMemo(
    () => subtotal + tax + shipping - discount,
    [subtotal, tax, shipping, discount],
  );

  /* ---- Handlers ---- */

  const handleUpdateQuantity = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleApplyCoupon = () => {
    const validCoupons = ["SAVE10", "SAVE20", "FREESHIP"];
    const upper = couponCode.toUpperCase();

    if (validCoupons.includes(upper)) {
      setAppliedCoupon(upper);
    } else {
      alert("Invalid coupon code");
    }
  };

  return (
    <>
      <main className="pt-[76px] px-4 md:px-6 lg:px-8 pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-3">
              Shopping Cart
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Review your items and proceed to checkout
            </p>
          </div>

          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
              {/* Left Section */}
              <div className="flex-1 space-y-4 md:space-y-6">
                <div className="bg-card border border-border rounded-lg p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h2 className="text-lg md:text-xl font-semibold text-foreground">
                      Cart Items ({itemCount})
                    </h2>

                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      iconPosition="left"
                      onClick={() => dispatch(clearCart())}
                      className="text-error"
                    >
                      Clear All
                    </Button>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </div>
                </div>

                {/* Demos */}
                <div ref={demoRef}>
                  {demosVisible && (
                    <Suspense
                      fallback={
                        <div className="py-10 text-center">
                          Loading demos...
                        </div>
                      }
                    >
                      <LiveDataStreamingSvc />
                      <FloatigBoxDemo />
                      <PromiseProblemDemo />
                      <VideoPlayerDemo />
                      <APIUsecaseDemo />
                    </Suspense>
                  )}
                </div>
              </div>

              {/* Right Summary */}
              <CartSummary
                subtotal={subtotal}
                tax={tax}
                shipping={shipping}
                discount={discount}
                total={total}
                couponCode={couponCode}
                onCouponChange={setCouponCode}
                onApplyCoupon={handleApplyCoupon}
                onCheckout={() => setIsCheckoutOpen(true)}
                itemCount={itemCount}
              />
            </div>
          )}
        </div>
      </main>

      {isCheckoutOpen && (
        <Suspense fallback={null}>
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            total={total}
          />
        </Suspense>
      )}
    </>
  );
};

export default React.memo(ShoppingCartManagement);
