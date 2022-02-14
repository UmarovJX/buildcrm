<template>
  <b-modal
      size="xl"
      id="promoCreationModal"
      :title="$t('promo.creation_title')"
  >
    <b-overlay :show="loading" rounded="sm">
      <div>
        <!--  Date Inputs  -->
        <promo-date-interface ref="promo-date-interface"/>

        <!--  Block Selection  -->
        <ValidationProvider
            :name="building.name"
            tag="div"
            class="col-6 p-0 pr-2 mb-4"
            rules="required"
            ref="block-selection-provider"
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
          ></multiselect>

          <span class="error__provider" v-if="errors[0]">
              {{ errors[0] }}
          </span>
        </ValidationProvider>

        <!-- Dropdown Plan   -->
        <p v-if="hasBlocks">{{ $t('promo.select_floor_plan') }}</p>
        <promo-accordion
            v-for="(block,index) in selectedBlocks"
            :key="block.id"
            :block="{...block,index}"
            @save-accordion-content="saveSpecificContent"
            :ref="`blocks-id-${block.id}`"
        />
      </div>

      <template #overlay>
        <div class="text-center">
          <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
          <p id="cancel-label">Please wait...</p>
        </div>
      </template>
    </b-overlay>

    <template #modal-footer="{ cancel }">
      <div class="d-flex justify-content-end">
        <b-button
            variant="danger"
            class="mt-0"
            @click="cancel()"
            :disabled="loading"
        >
          {{ $t('close') }}
        </b-button>
        <b-overlay
            :show="loading"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
        >
          <b-button
              class="ml-2 mt-0"
              variant="primary"
              @click="formValidation"
              :disabled="loading && readyForSubmit"
          >
            {{ $t('save') }}
          </b-button>
        </b-overlay>
      </div>
    </template>
  </b-modal>
</template>

<script>
import PromoAccordion from "@/components/Dashboard/Objects/Components/Promo/PromoAccordion";
import PromoDateInterface from "@/components/Dashboard/Objects/Components/Promo/PromoDateInterface";
import api from "@/services/api";
import {mapMutations} from "vuex";

export default {
  name: 'PromoCreationContent',
  components: {
    PromoAccordion,
    PromoDateInterface
  },
  emits: ['successfully-created','error-on-creation'],
  data() {
    return {
      form: {
        name: {},
        start_date: '',
        end_date: '',
        blocks: []
      },
      building: {
        name: this.$t('promo.select_block')
      },
      loading: false,
      readyForSubmit: false,
      blockOptions: [],
      selectedBlocks: [],
      errors: {
        block: '',
        currentBlockIndex: null
      }
    }
  },
  async created() {
    await this.fetchBlockOptions()
  },
  computed: {
    hasBlocks() {
      return this.selectedBlocks.length > 0
    }
  },
  methods: {
    ...mapMutations(['mutateFormButton']),
    async fetchBlockOptions() {
      const {id} = this.$route.params
      await api.objects.fetchObjectBlocks(id)
          .then(response => {
            this.blockOptions = response.data
          })
    },
    saveSpecificContent({id, types}) {
      const {blocks} = this.form
      const findIndex = blocks.findIndex(block => block.id === id)

      if (findIndex !== -1) {
        this.form.blocks[findIndex].types = types
      } else {
        this.form.blocks.push({id, types})
      }

      this.enableSubmitButton()
    },
    enableSubmitButton() {
      this.readyForSubmit = true
    },
    async checkBlocksValidation() {
      const {selectedBlocks} = this

      if (selectedBlocks.length) {
        const promiseResults = []

        for (const block of selectedBlocks) {
          const ref = `blocks-id-${block.id}`
          const accordionComponent = this.$refs[ref][0]
          const validations = await accordionComponent.validationObserverAvailable()
          const validation = await validations
          promiseResults.push(validation)
          if (!validation)
            accordionComponent.highlightError()
        }

        return promiseResults.every(result => result)
      }

      return false
    },
    async formValidation() {
      this.mutateFormButton()
      const validation = await this.$refs['block-selection-provider'].validate()
      const dateInterface = this.$refs['promo-date-interface']
      const dates = await dateInterface.getValidDates()
      const checkBlocks = await this.checkBlocksValidation()
      const readyToSubmit = validation.valid && dates.valid && await checkBlocks
      readyToSubmit && await this.submitFormData()
    },
    async submitFormData() {
      this.toggleLoading()
      const {id} = this.$route.params
      const dateInterface = this.$refs['promo-date-interface']
      const dates = await dateInterface.getValidDates()
      const form = {...this.form, ...dates.form}
      await api.objects.createObjectPromo({id, form})
          .then(() => {
            this.$emit('successfully-created')
          })
          .catch((error) => {
            this.$emit('error-on-creation',error)
          })
          .finally(() => {
            this.toggleLoading()
            this.$bvModal.hide('promoCreationModal')
          })
    },
    toggleLoading() {
      this.loading = !this.loading
    }
  }
}
</script>