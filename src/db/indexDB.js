// src/db/indexedDB.js
import { openDB } from "idb";

const DB_NAME = "app-db";
const DB_VERSION = 2;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("products")) {
      db.createObjectStore("products");
    }

    if (!db.objectStoreNames.contains("cart")) {
      db.createObjectStore("cart");
    }

    if (!db.objectStoreNames.contains("metadata")) {
      db.createObjectStore("metadata");
    }
  },
});
