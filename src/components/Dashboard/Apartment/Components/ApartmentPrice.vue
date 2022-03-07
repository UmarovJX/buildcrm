<template>
  <div class="d-flex align-items-center" style="height:30px">

    <b-button
      v-if="discount_type && !editable"
      @click="editPrice"
      style="transform: scale(0.6)"
      size="sm"
      :variant="editable ? 'success' : 'primary'"
      class="m-0"
      ><i class="fa" :class="editable ? 'fa-save' : 'fa-edit'"></i
    ></b-button>

    <b-button
      v-if="editable && discount_type && type === 'other'"
      @click="savePrice"
      style="transform: scale(0.6)"
      size="sm"
      :variant="editable ? 'success' : 'primary'"
      class="m-0"
      ><i class="fa" :class="editable ? 'fa-save' : 'fa-edit'"></i
    ></b-button>

    <base-numeric-input
      id="total"
      v-model.number="apartment.price_calc"
      :currency="$t('ye')"
      :precision="2"
      class="py-0 m-0 bg-transparent"
      :class="!editable ? 'border-0' : 'border border-secondary'"
      currency-symbol-position="suffix"
      separator="space"
      :disabled="!editable"
      :minus="false"
    ></base-numeric-input>
  </div>
</template>

<script>
import BaseNumericInput from "@/components/Reusable/BaseNumericInput";
import Vue from 'vue'
export default {
  components: {
    BaseNumericInput,
  },

  watch: {
    'contract.discount.id': function (valNew) {
      this.type = valNew
      this.discount_type = valNew === 'other';
    },
  },

  data() {
    return {
      editable: false,
      edited: false,
      discount_type: false,
      type: null
    };
  },

  props: {
    apartment: {},
    contract: {}
    // id: {},
    // area: {},
  },

  methods: {
    editPrice() {
      Vue.set(this.apartment, 'price_edited', true)
      // this.apartment.price_edited = true
      this.editable = true;
    },
    savePrice() {
      this.editable = !this.editable;
      this.edited = true
      this.$emit("apartmentPrice", {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
