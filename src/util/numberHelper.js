export function numberFormatDecimal(value, decimal = 2) {
    return parseFloat(value.toFixed(decimal))
}