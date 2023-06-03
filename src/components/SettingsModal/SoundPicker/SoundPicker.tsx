import { Select, SelectItem } from '../../ui/Select/Select';
import VolumeSlider from './VolumeSlider/VolumeSlider';

import styles from './SoundPicker.module.css';
import useSound from '../../Pomodoro/useSound';
import { getSoundSrc } from '../../../utils/utils';
import { Sound, sounds } from '../../../utils/constants';

interface SoundPicker {
  currentSound: Sound;
  onSoundChange: (sound: Sound) => void;
  volume: number;
  onVolumeChange: (value: number) => void;
}

export default function SoundPicker({
  currentSound,
  onSoundChange,
  volume,
  onVolumeChange,
}: SoundPicker) {
  const soundsList = Object.keys(sounds);
  const soundSrc = getSoundSrc(currentSound);
  const { play } = useSound(soundSrc, { volume, duration: 500 });

  function handleSoundChange(value: Sound) {
    play(value);
    onSoundChange(value);
  }

  function handleVolumeChange(volume: number) {
    play();
    onVolumeChange(volume);
  }

  return (
    <div className={styles.sound}>
      <div>
        <div className={styles.soundItem}>
          <h3 className="subHeading">Sound</h3>
          <Select
            value={currentSound}
            onValueChange={value => handleSoundChange(value as Sound)}
          >
            {soundsList.map(value => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className={styles.soundItem}>
          <h3 className="subHeading">Volume</h3>
          <VolumeSlider onChange={handleVolumeChange} volume={volume} />
        </div>
      </div>
    </div>
  );
}
