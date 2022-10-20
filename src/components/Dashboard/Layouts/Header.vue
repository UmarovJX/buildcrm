<template>
    <div
        class="navbar-top"
        :class="{'menu-collapsed': isActive, 'menu-expanded': menuExpanded}"
    >
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
            <div class="menu h-auto">
                <ul class="menu-content" :class="[isActive?'toggle-open':'toggle-close']">
                    <li class="menu__item" @click="toggleCollapse">
                        <a
                        >
                            <div class="menu-toggle__icon">
                                <img :src="require('@/assets/icons/collapse-left.svg')" alt="">
                            </div>
                            <div v-if="isActive" class="menu__name">
                                {{ $t('pin_menu') }}
                            </div>
                            <div v-else class="menu__name">
                                {{ $t('hide_menu') }}
                            </div>

                        </a>
                    </li>
                </ul>
            </div>
            <div class="brand-logo">
                <router-link
                    :to="{name:'home'}"
                    class="d-flex align-items-center justify-content-center">
                    <img src="@/assets/img/object__img1.png" alt="Xonsaroy"/>
                </router-link>
            </div>
            <!-- <div class="shadow-bottom"></div> -->

            <div class="menu">
                <ul class="menu-content mb-2">
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
                <ul class="menu-content">
                    <li class="menu__item" @click="openVersionModal">
                        <a class="inactive-link">
                            <span style="width: 24px !important; height: 24px; margin-right: 18px;"
                                  class="menu__item__icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <mask id="mask0_5281_5196" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0"
                                          y="0" width="24" height="24">
                                        <rect width="24" height="24" fill="#D9D9D9"/>
                                    </mask>
                                    <g mask="url(#mask0_5281_5196)">
                                        <path
                                            d="M11.9998 17.1C12.3165 17.1 12.5791 16.996 12.7878 16.788C12.9958 16.5794 13.0998 16.3167 13.0998 16V12.075C13.0998 11.7584 12.9958 11.5 12.7878 11.3C12.5791 11.1 12.3165 11 11.9998 11C11.6831 11 11.4208 11.104 11.2128 11.312C11.0041 11.5207 10.8998 11.7834 10.8998 12.1V16.025C10.8998 16.325 11.0041 16.5794 11.2128 16.788C11.4208 16.996 11.6831 17.1 11.9998 17.1ZM11.9998 9.12505C12.3165 9.12505 12.5831 9.01672 12.7998 8.80005C13.0165 8.58338 13.1248 8.31672 13.1248 8.00005C13.1248 7.68338 13.0165 7.41672 12.7998 7.20005C12.5831 6.98338 12.3165 6.87505 11.9998 6.87505C11.6831 6.87505 11.4165 6.98338 11.1998 7.20005C10.9831 7.41672 10.8748 7.68338 10.8748 8.00005C10.8748 8.31672 10.9831 8.58338 11.1998 8.80005C11.4165 9.01672 11.6831 9.12505 11.9998 9.12505ZM11.9998 22.2001C10.5831 22.2001 9.2538 21.9334 8.0118 21.4C6.77047 20.8667 5.69147 20.1417 4.7748 19.225C3.85814 18.3084 3.13314 17.2294 2.5998 15.988C2.06647 14.746 1.7998 13.4167 1.7998 12C1.7998 10.5834 2.06647 9.25405 2.5998 8.01205C3.13314 6.77072 3.85814 5.69172 4.7748 4.77505C5.69147 3.85838 6.77047 3.13338 8.0118 2.60005C9.2538 2.06672 10.5831 1.80005 11.9998 1.80005C13.4165 1.80005 14.7458 2.06672 15.9878 2.60005C17.2291 3.13338 18.3081 3.85838 19.2248 4.77505C20.1415 5.69172 20.8665 6.77072 21.3998 8.01205C21.9331 9.25405 22.1998 10.5834 22.1998 12C22.1998 13.4167 21.9331 14.746 21.3998 15.988C20.8665 17.2294 20.1415 18.3084 19.2248 19.225C18.3081 20.1417 17.2291 20.8667 15.9878 21.4C14.7458 21.9334 13.4165 22.2001 11.9998 22.2001Z"
                                            fill="#9CA3AF"/>
                                    </g>
                                </svg>
                            </span>

                            <div class="menu__item-body">
                                <div class="menu-version">
                                    Версия 2.0.0
                                </div>
                            </div>

                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <base-modal v-if="version && Object.keys(version).length" ref="version-modal" design="release-info">
            <template #header>
                <div class="release-info-header">
                    <p>{{ $t("release_note.release_note") }}</p>
                    <p @click="confirmRelease" class="cursor-pointer">
                        <base-close-icon/>
                    </p>
                </div>
            </template>
            <template #main>
                <div class="release-info-main">
                    <div class="release-info-main-block">
                        <p class="release-info-main-block-release">{{ version.version }}</p>
                        <p class="release-info-main-block-date">{{ dateFormat(version.created_at) }}</p>
                    </div>
                    <div v-if="version && version.latest" class="release-info-main-block">
                        <div class="release-info-main-block-tag release-info-main-block-tag-new">
                            {{ $t('release_note.new') }}
                        </div>
                        <div>
                            <p class="release-edited" v-html="checkLocale(version.latest)"/>
                        </div>
                    </div>
                    <div v-if="version&& version.fixed" class="release-info-main-block">
                        <div class="release-info-main-block-tag release-info-main-block-tag-edited">
                            {{ $t('edited') }}
                        </div>
                        <div>
                            <p class="release-new" v-html="checkLocale(version.fixed)"/>
                        </div>
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="release-info-footer">
                    <base-questions-icon :height="20" :width="20"/>
                    <p>{{ $t('release_note.comment') }}</p>
                </div>
            </template>
        </base-modal>

    </div>
</template>

<script>
import {localeChanged} from 'vee-validate'
import {mapActions, mapGetters, mapMutations} from "vuex";
// import ThemeButton from "@/components/ThemeButton.vue";
import GeneralPermission from "@/permission/general";
import api from "@/services/api";
// import BaseAvatar from "@/components/Reusable/BaseAvatar";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseQuestionsIcon from "@/components/icons/BaseQuestionsIcon";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";

export default {
    name: 'Header',
    components: {
        BaseCloseIcon,
        BaseQuestionsIcon,
        // ThemeButton,
        // BaseAvatar,
        BaseModal
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
            userTheme: "light-theme",
            version: {}
        }
    },
    async created() {
        await Promise.allSettled([this.fetchMenus(), this.fetchCurrency()])
        this.locale = localStorage.locale !== "uz"
        this.getVersion()
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
        getVersion() {
            if (this.getMe) {
                !this.getMe.version ? this.openVersionModal() : false
            }
            return false
        },
        openVersionModal() {
            api.settings.getLastVersion().then((res) => {
                this.version = res.data
                this.FETCH_ME()
            }).catch((error) => {
                this.toastedWithErrorCode(error)
            }).finally(() => {
                this.$refs['version-modal'].openModal()
            })
        },
        dateFormat(rawDate) {
            const monthNames = ["january", "february", "march", "april", "may", "june",
                "july", "august", "september", "october", "november", "december"
            ];
            const date = new Date(rawDate)
            const day = date.getDate()
            const month = this.$t(monthNames[date.getMonth()]).toLocaleLowerCase()
            const year = date.getFullYear()
            return `${day} ${month}, ${year}`
        },
        confirmRelease() {
            api.settings.confirmLastVersion().then(() => {
                console.log('version confirmed')
            }).catch((error) => {
                this.toastedWithErrorCode(error)
            }).finally(() => {
                this.$refs['version-modal'].closeModal()
            })
        },
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

        checkLocale(data) {
            const {locale} = localStorage
            if (data) {
                if (locale === 'ru') {
                    return data['ru']
                }
                return data['uz']
            }
            return ''
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


.release-info {
    font-family: 'CraftworkSans', serif;

    &-header {
        display: flex;
        align-items: center;
        gap: 65px;
        justify-content: space-between;

        p {
            font-weight: 900;
            font-size: 36px;
            line-height: 42px;
            color: #4B5563;
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
                font-family: 'Inter', serif;
                font-weight: 600;
                font-size: 18px;
                line-height: 24px;
                color: #9CA3AF;
            }

            &-release {
                font-family: 'CraftworkSans', serif;
                font-weight: 900;
                font-size: 24px;
                line-height: 28px;
                color: #4B5563;
            }

            &-tag {
                text-transform: capitalize;
                width: max-content;
                padding: 13px 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 100px;
                font-family: 'CraftworkSans', serif;
                font-weight: 900;
                font-size: 18px;
                line-height: 22px;

                &-new {
                    color: #16A34A;
                    background: #DCFCE7;
                }

                &-edited {
                    color: #0284C7;
                    background: #E0F2FE;
                }
            }
        }
    }

    &-footer {
        display: flex;
        gap: 18px;

        p {
            font-family: 'Inter', serif;
            font-weight: 600;
            font-size: 18px;
            line-height: 24px;
            color: #9CA3AF;
        }
    }
}

</style>
