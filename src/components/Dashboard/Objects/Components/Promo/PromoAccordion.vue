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
              v-for="(promoIndex,index) of promoInputIndex"
              :key="index"
              :block="block"
              :index="index"
              :promo-index="promoIndex"
              :start-time="startTime"
              @set-form-values="saveFormValues"
              @user-focused-the-accordion="removeHighlightedError"
              @delete-inputs-collection="deleteInputsCollection(index)"
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
import {mapGetters} from "vuex";

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
    this.setUpInputHistory()
    if (this.block.index === 0) {
      setTimeout(() => {
        this.visible = true
      }, 50)
    }
  },
  emits: ['save-accordion-content', 'warn-error-found'],
  data() {
    const startTime = new Date().getTime()
    return {
      startTime,
      visible: false,
      promoInputIndex: [{id: startTime}],
      types: [],
      error: {
        full: false
      }
    }
  },
  computed: {
    ...mapGetters(['getEditHistoryContext'])
  },
  methods: {
    toggleAccordion() {
      this.visible = !this.visible
    },
    addExtraContent() {
      const id = new Date().getTime()
      this.promoInputIndex.push({id})
    },
    deleteInputsCollection(index) {
      const findIndex = this.promoInputIndex.findIndex(promoIndex => promoIndex.id === index)
      this.promoInputIndex.splice(findIndex, 1)
      this.types.splice(index, 1)
      const send = {id: this.block.id, types: this.types}
      this.$emit('save-accordion-content', send)
    },
    saveFormValues({index, type}) {
      this.types[index] = type
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
    },
    setUpInputHistory() {
      const length = Object.keys(this.getEditHistoryContext).length
      if (length) {
        const {blocks} = this.getEditHistoryContext
        const findBelongsBlock = blocks.find(block => block.block.id = this.block.id)
        if (findBelongsBlock) {
          const {types} = findBelongsBlock

          if (types.length) {
            this.promoInputIndex = []
          }

          for (let i = 0; i < types.length; i++) {
            const id = new Date().getTime() + i
            if (i === 0) {
              this.startTime = id
            }
            const newPromoInput = {type: types[i], id}
            this.promoInputIndex.push(newPromoInput)
          }
        }
      }
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