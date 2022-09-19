<template>
  <div class="app-checkout">
    <ErrorNotification
        :value="validationError"
        @close-bar="validationError.visible = false"
    />
    <app-header
        :page="header.page"
        :page-info="header.pageInfo"
        :breadcrumbs="header.breadcrumbs"
    >
      <template #header-right>
        <div
            v-if="expiry_at"
            :class="flexCenter"
            class="checkout-timer background-violet-gradient mr-2"
        >
          <CountDown
              :deadline="expiry_at"
              :showDays="false"
              :showHours="false"
              @timeElapsed="timeElapsedHandler"
          />
        </div>
      </template>
    </app-header>
    <div class="app-checkout-main">
      <b-tabs
          pills
          v-model="tabIndex"
          content-class="app-tabs-content"
          nav-class="app-tabs-content-header"
      >

        <!--  FIRST TAB    -->
        <b-tab active>
          <template #title>
            <div class="app-tab-title d-flex align-items-center">
              <span :class="flexCenter" class="app-tab-title-number">1</span>
              <p class="app-tab-title-content">{{ $t('contract_details') }}</p>
              <span :class="flexCenter" class="app-tab-title-right-icon">
                <base-right-icon :width="18" :height="18"/>
              </span>
            </div>
          </template>

          <DetailsContract
              ref="detail-contract"
              :apartments="apartments"
              :order="order"
              :client-data="client"
              @set-client="setClient"
              @change-contract-number="setNewContractNumber"
          />

        </b-tab>
        <!--  END OF FIRST TAB    -->

        <!--   SECOND TAB   -->
        <b-tab :disabled="stepTwoDisable">
          <template #title>
            <div class="app-tab-title d-flex align-items-center">
              <span :class="flexCenter" class="app-tab-title-number">2</span>
              <p class="app-tab-title-content">{{ $t('payment_details') }}</p>
            </div>
          </template>

          <div v-if="tabIndex===1" class="app-tab-content">
            <div>
              <div class="app-tab__header-collapse" v-b-toggle.accordion-1>
                <h3 class="section-title">{{ $t('client_info') }}</h3>
                <img class="collapse-icon" :src="require('@/assets/icons/icon-down.svg')" alt="">
              </div>
              <b-collapse id="accordion-1">
                <ClientInformation :client="client"/>
              </b-collapse>

              <div class="apartments-list">
                <ApartmentItem
                    v-for="(apartment,index) in apartments"
                    :key="apartment.id + index"
                    :apartment="apartment"
                    :remove-btn="apartments.length > 1"
                    :other-price="otherPrice"
                    @update="updateItem"
                    @remove-item="removeApartment"
                />
              </div>


              <div class="app-tab__header">
                <h3 class="section-title">{{ $t('payment_details') }}</h3>
              </div>
              <div class="app-checkout__calculator">
                <checkout-calculator
                    :order="order"
                    :apartments="apartments"
                    :payment-options="paymentOptions"
                    date-picker-icon-fill="#7C3AED"
                    @update="updateState"
                />
              </div>


              <div class="app-tab__header">
                <h3 class="section-title">
                  {{ $t('payment_schedule') }}
                  ({{ calc.monthly_payment_period }}
                  {{ $t('month') }})
                </h3>
              </div>
              <div class="app-checkout__calculator">
                <PaymentMonths
                    :date-picker-icon-fill="datePickerIconFill"
                />
                <!--                                <checkout-calculator checkout-information="" date-picker-icon-fill=""/>-->
              </div>

            </div>
          </div>
        </b-tab>
        <!--   END OF SECOND TAB   -->

        <!--        TABS END -->
        <template #tabs-end>
          <b-nav-item role="presentation" href="#">
            <base-button
                v-if="tabIndex"
                @click="submitConcludeContract"
                class="violet-gradient"
                :text="`${ $t('create_agree') }`"
                :app-loading="appLoading"
            >
              <template #right-icon>
                <BaseArrowRightIcon fill="var(--white)"/>
              </template>
            </base-button>
            <base-button
                v-else
                :text="`${ $t('next') }`"
                class="violet-gradient"
                @click="changeTab"
            >
              <template #right-icon>
                <BaseArrowRightIcon fill="var(--white)"/>
              </template>
            </base-button>
          </b-nav-item>
        </template>
      </b-tabs>
    </div>

    <trash-basket
        :apartment-count="trashStorage.length"
        @return-apartment="returnTrashApartments"
    />

    <success-agree
        :uuid="order.uuid"
        :apartments="apartments"
        :contract="successContract"
    />
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import BaseRightIcon from "@/components/icons/BaseRightIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import ClientInformation from "@/views/Checkout/ClientInformation";
import ApartmentItem from "@/views/Checkout/ApartmentItem";
import CheckoutCalculator from "@/components/Checkout/CheckoutCalculator";
import ErrorNotification from "@/components/Reusable/ErrorNotification";
import CountDown from "@/components/Reusable/CountDown";
import DetailsContract from "@/views/Checkout/DetailsContract";
import PaymentMonths from "@/views/Checkout/PaymentMonths";
import SuccessAgree from "@/components/Dashboard/Apartment/Components/SuccessAgree";
import {mapActions, mapGetters, mapState} from 'vuex'
import api from "@/services/api";
import {dateProperties} from "@/util/calendar";
import {startLoading, finishLoading} from "@/util/appLoading";
import TrashBasket from "@/components/Checkout/TrashBasket";

export default {
  name: "Checkout",
  components: {
    CountDown,
    AppHeader,
    BaseButton,
    TrashBasket,
    BaseRightIcon,
    ApartmentItem,
    SuccessAgree,
    PaymentMonths,
    DetailsContract,
    ErrorNotification,
    CheckoutCalculator,
    ClientInformation,
    BaseArrowRightIcon,
  },
  /*beforeRouteEnter(to, from, next) {
    const hasIds = to.params.hasOwnProperty('ids')
    if (hasIds && to.params.ids) {
      const {ids} = to.params
      const allowState = (typeof ids === 'string') || (Array.isArray(ids) && ids.length)
      if (allowState) {
        return next()
      }
    }
    next({name: 'not_found'})
  },*/
  data() {
    return {
      holdList: [],
      appLoading: false,
      successContract: {
        contract: null
      },
      newContractNumber: '',
      changedContractNumber: false,
      datePickerIconFill: 'var(--violet-600)',
      tabIndex: 1,
      discounts: [],
      client: {
        first_name: {
          lotin: "",
          kirill: "",
        },
        last_name: {
          lotin: "",
          kirill: "",
        },
        second_name: {
          lotin: "",
          kirill: "",
        },
        passport_series: null,
        issued_by_whom: null,
        date_of_issue: null,
        language: "uz",
        friends: false,
        birth_day: null,
        phone: null,
        other_phone: null,
        first_payment_date: null,
        payment_date: null,
      },
      validationError: {
        type: '',
        message: '',
        visible: false,
      },
      stepTwoDisable: false,
    }
  },
  computed: {
    ...mapState('checkout', {
      calc: 'calc',
      apartments: 'apartments',
      discount: 'discount',
      month: 'month',
      created_by: 'created_by',
      contract_number: 'contract_number',
      expiry_at: 'expiry_at',
      uuid: 'uuid',
      order: 'order',
      initial_payments: 'initial_payments',
      credit_months: 'credit_months',
      comment: 'comment',
      edit: 'edit',
      trashStorage: 'trashStorage',
    }),
    ...mapGetters('checkout', {
      otherPrice: 'isDiscountOtherType'
    }),
    flexCenter() {
      return 'd-flex justify-content-center align-items-center'
    },
    paymentOptions() {
      if (this.apartments.length && this.apartments[0]?.discounts) {
        const discounts = this.apartments[0].discounts.map((discount, index) => {
          let text = this.$t("apartments.view.variant")
          if (discount.type === 'promo') {
            text += this.$t('promo.by_promo')
          }
          text += ` ${index + 1} - ${discount.prepay}%`
          return {
            text,
            value: discount.id,
            ...discount,
          }
        })

        discounts.push({
          text: ' ' + this.$t('apartments.view.other_variant'),
          value: 'other',
          type: 'percent',
          currency: null,
          amount: 0,
          id: 'other',
          prepay: 30
        })
        return discounts
      }
      return []
    },
    header() {
      const {apartments} = this.order
      const h = {
        pageInfo: {
          title: '',
          titleHighlight: ''
        },
        page: {
          type: 'string',
          path: this.$t('checkout_booking')
        },
        breadcrumbs: [
          {
            content: {
              type: 'multi_language',
              path: 'objects.title'
            },
            route: {
              name: 'objects',
              path: '/objects'
            }
          }
        ],
      }

      if (!apartments) {
        return h
      }

      const apmTitles = apartments.reduce((acc, apm, idx, arr) => {
        let str = apm.number
        if (arr.length - 1 !== idx) {
          str += ','
        }
        return acc + str
      }, '')

      const {object} = apartments[0]
      if (object) {
        h.breadcrumbs.push({
          content: {
            type: 'string',
            path: object.name
          },
          route: {
            name: 'apartments',
            params: {
              object: object.id
            }
          }
        })

        h.breadcrumbs.push({
          content: {
            type: 'string',
            path: this.$t('apartment') + ' №' + apmTitles
          },
          route: {
            name: 'apartment-view',
            params: {
              object: object.id,
              id: apartments[0].id
            }
          }
        })
      }


      h.pageInfo = {
        title: this.$t('apartment_make_contract'),
        titleHighlight: '№' + apmTitles
      }

      return h
    }
  },
  watch: {
    newContractNumber(value) {
      this.changedContractNumber = !!(value && value.length && !(value === this.order.contract_number));
    }
  },
  created() {
    // this.setIds()
    this.setHoldApartments()
  },
  methods: {
    ...mapActions('checkout', {
      setup: 'setup',
      updateState: 'updateState',
      updateApartment: 'updateApartment',
      removeApartment: 'removeApartment',
      returnTrashApartments: 'returnTrashApartments'
    }),
    startLoading,
    finishLoading,
    updateItem(item) {
      this.updateApartment(item)
    },
    /*setIds() {
      const {ids} = this.$route.params
      if (typeof ids === 'string') {
        const divideIds = ids.split('/')
        divideIds.forEach((id) => this.holdList.push(id))
      } else if (Array.isArray(ids) && ids.length) {
        this.holdList = ids
      }
    },*/
    async setHoldApartments() {
      try {
        const orderId = this.$route.params.id
        const {data} = await api.orders.fetchHoldOrder(orderId)
        if (data) {
          const context = {
            order: data,
            uuid: data.uuid,
            expiry_at: data.expiry_at,
            apartments: data.apartments,
            contract_number: data.contract_number,
            discounts: data.apartments[0].discounts,
            discount: data.apartments[0].discounts[0]
          }
          this.setup(context)
          this.startCounter()
        }
      } catch (e) {
        this.toastedWithErrorCode(e)
        this.redirect(e)
      }
    },
    redirect(error) {
      if (error.response.status >= 400 && error.response.status < 600) {
        this.$router.push({name: 'objects'})
      }
    },
    setClient(value) {
      this.client = value
    },
    startCounter() {
      this.expiry_at = this.$moment(this.expiry_at)
          .utcOffset("+0500")
          .format("YYYY-MM-DD H:mm:ss");

      const current = this.$moment(new Date())
          .utcOffset("+0500")
          .format("YYYY-MM-DD H:mm:ss");

      const expired = this.$moment(this.order.expiry_at)
          .utcOffset("+0500")
          .format("YYYY-MM-DD H:mm:ss");

      const time = new Date(current) - new Date(expired);
      if (time > 0) {
        this.timeElapsedHandler();
      }
    },
    async changeTab() {
      const clientFieldValidation = await this.$refs['detail-contract'].validate()
      if (clientFieldValidation) {
        const body = {...this.client, type_client: this.client.friends ? 'friends' : 'unknown'}
        api.clientsV2.createClient(body).then(() => {
          this.validationError = {
            visible: true,
            message: 'Успешно',
            type: "success"
          }
          if (this.tabIndex === 0) {
            this.stepTwoDisable = false
            setTimeout(() => {
              this.tabIndex = 1
            }, 100)
          }
        }).catch((err) => {
          let error = []
          for (const value of Object.values(err.response.data)) {
            error = [...error, value]
          }
          this.validationError = {
            visible: true,
            message: error.join(', '),
            type: "error"
          }
          this.stepTwoDisable = true
        })
      } else {
        this.validationError = {
          visible: true,
          message: 'Поля, выделенные красным цветом, не заполнены или заполнены неправильно',
          type: "error"
        }
        this.stepTwoDisable = true
      }
    },
    backToView() {
      if (this.order.status === 'sold') {
        this.$router.push({
          name: "contracts-view",
          params: {id: this.$route.params.id},
        });
      }
    },
    timeElapsedHandler() {
      this.expiredConfirm();
    },
    async expiredConfirm() {
      try {
        this.loading = true;
        await api.orders.deactivateOrderHold(this.order.uuid)
            .then(() => {
              this.$router.push({
                name: "apartments",
              });
            })
            .catch();
      } catch (error) {
        this.toastedWithErrorCode(error);
      } finally {
        this.loading = false;
      }
    },
    setNewContractNumber(newNumber) {
      this.changedContractNumber = true
      this.newContractNumber = newNumber
    },
    async submitConcludeContract() {
      const agree = await this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_agree"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yes_agree"),
      })

      if (agree.value) {
        this.startLoading()
        const {
          discount,
          client,
          credit_months,
          initial_payments,
          calc, edit,
          comment,
          order,
          apartments,
          changedContractNumber,
          newContractNumber,
        } = this

        const form = new FormData()
        form.append('discount_id', discount.id)
        form.append('type_client', client.friends)
        form.append('client_id', client.id)

        if (edit.monthly) {
          for (let i = 0; i < credit_months.length; i++) {
            const p = credit_months[i]
            const {ymd} = dateProperties(p.month, 'string')
            form.append(`monthly[${i}][date]`, ymd)
            form.append(`monthly[${i}][amount]`, p.amount)
            form.append(`monthly[${i}][edited]`, (+p.edit).toString())
          }
        }

        if (initial_payments.length > 1 || edit.initial_price) {
          for (let i = 0; i < initial_payments.length; i++) {
            const p = initial_payments[i]
            const {ymd} = dateProperties(p.month, 'string')
            form.append(`initial_payments[${i}][date]`, ymd)
            form.append(`initial_payments[${i}][amount]`, p.amount)
            form.append(`initial_payments[${i}][edited]`, (+p.edit).toString())
          }
        }

        if (edit.prepay) {
          form.append('prepay_edited', calc.prepay)
        }

        form.append('comment', comment)
        form.append('months', calc.monthly_payment_period)
        form.append('first_payment_date', calc.first_payment_date)
        form.append('discount_amount', discount.amount)

        if (discount.id === 'other') {
          for (let i = 0; i < apartments.length; i++) {
            form.append(`apartments[${i}][id]`, apartments[i].id)
            form.append(`apartments[${i}][price]`, apartments[i].price)
          }
        }

        if (client.contract_date) {
          form.append('contract_date', client.contract_date)
        }

        if (calc.payment_date) {
          form.append('payment_date', calc.payment_date)
        }

        if (changedContractNumber) {
          form.append('contract_number', newContractNumber)
        }

        try {
          const response = await api.orders.reserveApartment(order.uuid, form)
          this.successContract = response.data
          this.toasted(response.data.message, "success")
          this.$bvModal.hide("modal-agree")
          this.$bvModal.show("modal-success-agree")
        } catch (e) {
          this.toastedWithErrorCode(e)
        } finally {
          this.finishLoading()
        }
      }
    }
    // async getClientDetails() {
    //   const uuid = 'ef77be1c-cbd8-4b69-bc71-ce13456d3b61'
    //   await api.contractV2.getUpdateContractView(uuid).then((res) => {
    //     this.client = res.data.client
    //     this.apartments = [...res.data.apartments, ...res.data.apartments, ...res.data.apartments]
    //         .map((apartment, index) => {
    //           return {
    //             ...apartment,
    //             id: `${apartment.id}${index}`
    //           }
    //         })
    //     this.calc.discounts = this.apartments[0].discounts
    //   })
    // }
  }
}
</script>


<style lang="scss">
.app-checkout-main {
  margin-top: 2rem;
}

.app-tab {
  &-title {
    display: flex;
    justify-content: center;
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: 600;


    &-number {
      width: 2rem;
      height: 2rem;
      font-size: 14px;
      line-height: 20px;
      border-radius: 50%;
      margin-right: .5rem;
      color: var(--gray-400);
      background-color: var(--gray-100);
    }

    &-content {
      display: flex;
      align-items: center;
      font-size: 16px;
      line-height: 22px;
      margin-bottom: 0;
      color: var(--gray-400);
    }


    &-right-icon {
      display: flex;
      align-items: center;
      margin-left: 12px;
    }
  }

  &-content {
    margin-left: 3rem;
    margin-right: 3rem;
  }

  &__header-collapse {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;

    .section-title {
      margin-bottom: 0;
    }

    .collapse-icon {
      transition: all .3s linear;
    }

    &.not-collapsed {

      .collapse-icon {
        transform: rotate(-180deg);
      }
    }
  }
}


.section {
  &-title {
    font-size: 24px;
    font-weight: 900;
    margin-bottom: 2rem;
    color: var(--gray-400);
    font-family: CraftworkSans, serif;
  }

  &-container {
    display: grid;
    column-gap: 2rem;
    grid-template-columns: 1fr 1fr;
  }

  .data-picker {
    height: 56px;
    max-height: 56px;
    width: 100%;
    border: 2px solid #E5E7EB;
    border-radius: 32px;
  }
}


</style>


<style lang="scss" scoped>
.apartments-list {
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
  margin-top: 3rem;
  margin-bottom: 3rem;
}


.app-checkout {
  .checkout-timer {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 1.5rem;
    line-height: 30px;
    color: var(--white);
    border-radius: 28px;
    height: 56px;
    min-width: 102px;

    &-inner {
      padding: 13px 16px;
    }
  }

  &__calculator {

  }
}

::v-deep .app-tabs-content {
  &-header {
    display: flex;
    align-items: center !important;
    justify-content: flex-start;
    flex-wrap: nowrap;
    margin-bottom: 2rem;
    border-top: 6px solid var(--gray-100);
    border-bottom: 6px solid var(--gray-100);
    padding: 20px 3rem;

    .nav-item {
      min-width: max-content;

      .nav-link {
        padding: 8px 6px;
      }

      .active {
        background-color: transparent;

        .app-tab-title-number {
          background-color: var(--violet-600);
          color: white;
        }

        p {
          color: var(--violet-600);
        }
      }

      &:last-child {
        width: 100%;

        .nav-link {
          display: flex;
          justify-content: flex-end;
        }
      }

    }
  }
}

</style>