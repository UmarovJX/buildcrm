<template>
  <main>
    <base-bread-crumb :active-content="activeContent" :bread-crumbs="breadCrumbs">
      <template #extra-content>
        <button
            v-if="permission.companies && permission.companies.create"
            class="btn btn-primary mr-0 mt-md-0"
            @click="addNewCompany"
        >
          <i class="fal fa-plus mr-2"></i>
          {{ $t("add") }}
        </button>
      </template>
    </base-bread-crumb>
    <companies-list
        :companies="companies"
        @delete-company="deleteCompany"
        @edit-selected-company="openEditingModal"
        @updated-company="updatedCompany"
    />
    <create-update-modal
        @updated-company="updatedCompany"
        @created-new-company="createdNewCompany"
        :history-edit-info="editedItem"
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
import BaseBreadCrumb from "@/components/BaseBreadCrumb";
import CreateUpdateModal from "./Components/CreateUpdateModal";
import CompaniesList from "@/components/Dashboard/Companies/Components/CompaniesList";
import {mapGetters} from "vuex";

export default {
  name: 'Companies',
  components: {
    CreateUpdateModal,
    CompaniesList,
    BaseBreadCrumb,
  },

  data() {
    return {
      loading: false,
      companies: [],
      editedItem: {},
      company_id: false,
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
      ]
    }
  },

  computed: {
    ...mapGetters({
      permission: 'getPermission'
    })
  },

  async created() {
    await this.fetchCompaniesList()
  },

  methods: {
    async fetchCompaniesList(showLoading = true) {
      if (showLoading)
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

    openEditingModal(item) {
      this.modalProperties = {
        title: this.$t('edit'),
        position: 'edit'
      }
      this.$bvModal.show('modal-create')
      this.editedItem = {...item}
    },

    addNewCompany() {
      this.modalProperties = {
        title: this.$t('companies.addPayment'),
        position: 'create'
      }
      this.$bvModal.show('modal-create')
    },

    createdNewCompany({message}) {
      this.fetchCompaniesList(false)
      this.$swal({
        title: this.$t("sweetAlert.success_create_company"),
        text: message,
        icon: "success",
        showCancelButton: false,
        confirmButtonText: this.$t("next"),
      })
    },

    updatedCompany({message}) {
      this.fetchCompaniesList(false)
      this.$swal({
        title: this.$t("sweetAlert.success_update_company"),
        text: message,
        icon: "success",
        showCancelButton: false,
        confirmButtonText: this.$t("next"),
      })
    },

    async deleteCompany(id) {
      await api.companies.deleteCompany(id)
          .then((response) => {
            const {message} = response.data
            this.fetchCompaniesList(false)
            this.$swal({
              title: this.$t("sweetAlert.success_delete_company"),
              text: message,
              icon: "success",
              showCancelButton: false,
              confirmButtonText: this.$t("next"),
            })
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
    }
  }
}
</script>

<style scoped lang="scss">
.loading__overlay {
  z-index: 2222;
  min-height: 80vh;
}
</style>
