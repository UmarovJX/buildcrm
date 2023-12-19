<script>
import AppDropdown from '@/components/Reusable/Dropdown/AppDropdown'
import { localeChanged } from 'vee-validate'
import GeneralPermission from '@/permission/general'
import { mapActions } from 'vuex'
import Permission from '@/permission'

export default {
  name: 'BaseAvatar',
  components: {
    AppDropdown,
  },
  props: {
    background: {
      type: String,
      required: false,
      default: '#F3F4F6',
    },
    avatar: {
      type: String,
      required: false,
    },
    full_name: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
    },
    nameSnippet: {
      type: String,
      required: false,
    },
  },
  data() {
    const settingsPermission = GeneralPermission.getSettingsPermission()
      && (GeneralPermission.getPasswordSettingsPermission()
        || GeneralPermission.getProfileSettingsPermission())
    return {
      settingsPermission,
      locale: false,
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
        return this.avatar
      }
      return ''
    },
  },
  created() {
    this.locale = localStorage.locale !== 'uz'
  },
  methods: {
    ...mapActions(['nullableAuth', 'nullMe']),
    openUserSetting() {
      this.$router.push({ name: 'user-settings' })
    },
    changeLocale() {
      if (this.locale === false) {
        localStorage.setItem('locale', 'ru')
        localStorage.locale = 'ru'
        this.$i18n.locale = 'ru'
        this.locale = true
        localeChanged()
      } else {
        localStorage.setItem('locale', 'uz')
        localStorage.locale = 'uz'
        this.$i18n.locale = 'uz'
        this.locale = false
        localeChanged()
      }
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    logout() {
      localStorage.clear()
      sessionStorage.clear()
      this.nullableAuth()
      this.nullMe()
      Permission.clearUserPermission()
      this.$router.push({ name: 'login' })
    },
  },
}
</script>

<template>
  <div>
    <app-dropdown
      :collapse-arrow="true"
      :position-right="true"
    >
      <template #header>
        <div
          class="base-avatar"
          :style="{ background }"
        >
          <slot name="avatar" />
          <b-avatar
            variant="primary"
            :src="imagePath"
            :text="nameSnippet"
            size="40px"
            class="d-flex"
          />
          <div class="person">
            <p class="full_name">
              <slot name="full_name" />
            </p>
            <p
              v-if="!hasFullNameSlot"
              class="full_name"
            >
              {{ full_name }}
            </p>
            <p class="role">
              <slot name="role" />
            </p>
            <p
              v-if="!hasRoleSlot"
              class="role"
            >
              {{ role }}
            </p>
          </div>
        </div>
      </template>
      <template #list>
        <b-dropdown-item
          v-if="languagePermission"
          class="lang-block"
          style="touch-action: none"
        >
          <a href="javascript:void(0)">
            <label
              class="switch"
              @click="changeLocale"
            >
              <input
                v-model="locale"
                type="checkbox"
              >
              <div class="slider round">
                <span>Русский</span>
                <span>O’zbekcha</span>
              </div>
            </label>
          </a>
        </b-dropdown-item>
        <b-dropdown-item
          v-if="settingsPermission"
          @click="openUserSetting"
        >
          {{ $t("settings.title") }}
        </b-dropdown-item>
        <b-dropdown-item @click="logout">
          {{ $t("logout") }}
        </b-dropdown-item>
      </template>
    </app-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.collapsed {
  .base-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7px !important;

    .person {
      display: none !important;
    }
  }
}

::v-deep {
  .b-avatar .b-avatar-text {
    line-height: initial;
  }
}

.lang-switcher {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 1rem;
}

.base-avatar {
  display: flex;
  gap: 8px;
  width: max-content;
  align-items: center;
  border-radius: 32px;
  margin-right: 0;
  padding: 7px 16px 7px 8px;
  height: 56px;
  min-width: 56px;

  &:hover {
    background-color: var(--gray-200) !important;

    .person {
      .full_name {
        color: var(--violet-600);
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

::v-deep .lang-block {
  .dropdown-item {
    padding: 0 !important;
  }
}
</style>
