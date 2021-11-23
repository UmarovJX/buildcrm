<template>
  <div class="">
    <!-- <h6>{{ $t("apartments.view.variant") }}</h6> -->
    <div class="apartment__variant">
      <div class="apartment__info">
        Предоплата: <span> {{ discount.prepay_to }}%</span>
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

      <div class="apartment__info" v-if="discount.discount > 0">
        Ежемесячный:
        <span
          >{{ apartment.object.credit_month }} месяцев
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

      <div class="apartment__info" v-if="discount.discount > 0">
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
    apartment: {},
  },

  name: "Discount",

  methods: {
    getPrepay() {
      if (this.prepay_to === 100) return 0;

      let total_discount = this.getDiscount();

      let total = this.apartment.price / total_discount;

      // return total;

      return (this.discount.prepay_to * total) / 100;
    },

    getDiscount() {
      if (this.prepay_to === 100) return 0;

      return 1 - this.discount.discount / 100;
      // return this.discount.discount * this.apartment.price / 100;
    },

    getMonth() {
      return (
        (this.getTotal() - this.getPrepay()) /
        this.apartment.object.credit_month
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

      // let total = price * area;
      let total = this.apartment.price / total_discount;

      return total;
    },
  },
};
</script>

<style scoped>
.apartment__variant {
}
</style>
