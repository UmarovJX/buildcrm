<template>
  <div class="d-flex align-items-center" style="height:30px">
    <b-button
      @click="editPrice"
      style="transform: scale(0.6)"
      size="sm"
      :variant="editable ? 'primary' : 'success'"
      class="m-0"
      ><i class="fa" :class="editable ? 'fa-edit' : 'fa-save'"></i
    ></b-button>
    <vue-numeric
      id="total"
      :value="itemPrices"
      :currency="$t('ye')"
      :precision="2"
      class="py-0 m-0 bg-transparent"
      :class="editable ? 'border-0' : 'border border-secondary'"
      currency-symbol-position="suffix"
      separator="space"
      :disabled="editable"
    ></vue-numeric>
  </div>
</template>

<script>
import VueNumeric from "vue-numeric";
export default {
  components: {
    VueNumeric,
  },
  data() {
    return {
      apartmentNumber: "",
      apartmentPrice: "",
      editable: true,
    };
  },
  props: {
    item: {
      type: Number,
    },
  },
  computed: {
    itemPrices: {
      get: function() {
        return parseFloat(this.item);
      },
    },
  },
  methods: {
    editPrice() {
      this.editable = !this.editable;
    },
  },
};
</script>

<style lang="scss" scoped></style>
