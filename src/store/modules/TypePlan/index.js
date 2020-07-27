export default {
    actions: {
        async fetchPlans(ctx, vm) {
            ctx.commit('updateLoading', true, { root: true });

            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/type/plan/' + vm.$route.params.id, header);
                const plans = response.data.plans;
                const object = response.data.object;

                ctx.commit('updatePlans', plans);
                ctx.commit('updateObject', object);
                ctx.commit('updateLoading', false, { root: true });

            } catch (error) {
                if (! error.response) {
                    vm.toasted('Error: Network Error', 'error');
                } else {
                    if (error.response.status === 403) {
                        vm.toasted(error.response.data.message, 'error');
                    } else if (error.response.status === 401) {
                        vm.toasted(error.response.data.message, 'error');
                    } else if (error.response.status === 500) {
                        vm.toasted(error.response.data.message, 'error');
                    } else {
                        vm.toasted(error.response.data.message, 'error');
                    }
                }
            }
        },

        async fetchPlan(ctx, vm)
        {
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/type/plan/update/' + vm.$route.params.object +'/' + vm.$route.params.id, header);
                const plan = response.data.plan;
                const object = response.data.object;

                ctx.commit('updatePlan', plan);
                ctx.commit('updateObject', object);

            } catch (error) {
                if (! error.response) {
                    vm.toasted('Error: Network Error', 'error');
                } else {
                    if (error.response.status === 403) {
                        vm.toasted(error.response.data.message, 'error');
                    } else if (error.response.status === 401) {
                        vm.toasted(error.response.data.message, 'error');
                    } else if (error.response.status === 500) {
                        vm.toasted(error.response.data.message, 'error');
                    } else {
                        vm.toasted(error.response.data.message, 'error');
                    }
                }
            }
        }
    },

    mutations: {
        updatePlans(state, plans) {
            state.plans = plans;
        },

        updatePlan(state, plan) {
            state.plan = plan;
        },

        updateObject(state, object) {
            state.object = object
        }
    },

    state: {
        plans: [],
        object: {},
        plan: {}
    },

    getters: {
        getPlans(state) {
            return state.plans;
        },

        getPlan(state) {
            return state.plan;
        },

        getPlanObject(state) {
            return state.object;
        }
    }
}
