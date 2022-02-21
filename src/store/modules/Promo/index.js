export default {
    actions: {},

    state: {
        promoFormButtonClicked: false,
        editHistoryContext: {},
        creationSelectedBlocks: []
    },

    mutations: {
        makeDefaultCreationSelectedBlocks(state) {
            state.creationSelectedBlocks = []
        },
        setUpSelectedBlocks(state, blocks) {
            state.creationSelectedBlocks = blocks
        },
        mutateFormButton(state) {
            state.promoFormButtonClicked = !state.promoFormButtonClicked
        },
        changeEditHistory(state, currentHistory) {
            state.editHistoryContext = currentHistory
        },
        updateCreationSelectedBlocks(state, updatingValue) {
            const {id, prepay} = updatingValue
            if (state.creationSelectedBlocks.length) {
                const findIndex = state.creationSelectedBlocks.findIndex(selectedBlock => {
                    return selectedBlock.id === id && selectedBlock.prepay === prepay
                })

                if (findIndex !== -1) {
                    state.creationSelectedBlocks = state.creationSelectedBlocks.map(selectedBlock => {
                        if (selectedBlock.id === id && selectedBlock.prepay === prepay) {
                            return updatingValue
                        }

                        return selectedBlock
                    })
                } else {
                    state.creationSelectedBlocks.push(updatingValue)
                }

            } else {
                state.creationSelectedBlocks.push(updatingValue)
            }
        },
        deletePromoCreationBlock(state, prepay) {
            state.creationSelectedBlocks = state.creationSelectedBlocks.filter(selectedBlock => selectedBlock.prepay !== prepay)
        }
    },

    getters: {
        togglePromoSubmitButton: (state) => state.promoFormButtonClicked,
        getEditHistoryContext: (state) => state.editHistoryContext,
        getSelectedBlocks: (state) => state.creationSelectedBlocks
    }
};
