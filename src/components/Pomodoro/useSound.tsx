import { useCallback, useEffect, useState } from 'react';

import { sounds } from '../../constants';
import { useSettings } from '../../context/SettingsContext';

interface UseSoundType {
  play: () => void;
}

export default function useSound({
  volume,
  duration = 500,
}: {
  volume: number;
  duration: number;
}): UseSoundType {
  const [{ sound }] = useSettings();
  const src = `${sounds[sound.name]}`;

  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(() => {
    const newAudio = new Audio(src);
    newAudio.volume = volume / 100;
    return newAudio;
  });

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    audio.src = src;
  }, [src, audio]);

  useEffect(() => {
    audio.volume = volume / 100;
  }, [volume, audio]);

  useEffect(() => {
    let timerId: number;
    if (isPlaying) {
      audio.play();
      timerId = window.setTimeout(() => {
        setIsPlaying(false);
      }, duration);
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
    return () => window.clearTimeout(timerId);
  }, [isPlaying, audio, duration]);

  return { play };
}
