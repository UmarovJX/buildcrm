import { isString } from "@/util/inspect";
export const monthsNameList = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
export const weekDaysNameList = [];

export function getDaysInMonth(date) {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  return new Date(year, month, 0).getDate();
}

export function dateConvertor(date) {
  return new Date(date);
}

export function dateProperties(point, type = "date") {
  let date;
  if (type === "date") {
    date = point;
  } else if (type === "string") {
    const undefinedState = [null, undefined, ""];
    if (undefinedState.includes(point)) {
      date = new Date();
    } else {
      date = new Date(point);
    }
  }

  const time = date.getTime();
  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const ymd = formatDateToYMD(date);
  const starter = formatDateToYMD(new Date(year, month, 1));
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const lastDateOfMonth = lastDayOfMonth.getDate();
  const isLastDayOfMonth = lastDateOfMonth === dayOfMonth;
  const nextMonthOfDate = new Date(date).setMonth(date.getMonth() + 1);
  const nextMonthYmd = formatDateToYMD(new Date(nextMonthOfDate));
  return {
    ymd,
    year,
    time,
    month,
    starter,
    dayOfWeek,
    dayOfMonth,
    nextMonthYmd,
    lastDayOfMonth,
    lastDateOfMonth,
    nextMonthOfDate,
    isLastDayOfMonth,
  };
}

export function formatDateToYMD(date = new Date()) {
  if (isString(date)) {
    date = new Date(date);
  }
  let d = date.getDate();
  let m = date.getMonth() + 1;
  let y = date.getFullYear();
  return "" + y + "-" + (m <= 9 ? "0" + m : m) + "-" + (d <= 9 ? "0" + d : d);
}
