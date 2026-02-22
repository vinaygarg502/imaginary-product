import { store, markHydrated } from "@/store/store";
import { hydrateCart } from "@/features/cart/cartSlice";
import { hydrateProducts } from "@/features/products/productsSlice";
import { getCachedCart } from "@/features/cart/cartDB";
import { getCachedProducts } from "@/features/products/productService";


export async function bootstrapApp() {
  const [savedCart, savedProducts] = await Promise.all([
    getCachedCart(),
    getCachedProducts(),
  ]);

  if (savedProducts) {
    store.dispatch(hydrateProducts(savedProducts));
  }

  if (savedCart) {
    store.dispatch(hydrateCart(savedCart));
  }

  markHydrated();
}