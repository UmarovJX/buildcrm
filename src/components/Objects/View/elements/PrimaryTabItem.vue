<template>
  <div class="main__content">

<!--    &lt;!&ndash;   PROMO SECTION &ndash;&gt;-->
<!--    <div v-if="apartment.promo.length" class="promos">-->
<!--      <div v-for="promo in apartment.promo" :key="promo.id" class="promo__section">-->
<!--        <div class="d-flex justify-content-between mb-3">-->
<!--             <span class="d-block">-->
<!--            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--              <path d="M0.576446 10L10 0.576446L19.4236 10L10 19.4236L0.576446 10Z" fill="#7C3AED" stroke="white"-->
<!--                    stroke-width="0.815217"/>-->
<!--            </svg>-->
<!--            <span class="ml-2 promo__section-title">{{ getName(promo.name) }}</span>-->
<!--          </span>-->
<!--          <span class="promo__section-subtitle">До {{ startDate(promo.start_date) }}</span>-->
<!--        </div>-->
<!--        <span v-for="discount in promo.discounts" :key="discount.promo_id" class="apartment__details-row">-->
<!--            <span class="property">{{ $t('apartments.first_payment') }} {{ discount.discount }}%</span>-->
<!--            <span class="value">{{ priceDiscount(discount.price) }} {{ $t('ye') }}/M<sup>2</sup></span>-->
<!--          </span>-->
<!--      </div>-->
<!--    </div>-->

    <!--   APARTMENT DETAILS     -->
    <div class="apartment__details my-3">
      <h5 class="apartment__details-title">Характеристики</h5>
      <span class="apartment__details-row">
        <span class="property">№ {{ $t('apartment_number') }}</span>
        <span class="value">{{ apartment.number }}</span>
      </span>

      <span class="apartment__details-row">
        <span class="property">{{ $t('completion_date') }}</span>
        <span class="value"> {{ buildingDate(apartment.object.build_date) }} </span>
      </span>

      <span class="apartment__details-row">
        <span class="property">{{ $t('plan_area') }}</span>
        <span class="value">
          {{ apartment.plan.area }} m<sup>2</sup>
        </span>
      </span>

      <span class="apartment__details-row">
        <span class="property">{{ $t('balcony') }}</span>
        <span class="value">
          {{ apartment.plan.balcony_area }} m<sup>2</sup>
        </span>
      </span>

      <span class="apartment__details-row">
        <span class="property">{{ $t('number_of_rooms') }}</span>
        <span class="value">{{ apartment.rooms }}</span>
      </span>

      <span class="apartment__details-row">
        <span class="property">{{ $t('floor') }}</span>
        <span class="value">{{ apartment.floor }}</span>
      </span>

      <span class="apartment__details-row">
        <span class="property">{{ $t('number_of_floors_of_the_block') }}</span>
        <span class="value">{{ apartment.block.floors }}</span>
      </span>
    </div>

  </div>
</template>

<script>
import {formatToPrice, formatDateWithDot} from "@/util/reusable";

export default {
  name: "PrimaryInformation",
  props: {
    apartment: {
      type: Object,
      required: true
    }
  },


  methods: {
    priceDiscount(value) {
      return formatToPrice(value, 2)
    },
    startDate(value) {
      return formatDateWithDot(value)
    },
    getName(name) {
      let locale = localStorage.locale;
      let value = "";

      if (locale) {
        switch (locale) {
          case "ru":
            value = name.ru;
            break;
          case "uz":
            value = name.uz;
            break;
        }
      } else {
        value = name.ru;
      }

      return value;
    },
    buildingDate(time) {
      const date = new Date(time)
      const year = date.getFullYear()
      let month = date.getMonth()
      if (month < 3) {
        month = '1'
      } else if (month >= 3 && month < 6) {
        month = '2'
      } else if (month >= 6 && month < 9) {
        month = '3'
      } else {
        month = '4'
      }

      return ` ${month} - ${this.$t('quarter')} ${year} ${this.$t('of_the_year')}`
    },
  }
}
</script>

<style lang="sass" scoped>

.price__section
  font-family: CraftworkSans, serif
  font-size: 1.5rem
  font-weight: 900
  margin: 1.5rem 0

  &-amount
    color: var(--gray-600) !important
    line-height: 28px

  &-square-amount
    color: var(--gray-500) !important
    font-size: 18px
    line-height: 22px


.button__view
  display: inline-block
  padding: 1rem 1.5rem
  background-color: var(--gray-100)
  border-radius: 2rem
  font-family: Inter, sans-serif


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

  .total__sum
    font-size: 1.5rem
    line-height: 30px
    font-weight: 600

  .mortgage
    display: block
    border-top: 3px solid var(--gray-100)
    padding-top: 1rem

    &__title
      font-size: 1.5rem
      line-height: 30px


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


.particular__qualities
  font-family: Inter, sans-serif
  margin-bottom: 2.5rem

  .title
    font-size: 1.25rem


  &-content
    display: flex
    flex-wrap: wrap

    .part
      margin-top: 1rem

      &:not(:last-child)
        margin-right: 1rem

      .image__container
        width: 4rem
        height: 4rem
        display: block
        background-color: var(--violet-300)
        margin-bottom: 0.75rem

      .description
        font-size: 14px
        line-height: 20px

</style>