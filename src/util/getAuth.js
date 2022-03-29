import api from "@/services/api";

export default {
    methods: {
        async getAuth2() {
            const vm = this;
            let res = false;

            if (localStorage.getItem('auth__access__token')) {
                try {

                    const response = await api.authV1.checkAuth()

                    res = response.data.status;
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

                    res = false;
                }
            }

            return res;
        },
    },
};
