export function addMonth(date, months) {
    // Create a new date object
    let newDate = new Date(date);
    // Add one month
    newDate.setMonth(newDate.getMonth() + months);

    // Check if the month overflowed and adjust the date to the last day of the month if needed
    if (newDate.getDate() < date.getDate()) {
        newDate.setDate(0);
    }

    return newDate;
}

export function getFullMonthDifference(startDate, endDate) {
    // Ensure that the startDate is earlier than the endDate
    if (startDate > endDate) {
        [startDate, endDate] = [endDate, startDate];
    }

    // Extract the year and month from both dates
    let startYear = startDate.getFullYear();
    let startMonth = startDate.getMonth();
    let endYear = endDate.getFullYear();
    let endMonth = endDate.getMonth();

    // Calculate the difference in years and months
    let yearDifference = endYear - startYear;
    let monthDifference = endMonth - startMonth;

    // Total months difference
    let totalMonths = (yearDifference * 12) + monthDifference;

    // Adjust if the end date's day is less than the start date's day
    if (endDate.getDate() < startDate.getDate()) {
        totalMonths -= 1;
    }

    return totalMonths;
}

export function dateForPicker(date) {
    return date.toISOString()
        .slice(0, 10)
}
export function keyGen() {
    let timestamp = Date.now().toString(36); // Base-36 timestamp
    let randomNum = Math.random().toString(36).substring(2, 10); // Base-36 random number
    return `${timestamp}-${randomNum}`;
}