import { dateProperties } from '@/util/calendar'
import { numberFormatDecimal as fmd } from '@/util/numberHelper'
import { setAppropriateCreditMonth } from '@/util/checkout'

export default {
  setFunctionType(state, route) {
    const pathUnits = route.path.split('/')
    if (pathUnits[pathUnits.length - 1] === 'update') {
      state.componentFunction = state.functionTypesList[1]
    } else {
      state.componentFunction = state.functionTypesList[0]
    }
  },
  initOtherProperties(state, context) {
    const { uuid, expiry_at, created_by } = context
    state.uuid = uuid
    state.order = context
    state.expiry_at = expiry_at
    state.created_by = created_by
  },
  initApartments(state, { orders }) {
    state.apartments = orders.map(
      ({
        status, contract_number, apartment: apm, uuid,
      }) => {
        const discount = apm.discounts[0]
        return {
          status,
          contract_date: new Date(),
          contract_number,
          order_uuid: uuid,
          id: apm.uuid,
          ...apm,
          calc: {
            ...state.schema.calc,
            price: apm.price,
            price_m2: apm.price_m2,
            plan: apm.plan,
            discount,
            monthly_payment_period: setAppropriateCreditMonth(
              state,
              apm,
              discount,
            ),
            prepay: discount.prepay,
            other: {
              starting_price: apm.price,
              price_m2: apm.price_m2,
            },
          },
          edit: state.schema.edit,
          validate: state.schema.validate,
        }
      },
    )
  },
  updateApartment(state, {
    idx, apm, calc, edit, validate,
  }) {
    state.apartments[idx] = {
      ...state.apartments[idx],
      ...apm,
      edit: { ...state.apartments[idx].edit, ...edit },
      calc: { ...state.apartments[idx].calc, ...calc },
      validate: { ...state.apartments[idx].validate, ...validate },
    }
  },
  sortPaymentSchedule(state, { type, idx }) {
    const paymentType = type === 'initial' ? 'initial_payments' : 'credit_months'
    state.apartments[idx].calc[paymentType] = state.apartments[idx].calc[
      paymentType
    ].sort((a, b) => {
      const { time: aTime } = dateProperties(a.month, 'string')
      const { time: bTime } = dateProperties(b.month, 'string')
      return aTime - bTime
    })
  },
  reset(state) {
    state.apartments = [...state.apartments]
  },
  setInitialResult(state, { idx, initial }) {
    state.apartments[idx].edit.initial_price = true
    state.apartments[idx].calc.initial_price = fmd(initial)
  },
  setRemainAmount(state, { idx, remainPrice }) {
    state.apartments[idx].calc.remainder = fmd(remainPrice)
  },
  setMonth(state, { idx, monthly_payment_period }) {
    state.apartments[idx].calc.monthly_payment_period = monthly_payment_period
  },
  deleteSchedule(state, { idx, payment }) {
    const { type, amount, month } = payment
    const paymentType = type === 'initial' ? 'initial_payments' : 'credit_months'
    const deleteIndex = state.apartments[idx].calc[paymentType].findIndex(
      pm => pm.type === type && pm.month === month && pm.amount === amount,
    )
    if (deleteIndex !== -1) {
      state.apartments[idx].calc[paymentType].splice(deleteIndex, 1)
    }
  },
  reorderScheduleDate(state, { idx, type }) {
    const paymentType = type === 'initial' ? 'initial_payments' : 'credit_months'
    for (
      let index = 0;
      index < state.apartments[idx].calc[paymentType].length;
      index++
    ) {
      const payment = state.apartments[idx].calc[paymentType][index]
      if (index) {
        const previousMonth = state.apartments[idx].calc[paymentType][index - 1].month
        const { lastDayOfMonth, isLastDayOfMonth, nextMonthOfDate } = dateProperties(payment.month, 'string')
        const nextMonth = isLastDayOfMonth ? lastDayOfMonth : nextMonthOfDate
        if (payment.month === previousMonth) {
          state.apartments[idx].calc[paymentType][index] = {
            ...payment,
            month: nextMonth,
          }
        }
      }
    }
  },
  setClientData(state, clientData) {
    state.clientData = clientData
  },
  updateContractNumber(state, { idx, contractNumber }) {
    state.apartments[idx].contract_number = contractNumber
    state.apartments[idx].edit.contract_number = true
  },
  setCountryList(state, countries) {
    state.countryList = countries
  },
  setClientTypeList(state, clientTypes) {
    state.clientTypeList = clientTypes
  },
}
