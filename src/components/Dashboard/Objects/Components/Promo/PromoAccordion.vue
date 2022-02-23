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
        <promo-accordion-input
            v-for="(promoIndex,index) of promoInputIndex"
            :key="promoIndex.id"
            :block="block"
            :index="index"
            :promo-index="promoIndex"
            :start-time="startTime"
            @set-form-values="saveFormValues"
            @user-focused-the-accordion="removeHighlightedError"
            @delete-inputs-collection="deleteInputsCollection"
            @change-block-list="changeBlockList"
            :ref="`promo-accordion-${promoIndex.id}`"
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
    },
    prepay: {
      type: Number,
      required: true
    }
  },
  async created() {
    await this.getAllBlocksType().then(async () => {
      await this.setUpInputHistory()
    })

    const fromHistorySide = Object.keys(this.getEditHistoryContext).length
    if (fromHistorySide) {
      const {blocks} = this.getEditHistoryContext

      const findPrepay = blocks.find(block => {
        return block.discount.prepay === this.prepay && block.block.id === this.block.id
      })


      if (!findPrepay) {
        await this.setUpInitialAccordion()
      }
    } else {
      await this.setUpInitialAccordion()
    }

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

    return {
      startTime,
      sumOptions,
      typeOptions,
      visible: false,
      types: [],
      floorsList: this.block.floors,
      plansList: [],
      apartmentsList: [],
      promoInputIndex: [],
      error: {
        full: false
      }
    }
  },
  computed: {
    ...mapGetters(['getEditHistoryContext', 'getSelectedBlocks'])
  },
  watch: {
    getSelectedBlocks() {
      this.updateApartments()
    }
  },
  methods: {
    toggleAccordion() {
      this.visible = !this.visible
    },
    setUpInitialAccordion() {
      let id = this.promoInputIndex.length > 0 ? new Date().getTime() : this.startTime
      const {typeOptions, sumOptions} = this
      const accordionInput = {
        typeOptions,
        sumOptions,
        id,
        blockList: this.notSelectedFloorValues(),
        blockType: 'floor',
      }

      this.promoInputIndex.push(accordionInput)
    },
    changeBlockList({type, id}) {
      const findIndex = this.promoInputIndex.findIndex(promoIndex => promoIndex.id === id)
      switch (type) {
        case 'apartment': {
          this.promoInputIndex[findIndex].blockList = this.notSelectedApartmentValues()
          break
        }

        case 'plan': {
          this.promoInputIndex[findIndex].blockList = this.notSelectedPlanValues()
          break
        }

        default: {
          this.promoInputIndex[findIndex].blockList = this.notSelectedFloorValues()
        }
      }
    },
    addExtraContent() {
      const id = new Date().getTime()
      const {typeOptions, sumOptions} = this
      this.promoInputIndex.push({
        id,
        sumOptions,
        typeOptions,
        blockType: 'floor',
        blockList: this.notSelectedFloorValues()
      })
    },
    deleteInputsCollection({id, index}) {
      const findIndex = this.promoInputIndex.findIndex(promoIndex => promoIndex.id === id)
      this.promoInputIndex.splice(findIndex, 1)
      this.types.splice(index, 1)
      this.removeSelectedApartments(id)
      const send = {id: this.block.id, types: this.types}
      this.$emit('save-accordion-content', send)
    },
    saveFormValues({index, type, blockId}) {
      this.types[index] = type
      this.setPromoIndexType(blockId, type.type)
      const send = {id: this.block.id, types: this.types}
      this.$emit('save-accordion-content', send)
    },
    setPromoIndexType(id, type) {
      const findIndex = this.promoInputIndex.findIndex((promoIndex) => promoIndex.id === id)
      this.promoInputIndex[findIndex].blockType = type
      this.removeSelectedApartments(id)
    },
    sortByTypes({type: currentType}) {
      const globalTypes = this.getSelectedBlocks.filter(({id, prepay}) => {
        return id === this.block.id && prepay === this.prepay
      }).map(({types}) => types)

      let sortType = []
      globalTypes.forEach(inlineType => {
        inlineType.forEach(type => {
          sortType.push(type)
        })
      })

      const {types} = this
      const overAllTypes = [...types, ...sortType]
      // type.currency_type === currency_type && type.type === currentType
      const sumFloorsValues = overAllTypes.filter(type => {
        return type.type === currentType
      }).map(type => type.values)

      const values = []
      sumFloorsValues.forEach((value) => {
        if (value.length) {
          values.push(...value)
        }
      })

      return values.slice()
    },
    selectedFloorValues() {
      const sumFloorsOption = {
        currency_type: 'sum',
        type: 'floor',
      }

      return this.sortByTypes(sumFloorsOption)
    },
    notSelectedFloorValues() {
      return this.floorsList.filter(list => {
        const findIndex = this.selectedFloorValues().findIndex(value => value === list)
        return findIndex === -1;
      })
    },
    selectedApartmentValues() {
      const sumApartmentsOption = {
        currency_type: 'sum',
        type: 'apartment',
      }

      return this.sortByTypes(sumApartmentsOption)
    },
    notSelectedApartmentValues() {
      return this.apartmentsList.filter(list => {
        const findIndex = this.selectedApartmentValues().findIndex(value => value === list.id)
        return findIndex === -1
      }).sort((prev, next) => prev.number - next.number)
    },
    selectedPlanValues() {
      const sumPlansOption = {
        currency_type: 'sum',
        type: 'plan',
      }

      return this.sortByTypes(sumPlansOption)
    },
    notSelectedPlanValues() {
      return this.plansList
          .filter(list => {
            const findIndex = this.selectedPlanValues().findIndex(value => value === list.id)
            return findIndex === -1;
          })
          .sort((prev, next) => prev.area - next.area)
          .sort((prev, next) => {
            const prevTimes = prev.name.slice(0, 1)
            const secondTimes = next.name.slice(0, 1)
            return parseInt(prevTimes) - parseInt(secondTimes)
          })
    },
    updateApartments() {
      this.promoInputIndex = this.promoInputIndex.map((promoIndex) => {
        const ref = `promo-accordion-${promoIndex.id}`
        const accordionInput = this.$refs[ref][0]
        const ownBlockList = accordionInput.form.blocks

        if (promoIndex.blockType === 'floor') {
          promoIndex.blockList = [...ownBlockList, ...this.notSelectedFloorValues()]
        } else if (promoIndex.blockType === 'apartment') {
          promoIndex.blockList = [...ownBlockList, ...this.notSelectedApartmentValues()]
        } else if (promoIndex.blockType === 'plan') {
          promoIndex.blockList = [...ownBlockList, ...this.notSelectedPlanValues()]
        }

        return promoIndex
      })
    },
    removeSelectedApartments(blockId) {
      this.promoInputIndex = this.promoInputIndex.map((promoIndex) => {
        const ref = `promo-accordion-${promoIndex.id}`
        const accordionInput = this.$refs[ref][0]
        const ownBlockList = accordionInput.form.blocks

        if (promoIndex?.id !== blockId) {
          if (promoIndex.blockType === 'floor') {
            promoIndex.blockList = [...ownBlockList, ...this.notSelectedFloorValues()]
          } else if (promoIndex.blockType === 'apartment') {
            promoIndex.blockList = [...ownBlockList, ...this.notSelectedApartmentValues()]
          } else if (promoIndex.blockType === 'plan') {
            promoIndex.blockList = [...ownBlockList, ...this.notSelectedPlanValues()]
          }
        }

        return promoIndex
      })
    },
    highlightError() {
      this.visible = true
      this.error.full = true
    },
    removeHighlightedError() {
      this.error.full = false
    },
    async getAllBlocksType() {
      await this.fetchBlocks('apartment', 'apartmentsList')
      await this.fetchBlocks('plan', 'plansList')
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
    idGenerator() {
      return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
          + Math.random().toString(16).slice(2)
          + Date.now().toString(16).slice(4);
    },
    setUpInputHistory() {
      const length = Object.keys(this.getEditHistoryContext).length
      if (length) {
        const {blocks} = this.getEditHistoryContext

        const currentBlock = this.getSelectedBlocks.find(({id, discount}) => {
          return id === this.block.id && this.prepay === discount.prepay
        })

        if (currentBlock) {
          this.types = currentBlock.types
        }

        const findBelongsBlock = blocks.find(({block, discount}) => {
          return block.id === this.block.id && this.prepay === discount.prepay
        })

        if (findBelongsBlock) {
          this.promoInputIndex = []
          const {types} = findBelongsBlock

          for (let i = 0; i < types.length; i++) {
            const id = new Date().getTime() + i

            if (i === 0) {
              this.startTime = id
            }

            const {typeOptions, sumOptions} = this

            const type = types[i]
            const blockType = type.items[0].type
            const currencyType = type.currency_type
            const price = type.price
            let blockList = this.notSelectedFloorValues()
            const itemValues = type.items.map(item => item.value)
            let historyValues = itemValues

            if (blockType === 'apartment') {
              historyValues = this.apartmentsList.filter(apartment => {
                const findIndex = itemValues.findIndex(itemValue => itemValue === apartment.id)
                return findIndex !== -1
              })
              blockList = [...historyValues, ...this.notSelectedApartmentValues()]
            } else if (blockType === 'plan') {
              historyValues = this.plansList.filter(plan => {
                const findIndex = itemValues.findIndex(itemValue => itemValue === plan.id)
                return findIndex !== -1
              })
              blockList = [...historyValues, ...this.notSelectedPlanValues()]
            }

            const historyProperties = {
              historyValues,
              currencyType,
              blockType,
              price,
            }

            this.promoInputIndex.push({
              id,
              sumOptions,
              typeOptions,
              blockType,
              blockList,
              historyProperties
            })

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