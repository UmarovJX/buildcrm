<template>
  <div class="topbar-container">
    <header>
      <p>Xon Saroy Design System • Component</p>
      <h1>topbar</h1>
    </header>
    <div class="d-flex">
      <BaseButton text="" class="mr-3">
        <template #right-icon>
          <BaseNotificationIcon/>
        </template>
      </BaseButton>
      <BaseButton text="">
        <template #right-icon>
          <BaseNotificationIcon fill="#7C3AED"/>
        </template>
      </BaseButton>
    </div>
  </div>
</template>

<script>

import BaseButton from "@/components/Reusable/BaseButton";
import BaseNotificationIcon from "@/components/icons/BaseNotificationsIcon";
export default {
  name: 'Topbar',
  components: {BaseNotificationIcon, BaseButton},
}
</script>

<style lang="scss" scoped>
.topbar-container {
  padding: 30px;
}
  header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 60px;
    p {
      letter-spacing: 1px;
      text-transform: uppercase;
      font-family: 'CraftworkSans', serif;
      font-weight: 900;
      color: #9CA3AF;
      font-size: 16px;
      line-height: 19px;
      margin: 0;
    }
    h1 {
      text-transform: uppercase;
      font-family: 'CraftworkSans', serif;
      margin: 0;
      font-weight: 900;
      font-size: 64px;
      line-height: 77px;
      color: #4B5563;
    }
    .base__button {
      margin-left: 0;
    }
  }
</style>
