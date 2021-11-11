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
            ><svg
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
              <line x1="3" y1="18" x2="21" y2="18"></line></svg
          ></a>
        </li>
      </ul>

      <button
        v-if="
          $route.name !== 'login' &&
          $route.name !== 'home' &&
          $route.name !== 'objects' &&
          $route.name !== 'settings' &&
          $route.name !== 'users' &&
          $route.name !== 'roles' &&
          $route.name !== 'clients' &&
          $route.name !== 'type_plan' &&
          $route.name !== 'debtors' &&
          $route.name !== 'contracts' &&
          $route.name !== 'companies'
        "
        class="btn-back d-xl-block d-none"
        @click="$router.go(-1)"
      >
        <i class="fal fa-arrow-left mr-2"></i>
        <span>Назад</span>
      </button>

      <div class="ml-auto d-flex justify-content-center align-items-center">
        <div
          class="
            d-none d-md-flex
            justify-content-md-end justify-content-center
            mr-3
          "
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
                :style="
                  'background-image: url(' +
                  require('@/assets/img/no_avatar.png') +
                  '); border-radius: 50%'
                "
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
            <router-link to="/home" class="d-flex align-items-center"
              ><span class="brand-logo"
                ><img src="@/assets/img/object__img1.png" alt="Xonsaroy"
              /></span>
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
                <circle v-if="!isActive" cx="12" cy="12" r="3"></circle></svg
            ></a>
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
      </ul>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
export default {
  data() {
    return {
      locale: null,
      app_name: process.env.VUE_APP_NAME,
      isActive: true,
      menuExpanded: false,
    };
  },

  async mounted() {
    this.fetchAuth(this);
    this.fetchMenu(this);
    this.fetchCurrency(this);
    // this.isActived();

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

    // isActived() {
    //   console.log(this.isActive);
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
      if (this.locale == false) {
        localStorage.locale = "ru";
        this.$i18n.locale = "ru";
      } else {
        localStorage.locale = "uz";
        this.$i18n.locale = "uz";
      }
    },

    toggleCollapse() {
      // localStorage.isActive = this.isActive == false ? true : false;
      this.isActive = !this.isActive;
    },
  },

  computed: mapGetters(["getAuth", "getMenus", "getMe", "getCurrency"]),
};
</script>

<style></style>
