<template>
  <div>
    <b-overlay :show="loading" class="overlay__alert" rounded="sm">
      <b-alert
          dismissible
          :variant="responseAlert.variant"
          class="success__alert"
          :show="responseAlert.dismissCountDown"
          @dismissed="dismissedAlert"
          @dismiss-count-down="countDownChanged"
      >
        <p>{{ responseAlert.message }}</p>
        <b-progress
            :variant="responseAlert.variant"
            :max="responseAlert.dismissSecs"
            :value="responseAlert.dismissCountDown"
            height="4px"
        ></b-progress>
      </b-alert>
      <div :aria-hidden="hiddenArea">
        <ValidationObserver ref="validation-observer" v-slot="{ handleSubmit }">
          <form
              class="form__password"
              @submit.prevent="handleSubmit(submitNewPassword)"
          >
            <ValidationProvider
                v-for="({type,name,rules,extraClass,id,label,placeholder,bind},index) in providerSchema"
                :key="name+id"
                :name="name"
                :rules="rules"
                :class="extraClass"
                v-slot="{ errors }"
                class="mt-3"
            >
              <label :for="id">{{ label }}</label>
              <b-input-group>
                <template #append>
                  <b-input-group-text @click="toggleInputType(index)" class="toggle__password__view">
                <span v-if="type === 'password'">
                <img src="@/assets/icons/no-preview-aye.svg" alt="no-preview-aye.svg">
              </span>
                    <span v-else>
                <img src="@/assets/icons/preview-aye.svg" alt="preview-aye.svg">
              </span>
                  </b-input-group-text>
                </template>
                <b-form-input
                    v-model="form[bind]"
                    :type="type"
                    :id="id"
                    :placeholder="placeholder"
                >
                </b-form-input>
              </b-input-group>
              <span class="error__provider">{{ errors[0] }}</span>
            </ValidationProvider>
            <div class="buttons">
              <b-button :disabled="loading" type="submit" variant="btn-primary" class="submit__button">
                Обновить пароль
              </b-button>
            </div>
          </form>
        </ValidationObserver>
      </div>
      <template #overlay>
        <div class="text-center">
          <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
          <p id="cancel-label">Пожалуйста подождите...</p>
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: "TabChangePassword",
  data() {
    return {
      loading: false,
      responseAlert: {
        variant: 'success',
        dismissSecs: 10,
        dismissCountDown: 0,
        message: 'Ваш пароль был обновлен'
      },
      form: {
        oldPassword: '',
        newPassword: '',
        repeatedPassword: ''
      },
      providerSchema: [
        {
          type: 'password',
          name: 'Прежний пароль',
          rules: 'required|min:8',
          extraClass: 'validation__provider',
          label: 'Прежний пароль',
          bind: 'oldPassword',
          placeholder: 'Прежний пароль',
          id: 'oldPassword'
        },
        {
          type: 'password',
          name: 'Новый пароль',
          rules: 'required|min:8',
          extraClass: 'validation__provider',
          label: 'Новый пароль',
          bind: 'newPassword',
          placeholder: 'Новый пароль',
          id: 'newPassword'
        },
        {
          type: 'password',
          name: 'Повторите новый пароль',
          rules: 'required|min:4',
          extraClass: 'validation__provider',
          label: 'Повторите новый пароль',
          bind: 'repeatedPassword',
          placeholder: 'Повторите новый пароль',
          id: 'repeatedPassword'
        }
      ]
    }
  },
  computed: {
    hiddenArea() {
      return this.loading ? 'true' : null
    }
  },
  methods: {
    submitNewPassword() {
      this.loading = true
      const {oldPassword, newPassword, repeatedPassword} = this.form
      const data = {
        old_password: oldPassword,
        password: newPassword,
        password_confirmation: repeatedPassword
      }
      api.user.updateUserPassword(data)
          .then(() => {
            this.responseAlert.variant = 'success'
            this.responseAlert.message = 'Ваш пароль был обновлен'
            this.$refs['validation-observer'].reset()
            this.makeFormDefault()
            this.showResponseAlert()
          })
          .catch((error) => {
            const {status, data} = error.response

            if (status === 403) {
              this.responseAlert.variant = 'danger'
              this.responseAlert.message = data.message
              this.showResponseAlert()
            }

            if (status === 422) {
              const values = Object.values(data)
              this.responseAlert.variant = 'danger'
              this.responseAlert.message = values[0][0]
              this.showResponseAlert()
            }
          })
          .finally(() => {
            this.loading = false
          })

    },
    toggleInputType(index) {
      const currentType = this.providerSchema[index].type
      if (currentType === 'password') {
        this.providerSchema[index].type = 'text'
      } else {
        this.providerSchema[index].type = 'password'
      }
    },
    dismissedAlert() {
      this.responseAlert.dismissCountDown = 0
    },
    makeFormDefault() {
      for (const [key,] of Object.entries(this.form)) {
        this.form[key] = ''
      }
    },
    countDownChanged(dismissCountDown) {
      this.responseAlert.dismissCountDown = dismissCountDown
    },
    showResponseAlert() {
      this.responseAlert.dismissCountDown = this.responseAlert.dismissSecs
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay__alert {
  max-width: 640px;
}

.success__alert {
  max-width: 640px;
}

.form__password {
  max-width: 640px;

  .validation__provider {
    display: block;
    margin-top: 1rem;
  }

  .error__provider {
    color: red;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .submit__button {
      background-color: #007bff !important;
      margin-right: 0;
    }
  }
}

.toggle__password__view {
  cursor: pointer;
  height: 38px;
}
</style>