<script>
import BaseButton from "@/components/Reusable/BaseButton";
import BaseNotificationIcon from "@/components/icons/BaseNotificationsIcon";
import BaseAvatar from "@/components/Reusable/BaseAvatar";
import BaseTimer from "@/components/Reusable/BaseTimer";
import DocHeader from "@/views/documentation/DocHeader";
export default {
  name: "Topbar",
  components: {
    DocHeader,
    BaseTimer,
    BaseAvatar,
    BaseNotificationIcon,
    BaseButton,
  },
};
</script>

<template>
  <main class="topbar-container">
    <DocHeader title="topbar" />
    <div class="topbar-container-content">
      <div class="d-flex">
        <BaseButton text="" class="mr-3">
          <template #right-icon>
            <BaseNotificationIcon />
          </template>
        </BaseButton>
        <BaseButton text="">
          <template #right-icon>
            <BaseNotificationIcon fill="#7C3AED" />
          </template>
        </BaseButton>
      </div>
      <div class="d-flex">
        <BaseAvatar class="mr-4">
          <template #avatar>
            <img src="@/assets/img/avatar.svg" alt="logo" />
          </template>
          <template #full_name> Достонхон Озодходжаев </template>
          <template #role>
            {{ $t("roles.admin") }}
          </template>
        </BaseAvatar>
        <BaseAvatar
          background="#E5E7EB"
          avatar="avatar.svg"
          full_name="Достонхон Озодходжаев"
          :role="$t('roles.admin')"
        />
      </div>
      <div class="just-avatar">
        <BaseAvatar avatar="avatar.svg" class="mr-4" />
        <BaseAvatar background="#E5E7EB">
          <template #avatar>
            <img src="@/assets/img/avatar.svg" alt="logo" />
          </template>
        </BaseAvatar>
      </div>
      <div class="timer">
        <BaseTimer
          minute="29"
          second="59"
          background="linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%)"
        />
        <BaseTimer minute="29" second="59" />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.topbar-container {
  &-content {
    padding: 0 64px 64px;
    ::v-deep .base__button {
      margin-left: 0;
      .right__icon {
        margin-left: 0 !important;
      }
    }
    ::v-deep .base-avatar:last-child {
      .person {
        .full_name {
          color: #7c3aed;
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
