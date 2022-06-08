<template>
  <vue-html2pdf
      v-show="false"
      :show-layout="false"
      :float-layout="false"
      :enable-download="true"
      :preview-modal="false"
      :pdf-quality="2"
      :manual-pagination="true"
      pdf-format="a4"
      :paginate-elements-by-height="842"
      pdf-orientation="portrait"
      pdf-content-width="800px"
      :html-to-pdf-options="htmlToPdfOptions"
      ref="html2Pdf"
  >
    <section slot="pdf-content">
      <div class="html2pdf__page-break pdf-page">
        <div class="pdf-body">
          <div class="row">
            <div class="col-12 pdf-header">
              <div class="pdf-header__title">
                <h5>
                  {{ $t('apartment') }} № {{ apartment.number }}
                </h5>
                <p>
                  <img :src="require('@/assets/icons/location.svg')" alt="">
                  {{ apartment.object.address }}
                </p>
              </div>
              <div class="pdf-header__logo">
                <img :src="require('@/assets/img/object__img1.png')" alt="xonsaroy logo">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 pdf-img">
              <img :src="apartment.plan.image[0]" alt="">
              <img :src="require('@/assets/img/plan.png')" alt="">
            </div>
          </div>
          <div class="row pdf-features">
            <div class="col-4 pdf-feature">
              <h5 class="pdf-feature__title">
                {{ $t('users.object') }}:
              </h5>
              <div class="pdf-feature__content">
                <img :src="require('@/assets/icons/icon-facade.svg')" alt="">
                <p>{{ apartment.object.name }}</p>
              </div>
            </div>
            <div class="col-4 pdf-feature">
              <h5 class="pdf-feature__title">
                {{ $t('apartment_number') }}
              </h5>
              <div class="pdf-feature__content">
                <img :src="require('@/assets/icons/icon-door.svg')" alt="">
                <p>{{ apartment.number }}</p>
              </div>
            </div>
            <div class="col-4 pdf-feature">
              <h5 class="pdf-feature__title">
                {{ $t('plan_area') }}:
              </h5>
              <div class="pdf-feature__content">
                <img :src="require('@/assets/icons/icon-area.svg')" alt="">
                <p>{{ apartment.plan.area }} m<sup>2</sup></p>
              </div>
            </div>
            <div class="col-4 pdf-feature">
              <h5 class="pdf-feature__title">
                {{ $t('object.sort.block') }}:
              </h5>
              <div class="pdf-feature__content">
                <img :src="require('@/assets/icons/icon-flat.svg')" alt="">
                <p>{{ apartment.block.name }}</p>
              </div>
            </div>
            <div class="col-4 pdf-feature">
              <h5 class="pdf-feature__title">
                {{ $t('object.level') }}:
              </h5>
              <div class="pdf-feature__content">
                <img :src="require('@/assets/icons/icon-floor.svg')" alt="">
                <p>{{ apartment.floor }}</p>
              </div>
            </div>
            <div class="col-4 pdf-feature">
              <h5 class="pdf-feature__title">
                {{ $t('number_of_rooms') }}:
              </h5>
              <div class="pdf-feature__content">
                <img :src="require('@/assets/icons/icon-door.svg')" alt="">
                <p>{{ apartment.rooms }}</p>
              </div>
            </div>
            <div class="col-4 pdf-feature">
              <h5 class="pdf-feature__title">
                {{ $t('apartments.view.completion_date') }}:
              </h5>
              <div class="pdf-feature__content">
                <img :src="require('@/assets/icons/icon-construction.svg')" alt="">
                <p>{{ buildingDate(apartment.object.build_date) }}</p>
              </div>
            </div>
            <div class="col-4 pdf-feature">
              <h5 class="pdf-feature__title">
                {{ $t('apartments.view.number_of_blocks') }}:
              </h5>
              <div class="pdf-feature__content">
                <img :src="require('@/assets/icons/icon-flat.svg')" alt="">
                <p>{{ apartment.block.floors }}</p>
              </div>
            </div>
            <div class="col-4 pdf-feature">
              <h5 class="pdf-feature__title">
                {{ $t('objects.create.plan.balcony_area') }}:
              </h5>
              <div class="pdf-feature__content">
                <img :src="require('@/assets/icons/icon-area.svg')" alt="">
                <p v-if="apartment.plan.balcony">{{ apartment.plan.balcony_area }} m<sup>2</sup></p>
                <p v-else>-</p>
              </div>
            </div>
          </div>
          <div v-if="Object.keys(printCalc).length" class="row pdf-payment">
            <div class="col-12">
              <h4 class="pdf-payment__title">
                {{ $t('selected_variant') }}
              </h4>
            </div>
            <div class="col-4">
              <p class="pdf-payment__type">“{{ printCalc.prepay_percente }}% {{ $t('apartments.view.prepayment') }}”</p>
            </div>
            <div class="col-8">
              <div class="row pdf-payment__block">
                <div class="col-6 pdf-payment__items">
                  <div class="pdf-payment__item">
                    <p class="option">{{ $t('starting_price') }}: </p>
                    <p class="value">{{ pricePrettier(apartment.prices.price) }} {{ $t('ye') }}</p>
                  </div>
                  <div class="pdf-payment__item">
                    <p class="option" v-html="$t('price_sold_m2', {msg: `M<sup>2</sup>`})"/>
                    <p class="value">{{ pricePrettier(printCalc.price_for_m2 - printCalc.discount_price) }} {{
                        $t('ye')
                      }}</p>
                  </div>
                  <div class="pdf-payment__subtotal pdf-payment__item">
                    <p class="option">{{ $t('apartments.view.discount_per_m2') }}</p>
                    <p class="value">{{ pricePrettier(printCalc.discount_price) }} {{ $t('ye') }}</p>
                  </div>
                </div>
                <div class="col-6 pdf-payment__items">
                  <div class="pdf-payment__item">
                    <p class="option">{{ $t('apartments.view.prepayment') }} {{ printCalc.prepay_percente }}%: </p>
                    <p class="value" v-if="printCalc.prepay_percente === 100">{{ pricePrettier(printCalc.total) }} {{
                        $t('ye')
                      }}</p>
                    <p class="value" v-else>{{ pricePrettier(printCalc.prepay) }} {{
                        $t('ye')
                      }}</p>
                  </div>
                  <div class="pdf-payment__item">
                    <p class="option">{{ $t('payments.balance') }}: </p>
                    <p class="value" v-if="printCalc.prepay_percente === 100">0
                      {{ $t('ye') }}</p>
                    <p class="value" v-else>{{ pricePrettier(printCalc.less_price) }} {{ $t('ye') }}</p>
                  </div>
                  <div class="pdf-payment__subtotal pdf-payment__item">
                    <p class="option">{{ $t('total_discount') }}: </p>
                    <p class="value">{{ pricePrettier(printCalc.total_discount) }} {{ $t('ye') }}</p>
                  </div>
                </div>
              </div>
              <div class="row pdf-payment__last">
                <div class="col-6 pdf-payment__items">
                  <div class="pdf-payment__total pdf-payment__item">
                    <p class="option">{{ $t('apartments.view.total') }}: </p>
                    <p class="value">{{ pricePrettier(printCalc.total) }} {{ $t('ye') }}</p>
                  </div>
                  <div class="pdf-payment__item">
                    <p class="option">{{ $t('monthly_payment') }}: </p>
                    <p class="value" v-if="printCalc.prepay_percente === 100">
                      {{ $t('by_price_m2', {price: 0}) }}
                    </p>
                    <p class="value" v-else>{{ $t('by_price_m2', {price: pricePrettier(printCalc.monthly_price)}) }}</p>
                  </div>
                  <div class=" pdf-payment__item">
                    <p class="option">{{ $t('duration') }}: </p>
                    <p class="value" v-if="printCalc.prepay_percente === 100">
                      0 {{ $t('month') }}
                    </p>
                    <p class="value" v-else>{{ pricePrettier(printCalc.month) }} {{ $t('month') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="page-count">1/2</div>
      </div>

      <div class="pdf-page">
        <div class="pdf-body">
          <div class="row">
            <div class="col-12 pdf-header">
              <div class="pdf-header__title">
                <h5>
                  {{ $t('apartment') }} № {{ apartment.number }}
                </h5>
                <p>
                  <img :src="require('@/assets/icons/location.svg')" alt="">
                  {{ apartment.object.address }}
                </p>
              </div>
              <div class="pdf-header__logo">
                <img :src="require('@/assets/img/object__img1.png')" alt="xonsaroy logo">
              </div>
            </div>
          </div>
          <div class="row pdf-payment">
            <div class="col-12">
              <h4 class="pdf-payment__title">
                {{ $t('selected_variant') }}:
              </h4>
            </div>
          </div>
          <div class="row pdf-table">
            <div class="col-12">
              <b-table
                  :items="apartment.discounts"
                  :fields="discountField"
                  class="pdf-table"
                  :empty-text="$t('no_data')"
                  thead-class="pdf-table__head"
                  tbody-class="pdf-table__body"
                  show-empty
                  sticky-header
                  bordered
                  responsive
              >
                <template #empty="scope" class="text-center">
                  <div class="d-flex justify-content-center align-items-center empty__scope">
                    {{ $t('no_data') }}
                  </div>
                </template>
                <!--                <template #head(name)="data">-->
                <!--&lt;!&ndash;                  <span v-html="field.key"/>&ndash;&gt;-->
                <!--                  {{ data }}-->
                <!--                </template>-->

                <template #head()="data">
                  <span :class="data.class" v-html="$t(data.label, {msg: `m<sup>2</sup>`})"/>
                </template>

                <template #cell(type)="{item}">
                  <span>{{ item.prepay }}% {{ $t('apartments.view.prepayment') }}</span>
                </template>
                <template #cell(priceMeter)="{item}">
                  <span class="table-item" v-if="item.prepay === 100">{{
                      pricePrettier(apartment.prices.price_m2, 2)
                    }}</span>
                  <span class="table-item" v-else>{{ pricePrettier(item.amount - printCalc.discount_price, 2) }}</span>
                </template>
                <template #cell(price)="{item}">
                  <span class="table-item" v-if="item.prepay === 100">{{
                      totalPrintPrice(apartment.prices.price)
                    }}</span>
                  <span class="table-item" v-else>{{ totalPrintPrice(item.amount) }}</span>
                </template>
                <template #cell(priceTotal)="{item}">
                  <span class="table-item table-item__teal">{{
                      totalPrintDiscount(item.amount)
                    }}</span>
                </template>

              </b-table>

            </div>
          </div>
        </div>
        <div class="pdf-footer">
          <div class="row">
            <div class="col-7">
              <h5 class="pdf-footer__title">
                ООО “{{ $t('xonsaroy') }}”
              </h5>
              <div class="pdf-footer__contact">
                <p class="pdf-footer__link">
                  <img :src="require('@/assets/icons/location.svg')" alt="">
                  город Ташкент, Юнусабадский район, улица Янги шахар, дом 64А
                </p>
                <p class="pdf-footer__link">
                  <img :src="require('@/assets/icons/phone.svg')" alt="">
                  +998 55 501 74 00
                </p>
                <p class="pdf-footer__link">
                  <img :src="require('@/assets/icons/icons-globe.svg')" alt="">
                  xonsaroy.uz
                </p>
                <p class="pdf-footer__link">
                  <img :src="require('@/assets/icons/icon-instagram.svg')" alt="">
                  Xonsaroyuz
                </p>
                <p class="pdf-footer__link">
                  <img :src="require('@/assets/icons/icon-facebook.svg')" alt="">
                  Xonsaroyuz
                </p>
                <p class="pdf-footer__link">
                  <img :src="require('@/assets/icons/icon-telegram.svg')" alt="">
                  Xonsaroyuz
                </p>
              </div>
            </div>
            <div class="col-5 d-flex justify-content-end">
              <div class="pdf-footer__logo">
                <img :src="require('@/assets/img/object__img1.png')" alt="">
                <p>{{ $t('motto') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="page-count">2/2</div>
      </div>
    </section>
  </vue-html2pdf>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf'
import {formatToPrice} from "@/util/reusable";

export default {
  name: "PdfTemplate",
  components: {
    VueHtml2pdf,
  },
  props: {
    apartment: {
      type: Object,
      default: () => {
      }
    },
    printCalc: {
      type: Object,
      default: () => {
      }
    },
  },
  data() {
    return {
      htmlToPdfOptions: {
        margin: 0,
        filename: '',
        html2canvas: {
          dpi: 72,
          scale: 4,
          letterRendering: true,
          useCORS: true
        },
        jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'}
      },
      discountField: [
        {
          key: "type",
          class: 'text-capitalize',
          label: ('payment_discount'),
        },
        {
          key: "priceMeter",
          class: 'text-right',
          label: ('price_sold_m2'),
        },
        {
          key: "price",
          class: 'text-right',
          label: ('total_price'),
        },
        {
          key: "priceTotal",
          class: 'text-right',
          label: ('total_discount'),
        },
      ],
      visibleMode: false,
    }
  },
  methods: {
    pricePrettier: (price, decimalCount) => formatToPrice(price, decimalCount),
    generatePdf() {
      this.htmlToPdfOptions.filename = this.apartment.object.name + ', ' + this.apartment.number + ' - ' + this.$t('apartment')
      this.$refs.html2Pdf.generatePdf()
    },
    buildingDate(time) {
      const date = new Date(time)
      const year = date.getFullYear()
      let month = date.getMonth()
      if (month < 3) {
        month = 'I'
      } else if (month >= 3 && month < 6) {
        month = 'II'
      } else if (month >= 6 && month < 9) {
        month = 'III'
      } else {
        month = 'IV'
      }
      return ` ${month} - ${this.$t('quarter')}, ${year}`
    },

    totalPrintDiscount(value) {
      return formatToPrice(this.apartment.prices.price - ((parseFloat(this.printCalc.discount_price) + value) * this.apartment.plan.area), 2
      )
    },
    totalPrintPrice(value) {
      return formatToPrice(this.apartment.plan.area * (value + parseFloat(this.printCalc.discount_price)), 2)
    },
  },

}
</script>

<style lang="scss" scoped>

.pdf-page {
  position: relative;
  padding: 32px;
  background-color: #fff;
  display: flex;
  height: 1100px;
  flex-direction: column;
  justify-content: space-between;

  .page-count {
    font-family: Inter, sans-serif;
    font-weight: 600;
    font-size: 12px;
    line-height: 14px;
    color: var(--gray-500);
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50);
    display: flex;
    justify-content: center;
  }

  .pdf-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 28px;


    &__title {
      h5 {
        font-family: CraftworkSans, serif;
        font-weight: 900;
        font-size: 22px;
        line-height: 25px;
        margin-bottom: 6px;
        color: var(--violet-700);
      }

      p {
        display: flex;
        align-items: center;
        font-family: Inter, sans-serif;
        font-weight: 600;
        font-size: 13px;
        line-height: 16px;
        //font-size: 8px;
        //line-height: 10px;
        color: var(--gray-500);
        margin-bottom: 0;

        img {
          width: 14px;
          height: 14px;
          margin-right: 4px;
        }
      }
    }

    &__logo {
      width: 90px;
      height: 48px;

      img {
        max-width: 100%;
      }
    }

  }

  .pdf-body {
    font-family: Inter, sans-serif;

    .pdf-img {
      display: flex;
      justify-content: center;
      align-items: center;
      //height: 100%;
      height: 350px;
      margin-bottom: 28px;

      img {
        //width: 100%;
        max-height: 100%;
        height: 100%;
      }
    }

    .pdf-features {
      margin-bottom: 2rem;

      .pdf-feature {
        &__title {
          font-weight: 600;
          font-size: 12px;
          line-height: 15px;
          //font-size: 8px;
          //line-height: 10px;
          color: var(--gray-500);
          margin-bottom: 2px;
        }

        &__content {
          display: flex;
          align-items: center;
          margin-bottom: 24px;

          img {
            width: 100%;
            max-width: 16px;
            margin-right: 6px;
          }

          p {
            font-weight: 600;
            //font-size: 12px;
            //line-height: 16px;
            font-size: 16px;
            line-height: 24px;
            color: var(--gray-700);
            margin-bottom: 0;
          }
        }
      }
    }

    .pdf-payment {
      &__type {
        font-weight: 600;
        //font-size: 12px;
        //line-height: 15px;
        font-size: 17px;
        line-height: 20px;
        color: var(--gray-700);
      }

      &__title {
        font-family: CraftworkSans, serif;
        font-style: normal;
        font-weight: 900;
        font-size: 18px;
        line-height: 22px;
        //font-size: 12px;
        //line-height: 14px;
        color: var(--gray-400);
        margin-bottom: 16px;
      }


      &__block {
        position: relative;
        display: flex;
        margin-bottom: 8px;

        &:after {
          position: absolute;
          content: '';
          bottom: 0;
          right: 15px;
          height: 1px;
          width: calc(100% - 30px);
          border-bottom: 1px dashed var(--gray-200);
        }
      }

      &__items {
        display: flex;
        flex-direction: column;
      }

      &__item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .option {
          color: var(--gray-500);
        }

        .value {
          color: var(--gray-700);
        }

        p {
          font-style: normal;
          font-weight: 600;
          font-size: 12px;
          line-height: 16px;
          //font-size: 8px;
          //line-height: 10px;
          margin-bottom: 0;
        }
      }

      &__last {
        justify-content: flex-end;

        .pdf-payment__item {
          p {
            font-style: normal;
            font-weight: 600;
            font-size: 10px;
            line-height: 15px;
            //font-size: 8px;
            //line-height: 10px;
            margin-bottom: 0;
          }

          .option {
            color: var(--gray-500);
            font-size: 9px;
            line-height: 12px;
          }

          .value {
            font-size: 11px;
            line-height: 15px;
            color: var(--gray-700);
          }
        }
      }

      &__subtotal {
        .option {
          color: var(--teal-500);
        }

        .value {
          color: var(--teal-700);
        }
      }

      &__total {
        p.option {
          font-size: 12px !important;
          line-height: 16px !important;
          color: var(--violet-500) !important;
        }

        .value {
          font-size: 15px !important;
          line-height: 20px !important;
          //font-size: 10px;
          //line-height: 12px;
          color: var(--violet-700) !important;
        }
      }


    }
  }

  .pdf-footer {
    border-top: 1px solid var(--gray-200);
    padding-top: 12px;
    padding-bottom: 12px;
    margin-bottom: 24px;

    &__title {
      font-family: CraftworkSans, serif;
      font-weight: 900;
      font-size: 18px;
      line-height: 22px;
      margin-bottom: 12px;
    }

    &__contact {
      flex-direction: column;
      display: flex;
      row-gap: 6px;
    }

    &__link {
      font-family: Inter, sans-serif;
      font-weight: 600;
      font-size: 12px;
      line-height: 16px;
      display: flex;
      align-items: center;
      column-gap: 4px;
      color: var(--gray-500);
      margin-bottom: 0;

      img {
        width: 100%;
        max-width: 12px;
      }
    }

    &__logo {
      width: 250px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      border: 1px solid var(--gray-100);
      background-color: var(--gray-50);
      border-radius: 1rem;
      padding: 1rem;
      row-gap: 8px;

      img {
        width: 100%;
        max-width: 110px;
      }

      p {
        font-family: CraftworkSans, serif;
        font-weight: 600;
        font-size: 12px;
        line-height: 16px;
        margin-bottom: 0;
      }
    }
  }

}


::v-deep .pdf-table {
  font-family: Inter, sans-serif;

  &__head > tr > th {
    background-color: var(--gray-100) !important;
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
    //font-size: 8px;
    //line-height: 10px;
    padding: 8px;
  }

  &__body > tr > td {
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    //font-size: 8px;
    //line-height: 10px;
    padding: 8px;
  }

  .table-item {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    &__teal {
      color: var(--teal-600) !important;
    }
  }

  tr > td, th {
    font-family: Inter, sans-serif;
    font-weight: 600 !important;
    font-size: 13px !important;
    line-height: 16px !important;
    //font-size: 8px !important;
    //line-height: 10px !important;

    div {
      font-weight: 600;
      font-size: 13px;
      line-height: 16px;
      //font-size: 8px;
      //line-height: 10px;
    }
  }

  tbody tr > td {
    color: var(--gray-600);
  }
}

</style>