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
            idx, apm: {discount},
            edit: {prepay: false, initial_price: false},
            calc: {discount, prepay: discount.prepay}
        })

        dispatch('rerenderApm', {idx})
        dispatch('initialPaymentsSetter', {index: idx})
        dispatch('monthlyPaymentsSetter', {index: idx})
    },
    setMonthlyPaymentPeriod({getters: gts, commit, dispatch}, {apmId, monthly_payment_period}) {
        const apmIndex = gts.findApmIdx(apmId)

        commit('updateApartment', {
            idx: apmIndex,
            calc: {monthly_payment_period},
            edit: {monthly_payment_period: true}
        })

        dispatch('initialPaymentsSetter', {index: apmIndex})
        dispatch('monthlyPaymentsSetter', {index: apmIndex})
        dispatch('recalculateApmPrices', apmIndex)
        // dispatch('rerenderApm', {idx: apmIndex})
    },

    editPrepay({getters: gts, commit, dispatch}, {apmId, prepay}) {
        const apmIndex = gts.findApmIdx(apmId)
        commit('updateApartment', {
            idx: apmIndex,
            calc: {prepay: prepay},
            edit: {prepay: true}
        })

        dispatch('initialPaymentsSetter', {index: apmIndex})
        dispatch('monthlyPaymentsSetter', {index: apmIndex})
        dispatch('rerenderApm', {idx: apmIndex})
    },
    editInitialPrice({getters: gts, commit, dispatch}, {apmId, initial_price}) {
        const apmIndex = gts.findApmIdx(apmId)

        commit('updateApartment', {
            idx: apmIndex,
            calc: {initial_price},
            edit: {initial_price: true}
        })

        dispatch('initialPaymentsSetter', {index: apmIndex})
        dispatch('monthlyPaymentsSetter', {index: apmIndex})
        dispatch('rerenderApm', {idx: apmIndex})
    },
    updateDiscount({getters: gts, commit, dispatch}, {apmId, discount_per_m2, total_discount}) {
        const apmIndex = gts.findApmIdx(apmId)

        commit('updateApartment', {
            idx: apmIndex,
            calc: {discount_per_m2, total_discount},
        })

        dispatch('initialPaymentsSetter', {index: apmIndex})
        dispatch('monthlyPaymentsSetter', {index: apmIndex})
        dispatch('rerenderApm', {idx: apmIndex})
    },
    updateFirstPaymentDate({getters: gts, commit, dispatch}, {apmId, first_payment_date}) {
        const apmIndex = gts.findApmIdx(apmId)
        commit('updateApartment', {
            idx: apmIndex,
            calc: {first_payment_date},
        })
        dispatch('initialPaymentsSetter', {index: apmIndex})
        dispatch('monthlyPaymentsSetter', {index: apmIndex})
        commit('reset')
    },
    updatePaymentDate({getters: gts, commit, dispatch}, {apmId, payment_date}) {
        const apmIndex = gts.findApmIdx(apmId)
        commit('updateApartment', {
            idx: apmIndex,
            calc: {payment_date},
        })
        dispatch('initialPaymentsSetter', {index: apmIndex})
        dispatch('monthlyPaymentsSetter', {index: apmIndex})
        commit('reset')
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
    initialPaymentsSetter({getters: gts, dispatch}, {index, uuid}) {
        const idx = index ?? gts.findApmIdx(uuid)
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
    monthlyPaymentsSetter({state, getters: gts, dispatch}, {index, uuid}) {
        const idx = index ?? gts.findApmIdx(uuid)
        const monthlyPaymentAmount = gts.getMonthlyPaymentAmount(idx)
        if (monthlyPaymentAmount && gts.getPrepay(idx) !== 100) {
            const {payment_date, monthly_payment_period} = state.apartments[idx].calc
            let today = payment_date ? new Date(payment_date) : new Date()
            const {year: todayYear, month: todayMonth, dayOfMonth: todayDate} = dateProperties(today)
            const lastDateOfCurrentMonth = (new Date(todayYear, todayMonth + 1, 0)).getDate()
            let calculateByLastDay = todayDate === lastDateOfCurrentMonth
            dispatch('monthlySetter', {idx, credit_months: []})
            let dCredit = {
                amount: fmd(monthlyPaymentAmount),
                edit: false,
                edited: false,
                month: today,
                type: 'monthly'
            }
            if (monthly_payment_period > 0) {
                for (let i = 0; i < monthly_payment_period; i++) {
                    const lastDayOfMonth = new Date(todayYear, todayMonth + i + 1, 0)
                    if (i === 0) {
                        dCredit.month = calculateByLastDay ? lastDayOfMonth : today.setMonth(today.getMonth())
                    } else {
                        dCredit.month = calculateByLastDay ? lastDayOfMonth : today.setMonth(today.getMonth() + 1)
                    }
                    state.apartments[idx].calc.credit_months.push(dCredit)
                    // dispatch('monthlyAdditionSetter', {idx, payment: creditMonth})
                }
            }
        } else {
            dispatch('monthlySetter', {idx, credit_months: []})
        }
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
    editPaymentSchedule({getters: gts, commit, dispatch}, {payment, apmId}) {
        const idx = gts.findApmIdx(apmId)
        dispatch('editSchedule', {payment, idx})
        commit('sortPaymentSchedule', {type: payment.type, idx})
        if (payment.amount) {
            dispatch('reInitCalc', {payment, idx})
        }

        if (payment.type === 'initial') {
            commit('setInitialResult', {
                idx,
                initial: gts.initiallyTotal(idx)
            })
            commit('setRemainAmount', {
                idx,
                remainPrice: gts.getTotal(idx) - gts.initiallyTotal(idx)
            })
        }

        if (payment.type === 'initial') {
            commit('setInitialResult', gts.initiallyTotal(idx))
            commit('setRemainAmount', gts.getTotal(idx) - gts.initiallyTotal(idx))
        }

        dispatch('rerenderApm', {idx})
    },
    reInitCalc({getters: gts, dispatch}, {payment, idx}) {
        if (payment.type === 'initial') {
            if (gts.getMonth(idx)) {
                const excessAmount = (gts.getTotal(idx) - gts.initiallyTotal(idx)) / gts.getMonth(idx)
                dispatch('changeMonthly', {idx, monthly: excessAmount})
                // commit('setMonthlyAmount', excessAmount)
            }
        } else if (payment.type === 'monthly') {
            if (gts.uneditedMonthly(idx).length) {
                let monthly = (gts.getMonthlyTotalPrice(idx) - gts.getMonthlyEditTotalPrice(idx)) / gts.uneditedMonthly(idx).length
                dispatch('changeMonthlyByEdit', {idx, monthly})
            } else {
                const remainToInitial = gts.getTotal(idx) - gts.creditMonthTotal(idx)
                if (gts.uneditedInitial(idx).length) {
                    let initially = (remainToInitial - gts.getInitialEditTotalPrice(idx)) / gts.uneditedInitial(idx).length
                    dispatch('changeInitiallyByEdit', {idx, initially})
                } else {
                    let initialMonthly = remainToInitial / gts.getInitialPayments(idx).length
                    dispatch('changeInitially', {idx, initially: initialMonthly})
                }
            }
        }
    },
    changeMonthly({state}, {monthly, idx}) {
        state.apartments[idx].calc.credit_months =
            state.apartments[idx].calc.credit_months
                .map(creditMonth => {
                    return {
                        ...creditMonth,
                        amount: fmd(monthly)
                    }
                })
    },
    changeMonthlyByEdit({state}, {idx, monthly}) {
        state.apartments[idx].calc.credit_months =
            state.apartments[idx].calc.credit_months
                .map(creditMonth => {
                    if (!creditMonth.edit) {
                        return {
                            ...creditMonth,
                            amount: fmd(monthly)
                        }
                    }
                    return creditMonth
                })
    },
    changeInitially({state}, {idx, initially}) {
        state.apartments[idx].calc.initial_payments =
            state.apartments[idx].calc.initial_payments
                .map(creditMonth => {
                    return {
                        ...creditMonth,
                        amount: fmd(initially)
                    }
                })
    },
    changeInitiallyByEdit({state}, {idx, initially}) {
        state.apartments[idx].calc.initial_payments =
            state.apartments[idx].calc.initial_payments
                .map(initPm => {
                    if (!initPm.edit) {
                        return {
                            ...initPm,
                            amount: fmd(initially)
                        }
                    }
                    return initPm
                })
    },
    addNewPaymentSchedule({getters: gts, commit, dispatch}, {apmId, payment}) {
        const idx = gts.findApmIdx(apmId)
        const {type} = payment
        dispatch('addPaymentSchedule', {apmId, payment})
        commit('sortPaymentSchedule', {idx, type})
        commit('reorderScheduleDate', {idx, type})

        dispatch('reInitCalc', {idx, payment})

        if (type === 'monthly') {
            commit('setMonth', gts.getCreditMonths(idx).length)
        }

        if (type === 'initial') {
            commit('setInitialResult', {idx, initial: gts.initiallyTotal(idx)})
            commit('setRemainAmount', {idx, remainPrice: gts.getTotal(idx) - gts.initiallyTotal(idx)})
        }

        dispatch('rerenderApm', {idx})
    },
    addPaymentSchedule({state, getters: gts, dispatch}, {apmId, payment}) {
        const idx = gts.findApmIdx(apmId)
        const {amount, month, type, edit} = payment
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

        if (type === 'initial') {
            const length = state.apartments[idx].calc.initial_payments.length
            if (length === 1) {
                const initialPerMonth = gts.getInitialPrice(idx) / (length + 1)
                dispatch('initialAdditionSetter', {idx, payment: schedule})
                state.apartments[idx].calc.initial_payments =
                    state.apartments[idx].calc.initial_payments
                        .map(initial => ({...initial, amount: fmd(initialPerMonth)}))
            } else {
                dispatch('initialAdditionSetter', {idx, payment: {...schedule, amount: 0}})
            }
        } else {
            dispatch('monthlyAdditionSetter', {idx, payment: schedule})
        }

        dispatch('rerenderApm', {idx})
    },
    deletePaymentSchedule({getters: gts, commit, dispatch}, {apmId, payment}) {
        const idx = gts.findApmIdx(apmId)
        commit('deleteSchedule', {idx, payment})

        dispatch('reInitCalc', {idx, payment})

        if (payment.type === 'monthly') {
            commit('setMonth', {idx, monthly_payment_period: gts.getCreditMonths(idx).length})
        }

        if (payment.type === 'initial') {
            commit('setInitialResult', {idx, initial: gts.initiallyTotal(idx)})
            commit('setRemainAmount', {idx, remainPrice: gts.getTotal - gts.initiallyTotal})
        }

        dispatch('rerenderApm', {idx})
    },
    setIndividualPrice({getters: gts, commit, dispatch}, {index, apmId, starting_price, price_m2}) {
        const idx = index ?? gts.findApmIdx(apmId)
        commit('updateApartment', {
            idx,
            calc: {
                other: {starting_price, price_m2}
            },
        })

        dispatch('rerenderApm', {idx})
        dispatch('initialPaymentsSetter', {index: idx})
        dispatch('monthlyPaymentsSetter', {index: idx})
    },
    updateValidationState({getters: gts, commit}, {index, apmId, validate}) {
        const idx = index ?? gts.findApmIdx(apmId)
        commit('updateApartment', {idx, validate})
        commit('reset')
    },
    removeApartment({state, getters: gts}, {index, apmId}) {
        const idx = index ?? gts.findApmIdx(apmId)
        state.trashStorage.push({idx, a: state.apartments[idx]})
        state.apartments.splice(idx, 1)
    },
    returnRemovedApartments({state}) {
        state.trashStorage.forEach(({idx, a}) => {
            state.apartments.splice(idx, 0, a)
        })
        state.trashStorage = []
    }
}