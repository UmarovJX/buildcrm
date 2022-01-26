<template>
  <main class="app-content">
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
                <span class="ml-2">Профиль</span>
            </span>
          </template>
          <tab-user-me/>
        </b-tab>
        <b-tab>
          <template #title>
            <span class="d-flex align-items-center">
                <base-user-password-icon :extra-class="activeTabIconColor(1)"/>
                <span class="ml-2">Изменить пароль</span>
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

export default {
  name: 'UserSettings',
  components: {
    TabUserMe,
    TabChangePassword,
    BaseUserAccountIcon,
    BaseUserPasswordIcon
  },
  data() {
    return {
      tabIndex: 0,
    }
  },
  computed: {
    ...mapGetters({
      theme: 'getTheme'
    })
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