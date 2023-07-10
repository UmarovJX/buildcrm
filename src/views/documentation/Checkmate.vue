<script>
import DocHeader from "@/views/documentation/DocHeader";
import ApartmentBox from "@/components/Objects/view/Tabs/ApartmentBox";

export default {
  name: "Checkmate",
  components: {
    ApartmentBox,
    DocHeader,
  },
  data() {
    return {
      apartments: [
        {
          number: 200,
          is_promo: true,
          surface: 166,
          cost: 3000000000,
          cost_m2: 1300000,
          status: "available",
        },
        {
          number: 200,
          is_promo: false,
          surface: 166,
          cost: 3000000000,
          cost_m2: 1300000,
          status: "sold",
        },
        {
          number: 200,
          is_promo: true,
          surface: 166,
          cost: 3000000000,
          cost_m2: 1300000,
          status: "decorated",
        },
        {
          number: 200,
          is_promo: true,
          surface: 166,
          cost: 3000000000,
          cost_m2: 1300000,
          status: "not_available",
        },
        {
          number: 200,
          is_promo: true,
          surface: 166,
          cost: 3000000000,
          cost_m2: 1300000,
          status: "booked",
        },
      ],
    };
  },
  methods: {},
};
</script>

<template>
  <main class="checkmate">
    <DocHeader title="checkmate" />
    <div class="checkmate-content">
      <div v-for="(apartment, index) in apartments" :key="index">
        <ApartmentBox :apartment="apartment" />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.checkmate {
  &-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
