const CryptoJS = require('crypto-js')

const secret = 'secret'
export const encrypt = data => {
  if (data != null) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString()
  }
  return null
}

export const decrypt = ciphertext => {
  try {
    if (ciphertext != null && ciphertext !== 'null') {
      const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), secret)
      const decrypted = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(decrypted)
    }
    return null
  } catch (e) {
    return null
  }
}

export const setLocalVar = (key, value) => localStorage.setItem(key, value)

export const getLocalVar = key => localStorage.getItem(key)

export const removeLocalVar = key => localStorage.removeItem(key)

export const setSessionVar = (key, value) => sessionStorage.setItem(key, value)

export const getSessionVar = key => sessionStorage.getItem(key)
