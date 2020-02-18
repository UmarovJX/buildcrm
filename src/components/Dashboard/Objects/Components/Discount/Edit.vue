<template>
    <div class="w-100">
        <div class="col-md-12 mb-2">
            <div class="row">

                <div class="col-md-6">
                    <div class="row">
                        <h3>
                            {{ $t('objects.create.new_rules_discount') }}
                        </h3>
                    </div>
                </div>


                <div class="col-md-6 text-right">
                    <div class=" float-right">
                        <button class="btn btn-info" @click="discountCancel">
                            <i class="fa fa-reply"></i> {{ $t('cancel') }}
                        </button>
                    </div>
                </div>

            </div>
        </div>
        <form @submit.prevent="SaveDiscount">
            <div class="col-md-4 float-left">
                <div class="row">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">{{ $t('objects.create.prepay_from') }}</span>
                        </div>
                        <input type="number" min="0" v-model="dataDiscount.prepay_from" class="form-control">
                        <div class="input-group-append">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>

                </div>
            </div>

            <div class="col-md-4 float-left">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text">{{ $t('objects.create.prepay_to') }}</span>
                    </div>
                    <input type="number" min="0" class="form-control" v-model="dataDiscount.prepay_to">
                    <div class="input-group-append">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
            </div>

            <div class="col-md-4 float-left">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text">{{ $t('objects.create.discount') }}</span>
                    </div>
                    <input type="number" min="0" class="form-control" v-model="dataDiscount.discount">
                    <div class="input-group-append">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
            </div>


            <div class="col-md-4 offset-8 text-right float-left">
                <button class="btn btn-success">
                    <i class="fa fa-save"></i> {{ $t('save') }}
                </button>
            </div>
        </form>

    </div>
</template>

<script>
    export default {
        props: ['dataDiscount'],

        data: () => ({

        }),

        methods: {
            discountCancel () {
                this.$emit('cancelDiscount');
            },

            SaveDiscount () {
                this.$emit('SaveDiscount');
                // this.clearDiscount();
            }
        }
    }
</script>

<style scoped>

</style>
