<template>
  <b-card no-body class="accordion mb-4">
    <b-card-header header-tag="header" class="p-0 accordion__header" :class="{ 'pb-1 pt-1':visible }" role="tab">
      <span @click="toggleAccordion" class="accordion__toggle-btn">
        <span>{{ block.name }}</span>
        <span v-if="visible">
          <i class="fas fa-chevron-down"></i>
        </span>
        <span v-else>
          <i class="fas fa-chevron-right"></i>
        </span>
      </span>
    </b-card-header>
    <b-card-body class="p-0" :class="{ 'accordion__body':visible }">
      <b-collapse v-model="visible" role="tabpanel">
        <promo-accordion-input
            v-for="plan in block.plans"
            :key="plan.id"
            :plan="plan"
        />

        <!--   Add Button     -->
        <button
            class="btn btn-green-bg mr-0 mt-md-0 addition__button"
            @click="addExtraContent"
        >
          {{ $t("promo.add_price") }}
        </button>
      </b-collapse>
    </b-card-body>
  </b-card>
</template>

<script>
import PromoAccordionInput from "@/components/Dashboard/Objects/Components/Promo/PromoAccordionInput";

export default {
  name: "PromoAccordion",
  components: {
    PromoAccordionInput
  },
  props: {
    block: {
      type: Array,
      required: true
    }
  },
  emits: ['add-extra-content'],
  data() {
    return {
      visible: false
    }
  },
  methods: {
    toggleAccordion() {
      this.visible = !this.visible
    },
    addExtraContent() {
      this.$emit('add-extra-content')
    }
  }
}
</script>

<style lang="scss" scoped>
.accordion {
  border: 2px solid #292930;
  padding: 1rem;
  display: flex;
  justify-content: center;
  background-color: white;


  &__header {
    background-color: transparent;
    border: 0;
  }

  &__body {
    margin-top: 1rem;
  }

  &__toggle-btn {
    width: 100%;
    display: flex;
    cursor: pointer;
    justify-content: space-between;
    background-color: transparent;
  }

  .addition__button {
    float: right;
  }
}
</style>