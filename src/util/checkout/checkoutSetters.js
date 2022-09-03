import CheckoutTotal from "@/util/checkout/checkoutTotal";

export default class CheckoutSetters extends CheckoutTotal {
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

    updateCheckoutState() {
        this.calc.total = this.getTotal()
        this.calc.monthly_payment = this.getMonthlyPaymentAmount()
        this.calc.initial_price = this.getInitialPrice()
        this.calc.remainder = this.getRemainPrice()
        this.calc.base_price = this.getBasePrice()
    }
}