export function formatToPrice(rawPrice) {
    const dollarUSLocale = Intl.NumberFormat('en-US')
    const price = dollarUSLocale.format(parseInt(rawPrice))
    return price.toLocaleString().replace(/,/g, '  ')
}