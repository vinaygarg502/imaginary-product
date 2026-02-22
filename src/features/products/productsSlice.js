import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { getProductsSWR, generateIncrementally } from "./productService";

const productsAdapter = createEntityAdapter({
  selectId: (product) => product.id,
});

export const loadProducts = createAsyncThunk(
  "products/loadProducts",
  async ({ productCount, categories }) => {
    const result = await getProductsSWR(productCount, categories);

    if (result.needsUpdate) {
      return await generateIncrementally(productCount, categories);
    }
    return result.initial;
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState: productsAdapter.getInitialState({
    loading: false,
  }),
  reducers: {
    hydrateProducts: (state, action) => {
      productsAdapter.setAll(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        productsAdapter.setAll(state, action);
        state.loading = false;
      })
      .addCase(loadProducts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { hydrateProducts } = productsSlice.actions;


export const { selectAll: selectAllProducts, selectById: selectProductById } =
  productsAdapter.getSelectors((state) => state.products);

export default productsSlice.reducer;
