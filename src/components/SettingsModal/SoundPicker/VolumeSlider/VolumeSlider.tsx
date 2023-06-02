import * as Slider from '@radix-ui/react-slider';

import styles from './VolumeSlider.module.css';

interface VolumeSliderProps {
  volume: number;
  onChange: (value: number) => void;
}

export default function VolumeSlider({ volume, onChange }: VolumeSliderProps) {
  return (
    <div className={styles.container}>
      <span className={styles.volume}>{volume}</span>
      <Slider.Root
        className={styles.sliderRoot}
        min={0}
        max={100}
        step={5}
        defaultValue={[volume]}
        onValueCommit={values => {
          onChange(values.at(0) as number);
        }}
      >
        <Slider.Track className={styles.sliderTrack}>
          <Slider.Range className={styles.sliderRange} />
        </Slider.Track>
        <Slider.Thumb className={styles.sliderThumb} aria-label="volume" />
      </Slider.Root>
    </div>
  );
}
