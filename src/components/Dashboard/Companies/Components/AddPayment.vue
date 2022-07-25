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
              :name="providerSchema[0].label"
              :rules="providerSchema[0].rules"
              v-slot="{ errors }"
          >
            <base-input
                class="mb-2 w-100"
                v-model="payment['bank_name'].uz"
                :label="true"
                :mask="providerSchema[0].mask"
                :type="providerSchema[0].type"
                :id="providerSchema[0].labelFor"
                :placeholder="providerSchema[0].label"
            />

            <span class="error__provider" v-if="errors[0]">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
              :name="providerSchema[1].label"
              :rules="providerSchema[1].rules"
              v-slot="{ errors }"
          >
            <base-input
                class="mb-2 w-100"
                v-model="payment['bank_name'].ru"
                :label="true"
                :mask="providerSchema[1].mask"
                :type="providerSchema[1].type"
                :id="providerSchema[1].labelFor"
                :placeholder="providerSchema[1].label"
            />

            <span class="error__provider" v-if="errors[0]">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

          <ValidationProvider
              v-for="{label,labelFor,bind,mask,rules, type} in providerSchema.slice(2)"
              :key="label + labelFor"
              :name="label"
              :rules="rules"
              v-slot="{ errors }"
          >
            <base-input
                class="mb-2 w-100"
                v-model="payment[bind]"
                :label="true"
                :mask="mask"
                :type="type"
                :id="labelFor"
                :placeholder="label"
            />
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
              <span class="save__button" @click="submitForm">{{ $t("save") }}</span>
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
import BaseInput from "@/components/Reusable/BaseInput";

export default {
  name: "AddPayment",
  components: {
    BaseInput
  },

  props: {
    modalProperties: {
      type: Object,
      default: () => {
      },
    },
    paymentData: {
      type: Object,
      default: () => {
      },
    }
  },
  data() {
    return {
      loading: false,
      payment: {
        bank_name: {
          uz: '',
          ru: ''
        },
        payment_account: null,
        mfo: null,
      },
      providerSchema: [
        {
          mask: '',
          type: 'text',
          bind: 'bank_name.uz',
          labelFor: 'bank_name.uz',
          rules: 'required|min:2',
          label: this.$t('companies.bank_name_uz')
        },
        {
          mask: '',
          type: 'text',
          bind: 'bank_name.ru',
          labelFor: 'bank_name.ru',
          rules: 'required|min:2',
          label: this.$t('companies.bank_name_ru')
        },
        {
          mask: '################',
          type: 'text',
          bind: 'payment_account',
          labelFor: 'payment_account',
          rules: 'required|min:2',
          label: this.$t('companies.check_account')
        },
        {
          mask: '################',
          type: 'text',
          bind: 'mfo',
          labelFor: 'mfo',
          rules: 'required|min:2',
          label: this.$t('companies.mfo')
        },
      ]
    }
  },
  watch: {
    paymentData(data) {
      const hasProperties = Object.keys(data).length > 0
      if (hasProperties) {
        this.setFormProperties()
      } else {
        this.payment = {
          bank_name: {
            uz: '',
            ru: ''
          },
          payment_account: null,
          mfo: null,
        }
      }
    }
  },
  methods: {
    async setFormProperties() {
      this.payment = {
        bank_name: {
          uz: this.paymentData.bank_name.uz,
          ru: this.paymentData.bank_name.ru
        },
        mfo: parseInt(this.paymentData.mfo),
        payment_account: parseInt(this.paymentData.payment_account)
      }
    },

    submitForm() {
      const data = {
        bank_name: {
          ru: this.payment.bank_name.ru,
          uz: this.payment.bank_name.uz
        },
        payment_account: parseInt(this.payment.payment_account),
        mfo: parseInt(this.payment.mfo),
      }
      // const form = Object.assign({}, data)
      const {position} = this.modalProperties

      if (position === 'create') {
        this.addPayment(data)
        // const {companyId} = this.$route.params
      } else {
        this.updateCurrentPayment(data)
        // api.companies.addPayment(companyId, data)
        //     .then((response) => {
        //       const {message} = response.data
        //       this.$bvModal.hide("modal-create")
        //       this.$emit("updated-company", {message})
        //       this.resetModal()
        //     })
        //     .catch((error) => {
        //       this.toastedWithErrorCode(error)
        //     })
        //     .finally(() => {
        //       this.loading = false
        //     })

      }
    },
    async updateCurrentPayment(form) {
      this.loading = true
      const {companyId} = this.$route.params
      await api.companies.updatePayment(companyId, this.paymentData.id, form)
          .then((response) => {
            const {message} = response.data
            this.$bvModal.hide("modal-create")
            this.$swal({
              title: this.$t("sweetAlert.success_create_payment"),
              text: message,
              icon: "success",
              showCancelButton: false,
              confirmButtonText: this.$t("next"),
            })
            this.$emit("update-company", {message})
            this.resetModal()
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.loading = false
          })
    },

    addPayment(form) {
      this.loading = false
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
      this.payment = {
        bank_name: {
          uz: '',
          ru: ''
        },
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

::v-deep .modal-content {
  border: none;
  border-radius: 50px;
  padding: 35px 35px 10px 35px;
  top: -50%;
  left: 50%;
  transform: translate(-50%, 10%);
  min-width: max-content;

  header {
    display: flex;
    align-items: center;
    border: none !important;

    h5 {
      font-family: 'Craftwork Sans';
      font-weight: 900;
      font-size: 36px;
      color: #4B5563;
    }

    button {
      background: #F3F4F6;
      color: #9CA3AF;
      padding: 10px 15px;
      border-radius: 50%;
    }
  }

  .form-control {
    border: none;
    border-radius: 32px;
    width: 400px;
    background: #F3F4F6;
    color: #9CA3AF;
    padding: 23px;
    margin-bottom: 6px;
  }

  form {
    div {
      display: flex;
      justify-content: space-between !important;

      button {
        margin-top: 30px;
        color: #4B5563 !important;
        background: #F3F4F6 !important;
        width: 100%;
      }

      button:nth-child(2) {
        background: linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%) !important;
        color: white;
      }
    }
  }
}
</style>