<template>
  <main>
    <div class="app-content">
      <div
        class="d-flex justify-content-between align-items-center flex-md-row flex-column"
      >
        <div
          class="d-flex w-100 align-items-center flex-md-row flex-column mb-0"
        >
          <h1 class="title__big my-0">
            {{ $t("companies.title") }}
          </h1>
          <ul class="breadcrumb ml-md-4 ml-md-3 mb-0 mb-md-0">
            <li class="breadcrumb-item">
              <router-link :to="{name: 'home'}">
                <i class="far fa-home"></i>
              </router-link>
            </li>

            <li class="breadcrumb-item">
              <a href="#">
                {{ $t("companies.title") }}
              </a>
            </li>
            <li class="breadcrumb-item active">
              {{ $t("list") }}
            </li>
          </ul>
        </div>

        <b-link
          v-if="getPermission.companies.create"
          class="btn btn-primary mr-0"
          v-b-modal.modal-create
        >
          <i class="fal fa-plus mr-2"></i>
          {{ $t("add") }}
        </b-link>
      </div>

      <div class="mt-2">
        <b-table
          sticky-header
          borderless
          responsive
          :items="getCompanies"
          :fields="fields"
          :busy="getLoading"
          show-empty
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          sort-icon-left
          class="custom-table"
          :empty-text="$t('no_data')"
        >
          <template #empty="scope" class="text-center">
            <span class="d-flex justify-content-center align-items-center">{{
              scope.emptyText
            }}</span>
          </template>

          <template #table-busy>
            <div class="d-flex justify-content-center w-100">
              <div class="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </template>

          <template #cell(name)="data">
            {{ getName(data.item.type.name) }} «{{ data.item.name }}»
          </template>

          <template #cell(actions)="data">
            <div class="d-flex justify-content-center">
              <div class="dropdown my-dropdown dropleft">
                <button
                  type="button"
                  class="dropdown-toggle"
                  data-toggle="dropdown"
                >
                  <i class="far fa-ellipsis-h"></i>
                </button>

                <div class="dropdown-menu">
                  <b-button
                    v-if="getPermission.companies.update"
                    @click="EditBranch(data.item)"
                    class="dropdown-item dropdown-item--inside"
                    v-b-modal.modal-update
                  >
                    <i class="fas fa-edit"></i>
                    {{ $t("edit") }}
                  </b-button>

                  <!--                                    <b-button v-if="getPermission.users.delete" class="dropdown-item dropdown-item&#45;&#45;inside">-->
                  <!--                                        <i class="fas fa-trash"></i>-->
                  <!--                                        {{ $t('delete') }}-->
                  <!--                                    </b-button>-->
                </div>
              </div>
            </div>
          </template>
        </b-table>
      </div>

      <Create @CreateCompany="CreateCompany"></Create>
      <Update :branch-id="company_id" @UpdateCompany="UpdateCompany"></Update>
    </div>

    <b-overlay :show="loading" no-wrap opacity="0.5" style="z-index: 2222">
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
import {mapGetters, mapActions} from "vuex";

import Create from "./Components/CreateModal";
import Update from "./Components/UpdateModal";

export default {
  components: {
    Create,
    Update,
  },

  data() {
    return {
      company_id: false,

      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },

      sortBy: "id",
      sortDesc: false,
      fields: [
        {
          key: "id",
          label: "#",
        },
        {
          key: "name",
          label: this.$t("companies.name"),
        },
        {
          key: "payment_account",
          label: this.$t("companies.payment_account"),
        },
        {
          key: "phone",
          label: this.$t("companies.phone"),
          formatter: (value) => "+" + value,
        },
        {
          key: "inn",
          label: this.$t("companies.inn"),
        },
        {
          key: "mfo",
          label: this.$t("companies.mfo"),
        },
        {
          key: "actions",
          label: "",
        },
      ],

      loading: false,
    };
  },

  computed: mapGetters(["getPermission", "getCompanies", "getLoading"]),

  mounted() {
    this.fetchCompanies(this);
  },

  methods: {
    ...mapActions(["fetchCompanies", "fetchBranch"]),

    EditBranch(branch) {
      this.loading = true;
      this.company_id = branch.id;
      this.fetchBranch(this).then(() => {
        this.loading = false;
        this.$bvModal.show("modal-update");
      });
    },

    getName(name) {
      let locale = localStorage.locale;
      let value = "";

      if (locale) {
        switch (locale) {
          case "ru":
            value = name.ru;
            break;
          case "uz":
            value = name.uz;
            break;
        }
      } else {
        value = name.ru;
      }

      return value;
    },

    CreateCompany() {
      this.loading = true;
      this.fetchCompanies(this).then(() => {
        this.loading = false;
      });
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

<style scoped></style>
