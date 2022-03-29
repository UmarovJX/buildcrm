<template>
  <div
      class="vh-100 d-flex justify-content-center align-items-center flex-column"
  >
    <div class="container">
      <div class="row">
        <div class="col-md-12 mb-5">
          <div class="logo">
            <router-link to="/">
              <img src="@/assets/img/object__img1.png" alt="logo"/>
            </router-link>
          </div>
        </div>
        <div
            class="
            col-md-8
            d-none d-md-flex
            justify-content-center
            align-items-center
          "
        >
          <div class="rounded overflow-hidden">
            <img
                src="@/assets/img/login-img2.svg"
                alt="login img"
                class="mw-100"
            />
          </div>
        </div>
        <div class="col-md-4">
          <div class="d-flex justify-content-center align-items-center h-100">
            <ValidationObserver ref="validation-observer">
              <form
                  @submit.prevent="submittedForm"
                  class="login-form"
              >
                <div class="form">
                  <ValidationProvider
                      v-for="{type,name,rules,id,label,placeholder,bind,schemaError} in loginSchema"
                      :key="name+id"
                      :name="name"
                      :rules="rules"
                      v-slot="{ errors }"
                  >

                    <div class="form-group">
                      <label>{{ label }}</label>
                      <input
                          :type="type"
                          v-model="user[bind]"
                          class="form-control bg-transparent"
                          :placeholder="placeholder"
                      />
                      <span
                          v-if="schemaError.show && errors[0]"
                          class="error__provider"
                      >
                        {{ schemaError.text }}
                      </span>
                    </div>
                  </ValidationProvider>
                  <div class="d-flex justify-content-center align-items-center">
                    <button
                        type="submit"
                        class="btn btn-primary mr-0 w-100"
                        :class="{'button-disabled':loading}"
                    >
                    <span>
                      {{ $t("auth.login") }}
                    </span>
                      <span class="spinner" v-if="loading"></span>
                    </button>
                  </div>
                </div>
              </form>
            </ValidationObserver>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import api from "@/services/api";
import {setLocalVar} from "@/util/localstorage-helper";

export default {
  name: 'AppLogin',
  data() {
    return {
      loginSchema: [
        {
          type: 'email',
          name: 'Прежний пароль',
          rules: 'required|email',
          label: this.$t('auth.email'),
          bind: 'email',
          placeholder: '',
          id: 'email',
          schemaError: {
            show: false,
            text: this.$t('auth.validation_email')
          }
        },
        {
          type: 'password',
          name: 'Прежний пароль',
          rules: 'required|min:8',
          label: this.$t('auth.password'),
          bind: 'password',
          placeholder: '',
          id: 'password',
          schemaError: {
            show: false,
            text: this.$t('auth.validation_password')
          }
        },
      ],
      user: {
        email: null,
        password: null,
      },
      loading: false,
      info: null,
      submitted: false,
    }
  },

  watch: {
    'user.email'() {
      this.loginSchema[0].schemaError.show = false
    },
    'user.password'() {
      this.loginSchema[1].schemaError.show = false
    }
  },

  created() {
    localStorage.getItem('auth__access__token') && this.CheckLogin();
  },

  methods: {
    ...mapActions(["fetchAuth", "fetchMenu", "setMe"]),
    async submittedForm() {
      const validation = await this.$refs['validation-observer'].validate()
      if (validation) {
        this.Login()
      } else {
        for (let key in this.loginSchema) {
          this.loginSchema[key].schemaError.show = true
        }
      }
    },
    Login() {
      if (!this.loading) {
        this.authorizationUser()
      }
    },
    async authorizationUser() {
      this.loading = true
      let vm = this;
      let path = this.$router.currentRoute;
      await api.auth.login(this.user.email, this.user.password).then((response) => {
        const {refresh_token, access_token} = response.data
        setLocalVar('auth__refresh__token', refresh_token)
        setLocalVar('auth__access__token', access_token)

        this.fetchAuth(this);
        this.fetchMenu(this);
        this.setMe(this, path);

        vm.$toasted.show(response.data.message, {
          type: 'success'
        })
        vm.$router.push({name: 'home'});
      }).catch((error) => {
        if (!error.response) {
          this.$toasted.show(error.message, {
            type: 'error'
          })
        } else {
          const status = error.response.status
          const message = error.response.data.message

          /* CLIENT AND SERVER ERROR */
          if (status && status >= 400 && status <= 511) {
            this.$toasted.show(message, {
              type: 'error'
            })
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },

    CheckLogin() {
      // let vm = this;
      // api.authV1.getMe().then(() => {
      //   //this.items = response.data;
      //   vm.$router.push({name: "home"});
      // })
      // .catch(() => {
      // localStorage.clear();
      // });
    },
  },
};
</script>

<style scoped lang="scss">
.button-disabled {
  cursor: wait !important;
  opacity: 0.7;
}

.error__provider {
  color: red;
  font-size: 12px;
}

form {
  width: 350px;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (max-width: 576px) {
  .container {
    margin-top: -100px;
  }
}

.dark-theme {
  .login-form {
    label {
      color: #dfdfdf;
    }
  }
}

.spinner {
  box-sizing: border-box;
  width: 24px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  border: 2px solid #283046;
  border-top-color: #fff;
  animation: spinner 1s linear infinite;
}

@keyframes spinner {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
}

</style>
