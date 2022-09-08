import {dateProperties} from "@/util/calendar";

export default {
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
    changeDiscount({state}, discount) {
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
    },
    removeApartment({commit, dispatch}, apartment) {
        commit('deleteApartment', apartment)
        commit('addToTrashStorage', apartment)

        dispatch('calculate')
        dispatch('initialPaymentsSetter')
        dispatch('monthlyPaymentsSetter')
    },
    changePrepay({dispatch}) {
        // if (!prepay) {
        //     commit('deactivateState', 'prepay')
        //     commit('setPrepay', state.discount)
        // }

        dispatch('calculate')
        dispatch('initialPaymentsSetter')
        dispatch('monthlyPaymentsSetter')
    }
}