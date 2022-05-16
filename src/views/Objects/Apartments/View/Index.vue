<template>
  <main>
    <div v-if="!appLoading" class="main__content">
      <!--  HEADER NAVIGATION  -->
      <div class="header-navigation d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <span class="go__back" @click="$router.go(-1)">
            <base-arrow-left :width="32" :height="32"></base-arrow-left>
          </span>
          <span class="breadcrumb__content">
          <span class="d-flex align-items-center">
            <span class="mr-2">{{ $t('objects.title') }}</span>
            <base-arrow-right :width="16" :height="16"/>
            <span class="ml-2">{{ apartment.object.name }}</span>
            <base-arrow-right :width="16" :height="16"/>
            <span class="ml-2">
              {{ $t('apartment') }} № {{ apartment.number }}
            </span>
          </span>
          <span class="head color-violet-600">
            {{ $t('apartment') }} № {{ apartment.number }}
          </span>
        </span>
        </div>

        <div>
          <span
              class="apartment__status d-flex justify-content-center align-items-center"
              :class="`status-${status}`"
          >
              {{ $t(`apartments.status.${status}`) }}
            </span>
        </div>
      </div>

      <!--   MAIN   -->
      <div class="content-view d-flex justify-content-between flex-wrap flex-lg-nowrap">
        <!--        <div class="col-12 col-lg-5">-->
        <primary-information class="primary__information" :apartment="apartment"/>
        <!--        </div>-->
        <!--        <div class="col-12 col-lg-7">-->
        <div class="calculator w-100 d-flex flex-column justify-content-between">
          <div>
            <h4 class="calculator-title color-gray-600 font-craftworksans">Выберите вариант оплаты</h4>
            <calculator :apartment="apartment" :has-apartment="hasApartment"/>
          </div>

          <div class="align-self-stretch d-flex justify-content-end">
            <!--   ACTIONS     -->
            <div class="action-block">
              <!--      CHECKOUT        -->
              <base-button
                  v-if="permission.order"
                  @click="orderApartment"
                  :text="`${ $t('apartments.list.confirm') }`"
                  class="checkout__button violet-gradient"
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
                  class="checkout__button gray-button"
                  v-b-modal.modal-reserve-create
              />

              <!-- CANCEL RESERVE -->
              <base-button
                  v-if="permission.cancelReserve"
                  :text="`${ $t('apartments.list.cancel_reserve') }`"
                  class="reserve__button"
                  @click="cancelReservation"
              />

              <button
                  id="print"
                  @click="printApartmentInformation"
                  class="print__button bg-gray-100 d-flex justify-content-center align-items-center "
              >
                <base-print-icon :square="20" fill="#4B5563"/>
              </button>

              <!--              <button-->
              <!--                  @click="hideApartmentSidebar"-->
              <!--                  class="cancel__button bg-gray-100 d-flex justify-content-center align-items-center mr-3 mb-4"-->
              <!--              >-->
              <!--                <base-minus-circle-icon :square="20" fill="#4B5563"/>-->
              <!--              </button>-->
            </div>
          </div>
        </div>
        <!--        </div>-->
      </div>
    </div>

    <!--  MAKE A RESERVATION MODAL    -->
    <reserve
        v-if="showReservationModal"
        :apartment="apartment.id"
        @CreateReserve="updateContent"
    />

    <!--  LOADING    -->
    <base-loading v-if="appLoading"/>
  </main>
</template>

<script>
import api from "@/services/api";
import BaseLoading from "@/components/Reusable/BaseLoading";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRight from "@/components/icons/BaseArrowRightIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import PrimaryInformation from "@/components/Objects/View/elements/PrimaryInformation";
import BasePrintIcon from "@/components/icons/BasePrintIcon";
import Reserve from "@/components/Dashboard/Apartment/Components/Reserve";
import Calculator from "@/components/Objects/View/elements/Calculator";
import {formatToPrice} from "@/util/reusable";
import {mapGetters} from "vuex";

export default {
  name: "ApartmentView",

  components: {
    BaseLoading,
    BaseArrowLeft,
    BaseArrowRight,
    BasePrintIcon,
    PrimaryInformation,
    Calculator,
    Reserve,
    BaseButton
  },

  data() {
    return {
      selectedOption: null,
      discountPerM2: null,
      apartment: {},
      appLoading: false,
      showReservationModal: false,
    }
  },

  computed: {
    ...mapGetters({
      me: "getMe",
      userPermission: "getPermission",
      reserveClient: "getReserveClient",
    }),
    hasApartment() {
      return Object.keys(this.apartment).length > 0
    },
    status() {
      return this.apartment.order.status
    },
    permission() {
      const context = {
        cancelReserve: false,
        reserve: false,
        continueOrder: false,
        order: false
      }

      if (!this.hasApartment) return context

      const {apartment, me, userPermission} = this
      const {order} = apartment
      const {apartments} = userPermission
      const forSale = apartment['is_sold']
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

  async created() {
    await this.fetchApartmentView()
    await this.initialCalc()
  },

  methods: {
    pricePrettier: (price, decimalCount) => formatToPrice(price, decimalCount),
    async fetchApartmentView() {
      this.appLoading = true
      const {object, id} = this.$route.params
      await api.apartmentsV2.getApartmentView(object, id)
          .then(response => {
            this.apartment = response.data
          }).catch((error) => {
            this.toastedWithErrorCode(error)
          }).finally(() => {
            this.appLoading = false
          })
    },
    printApartmentInformation() {
      window.print()
    },
    async orderApartment() {
      this.appLoading = true
      const apartments = [this.apartment.id]
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
          id: this.apartment.order.id
        },
      })
    },
    updateContent() {
      this.$emit('update-content')
    },
    async cancelReservation() {
      this.appLoading = true
      await api.orders.fetchOrderClient(this.apartment.order.id)
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
    },
  }
}
</script>

<style lang="sass" scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button
  -webkit-appearance: none
  margin: 0

/* Firefox */
input[type="number"]
  -moz-appearance: textfield

.header-navigation
  margin-right: 4.25rem
  max-width: 640px

.main__content
  padding-left: 1rem
  padding-right: 1rem
  max-width: 1500px !important

.main__class
  background-color: white
  padding: 3rem
  min-height: 100vh
  color: var(--gray-600)

.go__back
  width: 56px
  height: 56px
  border-radius: 100%
  background-color: var(--gray-100)
  display: flex
  justify-content: center
  align-items: center
  cursor: pointer

.breadcrumb__content
  display: inline-flex
  flex-direction: column
  margin-left: 1rem
  font-weight: 600
  font-size: 14px
  color: #9CA3AF

.head
  font-size: 24px
  line-height: 28px
  color: #4B5563

.primary__information
  width: 42rem


.calculator
  margin-top: 3.5rem
  margin-left: 1rem
  margin-right: 1.5rem
  max-width: 500px

  &-title
    font-size: 1.5rem
    margin-bottom: 1.5rem

  .inputs
    margin-right: 2.25rem
    margin-bottom: 2.5rem

  .outputs
    margin-right: 2.25rem

    & > div
      margin-bottom: 2rem
      font-size: 18px
      font-weight: 600

      .total-price
        font-size: 24px

.monthly
  background-color: var(--gray-100)
  border-radius: 1rem
  margin-top: 1.5rem

  .placeholder
    letter-spacing: 1px
    color: var(--gray-400)
    text-transform: uppercase
    line-height: 10px
    font-size: 0.6rem
    margin-bottom: 0.25rem
    padding-top: 0.75rem
    padding-left: 1.5rem

  .input
    padding: 0.25rem 1.25rem 0.75rem 0
    margin-left: 1.5rem

    &::placeholder
      padding: 0

    &-monthly-payment
      border: none
      background-color: transparent

  .square-price
    padding: 0.75rem 1.25rem
    background-color: var(--gray-200)
    border-top: 2px solid var(--gray-300)
    border-bottom-right-radius: 1rem
    border-bottom-left-radius: 1rem

.discount-per-m2
  border-radius: 2rem
  background-color: var(--gray-100)
  margin-top: 1.5rem
  width: 100%

.checkout__button
  padding: 1rem 3rem

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

.apartment__status
  font-family: Inter, sans-serif
  background-color: var(--gray-100)
  border-radius: 2rem
  padding: 0.5rem 2rem

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


@media only screen and (max-width: 1390px)
  .calculator
    max-width: 640px
  .primary__information
    width: 30rem

@media (max-width: 992px)
  .primary__information
    margin: 0 auto
    width: 42rem
  .calculator
    margin: 0 auto
</style>