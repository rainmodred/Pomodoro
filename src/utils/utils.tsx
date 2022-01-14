function getFromStrorage(key: string) {
  const data = window.localStorage.getItem(key);
  if (!data) {
    return null;
  }
  return JSON.parse(data);
}

function setToStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export { getFromStrorage, setToStorage };
