import Checkout from "@/util/checkout";

export default {
    state: {
        checkout: null
    },

    getters: {
        getCheckoutContext: (state) => state.checkout
    },

    mutations: {
        initializeCheckout(state, {apartments, order}) {
            const stateApartments = apartments.map(apartment => {
                return {
                    ...apartment,
                    calc: {
                        id: apartment.id,
                        other_price: false,
                        price: apartment.price,
                        area: apartment.plan.area,
                        price_m2: apartment.price_m2,
                        total_discount: 0,
                        discount_per_m2: 0,
                    }
                }
            })

            const {created_by, contract_number, expiry_at, uuid} = order

            const calc = {
                prepayment: null,
                monthly_payment_period: 20,
                initial_price: 0,
                first_payment_date: null,
                payment_date: null,
                total: 0,
                monthly_payment: 0,
                remainder: 0,
                base_price: 0
            }

            const defaultDiscount = stateApartments[0].discounts[0]
            state.checkout = new Checkout(stateApartments, {
                month: 12,
                calc,
                uuid,
                expiryAt: expiry_at,
                createdBy: created_by,
                discount: defaultDiscount,
                contractNumber: contract_number,
            })
        },
        updateApartmentDetails(state, item) {
            const index = state.checkout.apartments.findIndex((apt => apt.id === item.id))
            if (index !== -1) {
                state.checkout.apartments[index].calc = item
            }
        },
        updateCheckoutState(state) {
            state.checkout.updateCheckoutState()
        }
    },

    actions: {},
}
