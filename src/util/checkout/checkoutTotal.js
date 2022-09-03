import CheckoutGetters from "@/util/checkout/checkoutGetters";

export default class CheckoutTotal extends CheckoutGetters {
    /**
     *   CONSTRUCTOR   *
     apartments : [],
     discount : {},
     month: 0,
     createdBy : Date,
     contractNumber : String,
     expiryAt : String,
     uuid : String,
     calc : {
      prepayment: null,
      monthly_payment_period: 20,
      initial_price: 0,
      first_payment_date: null,
      payment_date: null,
      total: 0,
      monthly_payment: 0,
      remainder: 0,
      base_price: 0
    }
     *
     **/

    constructor(apartments, context) {
        super(apartments, context)
    }

    calculateTotalPriceByFixed() {
        if (this.isDiscountOtherType()) {
            return 0
        }
        return this.apartments
            .reduce((a, b, index) => {
                if (b.calc.other_price) {
                    return {
                        sum: a.sum + b.calc.price
                    }
                }
                return {
                    sum: a.sum + this.discountAmount() * this.apartmentArea(index)
                }
            }, {sum: 0}).sum
    }

    calculateTotalPriceByPromo() {
        return this.calculateTotalPriceByFixed()
    }

    calculateTotalPriceByAddition() {
        return this.calculateTotalPriceByFixed()
    }

    calculateTotalPriceByDefault() {
        if (this.discount.prepay === 100) {
            return this.apartments
                .reduce((a, b) => {
                    if (b.calc.other_price) {
                        return {
                            sum: a.sum + b.calc.price
                        }
                    }
                    return {
                        sum: a.sum + b.price
                    }
                }, {sum: 0}).sum
        } else {
            if (this.isDiscountOtherType()) {
                return this.apartments
                    .reduce((a, b, index) => {
                        if (b.calc.other_price) {
                            return {
                                sum: a.sum + b.calc.price
                            }
                        }
                        return {
                            sum: a.sum + this.apartmentPricePerSquare(index) * this.apartmentArea(index)
                        }
                    }, {sum: 0}).sum
            }
            return this.apartments.reduce((a, b) => {
                if (b.calc.other_price) {
                    return {
                        sum: a.sum + b.calc.price
                    }
                }
                return {
                    sum: a.sum + b.price * (1 + this.discountAmount() / 100)
                }
            }, {sum: 0}).sum
        }
    }

    getPrice() {
        switch (this.discountType()) {
            case 'fixed': {
                return this.calculateTotalPriceByFixed()
            }
            case 'promo': {
                return this.calculateTotalPriceByPromo()
            }
            case 'addition': {
                return this.calculateTotalPriceByAddition()
            }
            case 'other': {
                return this.calculateTotalPriceByDefault()
            }
            case 'percent': {
                return this.calculateTotalPriceByDefault()
            }
            default: {
                return this.calculateTotalPriceByDefault()
            }
        }
    }

    getInitialPrice() {
        switch (this.discountType()) {
            case 'fixed': {
                return this.calculateTotalPriceByFixed() * this.discountPrepay()
            }
            case 'promo': {
                return this.calculateTotalPriceByPromo() * this.discountPrepay()
            }
            case 'addition': {
                return this.calculateTotalPriceByAddition() * this.discountPrepay()
            }
            case 'other': {
                return this.calculateTotalPriceByDefault()
            }
            case 'percent': {
                return this.calculateTotalPriceByDefault() * this.discountAmount() / 100
            }
            default: {
                return this.calculateTotalPriceByDefault() * this.discountAmount() / 100
            }
        }
    }

    getMonthlyPaymentAmount() {
        return this.getMonthlyTotalPrice() / this.getMonth()
    }

    getMonthlyTotalPrice() {
        if (this.getMonth()) {
            return this.getTotal() - this.getInitialPrice()
        }
        return 0
    }

    getDiscount() {
        return this.apartments.reduce((acc, apartment) => {
            if (apartment.calc.other_price) {
                return acc
            }
            return acc + apartment.calc.total_discount
        }, 0)
    }

    getTotal() {
        return this.getPrice() - this.getDiscount()
    }

    getRemainPrice() {
        return this.getTotal() - this.getMonthlyTotalPrice()
    }
}