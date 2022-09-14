<template>
  <div class="apartment-card">
    <!--        TITLE-->
    <h3 class="apartment-card__title">Детали квартиры №34</h3>
    <!--  INFO    -->
    <div class="apartment-card__body">
      <div class="apartment-card__info">
        <div class="apartment-item">
          <p class="apartment-label">
            {{ $t("apartments.view.number") }}
          </p>
          <p class="apartment-value">
            {{ apartment.number }}
          </p>
        </div>
        <div class="apartment-item" v-if="apartment.building.build_date">
          <p class="apartment-label">
            {{ $t("completion_date") }}
          </p>
          <p class="apartment-value">
            {{ momentQuarter(apartment.building.build_date) }}
          </p>
        </div>
        <div class="apartment-item">
          <p class="apartment-label">
            {{ $t('plan_area') }}
          </p>
          <p class="apartment-value">
            {{ apartment.plan.area }} м²
          </p>
        </div>
        <div class="apartment-item">
          <p class="apartment-label">
            {{ $t("apartments.list.balcony") }}
          </p>
          <p class="apartment-value">
            <template v-if="apartment.plan.balcony">
              {{ apartment.plan.balcony_area }} м²
            </template>
            <template v-else>-</template>
          </p>
        </div>
        <div class="apartment-item">
          <p class="apartment-label">
            {{ $t("apartments.view.rooms") }}
          </p>
          <p class="apartment-value">
            {{ apartment.rooms }}
          </p>
        </div>
        <div class="apartment-item">
          <p class="apartment-label">
            {{ $t("apartments.view.floor") }}
          </p>
          <p class="apartment-value">
            {{ apartment.floor }}
          </p>
        </div>
        <div class="apartment-item">
          <p class="apartment-label">
            {{ $t("apartments.view.number_of_blocks") }}
          </p>
          <p class="apartment-value">
            <!--          {{ apartment.block }}-->
          </p>
        </div>
      </div>
      <!--  INPUT    -->
      <div class="apartment-card__calc">
        <!--        <b-form-checkbox-->
        <!--            :name="apartment.id"-->
        <!--            v-model="item.other_price"-->
        <!--            @input="mutateOtherPrice"-->
        <!--        >-->
        <!--          Другая цена-->
        <!--        </b-form-checkbox>-->
        <template v-if="otherPrice">
          <p>Другая цена</p>
          <base-price-input
              ref="base_price"
              :label="true"
              :top-placeholder="true"
              :currency="`${$t('ye')}`"
              :permission-change="true"
              :value="item.price"
              v-model="item.price"
              @input="mutateTotalPriceInput"
              placeholder="Начальная цена"
              class="base-price-input"
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
              class="base-price-input"
          />
        </template>
        <template v-else>
          <div class="calc-inputs">
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
                class="base-price-input"
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
                class="base-price-input"
            />
          </div>
          <div class="apartment-item">
            <p class="apartment-label">
              Начальная цена
            </p>
            <p class="apartment-value">
              {{ totalPrice }}
            </p>
          </div>
          <div class="apartment-item">
            <p class="apartment-label">
              Цена за М2
            </p>
            <p class="apartment-value">
              {{ pricePerSquare }}
            </p>
          </div>

        </template>
      </div>
    </div>

    <div v-if="removeBtn" class="apartment-card__clear">
      <base-button @click="deleteApartment" text="Убрать квартиру">
        <template #left-icon>
          <BaseDeleteIcon fill="var(--violet-600)"/>
        </template>
      </base-button>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/Reusable/BaseButton";
import BasePriceInput from "@/components/Reusable/BasePriceInput";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import {formatToPrice} from "@/util/reusable";
import {mapActions} from "vuex";

export default {
  name: "ApartmentItem",
  components: {
    BasePriceInput,
    BaseDeleteIcon,
    BaseButton
  },
  props: {
    apartment: {
      type: Object,
      required: true
    },
    removeBtn: {
      type: Boolean,
      default: false
    },
    otherPrice: {
      type: Boolean,
      default: false
    }
  },
  emits: ['remove-item'],
  data() {
    const {price_m2, price, plan} = this.apartment
    return {
      item: {
        price: price.toFixed(2),
        price_m2: price_m2.toFixed(2),
        area: plan.area,
        total_discount: 0,
        discount_per_m2: 0
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
    ...mapActions('checkout', {
      removeApartment: 'removeApartment'
    }),
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
    deleteApartment() {
      this.$emit('remove-item', this.apartment)

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
  flex-direction: column;
  padding: 2rem;
  gap: 24px;
  background: var(--white);
  border: 2px solid var(--gray-200);
  border-radius: 2rem;

  &__title {
    font-family: CraftworkSans, serif;
    font-weight: 900;
    font-size: 24px;
    line-height: 28px;
    color: var(--violet-600);
    margin-bottom: 0;
  }

  &__body {
    display: grid;
    grid-gap: 24px;
    grid-template-columns: 1fr 1fr;
  }

  &__info {
    display: flex;
    flex-direction: column;
    row-gap: 24px;
  }

  &__calc {
    display: flex;
    flex-direction: column;
    row-gap: 24px;
  }

  &__clear {
    display: flex;

    .base__button {
      width: max-content;
    }
  }
}

.calc-inputs {
  display: flex;
  column-gap: .5rem;
}

.apartment-item {
  display: flex;
  column-gap: 24px;
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
  width: 100%;
  border-radius: 32px;
  flex-direction: column;
  background-color: var(--gray-100);
  padding-left: 20px;
}
</style>