import {dateProperties} from "@/util/calendar";
import {numberFormatDecimal as fmd} from "@/util/numberHelper";

export default {
    setup({dispatch}, context) {
        dispatch('initValues', context)
        dispatch('calcApmPrices')
        dispatch('initAllApartmentsInitialPayment')
        dispatch('initAllApartmentsCreditMonths')
    },
    initValues({commit}, context) {
        commit('initOtherProperties', context)
        commit('initApartments', context)
    },
    calcApmPrices({state, getters: gts}) {
        state.apartments = state.apartments.map(apartment => {
            let idx = gts.findApmIdx(apartment.id)
            return {
                ...apartment,
                edit: state.schema.edit,
                calc: gts.calcProperties(idx),
            }
        })
    },
    recalculateApmPrices({state, getters: gts}, idx) {
        state.apartments[idx].calc = gts.calcProperties(idx)
    },
    rerenderApm({commit, dispatch}, {idx}) {
        dispatch('recalculateApmPrices', idx)
        commit('reset')
    },
    updateApmDiscount({getters: gts, commit, dispatch}, {apmId, discountId}) {
        const idx = gts.findApmIdx(apmId)
        const discount = gts.discount({idx, discountId})
        commit('updateApartment', {
            idx: idx,
            apm: {discount},
            edit: {prepay: true},
            calc: {discount, prepay: discount.prepay}
        })
        dispatch('rerenderApm', {idx})
    },
    setMonthlyPaymentPeriod({getters: gts, commit, dispatch}, {apmId, monthly_payment_period}) {
        const apmIndex = gts.findApmIdx(apmId)
        commit('updateApartment', {
            idx: apmIndex,
            calc: {monthly_payment_period},
            edit: {monthly_payment_period: true}
        })
        dispatch('rerenderApm', {idx: apmIndex})
    },
    editPrepay({getters: gts, commit, dispatch}, {apmId, prepay}) {
        const apmIndex = gts.findApmIdx(apmId)
        commit('updateApartment', {
            idx: apmIndex,
            calc: {prepay: prepay},
            edit: {prepay: true}
        })
        dispatch('rerenderApm', {idx: apmIndex})
    },
    editInitialPrice({getters: gts, commit, dispatch}, {apmId, initial_price}) {
        const apmIndex = gts.findApmIdx(apmId)
        commit('updateApartment', {
            idx: apmIndex,
            calc: {initial_price},
            edit: {initial_price: true}
        })
        dispatch('rerenderApm', {idx: apmIndex})
    },
    updateDiscount({getters: gts, commit, dispatch}, {apmId, discount_per_m2, total_discount}) {
        const apmIndex = gts.findApmIdx(apmId)
        commit('updateApartment', {
            idx: apmIndex,
            calc: {discount_per_m2, total_discount},
        })
        dispatch('rerenderApm', {idx: apmIndex})
    },
    updateFirstPaymentDate({getters: gts, commit}, {apmId, first_payment_date}) {
        const apmIndex = gts.findApmIdx(apmId)
        commit('updateApartment', {
            idx: apmIndex,
            calc: {first_payment_date},
        })
    },
    updatePaymentDate({getters: gts, commit}, {apmId, payment_date}) {
        const apmIndex = gts.findApmIdx(apmId)
        commit('updateApartment', {
            idx: apmIndex,
            calc: {payment_date},
        })
    },
    initAllApartmentsInitialPayment({state, dispatch}) {
        state.apartments.forEach(({id}) => dispatch('initialPaymentsSetter', {uuid: id}))
    },
    initAllApartmentsCreditMonths({state, dispatch}) {
        state.apartments.forEach(({id}) => dispatch('creditMonthsSetter', {uuid: id}))
    },
    initialSetter({state}, {idx, initial_payments}) {
        state.apartments[idx].calc.initial_payments = initial_payments
    },
    initialAdditionSetter({state}, {idx, payment}) {
        state.apartments[idx].calc.initial_payments.push(payment)
    },
    initialPaymentsSetter({getters: gts, dispatch}, {uuid}) {
        const idx = gts.findApmIdx(uuid)
        const apm = gts.getApm({idx})
        const {first_payment_date} = apm.calc
        let today = first_payment_date ? new Date(first_payment_date) : new Date()
        const {year: todayYear, month: todayMonth, dayOfMonth: todayDate} = dateProperties(today)
        const lastDayOfMonth = new Date(todayYear, todayMonth + 1, 0)
        const lastDateOfCurrentMonth = lastDayOfMonth.getDate()
        let calculateByLastDay = todayDate === lastDateOfCurrentMonth
        dispatch('initialSetter', {idx, initial_payments: []})
        const initialMonth = {
            type: 'initial',
            amount: fmd(gts.getInitialPrice(idx)),
            edit: false,
            edited: false,
            month: new Date(today),
        }
        initialMonth.month = calculateByLastDay ? lastDayOfMonth : new Date(today)
        dispatch('initialAdditionSetter', {idx, payment: initialMonth})
    },
    monthlySetter({state}, {idx, credit_months}) {
        state.apartments[idx].calc.credit_months = credit_months
    },
    monthlyAdditionSetter({state}, {idx, payment}) {
        state.apartments[idx].calc.credit_months.push(payment)
    },
    creditMonthsSetter({getters: gts, dispatch}, {uuid}) {
        const idx = gts.findApmIdx(uuid)
        const apm = gts.getApm({idx})
        if (gts.getMonthlyPaymentAmount(idx) && gts.getPrepay(idx) !== 100) {
            const {payment_date, monthly_payment_period} = apm.calc
            let today = payment_date ? new Date(payment_date) : new Date()
            const {year: todayYear, month: todayMonth, dayOfMonth: todayDate} = dateProperties(today)
            const lastDateOfCurrentMonth = (new Date(todayYear, todayMonth + 1, 0)).getDate()
            let calculateByLastDay = todayDate === lastDateOfCurrentMonth
            dispatch('monthlySetter', {idx, credit_months: []})
            if (monthly_payment_period > 0) {
                for (let i = 0; i < monthly_payment_period; i++) {
                    const creditMonth = {
                        amount: fmd(gts.getMonthlyPaymentAmount(idx)),
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
                    dispatch('monthlyAdditionSetter', {idx, payment: creditMonth})
                }
            }
        } else {
            dispatch('monthlySetter', {idx, credit_months: []})
        }
    },
    editSchedule({state}, {idx, payment}) {
        const {amount, type, month, tracker} = payment
        let paymentType = type === 'initial' ? 'initial_payments' : 'credit_months'
        const index = state.apartments[idx].calc[paymentType].findIndex((pm) => pm.amount === tracker.amount && pm.month === tracker.month)
        if (index !== -1 && amount !== 0 && month) {
            if (amount !== 0) {
                state.apartments[idx].calc[paymentType][index].amount = amount
                state.apartments[idx].calc[paymentType][index].edit = true
            }
            if (month) {
                state.apartments[idx].calc[paymentType][index].month = month
                state.apartments[idx].calc[paymentType][index].edit = true
            }
        }

        if (type === 'monthly') {
            state.apartments[idx].edit.monthly = true
        }
    },
    /* edit payment schedule process ... */
    editPaymentSchedule({getters: gts, commit, dispatch}, {payment, apmId}) {
        const idx = gts.findApmIdx(apmId)
        dispatch('editSchedule', {payment, idx})
        commit('sortPaymentSchedule', {type: payment.type, idx})
        //
        // if (payment.amount) {
        //     dispatch('reInitCalc', payment)
        // }
        //
        // if (payment.type === 'initial') {
        //     commit('setInitialResult', getters.initiallyTotal)
        //     commit('setRemainAmount', getters.getTotal - getters.initiallyTotal)
        // }
    },
}