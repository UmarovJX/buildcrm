<script>
import { mapGetters } from "vuex";
import TabUserMe from "@/components/UserSettings/TabUserMe";
import TabChangePassword from "@/components/UserSettings/TabChangePassword";
import BaseUserAccountIcon from "@/components/icons/BaseUserAccountIcon";
import BaseUserPasswordIcon from "@/components/icons/BaseUserPasswordIcon";
import BaseBreadCrumb from "@/components/BaseBreadCrumb";
import GeneralPermission from "@/permission/general";
import AppHeader from "@/components/Header/AppHeader";
// import BaseSelect from "@/components/Reusable/BaseSelect";
// import BaseInput from "@/components/Reusable/BaseInput";
// import WarningSuccess from "@/components/Reusable/WarningSuccess";

export default {
  name: "UserSettings",
  components: {
    AppHeader,
    TabUserMe,
    BaseBreadCrumb,
    TabChangePassword,
    BaseUserAccountIcon,
    BaseUserPasswordIcon,
    // WarningSuccess,
    // BaseSelect,
    // BaseInput,
  },
  data() {
    return {
      tabIndex: 0,
      search: "",
      array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      passwordPermission:
        GeneralPermission.getGeneralPermission("password_settings"),
      profileSettingsPermission:
        GeneralPermission.getGeneralPermission("profile_settings"),
    };
  },
  computed: {
    ...mapGetters({
      theme: "getTheme",
      permission: "getPermission",
    }),
    activeContent() {
      return this.$t("profile");
    },
    // passwordPermission() {
    //   return GeneralPermission.getPasswordSettingsPermission()
    // },
    // profileSettingsPermission() {
    //   return GeneralPermission.getProfileSettingsPermission()
    // },
  },
  methods: {
    openModal() {
      this.$refs["base-modal"].openModal();
    },
    activeTabIconColor(index) {
      if (this.theme === "light-theme" && this.tabIndex === index) {
        return "#fff";
      }
      return "#000";
    },
  },
};
</script>

<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t("profile") }}
      </template>
    </app-header>

    <base-bread-crumb :active-content="activeContent" class="mb-4">
    </base-bread-crumb>

    <!--    <base-input-->
    <!--        v-model="search"-->
    <!--        :placeholder="$t('users.name')"-->
    <!--        type="date"-->
    <!--        :label="true"-->
    <!--        :error="false"-->
    <!--    />-->
    <!--    <base-select-->
    <!--        :options="array"-->
    <!--        placeholder="label"-->
    <!--        :label="true"-->
    <!--        :error="false"/>-->

    <!--    <warning-success status="warning" ref="base-modal"/>-->

    <!--    <b-btn @click="openModal">click</b-btn>-->

    <b-card no-body>
      <b-tabs
        v-model="tabIndex"
        pills
        card
        vertical
        active-tab-class="user__active__tab"
      >
        <b-tab v-if="profileSettingsPermission" active>
          <template #title>
            <span class="d-flex align-items-center">
              <base-user-account-icon
                :width="16"
                :height="16"
                :fill="activeTabIconColor(0)"
              />
              <span class="ml-2">{{ $t("profile") }}</span>
            </span>
          </template>
          <tab-user-me />
        </b-tab>
        <b-tab v-if="passwordPermission">
          <template #title>
            <span class="d-flex align-items-center">
              <base-user-password-icon
                :width="16"
                :height="16"
                :fill="activeTabIconColor(1)"
              />
              <span class="ml-2">{{ $t("edit_password") }}</span>
            </span>
          </template>
          <tab-change-password />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<style lang="scss" scoped>
.user__account__icons {
  fill: var(--dark);
}

.user__account__icons-active {
  fill: white !important;
}
</style>
