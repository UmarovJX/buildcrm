export default {

    methods: {
        async getAuth2() {
            const vm = this;
            let res = false;

            if (localStorage.token) {
                try {
                    const response = await this.axios.get(process.env.VUE_APP_URL + '/api/auth/check', {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.token,
                        },
                    });

                    res = response.data.status;
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

                    res = false;
                }
            }

           return res;
        }
    },
};
