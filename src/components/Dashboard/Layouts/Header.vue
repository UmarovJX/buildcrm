<template>
    <div
        class="navbar-top"
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
            <div class="brand-logo">
                <router-link
                    :to="{name:'home'}"
                    class="d-flex align-items-center justify-content-center">
                    <img src="@/assets/img/object__img1.png" alt="Xonsaroy"/>
                </router-link>
            </div>
            <!-- <div class="shadow-bottom"></div> -->

            <div class="menu">
                <ul class="menu-content">
                    <li v-for="(item, index) in getMenus" :key="index" class="menu__item">
                        <router-link
                            :to="{name: item.action}"
                            :class="$route.name === item.action ? 'active-link' : 'inactive-link'"
                        >
                            <!--                    <div class="menu__img"></div>-->
                            <i :class="item.icon" class="menu-item__icon"></i>

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
                <ul class="menu-content" :class="[isActive?'toggle-open':'toggle-close']">
                    <li class="menu__item" @click="toggleCollapse">
                        <a
                        >
                            <div class="menu-toggle__icon">
                                <img :src="require('@/assets/icons/collapse-left.svg')" alt="">
                            </div>
                            <div v-if="isActive" class="menu__name">
                                Закрепить меню
                            </div>
                            <div v-else class="menu__name">
                                Скрыть меню
                            </div>

                        </a>
                    </li>
                </ul>
            </div>


        </div>
    </div>
</template>

<script>
import {localeChanged} from 'vee-validate'
import {mapActions, mapGetters, mapMutations} from "vuex";
import ThemeButton from "@/components/ThemeButton.vue";
import GeneralPermission from "@/permission/general";
import api from "@/services/api";
// import BaseAvatar from "@/components/Reusable/BaseAvatar";

export default {
    name: 'Header',
    components: {
        ThemeButton,
        // BaseAvatar
    },
    props: {
        theme: {
            type: String,
            default: "",
        },
    },
    data() {
        const settingsPermission = GeneralPermission.getSettingsPermission()
            && (GeneralPermission.getPasswordSettingsPermission() || GeneralPermission.getProfileSettingsPermission())
        return {
            settingsPermission,
            currencyPermission: GeneralPermission.getCurrencyPermission,
            themePermission: GeneralPermission.getThemePermission,
            languagePermission: GeneralPermission.getLanguagePermission(),
            locale: null,
            app_name: process.env.VUE_APP_NAME,
            isActive: true,
            menuExpanded: false,
            userTheme: "light-theme"
        }
    },
    async created() {
        await Promise.allSettled([this.fetchMenus(), this.fetchCurrency()])
        this.locale = localStorage.locale !== "uz"
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
        }
    },
    methods: {
        ...mapActions([
            "fetchAuth",
            "nullableAuth",
            "nullMe",
        ]),
        ...mapMutations([
            'updateMenus',
            'updateCurrency',
        ]),
        async fetchMenus() {
            await api.home.fetchMenu()
                .then((response) => {
                    this.updateMenus(response.data)
                })
                .catch((error) => {
                    this.toastedWithErrorCode(error)
                })
        },
        async fetchCurrency() {
            try {
                if (this.currencyPermission) {
                    const {data} = await api.settingsV2.fetchCurrency()
                    this.updateCurrency(data)
                }
            } catch (e) {
                this.toastedWithErrorCode(e)
            }
        },
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
            this.isActive = !this.isActive
        }
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
