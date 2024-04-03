import { useEffect, useRef } from 'react';

export default function useWorker(onTick: () => void) {
  const worker = useRef<Worker | null>(null);
  useEffect(() => {
    worker.current = new Worker(new URL('../../worker.ts', import.meta.url));

    function handleMessage(event: MessageEvent) {
      if (event.data === 'tick') {
        onTick();
      }
    }

    worker.current.addEventListener('message', handleMessage);
    return () => {
      worker.current?.removeEventListener('message', handleMessage);
    };
  }, []);

  function postMessage(action: 'started' | 'paused') {
    worker.current?.postMessage({ action });
  }

  return { postMessage };
}
