import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {store} from '@/store/store';
import App from "./App";
import "./styles/tailwind.css";
import { bootstrapApp } from "./bootstrap";

await bootstrapApp();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<Provider store={store}><App /></Provider>);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("✅ SW Registered"))
      .catch((err) => console.error("❌ SW Failed:", err));
  });
}

requestAnimationFrame(() => {
  const loader = document.getElementById("global-loader");

  if (loader) {
    loader.classList.add("hide");

    loader.addEventListener(
      "transitionend",
      () => {
        loader.remove();
      },
      { once: true }
    );
  }
});