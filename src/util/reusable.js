export function formatToPrice(rawPrice) {
    const dollarUSLocale = Intl.NumberFormat('en-US')
    const price = dollarUSLocale.format(parseInt(rawPrice))
    return price.toLocaleString().replace(/,/g, '  ')
}

export function formatDateWithDot(rawDate) {
    const date = new Date(rawDate)
    const year = date.getFullYear()
    const baseMonth = date.getMonth() + 1
    const month = baseMonth < 10 ? `0${baseMonth}` : baseMonth
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    return `${day}.${month}.${year}`
}
