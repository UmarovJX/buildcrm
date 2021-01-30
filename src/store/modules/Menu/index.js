export default {
    actions: {

        fetchMenu(ctx, vm) {
            let header = {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            };

            vm.axios.get(process.env.VUE_APP_URL + '/menus', header).then((response) => {
                ctx.commit('updateMenus', response.data);
            }).catch(() => {
                localStorage.clear();
            });

        }

    },

    mutations: {
        updateMenus (state, result) {
            state.menus = result;
        }
    },

    state: {
        menus: []
    },

    getters: {
        getMenus (state) {
            return state.menus;
        }
    }
}
