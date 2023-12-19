<script>
export default {

  name: 'DiscountMultiple',
  props: {
    discount: {},
    apartments: [],
  },

  methods: {
    getPrice() {
      const price = []
      switch (this.discount.type) {
        case 'fixed':
          for (let i = 0; this.apartments.length > i; i++) {
            const a = this.apartments[i].discounts.find(
              i => i.prepay == this.discount.prepay,
            ).amount
            price.push(parseFloat(a * this.apartments[i].plan.area))
          }
          break
        default:
          for (let i = 0; this.apartments.length > i; i++) {
            price.push(parseFloat(this.apartments[i].price))
          }
          break
      }
      return price.reduce((a, b) => a + b, 0)
    },

    getPrepay() {
      if (this.discount.prepay === 100) return this.getTotal()

      const price = this.getPrice()
      let total

      const total_discount = this.getDiscount()

      switch (this.discount.type) {
        case 'fixed':
          total = price
          break
        default:
          total = price / total_discount
          break
      }

      return (this.discount.prepay * total) / 100
    },

    getDiscount() {
      if (this.discount.prepay === 100) return 1

      return 1 - this.discount.amount / 100
    },

    getMonth() {
      return (
        (this.getTotal() - this.getPrepay())
        / this.apartments[0].object.credit_month
      )
    },

    getDebt() {
      return this.getTotal() - this.getPrepay()
    },

    getTotal() {
      const total_discount = this.getDiscount()

      const price = this.getPrice()
      let total
      // let total = price * area;
      switch (this.discount.type) {
        case 'fixed':
          total = price
          break
        default:
          total = price / total_discount
          break
      }

      return total
    },
  },
}
</script>

<template>
  <div class="apartment">
    <h6>{{ $t("apartments.view.variant") }}</h6>
    <div class="apartment__variant">
      <div class="apartment__info">
        Предоплата: <span> {{ discount.prepay }}%</span>
      </div>

      <div class="apartment__info">
        Первый взнос -
        <span>{{
                getPrepay()
                  | number("0,0.00", {
                    thousandsSeparator: " ",
                    decimalSeparator: ",",
                  })
              }}
          {{ $t("ye") }}</span>
      </div>

      <div
        v-if="discount.amount > 0"
        class="apartment__info"
      >
        Ежемесячный:
        <span>{{ apartments[0].object.credit_month }} {{ $t("payments.month") }}
          {{
            getMonth()
              | number("0,0.00", {
                thousandsSeparator: " ",
                decimalSeparator: ",",
              })
          }}
          {{ $t("ye") }}
        </span>
      </div>

      <div
        v-if="discount.amount > 0"
        class="apartment__info"
      >
        Остаток:
        <span>{{
                getDebt()
                  | number("0,0.00", {
                    thousandsSeparator: " ",
                    decimalSeparator: ",",
                  })
              }}
          {{ $t("ye") }}</span>
      </div>

      <div class="apartment__info">
        Итого:
        <span>{{
                getTotal()
                  | number("0,0.00", {
                    thousandsSeparator: " ",
                    decimalSeparator: ",",
                  })
              }}
          {{ $t("ye") }}</span>
      </div>
    </div>
  </div>
</template>
