import React from 'react';

export default function SoundPicker() {
  const soundsList = Object.keys(sounds);

  return (
    <div className={styles.sound}>
      <div>
        <div className={styles.soundItem}>
          <span className={styles.subHeading}>Sound</span>
          <Select
            value={currentSound}
            onValueChange={value => handleSoundChange(value)}
          >
            {soundsList.map(value => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className={styles.soundItem}>
          <span className={styles.subHeading}>Volume</span>
          <VolumeSlider onChange={handleVolumeChange} volume={volume} />
        </div>
      </div>
    </div>
  );
}
