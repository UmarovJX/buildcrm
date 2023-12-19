<script>
export default {
  name: 'AnimationFrame',
  props: {
    width: {
      type: Number,
      default: () => 64,
    },
    height: {
      type: Number,
      default: () => 64,
    },
    fill: {
      type: String,
      default: '#E5E7EB',
    },
    stroke: {
      type: String,
      default: '#7C3AED',
    },
  },
}
</script>

<template>
  <div class="loading__content">
    <span class="loading__content-main">
      <svg
        :width="width"
        :height="height"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32ZM8.96 32C8.96 44.7246 19.2754 55.04 32 55.04C44.7246 55.04 55.04 44.7246 55.04 32C55.04 19.2754 44.7246 8.96 32 8.96C19.2754 8.96 8.96 19.2754 8.96 32Z"
          :fill="fill"
        />
        <path
          d="M32 4.48C32 2.00577 34.0154 -0.0321753 36.4654 0.313092C39.1321 0.688898 41.7468 1.40069 44.2459 2.43586C48.1283 4.04401 51.6559 6.40111 54.6274 9.37259C57.5989 12.3441 59.956 15.8717 61.5641 19.7541C62.5993 22.2532 63.3111 24.8679 63.6869 27.5346C64.0322 29.9846 61.9942 32 59.52 32V32C57.0458 32 55.0839 29.9758 54.6058 27.5482C54.3121 26.0566 53.8707 24.5942 53.2862 23.183C52.1283 20.3876 50.4312 17.8477 48.2917 15.7083C46.1523 13.5688 43.6124 11.8717 40.817 10.7138C39.4058 10.1293 37.9434 9.68792 36.4519 9.39419C34.0242 8.91611 32 6.95423 32 4.48V4.48Z"
          :fill="stroke"
        />
      </svg>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.loading__content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40rem;

  &-main {
    animation: 1.5s spin infinite linear;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
