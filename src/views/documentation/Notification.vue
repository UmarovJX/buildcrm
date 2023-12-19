<script>
import DocHeader from '@/views/documentation/DocHeader'
import BaseNotification from '@/components/Reusable/BaseNotification'

export default {
  name: 'Notification',
  components: { BaseNotification, DocHeader },
}
</script>

<template>
  <main class="notification">
    <DocHeader title="notification" />
    <div class="notification-content">
      <BaseNotification />
      <BaseNotification status="warning" />
      <BaseNotification status="error" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.notification {
  &-content {
    display: flex;
    flex-direction: column;
    gap: 96px;
  }
}
</style>
