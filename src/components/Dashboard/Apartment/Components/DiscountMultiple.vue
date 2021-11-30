<template>
  <div class="apartment">
    <h6>{{ $t("apartments.view.variant") }}</h6>
    <div class="apartment__variant">
      <div class="apartment__info">
        Предоплата: <span> {{ discount.prepay }}%</span>
      </div>

      <!--            <div class="apartment__info" v-if="discount.discount > 0">-->
      <!--                Скидка: <span>{{ discount.discount }}% - {{ getDiscount() | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}</span>-->
      <!--            </div>-->

      <div class="apartment__info">
        Первый взнос -
        <span
          >{{
            getPrepay()
              | number("0,0.00", {
                thousandsSeparator: " ",
                decimalSeparator: ",",
              })
          }}
          {{ $t("ye") }}</span
        >
      </div>

      <div class="apartment__info" v-if="discount.amount > 0">
        Ежемесячный:
        <span
          >{{ apartments[0].object.credit_month }} месяцев
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

      <div class="apartment__info" v-if="discount.amount > 0">
        Остаток:
        <span
          >{{
            getDebt()
              | number("0,0.00", {
                thousandsSeparator: " ",
                decimalSeparator: ",",
              })
          }}
          {{ $t("ye") }}</span
        >
      </div>

      <div class="apartment__info">
        Итого:
        <span
          >{{
            getTotal()
              | number("0,0.00", {
                thousandsSeparator: " ",
                decimalSeparator: ",",
              })
          }}
          {{ $t("ye") }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    discount: {},
    apartments: [],
  },

  name: "DiscountMultiple",

  methods: {
    getPrice() {
      var price = [];

      for (let i = 0; this.apartments.length > i; i++) {
        price.push(parseFloat(this.apartments[i].price));
      }

      return price.reduce((a, b) => a + b, 0);
    },

    getPrepay() {
      if (this.prepay === 100) return 0;

      let price = this.getPrice();

      let total_discount = this.getDiscount();

      let total = price / total_discount;

      // return total;

      return (this.discount.prepay * total) / 100;
    },

    getDiscount() {
      if (this.prepay === 100) return 0;

      return 1 - this.discount.discount / 100;
      // return this.discount.discount * this.apartment.price / 100;
    },

    getMonth() {
      return (
        (this.getTotal() - this.getPrepay()) /
        this.apartments[0].object.credit_month
      );
    },

    getDebt() {
      // let price = this.getTotal() - this.getPrepay();
      //console.log(price);
      return this.getTotal() - this.getPrepay();
    },

    getTotal() {
      let total_discount = this.getDiscount();

      //console.log(total_discount);

      let price = this.getPrice();

      // let total = price * area;
      let total = price / total_discount;

      return total;
    },
  },
};
</script>