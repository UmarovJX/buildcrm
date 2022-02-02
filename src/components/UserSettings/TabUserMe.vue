<template>
  <div class="user__content">
    <div class="avatar__content">
      <div class="avatar__content-icon">
        <template v-if="loadingProgress">
          <svg
              stroke-linecap="round"
              :stroke-width="3"
              :stroke-dashoffset="calcValue"
              stroke="#3480eb"
              class="progress__front" viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="45"></circle>
          </svg>
          <span class="progress__counter">{{ loadingProgress }} %</span>
        </template>
        <div class="upload__content">
          <b-avatar
              variant="primary"
              :src="getUserAvatarUrl"
              :text="getNameSnippet"
              size="6rem"
              class="avatar-wrapper"
              :class="{'active-loading':loadingProgress}"
          ></b-avatar>
          <input type="file" accept="image/*" @change="compressImage" class="upload__avatar">
        </div>
      </div>

      <div class="editor__content">
        <div class="editor__content-buttons">
          <div class="upload__content">
            <b-button variant="primary" class="submit__button">Upload Photo</b-button>
            <input ref="upload-image" type="file" accept="image/*" @change="compressImage" class="upload__avatar">
          </div>
          <!--          <b-button @click="removeAvatar" class="remove__button" variant="danger">Remove</b-button>-->
        </div>
      </div>
    </div>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form class="user__form" @submit.prevent="handleSubmit(submitUserInfo)">
        <ValidationProvider
            v-for="{type,name,rules,bind,placeholder,extraClass,id} in formSchema"
            :key="name+rules"
            :name="name"
            :rules="rules"
            v-slot="{ errors }"
            :class="extraClass"
        >
          <label :for="id">{{ name }}</label>
          <b-form-input
              v-model="user[bind]"
              :type="type"
              :id="id"
              :placeholder="placeholder"
              disabled
          >
          </b-form-input>
          <span class="error__provider">{{ errors[0] }}</span>
        </ValidationProvider>

        <!--        <div class="buttons">-->
        <!--          <b-button type="submit" variant="outline-primary" class="submit__button">Сохранить изменения</b-button>-->
        <!--          &lt;!&ndash;          <b-button type="button" variant="danger" class="remove__button">Remove</b-button>&ndash;&gt;-->
        <!--        </div>-->
      </form>
    </ValidationObserver>
    <base-loading-content :loading="loading"/>
  </div>
</template>

<script>
import axios from "axios"
import api from "@/services/api";
import Compressor from "compressorjs";
import BaseLoadingContent from "@/components/BaseLoadingContent";
import {mapActions} from "vuex";

export default {
  name: "UserSettings",
  components: {
    BaseLoadingContent
  },
  data() {
    return {
      formSchema: [
        {
          id: 'username',
          type: 'text',
          name: this.$t('user.first_name'),
          rules: 'required|alpha',
          bind: 'firstName',
          placeholder: this.$t('user.first_name'),
          extraClass: 'validation__provider'
        },
        {
          id: 'lastname',
          type: 'text',
          name: this.$t('user.last_name'),
          rules: 'required|alpha',
          bind: 'lastName',
          placeholder: this.$t('user.last_name'),
          extraClass: 'validation__provider'
        },
        {
          id: 'phoneNumber',
          type: 'tel',
          name: this.$t('user.phone_number'),
          rules: 'required|digits:12',
          bind: 'phone',
          placeholder: this.$t('user.phone_number'),
          extraClass: 'validation__provider'
        },
        {
          id: 'email',
          type: 'email',
          name: this.$t('user.email'),
          rules: 'required|email',
          bind: 'email',
          placeholder: this.$t('user.email'),
          extraClass: 'validation__provider'
        }
      ],
      user: {
        avatar: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: ''
      },
      uploadImage: '',
      backendAvatar: '',
      loadingProgress: 0,
      loading: false
    }
  },
  async created() {
    await this.initUserData()
  },
  computed: {
    getUserAvatarUrl() {
      if (this.uploadImage) {
        return this.uploadImage
      }
      return process.env.VUE_APP_URL + '/' + this.user.avatar
    },
    getNameSnippet() {
      const {firstName, lastName} = this.user
      if (firstName !== '' && lastName !== '') {
        return lastName[0] + firstName[0]
      }
      return ''
    },
    calcValue() {
      return 283 - (283 * this.loadingProgress) / 100;
    },
  },
  watch: {
    loadingProgress(last) {
      if (last === 100) {
        this.makeProgressDefault()
      }
    }
  },
  methods: {
    ...mapActions({
      updateUserData: 'setMe'
    }),
    submitUserInfo() {

    },
    async initUserData() {
      this.loading = true
      await api.user.getUserData().then(response => {
        const {user} = response.data
        this.user = {...this.user, ...user}
      }).catch((error) => {
        this.toastedWithErrorCode(error)
      }).finally(() => {
        this.loading = false
      })
    },
    compressImage(file) {
      const fileUpl = file.target.files ? file.target.files[0] : null;
      if (!fileUpl) {
        return;
      }

      new Compressor(fileUpl, {
        maxWidth: 1200,
        quality: 0.8,
        convertSize: 5000000,
        success: (result) => {
          this.backendAvatar = new File([result], result.name, {
            type: result.type,
            lastModified: Date.now(),
          });
          this.uploadImage = URL.createObjectURL(this.backendAvatar)
          this.uploadAvatar()
        },
      })
    },
    async removeAvatar() {
      const form = new FormData()
      form.append('avatar', 'null')

      const config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.token
        }
      }

      const _axios = axios.create({baseURL: process.env.VUE_APP_URL});
      await _axios.post('users/me', form, config)
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
    },
    async uploadAvatar() {
      const form = new FormData()
      form.append('avatar', this.backendAvatar)

      const config = {
        headers: {
          'Authorization': 'Bearer ' + localStorage.token
        },
        onUploadProgress: (progressEvent) => {
          this.loadingProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        }
      }

      const _axios = axios.create({baseURL: process.env.VUE_APP_URL});
      await _axios.post('users/me', form, config)
          .catch((error) => {
            this.toastedWithErrorCode(error)
          }).finally(() => {
            this.updateUserData({axios})
          })
    },
    makeProgressDefault() {
      setTimeout(() => {
        this.loadingProgress = 0
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  margin: 0 !important;
}

.remove__button {
  margin-left: 16px !important;
}

.user__content {
  padding: 2rem;

  .upload__content {
    display: grid;
    place-content: center;
    position: relative;
    cursor: pointer;

    .upload__avatar {
      opacity: 0;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      position: absolute;
      cursor: pointer;
    }
  }
}

.avatar__content {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-bottom: 32px;

  .editor__content {
    &-buttons {
      display: flex;
      margin-bottom: 16px;
    }
  }
}

.validation__provider {
  display: block;
  margin-top: 8px;
  margin-bottom: 8px;
}

.error__provider {
  display: block;
  color: red;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 1rem;
}

.submit__button {
  background-color: #007bff !important;
  margin-right: 0;
}

.avatar__content-icon {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6.75rem;
  height: 6.75rem;
}

.progress__front {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;

  circle {
    fill: none;
    stroke-dasharray: 283;
  }
}

.avatar-wrapper {
  background-color: darkorchid;
  border-radius: 50%;
  box-shadow: 0.5px 0.5px -1px 0 rgba(0,0,0,0.75);
}

.active-loading {
  &::after {
    content: '';
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
  }
}

.progress__counter {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  color: white;
  font-weight: bold;
}

.user__form {
  max-width: 720px;
}
</style>