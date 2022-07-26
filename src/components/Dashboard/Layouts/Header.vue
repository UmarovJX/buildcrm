<template>
  <div
      v-if="getAuth"
      :class="{'menu-collapsed': isActive, 'menu-expanded': menuExpanded}"
  >
    <nav
        class="
        navbar navbar-expand-sm
        d-flex
        justify-content-between
        align-items-center
        fixed-top
        px-lg-4 px-md-3 px-auto
      "
    >
      <ul class="nav navbar-nav d-xl-none">
        <li class="nav-item">
          <a
              href="javascript:"
              target="_self"
              class="nav-link"
              @click="isActive = true"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21px"
                height="21px"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-menu text-white"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg
            >
          </a>
        </li>
      </ul>

      <button
          v-if="routePermission"
          class="btn-back d-xl-block d-none"
          @click="$router.go(-1)"
      >
        <i class="fal fa-arrow-left mr-2"></i>
        <span>{{ $t('go_back') }}</span>
      </button>

      <div class="ml-auto d-flex justify-content-center align-items-center">
        <div
            class="
            d-none d-md-flex
            justify-content-md-end justify-content-center
            mr-3
          "
        >
          <div v-if="currencyPermission"
               class="currency d-flex align-items-center">
            <div class="currency__price">1 USD = {{ getCurrency.usd }} UZS</div>
          </div>
        </div>

        <div v-if="themePermission" class="d-nones">
          <theme-button :theme="theme"/>
        </div>

        <div class="dropdown my-dropdown dropdown-user dropleft">
          <button
              type="button"
              class="dropdown-toggle dropdown-user__button"
              data-toggle="dropdown"
          >
            <div class="user d-flex align-items-center">
              <b-avatar
                  variant="primary"
                  :src="getUserAvatarUrl"
                  :text="getNameSnippet"
                  size="3rem"
                  class="avatar-wrapper"
              ></b-avatar>

              <div class="ml-2 d-none d-sm-block">
                <div class="user__name" v-if="getMe.user">
                  {{ getMe.user.firstName }} {{ getMe.user.lastName }}
                </div>
                <div class="user__permission" v-if="getMe.role">
                  {{ getName(getMe.role.name) }}
                </div>
              </div>
            </div>
          </button>
          <div class="dropdown-menu dropdown-menu__user">
            <a v-if="languagePermission" class="dropdown-item"
               href="javascript:void(0)">
              <label class="switch">
                <input type="checkbox" @click="changeLocale" v-model="locale"/>
                <div class="slider round">
                  <span>Ру</span>
                  <span>Uz</span>
                </div>
              </label>
            </a>
            <router-link
                v-if="settingsPermission"
                :to="{name:'user-settings'}"
                class="dropdown-item"
            >
              <i class="fas fa-cog"></i> {{ $t("settings.title") }}
            </router-link>

            <a class="dropdown-item" @click="Logout" href="#">
              <i class="fas fa-sign-out"></i> {{ $t("logout") }}
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- <div class="header-navbar-shadow"></div> -->
    <div
        class="sidenav-overlay"
        :class="{show: isActive}"
        @click="isActive = false"
    ></div>

    <div
        class="fixed-menu"
        @mouseover="menuExpanded = true"
        @mouseleave="menuExpanded = false"
    >
      <div class="navbar-header">
        <ul>
          <li class="mr-auto">
            <router-link
                :to="{name:'home'}"
                class="d-flex align-items-center">
              <span class="brand-logo">
                <img src="@/assets/img/object__img1.png" alt="Xonsaroy"/>
              </span>
              <h2 class="brand-text ml-1">CRM</h2>
            </router-link>
          </li>
          <li class="nav-toggle" @click="toggleCollapse">
            <a href="#" target="_self" class="modern-nav-toggle">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="d-block d-xl-none"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="d-none d-xl-block collapse-toggle-icon"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle v-if="!isActive" cx="12" cy="12" r="3"></circle>
              </svg
              >
            </a>
          </li>
        </ul>
      </div>
      <!-- <div class="shadow-bottom"></div> -->
      <ul class="menu">
        <li v-for="(item, index) in getMenus" :key="index" class="menu__item">
          <router-link :to="{name: item.action}">
            <!--                    <div class="menu__img"></div>-->
            <i :class="item.icon"></i>

            <div class="menu__name">
              {{ $t(item.action + ".title") }}
            </div>
            <div class="menu__count" v-if="item.count > 0">
              {{ item.count }}
            </div>
          </router-link>
        </li>
        <!--        <li class="menu__item">-->
        <!--          <router-link :to="{name: 'branches'}">-->
        <!--            <i class="fas fa-map-marker-alt"></i>-->
        <!--            <div class="menu__name">-->
        <!--              {{ $t('branches.name') }}-->
        <!--            </div>-->
        <!--          </router-link>-->
        <!--        </li>-->
      </ul>
    </div>
  </div>
</template>

<script>
import {localeChanged} from 'vee-validate'
import {mapActions, mapGetters} from "vuex";
import ThemeButton from "@/components/ThemeButton.vue";
import GeneralPermission from "@/permission/general";


export default {
  name: 'Header',
  components: {ThemeButton},
  props: {
    theme: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      locale: null,
      app_name: process.env.VUE_APP_NAME,
      isActive: true,
      menuExpanded: false,
      userTheme: "light-theme",
      // currencyPermission: GeneralPermission.getGeneralPermission('currency'),
      // themePermission: GeneralPermission.getGeneralPermission('theme'),
      // languagePermission: GeneralPermission.getGeneralPermission('language'),
      // settingsPermission: GeneralPermission.getGeneralPermission('settings') && (GeneralPermission.getGeneralPermission('password_settings') || GeneralPermission.getGeneralPermission('profile_settings')),
    }
  },
  async created() {
    if (this.getPermission && this.getPermission.general && this.getPermission.general.currency) {
      await Promise.allSettled([this.fetchAuth(this), this.fetchMenu(this), this.fetchCurrency(this)])
    } else {
      await Promise.allSettled([this.fetchAuth(this), this.fetchMenu(this)])
    }
    this.locale = localStorage.locale !== "uz";
  },
  computed: {
    ...mapGetters(["getPermission", "getAuth", "getMenus", "getMe", "getCurrency"]),
    getNameSnippet() {
      if (this.getMe?.user) {
        const {firstName, lastName} = this.getMe.user
        if (firstName !== '' && lastName !== '') {
          return lastName[0] + firstName[0]
        }
      }
      return ''
    },

    getUserAvatarUrl() {
      if (this.getMe?.user?.avatar) {
        return this.getMe.user.avatar
      }
      return ''
    },
    routePermission() {
      const notUsed = ['confirm-apartment', 'login', 'home', 'objects', 'settings', 'users', 'roles', 'clients', 'type_plan', 'debtors', 'contracts', 'companies']
      const currentRouteName = this.$route.name
      const result = notUsed.findIndex(name => name === currentRouteName)
      return result === -1;
    },
    currencyPermission() {
      return GeneralPermission.getCurrencyPermission()
    },
    themePermission() {
      return GeneralPermission.getThemePermission()
    },
    languagePermission() {
      return GeneralPermission.getLanguagePermission()
    },
    settingsPermission() {
      return GeneralPermission.getSettingsPermission() && (GeneralPermission.getPasswordSettingsPermission() || GeneralPermission.getProfileSettingsPermission())
    },
  },
  methods: {
    ...mapActions([
      "fetchAuth",
      "fetchMenu",
      "nullableAuth",
      "nullMe",
      "fetchCurrency",
    ]),
    Logout() {
      localStorage.clear();
      this.nullableAuth();
      this.nullMe();
      this.$router.push({name: "login"});
    },

    // isActived() {
    //   this.isActive = localStorage.isActive;
    // },

    getName(name) {
      let locale = localStorage.locale;
      let value = "";

      if (locale) {
        switch (locale) {
          case "ru":
            value = name.ru;
            break;
          case "uz":
            value = name.uz;
            break;
        }
      } else {
        value = name.ru;
      }

      return value;
    },

    changeLocale() {
      if (this.locale === false) {
        localStorage.locale = "ru";
        this.$root.$i18n.locale = "ru";
        localeChanged()
      } else {
        localStorage.locale = "uz";
        this.$root.$i18n.locale = "uz";
        localeChanged()
      }
    },

    toggleCollapse() {
      // localStorage.isActive = this.isActive == false ? true : false;
      this.isActive = !this.isActive;
    },
  }
};
</script>

<style lang="scss" scoped>
.avatar-wrapper {
  background-color: darkorchid;
  border-radius: 50%;
  box-shadow: 0.5px 0.5px -1px 0 rgba(0, 0, 0, 0.75);
}

.branches__icon {
  fill: var(--dark);
}
</style>
