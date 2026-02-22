import React from "react";

const withLoader = (WrappedComponent) => {
  const WithLoader = ({ loading, ...props }) => {
    if (loading) {
      return (
        <div className="pt-[76px] px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-32 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return React.memo(WithLoader);
};

export default withLoader;