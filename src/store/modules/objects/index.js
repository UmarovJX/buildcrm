export default {
    actions: {
        async fetchObjects(ctx, vm) {
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/objects', header);
                const objects = response.data;

                ctx.commit('updateObjects', objects);
            } catch (error) {
                if (! error.response) {
                    vm.toasted('Error: Network Error', 'error');
                } else {
                    vm.toasted(error.response.data.message, 'error');
                }
            }
        }
    },

    state: {
      objects: []
    },

    mutations: {
        updateObjects(state, objects) {
            state.objects = objects;
        }
    },

    getters: {
        getObjects(state) {
            return state .objects;
        }
    }
}
