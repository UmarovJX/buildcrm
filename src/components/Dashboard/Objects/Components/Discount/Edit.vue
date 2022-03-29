<template>
  <div>
    <b-modal
        id="modal-edit-discount"
        class="py-4"
        ref="modal"
        :title="$t('objects.create.new_rules_discount')"
        hide-footer
        no-close-on-backdrop
    >
      <form class="my-form" @submit.prevent="SaveDiscount">
        <div class="container px-0 mx-0 mt-4">
          <div class="row">
            <div class="col-12">
              <div class="mb-3">
                <label class="d-block">{{
                    $t("objects.create.pre_pay")
                  }}</label>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="">
                    <input
                        class="my-form__input"
                        type="number"
                        min="0"
                        step="0.1"
                        v-model="discount.prepay_from"
                    />
                  </div>
                  <div class="mx-2 long-horizontal-line">&#8213;</div>
                  <div class="">
                    <input
                        class="my-form__input"
                        type="number"
                        min="0"
                        step="0.1"
                        v-model="discount.prepay_to"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="mb-3">
                <label class="d-block" for="new_block_discount">{{
                    $t("objects.create.discount")
                  }}</label>
                <div class="flex-grow-1">
                  <input
                      id="new_block_discount"
                      class="my-form__input"
                      type="number"
                      step="0.1"
                      min="0"
                      v-model="discount.discount"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
            class="
            mt-4
            d-flex
            justify-content-md-start justify-content-center
            float-right
          "
        >
          <button
              type="button"
              class="btn btn-default mr-2"
              @click="discountCancel"
          >
            {{ $t("cancel") }}
          </button>

          <button type="submit" class="btn btn-primary">
            {{ $t("save") }}
          </button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  props: ["discount", "object"],

  data: () => ({
    error: false,
    errors: [],

    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },
  }),

  methods: {
    async discountCancel() {
      try {
        const {data, status} = await api.objects.fetchObjectDiscount(this.object.id)

        if (status === 200) {
          this.$emit("CancelDiscount", data);
          this.$bvModal.hide("modal-edit-discount");
        }
      } catch (error) {
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },

    async SaveDiscount() {
      try {
        const {data, status} = await api.objects.updateDiscount(this.object.id, this.discount.id, this.discount)

        if (status === 202) {
          this.$emit("CancelDiscount", data);
          this.$bvModal.hide("modal-edit-discount");
        }
      } catch (error) {
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }

      //this.$emit('SaveDiscount', this.discount);
      // this.clearDiscount();
    },
  },
};
</script>

<style scoped></style>
