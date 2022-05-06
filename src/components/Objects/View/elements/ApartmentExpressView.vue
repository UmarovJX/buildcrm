<template>
  <b-sidebar
      :visible="visible"
      sidebar-class="sidebar__apartment"
      body-class="sidebar__apartment-body"
      aria-labelledby="sidebar-no-header-title"
      id="apartment-express-view"
      right no-header shadow
  >
    <template #default="{ hide }">
      <vue-html2pdf
          v-if="hasApartment && !appLoading"
          :show-layout="false"
          :float-layout="true"
          :enable-download="true"
          :preview-modal="true"
          :pdf-quality="2"
          :manual-pagination="false"
          pdf-format="a5"
          :paginate-elements-by-height="3000"
          pdf-orientation="portrait"
          pdf-content-width="560px"
          :html-to-pdf-options="htmlToPdfOptions"
          ref="html2Pdf"
      >
        <section slot="pdf-content">
          <!--  HEAD    -->
          <div v-if="visible" class="head d-flex justify-content-between pdf-item">
            <span class="d-flex justify-content-center align-items-center">
              <span
                  @click="hideApartmentSidebar"
                  class="close__button d-flex justify-content-center align-items-center"
              >
                <base-arrow-left-icon :width="32" :height="32"/>
              </span>
              <span class="section__title">
                {{ sidebarApartment.object.name }} , {{ sidebarApartment.block.name }}
              </span>
            </span>
            <span
                class="apartment__status d-flex justify-content-center align-items-center"
                :class="`status-${status}`"
            >
              {{ $t(`apartments.status.${status}`) }}
            </span>
          </div>

          <!--  MAIN    -->
          <primary-information class="pdf-item" v-if="visible" :apartment="sidebarApartment"/>

          <!--   ACTIONS     -->
          <div class="d-flex flex-wrap mt-4">
            <!--      CHECKOUT        -->
            <base-button
                v-if="permission.order"
                @click="orderApartment"
                :text="`${ $t('apartments.list.confirm') }`"
                class="checkout__button bg-gradient-violet color-white mr-3 mb-4"
            />

            <!--      CONTINUE CHECKOUT        -->
            <base-button
                v-if="permission.continueOrder"
                @click="continueApartmentOrder"
                :text="`${ $t('continue_registration') }`"
                class="checkout__button bg-gradient-violet color-white mr-3 mb-4"
            />

            <!--       MAKE A RESERVATION       -->
            <base-button
                v-if="permission.reserve"
                @click="showReservationModal = true"
                :text="`${ $t('apartments.list.book') }`"
                class="checkout__button bg-gray-100 color-gray-600 mr-3 mb-4"
                v-b-modal.modal-reserve-create
            />

            <!-- CANCEL RESERVE -->
            <base-button
                v-if="permission.cancelReserve"
                :text="`${ $t('apartments.list.cancel_reserve') }`"
                class="reserve__button mr-3 mb-4"
                @click="cancelReservation"
            />

            <button
                @click="printApartmentInformation"
                class="print__button bg-gray-100 d-flex justify-content-center align-items-center mr-3 mb-4"
            >
              <base-print-icon :square="20" fill="#4B5563"/>
            </button>

            <router-link
                :to="{
                    name: 'apartment-view-clone',
                    params:{
                      object: sidebarApartment.object.id,
                      id: apartment.uuid
                    }
                  }"
                class="view__button bg-gray-100 d-flex justify-content-center align-items-center mr-3 mb-4"
            >
              <base-eye-icon :square="20" fill="#4B5563"/>
            </router-link>

            <button
                @click="hideApartmentSidebar"
                class="cancel__button bg-gray-100 d-flex justify-content-center align-items-center mr-3 mb-4"
            >
              <base-minus-circle-icon :square="20" fill="#4B5563"/>
            </button>
          </div>
        </section>
      </vue-html2pdf>

      <!--  MAKE A RESERVATION MODAL    -->
      <reserve
          v-if="showReservationModal"
          :apartment="apartment.uuid"
          @CreateReserve="updateContent"
      />

      <!--  LOADING    -->
      <base-loading class="h-100" v-if="appLoading"/>
    </template>
  </b-sidebar>
</template>
<script>
import PrimaryInformation from "@/components/Objects/View/elements/PrimaryInformation";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BasePrintIcon from "@/components/icons/BasePrintIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseMinusCircleIcon from "@/components/icons/BaseMinusCircleIcon";
import BaseLoading from "@/components/Reusable/BaseLoading";
import Reserve from "@/components/Dashboard/Apartment/Components/Reserve";
import BaseEyeIcon from "@/components/icons/BaseEyeIcon";
import VueHtml2pdf from 'vue-html2pdf'
import {formatToPrice} from "@/util/reusable";
import {mapGetters} from "vuex";
import api from "@/services/api";

export default {
  name: "ApartmentExpressView",

  /* COMPONENTS */
  components: {
    BaseButton,
    BasePrintIcon,
    BaseLoading,
    BaseArrowLeftIcon,
    PrimaryInformation,
    BaseMinusCircleIcon,
    Reserve,
    VueHtml2pdf,
    BaseEyeIcon
  },

  /* PROPS */
  props: {
    apartment: {
      type: Object,
      default: () => ({})
    },
    visible: {
      type: Boolean,
      default: false
    },
    apartmentUuid: {
      type: String,
      default: ''
    }
  },

  /* EMITS */
  emits: ['hide-apartment-sidebar-view', 'update-content'],

  /* DATA */
  data() {
    return {
      htmlToPdfOptions: {
        margin: 6,
        filename: ''
      },
      sidebarApartment: {},
      appLoading: true,
      showReservationModal: false
    }
  },

  /* COMPUTED */
  computed: {
    ...mapGetters({
      me: "getMe",
      userPermission: "getPermission",
      reserveClient: "getReserveClient",
    }),
    hasApartment() {
      return Object.keys(this.sidebarApartment).length > 0
    },
    price() {
      return formatToPrice(this.sidebarApartment.price) + ' ' + this.$t('ye')
    },
    squareMetrePrice() {
      return formatToPrice(this.sidebarApartment.price_m2) + ' ' + this.$t('ye')
    },
    status() {
      return this.sidebarApartment.order.status
    },
    permission() {
      const context = {
        cancelReserve: false,
        reserve: false,
        continueOrder: false,
        order: false
      }

      if (!this.hasApartment) return context

      const {sidebarApartment, me, userPermission} = this
      const {order} = sidebarApartment
      const {apartments} = userPermission

      const forSale = sidebarApartment['is_sold']
      const authorityUser = order?.user?.id === me?.user?.id
      const rootContract = userPermission?.apartments?.root_contract
      const isMainRole = me?.role?.id === 1
      const isStatusBooked = order.status === 'booked'
      const isStatusAvailable = order.status === 'available'
      const isStatusHold = order.status === 'hold'

      const permissionCancelReserve = isStatusBooked && (authorityUser || rootContract || isMainRole)
      const permissionReserve = forSale && isStatusAvailable && userPermission?.apartments?.reserve

      const permissionOrder = () => {
        const permissionOne = isStatusAvailable && (authorityUser || apartments.contract || rootContract)
        return forSale && permissionOne
      }

      const permissionContinueOrder = () => {
        const permissionOne = isStatusHold && (authorityUser || rootContract || isMainRole || apartments.contract)
        const permissionTwo = isStatusBooked && authorityUser && apartments.contract
        return permissionOne || permissionTwo
      }

      const effectContext = (property) => {
        context[property] = true
      }

      permissionCancelReserve && effectContext('cancelReserve')
      permissionReserve && effectContext('reserve')
      permissionOrder() && effectContext('order')
      permissionContinueOrder() && effectContext('continueOrder')
      return context
    }
  },

  watch: {
    visible(visibleValue) {
      if (visibleValue) {
        this.fetchSidebarItem()
      }
    }
  },

  /* METHODS */
  methods: {
    async fetchSidebarItem() {
      this.appLoading = true
      const {objectId} = this.$route.params
      await api.apartments.getApartmentView(objectId, this.apartmentUuid)
          .then(response => {
            this.sidebarApartment = response.data
          }).catch((error) => {
            this.toastedWithErrorCode(error)
          }).finally(() => {
            this.appLoading = false
          })
    },
    hideApartmentSidebar() {
      this.$emit('hide-apartment-sidebar-view')
    },
    printApartmentInformation() {
      const {object, block, entrance, number} = this.sidebarApartment
      this.htmlToPdfOptions.filename = object.name + ' , ' + block.name + ' , ' + entrance + '/' + number
      this.$refs.html2Pdf.generatePdf()
    },
    async orderApartment() {
      this.appLoading = true
      const apartments = [this.sidebarApartment.uuid]
      await api.orders.holdOrder(apartments)
          .then((response) => {
            if (response?.data) {
              this.$router.push({
                name: "confirm-apartment",
                params: {id: response.data.uuid}
              })
            }
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.appLoading = false
          })
    },
    continueApartmentOrder() {
      this.$router.push({
        name: "confirm-apartment",
        params: {
          id: this.sidebarApartment.order.id
        },
      })
    },
    updateContent() {
      this.$emit('update-content')
    },
    async cancelReservation() {
      this.appLoading = true
      await api.orders.fetchOrderClient(this.sidebarApartment.order.id)
          .then((response) => {
            const client = response.data
            this.$swal({
              title: this.$t("sweetAlert.title"),
              text: this.$t("sweetAlert.text_cancel_reserve"),
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: this.$t("sweetAlert.yes_cancel_reserve"),
            }).then((result) => {
              if (result.value) {
                this.appLoading = true
                api.orders.deactivateReserveOrders(client.id)
                    .then((response) => {
                      this.toasted(response.data.message, "success")

                      this.$nextTick(() => {
                        this.$bvModal.hide("modal-view-reserved-client")
                      })

                      this.hideApartmentSidebar()
                      this.updateContent()

                      this.$swal(this.$t("sweetAlert.canceled_reserve"), "", "success");
                    })
                    .catch((error) => {
                      this.toastedWithErrorCode(error)
                    })
                    .finally(() => {
                      this.appLoading = false
                    })
              }
            })
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.appLoading = false
          })
    }
  }
}
</script>

<style lang="sass" scoped>
::v-deep .sidebar__apartment
  width: 42rem
  font-family: CraftworkSans, serif

  &-body
    margin: 0 3.5rem
    padding: 3.5rem 0
    -ms-overflow-style: none
    scrollbar-width: none

    &::-webkit-scrollbar
      display: none


    .head
      line-height: 1.75rem

      .close__button
        width: 3.5rem
        height: 3.5rem
        cursor: pointer
        border-radius: 50%
        margin-right: 0.5rem
        background-color: var(--gray-100)
        transition: background-color 100ms ease-in-out

        &:hover
          background-color: var(--gray-200)

      .section__title
        color: var(--gray-600)
        font-size: 1.5rem


      .apartment__status
        font-family: Inter, sans-serif
        background-color: var(--gray-100)
        border-radius: 2rem
        padding: 0.5rem 2rem


    .vue-html2pdf
      .layout-container
        position: relative
        width: auto
        height: auto
        left: 0
        z-index: 0
        background: #FFFFFF
        display: block

.checkout__button
  padding: 1rem 3rem

.print__button,
.cancel__button,
.view__button
  outline: none
  border: none
  width: 3.5rem
  height: 3.5rem
  border-radius: 50%

.status
  &-waiting
    background-color: var(--yellow-100) !important
    color: var(--yellow-600) !important

  &-contract,
  &-booked
    background-color: var(--yellow-100) !important
    color: var(--yellow-600) !important

  &-cancelled
    background-color: var(--pink-100) !important
    color: var(--pink-600) !important

  &-available
    background-color: var(--teal-100) !important
    color: var(--teal-600) !important

  &-sold
    background-color: var(--light-blue-100) !important
    color: var(--light-blue-600) !important
</style>
