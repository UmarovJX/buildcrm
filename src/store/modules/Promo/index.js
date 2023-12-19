export default {
  actions: {},

  state: {
    promoFormButtonClicked: false,
    editHistoryContext: {},
    creationSelectedBlocks: [],
    showPromoError: false,
  },

  mutations: {
    togglePromoError(state) {
      state.showPromoError = !state.showPromoError
    },
    makeDefaultCreationSelectedBlocks(state) {
      state.creationSelectedBlocks = []
    },
    setUpSelectedBlocks(state, blocks) {
      state.creationSelectedBlocks = blocks
    },
    updatePromoValue(state, { next, prepayId }) {
      const findIndex = state.creationSelectedBlocks.findIndex(
        selectedBlock => selectedBlock.prepayId === prepayId,
      )
      if (findIndex !== -1) {
        state.creationSelectedBlocks[findIndex].discount.prepay = parseFloat(next)
      }
    },
    mutateFormButton(state) {
      state.promoFormButtonClicked = !state.promoFormButtonClicked
    },
    changeEditHistory(state, currentHistory) {
      state.editHistoryContext = currentHistory
    },
    updateCreationSelectedBlocks(state, updatingValue) {
      const { id, discount } = updatingValue
      if (state.creationSelectedBlocks.length) {
        const findIndex = state.creationSelectedBlocks.findIndex(
          selectedBlock => (
            selectedBlock.id === id
              && selectedBlock.discount.prepay === discount.prepay
          ),
        )

        if (findIndex !== -1) {
          state.creationSelectedBlocks = state.creationSelectedBlocks.map(
            selectedBlock => {
              if (
                selectedBlock.id === id
                && selectedBlock.discount.prepay === discount.prepay
              ) {
                return updatingValue
              }

              return selectedBlock
            },
          )
        } else {
          state.creationSelectedBlocks.push(updatingValue)
        }
      } else {
        state.creationSelectedBlocks.push(updatingValue)
      }
    },
    deletePromoCreationBlock(state, prepay) {
      state.creationSelectedBlocks = state.creationSelectedBlocks.filter(
        selectedBlock => selectedBlock.discount.prepay !== prepay,
      )
    },
    deleteRemovedBlock(state, { prepayId, id }) {
      const findIndex = state.creationSelectedBlocks.findIndex(
        creationBlock => creationBlock.id === id && creationBlock.prepayId === prepayId,
      )
      state.creationSelectedBlocks.splice(findIndex, 1)
    },
  },

  getters: {
    togglePromoSubmitButton: state => state.promoFormButtonClicked,
    getEditHistoryContext: state => state.editHistoryContext,
    getSelectedBlocks: state => state.creationSelectedBlocks,
    getInputValidationError: state => state.showPromoError,
  },
}
