export default {
    state: {
        fastPlanImage: null
    },

    mutations: {
        updateFastPlanImage(state, fastPlanImage) {
            state.fastPlanImage = fastPlanImage;
        },
    },

    getters: {
        getFastPlanImage(state) {
            return state.fastPlanImage;
        },
    },

};
