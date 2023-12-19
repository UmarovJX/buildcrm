import { dateProperties } from '@/util/calendar'
import { numberFormatDecimal as fmd } from '@/util/numberHelper'

export default {
  setup({ commit, dispatch }, context) {
    commit('initializeState', context)
    dispatch('calculate')
  },
  calculate({ state, getters }) {
    state.calc.total = fmd(getters.getTotal)
    state.calc.monthly_payment = fmd(getters.getMonthlyPaymentAmount)
    state.calc.initial_price = fmd(getters.getInitialPrice)
    state.calc.remainder = fmd(getters.getRemainPrice)
    state.calc.base_price = fmd(getters.getBasePrice)
    state.calc.total_discount = getters.getDiscount
  },
  changeDiscount({ state }, discount) {
    state.calc.prepay = discount.prepay
    state.edit.prepay = false
  },
  changeFirstPaymentDate({ dispatch }) {
    dispatch('calculate')
    dispatch('initialPaymentsSetter')
    dispatch('monthlyPaymentsSetter')
  },
  changePaymentDate({ dispatch }) {
    dispatch('calculate')
    dispatch('initialPaymentsSetter')
    dispatch('monthlyPaymentsSetter')
  },
  initialPaymentsSetter({ state, getters }) {
    const { first_payment_date } = state.calc
    const today = first_payment_date ? new Date(first_payment_date) : new Date()
    const {
      year: todayYear,
      month: todayMonth,
      dayOfMonth: todayDate,
    } = dateProperties(today)
    const lastDayOfMonth = new Date(todayYear, todayMonth + 1, 0)
    const lastDateOfCurrentMonth = lastDayOfMonth.getDate()
    const calculateByLastDay = todayDate === lastDateOfCurrentMonth
    state.initial_payments = []
    const initialMonth = {
      type: 'initial',
      amount: fmd(getters.getInitialPrice),
      edit: false,
      edited: false,
      month: new Date(today),
    }
    initialMonth.month = calculateByLastDay ? lastDayOfMonth : new Date(today)
    state.initial_payments.push(initialMonth)
  },
  monthlyPaymentsSetter({ state, getters }) {
    if (getters.getMonthlyPaymentAmount && getters.getPrepay !== 100) {
      const { payment_date, monthly_payment_period } = state.calc
      const today = payment_date ? new Date(payment_date) : new Date()
      const {
        year: todayYear,
        month: todayMonth,
        dayOfMonth: todayDate,
      } = dateProperties(today)
      const lastDateOfCurrentMonth = new Date(
        todayYear,
        todayMonth + 1,
        0,
      ).getDate()
      const calculateByLastDay = todayDate === lastDateOfCurrentMonth
      state.credit_months = []

      if (monthly_payment_period > 0) {
        for (let i = 0; i < monthly_payment_period; i++) {
          const creditMonth = {
            amount: fmd(getters.getMonthlyPaymentAmount),
            edit: false,
            edited: false,
            month: today,
            type: 'monthly',
          }
          const lastDayOfMonth = new Date(todayYear, todayMonth + i + 1, 0)
          if (i === 0) {
            creditMonth.month = calculateByLastDay
              ? lastDayOfMonth
              : today.setMonth(today.getMonth())
          } else {
            creditMonth.month = calculateByLastDay
              ? lastDayOfMonth
              : today.setMonth(today.getMonth() + 1)
          }
          state.credit_months.push(creditMonth)
        }
      }
    } else {
      state.credit_months = []
    }
  },
  addPaymentSchedule({ state, getters }, {
    amount, month, type, edit,
  }) {
    const { lastDayOfMonth, isLastDayOfMonth, nextMonthOfDate } = dateProperties(month, 'string')
    const nextMonth = isLastDayOfMonth ? lastDayOfMonth : nextMonthOfDate
    const schedule = {
      edit,
      type,
      amount,
      month: nextMonth,
      edited: false,
    }

    if (type === 'initial') {
      const { length } = state.initial_payments
      if (length === 1) {
        const initialPerMonth = getters.getInitialPrice / (length + 1)
        state.initial_payments.push(schedule)
        state.initial_payments = state.initial_payments.map(initial => ({
          ...initial,
          amount: fmd(initialPerMonth),
        }))
      } else {
        state.initial_payments.push({
          ...schedule,
          amount: 0,
        })
      }
    } else {
      state.credit_months.push(schedule)
    }
  },
  addNewPaymentSchedule(
    { getters, commit, dispatch },
    {
      type, amount, month, edit,
    },
  ) {
    dispatch('addPaymentSchedule', {
      amount, month, type, edit,
    })
    commit('sortPaymentSchedule', type)
    commit('reorderScheduleDate', type)

    dispatch('reInitCalc', { type })

    if (type === 'monthly') {
      commit('setMonth', getters.getCreditMonths.length)
    }

    if (type === 'initial') {
      commit('setInitialResult', getters.initiallyTotal)
      commit('setRemainAmount', getters.getTotal - getters.initiallyTotal)
    }
  },
  editPaymentSchedule({ getters, commit, dispatch }, payment) {
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
  deletePaymentSchedule({ getters, commit, dispatch }, payment) {
    commit('deleteSchedule', payment)

    dispatch('reInitCalc', { type: payment.type })

    if (payment.type === 'monthly') {
      commit('setMonth', getters.getCreditMonths.length)
    }

    if (payment.type === 'initial') {
      commit('setInitialResult', getters.initiallyTotal)
      commit('setRemainAmount', getters.getTotal - getters.initiallyTotal)
    }
  },
  updateApartment({ getters, commit, dispatch }, payload) {
    commit('updateApartmentCalc', payload)

    dispatch('calculate')
    dispatch('initialPaymentsSetter')
    dispatch('monthlyPaymentsSetter')

    if (payload.type === 'initial') {
      commit('setInitialResult', getters.initiallyTotal)
      commit('setRemainAmount', getters.getTotal - getters.initiallyTotal)
    }
  },
  updateState({ dispatch, commit }, { discount }) {
    commit('setDiscount', discount)
    commit('setPrepay', discount)

    dispatch('calculate')
    dispatch('initialPaymentsSetter')
    dispatch('monthlyPaymentsSetter')
  },
  changeInitially({ state }, initially) {
    state.initial_payments = state.initial_payments.map(creditMonth => ({
      ...creditMonth,
      amount: fmd(initially),
    }))
  },
  changeMonthly({ state }, monthly) {
    state.credit_months = state.credit_months.map(creditMonth => ({
      ...creditMonth,
      amount: fmd(monthly),
    }))
  },
  changeInitiallyByEdit({ state }, { initially }) {
    state.initial_payments = state.initial_payments.map(initPm => {
      if (!initPm.edit) {
        return {
          ...initPm,
          amount: fmd(initially),
        }
      }
      return initPm
    })
  },
  changeMonthlyByEdit({ state }, { monthly }) {
    state.credit_months = state.credit_months.map(creditMonth => {
      if (!creditMonth.edit) {
        return {
          ...creditMonth,
          amount: fmd(monthly),
        }
      }
      return creditMonth
    })
  },
  reInitCalc({ getters, dispatch, commit }, payment) {
    if (payment.type === 'initial') {
      // if (getters.uneditedInitial.length) {
      //     let initially = (getters.initiallyTotal - getters.getInitialEditTotalPrice) / getters.uneditedInitial.length
      //     dispatch('changeInitiallyByEdit', {initially})
      // }

      if (getters.getMonth) {
        const excessAmount = (getters.getTotal - getters.initiallyTotal) / getters.getMonth
        dispatch('changeMonthly', excessAmount)
        commit('setMonthlyAmount', excessAmount)
      }
    } else if (payment.type === 'monthly') {
      if (getters.uneditedMonthly.length) {
        const monthly = (getters.getMonthlyTotalPrice - getters.getMonthlyEditTotalPrice)
          / getters.uneditedMonthly.length
        dispatch('changeMonthlyByEdit', { monthly })
      } else {
        const remainToInitial = getters.getTotal - getters.creditMonthTotal
        if (getters.uneditedInitial.length) {
          const initially = (remainToInitial - getters.getInitialEditTotalPrice)
            / getters.uneditedInitial.length
          dispatch('changeInitiallyByEdit', { initially })
        } else {
          const initialMonthly = remainToInitial / getters.getInitialPayments.length
          dispatch('changeInitially', initialMonthly)
        }
      }
    }
  },
  removeApartment({ commit, dispatch }, apartment) {
    commit('deleteApartment', apartment)
    commit('addToTrashStorage', apartment)

    dispatch('calculate')
    dispatch('initialPaymentsSetter')
    dispatch('monthlyPaymentsSetter')
  },
  changePrepay({ commit, dispatch }) {
    commit('deactivateState', 'initial_price')
    dispatch('calculate')
    dispatch('initialPaymentsSetter')
    dispatch('monthlyPaymentsSetter')
  },
  returnTrashApartments({ state, commit, dispatch }) {
    commit('addApartment', state.trashStorage)
    commit('clearTrashStorage')
    dispatch('calculate')
    dispatch('initialPaymentsSetter')
    dispatch('monthlyPaymentsSetter')
  },
}
