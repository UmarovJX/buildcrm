<template>
  <div>
    <b-modal
        id="modal-create"
        ref="modal"
        size="lg"
        :title="$t('add')"
        hide-footer
        @show="resetModal"
    >
      <ValidationObserver ref="validation-observer" v-slot="{ handleSubmit }">
        <form ref="form" @submit.stop.prevent="handleSubmit(submitNewCompany)">
          <ValidationProvider
              name="roles"
              rules="required"
              v-slot="{ errors }"
          >
            <b-form-group
                class="mb-2"
                :label="$t('companies.type')"
            >
              <b-form-select
                  class="mb-2"
                  id="roles"
                  :label-for="$t('companies.type')"
                  :name="$t('companies.type')"
                  v-model="company.type_id"
                  :options="typeOptions"
              >
                <template #first>
                  <b-form-select-option
                      :value="0"
                      disabled
                  >
                    {{ $t("companies.type_enter") }}
                  </b-form-select-option>
                </template>
              </b-form-select>
            </b-form-group>
            <span class="error__provider" v-if="errors[0]">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
              v-for="{label,labelFor,bind,mask,rules} in providerSchema"
              :key="label + labelFor"
              :name="label"
              :rules="rules"
              v-slot="{ errors }"
          >
            <b-form-group class="mb-2" :label="label" :label-for="labelFor">
              <b-form-input :id="labelFor" v-mask="mask" v-model="company[bind]"/>
            </b-form-group>
            <span class="error__provider" v-if="errors[0]">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <div class="d-flex justify-content-end pb-4">
            <b-button variant="light" @click="resetModal">
              {{ $t("cancel") }}
            </b-button>

            <b-button
                type="submit"
                class="ml-1 mr-0"
                variant="success"
            >
              <i class="fas fa-save" v-if="!loading"></i>
              <span class="save__button">{{ $t("save") }}</span>
              <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            </b-button>
          </div>
        </form>
      </ValidationObserver>
    </b-modal>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: 'CreationCompanyModal',
  emits: ['created-new-company'],
  data() {
    return {
      maskText: '',
      loading: false,
      companyTypes: [],
      company: {
        first_name: null,
        last_name: null,
        second_name: null,
        payment_account: null,
        name: null,
        inn: null,
        mfo: null,
        phone: null,
        other_phone: null,
        type_id: null,
        bank_name_ru: null,
        bank_name_uz: null
      },
      providerSchema: [
        {
          mask:'',
          type: 'text',
          bind: 'name',
          labelFor: 'name',
          rules: 'required|min:2',
          label: this.$t('companies.name')
        },
        {
          mask:'',
          type: 'text',
          bind: 'payment_account',
          labelFor: 'payment_account',
          rules: 'required|min:2',
          label: this.$t('companies.payment_account')
        },
        {
          mask:'',
          type: 'text',
          bind: 'inn',
          labelFor: 'inn',
          rules: 'required|min:2',
          label: this.$t('companies.inn')
        },
        {
          mask:'',
          type: 'text',
          bind: 'mfo',
          labelFor: 'mfo',
          rules: 'required|min:2',
          label: this.$t('companies.mfo')
        },
        {
          mask:'',
          type: 'text',
          bind: 'first_name',
          labelFor: 'first_name',
          rules: 'required|min:2',
          label: this.$t('companies.first_name')
        },
        {
          mask:'',
          type: 'text',
          bind: 'last_name',
          labelFor: 'last_name',
          rules: 'required|min:2',
          label: this.$t('companies.last_name')
        },
        {
          mask:'',
          type: 'text',
          bind: 'second_name',
          labelFor: 'second_name',
          rules: 'required|min:2',
          label: this.$t('companies.second_name')
        },
        {
          mask:'############',
          type: 'tel',
          bind: 'phone',
          labelFor: 'phone',
          rules: 'required|min:2',
          label: this.$t('companies.phone')
        },
        {
          mask:'############',
          type: 'tel',
          bind: 'other_phone',
          labelFor: 'other_phone',
          rules: 'required|min:2',
          label: this.$t('companies.other_phone')
        },
        {
          mask:'',
          type: 'text',
          bind: 'bank_name_ru',
          labelFor: 'bank_name_ru',
          rules: 'required|min:2',
          label: this.$t('companies.bank_name') + ' Ru'
        },
        {
          mask:'',
          type: 'text',
          bind: 'bank_name_uz',
          labelFor: 'bank_name_uz',
          rules: 'required|min:2',
          label: this.$t('companies.bank_name') + ' Uz'
        },
      ]
    }
  },

  computed: {
    typeOptions() {
      return this.companyTypes.map(({id: value, name}) => {
        let text = name.ru
        if (localStorage.locale) {
          text = name[localStorage.locale]
        }
        return {
          value,
          text
        }
      })
    }
  },

  async created() {
    await this.fetchCompanyType()
  },

  methods: {
    fetchCompanyType() {
      api.companies.getCompanyType()
          .then(response => {
            this.companyTypes = response.data
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
    },
    resetModal() {
      this.company = {
        inn: null,
        mfo: null,
        name: null,
        phone: null,
        type_id: 0,
        other_phone: null,
        first_name: null,
        last_name: null,
        second_name: null,
        payment_account: null,
        bank_name_ru: null,
        bank_name_uz: null
      }

      this.$bvModal.hide("modal-create")
    },

    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },

    async submitNewCompany() {
      this.loading = true

      const {bank_name_ru, bank_name_uz} = this.company
      const bank_name = {
        uz: bank_name_uz,
        ru: bank_name_ru
      }

      const form = Object.assign({bank_name}, this.company)
      delete form.bank_name_ru
      delete form.bank_name_uz

      await api.companies.createNewCompany(this.company)
          .then((response) => {
            const {message} = response.data
            this.$bvModal.hide("modal-create")
            this.$emit("created-new-company", {message})
            this.resetModal()
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.loading = false
          })
    }
  }
}
</script>

<style lang="scss" scoped>
.error__provider {
  color: red;
  display: block;
  margin-bottom: 1rem;
}

.save__button {
  color: white;
}
</style>
