<template>
  <b-card
      no-body
      class="accordion mb-4"
      :class="{'highlighted__content':error.full}"
  >
    <b-card-header
        eader-tag="header"
        class="p-0 accordion__header"
        :class="{ 'pb-1 pt-1':visible }"
        role="tab"
    >
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
        <div
            v-for="(inputVariable,index) in inputVariables"
            :key="inputVariable.id"
        >
          <accordion-content-input
              :input-variable="inputVariable"
              :type-options="typeOptions"
              :sum-options="sumOptions"
              :block="block"
              :index="index"
              @delete-input-content="deleteAccordionInputContent(inputVariable.id)"
              @save-entered-data="saveEnteredData"
          />
        </div>
        <!--   Add Button     -->
        <button
            @click="addAccordionContentInput"
            class="btn btn-green-bg mr-4 mt-md-0 addition__button"
        >
          {{ $t("promo.add_price") }}
        </button>
      </b-collapse>
    </b-card-body>
  </b-card>
</template>

<script>
import AccordionContentInput from "@/components/Dashboard/Objects/Promo/components/AccordionContentInput";
import {idGenerator} from "@/util/reusable";

export default {
  name: "AccordionContent",
  components: {
    AccordionContentInput
  },
  props: {
    block: {
      type: Object,
      required: true
    }
  },
  created() {
    this.setHistoryValues()
    this.setCloningValues()
    if (this.block.index === 0) {
      setTimeout(() => {
        this.visible = true
      }, 50)
    }
  },
  emits: [
    'save-accordion-content',
    'warn-error-found',
    'save-Inputs-variable',
    'delete-input-variable'
  ],
  data() {
    const typeOptions = [
      {
        type: 'apartment',
        name: this.$t('promo.select_by_apartment')
      },
      {
        type: 'plan',
        name: this.$t('promo.select_by_plan')
      }
    ]

    const sumOptions = [
      {
        name: this.$t('sum_text'),
        value: 'uzs'
      },
      {
        name: this.$t('usd_text'),
        value: 'usd'
      }
    ]

    return {
      sumOptions,
      typeOptions,
      inputVariables: [],
      visible: false,
      error: {
        full: false
      },
    }
  },
  methods: {
    toggleAccordion() {
      this.visible = !this.visible
    },
    highlightError() {
      this.visible = true
      this.error.full = true
    },
    removeHighlightedError() {
      this.error.full = false
    },
    idGenerator() {
      return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
          + Math.random().toString(16).slice(2)
          + Date.now().toString(16).slice(4)
    },
    addAccordionContentInput() {
      const additionContext = {
        id: this.idGenerator(),
        price: null,
        currency_type: null,
        type: null,
        values: []
      }

      this.inputVariables.push(additionContext)
    },
    deleteAccordionInputContent(id) {
      const currentIndex = this.inputVariables.findIndex(inputVar => inputVar.id === id)
      const deletedVar = this.inputVariables.splice(currentIndex, 1)
      this.$emit('delete-input-variable', deletedVar[0])
    },
    saveEnteredData({id, price, values, type, currency_type, floor}) {
      const currentIndex = this.inputVariables.findIndex(inputVar => inputVar.id === id)
      this.inputVariables[currentIndex] = {
        id,
        price,
        values,
        type,
        floor,
        currency_type,
        blockId: this.block.id
      }

      this.$emit('save-Inputs-variable', this.inputVariables)
    },
    setHistoryValues() {
      if (this.block.history) {
        const loopPackage = []
        for (let type of this.block.types) {
          loopPackage.push({
            ...type,
            history: true
          })
        }
        this.inputVariables = loopPackage
      } else {
        this.inputVariables = [
          {
            id: idGenerator(),
            price: null,
            currency_type: null,
            type: null,
            values: []
          }
        ]
      }
    },
    setCloningValues() {
      if (this.block.clone) {
        const loopPackage = []
        for (let type of this.block.types) {
          loopPackage.push({
            ...type,
            clone: true
          })
        }
        this.inputVariables = loopPackage
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
  border-radius: 0.5rem;


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
      font-weight: 600;
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