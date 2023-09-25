<script>
import api from "@/services/api";
import PaymentBoxContent from "@/components/Dashboard/Companies/Components/PaymentBoxContent";
import AddPayment from "@/components/Dashboard/Companies/Components/AddPayment";
import CompanyInformation from "@/components/Company/CompanyInformation";
import BaseButton from "@/components/Reusable/BaseButton";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import PaymentAccount from "@/permission/payment_account";
import CompaniesPermission from "@/permission/companies";
import AppHeader from "@/components/Header/AppHeader";
import AppDropdown from "@/components/Reusable/Dropdown/AppDropdown";

export default {
  name: "CompanyDetails",
  components: {
    BaseDeleteIcon,
    BasePlusIcon,
    BaseButton,
    CompanyInformation,
    PaymentBoxContent,
    AddPayment,
    AppHeader,
    AppDropdown,
  },
  emits: ["delete-company"],
  data() {
    return {
      order: {},
      editedItem: {},
      activeContent: this.$t("list"),
      modalProperties: {
        position: "create",
        title: this.$t("add"),
      },
      breadCrumbs: [
        {
          routeName: this.$route.name,
          textContent: this.$t("companies.title"),
        },
      ],
      loading: false,
      payments: [],
      companyId: this.$route.params.companyId,
      viewPaymentPermission: PaymentAccount.getPaymentAccountViewPermission(),
      createPaymentPermission:
        PaymentAccount.getPaymentAccountCreatePermission(),
      deleteCompanyPermission:
        CompaniesPermission.getCompaniesDeletePermission(),
    };
  },
  async created() {
    await this.getPaymentList();
  },
  methods: {
    async deleteCompany() {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yes"),
      }).then(async (result) => {
        if (result.value) {
          await api.companies
            .deleteCompany(this.companyId)
            .then((res) => {
              this.$emit("delete-company", res);
            })
            .catch((error) => {
              this.toastedWithErrorCode(error);
            })
            .finally(() => {
              this.loading = false;
              this.$router.push("/companies");
            });
        }
      });
    },
    async deletePayment(companyId, paymentId) {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yes"),
      }).then(async (result) => {
        if (result.value) {
          await api.companies
            .deletePayment(companyId, paymentId)
            // .then((res) => {
            //   this.payments = res.data
            // })
            .catch((error) => {
              this.toastedWithErrorCode(error);
            })
            .finally(() => {
              this.loading = false;
              this.getPaymentList();
            });
        }
      });
    },
    openEditingModal(item) {
      this.modalProperties = {
        title: this.$t("edit"),
        position: "edit",
      };
      this.$bvModal.show("modal-create");
      this.editedItem = { ...item };
    },
    async getPaymentList() {
      this.loading = true;
      const id = this.$route.params.companyId;
      await api.companies
        .getPaymentsList(id)
        .then((res) => {
          this.payments = res.data;
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    createdPayment({ message }) {
      this.getPaymentList();
      this.$swal({
        title: this.$t("sweetAlert.success_create_payment"),
        text: message,
        icon: "success",
        showCancelButton: false,
        confirmButtonText: this.$t("next"),
      });
    },

    updatedPayments() {
      this.getPaymentList();
      this.$swal({
        title: this.$t("sweetAlert.success_update_payment"),
        icon: "success",
        showCancelButton: false,
        confirmButtonText: this.$t("next"),
      });
    },

    addPayment() {
      this.modalProperties = {
        title: this.$t("add"),
        position: "create",
      };
      this.editedItem = {};
      this.$bvModal.show("modal-create");
    },
  },
};
</script>

<template>
  <div>
    <!--    <div class="d-flex align-items-center">-->
    <!--        <span class="go__back" @click="backNavigation">-->
    <!--          <base-arrow-left :width="32" :height="32"></base-arrow-left>-->
    <!--        </span>-->
    <!--      <span class="breadcrumb__content">-->
    <!--          <span>-->
    <!--            {{ $t('payments.payment_list') }}-->
    <!--            <base-arrow-right :width="18" :height="18"/>-->
    <!--            <span>{{ order.contract }}</span>-->
    <!--          </span>-->
    <!--          <span class="head">-->
    <!--            {{ $t('payments.contract') }} <span class="contract__number">{{ order.contract }}</span>-->
    <!--          </span>-->
    <!--        </span>-->
    <!--    </div>-->

    <app-header>
      <template #header-title>
        {{ $t("roles_permission.titles.companies") }}
      </template>
      <template #header-actions>
        <app-dropdown :position-right="true" v-if="deleteCompanyPermission">
          <template #header>
            {{ $t("companies.actions") }}
          </template>
          <template #list>
            <b-dropdown-item
              v-if="deleteCompanyPermission"
              href="#"
              @click="deleteCompany"
            >
              <BaseDeleteIcon fill="#7C3AED" />
              {{ $t("companies.delete_company") }}
            </b-dropdown-item>
          </template>
        </app-dropdown>
      </template>
    </app-header>

    <CompanyInformation :companyId="companyId" />
    <hr />
    <div
      class="pt-4 d-flex flex-row flex-wrap justify-content-between align-items-center"
    >
      <h3 class="color-gray-700">{{ $t("companies.counted_payment") }}</h3>
      <BaseButton
        v-if="createPaymentPermission"
        class="bg-gray-150 color-gray-800 button"
        :text="$t('companies.addPayment')"
        @click="addPayment"
      >
        <template #left-icon>
          <BasePlusIcon fill="#7C3AED" />
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
      @update-company="getPaymentList"
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
  </div>
</template>

<style lang="scss" scoped>
hr {
  margin-top: -5px;
  background: #f3f4f6;
  border: 2px solid #f3f4f6;
}

::v-deep .ml-5 {
  display: flex;
  justify-content: flex-end;

  button {
    border: none !important;
    background: #7c3aed !important;
  }
}

::v-deep .my-dropdown .dropdown-toggle {
  -webkit-box-shadow: none;
  box-shadow: none;
  background-color: transparent;

  i {
    color: #4b5563;
  }
}

::v-deep .ml-5:hover {
  display: flex;
  justify-content: flex-end;

  button {
    border: none !important;
    background: #7c3aed !important;
  }
}

.payment__content {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-bottom: 6rem;
  margin-top: 50px;
}

h3 {
  font-family: CraftworkSans, serif;
  font-style: normal;
  font-weight: 900;
  font-size: 24px;
}
</style>
