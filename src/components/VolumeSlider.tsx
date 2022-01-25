import {
  SliderInput,
  SliderTrack,
  SliderRange,
  SliderHandle,
  SliderMarker,
} from '@reach/slider';
import '@reach/slider/styles.css';
import { useMemo } from 'react';
import debounce from 'lodash.debounce';

interface VolumeSliderProps {
  volume: number;
  onChange: (value: number) => void;
}

export default function VolumeSlider({ volume, onChange }: VolumeSliderProps) {
  const markers = [25, 50, 75];

  function handleChange(value: number) {
    onChange(value);
  }

  const debouncedHandler = useMemo(() => debounce(handleChange, 200), []);

  return (
    <SliderInput
      onChange={value => debouncedHandler(value)}
      min={0}
      max={100}
      step={5}
      value={volume}
    >
      <SliderTrack>
        <SliderRange />
        {markers.map(value => (
          <SliderMarker key={`marker${value}`} value={value} />
        ))}
        <SliderHandle />
      </SliderTrack>
    </SliderInput>
  );
}
