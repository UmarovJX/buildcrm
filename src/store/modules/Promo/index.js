export default {
    actions: {},

    state: {
        promoFormButtonClicked: false,
        editHistoryContext: {},
        creationSelectedBlocks: []
    },

    mutations: {
        mutateFormButton(state) {
            state.promoFormButtonClicked = !state.promoFormButtonClicked
        },
        changeEditHistory(state, currentHistory) {
            state.editHistoryContext = currentHistory
        },
        updateCreationSelectedBlocks(state, updatingValue) {
            state.creationSelectedBlocks = updatingValue
        }
    },

    getters: {
        togglePromoSubmitButton: (state) => state.promoFormButtonClicked,
        getEditHistoryContext: (state) => state.editHistoryContext,
        getSelectedBlocks: (state) => state.creationSelectedBlocks,
    }
};
