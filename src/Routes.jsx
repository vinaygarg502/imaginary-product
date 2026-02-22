import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import AppLayout from "@/layouts/AppLayout";
import { AssessmentProgressProvider } from "@/components/ui/AssessmentProgress";

import ProductAssessmentDashboard from "@/pages/product-assessment-dashboard";

const ProductDetailView = lazy(() =>
  import("@/pages/product-detail-view")
);

const UserAuthentication = lazy(() =>
  import("@/pages/user-authentication")
);

const ShoppingCartManagement = lazy(() =>
  import("@/pages/shopping-cart-management")
);

const Ebook = lazy(() =>
  import("@/pages/e-book")
);

const Library = lazy(() =>
  import("@/pages/Library")
);

// ✅ Simple route loader
const RouteLoader = () => (
  <div className="flex items-center justify-center h-[60vh]">
    <span className="text-muted-foreground text-sm">
      Loading page...
    </span>
  </div>
);

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AssessmentProgressProvider>
          <ScrollToTop />

          <RouterRoutes>
            <Route element={<AppLayout />}>

              {/* Eager Loaded Landing Page */}
              <Route
                path="/"
                element={<ProductAssessmentDashboard />}
              />
              <Route
                path="/product-assessment-dashboard"
                element={<ProductAssessmentDashboard />}
              />

              {/* Lazy Loaded Routes */}
              <Route
                path="/products/:id"
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <ProductDetailView />
                  </Suspense>
                }
              />

              <Route
                path="/user-authentication"
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <UserAuthentication />
                  </Suspense>
                }
              />

              <Route
                path="/shopping-cart-management"
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <ShoppingCartManagement />
                  </Suspense>
                }
              />

              <Route
                path="/e-book"
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <Ebook />
                  </Suspense>
                }
              />

              <Route
                path="/Library"
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <Library />
                  </Suspense>
                }
              />

            </Route>
          </RouterRoutes>

        </AssessmentProgressProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;