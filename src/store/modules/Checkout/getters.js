export default {
  discountType: state => state.discount.type,
  discountAmount: state => state.discount.amount,
  apartmentArea: state => index => state.apartments[index].plan.area,
  apartmentPricePerSquare: state => index => state.apartments[index].price_m2,
  isDiscountOtherType: state => state.discount.id === 'other',
  getPrepay: state => state.calc.prepay,
  getMonth: state => state.calc.monthly_payment_period,
  getBasePrice: state => state.apartments.reduce((a, b) => a + b.price, 0),
  getInitialPayments: state => state.initial_payments,
  getCreditMonths: state => state.credit_months,
  getMonthlyEdit: (state, getters) => getters.getCreditMonths.filter(monthly => monthly.edit),
  getInitialEdit: (state, getters) => getters.getInitialPayments.filter(monthly => monthly.edit),
  initiallyTotal: (state, getters) => getters.getInitialPayments.reduce((a, b) => a + b.amount, 0),
  creditMonthTotal: (state, getters) => getters.getCreditMonths.reduce((a, b) => a + b.amount, 0),
  getMonthlyEditTotalPrice: (state, getters) => getters.getMonthlyEdit.reduce((a, b) => a + b.amount, 0),
  getInitialEditTotalPrice: (state, getters) => getters.getInitialEdit.reduce((a, b) => a + b.amount, 0),
  uneditedInitial: (state, getters) => getters.getInitialPayments.filter(inMonth => !inMonth.edit),
  uneditedMonthly: (state, getters) => getters.getCreditMonths.filter(crMonth => !crMonth.edit),
  calculateTotalPriceByFixed: (state, getters) => state.apartments.reduce((a, b, index) => {
    if (getters.isDiscountOtherType) {
      return a + b.calc.price
    }
    return a + getters.discountAmount * getters.apartmentArea(index)
  }, 0),
  calculateTotalPriceByPromo: (state, getters) => getters.calculateTotalPriceByFixed,
  calculateTotalPriceByAddition: (state, getters) => getters.calculateTotalPriceByFixed,
  calculateTotalPriceByDefault: (state, getters) => {
    if (getters.getPrepay === 100) {
      return state.apartments.reduce(
        (a, b) => {
          if (getters.isDiscountOtherType) {
            return {
              sum: a.sum + b.calc.price,
            }
          }
          return {
            sum: a.sum + b.price,
          }
        },
        { sum: 0 },
      ).sum
    }
    if (getters.isDiscountOtherType) {
      return state.apartments.reduce((a, b) => a + b.calc.price, 0)
    }
    return state.apartments.reduce((a, b) => a + b.price * (1 + getters.discountAmount / 100), 0)
  },
  getPrice: (state, getters) => {
    switch (getters.discountType) {
      case 'fixed': {
        return getters.calculateTotalPriceByFixed
      }
      case 'promo': {
        return getters.calculateTotalPriceByPromo
      }
      case 'addition': {
        return getters.calculateTotalPriceByAddition
      }
      case 'other': {
        return getters.calculateTotalPriceByDefault
      }
      case 'percent': {
        return getters.calculateTotalPriceByDefault
      }
      default: {
        return getters.calculateTotalPriceByDefault
      }
    }
  },
  getInitialPrice: (state, getters) => {
    if (state.edit.initial_price) {
      if (state.calc.initial_price.toString() === '') {
        return 0
      }
      return state.calc.initial_price
    }

    if (!getters.getMonth) {
      return getters.getTotal
    }

    switch (getters.discountType) {
      case 'fixed':
      case 'promo':
      case 'addition': {
        return (
          (getters.calculateTotalPriceByFixed * getters.getPrepay) / 100
          - getters.getDiscount
        )
      }
      case 'other': {
        return getters.calculateTotalPriceByDefault - getters.getDiscount
      }
      case 'percent': {
        return (
          (getters.calculateTotalPriceByDefault * getters.getPrepay) / 100
          - getters.getDiscount
        )
      }
      default: {
        return (
          (getters.calculateTotalPriceByDefault * getters.discountAmount)
            / 100
          - getters.getDiscount
        )
      }
    }
  },
  getMonthlyTotalPrice: (state, getters) => {
    if (getters.getMonth) {
      return getters.getTotal - getters.getInitialPrice
    }
    return 0
  },
  getMonthlyPaymentAmount: (state, getters) => {
    if (getters.getPrepay === 100) {
      return 0
    }
    return getters.getMonthlyTotalPrice / getters.getMonth
  },
  getDiscount: (state, getters) => {
    if (getters.isDiscountOtherType) {
      return 0
    }
    return state.apartments.reduce((acc, apartment) => acc + apartment.calc.total_discount, 0)
  },
  getRemainPrice: (state, getters) => {
    if (getters.getPrepay === 100) {
      return 0
    }
    return getters.getTotal - getters.getInitialPrice
  },
  getTotal: (state, getters) => getters.getPrice - getters.getDiscount,
}
