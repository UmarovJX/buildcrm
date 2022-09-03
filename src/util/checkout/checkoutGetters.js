export default class CheckoutGetters {
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
        this.apartments = apartments
        this.calc = context.calc
        this.discount = context.discount
        this.month = context.month
        this.createdBy = context.created_by
        this.contractNumber = context.contract_number
        this.expiryAt = context.expiry_at
        this.uuid = context.uuid
    }

    discountType() {
        return this.discount.type
    }

    discountAmount() {
        return this.discount.amount
    }

    apartmentArea(index) {
        return this.apartments[index].plan.area
    }

    apartmentPricePerSquare(index) {
        return this.apartments[index].price_m2
    }

    isDiscountOtherType() {
        return this.discount.id === 'other'
    }

    discountPrepay() {
        return this.discount.prepay
    }

    getMonth() {
        return parseInt(this.calc.monthly_payment_period)
    }

    getBasePrice() {
        return this.apartments
            .reduce((a, b) => ({sum: a.sum + b.price}), {sum: 0}).sum
    }

    updateDiscount(discount) {
        this.discount = discount
    }

    updateApartments(apartments) {
        this.apartments = apartments
    }
}