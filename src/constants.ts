const sounds = {
  'Analog Alarm': './audio/Analog Alarm.mp3',
  Ding: './audio/Ding.mp3',
  'Digital Alarm': './audio/Digital Alarm.mp3',
};

type Sound = keyof typeof sounds;

const defaultColors = [
  { name: 'red', hex: '#f67174' },
  { name: 'blue', hex: '#75f3f7' },
  { name: 'purple', hex: '#d880f5' },
] as const;

type Color = typeof defaultColors[number];
type ColorName = typeof defaultColors[number]['name'];
type Hex = typeof defaultColors[number]['hex'];

export { sounds, defaultColors };
export type { Sound, Color, ColorName, Hex };
