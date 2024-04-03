let timerId: number;
let startTime: number;
let lastTime = 0;
onmessage = event => {
  const { action } = event.data;

  if (action === 'started') {
    clearInterval(timerId);
    startTime = Date.now();
    timerId = self.setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const timeInSeconds = Math.round(elapsedTime / 1000);
      if (timeInSeconds === lastTime) {
        return;
      }
      lastTime = timeInSeconds;

      postMessage('tick');
    }, 1000);
  } else if (action === 'paused') {
    clearInterval(timerId);
  }
};
