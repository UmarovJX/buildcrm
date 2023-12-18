<script>
import VueHtml2pdf from "vue-html2pdf";
import { formatToPrice, phonePrettier } from "@/util/reusable";
import { hasOwnProperty, keys } from "@/util/object";
import { mapGetters } from "vuex";
import { useShowPrice } from "@/composables/useShowPrice";

function addMonths(n) {
  const date = new Date();
  const m = date.getMonth();
  const y = date.getFullYear();

  const newM = (m + +n) % 12;
  const newY = (m + +n - newM) / 12 + y;
  return new Date(newY, newM, 1);
}

export default {
  name: "PdfTemplate2",
  components: {
    VueHtml2pdf,
  },
  setup() {
    return useShowPrice();
  },
  props: {
    apartment: {
      type: Object,
      default: () => {},
    },
    printCalc: {
      type: Object,
      default: () => {},
    },
    imgData: {
      type: String,
    },
  },
  emits: ["has-downloaded"],
  data() {
    return {
      img: "",
      showPdfContent: false,
      htmlToPdfOptions: {
        margin: 0,
        filename: "",
        html2canvas: {
          dpi: 72,
          scale: 1.4,
          letterRendering: true,
          useCORS: true,
        },
        image: { type: "png", quality: 0.99 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      },
    };
  },
  computed: {
    lastPaymentMonth() {
      const d = addMonths(+this.printCalc.month + 1);
      return d.toLocaleString("en", { month: "long" });
    },
    lastPaymentYear() {
      const d = addMonths(+this.printCalc.month + 1);

      return d.getFullYear();
    },
    ...mapGetters({
      me: "getMe",
    }),
    filteredDiscounts() {
      return this.apartment.discounts.filter((el) => el.prepay !== 100);
    },

    planImage() {
      if (this.apartment?.plan?.images?.length) {
        return this.apartment.plan.images[0];
      }

      return false;
    },
    hasBalcony() {
      return this.apartment.plan?.balcony;
    },
    managerName() {
      if (hasOwnProperty(this.me, "user") && keys(this.me.user).length) {
        return this.me.user.lastName + " " + this.me.user.firstName;
      }

      return false;
    },
  },
  mounted() {
    console.log(this.imgData.length);
    console.log(this.me);
  },

  methods: {
    formatPhoneNumber(phoneNumberString) {
      var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
      var match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{4})$/);
      if (match) {
        return `+${match[1]} (${match[2]}) ${match[3]} ${match[4]}`;
      }
      return phoneNumberString;
    },
    m2Price(disc) {
      return this.discountedPrice(disc) / this.apartment.plan.area;
    },
    discountedPrice(disc) {
      if (disc.id === this.printCalc.discount?.id) {
        return this.printCalc.total;
      }
      if (disc.prepay === 100) return this.apartment.price;
      else return disc.amount * this.apartment.plan?.area;
    },
    monthlyPayment(disc) {
      const forPay = (this.discountedPrice(disc) * (100 - disc.prepay)) / 100;
      let degree = Math.floor(parseInt(forPay).toString().length / 3);
      let adjustedMonthlyPayment =
        Math.ceil(forPay / (Math.pow(10, degree) * this.printCalc.month)) *
        Math.pow(10, degree);
      return adjustedMonthlyPayment;
    },
    firstPayment(disc) {
      return (this.discountedPrice(disc) * disc.prepay) / 100;
    },
    lastMonth(disc) {
      const forPay = (this.discountedPrice(disc) * (100 - disc.prepay)) / 100;
      return forPay - this.monthlyPayment(disc) * (this.printCalc.month - 1);
    },
    fullDiscount(disc) {
      if (disc.id === this.printCalc.discount.id) {
        return this.printCalc.total_discount;
      }

      return this.apartment.prices?.price - this.discountedPrice(disc);
    },
    phonePrettier,
    pricePrettier: (price, decimalCount) => formatToPrice(price, decimalCount),
    beforeDownloadPdf() {
      // this.showPdfContent = true
    },
    hasDownloadedPdf($event) {
      this.$emit("has-downloaded", $event);
      // this.showPdfContent = false
    },
    generatePdf() {
      this.htmlToPdfOptions.filename =
        this.apartment?.object?.name +
        ", " +
        this.apartment.number +
        " - " +
        this.$t("apartment");
      this.$refs.html2Pdf.generatePdf();
    },
    buildingDate(time) {
      const date = new Date(time);
      const year = date.getFullYear();
      let month = date.getMonth();
      if (month < 3) {
        month = "I";
      } else if (month >= 3 && month < 6) {
        month = "II";
      } else if (month >= 6 && month < 9) {
        month = "III";
      } else {
        month = "IV";
      }
      return ` ${month} - ${this.$t("quarter")}, ${year}`;
    },

    totalPrintDiscount({ amount, prepay, type }) {
      const { apartment, printCalc } = this;
      const basePriceM2 = parseFloat(apartment.price_m2);
      const basePrice = apartment.prices.price;
      let result = 0;
      const customDiscount = printCalc.discount_price * apartment.plan.area;
      if (prepay === 100 && type === "percent") {
        result = basePrice - basePriceM2 * apartment.plan.area + customDiscount;
      } else {
        result = basePrice - amount * apartment.plan.area + customDiscount;
      }
      return {
        format: formatToPrice(result, 2),
        value: result,
      };
    },
    totalPrintPrice(item) {
      const basePrice = this.apartment.prices.price;
      const { value: discountPrice } = this.totalPrintDiscount(item);
      const result = basePrice - discountPrice;
      return {
        format: formatToPrice(result, 2),
        value: result,
      };
    },
  },
};
</script>

<template>
  <vue-html2pdf
    v-show="false"
    ref="html2Pdf"
    pdf-format="a4"
    pdf-orientation="portrait"
    pdf-content-width="800px"
    :show-layout="false"
    :float-layout="false"
    :enable-download="true"
    :preview-modal="false"
    :pdf-quality="2"
    :manual-pagination="true"
    :paginate-elements-by-height="842"
    :html-to-pdf-options="htmlToPdfOptions"
    @beforeDownload="beforeDownloadPdf"
    @hasDownloaded="hasDownloadedPdf"
  >
    <template v-slot:pdf-content>
      <div
        class="html2pdf__page-break pdf-page d-flex align-items-center justify-content-between"
      >
        <div>
          <div class="row d-flex align-items-center justify-content-between">
            <div class="header mt-1 mb-1">
              <div class="object">{{ apartment.object.name }}</div>
              <div class="apartment_data">
                {{ $t("common.apartment") }} {{ apartment.number }}
              </div>
              <div class="detail">
                {{ apartment.object.address }}
              </div>
              <div class="detail">
                {{ $t("pdf.creation_date") }}:
                {{ new Date().toLocaleDateString("ru") }}
              </div>
              <div class="detail">
                {{ $t("pdf.manager") }} <b>{{ managerName }}</b>
              </div>
              <div class="detail">
                {{ $t("common.phone") }}
                <b>{{ formatPhoneNumber(me.user?.phone) }}</b>
              </div>
            </div>
            <img
              class="header_logo"
              :src="require('@/assets/img/xonsaroy_sariq.png')"
              alt=""
            />
          </div>
          <img :src="imgData" id="planImage" alt="plan-image" class="w-100" />
          <div class="row">
            <!-- OBJECT -->
            <div class="col-4 feature">
              <img :src="require('@/assets/icons/icon-facade.svg')" alt="" />
              <div v-if="apartment.object">
                <div class="title">{{ $t("users.object") }}</div>
                <div class="value">{{ apartment.object.name }}</div>
              </div>
            </div>
            <!-- APARTMENT NUMBER -->
            <div class="col-4 feature">
              <img :src="require('@/assets/icons/icon-door.svg')" alt="" />
              <div v-if="apartment.object">
                <div class="title">{{ $t("apartment_number") }}</div>
                <div class="value">{{ apartment.number }}</div>
              </div>
            </div>
            <!-- AREA -->
            <div class="col-4 feature">
              <img :src="require('@/assets/icons/icon-area.svg')" alt="" />
              <div v-if="apartment.plan">
                <div class="title">{{ $t("plan_area") }}</div>
                <div class="value">{{ apartment.plan.area }} m<sup>2</sup></div>
              </div>
            </div>
            <!-- BLOCK -->
            <div class="col-4 feature">
              <img :src="require('@/assets/icons/icon-flat.svg')" alt="" />
              <div v-if="apartment.block">
                <div class="title">{{ $t("object.sort.block") }}</div>
                <div class="value">{{ apartment.block.name }}</div>
              </div>
            </div>
            <!-- FLOOR -->
            <div class="col-4 feature">
              <img :src="require('@/assets/icons/icon-floor.svg')" alt="" />
              <div>
                <div class="title">{{ $t("object.level") }}</div>
                <div class="value">{{ apartment.floor }}</div>
              </div>
            </div>
            <!-- ROOMS -->
            <div class="col-4 feature">
              <img :src="require('@/assets/icons/icon-door.svg')" alt="" />
              <div>
                <div class="title">{{ $t("number_of_rooms") }}</div>
                <div class="value">{{ apartment.rooms }}</div>
              </div>
            </div>
            <!-- COMPLETION DATE -->
            <div class="col-4 feature">
              <img
                :src="require('@/assets/icons/icon-construction.svg')"
                alt=""
              />
              <div v-if="apartment.object">
                <div class="title">
                  {{ $t("apartments.view.completion_date") }}
                </div>
                <div class="value">
                  {{ buildingDate(apartment.object.build_date) }}
                </div>
              </div>
            </div>
            <!-- FLOOR COUNT -->
            <div class="col-4 feature">
              <img :src="require('@/assets/icons/icon-flat.svg')" alt="" />
              <div v-if="apartment.block">
                <div class="title">
                  {{ $t("apartments.view.number_of_blocks") }}
                </div>
                <div class="value">{{ apartment.block.floors }}</div>
              </div>
            </div>
            <!-- BALCONY AREA -->
            <div class="col-4 feature">
              <img :src="require('@/assets/icons/icon-area.svg')" alt="" />
              <div v-if="hasBalcony">
                <div class="title">
                  {{ $t("objects.create.plan.balcony_area") }}
                </div>
                <div class="value">
                  {{ apartment.plan.balcony_area }} m<sup>2</sup>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-100">
          <div class="footer pt-4">
            <div class="qr">
              <img :src="require('@/assets/icons/qr_web.svg')" alt="" />
              <img :src="require('@/assets/icons/qr_instagram.svg')" alt="" />
              <img :src="require('@/assets/icons/qr_telegram.svg')" alt="" />
            </div>
            <div>
              <div class="section_title">OOO “Xonsaroy”</div>
              <div class="address">
                г. Ташкент, Юнусобадский район, улица Янги Шахар, дом 64а
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="html2pdf__page-break pdf-page d-flex align-items-center justify-content-between"
      >
        <div>
          <div class="row d-flex align-items-center justify-content-between">
            <div class="header mt-1 mb-1">
              <div class="object">{{ apartment.object.name }}</div>
              <div class="apartment_data">
                {{ $t("common.apartment") }} {{ apartment.number }}
              </div>
              <div class="detail">{{ apartment.object.address }}</div>
              <div class="detail">
                {{ $t("pdf.creation_date") }}:
                {{ new Date().toLocaleDateString("ru") }}
              </div>
              <div class="detail">
                {{ $t("pdf.manager") }} <b>{{ managerName }}</b>
              </div>
              <div class="detail">
                {{ $t("common.phone") }}
                <b>{{ formatPhoneNumber(me.user?.phone) }}</b>
              </div>
            </div>
            <img
              class="header_logo"
              :src="require('@/assets/img/xonsaroy_sariq.png')"
              alt=""
            />
          </div>
          <!-- TABLE HEADER -->
          <div class="row">
            <div class="section_title pb-2">
              {{ $t("pdf.variants") }}
            </div>
          </div>

          <div class="row fix borderb pb-2 align-items-center">
            <div
              :class="
                (!apartment?.object.is_hide_m2_price && showPrice
                  ? 'col-1_7'
                  : 'col-1_6') + ' table_title'
              "
            >
              {{ $t("pdf.table.variants") }}
            </div>
            <div
              :class="
                (!apartment?.object.is_hide_m2_price && showPrice
                  ? 'col-1_7'
                  : 'col-1_6') + ' table_title'
              "
              v-if="!apartment?.object.is_hide_m2_price && showPrice"
            >
              {{ $t("pdf.table.m2_price") }}
            </div>
            <div
              :class="
                (!apartment?.object.is_hide_m2_price && showPrice
                  ? 'col-1_7'
                  : 'col-1_6') + ' table_title'
              "
            >
              {{ $t("pdf.table.full_price") }}
            </div>
            <div
              :class="
                (!apartment?.object.is_hide_m2_price && showPrice
                  ? 'col-1_7'
                  : 'col-1_6') + ' table_title'
              "
            >
              {{ $t("pdf.table.first") }}
            </div>
            <div
              :class="
                (!apartment?.object.is_hide_m2_price && showPrice
                  ? 'col-1_7'
                  : 'col-1_6') + ' table_title'
              "
            >
              {{ $t("pdf.table.discount_percent") }}
            </div>
            <div
              :class="
                (!apartment?.object.is_hide_m2_price && showPrice
                  ? 'col-1_7'
                  : 'col-1_6') + ' table_title'
              "
            >
              {{ $t("pdf.table.discount_amount") }}
            </div>
            <div
              :class="
                (!apartment?.object.is_hide_m2_price && showPrice
                  ? 'col-1_7'
                  : 'col-1_6') + ' table_title'
              "
            >
              {{ $t("pdf.table.discounted_price") }}
            </div>
          </div>
          <!-- DISCOUNTS -->
          <div
            class="row fix borderb pt-2 pb-2"
            v-for="(disc, i) in apartment.discounts"
            :key="disc.id + '_' + i"
          >
            <div
              :class="
                (!apartment?.object.is_hide_m2_price && showPrice
                  ? 'col-1_7'
                  : 'col-1_6') + ' table_value table_black'
              "
            >
              {{ $t("pdf.table.variant_value", { val: disc.prepay }) }}
            </div>
            <div
              :class="
                (!apartment?.object.is_hide_m2_price && showPrice
                  ? 'col-1_7'
                  : 'col-1_6') + ' table_value table_black'
              "
              v-if="!apartment?.object.is_hide_m2_price && showPrice"
            >
              {{ pricePrettier(m2Price(disc), 2) }}
            </div>
            <div
              :class="
                (!apartment?.object.is_hide_m2_price && showPrice
                  ? 'col-1_7'
                  : 'col-1_6') + ' table_value table_green'
              "
            >
              {{ pricePrettier(apartment.prices?.price, 2) }}
            </div>
            <div
              :class="
                (!apartment?.object.is_hide_m2_price && showPrice
                  ? 'col-1_7'
                  : 'col-1_6') + ' table_value table_black'
              "
            >
              {{ pricePrettier(firstPayment(disc), 2) }}
            </div>
            <div
              :class="
                (!apartment?.object.is_hide_m2_price && showPrice
                  ? 'col-1_7'
                  : 'col-1_6') + ' table_value table_purple'
              "
            >
              {{
                pricePrettier(
                  (fullDiscount(disc) / apartment.prices.price) * 100,
                  2
                )
              }}
              %
            </div>
            <div
              :class="
                (!apartment?.object.is_hide_m2_price && showPrice
                  ? 'col-1_7'
                  : 'col-1_6') + ' table_value table_black'
              "
            >
              {{ pricePrettier(fullDiscount(disc), 2) }}
            </div>
            <div
              :class="
                (!apartment?.object.is_hide_m2_price && showPrice
                  ? 'col-1_7'
                  : 'col-1_6') + ' table_value table_purple'
              "
            >
              {{ pricePrettier(discountedPrice(disc), 2) }}
            </div>
          </div>

          <div class="mb-4"></div>
          <div style="padding-left: 15px; padding-right: 15px">
            <!-- DISCOUNT DETAILS -->
            <div class="" v-for="disc in filteredDiscounts" :key="disc.id">
              <div class="row">
                <div class="section_title pb-2">
                  {{
                    $t("pdf.monthly_title", {
                      month: printCalc.month,
                      prepay: disc.prepay,
                    })
                  }}
                </div>
              </div>
              <div class="row borderb pb-1 align-items-center">
                <div class="col-6 detail_title">
                  {{ $t("pdf.detail.title_type") }}
                </div>
                <div class="col-6 detail_title">
                  {{ $t("pdf.detail.title_value") }}
                </div>
              </div>
              <div class="row borderb pt-1 pb-1">
                <div class="col-6 detail_row">
                  {{ $t("pdf.detail.first") }}
                </div>
                <div class="col-6 detail_row">
                  {{
                    pricePrettier(
                      (discountedPrice(disc) * disc.prepay) / 100,
                      2
                    )
                  }}
                  {{ $t("ye") }}
                </div>
              </div>
              <div class="row borderb pt-1 pb-1">
                <div class="col-6 detail_row">
                  {{ $t("pdf.detail.monthly") }}
                </div>
                <div class="col-6 detail_row">
                  {{ pricePrettier(monthlyPayment(disc), 2) }}
                  {{ $t("ye") }}
                </div>
              </div>
              <div class="row pt-1 pb-1">
                <div class="col-6 detail_row">
                  {{ $t("Последняя") }}
                </div>
                <div class="col-6 detail_row">
                  {{ pricePrettier(lastMonth(disc), 2) }}
                  {{ $t("ye") }}
                </div>
              </div>
              <div class="row last_payment mt-1 mb-3">
                {{ $t("pdf.detail.last") }}:
                {{ $t("common.month." + lastPaymentMonth.toLowerCase()) }},
                {{ lastPaymentYear }}
              </div>
            </div>
          </div>

          <div class="row disclaimer mb-2">
            {{ $t("pdf.disclaimer1") }}
            <br />
            {{ $t("pdf.disclaimer2") }}
          </div>
        </div>
        <div class="w-100">
          <div class="footer pt-4">
            <div class="qr">
              <img :src="require('@/assets/icons/qr_web.svg')" alt="" />
              <img :src="require('@/assets/icons/qr_instagram.svg')" alt="" />
              <img :src="require('@/assets/icons/qr_telegram.svg')" alt="" />
            </div>
            <div>
              <div class="section_title">OOO “Xonsaroy”</div>
              <div class="address">
                г. Ташкент, Юнусобадский район, улица Янги Шахар, дом 64а
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </vue-html2pdf>
</template>

<style lang="scss" scoped>
.col-1_6 {
  width: 15.8%;
}
.col-1_6:not(:first-child),
.col-1_7:not(:first-child) {
  margin-left: 1%;
}
.col-1_7 {
  width: 13.4%;
}
.address {
  color: #828183;
  font-family: Ruberoid;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; /* 15.6px */
}
.qr svg {
  display: inline-block;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.disclaimer {
  color: #828183;
  font-family: Ruberoid;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 16px */
}
.last_payment {
  color: #222;
  font-family: Ruberoid;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.detail_row {
  color: #222;
  font-family: Ruberoid;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  padding: 0;
}
.detail_title {
  color: #999;
  font-family: Ruberoid;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  padding: 0;
}
.borderb {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.table_title {
  color: #999;
  font-family: Ruberoid;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  padding-left: 0;
  word-wrap: normal;
}
.table_value {
  font-family: Ruberoid;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  padding-left: 0;
  padding-right: 0;
  line-height: normal;
}
.table_black {
  color: #222;
}
.table_green {
  color: #09b849;
}
.table_purple {
  color: #6e28d7;
}

.header {
  font-family: Ruberoid;
  max-width: 450px;
  &_logo {
    width: 250px;
    height: auto;
  }
  .object {
    font-family: Ruberoid;
    margin-top: 15px;
    color: #6e28d7;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%;
    text-transform: uppercase;
  }
  .apartment_data {
    font-family: Ruberoid;
    color: #6e28d7;
    font-size: 30px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 36px */
  }
  .detail {
    font-family: Ruberoid;
    margin-top: 4px;
    background-color: #fff;
    color: #828183;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%; /* 14.4px */
  }
}
.feature {
  font-family: Ruberoid;
  display: flex;
  align-items: center;
  margin-top: 15px;
  padding: 0;
  .title {
    font-family: Ruberoid;
    color: #929193;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .value {
    font-family: Ruberoid;
    color: #000;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  img {
    width: 36px;
    height: 36px;
    margin-right: 15px;
  }
}

.section_title {
  color: #6e28d7;
  font-family: Ruberoid;
  font-size: 17px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 19.2px */
}
.pdf-page {
  position: relative;
  padding: 50px;
  padding-top: 0;
  height: 1120px;
  background-color: #fff;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  & > .row {
    padding-left: 15px;
    padding-right: 15px;
  }
  & > .row.fix {
    padding-left: 0;
    padding-right: 0;
    margin-left: 0;
    margin-right: 0;
  }
  & > div > .row {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
