import { configureStore } from "@reduxjs/toolkit";
import productsReducer from '@/features/products/productsSlice';
import cartReducer from '@/features/cart/cartSlice';

import { saveCart } from "@/features/cart/cartDB";
import { saveProducts } from "@/features/products/productService";

let isHydrated = false;

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
});

store.subscribe(() => {
  if (!isHydrated) return;

  const state = store.getState();

  saveCart(state.cart.items);
  saveProducts(Object.values(state.products.entities));
});

export function markHydrated() {
  isHydrated = true;
}