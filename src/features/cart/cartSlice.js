import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state, action) => {
      state.items = action.payload || [];
    },
    addToCart: (state, action) => {
      const { id, quantity, selectedColor, selectedSize } = action.payload;

      const existing = state.items.find(
        (item) =>
          item.id === id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize,
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          id,
          quantity,
          selectedColor,
          selectedSize,
        });
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);

      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },
    removeFromCart: (state, action) => {
      const { id, selectedColor, selectedSize } = action.payload;

      state.items = state.items.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          ),
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
