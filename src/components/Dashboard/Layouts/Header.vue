<template>
  <div v-if="getAuth">
    <nav
      class="navbar navbar-expand-sm d-flex justify-content-between align-items-center fixed-top px-lg-4 px-md-3 px-auto"
    >
      <router-link :to="{name: 'home'}" class="navbar-brand">
        {{ app_name }}
      </router-link>

      <div class="d-flex justify-content-center align-items-center">
        <div
          class="d-none d-md-flex justify-content-md-end justify-content-center mr-3"
        >
          <div class="currency d-flex align-items-center">
            <div class="currency__price">1 USD = {{ getCurrency.usd }} UZS</div>
          </div>
        </div>

        <div class="dropdown my-dropdown dropdown-user dropleft">
          <button
            type="button"
            class="dropdown-toggle dropdown-user__button"
            data-toggle="dropdown"
          >
            <div class="user d-flex align-items-center">
              <div
                class="user__img"
                v-if="getMe.user.avatar"
                :style="
                  'background-image: url(' +
                    getMe.user.avatar +
                    '); border-radius: 50%'
                "
              ></div>
              <div
                class="user__img"
                v-else
                style="background-image: url('/vendor/dashboard/img/no_avatar.jpg'); border-radius: 50%"
              ></div>

              <div class="ml-2 d-none d-sm-block">
                <div class="user__name">
                  {{ getMe.user.firstName }} {{ getMe.user.lastName }}
                </div>
                <div class="user__permission">
                  {{ getName(getMe.role.name) }}
                </div>
              </div>
            </div>
          </button>
          <div class="dropdown-menu dropdown-menu__user">
            <a class="dropdown-item" href="javascript:void(0)">
              <label class="switch">
                <input type="checkbox" @click="changeLocale" v-model="locale" />
                <div class="slider round">
                  <span>Ру</span>
                  <span>Uz</span>
                </div>
              </label>
            </a>
            <a class="dropdown-item" href="#">
              <i class="fas fa-cog"></i> {{ $t("settings.title") }}
            </a>

            <a class="dropdown-item" @click="Logout" href="#">
              <i class="fas fa-sign-out"></i> {{ $t("logout") }}
            </a>
          </div>
        </div>
      </div>
    </nav>

    <div class="header-navbar-shadow"></div>

    <div class="fixed-menu">
      <div class="menu">
        <router-link
          :to="{name: item.action}"
          class="menu__item"
          v-for="(item, index) in getMenus"
          :key="index"
        >
          <!--                    <div class="menu__img"></div>-->
          <i :class="item.icon"></i>

          <div class="menu__name">
            {{ $t(item.action + ".title") }}
          </div>

          <div class="menu__count" v-if="item.count > 0">
            {{ item.count }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
export default {
  data: () => ({
    locale: null,
    app_name: process.env.VUE_APP_NAME,
  }),

  async mounted() {
    this.fetchAuth(this);
    this.fetchMenu(this);
    this.fetchCurrency(this);

    this.locale = localStorage.locale == "uz" ? false : true;
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
      if (this.locale == false) {
        localStorage.locale = "ru";
        this.$i18n.locale = "ru";
      } else {
        localStorage.locale = "uz";
        this.$i18n.locale = "uz";
      }
    },
  },

  computed: mapGetters(["getAuth", "getMenus", "getMe", "getCurrency"]),
};
</script>

<style scoped>
.menu__item i {
  font-size: 29px;
}

.fixed-menu {
  overflow-x: scroll;
}
</style>
