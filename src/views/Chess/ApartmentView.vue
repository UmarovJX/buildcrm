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
            <div class="d-flex flex-wrap justify-content-between">
              <!--    INPUTS      -->
              <div class="w-100 inputs">

                <!--    PAYMENT OPTIONS       -->
                <div>
                  <base-select
                      :label="true"
                      :options="paymentOption"
                      :no-placeholder="true"
                      :value="discount"
                      value-field="id"
                      @change="changeDiscount"
                      placeholder="Вариант оплаты"
                  ></base-select>
                </div>

                <!--     INPUT MONTHLY PAYMENT       -->
                <div class="monthly" v-show="showMonthlyCalculation">
                  <div class="placeholder font-weight-600">Ежемесячный платеж</div>
                  <div class="input d-flex justify-content-between">
                    <input
                        v-if="discount.amount > 0"
                        v-model="calc.month"
                        @input="changeDiscount_month"
                        type="number"
                        class="input-monthly-payment color-gray-600 w-100"
                        :placeholder="$t('monthly_payment')"
                    >
                    <span v-else class="d-block">{{ $t('monthly_payment') }}</span>
                    <div class="font-inter color-gray-600 font-weight-600">месяцев</div>
                  </div>
                  <div class="square-price font-inter color-gray-600 font-weight-600">
                    По {{ pricePrettier(monthly_price) }} сум
                  </div>
                </div>

                <!--     DISCOUNT PER M2       -->
                <base-input
                    class="discount-per-m2"
                    type="number"
                    :label="true"
                    :currency="`${$t('ye')}`"
                    placeholder="Скидка за м2"
                    @trigger-input="changeDiscount_price"
                />
              </div>

              <!--     OUTPUTS     -->
              <div class="w-100 outputs font-inter">
                <div class="d-flex justify-content-between">
                  <span class="property d-block color-gray-400">
                    Начальная цена
                  </span>
                  <span class="price d-block color-gray-600">{{ initialPrice }} {{ $t('ye') }}</span>
                </div>

                <div class="d-flex justify-content-between">
                  <span class="property d-block color-gray-400">
                    {{ $t('selling_price') }} m<sup>2</sup>
                  </span>
                  <span class="price d-block color-gray-600">
                    {{ pricePrettier(calc.price_for_m2) }} {{ $t('ye') }}</span>
                </div>

                <div class="d-flex justify-content-between">
                  <span class="property d-block color-gray-400">
                    {{ $t('apartments.view.prepayment') }} {{ calc.prepay_percente }}%
                  </span>
                  <span v-if="calc.prepay_percente === 100"
                        class="price d-block color-gray-600"
                  >
                    {{ pricePrettier(calc.total) }} {{ $t('ye') }}
                  </span>
                  <span
                      v-else
                      class="price d-block color-gray-600"
                  >
                    {{ pricePrettier(calc.prepay) }}
                  </span>
                </div>

                <div v-if="discount.amount > 0" class="d-flex justify-content-between">
                  <span class="property d-block color-gray-400">{{ $t('contracts.view.remainder') }}</span>
                  <span class="price d-block color-gray-600">{{ pricePrettier(calc.debt) }} {{ $t('ye') }}</span>
                </div>

                <div class="d-flex justify-content-between">
                  <span class="property d-block color-violet-600">{{ $t('apartments.view.total') }}</span>
                  <span class="price d-block color-violet-600 total-price">
                    {{ pricePrettier(calc.total) }}  {{ $t('ye') }}
                  </span>
                </div>
              </div>
            </div>
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
import BaseSelect from "@/components/Reusable/BaseSelect";
import BaseLoading from "@/components/Reusable/BaseLoading";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRight from "@/components/icons/BaseArrowRightIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import PrimaryInformation from "@/components/Objects/View/elements/PrimaryInformation";
import BasePrintIcon from "@/components/icons/BasePrintIcon";
// import BaseMinusCircleIcon from "@/components/icons/BaseMinusCircleIcon";
import BaseInput from "@/components/Reusable/BaseInput";
import Reserve from "@/components/Dashboard/Apartment/Components/Reserve";
import {formatToPrice} from "@/util/reusable";
import {mapGetters} from "vuex";

export default {
  name: "ApartmentView",

  components: {
    BaseInput,
    BaseSelect,
    BaseLoading,
    BaseArrowLeft,
    BaseArrowRight,
    BasePrintIcon,
    PrimaryInformation,
    // BaseMinusCircleIcon,
    Reserve,
    BaseButton
  },

  data() {
    return {
      selectedOption: null,
      monthlyPayment: null,
      discountPerM2: null,
      apartment: {},
      discount: {
        amount: 0
      },
      calc: {
        amount: 0,
        price_for_m2: 0,
        discount_price: 0,
        monthly_price: 0,
        prepay: 0,
        debt: 0,
        total: 0,
        prepay_percente: 0
      },
      monthly_price: 0,
      calForPrint: {},
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
    initialPrice() {
      return this.pricePrettier(this.apartment.prices.price)
    },
    showMonthlyCalculation() {
      return this.calc.prepay_percente !== 100
    },
    getApartmentDiscounts() {
      const hasDiscount = this.hasApartment && this.apartment.hasOwnProperty('discounts')
      if (!hasDiscount) return []
      const discounts = [...this.apartment.discounts]
      return discounts.sort((a, b) => a.prepay - b.prepay)
    },
    status() {
      return this.apartment.order.status
    },
    paymentOption() {
      const discounts = [...this.apartment.discounts]
      if (!this.hasApartment) return
      return discounts.sort((a, b) => a.prepay - b.prepay)
          .map((discount, index) => {
            let text = this.$t("apartments.view.variant")
            if (discount.type === 'promo') text += ' ' + `( ${this.$t('promo.by_promo')} )`
            text += ' ' + (index + 1) + ' - ' + discount.prepay + '%'
            return {
              text,
              value: discount,
              id: discount.id
            }
          })
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
    pricePrettier: (price) => formatToPrice(price),
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

    // hideApartmentSidebar() {
    //   this.$emit('hide-apartment-sidebar-view')
    // },

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

    async initialCalc() {
      if (Object.keys(this.discount).length < 1) {
        this.discount = this.getApartmentDiscounts ? this.getApartmentDiscounts[0] : {amount: 0}
      }

      if (this.discount.type === "percent") {
        if (this.discount.prepay === 100) {
          this.calc.price_for_m2 = this.apartment.prices.price_m2;
        } else {
          this.calc.price_for_m2 =
              this.getTotalForPercente() / this.apartment.plan.area;
        }
      } else {
        this.calc.price_for_m2 = this.discount.amount;
      }
      this.calc.prepay_percente = this.discount.prepay;
      this.calc.prepay = this.getPrepay();
      this.calc.month = this.apartment?.object?.credit_month;
      this.calc.monthly_price = this.getMonth();
      this.monthly_price = this.calc.monthly_price;
      this.calc.debt = this.getDebt();
      this.calc.total = this.getTotal();

      this.calForPrint = this.calc;
      this.$emit("getCalData", this.calForPrint);
    },

    async changeDiscount(discountId) {
      this.discount = this.paymentOption.find(option => option.value.id === discountId).value
      this.calc.prepay_percente = this.discount.prepay;
      this.calc.discount_price = 0;
      if (this.discount.type === "fixed" || this.discount.type === "promo") {
        await this.initialCalc();
      } else if (this.discount.prepay === 100) {
        this.calc.total = this.apartment.prices.price;
        this.calc.prepay = this.apartment.prices.price;
        this.calc.price_for_m2 = this.apartment.prices.price_m2;

        this.calForPrint = this.calc;
        this.$emit("getCalData", this.calForPrint);
      } else {
        await this.initialCalc();
      }
    },
    async changeDiscount_price(discountPrice) {
      this.calc.discount_price = discountPrice
      await this.initialCalc()
    },
    changeDiscount_month() {
      this.monthly_price = this.getMonth()
      this.calForPrint.monthly_price = this.monthly_price
    },
    getPrepay() {
      if (this.discount.prepay === 100) return 0;

      let total_discount = this.getDiscount();

      let total = 0;

      switch (this.discount.type) {
        case "promo":
        case "fixed":
          if (this.calc.discount_price) {
            total =
                (this.discount.amount - parseFloat(this.calc.discount_price)) *
                this.apartment.plan.area;
          } else {
            total = this.discount.amount * this.apartment.plan.area; //(this.discount.amount * this.apartment.plan.area) / total_discount;
          }
          break;
        default:
          total = this.getTotalForPercente() / total_discount;

          break;
      }

      return (this.discount.prepay * total) / 100;
    },
    getDiscount() {
      if (this.discount.prepay === 100) return 1;

      return 1 - this.discount.prepay / 100

      /*return 1 - this.discount.amount / 100;*/
    },
    getMonth() {
      if (this.calc.month) {
        return (this.getTotal() - this.getPrepay()) / this.calc.month;
      }
      return 0
    },
    getDebt() {
      return this.getTotal() - this.getPrepay();
    },
    getTotal() {
      let total_discount = this.getDiscount();
      let total = 0;

      switch (this.discount.type) {
        case 'promo':
        case "fixed":
          if (this.calc.discount_price) {
            total =
                (this.discount.amount - parseFloat(this.calc.discount_price)) *
                this.apartment.plan.area;
          } else {
            total = this.discount.amount * this.apartment.plan.area; //(this.discount.amount * this.apartment.plan.area) / total_discount;
          }
          break;
        default:
          total = this.apartment.prices.price / total_discount;
          if (this.calc.discount_price) {
            total -=
                parseFloat(this.calc.discount_price) * this.apartment.plan.area;
          }
          break;
      }

      return total;
    },
    getTotalForPercente() {
      let total_discount = this.getDiscount();
      let total = 0;

      switch (this.discount.type) {
        case "fixed":
          if (this.calc.discount_price) {
            total =
                (this.discount.amount - parseFloat(this.calc.discount_price)) *
                this.apartment.plan.area;
          } else {
            total = this.discount.amount * this.apartment.plan.area;
          }
          break;
        default:
          total = this.apartment.prices.price / total_discount;
          break;
      }

      return total;
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