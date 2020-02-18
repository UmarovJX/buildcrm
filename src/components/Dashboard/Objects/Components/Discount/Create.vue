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
                        <button class="btn btn-danger" @click="discountTrash">
                            <i class="fa fa-trash"></i> {{ $t('delete') }}
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
                        <input type="number" min="0" v-model="discount.prepay_from" class="form-control">
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
                    <input type="number" min="0" class="form-control" v-model="discount.prepay_to">
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
                    <input type="number" min="0" class="form-control" v-model="discount.discount">
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
        data: () => ({
            discount: {
                prepay_from: 0,
                prepay_to: 0,
                discount: 0
            }
        }),

        methods: {
            discountTrash () {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes')
                }).then((result) => {
                    if (result.value) {
                        this.$emit('RemoveDiscount');
                        this.clearDiscount();

                    }
                });
            },

            clearDiscount () {
                this.discount.prepay_from = 0;
                this.discount.prepay_to = 0;
                this.discount.discount = 0;
            },

            SaveDiscount () {
                this.$emit('SaveDiscount', this.discount);
                this.clearDiscount();
            }
        },
    }
</script>

<style scoped>

</style>
