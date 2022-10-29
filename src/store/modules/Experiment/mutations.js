import {dateProperties} from "@/util/calendar";

export default {
    initOtherProperties(state, context) {
        const {
            uuid,
            expiry_at,
            created_by,
            contract_number,
        } = context
        state.uuid = uuid
        state.order = context
        state.expiry_at = expiry_at
        state.created_by = created_by
        state.contract_number = contract_number
    },
    initApartments(state, {apartments}) {
        state.apartments = apartments.map(apm => {
            const discount = apm.discounts[0]
            return {
                ...apm,
                calc: {
                    ...state.schema.calc,
                    price: apm.price,
                    price_m2: apm.price_m2,
                    plan: apm.plan,
                    discount,
                    prepay: discount.prepay
                },
                edit: state.schema.edit
            }
        })
    },
    updateApartment(state, {idx, apm, calc, edit}) {
        state.apartments[idx] = {
            ...state.apartments[idx],
            ...apm,
            edit: {...state.apartments[idx].edit, ...edit},
            calc: {...state.apartments[idx].calc, ...calc}
        }
    },
    sortPaymentSchedule(state, {type,idx}) {
        let paymentType = type === 'initial' ? 'initial_payments' : 'credit_months'
        state.apartments[idx].calc[paymentType] = state.apartments[idx].calc[paymentType].sort((a, b) => {
            const {time: aTime} = dateProperties(a.month, 'string')
            const {time: bTime} = dateProperties(b.month, 'string')
            return aTime - bTime
        })
    },
    reset(state) {
        state.apartments = [...state.apartments]
    }
}