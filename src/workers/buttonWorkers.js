self.onmessage = function () {
  let result = 0;

  for (let i = 0; i < 10000000; i++) {
    result += Math.random();
  }

  self.postMessage(result);
};