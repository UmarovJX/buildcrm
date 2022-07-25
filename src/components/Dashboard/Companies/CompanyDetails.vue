<template>
  <main>
    <div class="ml-5" v-if="deletePermission">
      <b-dropdown right>
        <template #button-content>
          {{ $t('companies.actions') }}
        </template>
        <b-dropdown-item v-if="deletePermission" href="#" @click="deleteCompany">
          <BaseDeleteIcon fill="#7C3AED"/>
          {{ $t('companies.delete_company') }}
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <CompanyInformation :companyId="companyId"/>
    <hr/>
    <div class="pt-4 d-flex flex-row flex-wrap justify-content-between align-items-center ">
      <h3 class="color-gray-700">{{ $t("companies.counted_payment") }}</h3>
      <BaseButton
          v-if="createPaymentPermission"
          class="bg-gray-150 color-gray-800 button rounded-circle]"
          :text='$t("companies.addPayment")'
          @click="addPayment"
      >
        <template #left-icon>
          <BasePlusIcon fill="#7C3AED"/>
        </template>
      </BaseButton>
    </div>
    <div v-if="viewPaymentPermission" class="payment__content">
      <PaymentBoxContent
          v-for="detail in payments"
          :key="detail.created_at"
          :company="companyId"
          :detail="detail"
          @edit-selected-payment="openEditingModal"
          @delete-payment="deletePayment"
          @update-company="getPaymentList"
      />
    </div>
    <AddPayment
        v-if="createPaymentPermission"
        @created-payment="createdPayment"
        @edit-selected-payment="updatedPayments"
        :payment-data="editedItem"
        :modal-properties="modalProperties"
    />

    <b-overlay :show="loading" no-wrap opacity="0.5" class="loading__overlay">
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
  </main>
</template>

<script>
import api from "@/services/api";
import PaymentBoxContent from "@/components/Dashboard/Companies/Components/PaymentBoxContent";
import AddPayment from "@/components/Dashboard/Companies/Components/AddPayment";
import CompanyInformation from "@/components/Company/CompanyInformation";
import BaseButton from "@/components/Reusable/BaseButton";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import PaymentAccount from "@/permission/payment_account";

export default {
  name: "CompanyDetails",
  components: {
    BaseDeleteIcon,
    BasePlusIcon,
    BaseButton,
    CompanyInformation,
    PaymentBoxContent,
    AddPayment
  },
  emits: ['delete-company'],
  data() {
    return {
      order: {},
      editedItem: {},
      activeContent: this.$t('list'),
      modalProperties: {
        position: 'create',
        title: this.$t('add')
      },
      breadCrumbs: [
        {
          routeName: this.$route.name,
          textContent: this.$t('companies.title')
        }
      ],
      loading: false,
      payments: [],
      companyId: this.$route.params.companyId,
      viewPaymentPermission: PaymentAccount.getPaymentAccountViewPermission(),
      createPaymentPermission: PaymentAccount.getPaymentAccountCreatePermission(),
    }
  },
  async created() {
    await this.getPaymentList()
  },
  methods: {
    async deleteCompany() {
      await api.companies.deleteCompany(this.companyId)
          .then((res) => {
            this.$emit("delete-company", res)
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.loading = false
            this.$router.push('/companies')
          })
    },
    async deletePayment(companyId, paymentId) {
      await api.companies.deletePayment(companyId, paymentId)
          // .then((res) => {
          //   this.payments = res.data
          // })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.loading = false
            this.getPaymentList()
          })
    },
    openEditingModal(item) {
      this.modalProperties = {
        title: this.$t('edit'),
        position: 'edit'
      }
      this.$bvModal.show('modal-create')
      this.editedItem = {...item}
    },
    async getPaymentList() {
      this.loading = true
      const id = this.$route.params.companyId
      await api.companies.getPaymentsList(id)
          .then((res) => {
            this.payments = res.data
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.loading = false
          })
    },
    createdPayment({message}) {
      this.getPaymentList()
      this.$swal({
        title: this.$t("sweetAlert.success_create_payment"),
        text: message,
        icon: "success",
        showCancelButton: false,
        confirmButtonText: this.$t("next"),
      })
    },

    updatedPayments() {
      this.getPaymentList()
      this.$swal({
        title: this.$t("sweetAlert.success_update_payment"),
        icon: "success",
        showCancelButton: false,
        confirmButtonText: this.$t("next"),
      })
    },

    addPayment() {
      this.modalProperties = {
        title: this.$t('add'),
        position: 'create'
      }
      this.editedItem = {}
      this.$bvModal.show('modal-create')
    },

  }
}
</script>

<style lang="scss" scoped>
hr {
  margin-top: -5px;
  background: #F3F4F6;
  border: 2px solid #F3F4F6;
}

::v-deep .ml-5 {
  display: flex;
  justify-content: flex-end;

  button {
    border: none !important;
    background: #7C3AED !important;
  }
}

::v-deep .ml-5:hover {
  display: flex;
  justify-content: flex-end;

  button {
    border: none !important;
    background: #7C3AED !important;
  }
}

.payment__content {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 50px;
}

h3 {
  font-family: 'Craftwork Sans';
  font-style: normal;
  font-weight: 900;
  font-size: 28px;
}
</style>