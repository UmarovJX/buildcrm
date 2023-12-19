export default class DummyPassword {
  constructor() {
    this.LOWER = 'abcdefghijklmnopqrstuvwxyz'
    this.UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    this.DIGITS = '1234567890'
    this.SYMBOLS = '!#%&?+*_.,:;'
    this.maxLength = 50
    this.minLength = 1
  }

  create(length, characters) {
    let countLowercase = 0
    const _length = this.adjustLengthWithinLimits(length)
    const _characters = this.secureCharacterCombination(characters)

    const generatedPassword = this.shufflePassword(
      this.assemblePassword(_characters, _length),
    )

    generatedPassword.split('').map(item => {
      if (
        item === item.toLowerCase()
        && !(item.toLowerCase() === item.toUpperCase())
      ) {
        countLowercase++
      }
    })

    if (countLowercase > 0) {
      return generatedPassword
    }
    return this.shufflePassword(this.assemblePassword(_characters, _length))
  }

  adjustLengthWithinLimits(length) {
    if (!length || length < this.minLength) return this.minLength
    if (length > this.maxLength) return this.maxLength
    return length
  }

  secureCharacterCombination(characters) {
    const defaultCharacters = this.LOWER + this.UPPER + this.DIGITS

    if (!characters || this.trim(characters) == '') return defaultCharacters
    if (
      !this.containsAtLeast(characters, [
        this.LOWER,
        this.UPPER,
        this.DIGITS,
        this.SYMBOLS,
      ])
    ) return defaultCharacters
    return characters
  }

  assemblePassword(characters, length) {
    const randMax = this.DIGITS.length
    const randMin = randMax - 4
    let index = this.random(0, characters.length - 1)
    let password = ''

    for (let i = 0; i < length; i++) {
      const jump = this.random(randMin, randMax)
      index = index + jump > characters.length - 1
        ? this.random(0, characters.length - 1)
        : index + jump
      password += characters[index]
    }

    return password
  }

  shufflePassword(password) {
    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('')
  }

  containsAtLeast(string, strings) {
    for (let i = 0; i < strings.length; i++) {
      if (string.indexOf(strings[i]) != -1) return true
    }
    return false
  }

  random(min, max) {
    return Math.floor(Math.random() * max + min)
  }

  trim(s) {
    if (typeof String.prototype.trim !== 'function') return s.replace(/^\s+|\s+$/g, '')
    return s.trim()
  }
}
