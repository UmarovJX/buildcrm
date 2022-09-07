import {dateProperties} from "@/util/calendar";

export default {
    namespaced: true,
    state: {
        apartments: [],
        discount: null,
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
        credit_months: [],
        initial_payments: [],
        edit: {
            initial_price: false,
            monthly_payment_period: false,
            prepay: false,
            discount: false
        }
    },

    getters: {
        discountType: (state) => state.discount.type,
        discountAmount: (state) => state.discount.amount,
        apartmentArea: (state) => (index) => state.apartments[index].plan.area,
        apartmentPricePerSquare: (state) => (index) => state.apartments[index].price_m2,
        isDiscountOtherType: (state) => state.discount.id === 'other',
        getPrepay: (state) => state.calc.prepay,
        getMonth: (state) => state.calc.monthly_payment_period,
        getBasePrice: (state) => state.apartments.reduce((a, b) => (a + b.price), 0),
        getInitialPayments: (state) => state.initial_payments,
        getCreditMonths: (state) => state.credit_months,
        getMonthlyEdit: (state, getters) => getters.getCreditMonths.filter(monthly => monthly.edit),
        getInitialEdit: (state, getters) => getters.getInitialPayments.filter(monthly => monthly.edit),
        initiallyTotal: (state, getters) => getters.getInitialPayments.reduce((a, b) => a + b.amount, 0),
        creditMonthTotal: (state, getters) => getters.getCreditMonths.reduce((a, b) => a + b.amount, 0),
        getMonthlyEditTotalPrice: (state, getters) => getters.getMonthlyEdit.reduce((a, b) => a + b.amount, 0),
        getInitialEditTotalPrice: (state, getters) => getters.getInitialEdit.reduce((a, b) => a + b.amount, 0),
        uneditedInitial: (state, getters) => getters.getInitialPayments.filter(inMonth => !inMonth.edit),
        uneditedMonthly: (state, getters) => getters.getCreditMonths.filter(crMonth => !crMonth.edit),
        calculateTotalPriceByFixed: (state, getters) => {
            return state.apartments
                .reduce((a, b, index) => {
                    if (getters.isDiscountOtherType) {
                        return a + b.calc.price
                    }
                    return a + getters.discountAmount * getters.apartmentArea(index)
                }, 0)
        },
        calculateTotalPriceByPromo: (state, getters) => getters.calculateTotalPriceByFixed,
        calculateTotalPriceByAddition: (state, getters) => getters.calculateTotalPriceByFixed,
        calculateTotalPriceByDefault: (state, getters) => {
            if (getters.getPrepay === 100) {
                return state.apartments
                    .reduce((a, b) => {
                        if (getters.isDiscountOtherType) {
                            return {
                                sum: a.sum + b.calc.price
                            }
                        }
                        return {
                            sum: a.sum + b.price
                        }
                    }, {sum: 0}).sum
            } else {
                if (getters.isDiscountOtherType) {
                    return state.apartments
                        .reduce((a, b) => a + b.calc.price, 0)
                }
                return state.apartments.reduce((a, b) => {
                    return a + b.price * (1 + getters.discountAmount / 100)
                }, 0)
            }
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
                return state.calc.initial_price
            }

            if (!getters.getMonth) {
                return getters.getTotal
            }

            if (getters.getInitialPayments.length) {
                return getters.initiallyTotal
            }

            switch (getters.discountType) {
                case 'fixed':
                case 'promo':
                case 'addition': {
                    return getters.calculateTotalPriceByFixed * getters.getPrepay / 100
                }
                case 'other': {
                    return getters.calculateTotalPriceByDefault
                }
                case 'percent': {
                    return getters.calculateTotalPriceByDefault * getters.getPrepay / 100
                }
                default: {
                    return getters.calculateTotalPriceByDefault * getters.discountAmount / 100
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
            return state.apartments.reduce((acc, apartment) => {
                return acc + apartment.calc.total_discount
            }, 0)
        },
        getRemainPrice: (state, getters) => {
            if (getters.getPrepay === 100) {
                return 0
            }
            return getters.getTotal - getters.getInitialPrice
        },
        getTotal: (state, getters) => getters.getPrice - getters.getDiscount
    },

    mutations: {
        initializeState(state, context) {
            const {
                uuid,
                month,
                discount,
                expiry_at,
                created_by,
                apartments,
                contract_number,
            } = context
            state.uuid = uuid
            state.month = month
            state.discount = discount
            state.expiry_at = expiry_at
            state.created_by = created_by
            state.contract_number = contract_number
            state.calc.prepayment = discount.prepay
            state.apartments = apartments.map(apartment => {
                return {
                    ...apartment,
                    calc: {
                        price: apartment.price,
                        price_m2: apartment.price_m2,
                        plan: apartment.plan,
                        area: apartment.plan.area,
                        total_discount: 0,
                        discount_per_m2: 0
                    }
                }
            })
        },
        setDiscount(state, discount) {
            state.discount = discount
        },
        setPrepay(state, discount) {
            if (!state.edit.discount) {
                state.calc.prepay = discount.prepay
            }
        },
        editState(state, editField) {
            state.edit[editField] = true
        },
        updateApartmentCalc(state, item) {
            const {id, price, price_m2, total_discount, discount_per_m2} = item
            const index = state.apartments.findIndex(apm => apm.id === id)
            if (index !== -1) {
                state.apartments[index].calc = {
                    ...state.apartments[index].calc,
                    price,
                    price_m2,
                    total_discount,
                    discount_per_m2
                }
            }
        },
        addPaymentSchedule(state, {amount, month, type, edit}) {
            const {
                lastDayOfMonth,
                isLastDayOfMonth,
                nextMonthOfDate
            } = dateProperties(month, 'string')
            const nextMonth = isLastDayOfMonth ? lastDayOfMonth : nextMonthOfDate
            const schedule = {
                edit,
                type,
                amount,
                month: nextMonth,
                edited: false,
            }
            const paymentType = type === 'initial' ? 'initial_payments' : 'credit_months'
            state[paymentType].push(schedule)
        },
        editSchedule(state, {amount, type, month, tracker}) {
            let paymentType = type === 'initial' ? 'initial_payments' : 'credit_months'
            const index = state[paymentType].findIndex((pm) => pm.amount === tracker.amount && pm.month === tracker.month)
            if (index !== -1 && amount !== 0 && month) {
                if (amount !== 0) {
                    state[paymentType][index].amount = amount
                    state[paymentType][index].edit = true
                }
                if (month) {
                    state[paymentType][index].month = month
                    state[paymentType][index].edit = true
                }
            }
        },
        deleteSchedule(state, {type, amount, month}) {
            let paymentType = type === 'initial' ? 'initial_payments' : 'credit_months'
            const deleteIndex = state[paymentType].findIndex(pm => pm.type === type && pm.month === month && pm.amount === amount)
            if (deleteIndex !== -1) {
                state[paymentType].splice(deleteIndex, 1)
            }
        },
        sortPaymentSchedule(state, type) {
            let paymentType = type === 'initial' ? 'initial_payments' : 'credit_months'
            state[paymentType] = state[paymentType].sort((a, b) => {
                const {time: aTime} = dateProperties(a.month, 'string')
                const {time: bTime} = dateProperties(b.month, 'string')
                return aTime - bTime
            })
        },
        reorderScheduleDate(state, type) {
            let paymentType = type === 'initial' ? 'initial_payments' : 'credit_months'
            for (let index = 0; index < state[paymentType].length; index++) {
                const payment = state[paymentType][index]
                if (index) {
                    const previousMonth = state[paymentType][index - 1].month
                    const {
                        lastDayOfMonth,
                        isLastDayOfMonth,
                        nextMonthOfDate,
                    } = dateProperties(payment.month, 'string')
                    const nextMonth = isLastDayOfMonth ? lastDayOfMonth : nextMonthOfDate
                    if (payment.month === previousMonth) {
                        state[paymentType][index] = {
                            ...payment,
                            month: nextMonth
                        }
                    }
                }
            }
        },
        setMonthlyAmount(state, monthly) {
            state.calc.monthly_payment = monthly
        },
        setMonth(state, month) {
            state.calc.monthly_payment_period = month
        },
        setInitialResult(state, initial) {
            state.calc.initial_price = initial
        },
        setRemainAmount(state, remainPrice) {
            state.calc.remainder = remainPrice
        }
    },

    actions: {
        setup({commit, dispatch}, context) {
            commit('initializeState', context)
            dispatch('calculate')
        },
        calculate({state, getters}) {
            state.calc.total = getters.getTotal
            state.calc.monthly_payment = getters.getMonthlyPaymentAmount
            state.calc.initial_price = getters.getInitialPrice
            state.calc.remainder = getters.getRemainPrice
            state.calc.base_price = getters.getBasePrice
            state.calc.total_discount = getters.getDiscount
        },
        changeDiscount(state, discount) {
            state.calc.prepay = discount.prepay
            state.edit.prepay = false
        },
        changeFirstPaymentDate({dispatch}) {
            dispatch('calculate')
            dispatch('initialPaymentsSetter')
            dispatch('monthlyPaymentsSetter')
        },
        changePaymentDate({dispatch}) {
            dispatch('calculate')
            dispatch('initialPaymentsSetter')
            dispatch('monthlyPaymentsSetter')
        },
        initialPaymentsSetter({state, getters}) {
            const {first_payment_date} = state.calc
            let today = first_payment_date ? new Date(first_payment_date) : new Date()
            const {year: todayYear, month: todayMonth, dayOfMonth: todayDate} = dateProperties(today)
            const lastDateOfCurrentMonth = (new Date(todayYear, todayMonth + 1, 0)).getDate()
            let calculateByLastDay = todayDate === lastDateOfCurrentMonth
            state.initial_payments = []
            const initialMonth = {
                type: 'initial',
                amount: getters.getInitialPrice,
                edit: false,
                edited: false,
                month: today,
            }
            const lastDayOfMonth = new Date(todayYear, todayMonth + 1, 0)
            initialMonth.month = calculateByLastDay ? lastDayOfMonth : today.setMonth(today.getMonth())
            state.initial_payments.push(initialMonth)
        },
        monthlyPaymentsSetter({state, getters}) {
            if (getters.getMonthlyPaymentAmount && getters.getPrepay !== 100) {
                const {payment_date, monthly_payment_period} = state.calc
                let today = payment_date ? new Date(payment_date) : new Date()
                const {year: todayYear, month: todayMonth, dayOfMonth: todayDate} = dateProperties(today)
                const lastDateOfCurrentMonth = (new Date(todayYear, todayMonth + 1, 0)).getDate()
                let calculateByLastDay = todayDate === lastDateOfCurrentMonth
                state.credit_months = []

                if (monthly_payment_period > 0) {
                    for (let i = 0; i < monthly_payment_period; i++) {
                        const creditMonth = {
                            amount: getters.getMonthlyPaymentAmount,
                            edit: false,
                            edited: false,
                            month: today,
                            type: 'monthly'
                        }
                        const lastDayOfMonth = new Date(todayYear, todayMonth + i + 1, 0)
                        if (i === 0) {
                            creditMonth.month = calculateByLastDay ? lastDayOfMonth : today.setMonth(today.getMonth())
                        } else {
                            creditMonth.month = calculateByLastDay ? lastDayOfMonth : today.setMonth(today.getMonth() + 1)
                        }
                        state.credit_months.push(creditMonth)
                    }
                }
            } else {
                state.credit_months = []
            }
        },
        addNewPaymentSchedule({getters, commit, dispatch}, {type, amount, month, edit}) {
            commit('addPaymentSchedule', {amount, month, type, edit})
            commit('sortPaymentSchedule', type)
            commit('reorderScheduleDate', type)

            dispatch('reInitCalc', {type})

            if (type === 'monthly') {
                commit('setMonth', getters.getCreditMonths.length)
            }

            if (type === 'initial') {
                commit('setInitialResult', getters.initiallyTotal)
                commit('setRemainAmount', getters.getTotal - getters.initiallyTotal)
            }
        },
        editPaymentSchedule({getters, commit, dispatch}, payment) {
            commit('editSchedule', payment)
            commit('sortPaymentSchedule', payment.type)

            if (payment.amount) {
                dispatch('reInitCalc', payment)
            }

            if (payment.type === 'initial') {
                commit('setInitialResult', getters.initiallyTotal)
                commit('setRemainAmount', getters.getTotal - getters.initiallyTotal)
            }
        },
        deletePaymentSchedule({getters, commit, dispatch}, payment) {
            commit('deleteSchedule', payment)

            dispatch('reInitCalc', {type: payment.type})

            if (payment.type === 'monthly') {
                commit('setMonth', getters.getCreditMonths.length)
            }

            if (payment.type === 'initial') {
                commit('setInitialResult', getters.initiallyTotal)
                commit('setRemainAmount', getters.getTotal - getters.initiallyTotal)
            }
        },
        updateApartment({getters, commit, dispatch}, payload) {
            commit('updateApartmentCalc', payload)

            dispatch('calculate')
            dispatch('initialPaymentsSetter')
            dispatch('monthlyPaymentsSetter')

            if (payload.type === 'initial') {
                commit('setInitialResult', getters.initiallyTotal)
                commit('setRemainAmount', getters.getTotal - getters.initiallyTotal)
            }
        },
        updateState({dispatch, commit}, {discount}) {
            commit('setDiscount', discount)
            commit('setPrepay', discount)

            dispatch('calculate')
            dispatch('initialPaymentsSetter')
            dispatch('monthlyPaymentsSetter')
        },
        changeInitially({state}, initially) {
            state.initial_payments = state.initial_payments.map(creditMonth => {
                return {
                    ...creditMonth,
                    amount: initially
                }
            })
        },
        changeMonthly({state}, monthly) {
            state.credit_months = state.credit_months.map(creditMonth => {
                return {
                    ...creditMonth,
                    amount: monthly
                }
            })
        },
        changeInitiallyByEdit({state}, {initially}) {
            state.initial_payments = state.initial_payments.map(initPm => {
                if (!initPm.edit) {
                    return {
                        ...initPm,
                        amount: initially
                    }
                }
                return initPm
            })
        },
        changeMonthlyByEdit({state}, {monthly}) {
            state.credit_months = state.credit_months.map(creditMonth => {
                if (!creditMonth.edit) {
                    return {
                        ...creditMonth,
                        amount: monthly
                    }
                }
                return creditMonth
            })
        },
        reInitCalc({getters, dispatch, commit}, payment) {
            if (payment.type === 'initial') {
                if (getters.uneditedInitial.length) {
                    let initially = (getters.initiallyTotal - getters.getInitialEditTotalPrice) / getters.uneditedInitial.length
                    dispatch('changeInitiallyByEdit', {initially})
                }

                if (getters.getMonth) {
                    const excessAmount = (getters.getTotal - getters.initiallyTotal) / getters.getMonth
                    dispatch('changeMonthly', excessAmount)
                    commit('setMonthlyAmount', excessAmount)
                }
            } else if (payment.type === 'monthly') {
                if (getters.uneditedMonthly.length) {
                    let monthly = (getters.getMonthlyTotalPrice - getters.getMonthlyEditTotalPrice) / getters.uneditedMonthly.length
                    dispatch('changeMonthlyByEdit', {monthly})
                } else {
                    const remainToInitial = getters.getTotal - getters.creditMonthTotal
                    if (getters.uneditedInitial.length) {
                        let initially = (remainToInitial - getters.getInitialEditTotalPrice) / getters.uneditedInitial.length
                        dispatch('changeInitiallyByEdit', {initially})
                    } else {
                        let initialMonthly = remainToInitial / getters.getInitialPayments.length
                        dispatch('changeInitially', initialMonthly)
                    }
                }
            }
        }
    },
}
