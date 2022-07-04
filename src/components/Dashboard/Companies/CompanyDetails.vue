<template>
  <main>
    <base-bread-crumb :active-content="activeContent" :bread-crumbs="breadCrumbs">
      <template #extra-content>
        <button
            class="btn btn-primary mr-0 mt-md-0"
            @click="addPayment"
        >
          <i class="fal fa-plus mr-2"></i>
          {{ $t("companies.addPayment") }}
        </button>
      </template>
    </base-bread-crumb>
    <div class="payment__content">
      <PaymentBoxContent
          v-for="detail in payments"
          :key="detail.created_at"
          :detail="detail"
          :company="companyId"
          @updated-company="updatedPayments"
      />
    </div>

    <AddPayment
        @updated-payments="updatedPayments"
        @created-payment="createdPayment"
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
// import BaseBreadCrumb from "@/components/BaseBreadCrumb";
import PaymentBoxContent from "@/components/Dashboard/Companies/Components/PaymentBoxContent";
import AddPayment from "@/components/Dashboard/Companies/Components/AddPayment";
import BaseBreadCrumb from "@/components/BaseBreadCrumb";

export default {
  name: "CompanyDetails",
  components: {
    BaseBreadCrumb,
    PaymentBoxContent,
    AddPayment
  },
  data() {
    return {
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
      companyId: this.$route.params.companyId
    }
  },
  async created() {
    await this.getPaymentList()
  },
  methods: {
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
      this.$bvModal.show('modal-create')
    },

  }
}
</script>

<style lang="scss" scoped>
.payment__content {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 50px;
}
</style>