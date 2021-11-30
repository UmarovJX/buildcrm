export default {
    actions: {
        async fetchCompanies(ctx, vm) {
            ctx.commit('updateLoading', true, { root: true });
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.get(process.env.VUE_APP_URL + '/companies', header);
                const companies = response.data;
                ctx.commit('updateCompanies', companies);
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

        async fetchBranch(ctx, vm) {
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.get(process.env.VUE_APP_URL + '/companies/' + vm.company_id , header);
                const branch = response.data;
                ctx.commit('updateBranch', branch);
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

        async fetchBranchTypes(ctx, vm) {
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.get(process.env.VUE_APP_URL + '/companies/types', header);
                const types = response.data;
                ctx.commit('updateBranchTypes', types);
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

    state: {
        companies: [],
        types: [],
        branch: {}
    },

    mutations: {
        updateCompanies(state, companies) {
            state.companies = companies;
        },

        updateBranchTypes(state, types) {
            state.types = types;
        },

        updateBranch(state, branch) {
            state.branch = branch;
        },

    },

    getters: {
        getCompanies(state) {
            return state.companies;
        },

        getBranchTypes(state) {
            return state.types;
        },

        getBranch(state) {
            return state.branch;
        },
    }
}
