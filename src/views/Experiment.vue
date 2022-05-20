<template>
  <main>
    <div class="input-number-content">
      <base-price-input
          class="input-component"
          placeholder="input price"
          value="100,2121.2121"
          :precision="2"
      />
    </div>
  </main>
</template>

<script>
import BasePriceInput from "@/components/Reusable/BasePriceInput";

export default {
  name: "Experiment",
  components: {
    BasePriceInput
  }
}
</script>

<style scoped>
.input-number-content {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-component {
  padding: 0.5rem 1rem;
  width: 200px;
}
</style>