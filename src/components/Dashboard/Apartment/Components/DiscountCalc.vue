<template>
  <div class="bg-white p-0">
    <div class="">
      <div class="apartment__info">
        Предоплата: <span> {{ discount.prepay }}%</span>
      </div>

      <div class="apartment__info mt-2">
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

      <div class="apartment__info mt-2" v-if="discount.amount > 0">
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

      <div class="apartment__info mt-2" v-if="discount.amount > 0">
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

      <div class="apartment__info mt-2">
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
    // getPrepay() {
    //   if (this.prepay === 100) return 0;

    //   let total_discount = this.getDiscount();

    //   let total = this.apartment.price / total_discount;

    //   // return total;

    //   return (this.discount.prepay * total) / 100;
    // },

    // getDiscount() {
    //   if (this.prepay === 100) return 0;

    //   return 1 - this.discount.amount / 100;
    //   // return this.discount.discount * this.apartment.price / 100;
    // },

    // getMonth() {
    //   return (
    //     (this.getTotal() - this.getPrepay()) /
    //     this.apartment.object.credit_month
    //   );
    // },

    // getDebt() {
    //   // let price = this.getTotal() - this.getPrepay();
    //   //console.log(price);
    //   return this.getTotal() - this.getPrepay();
    // },

    // getTotal() {
    //   let total_discount = this.getDiscount();

    //   //console.log(total_discount);

    //   // let total = price * area;
    //   let total = this.apartment.price / total_discount;

    //   return total;
    // },

    getPrepay() {
      //if (this.discount.prepay === 100) return 0;    
      let total_discount = this.getDiscount();

      let total = 0;

      switch (this.discount.type) {
        case "fixed":
          total = this.discount.amount * this.apartment.plan.area; //(this.discount.amount * this.apartment.plan.area) / total_discount;
          break;
        default:
          total = this.apartment.price / total_discount;
          break;
      }

      return (this.discount.prepay * total) / 100;
    },
    getDiscount() {
      if (this.discount.prepay === 100) return 1;

      return 1 - (this.discount.amount / 100);
    },
    getMonth() {
      return (this.getTotal() - this.getPrepay()) / this.apartment.object.credit_month;
    },
    getDebt() {
      return this.getTotal() - this.getPrepay();
    },
    getTotal() {
      let total_discount = this.getDiscount();
      let total = 0;

      switch (this.discount.type) {
        case "fixed":
          total = this.discount.amount * this.apartment.plan.area;
          break;
        default:
          total = this.apartment.price / total_discount;
          break;
      }

      return total;
    },
  },
};
</script>

<style scoped></style>
