// features/products/productService.ts

import { dbPromise } from '@/db/indexDB';
import { generateProduct } from './productGenerator';

const PRODUCTS_KEY = 'all-products';
const INDEX_KEY = 'last-index';

export async function getCachedProducts() {
  const db = await dbPromise;
  return db.get('products', PRODUCTS_KEY);
}

export async function saveProducts(products) {
  const db = await dbPromise;
  await db.put('products', products, PRODUCTS_KEY);
}

export async function getLastIndex() {
  const db = await dbPromise;
  return (await db.get('metadata', INDEX_KEY)) || 0;
}

export async function setLastIndex(index) {
  const db = await dbPromise;
  await db.put('metadata', index, INDEX_KEY);
}

export async function getProductsSWR(
  requiredCount
) {
  const existing = (await getCachedProducts()) || [];
  const lastIndex = await getLastIndex();

  // If already enough, return immediately
  if (existing.length >= requiredCount) {
    return { initial: existing, needsUpdate: false };
  }

  return {
    initial: existing,
    needsUpdate: true,
    generateFrom: lastIndex
  };
}

export async function generateIncrementally(
  requiredCount,
  categories
) {
  const existing = (await getCachedProducts()) || [];
  let lastIndex = await getLastIndex();

  if (existing.length >= requiredCount) {
    return existing;
  }

  const newProducts = [];

  for (let i = lastIndex; i < requiredCount; i++) {
    newProducts.push(generateProduct(i, categories));
  }

  const updated = [...existing, ...newProducts];

  await saveProducts(updated);
  await setLastIndex(updated.length);

  return updated;
}