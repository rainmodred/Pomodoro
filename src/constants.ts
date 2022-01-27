const sounds = {
  'Analog Alarm': '/Pomodoro/audio/Analog Alarm.mp3',
  Ding: '/Pomodoro/audio/Ding.mp3',
  'Digital Alarm': '/Pomodoro/audio/Digital Alarm.mp3',
};

type Sounds = keyof typeof sounds;
type Colors = '#f67174' | '#75f3f7' | '#d880f5';

const colors: {
  name: string;
  value: Colors;
}[] = [
  { name: 'red', value: '#f67174' },
  { name: 'blue', value: '#75f3f7' },
  { name: 'purple', value: '#d880f5' },
];

export { sounds, colors };
export type { Sounds, Colors };
