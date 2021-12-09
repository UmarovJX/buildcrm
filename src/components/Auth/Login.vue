<template>
  <div
    class="vh-100 d-flex justify-content-center align-items-center flex-column"
  >
    <div class="container">
      <div class="row">
        <div class="col-md-12 mb-5">
          <div class="logo">
            <router-link to="/">
              <img src="@/assets/img/object__img1.png" alt="logo" />
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

                <div class="d-flex justify-content-center">
                  <button type="submit" class="btn btn-primary mr-0 w-100">
                    {{ $t("auth.login") }}
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

    info: null,
  }),

  mounted() {
    this.CheckLogin();
  },

  methods: {
    ...mapActions(["fetchAuth", "fetchMenu", "setMe"]),

    Login() {
      let vm = this;
      let path = this.$router.currentRoute;

      this.axios
        .post(process.env.VUE_APP_URL + "/oauth", this.user)
        .then((response) => {
          const token = response.data.access_token;
          localStorage.token = token;
          // this.setToken(token);

          this.fetchAuth(this);
          this.fetchMenu(this);
          this.setMe(this, path);

          vm.toasted(response.data.message, "success");
          vm.$router.push("/home");
        })
        .catch(function(error) {
          if (!error.response) {
            vm.toasted("Error: Network Error", "error");
          } else {
            if (error.response.status === 403) {
              vm.toasted(error.response.data.message, "error");
            } else if (error.response.status === 401) {
              vm.toasted(error.response.data, "error");
            } else if (error.response.status === 500) {
              vm.toasted(error.response.data.message, "error");
            } else {
              vm.toasted(error.response.data.message, "error");
            }
          }
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
</style>
