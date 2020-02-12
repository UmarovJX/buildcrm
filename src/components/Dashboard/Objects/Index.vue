<template>
    <div>
        <div class="container">
            <div class="col-md-12 mt-3">
                <div class="row">
                    <div class="col-md-3 mt-3" v-for="object in getObjects" :key="object.id">
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
                                        {{ $t('objects.apartments') }}: 0
                                    </small>
                                </p>
                            </div>
                            <div class="card-footer">
                                <a href="#"><i class="fa fa-edit"></i> {{ $t('edit') }}</a><br>
                                <a href="#"><i class="fa fa-trash"></i> {{ $t('delete') }}</a>
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
        mounted() {
            const vm = this;
            this.fetchObjects(vm);
        },

        computed: mapGetters(['getObjects']),

        methods: {
            ...mapActions(['fetchObjects']),

            createBlock() {
                this.$router.push({ name: 'objectsStore'})
            }
        }
    }
</script>

<style scoped>

</style>