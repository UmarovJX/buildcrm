import {isString, isUndefinedOrNullOrEmpty} from "@/util/inspect";
import {numberFormatDecimal as fmd} from "@/util/numberHelper";

export default {
    isCreateMode: (state) => state.componentFunction === 'create',
    isUpdateMode: (state) => state.componentFunction === 'update',
    getUpdateStatus: (state, gts) => {
        if (gts.apartmentsLength) {
            return gts.isUpdateMode && state.apartments[0]?.status
        }
        return false
    },
    gtsEditFirstAttempt: (state, gts) => {
        if (gts.apartmentsLength) {
            return gts.isUpdateMode && state.apartments[0]?.edit?.first_attempt
        }
        return false
    },
    trashCount: (state) => state.trashStorage.length,
    gtsApartments: (state) => state.apartments,
    apartmentsLength: (state) => state.apartments.length,
    getApm: (state, gts) => ({idx = undefined, uuid = undefined}) => {
        if (isUndefinedOrNullOrEmpty(idx)) {
            if (isUndefinedOrNullOrEmpty(uuid)) {
                return state.apartments[0]
            }
            return gts.findApm(uuid)
        }
        return state.apartments[idx]
    },
    findApm: (state) => (idx) => state.apartments.find(apn => apn.id === idx),
    findApmIdx: (state) => (id) => state.apartments.findIndex(apn => apn.id === id),
    discountType: (state, gts) => (idx) => gts.getApm({idx}).calc.discount.type,
    discountAmount: (state, gts) => (idx) => gts.getApm({idx}).calc.discount.amount,
    apartmentArea: (state, gts) => (idx) => gts.getApm({idx}).plan.area,
    apartmentPricePerSquare: (state, gts) => (idx) => gts.getApm({idx}).price_m2,
    isDiscountOtherType: (state, gts) => (idx) => gts.getApm({idx}).calc.discount.id === 'other',
    getPrepay: (state, gts) => (idx) => gts.getApm({idx}).calc.prepay,
    getMonth: (state, gts) => (idx) => gts.getApm({idx}).calc.monthly_payment_period,
    discount: (state, gts) => ({idx, discountId}) => {
        if (isString(discountId) && discountId === 'other') {
            return state.schema.otherDiscount
        }
        return gts.getApm({idx}).discounts.find(dsc => dsc.id === discountId)
    },
    getBasePrice: (state, gts) => (idx) => gts.getApm({idx}).price,
    getInitialPayments: (state, gts) => (idx) => gts.getApm({idx}).calc.initial_payments,
    getCreditMonths: (state, gts) => (idx) => gts.getApm({idx}).calc.credit_months,
    getMonthlyEdit: (state, gts) => (idx) => gts.getCreditMonths(idx).filter(monthly => monthly.edit),
    getInitialEdit: (state, gts) => (idx) => gts.getInitialPayments(idx).filter(monthly => monthly.edit),
    initiallyTotal: (state, gts) => (idx) => gts.getInitialPayments(idx).reduce((a, b) => a + b.amount, 0),
    creditMonthTotal: (state, gts) => (idx) => gts.getCreditMonths(idx).reduce((a, b) => a + b.amount, 0),
    getMonthlyEditTotalPrice: (state, gts) => (idx) => gts.getMonthlyEdit(idx).reduce((a, b) => a + b.amount, 0),
    getInitialEditTotalPrice: (state, gts) => (idx) => gts.getInitialEdit(idx).reduce((a, b) => a + b.amount, 0),
    uneditedInitial: (state, gts) => (idx) => gts.getInitialPayments(idx).filter(inMonth => !inMonth.edit),
    uneditedMonthly: (state, gts) => (idx) => gts.getCreditMonths(idx).filter(crMonth => !crMonth.edit),
    calculateTotalPriceByFixed: (state, gts) => (idx) => {
        if (gts.isDiscountOtherType(idx)) {
            return gts.getApm({idx}).calc.price
        }
        return gts.discountAmount(idx) * gts.apartmentArea(idx)

    },
    calculateTotalPriceByPromo: (state, gts) => (idx) => gts.calculateTotalPriceByFixed(idx),
    calculateTotalPriceByAddition: (state, gts) => (idx) => gts.calculateTotalPriceByFixed(idx),
    calculateTotalPriceByDefault: (state, gts) => (idx) => {
        const apartment = gts.getApm({idx})
        if (gts.getPrepay(idx) === 100) {
            if (gts.isDiscountOtherType(idx)) {
                return apartment.calc.price
            }
            return apartment.price
        } else {
            if (gts.isDiscountOtherType(idx)) {
                return apartment.calc.other.starting_price
            }
            return apartment.price * (1 + gts.discountAmount(idx) / 100)
        }
    },
    getPrice: (state, gts) => (idx) => {
        switch (gts.discountType(idx)) {
            case 'fixed': {
                return gts.calculateTotalPriceByFixed(idx)
            }
            case 'promo': {
                return gts.calculateTotalPriceByPromo(idx)
            }
            case 'addition': {
                return gts.calculateTotalPriceByAddition(idx)
            }
            case 'other': {
                return gts.calculateTotalPriceByDefault(idx)
            }
            case 'percent': {
                return gts.calculateTotalPriceByDefault(idx)
            }
            default: {
                return gts.calculateTotalPriceByDefault(idx)
            }
        }
    },
    getInitialPrice: (state, gts) => (idx) => {
        const apartment = gts.getApm({idx})

        if (apartment.edit.initial_price && gts.getMonth(idx)) {
            if (apartment.calc.initial_price.toString() === '') {
                return 0
            }
            // return apartment.calc.initial_price
        }

        if (apartment.calc.prepay === 0) {
            return 0
        }

        if (!gts.getMonth(idx)) {
            return gts.getTotal(idx)
        }

        switch (gts.discountType(idx)) {
            case 'fixed':
            case 'promo':
            case 'addition': {
                // return gts.calculateTotalPriceByFixed(idx) * gts.getPrepay(idx) / 100 - gts.getDiscount(idx)
                return gts.getTotal(idx) * gts.getPrepay(idx) / 100
            }
            case 'other': {
                // return gts.calculateTotalPriceByDefault(idx) - gts.getDiscount(idx)
                return gts.getTotal(idx)
            }
            case 'percent': {
                // return gts.calculateTotalPriceByDefault(idx) * gts.getPrepay(idx) / 100 - gts.getDiscount(idx)
                return gts.getTotal(idx) * gts.getPrepay(idx) / 100
            }
            default: {
                // return gts.calculateTotalPriceByDefault(idx) * gts.discountAmount(idx) / 100 - gts.getDiscount(gts)
                return gts.getTotal(idx) * gts.getPrepay(idx) / 100
            }
        }
    },
    getMonthlyTotalPrice: (state, gts) => (idx) => {
        if (gts.getMonth(idx)) {
            return gts.getTotal(idx) - gts.getInitialPrice(idx)
        }
        return 0
    },
    getMonthlyPaymentAmount: (state, gts) => (idx) => {
        if (gts.getPrepay(idx) === 100) {
            return 0
        }
        return gts.getMonthlyTotalPrice(idx) / gts.getMonth(idx)
    },
    getDiscount: (state, gts) => (idx) => {
        // if (gts.isDiscountOtherType(idx)) {
        //     return 0
        // }
        return gts.getApm({idx}).calc.total_discount
    },
    getRemainPrice: (state, gts) => (idx) => {
        if (gts.getPrepay(idx) === 100) {
            return 0
        }
        return gts.getTotal(idx) - gts.getInitialPrice(idx)
    },
    getTotal: (state, gts) => (idx) => {
        return gts.getPrice(idx) - gts.getDiscount(idx)
    },
    calcProperties: (state, gts) => (idx) => {
        const calc = {...gts.gtsApartments[idx].calc}

        calc.total = fmd(gts.getTotal(idx))
        calc.monthly_payment = fmd(gts.getMonthlyPaymentAmount(idx))
        calc.initial_price = fmd(gts.getInitialPrice(idx))
        calc.remainder = fmd(gts.getRemainPrice(idx))
        calc.base_price = fmd(gts.getPrice(idx))
        calc.total_discount = gts.getDiscount(idx)
        if (calc.discount.id === 'other') {
            calc.price_m2 = gts.gtsApartments[idx].price_m2
        } else {
            calc.price_m2 = calc.discount.amount
        }
        return calc
    },
    totalForAll: (state, gts) => gts.gtsApartments.reduce((a, b) => a + b.calc.total, 0)
}