<template>
  <div class="topbar-container">
    <header>
      <p>Xon Saroy Design System • Component</p>
      <h1>topbar</h1>
    </header>
    <div class="topbar-container-content">
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
      <div class="d-flex">
        <BaseAvatar class="mr-4">
          <template #avatar>
            <img src="@/assets/img/avatar.svg" alt="logo"/>
          </template>
          <template #full_name>
            Достонхон Озодходжаев
          </template>
          <template #role>
            {{ $t("roles.admin") }}
          </template>
        </BaseAvatar>
        <BaseAvatar background="#E5E7EB" avatar="avatar.svg" full_name="Достонхон Озодходжаев" :role="$t('roles.admin')"/>
      </div>
      <div class="just-avatar">
        <BaseAvatar avatar="avatar.svg" class="mr-4"/>
        <BaseAvatar background="#E5E7EB">
          <template #avatar>
            <img src="@/assets/img/avatar.svg" alt="logo"/>
          </template>
        </BaseAvatar>
      </div>
      <div class="timer">
        <BaseTimer minute="29" second="59" background="linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%)"/>
        <BaseTimer minute="29" second="59"/>
      </div>
    </div>
  </div>
</template>

<script>

import BaseButton from "@/components/Reusable/BaseButton";
import BaseNotificationIcon from "@/components/icons/BaseNotificationsIcon";
import BaseAvatar from "@/components/Reusable/BaseAvatar";
import BaseTimer from "@/components/Reusable/BaseTimer";
export default {
  name: 'Topbar',
  components: {BaseTimer, BaseAvatar, BaseNotificationIcon, BaseButton},
}
</script>

<style lang="scss" scoped>
.topbar-container {
  header {
    display: flex;
    background: #F3F4F6;
    padding: 64px;
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
  }
  &-content{
    padding: 0 64px 64px;
    ::v-deep .base__button {
      margin-left: 0;
      .right__icon {
        margin-left: 0!important;
      }
    }
    ::v-deep .base-avatar:last-child {
      .person {
        .full_name {
          color: #7C3AED;
        }
      }
    }
    .just-avatar {
      display: flex;
      .base-avatar {
        gap: 0;
        padding-right: 8px;
      }
    }
    .timer {
      display: flex;
      gap: 16px;
    }
  }
}
</style>
