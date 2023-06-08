const CryptoJS = require("crypto-js");

const secret = "secret";
export const encrypt = (data) => {
  if (data != null) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
  }
  return null;
};

export const decrypt = (ciphertext) => {
  try {
    if (ciphertext != null && ciphertext !== "null") {
      let bytes = CryptoJS.AES.decrypt(ciphertext.toString(), secret);
      let decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const setLocalVar = (key, value) => {
  return localStorage.setItem(key, value);
};

export const getLocalVar = (key) => {
  return localStorage.getItem(key);
};

export const removeLocalVar = (key) => {
  return localStorage.removeItem(key);
};

export const setSessionVar = (key, value) => {
  return sessionStorage.setItem(key, value);
};

export const getSessionVar = (key) => {
  return sessionStorage.getItem(key);
};
