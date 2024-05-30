<script>
import { makeProp as p } from "@/util/props";
import { hasChild } from "@/util/object";
import { PROP_TYPE_OBJECT, PROP_TYPE_BOOLEAN } from "@/constants/props";
import { formatToPrice } from "@/util/reusable";
import {
  fullPrice,
  currentInstallmentObj,
  basePrice,
  fullPayment,
  prepayAmount,
  m2Price,
} from "@/views/checkoutV3/helper/calculator.js";
export default {
  name: "ChPaymentResult",
  props: {
    order: p(PROP_TYPE_OBJECT, {}),
    result: p(PROP_TYPE_BOOLEAN(), false),
  },
  methods: {
    prettier: formatToPrice,
  },
  computed: {
    discount() {
      return this.paymentOptions.find(
        (el) => el.id === this.order.calculation.discount
      );
    },
    paymentOptions() {
      if (this.order.apartment.discounts) {
        const discounts = this.order.apartment.discounts.map(
          (discount, index) => {
            let text = this.$t("apartments.view.variant");
            if (discount.type === "promo") {
              text += ` ${this.$t("promo.by_promo")}`;
            }
            text += `  ${index + 1} - ${discount.prepay}%`;
            return {
              text,
              value: discount.id,
              ...discount,
            };
          }
        );
        if (this.order.calculation.type === "installment") {
          return discounts.filter((el) => el.type !== "percent");
        } else {
          discounts.push({
            text: ` ${this.$t("apartments.view.other_variant")}`,
            value: "other",
            type: "percent",
            currency: null,
            amount: 0,
            id: "other",
            prepay: 30,
          });
          return discounts;
        }
      }
      return [];
    },
    m2Price,
    fullPrice,
    currentInstallmentObj,
    basePrice,
    fullPayment,
    prepayAmount,
  },
};
</script>

<template>
  <div class="ch-payment-result">
    <div class="ch-payment-information">
      <span class="gray-400">{{ $t("starting_price") }}</span>
      <span class="ch-price-cell gray-400"
        >{{ prettier(basePrice, 2) }} {{ $t("ye") }}</span
      >
      <template v-if="!result">
        <span class="gray-400">{{ $t("price_m") }}<sup>2</sup></span>
        <span class="ch-price-cell gray-400"
          >{{ prettier(m2Price, 2) }} {{ $t("ye") }}</span
        >
      </template>

      <span class="gray-400">{{ $t("contracts.view.initial_fee") }}</span>
      <span class="ch-price-cell gray-400"
        >{{ prettier(prepayAmount, 2) }} {{ $t("ye") }}</span
      >

      <span class="gray-400">{{ $t("remainder") }}</span>
      <span class="ch-price-cell gray-400"
        >{{ prettier(this.fullPayment - this.prepayAmount, 2) }}
        {{ $t("ye") }}</span
      >

      <span class="teal-500">{{ $t("total_discount") }}</span>
      <span class="ch-price-cell teal-500"
        >{{ prettier(basePrice - fullPayment, 2) }} {{ $t("ye") }}</span
      >
      <template v-if="!result">
        <span class="teal-500">{{ $t("discount_per_m") }}<sup>2</sup></span>
        <span class="ch-price-cell teal-500"
          >{{
            prettier((basePrice - fullPayment) / order.apartment.plan.area, 2)
          }}

          {{ $t("ye") }}
        </span>
      </template>
    </div>
    <div class="ch-border-dashed" />
    <div class="ch-total-price">
      <span class="violet-500 ch-price-total-cell">{{ $t("total") }}</span>
      <span class="ch-price-cell violet-700 ch-price-total-cell ch-price-total">
        {{ prettier(fullPayment, 2) }} {{ $t("ye") }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ch-payment-result {
  border-radius: 2rem;
  border: 2px solid var(--gray-200);
  padding: 1.5rem;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  height: fit-content;

  .ch-payment-information {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;
    justify-items: stretch;
    row-gap: 1.5rem;
  }

  .ch-border-dashed {
    border-top: 2px dashed var(--gray-200);
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .ch-total-price {
    display: grid;
    grid-template-columns: auto auto;
    align-items: end;
  }

  .ch-price-cell {
    justify-self: end;
  }

  .ch-price-total-cell {
    align-self: end;
  }

  .ch-price-total {
    font-size: 24px;
    line-height: 30px;
  }
}
</style>
