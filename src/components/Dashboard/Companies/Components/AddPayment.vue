<template>
  <div>
    <b-modal
        id="modal-create"
        ref="creation-modal"
        size="lg"
        :title="modalProperties.title"
        hide-footer
        @show="resetModal"
    >
      <ValidationObserver ref="validation-observer" v-slot="{ handleSubmit }">
        <form ref="form" @submit.stop.prevent="handleSubmit(submitForm)">

          <ValidationProvider
              v-for="{label,labelFor,bind,mask,rules, type} in providerSchema"
              :key="label + labelFor"
              :name="label"
              :rules="rules"
              v-slot="{ errors }"
          >
            <b-form-group class="mb-2" :label="label" :label-for="labelFor">
              <b-form-input :type="type" :id="labelFor" v-mask="mask" v-model="company[bind]"/>
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
              <span class="save__button">{{ $t("add") }}</span>
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
  name: "AddPayment",
  props: {
    modalProperties: {
      type: Object,
      default: () => {
      },
    }
  },
  data() {
    return {
      loading: false,
      // companyTypes: [],
      // createPosition: true,
      company: {
        name_ru: null,
        name_uz: null,
        payment_account: null,
        mfo: null,
      },
      providerSchema: [
        {
          mask: '',
          type: 'text',
          bind: 'name_uz',
          labelFor: 'name_uz',
          rules: 'required|min:2',
          label: this.$t('companies.bank_name_uz')
        },
        {
          mask: '',
          type: 'text',
          bind: 'name_ru',
          labelFor: 'name_ru',
          rules: 'required|min:2',
          label: this.$t('companies.bank_name_ru')
        },
        {
          mask: '',
          type: 'number',
          bind: 'payment_account',
          labelFor: 'payment_account',
          rules: 'required|min:2',
          label: this.$t('companies.check_account')
        },
        {
          mask: '',
          type: 'number',
          bind: 'mfo',
          labelFor: 'mfo',
          rules: 'required|min:2',
          label: this.$t('companies.mfo')
        },
      ]
    }
  },
  methods: {
    submitForm() {
      const data = {
        bank_name: {
          ru: this.company.name_ru,
          uz: this.company.name_uz
        },
        payment_account: this.company.payment_account,
        mfo: this.company.mfo,
      }
      const form = Object.assign({/*bank_name*/}, data)
      const {position} = this.modalProperties

      if (position === 'create')
        this.addPayment(form)
      else
        this.addPayment(form)
    },

    addPayment(form) {
      const id = this.$route.params.companyId
      api.companies.addPayment(id, form)
          .then((response) => {
            const {message} = response.data
            this.$bvModal.hide("modal-create")
            this.$emit("created-payment", {message})
            this.resetModal()
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.loading = false
          })
    },

    resetModal() {
      this.company = {
        name_ru: null,
        name_uz: null,
        payment_account: null,
        mfo: null,
      }

      this.$bvModal.hide("modal-create")
    },
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