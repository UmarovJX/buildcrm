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

export function discountType() {
    return this.discount.type
}

export function discountAmount() {
    return this.discount.amount
}

export function apartmentArea(index) {
    return this.apartments[index].plan.area
}

export function apartmentPricePerSquare(index) {
    return this.apartments[index].price_m2
}

export function isDiscountOtherType() {
    return this.discount.id === 'other'
}

export function discountPrepay() {
    return this.discount.prepay
}

export function getMonth() {
    return parseInt(this.calc.monthly_payment_period)
}

export function getBasePrice() {
    return this.apartments
        .reduce((a, b) => ({sum: a.sum + b.price}), {sum: 0}).sum
}

export function updateDiscount(discount) {
    this.discount = discount
}

export function updateApartments(apartments) {
    this.apartments = apartments
}

export function calculateTotalPriceByFixed() {
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

export function calculateTotalPriceByPromo() {
    return this.calculateTotalPriceByFixed()
}

export function calculateTotalPriceByAddition() {
    return this.calculateTotalPriceByFixed()
}

export function calculateTotalPriceByDefault() {
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

export function getPrice() {
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

export function getInitialPrice() {
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

export function getMonthlyPaymentAmount() {
    return this.getMonthlyTotalPrice() / this.getMonth()
}

export function getMonthlyTotalPrice() {
    if (this.getMonth()) {
        return this.getTotal() - this.getInitialPrice()
    }
    return 0
}

export function getDiscount() {
    return this.apartments.reduce((acc, apartment) => {
        if (apartment.calc.other_price) {
            return acc
        }
        return acc + apartment.calc.total_discount
    }, 0)
}

export function getTotal() {
    return this.getPrice() - this.getDiscount()
}

export function getRemainPrice() {
    return this.getTotal() - this.getMonthlyTotalPrice()
}

export function updateCheckoutState() {
    this.calc.total = this.getTotal()
    this.calc.monthly_payment = this.getMonthlyPaymentAmount()
    this.calc.initial_price = this.getInitialPrice()
    this.calc.remainder = this.getRemainPrice()
    this.calc.base_price = this.getBasePrice()
}