<template>
    <div>
        <div class="container">
            <div class="col-md-12 mt-3">
                <div class="row">
                    <div class="col-md-3 mt-3" v-for="(object, index) in getObjects" :key="index">
                        <div class="card  text-center">
                            <div class="card-body">
                                <h1 class="card-title">
                                    <i class="fa fa-building"></i>
                                </h1>

                                <p class="card-text">
                                    {{ object.name }}
                                </p>
                                <p class="card-text">
                                    <small class="text-muted">
                                        {{ $t('objects.apartments') }}: {{ object.apartment_count }}
                                    </small>
                                    <br>
                                    <small class="text-muted">
                                        {{ $t('objects.address') }}: {{ object.address }}
                                    </small>
                                </p>
                            </div>
                            <div class="card-footer">
                                <a href="#"><i class="fa fa-edit"></i> {{ $t('edit') }}</a><br>
                                <a href="#" @click="DeleteObject(object.id)"><i class="fa fa-trash"></i> {{ $t('delete') }}</a>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3 mt-3" @click="createBlock">
                        <div class="card  text-center">
                            <div class="card-body">
                                <h1 class="card-title">
                                    <i class="fa fa-plus"></i>
                                </h1>

                                <div class="cart-text">
                                    {{ $t('add') }}
                                </div>

                                <div class="card-text">

                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    export default {

        data: () => ({
            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }
        }),

        mounted() {
            const vm = this;
            this.fetchObjects(vm);
        },

        computed: mapGetters(['getObjects']),

        methods: {
            ...mapActions(['fetchObjects']),

            createBlock() {
                this.$router.push({ name: 'objectsStore'})
            },

            DeleteObject(object) {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes')
                }).then((result) => {
                    if (result.value) {
                        this.axios.get(process.env.VUE_APP_URL + '/api/objects/destroy/' + object, this.header).then((response) => {

                            this.toasted(response.data.message, 'success');
                            this.fetchObjects(this);

                            this.$swal(
                                this.$t('sweetAlert.deleted'),
                                '',
                                'success'
                            );

                        }).catch((error) => {
                            if (! error.response) {
                                this.toasted('Error: Network Error', 'error');
                            } else {
                                this.toasted(error.response.data.error, 'error');
                            }
                        });
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
