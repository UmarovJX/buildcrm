export default {
    methods: {
        toasted(message, type) {
            return this.$toasted.show(message, { type: type });
        },
    },
};