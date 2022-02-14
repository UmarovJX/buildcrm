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
                  :options="sumOptions"
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
              v-mask="'### ### ### ### ### ### ###'"
              @focus="removePriceError"
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

      <div
          class="row m-0 select__type__promo mb-2"
          id="select-type-promo"
      >
        <div class="col-4 multiselect__parent multiselect__parent__border">
          <multiselect
              v-model="form.promoType"
              :options="typeOptions"
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
              :options="selectionContentTypes"
              :label="selectionContentLabel"
              :multiple="true"
              :searchable="false"
          ></multiselect>
        </ValidationProvider>

      </div>

      <span class="error__provider" v-if="errors.typeError">
          {{ errors.typeError }}
        </span>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";
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
    }
  },
  emits: ['set-form-values', 'user-focused-the-accordion'],
  created() {
    this.setPromoTypeToFloors()
  },
  data() {
    return {
      selectionContentLabel: '',
      selectionContentTypes: [],
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
        priceBy: {
          name: this.$t('sum_text'),
          value: 'sum'
        },
        promoType: {
          type: 'floor',
          name: this.$t('promo.select_by_floor')
        }
      },
      errors: {
        priceError: '',
        typeError: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      togglePromoSubmitButton: 'togglePromoSubmitButton'
    }),
    typeOptions() {
      return [
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
        },
      ]
    },
    sumOptions() {
      return [
        {
          name: this.$t('sum_text'),
          value: 'sum'
        },
        {
          name: this.$t('usd_text'),
          value: 'usd'
        }
      ]
    }
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
      this.userFocusedAccordion()
    },
    'form.promoType'() {
      this.userFocusedAccordion()
      this.setPromosOption()
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
    setInputValues() {
      const satisfyValidation = this.satisfyValidation()
      if (satisfyValidation) {
        const {form, index} = this
        const snipSpace = form.priceByValue?.split(' ').join('')
        const price = parseFloat(snipSpace)
        const type = {
          price,
          type: form.promoType.type,
          currency_type: form.priceBy.value,
          values: this.getPromoValuesByType()
        }
        this.$emit('set-form-values', {type, index})
      }
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

      const [priceValidator, promoTypeValidator] = await Promise.all([priceValidation, promoTypeValidation])

      return priceValidator && promoTypeValidator
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
    setPromosOption() {
      if (this.form.promoType.type === 'floor')
        this.setPromoTypeToFloors()
      else
        this.fetchPromoType()
    },
    setPromoTypeToFloors() {
      this.selectionContentLabel = ''
      this.selectionContentTypes = this.block.floors
      this.makeDefaultFormBlocks()
    },
    async fetchPromoType() {
      const blockId = this.block.id
      const objectId = this.$route.params.id
      const type = this.form.promoType.type

      if (type === 'plan') {
        this.selectionContentLabel = 'name'
      }

      if (type === 'apartment') {
        this.selectionContentLabel = 'number'
      }

      this.makeDefaultFormBlocks()

      await api.objects.fetchObjectBlockByType({blockId, objectId, type})
          .then(response => {
            this.selectionContentTypes = response.data
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
    },
    makeDefaultFormBlocks() {
      this.form.blocks = []
    }
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

.error__provider {
  color: red;
  font-size: 14px;
}
</style>