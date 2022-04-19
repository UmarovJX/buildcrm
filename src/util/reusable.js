export function formatToPrice(rawPrice) {
    if (!rawPrice) return 0
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

export function getDateProperty(rawDate) {
    const date = new Date(rawDate)
    const year = date.getFullYear()
    const baseMonth = date.getMonth() + 1
    const month = baseMonth < 10 ? `0${baseMonth}` : baseMonth
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    return {year, month, day}
}

export function idGenerator() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
        + Math.random().toString(16).slice(2)
        + Date.now().toString(16).slice(4)
}

export function phonePrettier(phoneNumber) {
    if (phoneNumber) {
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

    return ''
}

export function debounce(fn, delay) {
    let timeoutID = null
    return function () {
        clearTimeout(timeoutID)
        let args = arguments
        let that = this
        timeoutID = setTimeout(function () {
            fn.apply(that, args)
        }, delay)
    }
}

export function sortObjectValues(obj) {
    const loopPackage = {}
    for (let [key, value] of Object.entries(obj)) {
        if (value) {
            loopPackage[key] = value
        }
    }
    return loopPackage
}

/* SORT OBJECT IN FIRST RELATIONSHIP */
export function sortInFirstRelationship(obj) {
    const loopPackage = {}
    for (let [key, value] of Object.entries(obj)) {
        if (Array.isArray(value) && value.length > 0) {
            loopPackage[key] = value
            continue
        }

        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            loopPackage[key] = value
            continue
        }

        const types = ['number', 'string', 'boolean', 'symbol']
        const typeOfValue = typeof value
        const haveInTypes = types.some(type => type === typeOfValue)
        if (haveInTypes) {
            /* REJECT VALUE WHEN ZERO */
            const rejectZeroString = typeOfValue === 'string' && value !== '0'
            const rejectZeroNumber = typeOfValue === 'number' && value !== 0
            if (rejectZeroString || rejectZeroNumber) {
                loopPackage[key] = value
            }
        }
    }
    return loopPackage
}
