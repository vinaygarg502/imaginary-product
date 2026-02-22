import { createSelector } from "@reduxjs/toolkit";

/* Basic selectors */
export const selectCartItems = (state) => state.cart.items;
export const selectProductEntities = (state) => state.products.entities;

/* 🔥 Join cart + products */
export const selectCartWithDetails = createSelector(
  [selectCartItems, selectProductEntities],
  (cartItems, productEntities) =>
    cartItems
      .map((item) => {
        const product = productEntities[item.id];
        if (!product) return null;

        return {
          ...product,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          totalPrice: product.price * item.quantity,
        };
      })
      .filter(Boolean),
);

/* Cart count */
export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

/* Cart subtotal */
export const selectCartSubtotal = createSelector(
  [selectCartWithDetails],
  (items) => items.reduce((sum, item) => sum + item.totalPrice, 0),
);
