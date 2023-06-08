<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import api from "@/services/api";
import DummyPassword from "@/util/password-generate";
import scorePassword from "@/util/score-password";

const dummy = new DummyPassword();

export default {
  props: {
    managerId: {
      type: [String, Number],
      required: true,
    },
    editHistoryContext: {
      type: Object,
      default: () => {
        return {
          id: 0,
        };
      },
    },
  },

  data: () => ({
    error: false,
    errors: [],
    branches: [],
    manager: {
      branch_id: null,
      first_name: "",
      last_name: "",
      second_name: "",
      phone: "",
      email: "",
      role_id: "",
      password: "",
      objects: [],
    },
    typeForPassword: "password",
    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },
    options: {
      length: 16,
      lower: true,
      upper: true,
      digits: true,
      symbols: true,
    },
    errorNumber: "Пароль должен содержать хотя бы одну цифру",
    errorUppercase: "Пароль должен содержать заглавных буквы",
    errorLowercase: "Пароль должен содержать маленькие буквы",
    errorSpecialChar: "Пароль должен содержать хотя бы один символ",
    validationError: {
      show: false,
      message: [],
    },
    validationPassword: true,
    getLoading: false,
  }),

  async created() {
    await this.getBranchesList();
  },

  mounted() {
    this.setHistoryContext();
  },

  watch: {
    "editHistoryContext.id"(id) {
      if (id !== 0) {
        this.setHistoryContext();
      }
    },
    "manager.password"(value) {
      this.checkPassword(value);
    },
  },

  computed: {
    ...mapGetters(["getObjects", "getUser", "getRoles"]),
    score() {
      switch (scorePassword(this.manager.password)) {
        case 0:
          return "risky";
        case 1:
          return "guessable";
        case 2:
          return "weak";
        case 3:
          return "safe";
        case 4:
          return "secure";
        default:
          return "";
      }
    },
  },

  methods: {
    ...mapMutations(["updateUser"]),
    ...mapActions(["nullManager"]),

    checkPassword(password) {
      const specialCharRegex = /[^A-Za-z0-9]/g;
      const lowercaseRegex = /(.*[a-z].*)/g;
      const uppercaseRegex = /(.*[A-Z].*)/g;
      const numberRegex = /(.*[0-9].*)/g;

      const hasSpecialChar = specialCharRegex.test(password);
      const hasLowerCase = lowercaseRegex.test(password);
      const hasUpperCase = uppercaseRegex.test(password);
      const hasNumber = numberRegex.test(password);
      this.validationError.message = [];
      if (!hasSpecialChar)
        this.validationError.message.push(this.errorSpecialChar);
      if (!hasLowerCase) this.validationError.message.push(this.errorLowercase);
      if (!hasUpperCase) this.validationError.message.push(this.errorUppercase);
      if (!hasNumber) this.validationError.message.push(this.errorNumber);
      this.validationError.message.length
        ? (this.validationError.show = true)
        : (this.validationError.show = false);

      this.validationPassword =
        hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
    },
    regeneratePassword() {
      const characters = [];
      for (let option in this.options) {
        if (this.options[option] === true)
          characters.push(dummy[option.toUpperCase()]);
      }
      this.manager.password = dummy.create(
        this.options.length,
        characters.join("")
      );
    },
    toggleInputType() {
      if (this.typeForPassword === "password") {
        this.typeForPassword = "text";
      } else {
        this.typeForPassword = "password";
      }
    },
    setHistoryContext() {
      const length = Object.keys(this.editHistoryContext).length > 1;
      if (length) {
        const {
          first_name,
          last_name,
          second_name,
          phone,
          email,
          branch,
          role,
          objects,
        } = this.editHistoryContext;
        this.manager.objects = objects.map((object) => object.id);
        this.manager.first_name = first_name;
        this.manager.last_name = last_name;
        this.manager.second_name = second_name;
        this.manager.phone = phone;
        this.manager.email = email;
        this.manager.branch_id = branch.id;
        this.manager.role_id = role.id;
      }
    },
    async getBranchesList() {
      await api.branches
        .getBranchesList()
        .then((response) => {
          this.branches = response.data;
          this.branchId = this.branches[0].id;
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        });
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

    async submitForm() {
      if (this.validationPassword) {
        this.getLoading = true;
        try {
          const form = Object.assign({}, this.manager);
          form.phone = form.phone.replace(/\s/g, "");
          form.objects = form.objects.filter((object) => object !== null);
          const response = await api.userV2.updateUserData(
            this.managerId,
            form
          );
          this.toasted(response.data.message, "success");
          this.$nextTick(() => {
            this.getLoading = false;
            this.$bvModal.hide("modal-edit");
          });
          this.$emit("EditManager", this.manager);
          this.resetFormValues();
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
      }
    },

    resetFormValues() {
      this.manager.password = "";
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

      <ValidationObserver ref="edit-observer" v-slot="{ handleSubmit }">
        <form ref="form" @submit.stop.prevent="handleSubmit(submitForm)">
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
            label-for="middle_name"
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
            <b-form-input
              type="tel"
              id="phone"
              v-model="manager.phone"
              v-mask="'### ## ### ## ##'"
            ></b-form-input>
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
            <b-form-select
              v-model="manager.branch_id"
              id="branches"
              class="mb-3"
            >
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
            rules="min:8"
            v-slot="{ errors }"
            :name="`${$t('user.password')}`"
            tag="div"
            class="password-group"
          >
            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              :label="$t('user.password')"
              label-for="password"
            >
              <b-form-input
                :type="typeForPassword"
                min="8"
                v-model="manager.password"
                id="password"
                autocomplete="off"
              />
              <b-input-group-text @click="regeneratePassword">
                <img
                  style="width: 20px; height: 20px"
                  src="@/assets/icons/refresh.svg"
                  alt="no-preview-aye.svg"
                />
              </b-input-group-text>
              <b-input-group-text @click="toggleInputType()">
                <img
                  v-if="typeForPassword === 'password'"
                  src="@/assets/icons/no-preview-aye.svg"
                  style="width: 20px; height: 20px"
                  alt="no-preview-aye.svg"
                />
                <img
                  v-else
                  src="@/assets/icons/preview-aye.svg"
                  style="width: 20px; height: 20px"
                  alt="preview-aye.svg"
                />
              </b-input-group-text>
              <div
                v-if="manager.password"
                class="po-password-strength-bar"
                :class="score"
              ></div>
            </b-form-group>

            <span
              v-if="errors[0]"
              class="error__provider d-flex justify-content-end mb-1"
            >
              {{ errors[0] }}
            </span>
            <div v-if="manager.password && validationError.show" class="mb-3">
              <span
                class="w-100 error__provider d-flex justify-content-end mb-1 text-right"
                v-for="(message, index) in validationError.message"
                :key="index"
              >
                {{ message }} <br />
              </span>
            </div>
          </ValidationProvider>

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
      </ValidationObserver>
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

<style scoped>
::v-deep .password-group .form-row > .col {
  display: flex;
}

.po-password-strength-bar {
  display: flex;
  position: absolute;
  top: 100%;
  flex-basis: 100%;
  width: 97%;
  border-radius: 2px;
  transition: all 0.2s linear;
  height: 6px;
  margin-top: 5px;
}

.po-password-strength-bar.risky {
  background-color: #f95e68;
  width: 10%;
}

.po-password-strength-bar.guessable {
  background-color: #fb964d;
  width: 32.5%;
}

.po-password-strength-bar.weak {
  background-color: #fdd244;
  width: 55%;
}

.po-password-strength-bar.safe {
  background-color: #b0dc53;
  width: 77.5%;
}

.po-password-strength-bar.secure {
  background-color: #35cc62;
  width: 97%;
}
</style>
