import {dateProperties} from "@/util/calendar";

const {ymd, nextMonthYmd} = dateProperties('', 'string')

const schema = {
    calc: {
        price: 0,
        price_m2: 0,
        plan: {},
        area: 0,
        total_discount: 0,
        discount_per_m2: 0,
        prepay: 0,
        monthly_payment_period: 20,
        first_payment_date: ymd,
        payment_date: nextMonthYmd,
        monthly_payment: 0,
        discount: null,
        contract_date: ymd,
        base_price: 0,
        initial_price: 0,
        remainder: 0,
        total: 0,
        other_price: false,
        credit_months: [],
        initial_payments: [],
        other: {
            price_m2: 0,
            starting_price: 0,
        }
    },
    edit: {
        initial_price: false,
        monthly_payment_period: false,
        prepay: false,
        discount: false,
        monthly: false,
        contract_number: false,
        first_attempt: false
    },
    otherDiscount: {
        value: 'other',
        type: 'percent',
        currency: null,
        amount: 0,
        id: 'other',
        prepay: 30
    },
    client: {legal_entity: {}},
    validate: {
        changed: false,
        dirty: true,
        failed: false,
        invalid: false,
        passed: false,
        pending: false,
        pristine: false,
        required: false,
        touched: false,
        untouched: true,
        valid: true,
        validated: false,
    },
}

export default {
    schema,
    countryList: [],
    clientTypeList: [],
    apartments: [],
    created_by: null,
    contract_number: null,
    expiry_at: null,
    uuid: null,
    order: {},
    comment: '',
    trashStorage: [],
    clientData: {},
    componentFunction: 'create',
    functionTypesList: {
        0: 'create',
        1: 'update'
    }
}