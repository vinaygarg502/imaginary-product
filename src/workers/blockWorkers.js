// src/workers/blockWorker.js

import { generateLargeBlockData } from '../pages/e-book/components/blockData';

self.onmessage = function (event) {
  const { count } = event.data;

  // 🔥 Heavy CPU work (moved off main thread)
  let result = 0;
  for (let i = 0; i < 100000000; i++) {
    result += Math.sqrt(i);
  }

  // 🔥 Reuse your existing generator
  const blocks = generateLargeBlockData(count);

  self.postMessage({
    blocks,
    result
  });
};