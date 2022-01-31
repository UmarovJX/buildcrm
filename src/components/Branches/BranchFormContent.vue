<template>
  <b-overlay :show="loading" class="overlay__alert" rounded="sm">
    <div class="ml-3 new-object create__branch">
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
              @submit.prevent="handleSubmit(submitNewBranch)"
          >
            <ValidationProvider
                v-for="{type,name,rules,extraClass,id,label,placeholder,bind,icon} in providerSchema"
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
                  <b-input-group-text class="input__text__icon">
                    <img :src="require(`@/assets/icons/${icon}.svg`)" :alt="`${icon}.svg`">
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

            <ValidationProvider
                v-if="managersOption.length"
                name="select-related-user"
                rules="required"
                v-slot="{ errors }"
                class="mt-3 validation__provider"
            >
              <label for="select-managers"> Менеджер </label>
              <b-form-select
                  id="select-managers"
                  v-model="form.managerId"
                  :options="managersOption"
              ></b-form-select>
              <span class="error__provider">
                {{ errors[0] }}
              </span>
            </ValidationProvider>

            <div class="buttons">
              <b-button :disabled="loading" type="submit" variant="btn-primary" class="submit__button">
                {{ submitButtonText }}
              </b-button>
            </div>
          </form>
        </ValidationObserver>
      </div>
    </div>
    <template #overlay>
      <div class="text-center">
        <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
        <p id="cancel-label">{{ $t('loading') }}</p>
      </div>
    </template>
  </b-overlay>
</template>

<script>
import api from "@/services/api";

export default {
  name: "BranchFormContent",
  props: {
    historyForm: {
      type: Object,
      default: () => ({})
    },
    submitButtonText: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    responseAlert: {
      type: Object,
      required: true
    }
  },
  emits: ['submit-form', 'make-default-count-down', 'change-count-down'],
  data() {
    return {
      managersList: [],
      form: {
        branchName: '',
        branchAddress: '',
        managerId: null,
        branchPhone: null
      },
      providerSchema: [
        {
          type: 'text',
          name: this.$t('branches.branch_name'),
          rules: 'required|min:3',
          extraClass: 'validation__provider',
          label: this.$t('branches.branch_name'),
          bind: 'branchName',
          placeholder: this.$t('branches.branch_name'),
          id: 'branchName',
          icon: 'location'
        },
        {
          type: 'text',
          name: this.$t('branches.branch_address'),
          rules: 'required|min:3',
          extraClass: 'validation__provider',
          label: this.$t('branches.branch_address'),
          bind: 'branchAddress',
          placeholder: this.$t('branches.branch_address'),
          id: 'branchAddress',
          icon: 'address'
        },
        {
          type: 'tel',
          name: this.$t('branches.branch_phone'),
          rules: 'required|min:5',
          extraClass: 'validation__provider',
          label: this.$t('branches.branch_phone'),
          bind: 'branchPhone',
          placeholder: this.$t('branches.branch_phone'),
          id: 'branchPhone',
          icon: 'phone'
        }
      ]
    }
  },
  computed: {
    managersOption() {
      const managers = this.managersList
      if (managers.length) {
        return this.managersList.map((manager) => {
          return {
            value: manager.id,
            text: manager.last_name + ' ' + manager.first_name
          }
        })
      }

      return []
    },
    hiddenArea() {
      return this.loading ? 'true' : null
    }
  },
  async created() {
    await this.getManagersList()
  },
  methods: {
    async getManagersList() {
      await api.user.getUsersList()
          .then(response => {
            this.managersList = response.data
            this.setHistoryField()
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
    },
    setHistoryField() {
      const hasHistory = this.$route.params?.historyForm && Object.keys(this.$route.params?.historyForm).length > 0
      if (hasHistory) {
        const {name, address, phone, manager} = this.$route.params.historyForm
        this.form = {
          ...this.form,
          ...{
            branchName: name,
            branchAddress: address,
            branchPhone: phone,
            managerId: manager.id
          }
        }
      } else {
        this.form.managerId = this.managersList[0].id
      }
    },
    async submitNewBranch() {
      const {branchName, branchAddress, branchPhone, managerId} = this.form
      const data = {
        name: branchName,
        address: branchAddress,
        phone: branchPhone,
        manager_id: managerId
      }
      this.$emit('submit-form', data)
    },
    dismissedAlert() {
      this.$emit('make-default-count-down', 0)
    },
    makeFormDefault() {
      for (const [key,] of Object.entries(this.form)) {
        this.form[key] = ''
      }
    },
    countDownChanged(dismissCountDown) {
      this.$emit('change-count-down', dismissCountDown)
    }
  }
}
</script>

<style lang="scss" scoped>
.create__branch {
  max-width: 720px;
  margin-top: 1rem;
}

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

.input__text__icon {
  cursor: pointer;
  height: 38px;
}

.custom-file-input:lang(en) ~ .custom-file-label::after {
  content: 'kms';
}
</style>