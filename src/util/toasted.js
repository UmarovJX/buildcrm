export default {
    methods: {
        toasted(message, type) {
            return this.$toasted.show(message, { type: type });
        },

        toastedWithErrorCode(error) {
            if (! error.response) {
                this.toasted('Error: Network Error', 'error');
            } else {
                if (error.response.status === 403) {
                    this.toasted(error.response.data.message, 'error');
                } else if (error.response.status === 401) {
                    this.toasted(error.response.data.message, 'error');
                } else if (error.response.status === 405) {
                    this.toasted('Method not found', 'error');
                } else if (error.response.status === 500) {
                    this.toasted(error.response.data.message, 'error');
                } else {
                    this.toasted(error.response.data.message, 'error');
                }
            }
        }
    },
};
