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


            <div class="companies" v-for="(company,index) in companies" :key="company.id">
              <div class="company">
                <div class="company-button">
                  <b-button @click="company.active = !company.active" variant="btn-primary"
                            class="company-button__item">
                    {{ company.name }}
                  </b-button>
                </div>
                <div v-if="company.active" class="company-input">
                  <ValidationProvider
                      v-for="{type,name,rules,extraClass,id,label,placeholder,bind} in companySchema"
                      :key="name+id"
                      :name="name"
                      :rules="rules"
                      :class="extraClass"
                      v-slot="{ errors }"
                      class="mt-3"
                  >
                    <label :for="id">{{ label }}</label>
                    <b-input-group>
                      <b-form-input
                          v-model="companiesForm[index][bind]"
                          :type="type"
                          :id="id"
                          :placeholder="placeholder"
                      >
                      </b-form-input>
                    </b-input-group>
                    <span class="error__provider">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
              </div>

            </div>


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
// import BaseButton from "@/components/Reusable/BaseButton";

export default {
  name: "BranchFormContent",
  components: {
    // BaseButton
  },
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
      companiesForm: [],
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
      ],
      companySchema: [
        {
          type: 'date',
          name: this.$t('branches.date_contract'),
          rules: '',
          extraClass: 'validation__provider',
          label: this.$t('branches.date_contract'),
          bind: 'date_contract',
          placeholder: this.$t('branches.date_contract'),
          id: 'date_contract',
          icon: 'address'
        },
        {
          type: 'text',
          name: this.$t('branches.number_contract'),
          rules: '',
          extraClass: 'validation__provider',
          label: this.$t('branches.number_contract'),
          bind: 'number_contract',
          placeholder: this.$t('branches.number_contract'),
          id: 'number_contract',
          icon: 'phone'
        },
        {
          type: 'date',
          name: this.$t('branches.date_implementation'),
          rules: '',
          extraClass: 'validation__provider',
          label: this.$t('branches.date_implementation'),
          bind: 'date_implementation',
          placeholder: this.$t('branches.date_implementation'),
          id: 'date_implementation',
          icon: 'phone'
        },
        {
          type: 'text',
          name: this.$t('branches.number_implementation'),
          rules: '',
          extraClass: 'validation__provider',
          label: this.$t('branches.number_implementation'),
          bind: 'number_implementation',
          placeholder: this.$t('branches.number_implementation'),
          id: 'number_implementation',
          icon: 'phone'
        }
      ],
      companies: [],
      history: this.$route.params.historyForm.companies,
    }
  },
  async created() {
    await this.getManagersList()
    await this.fetchCompaniesList()
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
  methods: {
    getDifference(array1, array2) {
      return array1.filter((object1, index1) => {
        return array2.some((object2, index2) => {
          if (object1.company_id === object2.company_id) {
            this.companiesForm[index1] = {
              company_id: this.history[index2].company_id,
              date_contract: this.history[index2].date_contract,
              number_contract: this.history[index2].number_contract,
              date_implementation: this.history[index2].date_implementation,
              number_implementation: this.history[index2].number_implementation,
            }
          }
        });
      });
    },

    collapseActive(id) {
      this.companies.forEach((item) => {
        if (item.id === id) {
          item.active = !item.active
        }
      })
    },
    async fetchCompaniesList() {
      // this.loading = true
      await api.companies.getCompaniesList()
          .then((response) => {
                const items = response.data
                items.forEach((item) => {
                  this.companies.push({...item, active: false})
                  this.companiesForm.push({
                    company_id: item.id,
                    date_contract: '',
                    number_contract: '',
                    date_implementation: '',
                    number_implementation: '',
                  })
                })
                this.getDifference(this.companiesForm, this.history)
              }
          )
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
      // .finally(() => {
      //
      // })
    },
    async getManagersList() {
      await api.userV2.getUsersAll()
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
      const result = this.companiesForm.filter(item => (item.date_contract && item.number_contract && item.date_implementation && item.number_implementation))
      const data = {
        name: branchName,
        address: branchAddress,
        phone: branchPhone,
        manager_id: managerId,
        companies: result
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
.company-input {
  display: grid;
  grid-gap: .5rem;
  grid-template-columns: 50% 50%;
}

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

.company-button {
  display: flex;
  align-items: center;

  &__item {
    background-color: #007bff !important;
  }

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

</style>