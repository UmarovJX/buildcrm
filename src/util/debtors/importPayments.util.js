export const paymentTypes = {
  initial_payment: '1 взнос',
  monthly: 'ежемесячный',
  // booked: "бронирован",
  // for_partition_wall: "за перегородку",
  // advertising: "реклама",
  // return_flat: "к,айтариш кв.",
  // non_residential: "Нежилой",
  // charity: "хайрия",
}

export const paymentMethods = {
  transfer: 'перечисление',
  cash: 'наличный',
  // recalculation: "Перерасчет",
  // client_khurshidaka: "К Хуршидака",
}

export function hasInPaymentTypes(type) {
  return checkType(paymentTypes, type)
}

export function hasInPaymentMethods(type) {
  return checkType(paymentMethods, type)
}

export function checkType(typesList, type) {
  for (const [k, v] of Object.entries(typesList)) {
    if (k === type && v === type) {
      return true
    }
  }

  return false
}
