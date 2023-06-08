export function localStorageGetItem(property) {
  const item = localStorage.getItem(property);
  if (item && item !== "undefined") {
    return JSON.parse(item);
  }
  return undefined;
}

export function localStorageSetItem(property, value) {
  localStorage.setItem(property, JSON.stringify(value));
}

export function sessionStorageGetItem(property) {
  const item = sessionStorage.getItem(property);
  if (item && item !== "undefined") {
    return JSON.parse(item);
  }
  return undefined;
}

export function sessionStorageSetItem(property, value) {
  sessionStorage.setItem(property, JSON.stringify(value));
}
