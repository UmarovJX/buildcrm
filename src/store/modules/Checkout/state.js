export default {
    apartments: [],
    discount: {
        id: null,
        prepay: null
    },
    month: 0,
    created_by: null,
    contract_number: null,
    expiry_at: null,
    uuid: null,
    order: {},
    calc: {
        prepay: 0,
        monthly_payment_period: 20,
        first_payment_date: null,
        payment_date: null,
        monthly_payment: 0,
        discount: null,
        contract_date: null,
        base_price: 0,
        initial_price: 0,
        remainder: 0,
        total: 0,
        other_price: false,
        total_discount: 0
    },
    /*
    * {
    *   amount: Number
    *   index: Number,
    *   date: Date,
    *   edited: Boolean
    * }
    * */
    comment: '',
    credit_months: [],
    initial_payments: [],
    edit: {
        initial_price: false,
        monthly_payment_period: false,
        prepay: false,
        discount: false
    },
    trashStorage: []
}