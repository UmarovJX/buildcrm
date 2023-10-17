<script>
import { localeChanged } from "vee-validate";
import { mapActions, mapGetters, mapMutations } from "vuex";
// import ThemeButton from "@/components/ThemeButton.vue";
// import BaseAvatar from "@/components/Reusable/BaseAvatar";
import GeneralPermission from "@/permission/general";
import api from "@/services/api";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseQuestionsIcon from "@/components/icons/BaseQuestionsIcon";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import { XIcon } from "@/components/ui-components/material-icons/index";

export default {
  name: "Header",
  components: {
    BaseCloseIcon,
    BaseQuestionsIcon,
    XIcon,
    // ThemeButton,
    // BaseAvatar,
    BaseModal,
  },
  props: {
    theme: {
      type: String,
      default: "",
    },
  },
  data() {
    const settingsPermission =
      GeneralPermission.getSettingsPermission() &&
      (GeneralPermission.getPasswordSettingsPermission() ||
        GeneralPermission.getProfileSettingsPermission());
    return {
      settingsPermission,
      currencyPermission: GeneralPermission.getCurrencyPermission,
      themePermission: GeneralPermission.getThemePermission,
      languagePermission: GeneralPermission.getLanguagePermission(),
      locale: null,
      app_name: process.env.VUE_APP_NAME,
      isActive: true,
      menuExpanded: false,
      userTheme: "light-theme",
      version: {},
    };
  },
  async created() {
    await Promise.allSettled([this.fetchMenus()]);
    this.locale = localStorage.locale !== "uz";
    await this.getLastVersion();
    this.getVersion();
  },

  computed: {
    ...mapGetters([
      "getPermission",
      "getAuth",
      "getMenus",
      "getMe",
      "getCurrency",
    ]),
    getNameSnippet() {
      if (this.getMe?.user) {
        const { firstName, lastName } = this.getMe.user;
        if (firstName !== "" && lastName !== "") {
          return lastName[0] + firstName[0];
        }
      }
      return "";
    },
    getUserAvatarUrl() {
      if (this.getMe?.user?.avatar) {
        return this.getMe.user.avatar;
      }
      return "";
    },

    routePermission() {
      const notUsed = [
        "confirm-apartment",
        "login",
        "home",
        "objects",
        "settings",
        "users",
        "roles",
        "clients",
        "type_plan",
        "debtors",
        "contracts",
        "companies",
      ];
      const currentRouteName = this.$route.name;
      const result = notUsed.findIndex((name) => name === currentRouteName);
      return result === -1;
    },
  },
  methods: {
    ...mapActions(["fetchAuth", "nullableAuth", "nullMe"]),
    ...mapMutations(["updateMenus", "updateCurrency"]),
    getVersion() {
      if (this.getMe) {
        !this.getMe.version ? this.openVersionModal() : false;
      }
      return false;
    },
    async getLastVersion() {
      await api.settings.getLastVersion().then((res) => {
        this.version = res.data;
      });
      // .catch((error) => {
      //   // this.toastedWithErrorCode(error);
      // });
    },
    openVersionModal() {
      this.$refs["version-modal"].openModal();
    },
    dateFormat(rawDate) {
      const monthNames = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ];
      const date = new Date(rawDate);
      const day = date.getDate();
      const month = this.$t(monthNames[date.getMonth()]).toLocaleLowerCase();
      const year = date.getFullYear();
      return `${day} ${month}, ${year}`;
    },
    confirmRelease() {
      api.settings
        .confirmLastVersion()
        .then(() => {
          console.log("version confirmed");
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        })
        .finally(() => {
          this.$refs["version-modal"].closeModal();
        });
    },
    async fetchMenus() {
      await api.home
        .fetchMenu()
        .then((response) => {
          this.updateMenus(response.data);
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        });
    },
    async fetchCurrency() {
      try {
        if (this.currencyPermission) {
          const { data } = await api.settingsV2.fetchCurrency();
          this.updateCurrency(data);
        }
      } catch (e) {
        this.toastedWithErrorCode(e);
      }
    },
    Logout() {
      localStorage.clear();
      sessionStorage.clear();
      this.nullableAuth();
      this.nullMe();
      this.$router.push({ name: "login" });
    },
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
        localeChanged();
      } else {
        localStorage.locale = "uz";
        this.$root.$i18n.locale = "uz";
        localeChanged();
      }
    },

    checkLocale(data) {
      const { locale } = localStorage;
      if (data) {
        if (locale === "ru") {
          return data["ru"];
        }
        return data["uz"];
      }
      return "";
    },

    toggleCollapse() {
      this.isActive = !this.isActive;
    },
  },
};
</script>

<template>
  <div
    class="navbar-top"
    :class="{ 'menu-collapsed': isActive, 'menu-expanded': menuExpanded }"
  >
    <div
      class="sidenav-overlay"
      :class="{ show: isActive }"
      @click="isActive = false"
    ></div>

    <div
      class="fixed-menu"
      @mouseover="menuExpanded = true"
      @mouseleave="menuExpanded = false"
    >
      <div class="brand-logo">
        <router-link
          :to="{ name: 'home' }"
          class="d-flex align-items-center justify-content-center"
        >
          <img src="@/assets/img/object__img1.png" alt="Xonsaroy" />
        </router-link>
      </div>
      <!-- <div class="shadow-bottom"></div> -->

      <div class="menu">
        <ul class="menu-content mb-2">
          <li v-for="(item, index) in getMenus" :key="index" class="menu__item">
            <router-link
              :to="{ name: item.action }"
              :class="
                $route.name === item.action ||
                $route.meta.parent === item.action
                  ? 'active-link'
                  : 'inactive-link'
              "
            >
              <!--                    <div class="menu__img"></div>-->
              <!--                            <i :class="item.icon" class="menu-item__icon"></i>-->
              <x-icon
                :name="item.icon"
                :color="
                  $route.name === item.action ||
                  $route.meta.parent === item.action
                    ? 'var(--white)'
                    : 'var(--gray-400)'
                "
              />
              <div class="menu__item-body">
                <div class="menu__name">
                  {{ $t(item.action + ".title") }}
                </div>
                <div class="menu__count" v-if="item.count > 0">
                  {{ item.count }}
                </div>
              </div>
            </router-link>
          </li>
        </ul>

        <div class="menu h-auto">
          <ul
            class="menu-content"
            :class="[isActive ? 'toggle-open' : 'toggle-close']"
          >
            <li class="menu__item" @click="toggleCollapse">
              <a>
                <x-icon v-if="isActive" name="menu" color="var(--gray-400)" />
                <x-icon v-else name="menu_open" color="var(--gray-400)" />
                <div class="menu-version">
                  <template v-if="isActive">
                    {{ $t("pin_menu") }}
                  </template>
                  <template v-else>
                    {{ $t("hide_menu") }}
                  </template>
                </div>
              </a>
            </li>
          </ul>
        </div>

        <!--                <ul v-if="version.version" class="menu-content">-->
        <!--                    <li class="menu__item" @click="openVersionModal">-->
        <!--                        <a class="inactive-link">-->
        <!--                            <x-icon name="Info" color="var(&#45;&#45;gray-400)"/>-->
        <!--                            <div class="menu__item-body">-->
        <!--                                <div class="menu-version">-->
        <!--                                    Версия {{ version.version }}-->
        <!--                                </div>-->
        <!--                            </div>-->

        <!--                        </a>-->
        <!--                    </li>-->
        <!--                </ul>-->
      </div>
    </div>

    <base-modal
      v-if="version && Object.keys(version).length"
      ref="version-modal"
      design="release-info"
    >
      <template #header>
        <div class="release-info-header">
          <p>{{ $t("release_note.release_note") }}</p>
          <p @click="confirmRelease" class="cursor-pointer">
            <base-close-icon />
          </p>
        </div>
      </template>
      <template #main>
        <div class="release-info-main">
          <div class="release-info-main-block">
            <p class="release-info-main-block-release">{{ version.version }}</p>
            <p class="release-info-main-block-date">
              {{ dateFormat(version.created_at) }}
            </p>
          </div>
          <div v-if="version && version.latest" class="release-info-main-block">
            <div
              class="release-info-main-block-tag release-info-main-block-tag-new"
            >
              {{ $t("release_note.new") }}
            </div>
            <div>
              <p class="release-edited" v-html="checkLocale(version.latest)" />
            </div>
          </div>
          <div v-if="version && version.fixed" class="release-info-main-block">
            <div
              class="release-info-main-block-tag release-info-main-block-tag-edited"
            >
              {{ $t("edited") }}
            </div>
            <div>
              <p class="release-new" v-html="checkLocale(version.fixed)" />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="release-info-footer">
          <base-questions-icon :height="20" :width="20" />
          <p>{{ $t("release_note.userComment") }}</p>
        </div>
      </template>
    </base-modal>
  </div>
</template>

<style lang="scss" scoped>
.avatar-wrapper {
  background-color: darkorchid;
  border-radius: 50%;
  box-shadow: 0.5px 0.5px -1px 0 rgba(0, 0, 0, 0.75);
}

.branches__icon {
  fill: var(--dark);
}

.release-info {
  font-family: "CraftworkSans", serif;

  &-header {
    display: flex;
    align-items: center;
    gap: 65px;
    justify-content: space-between;

    p {
      font-weight: 900;
      font-size: 36px;
      line-height: 42px;
      color: #4b5563;
    }
  }

  &-main {
    display: flex;
    flex-direction: column;
    gap: 56px;

    &-block {
      display: flex;
      flex-direction: column;
      gap: 24px;

      &-date {
        font-family: "Inter", serif;
        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
        color: #9ca3af;
      }

      &-release {
        font-family: "CraftworkSans", serif;
        font-weight: 900;
        font-size: 24px;
        line-height: 28px;
        color: #4b5563;
      }

      &-tag {
        text-transform: capitalize;
        width: max-content;
        padding: 13px 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100px;
        font-family: "CraftworkSans", serif;
        font-weight: 900;
        font-size: 18px;
        line-height: 22px;

        &-new {
          color: #16a34a;
          background: #dcfce7;
        }

        &-edited {
          color: #0284c7;
          background: #e0f2fe;
        }
      }
    }
  }

  &-footer {
    display: flex;
    gap: 18px;

    p {
      font-family: "Inter", serif;
      font-weight: 600;
      font-size: 18px;
      line-height: 24px;
      color: #9ca3af;
    }
  }
}
</style>
