<template>
  <div class="apartment-card">
    <!--  INFO    -->
    <div>
      <div class="apartment-item">
      <span class="apartment-label">
        {{ $t("apartments.view.number") }}
      </span>
        <p class="apartment-value">
          {{ apartment.number }}
        </p>
      </div>
      <div class="apartment-item">
      <span class="apartment-label">
       {{ $t("completion_date") }}
      </span>
        <p class="apartment-value">
          {{ momentQuarter(apartment.building.build_date) }}
        </p>
      </div>
      <div class="apartment-item">
          <span class="apartment-label">
        {{ $t('plan_area') }}
      </span>
        <p class="apartment-value">
          {{ apartment.plan.area }} м²
        </p>
      </div>
      <div class="apartment-item">
      <span class="apartment-label">
        {{ $t("apartments.list.balcony") }}
      </span>
        <p class="apartment-value">
          <template v-if="apartment.plan.balcony">
            {{ apartment.plan.balcony_area }} м²
          </template>
          <template v-else>-</template>
        </p>
      </div>
      <div class="apartment-item">
        <span class="apartment-label">
          {{ $t("apartments.view.rooms") }}
        </span>
        <p class="apartment-value">
          {{ apartment.rooms }}
        </p>
      </div>
      <div class="apartment-item">
          <span class="apartment-label">
           {{ $t("apartments.view.floor") }}
          </span>
        <p class="apartment-value">
          {{ apartment.floor }}
        </p>
      </div>
      <div class="apartment-item">
        <span class="apartment-label">
          {{ $t("apartments.view.number_of_blocks") }}
        </span>
        <p class="apartment-value">
          <!--          {{ apartment.block }}-->
        </p>
      </div>
    </div>
    <!--  INPUT    -->
    <div>
      <b-form-checkbox
          :name="apartment.id"
          v-model="item.other_price"
          @input="mutateOtherPrice"
          class="mb-3"
      >
        Другая цена
      </b-form-checkbox>
      <div v-show="item.other_price">
        <base-price-input
            ref="base_price"
            :label="true"
            :top-placeholder="true"
            :currency="`${$t('ye')}`"
            :permission-change="true"
            :value="item.price"
            v-model="item.price"
            @change="mutateTotalPriceInput"
            placeholder="Начальная цена"
            class="base-price-input mb-3"
        />
        <base-price-input
            ref="price_per_square"
            :label="true"
            :top-placeholder="true"
            :currency="`${$t('ye')}`"
            :permission-change="true"
            :value="item.price_m2"
            v-model="item.price_m2"
            @input="mutatePricePerSquareInput"
            :placeholder="`Цена за М2`"
            class="base-price-input mb-3"
        />
      </div>
      <div v-show="!item.other_price">
        <base-price-input
            ref="total_discount"
            :label="true"
            :top-placeholder="true"
            :currency="`${$t('ye')}`"
            :permission-change="true"
            :value="item.total_discount"
            v-model="item.total_discount"
            @input="mutateTotalDiscountInput"
            placeholder="Общая скидка"
            class="base-price-input mb-3"
        />
        <base-price-input
            ref="discount_per_square"
            :label="true"
            :top-placeholder="true"
            :currency="`${$t('ye')}`"
            :permission-change="true"
            :value="item.discount_per_m2"
            v-model="item.discount_per_m2"
            @input="mutateDiscountPerSquareInput"
            placeholder="Скидка за М2"
            class="base-price-input mb-3"
        />
        <div class="mb-3 d-flex justify-content-between">
          <p>Начальная цена</p>
          <p>{{ totalPrice }}</p>
        </div>
        <div class="mb-3 d-flex justify-content-between">
          <p>Цена за М2</p>
          <p>{{ pricePerSquare }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BasePriceInput from "@/components/Reusable/BasePriceInput";
import {formatToPrice} from "@/util/reusable";

export default {
  name: "ApartmentItem",
  components: {
    BasePriceInput
  },
  props: {
    apartment: {
      type: Object,
      required: true
    }
  },
  data() {
    const {price_m2, price, plan} = this.apartment
    return {
      item: {
        price: price.toFixed(2),
        price_m2: price_m2.toFixed(2),
        area: plan.area,
        total_discount: 0,
        discount_per_m2: 0,
        other_price: false,
      }
    }
  },
  computed: {
    totalPrice() {
      const {price, total_discount} = this.item
      return this.formatToPrice(price - total_discount)
    },
    pricePerSquare() {
      const {price_m2, discount_per_m2} = this.item
      return this.formatToPrice(price_m2 - discount_per_m2)
    }
  },
  watch: {
    item: {
      handler(lastItem) {
        this.handleUpdate(lastItem)
      },
      deep: true
    }
  },
  methods: {
    formatToPrice,
    momentQuarter(val) {
      return this.$moment(val).quarter()
    },
    getFixedAmount(value, decimal = 2) {
      return value > 0 ? value.toFixed(decimal) : 0
    },
    handleUpdate(item) {
      this.$emit('update', {...item, id: this.apartment.id})
    },
    mutateOtherPrice() {
      const {price, price_m2} = this.apartment
      this.changeTotalPrice(price)
      this.changePricePerSquare(price_m2)
    },
    mutateTotalPriceInput(value) {
      const pricePerSquare = value / this.item.area
      this.changePricePerSquare(pricePerSquare)
    },
    mutatePricePerSquareInput(value) {
      const totalPrice = value * this.item.area
      this.changeTotalPrice(totalPrice)
    },
    mutateDiscountPerSquareInput(discountPerSquare) {
      const totalDiscount = discountPerSquare * this.item.area
      this.changeTotalDiscountAmount(totalDiscount)
    },
    mutateTotalDiscountInput(totalDiscount) {
      const discountPerSquare = totalDiscount / this.item.area
      this.changeDiscountPerSquare(discountPerSquare)
    },
    changePricePerSquare(pricePerSquare) {
      this.item.price_m2 = this.getFixedAmount(pricePerSquare)
    },
    changeTotalPrice(totalPrice) {
      this.item.price = this.getFixedAmount(totalPrice)
    },
    changeDiscountPerSquare(discountPerSquare) {
      this.item.discount_per_m2 = this.getFixedAmount(discountPerSquare)
    },
    changeTotalDiscountAmount(totalDiscount) {
      this.item.total_discount = this.getFixedAmount(totalDiscount)
    }
  }
}
</script>

<style lang="scss" scoped>
.apartment-block {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  gap: 2rem;

}

.apartment-card {
  display: flex;
  justify-content: space-between;
  //flex-direction: column;
  //justify-content: center;
  padding: 2rem;
  gap: 24px;
  background: var(--gray-50);
  border: 2px solid var(--gray-200);
  border-radius: 2rem;
  flex: calc(50% - 2rem);
  //max-width: calc(50% - 1rem);
}

.apartment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: Inter, sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
}

.apartment-label {
  color: var(--gray-400);
  margin-right: 1rem;
}

.apartment-value {
  margin: 0;
  color: var(--gray-600);
}

.base-price-input {
  height: 56px;
  display: flex;
  width: 435px;
  border-radius: 32px;
  flex-direction: column;
  background-color: var(--gray-100);
  padding-left: 20px;
}
</style>