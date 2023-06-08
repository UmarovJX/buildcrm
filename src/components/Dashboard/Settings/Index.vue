<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({
    sms: {
      login: null,
      password: null,
    },

    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },
  }),

  mounted() {
    this.fetchPlaymobile(this);
  },

  computed: mapGetters(["getPermission", "getMe", "getPlaymobile"]),

  methods: {
    ...mapActions(["fetchPlaymobile"]),

    async SavePlayMobile() {
      try {
        const { status, data } = await this.axios.put(
          process.env.VUE_APP_URL + "/v1/crm/settings/sms",
          {
            status: this.getPlaymobile.sms.status,
            login: this.getPlaymobile.sms.login,
            password: this.getPlaymobile.sms.password,
          },
          this.header
        );

        if (status === 202) this.toasted(data.message, "success");
      } catch (error) {
        if (!error.response) {
          this.toasted("Error: Network Error", "error");
        } else {
          if (error.response.status === 403) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 401) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 500) {
            this.toasted(error.response.data.message, "error");
          } else {
            this.toasted(error.response.data.message, "error");
          }
        }
      }
    },
  },
};
</script>

<template>
  <div>
    <div class="card">
      <div class="card-content">
        <div class="card-header">
          <h5 class="p-0 m-0">Playmobile configuration</h5>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="login" class="form-label">Login</label>
            <input
              type="text"
              class="form-control"
              id="login"
              v-model="getPlaymobile.sms.login"
              placeholder=""
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              v-model="getPlaymobile.sms.password"
              id="password"
              placeholder=""
            />
          </div>

          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckChecked"
              v-model="getPlaymobile.sms.status"
            />
            <label class="form-check-label" for="flexCheckChecked">
              Published
            </label>
          </div>
        </div>

        <div class="card-footer">
          <button type="button" @click="SavePlayMobile" class="btn btn-primary">
            <i class="fa fa-save"></i> Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
