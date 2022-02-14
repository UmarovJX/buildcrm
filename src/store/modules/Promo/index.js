export default {
    actions: {},

    state: {
        promoFormButtonClicked: false,
        editHistoryContext: {}
    },

    mutations: {
        mutateFormButton(state) {
            state.promoFormButtonClicked = !state.promoFormButtonClicked
        },
        changeEditHistory(state, currentHistory) {
            state.editHistoryContext = currentHistory
        }
    },

    getters: {
        togglePromoSubmitButton: (state) => state.promoFormButtonClicked,
        getEditHistoryContext: (state) => state.editHistoryContext
    }
};
