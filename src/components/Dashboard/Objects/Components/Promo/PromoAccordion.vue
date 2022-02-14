<template>
  <b-card
      no-body
      class="accordion mb-4"
      :class="{'highlighted__content':error.full}"
  >
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
        <ValidationObserver ref="accordion-input-observer" class="flex w-100">
          <promo-accordion-input
              v-for="index in promoInputIndex"
              :index="index"
              :key="index"
              :block="block"
              @set-form-values="saveFormValues"
              @user-focused-the-accordion="removeHighlightedError"
              :ref="`${block.id}-promo-accordion-${index}`"
          />
        </ValidationObserver>

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
      type: Object,
      required: true
    }
  },
  created() {
    if (this.block.index === 0) {
      setTimeout(() => {
        this.visible = true
      }, 50)
    }
  },
  emits: ['save-accordion-content', 'warn-error-found'],
  data() {
    return {
      visible: false,
      promoInputIndex: 1,
      types: [],
      error: {
        full: false
      }
    }
  },
  methods: {
    toggleAccordion() {
      this.visible = !this.visible
    },
    addExtraContent() {
      this.promoInputIndex++
    },
    saveFormValues({index, type}) {
      const position = index - 1
      this.types[position] = type
      const send = {id: this.block.id, types: this.types}
      this.$emit('save-accordion-content', send)
    },
    highlightError() {
      this.visible = true
      this.error.full = true
    },
    removeHighlightedError() {
      this.error.full = false
    },
    async validationObserverAvailable() {
      return await this.$refs['accordion-input-observer'].validate()
    }
  }
}
</script>

<style lang="scss" scoped>
.accordion {
  border: var(--content-border-color);
  padding: 1rem;
  display: flex;
  justify-content: center;
  background-color: transparent;


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

    span i {
      color: var(--content-border-color);
      font-weight: 900;
    }
  }

  .addition__button {
    float: right;
    color: white;
  }
}

.highlighted__content {
  border: 2px solid red;

  .accordion__toggle-btn span i {
    color: red;
    font-weight: 900;
  }
}
</style>