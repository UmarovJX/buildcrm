<script>
export default {
  name: "DocHeader",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
  <header>
    <p>Xon Saroy Design System • Component</p>
    <h1>{{ title }}</h1>
  </header>
</template>

<style lang="scss" scoped>
header {
  background: #f3f4f6;
  padding: 64px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 60px;
  p {
    letter-spacing: 1px;
    text-transform: uppercase;
    font-family: "CraftworkSans", serif;
    font-weight: 900;
    color: #9ca3af;
    font-size: 16px;
    line-height: 19px;
    margin: 0;
  }
  h1 {
    text-transform: uppercase;
    font-family: "CraftworkSans", serif;
    margin: 0;
    font-weight: 900;
    font-size: 64px;
    line-height: 77px;
    color: #4b5563;
  }
}
</style>
