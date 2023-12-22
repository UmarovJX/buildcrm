export function numberFormatDecimal(value, decimal = 2) {
  return parseFloat(value.toFixed(decimal))
}

export function abbreviateNumber(x) {
  const abbrs = {
    M: 'mln',
    B: 'mlrd',
    T: 'trln',
  }

  const inputString = Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(x)

  const pattern = new RegExp(`([0-9.]+)([${Object.keys(abbrs).join('')}])`, 'g')

  // Replace the matched symbols with their corresponding values
  return inputString.replace(pattern, (match, number, symbol) => {
    const multiplier = abbrs[symbol]
    return `${number} ${multiplier}`
  })
}
