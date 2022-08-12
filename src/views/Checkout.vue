<template>
  <div class="app-checkout">
    <app-header>
      <template #header-right>
        <div class="checkout-timer background-violet-gradient d-flex justify-content-center align-items-center mr-1">
          <span class="checkout-timer-inner">29:59</span>
        </div>
      </template>
    </app-header>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";

export default {
  name: "Checkout",
  components: {
    AppHeader
  }
}
</script>

<style lang="scss" scoped>
.app-checkout {
  .checkout-timer {
    font-weight: 600;
    font-size: 1.5em;
    color: var(--white);
    border-radius: 28px;

    &-inner {
      padding: 10px 16px;
    }
  }
}
</style>