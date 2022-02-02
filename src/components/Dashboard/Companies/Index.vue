<template>
  <main>
    <base-bread-crumb :active-content="activeContent" :bread-crumbs="breadCrumbs">
      <template #extra-content>
        <button
            class="btn btn-primary mr-0 mt-md-0"
            v-b-modal.modal-create
        >
          <i class="fal fa-plus mr-2"></i>
          {{ $t("add") }}
        </button>
      </template>
    </base-bread-crumb>
    <companies-list :companies="companies"/>
    <create @created-new-company="createCompany"/>

    <!--    <div class="app-content">-->
    <!--            <Update :branch-id="company_id" @UpdateCompany="UpdateCompany"></Update>-->
    <!--    </div>-->

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
import {mapActions} from "vuex";
import Create from "./Components/CreateModal";
// import Update from "./Components/UpdateModal"
import BaseBreadCrumb from "@/components/BaseBreadCrumb";
import CompaniesList from "@/components/Dashboard/Companies/Components/CompaniesList";
import api from "@/services/api";

export default {
  name: 'Companies',
  components: {
    Create,
    // Update,
    CompaniesList,
    BaseBreadCrumb,
  },

  data() {
    return {
      companies: [],
      activeContent: this.$t('list'),
      breadCrumbs: [
        {
          routeName: this.$route.name,
          textContent: this.$t('companies.title')
        }
      ],
      company_id: false,
      loading: false,
      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        }
      },
    }
  },

  async created() {
    await this.fetchCompaniesList()
  },

  methods: {
    ...mapActions(["fetchBranch"]),
    async fetchCompaniesList(showLoading = true) {
      if(showLoading)
        this.loading = true
      await api.companies.getCompaniesList()
          .then((response) => {
            this.companies = response.data
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.loading = false
          })
    },

    createCompany({message}) {
      this.fetchCompaniesList(false)
      this.$swal({
        title: this.$t("sweetAlert.success_create_company"),
        text: message,
        icon: "success",
        showCancelButton: false,
        confirmButtonText: this.$t("next"),
      })
    },

    UpdateCompany() {
      this.loading = true;
      this.fetchCompanies(this).then(() => {
        this.$bvModal.hide("modal-update");
        this.loading = false;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.loading__overlay{
  z-index: 2222;
  min-height: 80vh;
}
</style>
