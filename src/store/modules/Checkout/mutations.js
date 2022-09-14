import {dateProperties} from "@/util/calendar";

export default {
    initializeState(state, context) {
        const {
            uuid,
            discount,
            expiry_at,
            created_by,
            apartments,
            contract_number,
        } = context
        state.uuid = uuid
        state.order = context
        state.discount = discount
        state.expiry_at = expiry_at
        state.created_by = created_by
        state.contract_number = contract_number
        state.calc.prepayment = discount.prepay
        state.calc.monthly_payment_period = apartments[0].object.credit_month
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
    deactivateState(state, editField) {
        state.edit[editField] = false
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

        if (type === 'monthly') {
            state.edit.monthly = true
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
    deleteApartment(state, apartment) {
        state.apartments = state.apartments.filter(pm => pm.id !== apartment.id)
    },
    clearTrashStorage(state) {
        state.trashStorage = []
    },
    addToTrashStorage(state, apartment) {
        state.trashStorage.push(apartment)
    },
    addApartment(state, apartments) {
        for (let i = 0; i < apartments.length; i++) {
            state.apartments.push(apartments[i])
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
}