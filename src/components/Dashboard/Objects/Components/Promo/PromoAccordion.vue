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
              @change-block-list="changeBlockList"
              :ref="`promo-accordion-${promoIndex.id}`"
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
import api from "@/services/api";

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
  async created() {
    await this.getAllBlocksType()
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

    const typeOptions = [
      {
        type: 'floor',
        name: this.$t('promo.select_by_floor')
      },
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
        value: 'sum'
      },
      {
        name: this.$t('usd_text'),
        value: 'usd'
      }
    ]

    const accordionInput = {
      id: startTime,
      typeOptions,
      sumOptions,
      blockList: this.block.floors || []
    }

    return {
      startTime,
      sumOptions,
      typeOptions,
      visible: false,
      types: [],
      plansList: [],
      apartmentsList: [],
      promoInputIndex: [accordionInput],
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
    changeBlockList({type, id}) {
      const findIndex = this.promoInputIndex.find(promoIndex => promoIndex.id === id)
      switch (type) {
        case 'apartment': {
          this.promoInputIndex[findIndex].blockList = this.apartmentsList
          break
        }

        case 'plan': {
          this.promoInputIndex[findIndex].blockList = this.plansList
          break
        }

        default: {
          this.promoInputIndex[findIndex].blockList = this.block.floors
        }
      }
    },
    addExtraContent() {
      const id = new Date().getTime()
      const olderFormsField = []
      const blocks = []
      this.promoInputIndex.forEach(promoInput => {
        const ref = `promo-accordion-${promoInput.id}`
        const component = this.$refs[ref][0]
        olderFormsField.push(component.form)
        const form = component.form
        // const currencyType = form.priceByValue.value
        // const currencyValue = form.priceByValue
        const promoType = form.promoType.type
        const formBlocks = form.blocks

        if (blocks.length) {
          const findIndex = this.blocks.findIndex(block => block.type === promoType)
          if (findIndex !== -1) {
            blocks[findIndex].values.push(...formBlocks)
          } else {
            blocks.push({type: promoType, values: formBlocks})
          }
        } else if (formBlocks.length) {
          blocks.push({type: promoType, values: formBlocks})
        }
      })

      // sumOptions, typeOptions,
      const floorBlock = blocks.filter(({type, values}) => {
        return type === 'floor' && values.length
      })

      let blockList = []

      if (floorBlock.length) {
        const floorValues = floorBlock.values
        this.block.floors.forEach(floorBlock => {
          const index = floorValues.findIndex(floor => floor === floorBlock)
          if (index === -1) {
            blockList.push(floorBlock)
          }
        })
      } else {
        blockList = this.block.floors
      }

      const accordionInput = {
        id,
        blockList,
        typeOptions: this.typeOptions,
        sumOptions: this.sumOptions,
      }

      this.promoIndex.push(accordionInput)


      // console.log(blocks)

      // blocks: [],
      //     priceByValue: '',
      //     priceBy: {
      //   name: this.$t('sum_text'),
      //       value: 'sum'
      // },
      // promoType: {
      //   type: 'floor',
      //       name: this.$t('promo.select_by_floor')
      // }

      // olderFormsField.forEach(form => {
      //   const currencyType = form.priceByValue.value
      //   const currencyValue = form.priceByValue
      //   const promoType = this.form.promoType.type
      //   const blocks = this.selectedBlocks
      //
      //
      // })

      // this.promoInputIndex.push({id})
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
    getAllBlocksType() {
      this.fetchBlocks('apartment', 'apartmentsList')
      this.fetchBlocks('plan', 'plansList')
    },
    async fetchBlocks(type, initialValue) {
      const blockId = this.block.id
      const objectId = this.$route.params.id
      await api.objects.fetchObjectBlockByType({blockId, objectId, type})
          .then(response => {
            this[initialValue] = response.data
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
    },
    setUpInputHistory() {
      const length = Object.keys(this.getEditHistoryContext).length
      if (length) {
        const {blocks} = this.getEditHistoryContext
        const findBelongsBlock = blocks.find(block => block.block.id === this.block.id)
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