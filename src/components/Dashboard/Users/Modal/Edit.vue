<template>
  <div>
    <b-modal
        id="modal-edit"
        ref="modal"
        :title="$t('edit')"
        hide-footer
        @show="resetModal"
    >
      <b-alert show variant="danger" v-if="error">
        <ul>
          <li v-for="(error, index) in errors" :key="index">
            <span v-for="msg in error" :key="msg">
              {{ msg }}
            </span>
          </li>
        </ul>
      </b-alert>

      <form ref="form" @submit.stop.prevent="handleSubmit">
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
              autocomplete="off"
          ></b-form-input>
        </b-form-group>

        <b-form-group
            label-cols="4"
            label-cols-lg="2"
            :label="$t('objects.title')"
            label-for="objects"
        >
          <b-form-checkbox-group
              id="checkbox-group-2"
              v-model="manager.objects"
              name="flavour-2"
              switches
          >
            <b-form-checkbox
                v-for="object in getObjects"
                :key="object.id"
                :value="object.id"
            >
              {{ object.name }}
            </b-form-checkbox>
          </b-form-checkbox-group>

          <!--                    <b-form-checkbox-group  :options="getObjects" v-model="getManager.object_id" class="mb-3" value-field="id" text-field="name" switches></b-form-checkbox-group>-->
        </b-form-group>

        <div class="w-100 d-flex justify-content-center">
          <b-button variant="light" @click="resetModal">
            {{ $t("cancel") }}
          </b-button>

          <b-button type="submit" class="ml-1" variant="success">
            <i class="fas fa-save"></i> {{ $t("save") }}
          </b-button>
        </div>
      </form>
    </b-modal>

    <b-overlay :show="getLoading" no-wrap opacity="0.5" style="z-index: 222233">
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
import {mapActions, mapGetters, mapMutations} from "vuex";
import api from "@/services/api";

export default {
  props: {
    managerId: {
      type: [String, Number],
      required: true
    },
    editHistoryContext: {
      type: Object,
      default: () => {
        return {
          id: 0
        }
      }
    }
  },

  data: () => ({
    error: false,
    errors: [],
    branches: [],
    manager: {
      branch_id: null,
      first_name: '',
      last_name: '',
      second_name: '',
      phone: '',
      email: '',
      role_id: '',
      password: '',
      objects: []
    },
    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },

    getLoading: false
  }),

  async created() {
    await this.getBranchesList()
  },

  mounted() {
    this.setHistoryContext()
  },

  watch: {
    'editHistoryContext.id'(id) {
      if (id !== 0) {
        this.setHistoryContext()
      }
    }
  },

  computed: mapGetters(["getObjects", "getUser", "getRoles"]),

  methods: {
    ...mapMutations(['updateUser']),
    ...mapActions(["nullManager"]),
    setHistoryContext() {
      const length = Object.keys(this.editHistoryContext).length > 1
      if (length) {
        const {first_name, last_name, second_name, phone, email, branch, role, objects} = this.editHistoryContext
        this.manager.objects = objects.map(object => object.id)
        this.manager.first_name = first_name
        this.manager.last_name = last_name
        this.manager.second_name = second_name
        this.manager.phone = phone
        this.manager.email = email
        this.manager.branch_id = branch.id
        this.manager.role_id = role.id
      }
    },
    async getBranchesList() {
      await api.branches.getBranchesList()
          .then((response) => {
            this.branches = response.data
            this.branchId = this.branches[0].id
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
    },
    resetModal() {
      this.$bvModal.hide("modal-edit");

      this.nullManager();

      this.error = false;
      this.errors = [];

      this.objects = [];
    },

    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },

    async handleSubmit() {
      this.getLoading = true
      try {
        const response = await api.userV2.updateUserData(this.managerId, this.manager)
        this.toasted(response.data.message, "success");
        this.$nextTick(() => {
          this.getLoading = false
          this.$bvModal.hide("modal-edit");
        });
        this.$emit("EditManager", this.manager);
        this.resetFormValues()
      } catch (error) {
        this.getLoading = false
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

    resetFormValues() {
      this.manager.password = ''
      // for (let key of Object.keys(this.manager)) {
      //   const property = this.manager[key]
      //   const isArray = Array.isArray(property)
      //   const isObject = typeof property === 'object'
      //   const isStringOrNumber = typeof property === 'string'
      //   if (Array.isArray(property)) {
      //     this.manager[key] = []
      //   }
      //
      //   if (isObject && !isArray) {
      //     this.manager[key] = {}
      //   }
      //
      //   if (isStringOrNumber) {
      //     this.manager[key] = ''
      //   }
      // }
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

<style scoped></style>
