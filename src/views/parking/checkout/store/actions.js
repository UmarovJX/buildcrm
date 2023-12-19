import { dateProperties } from '@/util/calendar'
import { numberFormatDecimal as fmd } from '@/util/numberHelper'
import { isNotUndefinedNullEmptyZero } from '@/util/inspect'
import { calculateInstallments, calculateMonthlyPayment } from '@/util/checkout'

export default {
  initEditItems({ state, getters: gts, dispatch }, data) {
    try {
      const { payments_details } = data
      state.version = data.version

      /*! OUTDATED */
      // if (version === 1) {
      //     if (data.status === "sold") {
      //         state.apartments = data.parkings.map((apm) => {
      //             const discount = apm.discounts[0];
      //
      //             return {
      //                 ...apm,
      //                 status: data.status,
      //                 contract_number: data.contract_number,
      //                 contract_date: data.contract_date,
      //                 order_uuid: data.id,
      //                 uuid: apm.id,
      //                 edit: state.schema.edit,
      //                 calc: {
      //                     ...state.schema.calc,
      //                     first_payment_date: data.first_payment_date,
      //                     payment_date: data.payment_date,
      //                     price: apm.price,
      //                     price_m2: apm.price_m2,
      //                     plan: apm.plan,
      //                     contract_number: data.contract_number,
      //                     contract_date: data.contract_date,
      //                     discount: apm.discounts[0],
      //                     prepay: apm.discounts[0].prepay,
      //                     monthly_payment_period: setAppropriateCreditMonth(
      //                         state,
      //                         apm,
      //                         discount
      //                     ),
      //                     other: {
      //                         starting_price: apm.price,
      //                         price_m2: apm.price_m2,
      //                     },
      //                 },
      //             };
      //         });
      //         return;
      //     }
      // }

      state.apartments = data.parkings.map(apartment => {
        const discount = apartment.discounts.find(d => d.id === data.payments_details.discount.id) ?? apartment.discounts[0]

        let images = []
        if (apartment.upload) {
          images = [apartment.upload.path]
        }

        const plan = {
          id: apartment.id,
          area: 1,
          balcony: false,
          balcony_area: 0,
          images,
        }

        const { price } = apartment
        const price_m2 = apartment.price

        return {
          status: data.status,
          contract_number: data.contract_number,
          contract_date: data.contract_date,
          order_uuid: data.id,
          uuid: apartment.id,
          ...apartment,
          plan,
          price_m2, // new
          calc: {
            ...state.schema.calc,
            first_payment_date: data.first_payment_date,
            payment_date: data.payment_date,
            price,
            // price_m2: apartment.price_m2,
            price_m2,
            plan,
            month: payments_details.month,
            contract_number: data.contract_number,
            contract_date: data.contract_date,
            monthly_payment_period: payments_details.month,
            discount,
            prepay: discount.prepay,

            other: {
              starting_price: price,
              // price_m2: apartment.price_m2,
              price_m2,
            },
          },
          edit: state.schema.edit,
          validate: state.schema.validate,
        }
      })

      dispatch('changeFirstAttempt', {
        apmId: data.parkings[0].id,
        firstAttempt: true,
      })

      for (let i = 0; i < state.apartments.length; i++) {
        const apm = state.apartments[i]
        const { uuid } = apm
        const idx = gts.findApmIdx(uuid)

        const initial = {
          price: 0,
          payments_schedule: [],
        }

        const credit = {
          price: 0,
          payments_schedule: [],
        }

        for (let j = 0; j < data.schedule.initial_payment.length; j++) {
          const p = data.schedule.initial_payment[j]
          initial.payments_schedule.push({
            type: 'initial',
            amount: fmd(p.amount),
            month: p.date,
            edit: p.edited,
            edited: p.edited,
          })
          initial.price += p.amount
        }

        for (let m = 0; m < data.schedule.monthly.length; m++) {
          const p = data.schedule.monthly[m]
          credit.payments_schedule.push({
            type: 'monthly',
            amount: fmd(p.amount),
            month: p.date,
            edit: p.edited,
            edited: p.edited,
          })
          credit.price += p.amount
        }

        dispatch('initialSetter', {
          idx,
          initial_payments: initial.payments_schedule,
        })
        dispatch('monthlySetter', {
          idx,
          credit_months: credit.payments_schedule,
        })

        const calc = {}
        calc.total = payments_details.total
        calc.initial_price = payments_details.initial_payment
        calc.remainder = calc.total - calc.initial_price
        calc.base_price = fmd(gts.getPrice(idx))

        state.apartments[i].edit.initial_price = true
        state.apartments[i].edit.monthly = true
        state.apartments[i].edit.discount = true

        if (isNotUndefinedNullEmptyZero(apm.calc.month)) {
          calc.monthly_payment = credit.price / apm.calc.month
          state.apartments[i].edit.monthly_payment_period = true
        }

        if (isNotUndefinedNullEmptyZero(data.discount_amount)) {
          calc.total_discount = data.discount_amount ?? 0
          calc.discount_per_m2 = calc.total_discount / state.apartments[i].plan.area
        }

        state.apartments[i].calc = { ...state.apartments[i].calc, ...calc }
      }
    } catch (e) {
      console.error(e)
    }
  },
  setup({ dispatch }, context) {
    dispatch('initValues', context)
    dispatch('calcApmPrices')
    dispatch('initAllApartmentsInitialPayment')
    dispatch('initAllApartmentsCreditMonths')
  },
  initValues({ commit }, context) {
    commit('initOtherProperties', context)
    commit('initApartments', context)
  },
  clearCheckoutState({ state }) {
    state.apartments = []
    state.trashStorage = []
    state.order = {}
    state.countryList = []
    state.clientData = {}
    state.expiry_at = null
    state.comment = ''
    state.componentFunction = 'create'
    state.contract_number = null
    state.created_by = null
  },
  calcApmPrices({ state, getters: gts }) {
    state.apartments = state.apartments.map(apartment => {
      const idx = gts.findApmIdx(apartment.id)
      return {
        ...apartment,
        edit: state.schema.edit,
        calc: gts.calcProperties(idx),
      }
    })
  },
  recalculateApmPrices({ state, getters: gts }, idx) {
    state.apartments[idx].calc = gts.calcProperties(idx)
  },
  rerenderApm({ commit, dispatch }, { idx }) {
    dispatch('recalculateApmPrices', idx)
    commit('reset')
  },
  updateApmDiscount({ getters: gts, commit, dispatch }, { apmId, discountId }) {
    const idx = gts.findApmIdx(apmId)
    const discount = gts.discount({ idx, discountId })
    commit('updateApartment', {
      idx,
      apm: { discount },
      edit: { prepay: false, initial_price: false, first_payment: false },
      calc: { discount, prepay: discount.prepay },
    })
    dispatch('rerenderApm', { idx })
    dispatch('initialPaymentsSetter', { index: idx })
    dispatch('monthlyPaymentsSetter', { index: idx })
  },
  setMonthlyPaymentPeriod(
    { getters: gts, commit, dispatch },
    { apmId, monthly_payment_period },
  ) {
    const apmIndex = gts.findApmIdx(apmId)
    commit('updateApartment', {
      idx: apmIndex,
      calc: { monthly_payment_period },
      edit: {
        monthly_payment_period: true,
        prepay: true,
        initial_price: false,
      },
    })

    dispatch('recalculateApmPrices', apmIndex)
    dispatch('initialPaymentsSetter', { index: apmIndex })
    dispatch('monthlyPaymentsSetter', { index: apmIndex })

    const prepay = fmd(
      (gts.getInitialPrice(apmIndex) / gts.getTotal(apmIndex)) * 100,
      10,
    )

    commit('updateApartment', {
      idx: apmIndex,
      calc: { prepay },
    })

    dispatch('rerenderApm', { idx: apmIndex })
  },
  editPrepay({ getters: gts, commit, dispatch }, { apmId, prepay }) {
    const apmIndex = gts.findApmIdx(apmId)
    commit('updateApartment', {
      idx: apmIndex,
      calc: { prepay },
      edit: { prepay: true, initial_price: false },
    })

    dispatch('initialPaymentsSetter', { index: apmIndex })
    dispatch('monthlyPaymentsSetter', { index: apmIndex })
    dispatch('rerenderApm', { idx: apmIndex })
  },
  editInitialPrice(
    {
      getters: gts, commit, dispatch, state,
    },
    { apmId, initial_price },
  ) {
    const apmIndex = gts.findApmIdx(apmId)

    const prepay = fmd((initial_price / gts.getTotal(apmIndex)) * 100, 10)
    commit('updateApartment', {
      idx: apmIndex,
      calc: { initial_price, prepay },
      edit: { initial_price: true },
    })

    dispatch('initialPaymentsSetter', { index: apmIndex })
    dispatch('monthlyPaymentsSetter', { index: apmIndex })
    dispatch('rerenderApm', { idx: apmIndex })
  },
  turnInitialEditStateOn({ getters: gts, state }, { apmId }) {
    const apmIndex = gts.findApmIdx(apmId)
    state.apartments[apmIndex].edit.first_payment = true
  },
  turnInitialEditStateOff({ getters: gts, state }, { apmId }) {
    const apmIndex = gts.findApmIdx(apmId)
    state.apartments[apmIndex].edit.first_payment = false
  },
  updateDiscount(
    { getters: gts, commit, dispatch },
    { apmId, discount_per_m2, total_discount },
  ) {
    const apmIndex = gts.findApmIdx(apmId)

    commit('updateApartment', {
      idx: apmIndex,
      calc: { discount_per_m2, total_discount },
      edit: { discount: true },
    })

    dispatch('initialPaymentsSetter', { index: apmIndex })
    dispatch('monthlyPaymentsSetter', { index: apmIndex })
    dispatch('rerenderApm', { idx: apmIndex })
  },
  updateFirstPaymentDate(
    { getters: gts, commit, dispatch },
    { apmId, first_payment_date },
  ) {
    const apmIndex = gts.findApmIdx(apmId)
    commit('updateApartment', {
      idx: apmIndex,
      calc: { first_payment_date },
    })
    dispatch('initialPaymentsSetter', { index: apmIndex })
    dispatch('monthlyPaymentsSetter', { index: apmIndex })
    commit('reset')
  },
  updatePaymentDate(
    { getters: gts, commit, dispatch },
    { apmId, payment_date },
  ) {
    const apmIndex = gts.findApmIdx(apmId)
    commit('updateApartment', {
      idx: apmIndex,
      calc: { payment_date },
    })
    dispatch('initialPaymentsSetter', { index: apmIndex })
    dispatch('monthlyPaymentsSetter', { index: apmIndex })
    commit('reset')
  },
  initAllApartmentsInitialPayment({ state, dispatch }) {
    state.apartments.forEach(({ id }) => dispatch('initialPaymentsSetter', { uuid: id }))
  },
  initAllApartmentsCreditMonths({ state, dispatch }) {
    state.apartments.forEach(({ id }) => dispatch('creditMonthsSetter', { uuid: id }))
  },
  initialSetter({ state }, { idx, initial_payments }) {
    state.apartments[idx].calc.initial_payments = initial_payments
  },
  initialAdditionSetter({ state }, { idx, payment }) {
    state.apartments[idx].calc.initial_payments.push(payment)
  },
  initialPaymentsSetter({ getters: gts, dispatch }, { index, uuid }) {
    const idx = index ?? gts.findApmIdx(uuid)
    const apm = gts.getApm({ idx })
    const { first_payment_date } = apm.calc
    const today = first_payment_date ? new Date(first_payment_date) : new Date()
    const {
      year: todayYear,
      month: todayMonth,
      dayOfMonth: todayDate,
    } = dateProperties(today)
    const lastDayOfMonth = new Date(todayYear, todayMonth + 1, 0)
    const lastDateOfCurrentMonth = lastDayOfMonth.getDate()
    const calculateByLastDay = todayDate === lastDateOfCurrentMonth
    dispatch('initialSetter', { idx, initial_payments: [] })
    const initialMonth = {
      type: 'initial',
      amount: fmd(gts.getInitialPrice(idx)),
      edit: false,
      edited: false,
      month: new Date(today),
    }
    initialMonth.month = calculateByLastDay ? lastDayOfMonth : new Date(today)
    dispatch('initialAdditionSetter', { idx, payment: initialMonth })
  },
  creditMonthsSetter({ getters: gts, dispatch }, { uuid }) {
    const idx = gts.findApmIdx(uuid)
    const apm = gts.getApm({ idx })
    if (gts.getMonthlyPaymentAmount(idx) && gts.getPrepay(idx) !== 100) {
      const { payment_date, monthly_payment_period } = apm.calc
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
      dispatch('monthlySetter', { idx, credit_months: [] })
      if (monthly_payment_period > 0) {
        const prepay = gts.getPrepay(idx)
        const numsMonth = gts.getMonth(idx)
        const monthlyTotal = gts.getMonthlyTotalPrice(idx)

        const { adjustedMonthlyPayment, lastMonthPayment } = calculateMonthlyPayment(monthlyTotal, numsMonth)

        const creditMonth = {
          // amount: fmd(gts.getMonthlyPaymentAmount(idx)),
          amount: fmd(adjustedMonthlyPayment),
          edit: false,
          edited: false,
          month: today,
          type: 'monthly',
        }

        for (let i = 0; i < monthly_payment_period - 1; i++) {
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
          dispatch('monthlyAdditionSetter', { idx, payment: creditMonth })
        }

        const lastDayOfMonth = new Date(todayYear, todayMonth + 1, 0)
        if (numsMonth === 1) {
          creditMonth.month = calculateByLastDay
            ? lastDayOfMonth
            : today.setMonth(today.getMonth())
        } else {
          creditMonth.month = calculateByLastDay
            ? lastDayOfMonth
            : today.setMonth(today.getMonth() + 1)
        }

        dispatch('monthlyAdditionSetter', {
          idx,
          payment: {
            ...creditMonth,
            amount: fmd(lastMonthPayment),
          },
        })
      }
    } else {
      dispatch('monthlySetter', { idx, credit_months: [] })
    }
  },
  monthlyPaymentsSetter({ state, getters: gts, dispatch }, { index, uuid }) {
    const idx = index ?? gts.findApmIdx(uuid)
    const { payment_date, monthly_payment_period } = state.apartments[idx].calc
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
    dispatch('monthlySetter', { idx, credit_months: [] })
    const dCredit = {
      amount: fmd(gts.getMonthlyPaymentAmount(idx)),
      edit: false,
      edited: false,
      month: today,
      type: 'monthly',
    }

    const prepay = gts.getPrepay(idx)
    const numsMonth = gts.getMonth(idx)
    const monthlyTotal = gts.getMonthlyTotalPrice(idx)

    const { adjustedMonthlyPayment, lastMonthPayment } = calculateMonthlyPayment(monthlyTotal, numsMonth)

    if (state.version === 2) {
      dCredit.amount = fmd(adjustedMonthlyPayment)
    }

    if (numsMonth > 0 && prepay !== 100) {
      if (monthly_payment_period > 0) {
        const loopPeriod = state.version === 2 ? numsMonth - 1 : numsMonth
        for (let i = 0; i < loopPeriod; i++) {
          const lastDayOfMonth = new Date(todayYear, todayMonth + i + 1, 0)
          if (i === 0) {
            dCredit.month = calculateByLastDay
              ? lastDayOfMonth
              : today.setMonth(today.getMonth())
          } else {
            dCredit.month = calculateByLastDay
              ? lastDayOfMonth
              : today.setMonth(today.getMonth() + 1)
          }
          state.apartments[idx].calc.credit_months.push({ ...dCredit })
        }

        if (state.version === 2) {
          const lastDayOfMonth = new Date(todayYear, todayMonth + 1, 0)
          if (numsMonth === 1) {
            dCredit.month = calculateByLastDay
              ? lastDayOfMonth
              : today.setMonth(today.getMonth())
          } else {
            dCredit.month = calculateByLastDay
              ? lastDayOfMonth
              : today.setMonth(today.getMonth() + 1)
          }

          state.apartments[idx].calc.credit_months.push({
            ...dCredit,
            amount: fmd(lastMonthPayment),
          })
        }
      }
    } else {
      dispatch('monthlySetter', { idx, credit_months: [] })
    }
  },
  monthlySetter({ state }, { idx, credit_months }) {
    state.apartments[idx].calc.credit_months = credit_months
  },
  monthlyAdditionSetter({ state }, { idx, payment }) {
    state.apartments[idx].calc.credit_months.push({
      ...payment,
      month: payment.month,
    })
  },
  editSchedule({ state }, { idx, payment }) {
    const {
      amount, type, month, tracker,
    } = payment
    const paymentType = type === 'initial' ? 'initial_payments' : 'credit_months'
    const index = state.apartments[idx].calc[paymentType].findIndex(
      pm => pm.amount === tracker.amount && pm.month === tracker.month,
    )
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
  editPaymentSchedule({ getters: gts, commit, dispatch }, { payment, apmId }) {
    const idx = gts.findApmIdx(apmId)
    dispatch('editSchedule', { payment, idx })
    commit('sortPaymentSchedule', { type: payment.type, idx })
    if (payment.amount) {
      dispatch('reInitCalc', { payment, idx })
    }

    if (payment.type === 'initial') {
      commit('setInitialResult', {
        idx,
        initial: gts.initiallyTotal(idx),
      })
      commit('setRemainAmount', {
        idx,
        remainPrice: gts.getTotal(idx) - gts.initiallyTotal(idx),
      })
    }

    dispatch('rerenderApm', { idx })
  },
  reInitCalc({ getters: gts, dispatch }, { payment, idx }) {
    if (payment.type === 'initial') {
      if (gts.getMonth(idx)) {
        const excessAmount = (gts.getTotal(idx) - gts.initiallyTotal(idx)) / gts.getMonth(idx)
        dispatch('changeMonthly', { idx, monthly: excessAmount })
        // commit('setMonthlyAmount', excessAmount)
      }
    } else if (payment.type === 'monthly') {
      if (gts.uneditedMonthly(idx).length) {
        const monthly = (gts.getMonthlyTotalPrice(idx) - gts.getMonthlyEditTotalPrice(idx))
                    / gts.uneditedMonthly(idx).length
        dispatch('changeMonthlyByEdit', { idx, monthly })
      } else {
        const remainToInitial = gts.getTotal(idx) - gts.creditMonthTotal(idx)
        if (gts.uneditedInitial(idx).length) {
          const initially = (remainToInitial - gts.getInitialEditTotalPrice(idx))
                        / gts.uneditedInitial(idx).length
          dispatch('changeInitiallyByEdit', { idx, initially })
        } else {
          const initialMonthly = remainToInitial / gts.getInitialPayments(idx).length
          dispatch('changeInitially', { idx, initially: initialMonthly })
        }
      }
    }
  },
  changeMonthly({ state }, { monthly, idx }) {
    state.apartments[idx].calc.credit_months = state.apartments[
      idx
    ].calc.credit_months.map(creditMonth => ({
      ...creditMonth,
      amount: fmd(monthly),
    }))
  },
  changeMonthlyByEdit({ state }, { idx, monthly }) {
    state.apartments[idx].calc.credit_months = state.apartments[
      idx
    ].calc.credit_months.map(creditMonth => {
      if (!creditMonth.edit) {
        return {
          ...creditMonth,
          amount: fmd(monthly),
        }
      }
      return creditMonth
    })
  },
  changeInitially({ state }, { idx, initially }) {
    state.apartments[idx].calc.initial_payments = state.apartments[
      idx
    ].calc.initial_payments.map(creditMonth => ({
      ...creditMonth,
      amount: fmd(initially),
    }))
  },
  changeInitiallyByEdit({ state }, { idx, initially }) {
    state.apartments[idx].calc.initial_payments = state.apartments[
      idx
    ].calc.initial_payments.map(initPm => {
      if (!initPm.edit) {
        return {
          ...initPm,
          amount: fmd(initially),
        }
      }
      return initPm
    })
  },
  addNewPaymentSchedule(
    {
      state, getters: gts, commit, dispatch,
    },
    { apmId, payment },
  ) {
    const idx = gts.findApmIdx(apmId)
    const { type } = payment
    dispatch('addPaymentSchedule', { apmId, payment })
    commit('sortPaymentSchedule', { idx, type })
    commit('reorderScheduleDate', { idx, type })

    dispatch('reInitCalc', { idx, payment })

    if (type === 'monthly') {
      commit('setMonth', {
        idx,
        monthly_payment_period: gts.getCreditMonths(idx).length,
      })
    }

    if (type === 'initial') {
      commit('setInitialResult', { idx, initial: gts.initiallyTotal(idx) })
      commit('setRemainAmount', {
        idx,
        remainPrice: gts.getTotal(idx) - gts.initiallyTotal(idx),
      })
    }

    dispatch('rerenderApm', { idx })
  },
  addPaymentSchedule({ state, getters: gts, dispatch }, { apmId, payment }) {
    const idx = gts.findApmIdx(apmId)
    const {
      amount, month, type, edit,
    } = payment
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
      const { length } = state.apartments[idx].calc.initial_payments
      if (length === 1) {
        const initialPerMonth = gts.getInitialPrice(idx) / (length + 1)
        dispatch('initialAdditionSetter', { idx, payment: schedule })
        state.apartments[idx].calc.initial_payments = state.apartments[
          idx
        ].calc.initial_payments.map(initial => ({
          ...initial,
          amount: fmd(initialPerMonth),
        }))
      } else {
        dispatch('initialAdditionSetter', {
          idx,
          payment: { ...schedule, amount: 0 },
        })
      }
    } else {
      dispatch('monthlyAdditionSetter', { idx, payment: schedule })
    }

    dispatch('rerenderApm', { idx })
  },
  deletePaymentSchedule(
    { getters: gts, commit, dispatch },
    { apmId, payment },
  ) {
    const idx = gts.findApmIdx(apmId)
    commit('deleteSchedule', { idx, payment })

    dispatch('reInitCalc', { idx, payment })

    if (payment.type === 'monthly') {
      commit('setMonth', {
        idx,
        monthly_payment_period: gts.getCreditMonths(idx).length,
      })
    }

    if (payment.type === 'initial') {
      if (gts.getInitialPayments(idx).length === 1) {
        commit('setInitialResult', { idx, initial: gts.getTotal(idx) })
        dispatch('initialPaymentsSetter', { index: idx })
      } else {
        commit('setInitialResult', { idx, initial: gts.initiallyTotal(idx) })
      }
      commit('setRemainAmount', {
        idx,
        remainPrice: gts.getTotal(idx) - gts.initiallyTotal(idx),
      })
    }

    dispatch('rerenderApm', { idx })
  },
  setIndividualPrice(
    { getters: gts, commit, dispatch },
    {
      index, apmId, starting_price, price_m2,
    },
  ) {
    const idx = index ?? gts.findApmIdx(apmId)
    commit('updateApartment', {
      idx,
      calc: {
        other: { starting_price, price_m2 },
      },
    })

    dispatch('rerenderApm', { idx })
    dispatch('initialPaymentsSetter', { index: idx })
    dispatch('monthlyPaymentsSetter', { index: idx })
  },
  updateValidationState({ getters: gts, commit }, { index, apmId, validate }) {
    const idx = index ?? gts.findApmIdx(apmId)
    commit('updateApartment', { idx, validate })
    commit('reset')
  },
  removeApartment({ state, getters: gts }, { index, apmId }) {
    const idx = index ?? gts.findApmIdx(apmId)
    state.trashStorage.push({ idx, a: state.apartments[idx] })
    state.apartments.splice(idx, 1)
  },
  returnRemovedApartments({ state }) {
    state.trashStorage.forEach(({ idx, a }) => {
      state.apartments.splice(idx, 0, a)
    })
    state.trashStorage = []
  },
  changeContractNumber(
    { getters: gts, commit },
    { index, apmId, contractNumber },
  ) {
    const idx = index ?? gts.findApmIdx(apmId)
    commit('updateContractNumber', { idx, contractNumber })
  },
  updateApmContractDate({ state, getters: gts }, { apmId, contractDate }) {
    const idx = gts.findApmIdx(apmId)
    state.apartments[idx].calc.contract_date = contractDate
  },
  changeFirstAttempt({ state, getters: gts }, { apmId, firstAttempt }) {
    const idx = gts.findApmIdx(apmId)
    state.apartments[idx].edit.first_attempt = firstAttempt
  },
}
