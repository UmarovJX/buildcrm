<template>
  <div>
    <b-modal
        id="modal-create"
        ref="modal"
        :title="$t('add')"
        hide-footer
        @show="resetModal"
    >
      <b-alert show variant="danger" v-if="error">
        <ul class="pl-2 mb-0">
          <li v-for="(error, index) in errors" :key="index">
            <span v-for="msg in error" :key="msg">
              {{ index }} - {{ msg }}
            </span>
          </li>
        </ul>
      </b-alert>

      <ValidationObserver
          ref="validation-observer"
          v-slot="{ handleSubmit }"
      >
        <form
            ref="form"
            @submit.stop.prevent="handleSubmit(submitForm)"
        >
          <b-form-group
              label-cols="4"
              label-cols-lg="2"
              :label="$t('user.first_name')"
              label-for="first_name"
          >
            <b-form-input
                id="first_name"
                v-model="manager.first_name"
            ></b-form-input>
          </b-form-group>

          <b-form-group
              label-cols="4"
              label-cols-lg="2"
              :label="$t('user.last_name')"
              label-for="last_name"
          >
            <b-form-input
                id="last_name"
                v-model="manager.last_name"
            ></b-form-input>
          </b-form-group>

          <b-form-group
              label-cols="4"
              label-cols-lg="2"
              :label="$t('user.second_name')"
              label-for="second_name"
          >
            <b-form-input
                id="second_name"
                v-model="manager.second_name"
            ></b-form-input>
          </b-form-group>

          <b-form-group
              label-cols="4"
              label-cols-lg="2"
              :label="$t('user.phone')"
              label-for="phone"
          >
            <b-form-input id="phone" v-model="manager.phone"></b-form-input>
          </b-form-group>

          <b-form-group
              label-cols="4"
              label-cols-lg="2"
              :label="$t('user.email')"
              label-for="email"
          >
            <b-form-input
                type="email"
                v-model="manager.email"
                id="email"
            ></b-form-input>
          </b-form-group>

          <b-form-group
              label-cols="4"
              label-cols-lg="2"
              :label="$t('user.role')"
              label-for="roles"
          >
            <b-form-select v-model="manager.role_id" id="roles" class="mb-3">
              <b-form-select-option
                  v-for="(role, index) in getRoles"
                  :key="index"
                  :value="role.id"
              >
                {{ getName(role.name) }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>

          <b-form-group
              label-cols="4"
              label-cols-lg="2"
              :label="$t('branches.name')"
              label-for="branches"
          >
            <b-form-select v-model="manager.branch_id" id="branches" class="mb-3">
              <b-form-select-option
                  v-for="(branch, index) in branches"
                  :key="index"
                  :value="branch.id"
              >
                {{ branch.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>

          <ValidationProvider
              rules="required|min:8"
              v-slot="{ errors }"
              :name="`${ $t('user.password') }`"
              tag="div"
          >
            <b-form-group
                label-cols="4"
                label-cols-lg="2"
                :label="$t('user.password')"
                label-for="password"
            >
              <b-form-input
                  type="password"
                  min="5"
                  v-model="manager.password"
                  id="password"
              ></b-form-input>
            </b-form-group>

            <span
                v-if="errors[0]"
                class="error__provider d-flex justify-content-end mb-3"
            >
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <b-form-group
              label-cols="4"
              label-cols-lg="2"
              :label="$t('objects.title')"
              label-for="objects"
          >
            <b-form-checkbox-group
                v-model="manager.objects"
                :options="getObjects"
                class="mb-3"
                value-field="id"
                text-field="name"
                switches
            ></b-form-checkbox-group>
          </b-form-group>

          <div class="d-flex justify-content-end">
            <b-button variant="light" @click="resetModal">
              {{ $t("cancel") }}
            </b-button>

            <b-button type="submit" class="ml-1" variant="success">
              <i class="fas fa-save"></i> {{ $t("save") }}
            </b-button>
          </div>
        </form>
      </ValidationObserver>
    </b-modal>

    <b-overlay :show="getLoading" no-wrap opacity="0.5" style="z-index: 2222">
      <template #overlay>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import api from "@/services/api";

export default {
  data: () => ({
    manager: {
      first_name: null,
      last_name: null,
      second_name: null,
      phone: null,
      password: null,
      email: null,
      objects: [],
      role_id: null,
      branch_id: null
    },
    getLoading: false,
    branches: [],
    error: false,
    errors: [],

    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },
  }),

  computed: mapGetters(["getObjects", "getRoles"]),

  async created() {
    await this.getBranchesList()
  },

  mounted() {
    this.fetchObjects(this);
    this.fetchRoles(this).then(async () => {
      await this.initManagerRole()
    })
  },

  methods: {
    ...mapActions(["fetchObjects", "fetchRoles"]),
    initManagerRole() {
      this.manager.role_id = this.getRoles[0].id
    },
    async getBranchesList() {
      await api.branches.getBranchesList()
          .then((response) => {
            this.branches = response.data
            this.manager.branch_id = response.data[0].id
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
    },
    resetModal() {
      this.manager.first_name = null;
      this.manager.last_name = null;
      this.manager.second_name = null,
          this.manager.phone = null;
      this.manager.password = null;
      this.manager.email = null;

      this.$bvModal.hide("modal-create");

      this.error = false;
      this.errors = [];

      this.objects = [];
    },

    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },

    async submitForm() {
      this.getLoading = true;
      try {
        const response = await api.userV2.addNewUserToDB(this.manager)
        this.toasted(response.data.message, "success");
        this.$nextTick(() => {
          this.getLoading = false;
          this.$bvModal.hide("modal-create");
        });

        this.$emit("CreateManager", this.manager);
        this.resetFormProperties()
      } catch (error) {
        this.getLoading = false;
        if (!error.response) {
          this.toasted("Error: Network Error", "error");
        } else {
          if (error.response.status === 403) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 401) {
            this.toasted(error.response.data, "error");
          } else if (error.response.status === 500) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 422) {
            this.error = true;
            this.errors = error.response.data;
          } else {
            this.toasted(error.response.data.message, "error");
          }
        }
      }
    },

    resetFormProperties() {
      for (let key of Object.keys(this.manager)) {
        const property = this.manager[key]
        const isArray = Array.isArray(property)
        const notResetKeys = ['branch_id', 'role_id'].findIndex(property => property === key)
        if (isArray) {
          this.manager[key] = []
        } else if (notResetKeys === -1) {
          this.manager[key] = null
        }
      }
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
  },
};
</script>


<style scoped>
.error__provider {
  color: red;
}
</style>
