import { dbPromise } from "@/db/indexDB";

const CART_KEY = "all-cart";

export async function getCachedCart() {
  const db = await dbPromise;
  return db.get("cart", CART_KEY);
}

export async function saveCart(cartItems) {
  const db = await dbPromise;
  await db.put("cart", cartItems, CART_KEY);
}