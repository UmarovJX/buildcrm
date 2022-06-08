export const monthsNameList = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
]

export const weekDaysNameList = []

export function getDaysInMonth(date) {
    const currentDate = new Date(date)
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    return new Date(year, month, 0).getDate()
}

export function dateConvertor(date) {
    return new Date(date)
}

export function dateProperties(date) {
    const time = date.getTime()
    const dayOfWeek = date.getDay()
    const dayOfMonth = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    const ymd = formatDateToYMD(date)
    const starter = formatDateToYMD(new Date(year, month, 1))
    return {
        time, dayOfWeek, dayOfMonth, month, year, ymd, starter
    }
}

export function formatDateToYMD(date) {
    let d = date.getDate()
    let m = date.getMonth() + 1
    let y = date.getFullYear()
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d)
}