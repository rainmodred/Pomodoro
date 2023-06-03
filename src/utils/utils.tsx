function getFromStorage(key: string) {
  const data = window.localStorage.getItem(key);
  if (!data) {
    return null;
  }
  return JSON.parse(data);
}

function setToStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function timeToMinSec(time: number) {
  const minutesNumber = Math.floor(time / 60);
  const secondsNumber = time % 60;

  const minutes =
    minutesNumber < 10 ? `0${minutesNumber}` : minutesNumber.toString();
  const seconds =
    secondsNumber < 10 ? `0${secondsNumber}` : secondsNumber.toString();

  return {
    minutes,
    seconds,
  };
}

function convertToSeconds(time: number) {
  return time * 60;
}

function sendNotification() {
  if (window.Notification && Notification.permission !== 'denied') {
    new Notification('Pomodoro', {
      body: 'Your time is up!',
      silent: true,
    });
  }
}

export {
  getFromStorage,
  setToStorage,
  timeToMinSec,
  convertToSeconds,
  sendNotification,
};
