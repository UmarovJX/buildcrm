export default {
    actions: {},

    state: {
        promoFormButtonClicked: false
    },

    mutations: {
        mutateFormButton(state) {
            state.promoFormButtonClicked = !state.promoFormButtonClicked
        }
    },

    getters: {
        togglePromoSubmitButton:(state) => state.promoFormButtonClicked
    }
};
