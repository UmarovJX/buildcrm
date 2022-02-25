<template>
  <b-modal
      size="xl"
      id="promoCreationModal"
      :title="modalTitle"
      @hidden="closedModal"
      @shown="showCreationModal"
      :no-close-on-backdrop="true"
      :hide-header-close="true"
      :no-close-on-esc="true"
  >
    <b-overlay :show="loading" rounded="sm">
      <ValidationObserver ref="accordion-input-observer" class="flex w-100">
        <div>
          <!--  Date Inputs  -->
          <promo-date-interface ref="promo-date-interface"/>

          <!--   Prepay Lists     -->
          <promo-prepay-content
              v-for="prepay in prepaysList"
              :key="prepay.prepayId"
              :prepay="prepay"
              :block-options="blockOptions"
              @delete-prepay-content="deletePrepayContent"
          />

          <!--   Prepayment Input     -->
          <promo-prepay-input
              @add-prepay-content="addPrepayContent"
              :prepaysListLength="prepaysList.length"
              ref="prepay-input"
          />
        </div>
      </ValidationObserver>

      <template #overlay>
        <div class="text-center">
          <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
          <p id="cancel-label">Please wait...</p>
        </div>
      </template>
    </b-overlay>

    <template #modal-footer>
      <div class="d-flex justify-content-end">
        <b-button
            variant="danger"
            class="mt-0 mr-4"
            @click="closeCreationModal"
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
              class="mt-0 mr-0"
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
import api from "@/services/api";
import {mapGetters, mapMutations} from "vuex";
import PromoPrepayContent from "@/components/Dashboard/Objects/Components/Promo/PromoPrepayContent";
import PromoDateInterface from "@/components/Dashboard/Objects/Components/Promo/PromoDateInterface";
import PromoPrepayInput from "@/components/Dashboard/Objects/Components/Promo/PromoPrepayInput";

export default {
  name: 'PromoCreationContent',
  components: {
    PromoPrepayInput,
    PromoDateInterface,
    PromoPrepayContent
  },
  emits: ['successfully-created', 'error-on-creation', 'successfully-edited'],
  data() {
    return {
      loading: false,
      readyForSubmit: false,
      blockOptions: [],
      prepaysList: [],
      errors: {
        block: '',
        currentBlockIndex: null
      }
    }
  },
  async created() {
    if (!this.hasHistory) {
      await this.fetchBlockOptions()
    }
  },
  computed: {
    ...mapGetters(['getEditHistoryContext', 'getSelectedBlocks']),
    modalTitle() {
      if (this.hasHistory) {
        return this.$t('promo.edit_title')
      }
      return this.$t('promo.creation_title')
    },
    hasHistory() {
      return Object.keys(this.getEditHistoryContext).length > 0
    }
  },
  methods: {
    ...mapMutations([
      'mutateFormButton',
      'setUpSelectedBlocks',
      'deletePromoCreationBlock',
      'makeDefaultCreationSelectedBlocks',
    ]),
    async fetchBlockOptions() {
      const {id} = this.$route.params
      await api.objects.fetchObjectBlocks(id)
          .then(response => {
            this.blockOptions = response.data
          })
    },
    addPrepayContent(prepayValue) {
      const prepayInputComponent = this.$refs['prepay-input']
      if (this.prepaysList.length) {
        const hasValueBefore = this.prepaysList.find(prepay => parseFloat(prepay.prepayValue) === parseFloat(prepayValue))
        if (hasValueBefore) {
          prepayInputComponent.showWarningForSameValue()
          return
        }
      }

      const prepayId = new Date().getTime()
      const prepayAddition = {prepayId, prepayValue}
      this.prepaysList.push(prepayAddition)
      prepayInputComponent.resetContent()
    },
    deletePrepayContent({id, prepay}) {
      const currentIndex = this.prepaysList.findIndex(prepayList => prepayList.prepayId === id)
      if (currentIndex !== -1) {
        this.prepaysList.splice(currentIndex, 1)
        this.deletePromoCreationBlock(prepay)
      }
    },
    async updatePromo() {
      const {uuid: promoId} = this.getEditHistoryContext
      this.toggleLoading()
      const {id} = this.$route.params
      const dateInterface = this.$refs['promo-date-interface']
      const dates = await dateInterface.getValidDates()

      const blocks = this.getSelectedBlocks.map((block) => {
        const {id, types} = block
        let discount = {
          prepay: block.discount.prepay,
          id: null
        }

        const hasOwnDiscount = block.hasOwnProperty('discount')

        if (hasOwnDiscount) {
          discount.id = block.discount.id
        }

        return {
          id,
          types,
          discount
        }
      })

      const form = {blocks, ...dates.form}
      await api.objects.updateObjectPromo({id, promoId, form})
          .then(() => {
            this.$emit('successfully-edited')
          })
          .catch((error) => {
            this.$emit('error-on-creation', error)
          })
          .finally(() => {
            this.toggleLoading()
            this.$bvModal.hide('promoCreationModal')
          })
    },
    async submitFormData() {
      this.toggleLoading()
      const {id} = this.$route.params
      const dateInterface = this.$refs['promo-date-interface']
      const dates = await dateInterface.getValidDates()

      // const blocks = this.getSelectedBlocks.map((block) => {
      //   const {id, types} = block
      //   let discount = {
      //     prepay: block.prepay,
      //     id: null
      //   }
      //   return {
      //     id,
      //     types,
      //     discount
      //   }
      // })

      const blocks = this.getSelectedBlocks.map(({id, types, discount}) => {
        return {
          id,
          types,
          discount
        }
      })

      const form = {blocks, ...dates.form}
      await api.objects.createObjectPromo({id, form})
          .then(() => {
            this.$emit('successfully-created')
          })
          .catch((error) => {
            this.$emit('error-on-creation', error)
          })
          .finally(() => {
            this.toggleLoading()
            this.$bvModal.hide('promoCreationModal')
          })
    },
    toggleLoading() {
      this.loading = !this.loading
    },
    showCreationModal() {
      const length = Object.keys(this.getEditHistoryContext).length
      if (length) {
        this.setSelectedHistoryBlocks()
        this.$refs['promo-date-interface'].setUpHistoryContext()
      }
    },
    async setSelectedHistoryBlocks() {
      await this.fetchBlockOptions()
          .then(() => {
            let {blocks: historyList} = this.getEditHistoryContext

            for (let i = 0; i < historyList.length; i++) {
              const currentList = historyList[i]
              const {discount} = currentList
              const hasInPackage = this.prepaysList.findIndex(loopPackage => loopPackage.prepayValue === discount.prepay)
              if (hasInPackage !== -1) {
                // const hasHistoryBlock = this.prepaysList[hasInPackage].historyContext.findIndex(historyBlock => historyBlock.block.id === currentList.block.id)
                // if(hasHistoryBlock !== -1){
                //   this.prepaysList[hasInPackage].historyContext[hasHistoryBlock].types.push(...currentList.types)
                // }
                this.prepaysList[hasInPackage].historyContext.push(currentList)
              } else {
                const prepayId = new Date().getTime() + i

                const additionPackage = {
                  prepayId,
                  prepayValue: discount.prepay,
                  historyContext: [currentList]
                }

                this.prepaysList.push(additionPackage)
              }
            }

            const filterForSubmit = historyList.map(({discount, block, types: rowTypes}) => {
              const prepayId = this.prepaysList.find(list => list.prepayValue === discount.prepay).prepayId

              const types = rowTypes.map(({currency_type, price, items}) => {
                const values = items.map(item => item.value)
                const type = items[0].type
                return {
                  currency_type, price, type, values
                }
              })

              return {
                id: block.id, types, discount, prepayId
              }
            })

            this.setUpSelectedBlocks(filterForSubmit)
          })
    },
    async validationObserverAvailable() {
      this.$refs["prepay-input"].activateEmptyError()
      const compareMileStone = this.$refs['promo-date-interface'].compareMileStone()
      const observerValidation = await this.$refs['accordion-input-observer'].validate()
      return observerValidation && compareMileStone && this.prepaysList.length
    },
    async formValidation() {
      const valid = await this.validationObserverAvailable()
      this.mutateFormButton()

      if (valid) {
        const positionHistory = Object.keys(this.getEditHistoryContext).length > 0
        if (positionHistory)
          await this.updatePromo()
        else
          await this.submitFormData()

      }
    },
    closedModal() {
      this.prepaysList = []
      this.makeDefaultCreationSelectedBlocks()
    },
    closeCreationModal() {
      this.$swal({
        title: this.$t("promo.alert_before_close_title"),
        text: '',
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("yes"),
        cancelButtonText: this.$t('no')
      }).then((result) => {
        if (result.value) {
          this.$bvModal.hide('promoCreationModal')
        }
      })

    }
  }
}
</script>
