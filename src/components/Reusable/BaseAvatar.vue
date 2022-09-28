<template>
    <div>
        <app-dropdown :collapse-arrow="true" :position-right="true">
            <template #header>
                <div class="base-avatar" :style="{background: background}">
                    <slot name="avatar"></slot>
                    <!--        <img-->
                    <!--            v-if="!hasAvatarSlot"-->
                    <!--            :src="imagePath" alt="img"-->
                    <!--        />-->
                    <b-avatar
                        variant="primary"
                        :src="imagePath"
                        :text="nameSnippet"
                        size="40px"
                    ></b-avatar>
                    <div class="person">
                        <p class="full_name">
                            <slot name="full_name"></slot>
                        </p>
                        <p class="full_name" v-if="!hasFullNameSlot">{{ full_name }}</p>
                        <p class="role">
                            <slot name="role"></slot>
                        </p>
                        <p class="role" v-if="!hasRoleSlot">{{ role }}</p>
                    </div>
                </div>
            </template>
            <template #list>
                <b-dropdown-item style="touch-action: none">
                    <a v-if="languagePermission"
                       href="javascript:void(0)">
                        <label class="switch" @click="changeLocale">
                            <input type="checkbox" v-model="locale"/>
                            <div class="slider round">
                                <span>Ру</span>
                                <span>Uz</span>
                            </div>
                        </label>
                    </a>
                </b-dropdown-item>
                <b-dropdown-item>
                    <router-link
                        v-if="settingsPermission"
                        :to="{name:'user-settings'}"
                    >
                        {{ $t("settings.title") }}
                    </router-link>
                </b-dropdown-item>
                <b-dropdown-item>
                    <a @click="logout" href="#">
                        {{ $t("logout") }}
                    </a>
                </b-dropdown-item>
            </template>
        </app-dropdown>
    </div>
</template>

<script>
import AppDropdown from "@/components/Reusable/Dropdown/AppDropdown";
import {localeChanged} from "vee-validate";
import GeneralPermission from "@/permission/general";

export default {
    name: "BaseAvatar",
    components: {
        AppDropdown
    },
    props: {
        background: {
            type: String,
            required: false,
            default: "#F3F4F6"
        },
        avatar: {
            type: String,
            required: false
        },
        full_name: {
            type: String,
            required: false
        },
        role: {
            type: String,
            required: false
        },
        nameSnippet: {
            type: String,
            required: false
        }
    },
    data() {
        const settingsPermission = GeneralPermission.getSettingsPermission()
            && (GeneralPermission.getPasswordSettingsPermission() || GeneralPermission.getProfileSettingsPermission())
        return {
            settingsPermission,
            locale: null,
            languagePermission: GeneralPermission.getLanguagePermission(),
        }
    },
    computed: {
        hasAvatarSlot() {
            return this.$slots.hasOwnProperty('avatar')
        },
        hasFullNameSlot() {
            return this.$slots.hasOwnProperty('full_name')
        },
        hasRoleSlot() {
            return this.$slots.hasOwnProperty('role')
        },
        imagePath() {
            if (this.avatar !== '') {
                return require(`${this.avatar}`);
            }
            return ''
        }
    },
    created() {
        this.locale = localStorage.locale !== "uz"
    },
    methods: {
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
        logout() {
            localStorage.clear();
            this.nullableAuth();
            this.nullMe();
            this.$router.push({name: "login"});
        },
    }
}
</script>

<style lang="scss" scoped>

.collapsed {
    .base-avatar {
        padding: 7px 8px !important;

        .person {
            display: none !important;
        }
    }


}

.base-avatar {
    display: flex;
    gap: 8px;
    width: max-content;
    align-items: center;
    border-radius: 32px;
    margin-right: 0;
    padding: 7px 16px 7px 8px;

    &:hover {
        background-color: var(--gray-200) !important;

        .person {
            .full_name {
                color: var(--violet-600)
            }
        }
    }


    p {
        margin-bottom: 0;
        max-width: 250px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    img {
        border-radius: 32px;
        background-color: red;
        object-fit: contain;
        width: 40px;
        height: 40px;
    }

    .person {
        display: flex;
        font-family: Inter, sans-serif;
        align-items: flex-start;
        flex-direction: column;

        .full_name {
            color: var(--gray-600);
            font-weight: 600;
            font-size: 16px;
            line-height: 22px;
        }

        .role {
            color: var(--gray-400);
            font-weight: 600;
            font-size: 14px;
            line-height: 20px;
        }
    }
}


::v-deep {
    .notArrow .b-dropdown .btn:not(.dropdown-item),
    .notArrow .btn-secondary:not(.dropdown-item) {
        border-radius: 2rem !important;
    }
}
</style>