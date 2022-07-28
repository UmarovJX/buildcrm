<template>
  <b-modal
      size="self"
      id="promoCreationModal"
      :title="modalTitle"
      :no-close-on-backdrop="true"
      :hide-header-close="true"
      :no-close-on-esc="true"
      @shown="setHistoryContext"
      @hidden="setToDefault"
  >
    <b-overlay :show="loading" rounded="sm">

      <ValidationObserver ref="accordion-input-observer" class="flex w-100">
        <div>
          <!--  Date Inputs  -->
          <DateInterface ref="promo-date-interface"/>

          <TariffContent
              v-for="traffic in traffics"
              :key="traffic.uniqueId"
              :traffic="traffic"
              :unique-id="traffic.uniqueId"
              :blockOptions="blockOptions"
              @delete-tariff-content="deleteTariffContent(traffic.uniqueId)"
              @set-prepay-properties="setPrepayProperties"
              @clone-promo-field="clonePromoProperties"
          />

          <!--    Addition Button      -->
          <div class="addition__traffic">
            <button
                class="addition__traffic-button"
                @click="addPromoTraffic"
            >
              {{ $t('apartments.add_tariff') }}
            </button>
          </div>
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
          >
            {{ $t('save') }}
          </b-button>
        </b-overlay>
      </div>
    </template>
  </b-modal>
</template>

<script>
import {idGenerator} from "@/util/reusable"
import api from "@/services/api";
import DateInterface from "@/components/Dashboard/Objects/Promo/components/DateInterface";
import TariffContent from "@/components/Dashboard/Objects/Promo/components/TariffContent";
import {mapGetters, mapMutations} from "vuex";

export default {
  name: 'PromoCreationContent',
  components: {
    DateInterface,
    TariffContent,
  },
  emits: [
    'successfully-created',
    'error-on-creation',
    'successfully-edited'
  ],
  data() {
    return {
      loading: false,
      readyForSubmit: false,
      blockOptions: [],
      traffics: [],
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
    ...mapGetters({
      getEditHistoryContext: 'getEditHistoryContext'
    }),
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
    ...mapMutations({
      togglePromoError: "togglePromoError"
    }),
    async fetchBlockOptions() {
      const {id} = this.$route.params
      await api.promo.fetchObjectBlocks(id)
          .then(response => {
            this.blockOptions = response.data
          })
    },
    addPromoTraffic() {
      const context = {
        uniqueId: idGenerator()
      }
      this.traffics.push(context)
    },
    toggleLoading() {
      this.loading = !this.loading
    },
    clonePromoProperties(uniqueId) {
      const cloningTraffic = this.traffics.find(traffic => traffic.uniqueId === uniqueId)

      const context = {
        clone: true,
        uniqueId: idGenerator(),
        discount: {
          id: null,
          prepay: null
        },
        blocks: cloningTraffic.blocks
      }

      this.traffics.push(context)
    },
    async formValidation() {
      const dateInterface = this.$refs['promo-date-interface']
      const dates = await dateInterface.getValidDates()
      const formValidToSubmit = await this.validationObserverAvailable()
      if (formValidToSubmit && this.traffics.length) {
        const blocks = this.sortDataForSubmit()
        const form = {
          ...dates.form,
          blocks
        }
        const history = Object.keys(this.getEditHistoryContext).length
        if (history) {
          await this.updatePromo(form)
        } else {
          await this.createPromo(form)
        }
      }
    },
    async createPromo(form) {
      this.toggleLoading()
      const objectID = this.$route.params.id
      await api.promoV2.promoCreate(objectID, form)
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
    async updatePromo(form) {
      this.toggleLoading()
      const promoId = this.getEditHistoryContext.uuid
      const objectId = this.$route.params.id
      await api.promoV2.promoUpdate(objectId, promoId, form)
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
    sortDataForSubmit() {
      const blocks = []
      this.traffics.forEach(traffic => {
        traffic.blocks.forEach(block => {
          const types = block.types.map(({currency_type, price, type, values}) => {
            return {
              currency_type,
              values,
              price,
              type
            }
          })

          blocks.push({
            discount: traffic.discount,
            id: block.id,
            types,
          })
        })
      })
      return blocks
    },
    async validationObserverAvailable() {
      const compareMileStone = this.$refs['promo-date-interface'].compareMileStone()
      const observerValidation = await this.$refs['accordion-input-observer'].validate()
          .then((response) => {
            this.togglePromoError()
            return response
          })
      return observerValidation && compareMileStone
    },
    closeCreationModal() {
      this.$swal({
        title: this.$t("promo.alert_before_close_title"),
        text: '',
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes_close"),
        cancelButtonText: this.$t('no')
      }).then((result) => {
        if (result.value) {
          this.$bvModal.hide('promoCreationModal')
        }
      })
    },
    deleteTariffContent(uniqueId) {
      const currentIndex = this.traffics.findIndex(traffic => traffic.uniqueId === uniqueId)
      this.traffics.splice(currentIndex, 1)
    },
    setPrepayProperties(prepayProperties) {
      const {uniqueId} = prepayProperties
      const currentTrafficIndex = this.traffics.findIndex(traffic => traffic.uniqueId === uniqueId)
      this.traffics[currentTrafficIndex] = prepayProperties
    },
    setToDefault() {
      this.traffics = []
    },
    setHistoryContext() {
      const forEditContext = Object.keys(this.getEditHistoryContext).length
      if (forEditContext) {
        this.$refs['promo-date-interface'].setUpHistoryContext()
        this.getEditHistoryContext.blocks
            .forEach(block => {
              if (this.traffics.length) {
                const hasInPackage = this.traffics.findIndex(traffic => {
                  return parseInt(traffic.discount.prepay) === parseInt(block.discount.prepay)
                })
                if (hasInPackage !== -1) {
                  const types = block.types.map(({currency_type, price, items}) => {
                    return {
                      values: items.map(item => item.value),
                      blockId: block.block.id,
                      type: items[0].type,
                      floor: items[0].floor,
                      id: idGenerator(),
                      currency_type,
                      price
                    }
                  })

                  this.traffics[hasInPackage].blocks.push({
                    id: block.block.id,
                    types
                  })

                  return
                }
              }

              const types = block.types.map(({currency_type, price, items}) => {
                return {
                  values: items.map(item => item.value),
                  blockId: block.block.id,
                  type: items[0].type,
                  floor: items[0].floor,
                  id: idGenerator(),
                  currency_type,
                  price
                }
              })

              const blocks = [
                {
                  id: block.block.id,
                  types
                }
              ]

              this.traffics.push({
                history: true,
                uniqueId: idGenerator(),
                discount: block.discount,
                blocks
              })
            })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addition__traffic {
  width: 100%;
  min-height: 18.25rem;
  background-color: #F9FBFF;
  border-radius: .5rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &-button {
    display: block;
    outline: none;
    border: none;
    color: #fff;
    background-color: #41B883;
    border-radius: 0.5rem;
    padding: .75rem 1rem;
    cursor: pointer;
  }
}

::v-deep .modal-self {
  width: 90vw;
}

@media (min-width: 576px) {
  ::v-deep .modal-dialog {
    max-width: 1300px;
    margin: 1.75rem auto;
  }
}

</style>