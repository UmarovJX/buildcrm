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
      v-model="apartmentPrice"
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
  mounted() {
    this.apartmentNumber = parseInt(this.itemNumber);
    this.apartmentPrice = parseInt(this.itemPrice);
    console.log(this.apartmentNumber);
    console.log(this.apartmentPrice);
  },
  props: {
    itemNumber: {
      type: String,
    },
    itemPrice: {
      type: Number,
    },
  },
  methods: {
    editPrice() {
      console.log(this.apartmentNumber);
      this.editable = !this.editable;
    },
  },
};
</script>

<style lang="scss" scoped></style>
