import api from "@/services/api";

export default {
    actions: {
        async fetchPlans(ctx, vm) {
            ctx.commit("updateLoading", true, {root: true});

            try {
                const response = await api.objects.getObjectPlans(vm.$route.params.id)
                const plans = response.data;

                ctx.commit("updatePlan", plans);
                ctx.commit("updateLoading", false, {root: true});
            } catch (error) {
                if (!error.response) {
                    vm.toasted("Error: Network Error", "error");
                } else {
                    if (error.response.status === 403) {
                        vm.toasted(error.response.data.message, "error");
                    } else if (error.response.status === 401) {
                        vm.toasted(error.response.data.message, "error");
                    } else if (error.response.status === 500) {
                        vm.toasted(error.response.data.message, "error");
                    } else {
                        vm.toasted(error.response.data.message, "error");
                    }
                }
            }
        },

        async fetchPlan(ctx, vm) {
            try {
                const {object, id} = vm.$route.params
                const response = await api.objects.fetchObjectPlan(object, id)
                const plan = response.data;

                ctx.commit("updatePlan", plan);
            } catch (error) {
                if (!error.response) {
                    vm.toasted("Error: Network Error", "error");
                } else {
                    if (error.response.status === 403) {
                        vm.toasted(error.response.data.message, "error");
                    } else if (error.response.status === 401) {
                        vm.toasted(error.response.data.message, "error");
                    } else if (error.response.status === 500) {
                        vm.toasted(error.response.data.message, "error");
                    } else {
                        vm.toasted(error.response.data.message, "error");
                    }
                }
            }
        },
    },

    mutations: {
        updatePlan(state, object) {
            state.object = object
        }
    },

    state: {
        object: {},
    },

    getters: {
        getPlan(state) {
            return state.object;
        },
    },
};
