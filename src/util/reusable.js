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

export function idGenerator() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
        + Math.random().toString(16).slice(2)
        + Date.now().toString(16).slice(4)
}

export function phonePrettier(phoneNumber) {
    const phone = phoneNumber.toString()
    /* 998 90 992 50 44 */
    if (!phone) return
    const leftHandSide = '+' + phone.slice(0, 3)  /* 998 */
    const companyCode = phone.slice(3, 5)        /* 90  */
    const starterNumbers = phone.slice(5, 8)    /* 992 */
    const middleNumbers = phone.slice(8, 10)   /* 50  */
    const endingNumbers = phone.slice(10, 12) /* 44  */
    return `${leftHandSide} ${companyCode} ${starterNumbers} ${middleNumbers} ${endingNumbers}`
}
