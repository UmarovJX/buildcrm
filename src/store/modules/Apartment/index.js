import api from "@/services/api";

export default {
    actions: {
        async fetchApartment(ctx, vm) {
            ctx.commit("updateLoading", true, {root: true});
            try {
                const {object, id} = vm.$route.params
                const {data} = await api.objectsV2.fetchObjectsApartment(object, id)
                ctx.commit("updateApartmentView", data);
                ctx.commit("updateLoading", false, {root: true});
            } catch (error) {
                vm.toastedWithErrorCode(error);
            }
        },
    },

    mutations: {
        updateApartmentView(state, apartment) {
            state.apartment = apartment;
        },
    },

    state: {
        apartment: {},
    },

    getters: {
        getApartment(state) {
            return state.apartment;
        },
    },
};
