<template>
    <div>
        <b-modal id="modal-create-discount" class="py-4" ref="modal" :title="$t('objects.create.new_rules_discount')" hide-footer no-close-on-backdrop>
            <form class="my-form" @submit.prevent="SaveDiscount">
                <div class="container px-0 mx-0 mt-4">
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-3">
                                <label class="d-block">{{ $t('objects.create.pre_pay') }}</label>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="">
                                        <input  class="my-form__input" type="number" min="0" v-model="discount.prepay_from">
                                    </div>
                                    <div class="mx-2 long-horizontal-line">
                                        &#8213;
                                    </div>
                                    <div class="">
                                        <input class="my-form__input" type="number" min="1" v-model="discount.prepay_to">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="mb-3">
                                <label class="d-block" for="new_block_discount">{{ $t('objects.create.discount') }}</label>
                                <div class="flex-grow-1">
                                    <input id="new_block_discount" class="my-form__input" type="number" min="1" v-model="discount.discount">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-4 d-flex justify-content-md-start justify-content-center float-right">
                    <button type="button" class="btn btn-default mr-2" @click="discountTrash">
                        {{ $t('cancel') }}
                    </button>

                    <button type="submit" class=" my-btn my-btn__blue">
                        {{ $t('save') }}
                    </button>
                </div>
            </form>
        </b-modal>
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
                this.$emit('RemoveDiscount');
                this.clearDiscount();
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
