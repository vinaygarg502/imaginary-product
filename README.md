# 🚀 Scalable Product Dashboard

A performance-focused frontend implementation designed to handle up to **100,000 products** efficiently using virtualization, layered caching, and optimized rendering techniques.

---

## 🌐 Live Application

The application is available at:

👉 https://assessment-app-sigma.vercel.app/

---

## 📦 Local Installation

To run the project locally:

```bash
npm install
npm start

## 📌 Overview

This project demonstrates how to build a scalable frontend system under constrained performance conditions.

- Client-side generated dataset (no backend API)
- Supports up to **100,000 products**
- Virtualized rendering using `react-window`
- Layered caching strategy (Redux + IndexedDB)
- Offline-ready simulation
- Performance tested under throttled conditions
- CI integration for linting

---

## 🏗 Architecture

Client Data Generation  
        ↓  
IndexedDB (Persistent Storage Layer)  
        ↓  
Redux Store (In-Memory Working Set)  
        ↓  
react-window (Virtualized Rendering)  
        ↓  
UI  

---

## 🧠 Key Design Decisions

### 1️⃣ Handling Large Datasets (100,000 Products)

- Data is generated on the client side.
- IndexedDB simulates production-scale persistence.
- Redux stores only the active working set.
- Virtualization ensures minimal DOM nodes.

Why not store everything in Redux?

- Increased JS heap size
- Higher GC pressure
- Slower DevTools serialization
- Poor scalability at very large sizes

---

### 2️⃣ Virtualized Rendering

Using `react-window` to:

- Render only visible rows
- Maintain constant DOM size
- Prevent scroll lag
- Avoid unnecessary re-renders

Even with 100k products, only ~20–40 DOM nodes are mounted at a time.

---

### 3️⃣ Layered Caching Strategy

Layer 1 → Redux (Hot memory cache)  
Layer 2 → IndexedDB (Persistent storage)  
Layer 3 → Client generation (Source of truth)  

Benefits:

- Fast UI updates
- Persistence across refresh
- Scalable storage outside JS heap
- Offline-friendly architecture

---

### 4️⃣ Large Content Optimization (Big Notes)

- First 10,000 characters rendered initially
- Remaining content progressively loaded
- Last rendered index stored using `useRef`
- Prevents main thread blocking

---

### 5️⃣ Lazy Loading

- Below-the-fold components are lazy loaded
- eBook section uses `IntersectionObserver`
- Dynamic imports for code splitting

⚠️ Known Issue: Lazy-loaded components may fail in offline mode (needs chunk caching improvement).

---

### 6️⃣ Cart Persistence

- Cart items persist across refresh
- State synchronization handled carefully to avoid unnecessary re-renders

---

### 7️⃣ Performance Testing

Validated under:

- Chrome DevTools
- Slow 4G throttling
- 4x CPU slowdown
- Lighthouse audit

---

## 🛠 CI Integration

GitHub Actions pipeline configured to:

- Deploy Application on every push to master

---

## 📦 Tech Stack

- React
- Redux Toolkit
- IndexedDB
- react-window
- IntersectionObserver
- Service Worker
- GitHub Actions

---

## ⚡ Performance Highlights

- Virtualized list rendering
- Memory-conscious state management
- Persistent structured storage
- Progressive text rendering
- Asset caching via Service Worker
- Tested under constrained CPU/network

---

## 🚧 Improvements & Future Enhancements

### 🔹 UI Improvements

- Add Shimmer / Skeleton loaders for:
  - Product cards
  - Dashboard loading state
  - Lazy-loaded sections
- Improve perceived performance during hydration

---

### 🔹 Image Optimization

- Convert images to WebP
- Implement `srcset` for responsive loading
- Preload critical LCP images
- Improve LCP request discovery

---

### 🔹 Video Player Optimization

If video content is present:

- Use `useEffect` only for external side effects
- Clean up event listeners on unmount
- Avoid unnecessary `setState` on high-frequency events
- Use `useRef` for non-UI state (playback tracking)
- Debounce `onTimeUpdate` events
- Use `preload="metadata"` where appropriate
- Lazy load video sources

---

### 🔹 Code Optimization

- Remove unnecessary `setTimeout` and `setInterval`
- Ensure proper cleanup to prevent memory leaks
- Minimize excessive `useEffect` usage
- Avoid storing large unused objects in Redux
- Selectively hydrate Redux from IndexedDB

---

### 🔹 Offline Enhancements

- Cache dynamic chunks via Service Worker
- Add retry mechanism in Error Boundary
- Improve fallback UI for chunk load failures

---

### 🔹 Architectural Enhancements

- Add IndexedDB schema versioning
- Implement cache invalidation strategy
- Simulate API-level pagination
- Add monitoring/logging integration
- Track bundle size changes

---

## 🎯 Assessment Context

- No backend API was provided.
- Data is generated on the client.
- IndexedDB was added to simulate production-scale persistence.
- Architecture reflects real-world scalability considerations.

---

## 🏁 Conclusion

This implementation demonstrates:

- Efficient handling of large datasets
- Rendering vs memory tradeoff awareness
- Scalable frontend architecture
- Production-like performance validation
- Clean state management practices

The project prioritizes scalability, responsiveness, and structured performance engineering.