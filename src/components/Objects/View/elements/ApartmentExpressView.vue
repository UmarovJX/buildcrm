<template>
  <b-sidebar
      right
      shadow
      backdrop
      no-header
      v-model="visibleComp"
      sidebar-class="sidebar__apartment"
      body-class="sidebar__apartment-body"
      aria-labelledby="sidebar-no-header-title"
      id="apartment-express-view"
      :backdrop-variant="variant"
  >
    <template #default="{ hide }">
      <section v-if="hasApartment && !appLoading">
        <!--  HEAD    -->
        <div class="head d-flex justify-content-between pdf-item">
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
        <primary-information
            class="pdf-item"
            :apartment="sidebarApartment"
            @for-print="getCalc"
        />

        <ApartmentComments
            :comments-data="commentsData"
            @update-comments="getComments"
            :comment-loading="commentLoading"
            :express-view="true"
            :apartment-uuid="apartmentUuid"
        />

        <!--   ACTIONS     -->
        <div class="action-block">

          <!-- VIEW MORE-->
          <router-link
              :to="{
                  name: 'apartment-view',
                    params: {
                      object: sidebarApartment.object.id,
                      id: apartment.uuid
                    }
                  }"
          >
            <base-button
                id="learnMore"
                :text="`${ $t('more_info') }`"
                class="violet-gradient"
            >
              <template #left-icon>
                <base-eye-icon :square="20" fill="#fff"/>
              </template>
            </base-button>
          </router-link>

          <b-tooltip
              target="learnMore"
              triggers="hover"
          >
            <p class="tooltip-text">
              {{ $t('more_info') }}
            </p>
          </b-tooltip>

          <!--      CHECKOUT        -->
          <base-button
              v-if="permission.order"
              @click="orderApartment"
              :text="`${ $t('apartments.list.confirm') }`"
              design="violet-gradient"
          />

          <!--      CONTINUE CHECKOUT        -->
          <base-button
              v-if="permission.continueOrder"
              @click="continueApartmentOrder"
              :text="`${ $t('continue_registration') }`"
              class="checkout__button violet-gradient"
          />

          <!--       MAKE A RESERVATION       -->
          <base-button
              v-if="permission.reserve"
              @click="showReservationModal = true"
              :text="`${ $t('apartments.list.book') }`"
              v-b-modal.modal-reserve-create
          >
            <template #left-icon>
              <base-minus-circle-icon :square="20" fill="#4B5563"/>
            </template>
          </base-button>

          <!-- CANCEL RESERVE -->
          <base-button
              v-if="permission.cancelReserve"
              :text="`${ $t('apartments.list.cancel_reserve') }`"
              class="reserve__button"
              @click="cancelReservation"
          />

          <!--     CONTRACT VIEW         -->
          <router-link
              v-if="permission.contract"
              :to="{name:'contracts-view', params:{ id: sidebarApartment.order.id } }"
          >
            <base-button
                design="violet-gradient px-5"
                :text="`${ $t('apartments.list.contract') }`"
            />
          </router-link>


          <!--PRINT-->
          <button
              id="print"
              @click="printApartmentInformation"
              class="print__button bg-gray-100 d-flex justify-content-center align-items-center "
          >
            <base-print-icon :square="20" fill="#4B5563"/>
          </button>
          <b-tooltip
              target="print"
              triggers="hover"
          >
            <p class="tooltip-text">
              {{ $t('apartments.view.print') }}
            </p>
          </b-tooltip>
        </div>
      </section>

      <!--  MAKE A RESERVATION MODAL    -->
      <reserve
          v-if="showReservationModal"
          :apartment="sidebarApartment.uuid"
          @CreateReserve="updateContent"
      />

      <PdfTemplate
          v-if="visible && Object.keys(sidebarApartment).length"
          ref="html2Pdf"
          :apartment="sidebarApartment"
          :print-calc="printCalc"
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
import {formatToPrice} from "@/util/reusable";
import {mapGetters, mapMutations} from "vuex";
import api from "@/services/api";
import PdfTemplate from "@/components/PdfTemplate";
import CheckoutPermission from "@/permission/checkout";
import ApartmentComments from "@/components/Objects/View/elements/ApartmentComments";

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
    BaseEyeIcon,
    PdfTemplate,
    ApartmentComments
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
      tabList() {
        return [
          {
            name: 'Успешные',
            status: 'success',
            counts: 2
          },
          {
            name: 'Ошибка загрузки',
            status: 'failed',
            counts: 3
          }
        ]
      },
      sidebarApartment: {},
      appLoading: true,
      variant: 'none',
      visibleModal: true,
      showReservationModal: false,
      printCalc: {},
      commentsData: {},
      commentLoading: false,
      editDatePermission: CheckoutPermission.getEditDatePermission(),
      bookPermission: CheckoutPermission.getBookPermission(),
      checkoutPermission: CheckoutPermission.getCheckoutCheckPermission(),
      checkoutRootPermission: CheckoutPermission.getRootPermission(),
    }
  },

  /* COMPUTED */
  computed: {
    ...mapGetters({
      me: "getMe",
      reserveClient: "getReserveClient",
    }),
    visibleComp: {
      get() {
        return this.visible
      },
      set(value) {
        if (value) {
          this.fetchSidebarItem()
          this.getComments()
        } else {
          this.$emit('hide-apartment-sidebar-view')
        }
      },
    },
    hasApartment() {
      return Object.keys(this.sidebarApartment).length > 0
    },
    price() {
      return formatToPrice(this.sidebarApartment.price, 2) + ' ' + this.$t('ye')
    },
    squareMetrePrice() {
      return formatToPrice(this.sidebarApartment.price_m2) + ' ' + this.$t('ye')
    },
    status() {
      if (!this.sidebarApartment['is_sold']) {
        return 'unavailable'
      }
      return this.sidebarApartment.order.status
    },

    permission() {
      const context = {
        cancelReserve: false,
        reserve: false,
        continueOrder: false,
        order: false,
        contract: false
      }

      if (!this.hasApartment) return context

      const {sidebarApartment, me} = this
      const {order} = sidebarApartment
      // const {checkout} = userPermission
      const forSale = sidebarApartment['is_sold']
      const authorityUser = order?.user?.id === me?.user?.id
      // const rootContract = userPermission?.checkout?.root
      // const isMainRole = me?.role?.id === 1
      const isStatusBooked = order.status === 'booked'
      const isStatusAvailable = order.status === 'available'
      const isStatusHold = order.status === 'hold'
      const isStatusSold = order.status === 'sold'
      const isStatusClosed = order.status === 'closed'
      const isStatusContract = order.status === 'contract'

      const permissionCancelReserve = isStatusBooked && (authorityUser || this.checkoutRootPermission)
      const permissionReserve = forSale && isStatusAvailable && this.bookPermission

      const permissionContract = () => {
        const permissionOne = this.checkoutPermission && authorityUser
        return (isStatusSold || isStatusContract || isStatusClosed) && (permissionOne || this.checkoutRootPermission)
      }

      const permissionOrder = () => {
        const permissionOne = isStatusAvailable && (authorityUser || this.checkoutPermission || this.checkoutRootPermission)
        return forSale && permissionOne
      }
      const permissionContinueOrder = () => {
        const permissionOne = isStatusHold && (authorityUser || this.checkoutRootPermission || this.checkoutPermission)
        const permissionTwo = isStatusBooked && authorityUser && this.checkoutPermission
        return permissionOne || permissionTwo
      }

      const effectContext = (property) => {
        context[property] = true
      }

      permissionCancelReserve && effectContext('cancelReserve')
      permissionReserve && effectContext('reserve')
      permissionOrder() && effectContext('order')
      permissionContinueOrder() && effectContext('continueOrder')
      permissionContract() && effectContext('contract')

      return context
    }
  },


  /* METHODS */
  methods: {
    ...mapMutations(['setCalculationProperties']),
    async getComments() {
      const {object} = this.$route.params
      this.commentLoading = true
      await api.apartmentsV2.getApartmentComments(object, this.apartment.uuid).then((res) => {
        this.commentsData = res.data
      }).catch((err) => {
        this.toasted(err.message, "error");
      }).finally(() => {
        this.commentLoading = false
      })
    },
    printPdf() {
      this.pdfVisible = true
      this.$refs.html2Pdf.generatePdf()
    },
    getCalc(value) {
      this.printCalc = value
      this.setCalculationProperties(value)
    },
    changeTabOfUploadList(status) {
      const {status: queryStatus} = this.$route.query
      if (queryStatus !== status) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            status
          }
        })
      }
    },
    viewMore() {
      this.$router.push({
        name: 'apartment-view',
        params: {
          object: this.sidebarApartment.object.id,
          id: this.apartment.uuid
        }
      })
    },
    async fetchSidebarItem() {
      this.appLoading = true
      const {object} = this.$route.params
      await api.apartmentsV2.getApartmentView(object, this.apartmentUuid)
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
      try {
        const apartments = [this.sidebarApartment.id]
        const {data} = await api.orders.holdOrder(apartments)
        if (data) {
          const objectId = data.apartments[0].object.id
          await this.$router.push({
            name: 'experiment',
            params: {
              id: data.uuid,
              object: objectId
            }
          })
          /*await this.$router.push({
            name: "checkout",
            params: {
              id: data.uuid
            }
          })*/
        }
      } catch (e) {
        this.toastedWithErrorCode(e)
      } finally {
        this.appLoading = false
      }
    },
    continueApartmentOrder() {
      this.$router.push({
        name: 'confirm-apartment',
        params: {
          id: this.sidebarApartment.order.id,
          object: this.apartment.object.id
        },
      })
    },
    updateContent() {
      this.$emit('update-content')
      this.fetchSidebarItem()
      this.getComments()
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
              cancelButtonText: this.$t("cancel"),
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
::v-deep .b-sidebar
  filter: drop-shadow(-16px 0px 64px rgba(0, 0, 0, 0.16)) drop-shadow(-16px 0px 24px rgba(0, 0, 0, 0.06))

  &.b-sidebar-right
    border-radius: 56px 0 0 56px

  & > .b-sidebar-body
    border-radius: 1rem

::v-deep .sidebar__apartment
  width: 42rem
  font-family: CraftworkSans, serif

  &-body
    //margin: 0 3.5rem
    //padding: 3.5rem 0
    padding: 3.5rem
    -ms-overflow-style: none
    scrollbar-width: none

    &::-webkit-scrollbar
      display: none


    .head
      line-height: 1.75rem

      .close__button
        min-width: 3.5rem
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
        min-width: max-content
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

//.checkout__button
//padding: 1rem 3rem

.action-block
  display: flex
  flex-wrap: wrap
  margin-top: 1rem
  margin-bottom: .5rem
  gap: .5rem


.print__button,
.cancel__button,
.view__button
  outline: none
  border: none
  width: 3.5rem
  height: 3.5rem
  border-radius: 50%

.contract_view_btn
  height: 3.5rem
  border-radius: 2rem
  padding: 1rem 2rem
  background-color: var(--blue-600)

.status
  &-waiting
    background-color: var(--yellow-100) !important
    color: var(--yellow-600) !important

  &-contract
    background-color: var(--blue-100) !important
    color: var(--blue-600) !important

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
    background-color: var(--gray-100) !important
    color: var(--gray-600) !important

  &-unavailable
    background-color: var(--gray-500) !important
    color: var(--white) !important


::v-deep .b-tooltip
  .tooltip-text
    color: #fff !important
    margin-bottom: 0

</style>
