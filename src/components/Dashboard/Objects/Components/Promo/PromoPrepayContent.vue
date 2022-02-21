<template>
  <div class="mb-4 prepay__each__content px-4 py-3">
    <ValidationProvider
        :name="`${$t('promo.promo_rate')}`"
        rules="required|max_value:100|min_value:0"
        v-slot="{ errors }"
        class="mt-4"
        tag="div"
    >
      <div class="pl-0">
        <div class="pl-0 prepay__input__content">
          <b-input-group class="col-6 pr-2 pl-0 mb-2">
            <template #append>
              <b-input-group-text class="percent__icon">
                <span class="px-1">
                  <i class="fas fa-percent"></i>
                </span>
              </b-input-group-text>
            </template>
            <b-form-input
                v-model="form.prepay"
                type="number"
                id="prepay-input-percent"
                :placeholder="$t('promo.promo_rate')"
                :max="100"
                :min="0"
            >
            </b-form-input>
          </b-input-group>
        </div>
        <span class="error__provider" v-if="errors[0]">
          {{ errors[0] }}
        </span>
      </div>
    </ValidationProvider>

    <!--  Block Selection  -->
    <ValidationProvider
        :name="`${prepay.prepayId}`"
        tag="div"
        class="col-6 p-0 pr-2 my-4"
        rules="required"
        :id="prepay.prepayId"
        v-slot="{ errors }"

    >
      <label for="selection-block">
        {{ building.name }}
      </label>
      <multiselect
          id="selection-block"
          v-model="selectedBlocks"
          tag-placeholder="Add this as new tag"
          class="mb-2"
          :placeholder="$t('promo.select_block')"
          label="name"
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

    <!-- Dropdown Plan   -->
    <p v-if="hasBlocks">{{ $t('promo.select_floor_plan') }}</p>
    <promo-accordion
        v-for="(block,index) in selectedBlocks"
        :key="block.name"
        :block="{...block,index}"
        :prepay="form.prepay"
        @save-accordion-content="saveSpecificContent"
    />

    <div class="delete__icon" @click="deletePrepayContent">
      <span>
        <i class="fad fa-backspace"></i>
      </span>
    </div>
  </div>
</template>

<script>
import PromoAccordion from "@/components/Dashboard/Objects/Components/Promo/PromoAccordion";
import {mapMutations} from "vuex";

export default {
  name: "PromoPrepayContent",
  components: {
    PromoAccordion
  },
  emits: ['delete-prepay-content'],
  props: {
    blockOptions: {
      type: Array,
      required: true
    },
    prepay: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        blocks: [],
        prepay: parseFloat(this.prepay.prepayValue)
      },
      building: {
        name: this.$t('promo.select_block')
      },
      selectedBlocks: [],
    }
  },
  computed: {
    hasBlocks() {
      return this.selectedBlocks.length > 0
    },
  },
  watch: {
    selectedBlocks() {
      this.updateFormTypes()
    }
  },
  created() {
    const fromHistorySide = this.prepay.hasOwnProperty('historyContext')
    if (fromHistorySide) {
      this.setUpHistoryProperties()
    }
  },
  methods: {
    ...mapMutations(['updateCreationSelectedBlocks']),
    idGenerator(id) {
      return id + String.fromCharCode(Math.floor(Math.random() * 26) + 97)
          + Math.random().toString(16).slice(2)
          + Date.now().toString(16).slice(4)
    },
    saveSpecificContent({id, types}) {
      const {blocks, prepay} = this.form
      const findIndex = blocks.findIndex(block => block.id === id)
      if (findIndex !== -1) {
        this.form.blocks[findIndex].types = types
      } else {
        this.form.blocks.push({id, prepay, types})
      }

      this.updateCreationSelectedBlocks({id, prepay, types})
    },
    updateFormTypes() {
      const ids = this.selectedBlocks.map(selectedBlock => selectedBlock.id)
      this.form.blocks = this.form.blocks.filter(block => {
        const index = ids.findIndex(id => id === block.id)
        return index !== -1
      })
    },
    deletePrepayContent() {
      const {prepay, form} = this
      const id = prepay.prepayId
      const prepayValue = form.prepay
      this.$emit('delete-prepay-content', {id, prepay: prepayValue})
    },
    blockSelectionError(error) {
      const id = this.prepay.prepayId
      return error.replace(id, this.building.name)
    },
    setUpHistoryProperties() {
      const {historyContext} = this.prepay

      const comparedBlocks = []

      historyContext.forEach(historyBlock => {
        const {id} = historyBlock.block
        const equalBlock = this.blockOptions.find(blockOption => blockOption.id === id)
        if (equalBlock) {
          const findBlock = Object.assign({}, equalBlock)
          comparedBlocks.push(findBlock)
        }
      })

      this.selectedBlocks = comparedBlocks
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>