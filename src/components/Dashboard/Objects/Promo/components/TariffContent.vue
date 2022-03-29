<template>
  <div class="mb-4 prepay__each__content px-4 py-3">
    <!--  Block Selection  -->
    <div class="d-flex">
      <ValidationProvider
          :name="uniqueId"
          tag="div"
          class="p-0 pr-2 my-4 w-100"
          rules="required"
          :id="uniqueId"
          v-slot="{ errors }"
      >
        <label for="selection-block">
          {{ building.name }}
        </label>
        <multiselect
            v-model="selectedBlocks"
            id="selection-block"
            tag-placeholder="Add this as new tag"
            class="mb-2 promo__multiselect__tag"
            label="name"
            :placeholder="$t('promo.select_block')"
            track-by="id"
            :options="blockOptions"
            :multiple="true"
            :taggable="true"
            :searchable="false"
            :hide-selected="true"
        ></multiselect>

        <span class="error__provider" v-if="errors[0]">
          {{ blockSelectionError(errors[0]) }}
        </span>
      </ValidationProvider>

      <ValidationProvider
          :name="`${$t('promo.promo_rate')}`"
          rules="required|max_value:100|min_value:0"
          v-slot="{ errors }"
          class="mt-4 w-100"
          tag="div"
      >
        <label for="prepay-input">
          {{ $t('promo.initial_price') }}
        </label>
        <div class="pl-0">
          <b-form-input
              v-model="form.discount.prepay"
              type="number"
              id="prepay-input-percent"
              :placeholder="$t('promo.promo_rate')"
              :max="100"
              :min="0"
              class="prepay__input__percent mb-2"
          >
          </b-form-input>
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0] }}
          </span>
        </div>
      </ValidationProvider>
    </div>

    <!--     Dropdown Plan   -->
    <p v-if="hasBlocks">{{ $t('promo.select_floor_plan') }}</p>
    <accordion-content
        v-for="(block,index) in selectedBlocks"
        :key="block.name"
        :block="{...block,index}"
        @save-inputs-variable="saveInputsVariable"
        @delete-input-variable="deleteInputVariable"
    />
    <div class="action__buttons">
      <button
          class="button action__buttons-addition"
          @click="clonePromoField"
      >
        {{ $t('apartments.clone_tariff') }}
      </button>
      <button
          class="button action__buttons-deletion"
          @click="deletePrepayContent"
      >
        {{ $t('apartments.delete_tariff') }}
      </button>
    </div>
  </div>
</template>

<script>
import AccordionContent from "@/components/Dashboard/Objects/Promo/components/AccordionContent";

export default {
  name: "TariffContent",
  components: {
    AccordionContent
  },
  props: {
    traffic: {
      type: Object,
      required: true
    },
    blockOptions: {
      type: Array,
      required: true
    },
    uniqueId: {
      type: String,
      required: true
    }
  },
  emits: [
    'delete-tariff-content',
    'set-prepay-properties',
    'clone-promo-field'
  ],
  data() {
    return {
      building: {
        name: this.$t('promo.select_block')
      },
      selectedBlocks: [],
      form: {
        blocks: [],
        discount: {
          id: null,
          prepay: null
        }
      }
    }
  },
  computed: {
    hasBlocks() {
      return this.selectedBlocks.length > 0
    },
  },
  watch: {
    selectedBlocks() {
      this.setFormBlocks()
    },
    'form.discount.prepay'() {
      this.setPrepayProperties()
    }
  },
  created() {
    this.setUpHistory()
    this.setUpCloning()
  },
  methods: {
    setFormBlocks() {
      this.form.blocks = this.selectedBlocks.map(list => {
        if (this.form.blocks.length) {
          const hasInPackage = this.form.blocks.findIndex(block => block.id === list.id)
          if (hasInPackage !== -1) {
            const currentList = this.form.blocks[hasInPackage]
            if (currentList?.types.length) {
              return {
                ...currentList
              }
            }
          }
        }

        return {
          id: list.id,
          types: []
        }
      })
    },
    blockSelectionError(error) {
      const id = this.uniqueId
      return error.replace(id, this.building.name)
    },
    deletePrepayContent() {
      this.$emit('delete-tariff-content')
    },
    deleteInputVariable(inputVariable) {
      const blockIndex = this.form.blocks.findIndex(block => block.id === inputVariable.blockId)
      const deletingIndex = this.form.blocks[blockIndex].types
          .findIndex(type => type.id === inputVariable.id)
      if (deletingIndex !== -1) {
        this.form.blocks[blockIndex].types.splice(deletingIndex, 1)
      }
    },
    saveInputsVariable(inputVariables) {
      for (let i = 0; i < this.selectedBlocks.length; i++) {
        const currentBlockID = this.selectedBlocks[i].id
        const types = inputVariables.filter(inputVar => inputVar.blockId === currentBlockID)
        const blockIndex = this.form.blocks.findIndex(block => block.id === currentBlockID)
        if (types.length) {
          if (this.form.blocks[blockIndex].types.length) {
            for (let i = 0; i < types.length; i++) {
              const findCurrentType = this.form.blocks[blockIndex].types
                  .findIndex(type => type.id === types[i].id)
              if (findCurrentType !== -1) {
                this.form.blocks[blockIndex].types[findCurrentType] = types[i]
              } else {
                this.form.blocks[blockIndex].types.push(types[i])
              }
            }
          } else {
            this.form.blocks[blockIndex].types = types
          }
        }
      }
      this.setPrepayProperties()
    },
    setPrepayProperties() {
      this.$emit('set-prepay-properties', {
        ...this.form,
        uniqueId: this.uniqueId
      })
    },
    setUpHistory() {
      if (this.traffic.history) {
        this.form.discount = this.traffic.discount
        this.initializer()
      }
    },
    setUpCloning() {
      if (this.traffic.clone) {
        this.initializer()
      }
    },
    initializer() {
      this.selectedBlocks = this.blockOptions.filter(loopBlock => {
        const historyBlock = this.traffic.blocks.findIndex(block => block.id === loopBlock.id)
        return historyBlock !== -1
      }).map((currentLoop) => {
        const index = this.traffic.blocks.findIndex(block => block.id === currentLoop.id)
        const types = this.traffic.blocks[index].types
        const context = {
          ...currentLoop,
          types,
        }

        if (this.traffic.history) {
          context.history = true
        } else {
          context.clone = true
        }

        return context
      })
    },
    clonePromoField() {
      this.$emit('clone-promo-field', this.uniqueId)
    }
  }
}
</script>

<style lang="scss" scoped>
//::v-deep .promo__multiselect__tag {
//  .multiselect {
//    &__tags {
//      height: 3.25rem;
//    }
//
//    &__select {
//    }
//  }
//}

.prepay__each__content {
  background-color: var(--background-color-dropdown);
  border-radius: 10px;
  position: relative;
}

.prepay__input__content {
  input {
    height: 40px !important;
  }

  .percent__icon {
    height: 40px;

    i {
      color: #000000;
    }
  }

}

.delete__icon {
  cursor: pointer;
  position: absolute;
  right: 1rem;
  top: 1rem;
  transition: transform ease-in;

  &:hover {
    transform: scale(0.9);
  }

  i {
    color: #dc3545;
    font-size: 24px;
  }
}

.action__buttons {
  display: flex;
  justify-content: flex-end;

  .button {
    line-height: 1.5rem;
    padding: .75rem 1rem;
    border: none;
    outline: none;
    border-radius: 0.5rem;
  }

  &-addition {
    background-color: #ffffff;
    border: 1px solid #E0E0E0 !important;
    margin-right: 1rem;
    color: #333333;
  }

  &-deletion {
    background-color: #EB5757;
    color: #ffffff;
  }
}

.prepay__input__percent {
  height: 42px;
}
</style>