<template>
  <div class="d-flex flex-column flex-xl-row justify-content-lg-between mb-4">
    <!--    FIRST SECTION      -->
    <div class="plan__group col-12 col-xl-4 p-0 mb-4 mb-xl-0">
      <label for="select-price-group">
        {{ $t('promo.select_price') }}
      </label>

      <b-input-group
          class="input__group"
          id="select-price-group"
      >
        <template #prepend>
          <div class="multiselect__parent multiselect__parent__border">
            <div class="select_wrapper">
              <multiselect
                  v-model="form.priceBy"
                  :options="promoIndex.sumOptions"
                  :searchable="false"
                  :show-labels="false"
                  label="name"
              ></multiselect>
            </div>
          </div>
        </template>

        <ValidationProvider
            :name="provider.price.name"
            rules="required"
            v-slot="{ errors }"
            ref="price-provider"
            class="d-flex justify-content-center align-items-center"
        >

          <input
              v-model="form.priceByValue"
              class="plan__group-input"
              placeholder="000"
              @focus="removePriceError"
              v-mask="'### ### ### ### ### ### ###'"
          />
        </ValidationProvider>

      </b-input-group>

      <span v-if="errors.priceError" class="error__provider">
          {{ errors.priceError }}
        </span>
    </div>

    <!--    SECOND SECTION      -->
    <div class="plan__group col-12 p-0 col-xl-7">
      <label for="select-type-promo">
        {{ $t('promo.select_type') }}
      </label>

      <div class="d-flex">
        <div
            class="row m-0 select__type__promo mb-2 col-11"
            id="select-type-promo"
        >
          <div class="col-4 multiselect__parent multiselect__parent__border">
            <multiselect
                v-model="form.promoType"
                :options="promoIndex.typeOptions"
                :searchable="false"
                :show-labels="false"
                label="name"
                :placeholder="$t('promo.select_by_floor')"
            ></multiselect>
          </div>

          <ValidationProvider
              :name="provider.promoType.name"
              rules="required"
              v-slot="{ errors }"
              ref="promo-type-provider"
              class="col-8 multiselect__parent"
              tag="div"
          >
            <multiselect
                id="selection-block"
                v-model="form.blocks"
                tag-placeholder="Add this as new tag"
                :placeholder="$t('promo.select_block')"
                :options="promoIndex.blockList"
                :label="selectionContentLabel"
                :track-by="selectionContentTrack"
                :multiple="true"
                :searchable="false"
            ></multiselect>
          </ValidationProvider>
        </div>

        <!--   DELETE BUTTON     -->
        <div
            @click="deleteAccordionInput"
            v-if="showDeletedButton"
            class="col-1 d-flex justify-content-center align-items-center delete__button"
        >
          <i class="fal fa-times-circle"></i>
        </div>
      </div>

      <span class="error__provider" v-if="errors.typeError">
          {{ errors.typeError }}
      </span>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "PriceAndTypeSelectionContent",
  props: {
    block: {
      type: Object,
      require: true
    },
    index: {
      type: Number,
      require: true
    },
    promoIndex: {
      type: Object,
      require: true
    },
    startTime: {
      type: Number,
      require: true
    }
  },
  emits: [
    'set-form-values',
    'user-focused-the-accordion',
    'delete-inputs-collection',
    'change-block-list'
  ],
  created() {
    if (this.promoIndex.hasOwnProperty('type')) {
      this.setUpHistoryValues()
    } else {
      this.setPromoTypeToFloors()
    }
  },
  data() {
    return {
      selectionContentLabel: '',
      selectionContentTrack: '',
      provider: {
        price: {
          name: this.$t('promo.select_price')
        },
        promoType: {
          name: this.$t('promo.select_type')
        }
      },
      form: {
        blocks: [],
        priceByValue: '',
        priceBy: this.promoIndex.sumOptions[0],
        promoType: this.promoIndex.typeOptions[0],
      },
      errors: {
        priceError: '',
        typeError: ''
      },
      selectionPackage: [],
    }
  },
  computed: {
    ...mapGetters({
      togglePromoSubmitButton: 'togglePromoSubmitButton',
      getEditHistoryContext: 'getEditHistoryContext',
      getSelectedBlocks: 'getSelectedBlocks'
    }),
    formattedPrice() {
      const snipSpace = this.form.priceByValue?.split(' ').join('')

      if (snipSpace) {
        return parseFloat(snipSpace)
      }

      return 0
    },
    showDeletedButton() {
      return this.startTime !== this.promoIndex.id
    },
  },
  watch: {
    togglePromoSubmitButton() {
      this.showWarningMessage()
    },
    'form.blocks'(last) {
      if (last.length) {
        this.removePromoBlocksError()
      }

      this.userFocusedAccordion()
      this.setInputValues()
    },
    'form.priceByValue'() {
      this.userFocusedAccordion()
      this.setInputValues()
    },
    'form.priceBy.value'() {
      this.setInputValues()
      this.userFocusedAccordion()
    },
    'form.promoType.type'() {
      this.userFocusedAccordion()
      this.setPromosOption()
      this.setInputValues()
    }
  },
  methods: {
    removePriceError() {
      this.errors.priceError = ''
    },
    removePromoBlocksError() {
      this.errors.typeError = ''
    },
    userFocusedAccordion() {
      this.$emit('user-focused-the-accordion')
    },
    setUpHistoryValues() {
      const {type} = this.promoIndex
      this.form.priceBy = this.promoIndex.sumOptions.find(option => option.value === type.currency_type)
      this.form.priceByValue = type.price
      this.form.promoType = this.promoInputIndex.typeOptions.find(typeOption => typeOption.type === type.items[0].type)
      if (type.items[0].type === 'floor') {
        this.setPromoBlocksHistory()
      } else {
        this.setPromosOption()
      }
    },
    setPromoBlocksHistory() {
      this.$emit('change-block-list', 'floor')
      const {type} = this.promoIndex
      const blocksId = type.items.map(item => item.value)
      const iterationBlock = []
      this.block.floors.forEach(floor => {
        const hasHistory = blocksId.find(blockId => blockId === floor)
        if (hasHistory) {
          iterationBlock.push(floor)
        }
      })
      this.form.blocks = iterationBlock
    },
    async showWarningMessage() {
      await this.$refs['price-provider'].validate()
          .then(() => {
            const {errors: priceError} = this.$refs['price-provider']
            if (priceError.length) {
              this.errors.priceError = priceError[0]
            }
          })

      await this.$refs['promo-type-provider'].validate()
          .then(() => {
            const {errors: promoTypeError} = this.$refs['promo-type-provider']
            if (promoTypeError.length) {
              this.errors.typeError = promoTypeError[0]
            }
          })
    },
    async setInputValues() {
      /*
        const satisfyValidation = await this.satisfyValidation()
        console.log(satisfyValidation)
      */

      /*this.removeSelectedOptions()*/

      const {form, index} = this

      const type = {
        price: this.formattedPrice,
        type: form.promoType.type,
        currency_type: form.priceBy.value,
        values: this.getPromoValuesByType()
      }
      this.$emit('set-form-values', {type, index})
    },
    removeSelectedOptions() {
      const findRelatingBlocks = this.getSelectedBlocks.find(selectedBlock => selectedBlock.id === this.block.id)

      if (findRelatingBlocks) {
        const {form} = this
        // const formBlocks = form.blocks
        const currencyValue = this.formattedPrice
        const currencyType = form.priceBy.value
        const promoType = form.promoType.type
        const {types} = findRelatingBlocks

        types.forEach(({currency_type, price, type, values}) => {
          const sameCurrencyType = currency_type === currencyType
          const sameCurrencyPrice = price === currencyValue
          const sameType = promoType === type

          if (sameCurrencyType) {

            if (sameCurrencyPrice) {
              const findIndex = this.promoInputIndex.typeOptions.findIndex(typeOption => typeOption.type === type)

              if (findIndex !== -1) {
                this.promoInputIndex.typeOptions.splice(findIndex, 1)
              }

            } else {

              if (sameType) {

                if (type === 'floor') {
                  values.forEach(value => {
                    const findIndex = this.selectionContentTypes.findIndex(contentType => contentType === value)
                    if (findIndex !== -1) {
                      this.removeSelectedBlockType(findIndex)
                    }
                  })
                } else {
                  values.forEach(value => {
                    const findIndex = this.selectionContentTypes.findIndex(contentType => contentType.id === value)
                    if (findIndex !== -1) {
                      this.removeSelectedBlockType(findIndex)
                    }
                  })
                }

              }

            }
          }

        })
      }
    },
    removeSelectedBlockType(index) {
      this.selectionContentTypes.splice(index, 1)
    },
    getPromoValuesByType() {
      const {type} = this.form.promoType

      if (type === 'floor') {
        return this.form.blocks.map(block => parseInt(block))
      }

      if (type === 'apartment' || type === 'plan') {
        return this.form.blocks.map(block => parseInt(block.id))
      }

    },
    setPromoTypeToFloors() {
      this.selectionContentLabel = ''
      this.$emit('change-block-list', 'floor')
      this.makeDefaultFormBlocks()
    },
    setPromosOption() {
      const type = this.form.promoType.type
      const id = this.promoIndex.id
      this.selectionContentTrack = 'id'

      this.$emit('change-block-list', {type, id})
      this.makeDefaultFormBlocks()

      if (type === 'plan') {
        this.selectionContentLabel = 'name'
      } else if (type === 'apartment') {
        this.selectionContentLabel = 'number'
      }

      const hasHistory = this.promoIndex.hasOwnProperty('type')
      if (hasHistory) {
        this.setHistoryContent()
      }
    },
    setHistoryContent() {
      if (type === 'plan') {
        this.selectionContentLabel = 'name'
      } else if (type === 'apartment') {
        this.selectionContentLabel = 'number'
      }
      const {type} = this.promoIndex
      const blocksId = type.items.map(item => item.value)
      const loopPackage = []
      blocksId.forEach(blockId => {
        const hasHistory = this.promoIndex.blockList.find(contentType => contentType.id === blockId)
        if (hasHistory) {
          loopPackage.push(hasHistory)
        }
      })

      this.form.blocks = loopPackage
    },
    deleteAccordionInput() {
      this.$emit('delete-inputs-collection')
    },
    makeDefaultFormBlocks() {
      this.form.blocks = []
    },
    async satisfyValidation() {
      const priceValidation = async () => {
        await this.$refs['price-provider'].validate()
            .then(() => {
              const {errors: priceError} = this.$refs['price-provider']

              if (priceError.length) {
                this.errors.priceError = priceError[0]
                return false
              }

              this.errors.priceError = ''
              return true
            })
      }

      const promoTypeValidation = async () => {
        await this.$refs['promo-type-provider'].validate()
            .then(() => {
              const {errors: promoTypeError} = this.$refs['promo-type-provider']

              if (promoTypeError.length) {
                this.errors.typeError = promoTypeError[0]
                return false
              }

              this.errors.typeError = ''
              return true
            })
      }

      const [priceValidator, promoTypeValidator] =
          await Promise.all([priceValidation(), promoTypeValidation()])

      return priceValidator && promoTypeValidator
    },
  }
}
</script>

<style lang="scss" scoped>
.plan__group {
  width: auto;

  .input__group {
    border: 1px solid rgb(206, 212, 218);
    border-radius: 0.25rem;
    margin: 0 0 0.5rem 0;
    padding: 0;
  }


  &-input {
    max-width: 16rem;
    border: none;
    padding-left: 0.5rem;
    background-color: transparent;
  }
}

.select__type__promo {
  border: 1px solid rgb(206, 212, 218);
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.select_wrapper {
  padding: 0.1rem;
  border-right: 1px solid rgb(206, 212, 218);
}

.delete__button {
  cursor: pointer;
  padding-bottom: 12px;
  margin-left: 0.5rem;

  i {
    color: red;
    font-size: 28px;
    transition: font-size ease-in;

    &:hover {
      font-size: 24px;
    }
  }
}

.error__provider {
  color: red;
  font-size: 14px;
}
</style>