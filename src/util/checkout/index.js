import { hasOwnProperty } from "@/util/object";
import { isNumber } from "@/util/inspect";

export function setAppropriateCreditMonth(state, apm, discount) {
  let creditMonth;

  const hasCreditMonth = hasOwnProperty(apm.object, "credit_month");

  if (hasCreditMonth && isNumber(apm.object.credit_month)) {
    creditMonth = apm.object.credit_month;
  } else {
    creditMonth = state.schema.calc.monthly_payment_period;
  }

  if (discount.prepay === 100) {
    creditMonth = 0;
  }

  return creditMonth;
}

export function calculateInstallments(totalAmount, numMonths) {
  const monthlyPayment = totalAmount / numMonths;
  const roundedMonthlyPayment = Math.round(monthlyPayment);
  const remainingBalance = totalAmount - (roundedMonthlyPayment * numMonths);
  const adjustedMonthlyPayment = roundedMonthlyPayment + Math.ceil(remainingBalance / numMonths);
  const lastMonthPayment = totalAmount - (adjustedMonthlyPayment * (numMonths - 1));
  return { adjustedMonthlyPayment, lastMonthPayment };
}
