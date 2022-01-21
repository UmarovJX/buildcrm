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
            <form method="post" @submit.prevent="Login" class="login-form">
              <div class="form">
                <div class="form-group">
                  <label>{{ $t("auth.email") }}</label>
                  <input
                      type="email"
                      v-model="user.email"
                      class="form-control bg-transparent"
                  />
                </div>

                <div class="form-group">
                  <label>{{ $t("auth.password") }}</label>
                  <input
                      type="password"
                      v-model="user.password"
                      class="form-control bg-transparent"
                  />
                </div>

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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  data: () => ({
    user: {
      email: null,
      password: null,
    },
    loading: false,
    info: null,
  }),

  created() {
    localStorage.token && this.CheckLogin();
  },

  methods: {
    ...mapActions(["fetchAuth", "fetchMenu", "setMe"]),

    Login() {
      if (!this.loading) {
        this.authorizationUser()
      }
    },
    authorizationUser() {
      this.loading = true
      let vm = this;
      let path = this.$router.currentRoute;
      this.axios
          .post(process.env.VUE_APP_URL + "/oauth", this.user)
          .then((response) => {
            localStorage.token = response.data.access_token;
            // this.setToken(token);

            this.fetchAuth(this);
            this.fetchMenu(this);
            this.setMe(this, path);

            vm.toasted(response.data.message, "success");
            vm.$router.push("/home");
          })
          .catch(function (error) {
            if (!error.response) {
              this.toasted("Error: Network Error", "error");
            } else {
              const status = error.response.status
              const message = error.response.data.message

              /* CLIENT AND SERVER ERROR */
              if (status && status >= 400 && status <= 511) {
                this.toasted(message, 'error')
              }
            }
          }).finally(() => {
        this.loading = false
      });
    },

    CheckLogin() {
      let header = {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      };

      let vm = this;

      this.axios
          .get(process.env.VUE_APP_URL + "/oauth/me", header)
          .then(() => {
            //this.items = response.data;
            vm.$router.push({name: "home"});
          })
          .catch(() => {
            localStorage.clear();
          });
    },
  },
};
</script>

<style scoped lang="scss">
.button-disabled {
  cursor: wait !important;
  opacity: 0.7;
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
