<script>
import { formatDateWithDot, formatToPrice } from '@/util/reusable'

export default {
  name: 'PromoSection',
  props: {
    promo: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    priceDiscount(value) {
      return formatToPrice(value, 2)
    },
    startDate(value) {
      return formatDateWithDot(value)
    },
    getName(name) {
      const { locale } = localStorage
      let value = ''

      if (locale) {
        switch (locale) {
          case 'ru':
            value = name.ru
            break
          case 'uz':
            value = name.uz
            break
        }
      } else {
        value = name.ru
      }

      return value
    },
  },
}
</script>

<template>
  <!--   PROMO SECTION -->
  <div
    v-if="promo.length"
    class="promos"
  >
    <div
      v-for="item in promo"
      :key="item.id"
      class="promo__section"
    >
      <div
        id="promo-sale"
        class="d-flex justify-content-between mb-3"
      >
        <span class="d-block">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.576446 10L10 0.576446L19.4236 10L10 19.4236L0.576446 10Z"
              fill="#7C3AED"
              stroke="white"
              stroke-width="0.815217"
            />
          </svg>
          <span class="ml-2 promo__section-title">{{
            getName(item.name)
          }}</span>
          <b-tooltip
            target="promo-sale"
            triggers="hover"
          >
            {{ $t("more_info") }}
          </b-tooltip>
        </span>
        <span
          class="promo__section-subtitle"
        >{{ $t("to") }} {{ startDate(item.end_date) }}</span>
      </div>
      <span
        v-for="discount in item.discounts"
        :key="discount.promo_id"
        class="apartment__details-row"
      >
        <span
          class="property"
        >{{ $t("apartments.first_payment") }} {{ discount.discount }}%</span>
        <span
          class="value"
        >{{ priceDiscount(discount.price) }} {{ $t("ye") }}/m<sup>2</sup></span>
      </span>
    </div>
  </div>
</template>

<style lang="sass" scoped>
::v-deep .tooltip-inner
  color: #4B5563 !important
  margin-bottom: 0
  padding: 12px
  background: #E5E7EB
  border-radius: 16px

::v-deep .arrow::before
  border-top-color: #E5E7EB !important

.promos
  margin-top: .5rem
  margin-bottom: 1rem

  .promo__section:last-child
    border-bottom: 3px solid var(--gray-100)

.promo__section
  font-family: Inter, sans-serif
  padding-top: 1.5rem
  padding-bottom: 1.5rem
  border-top: 3px solid var(--gray-100)
  font-weight: 600

  &-title
    color: var(--violet-600) !important
    font-weight: 600
    font-size: 18px
    line-height: 24px
    text-transform: capitalize

  &-subtitle
    color: var(--gray-400) !important
    font-weight: 600
    font-size: 14px
    line-height: 20px

.apartment__details
  padding-top: 1rem
  padding-bottom: 1rem

  &-title
    font-family: CraftworkSans, serif
    font-weight: 900
    font-size: 24px
    line-height: 28px
    margin-bottom: 1.5rem
    color: var(--gray-400) !important

  &-row
    font-family: Inter, sans-serif
    font-weight: 600
    display: flex
    justify-content: space-between
    padding: 0.5rem 0

    .property
      color: var(--gray-400)
      text-transform: capitalize

    .value
      color: var(--gray-600)
</style>
