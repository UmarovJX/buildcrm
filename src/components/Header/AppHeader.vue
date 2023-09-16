<script>
// import BaseCircleWrapper from "@/components/Reusable/BaseCircleWrapper";
// import BaseQuestionsIcon from "@/components/icons/BaseQuestionsIcon";
// import BaseNotificationsIcon from "@/components/icons/BaseNotificationsIcon";
import BaseAvatar from "@/components/Reusable/BaseAvatar";
import { mapGetters } from "vuex";

export default {
  name: "AppHeader",
  components: {
    BaseAvatar,
    // BaseCircleWrapper,
    // BaseQuestionsIcon,
    // BaseNotificationsIcon
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      pms: "getPermission",
      me: "getMe",
    }),
    userCollapse() {
      // eslint-disable-next-line no-prototype-builtins
      return this.$slots.hasOwnProperty("header-actions");
    },
    getFullName() {
      if (this.me?.user) {
        const { firstName, lastName } = this.me.user;
        if (firstName !== "" && lastName !== "") {
          return firstName + " " + lastName;
        }
      }
      return "";
    },
    getNameSnippet() {
      if (this.me?.user) {
        const { firstName, lastName } = this.me.user;
        if (firstName !== "" && lastName !== "") {
          return firstName[0] + lastName[0];
        }
      }
      return "";
    },
    getUserAvatarUrl() {
      if (this.me?.user?.avatar) {
        return this.me.user.avatar;
      }
      return "";
    },
    getRole() {
      if (this.me?.role?.name) {
        if (localStorage.locale)
          return this.me?.role?.name[localStorage.locale];
        else return this.me?.role?.name["ru"];
      } else {
        return "no-role";
      }
    },
  },
};
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <!--  TODO:SLOT HEADER_BREADCRUMB     -->
      <slot name="header-breadcrumb"></slot>
      <h3 class="app-header-title">
        <!--  TODO:SLOT HEADER_TITLE      -->
        <slot name="header-title"></slot>
      </h3>
      <slot name="header-status"></slot>
    </div>
    <div class="header-right">
      <!--  TODO:SLOT HEADER_ACTIONS      -->
      <slot name="header-actions"></slot>

      <BaseAvatar
        :class="{ collapsed: userCollapse }"
        :name-snippet="getNameSnippet"
        :avatar="getUserAvatarUrl"
      >
        <template #full_name>
          {{ getFullName }}
        </template>
        <template #role>
          {{ getRole }}
        </template>
      </BaseAvatar>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  //margin-top: 1rem;
  margin-bottom: 2rem;

  .header-left {
    display: flex;
    align-items: center;
    column-gap: 0.25rem;
  }

  .header-right {
    display: flex;
    align-items: center;
    justify-self: flex-end;
    column-gap: 0.5rem;
  }

  &-title {
    font-family: CraftworkSans, serif;
    font-style: normal;
    font-weight: 900;
    font-size: 36px;
    line-height: 42px;
    color: var(--gray-600);
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
