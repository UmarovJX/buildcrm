<template>
  <div class="d-flex align-items-center" style="height:30px">
    <b-button
      v-if="editable"
      @click="editPrice"
      style="transform: scale(0.6)"
      size="sm"
      :variant="editable ? 'primary' : 'success'"
      class="m-0"
      ><i class="fa" :class="editable ? 'fa-edit' : 'fa-save'"></i
    ></b-button>
    <b-button
      v-else
      @click="savePrice"
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
      edited: false
    };
  },
  props: {
    item: {
      type: Number,
    },
    id: {
      type: String,
    },
    area: {
      type: Number,
    },
  },
  watch: {
    item(val) {
      if (val) {
        this.apartmentPrice = this.item;
      }
    },
  },
  mounted() {
    this.apartmentPrice = this.item;
  },
  methods: {
    editPrice() {
      this.editable = !this.editable;
    },
    savePrice() {
      this.editable = !this.editable;
      this.edited = true
      this.$emit("apartmentPrice", this.apartmentPrice, this.id, this.edited);
      console.log(this.apartmentPrice);
    },
  },
};
</script>

<style lang="scss" scoped></style>
