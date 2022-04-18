<template>
  <main class="app-content">
    <base-bread-crumb
        :active-content="activeContent"
        class="mb-4"
    >
    </base-bread-crumb>

    <base-input v-model="search" :placeholder="$t('users.name')" :label="true"></base-input>
    <base-select :options="array" placeholder="label" :label="true"/>
<!--    <date-picker/>-->

    <b-card no-body>
      <b-tabs
          v-model="tabIndex"
          pills card vertical
          active-tab-class="user__active__tab"
      >
        <b-tab active>
          <template #title>
            <span class="d-flex align-items-center">
                <base-user-account-icon :extra-class="activeTabIconColor(0)"/>
                <span class="ml-2">{{ $t('profile') }}</span>
            </span>
          </template>
          <tab-user-me/>
        </b-tab>
        <b-tab>
          <template #title>
            <span class="d-flex align-items-center">
                <base-user-password-icon :extra-class="activeTabIconColor(1)"/>
                <span class="ml-2">{{ $t('edit_password') }}</span>
            </span>
          </template>
          <tab-change-password/>
        </b-tab>
      </b-tabs>
    </b-card>
  </main>
</template>

<script>
import {mapGetters} from "vuex";
import TabUserMe from "@/components/UserSettings/TabUserMe";
import TabChangePassword from "@/components/UserSettings/TabChangePassword";
import BaseUserAccountIcon from "@/components/icons/BaseUserAccountIcon";
import BaseUserPasswordIcon from "@/components/icons/BaseUserPasswordIcon";
import BaseBreadCrumb from "@/components/BaseBreadCrumb";
import BaseSelect from "@/components/Reusable/BaseSelect";
import BaseInput from "@/components/Reusable/BaseInput";

export default {
  name: 'UserSettings',
  components: {
    TabUserMe,
    BaseBreadCrumb,
    TabChangePassword,
    BaseUserAccountIcon,
    BaseUserPasswordIcon,
    BaseSelect,
    BaseInput
  },
  data() {
    return {
      tabIndex: 0,
      search: '',
      array: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
      ]
    }
  },
  computed: {
    ...mapGetters({
      theme: 'getTheme'
    }),
    activeContent() {
      return this.$t('profile')
    },
  },
  methods: {
    activeTabIconColor(index) {
      if (this.theme === 'light-theme' && this.tabIndex === index) {
        return 'user__account__icons-active'
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>


.user__account__icons {
  fill: var(--dark);
}

.user__account__icons-active {
  fill: white;
}
</style>