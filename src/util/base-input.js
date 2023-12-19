import accounting from 'accounting-js'

const isDotSymbol = symbol => symbol === '.'
const isCommaSymbol = symbol => symbol === ','
const isGapSymbol = symbol => symbol === ' '

function isSatisfySeparator(symbol) {
  return isGapSymbol(symbol) || isCommaSymbol(symbol) || isDotSymbol(symbol)
}

export const isNumberSymbol = symbol => !isNaN(parseInt(symbol))
export const splitString = value => value.toString().split('')

export function isSatisfyInput(symbol) {
  return isNumberSymbol(symbol) || isSatisfySeparator(symbol)
}

export function formatByConfiguration(
  array,
  { decimalSeparator, thousandSeparator },
) {
  let thousandIndex = array.findIndex(value => isSatisfySeparator(value))
  let thousandValue = array[thousandIndex]
  let decimalIndex = array.findIndex(value => value !== thousandValue && isSatisfySeparator(value))

  if (decimalIndex === -1 && thousandSeparator !== thousandValue) {
    decimalIndex = thousandIndex
    thousandIndex = null
    thousandValue = thousandSeparator
  }

  const decimalValue = array[decimalIndex]
  if (decimalIndex !== -1) {
    const loopPackage = []
    for (let i = decimalIndex + 1; i < array.length; i++) {
      const loopValue = array[i]
      if (!(loopValue === decimalValue || loopValue === thousandValue)) {
        loopPackage.push(loopValue)
      }
    }
    const removeCount = array.length - decimalIndex + 1
    array.splice(decimalIndex + 1, removeCount, ...loopPackage)
  }

  let decimalSide = ''
  let thousandSide = ''
  if (decimalIndex !== -1) {
    decimalSide = array.slice(decimalIndex + 1).join('')
    thousandSide = array
      .slice(0, decimalIndex)
      .join('')
      .replaceAll(thousandValue, '')
    thousandSide.replace(' ', '')
  } else {
    thousandSide = array.slice(0).join('').replaceAll(thousandValue, '')
  }

  let result = accounting.formatNumber(thousandSide, {
    precision: 0,
    thousand: thousandSeparator,
    separator: decimalSeparator,
  })

  if (decimalValue) {
    result += decimalSeparator
    if (decimalSide.length) {
      result += decimalSide.replace('.', '')
    }
  }

  return {
    formatVersion: result,
    baseVersion: `${thousandSide}.${decimalSide}`,
  }
}

export function removeExcessDotAndComma(array, givenType = 'string') {
  const hasDotOrComma = array.some(arr => arr === '.' || arr === ',')
  if (!hasDotOrComma) {
    return array
  }

  const remover = list => list.filter((value, index) => {
    const previousArr = array.slice(index - 1, index)
    const isComma = value === ','
    const isDot = value === '.'
    if (isComma) {
      const hasBefore = previousArr.includes(value)
      return !hasBefore
    } if (isDot) {
      const hasBefore = previousArr.includes(value)
      return !hasBefore
    }
    return true
  })

  if (givenType === 'array') {
    return remover(array)
  }

  return remover(array).join('')
}
