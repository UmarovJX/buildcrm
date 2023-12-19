<script>
export default {
  name: 'Notification',
  props: {
    message: {
      type: String,
      required: false,
      default: () => '',
    },
    status: {
      type: String,
      required: false,
      default: () => 'successful',
    },
  },
}
</script>

<template>
  <div
    class="base-notification"
    :style="{
      background:
        status === 'successful'
          ? '#22C55E'
          : status === 'warning'
            ? 'yellow'
            : '#EF4444',
    }"
  >
    <template v-if="message === '' && status === 'error'">
      Ошибка
    </template>
    <template v-if="message === '' && status === 'successful'">
      Успешно
    </template>
    <template v-if="message === '' && status === 'warning'">
      Warning
    </template>
    <template v-else>
      {{ message }}
    </template>
  </div>
</template>

<style lang="scss" scoped>
.base-notification {
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: #22c55e;
  border-radius: 0 0 32px 32px;
  animation: notif 1s;
}
@keyframes notif {
  from {
    margin-right: 100%;
  }
  to {
    margin-right: 0;
  }
}
</style>
