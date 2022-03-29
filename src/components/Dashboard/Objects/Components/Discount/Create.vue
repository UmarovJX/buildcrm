<template>
  <div>
    <b-modal
        id="modal-create-discount"
        class="py-4"
        ref="modal"
        :title="$t('objects.create.new_rules_discount')"
        hide-footer
        no-close-on-backdrop
    >
      <div class="alert alert-danger mt-3" v-if="error">
        <ul>
          <li v-for="(error, index) in errors" :key="index">
            <span v-for="msg in error" :key="msg">
              {{ msg }}
            </span>
          </li>
        </ul>
      </div>

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
                        min="1"
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
                      step="0.1"
                      type="number"
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
              @click="discountTrash"
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
  props: {
    object: {},
  },

  data: () => ({
    discount: {
      prepay_from: 0,
      prepay_to: 0,
      discount: 0,
    },

    error: false,
    errors: [],

    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },
  }),

  methods: {
    discountTrash() {
      this.$emit("RemoveDiscount");
      this.$bvModal.hide("modal-create-discount");
      this.clearDiscount();
    },

    clearDiscount() {
      this.discount.prepay_from = 0;
      this.discount.prepay_to = 0;
      this.discount.discount = 0;
    },

    async SaveDiscount() {
      try {
        const {data, status} = await api.objects.createDiscount(this.object.id, this.discount)

        if (status === 201) {
          this.$emit("SaveDiscount", data);
          this.$bvModal.hide("modal-create-discount");
          this.clearDiscount();
        }
      } catch (error) {
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },
  },
};
</script>

<style scoped></style>
