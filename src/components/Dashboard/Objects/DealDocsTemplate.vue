<script>
import { mapGetters } from "vuex";
import api from "@/services/api";
import TemplatesPermission from "@/permission/templates";
import InstructionsModal from "@/components/Dashboard/Objects/Components/DealDocsTemplate/InstructionsModal";
import BaseContractListTable from "@/components/Dashboard/Objects/Components/BaseContractListTable";
import CreateDealDocsTemplate from "@/components/Dashboard/Objects/Components/Deals/CreateDealDocsTemplate";
import AppHeader from "@/components/Header/AppHeader";
import { v3ServiceApi } from "@/services/v3/v3.service";

export default {
  name: "DealDocsTemplate",
  components: {
    AppHeader,
    InstructionsModal,
    BaseContractListTable,
    CreateDealDocsTemplate,
  },
  data() {
    return {
      instructionPermission: TemplatesPermission.getInstructionViewPermission(),
      createPermission: TemplatesPermission.getTemplatesCreatePermission(),
      loading: false,
      contracts: [],
      contractTabs: 0,
      objectName: "",
      breadCrumbs: [
        {
          route: {
            name: "object-deal-template",
          },
          content: {
            type: "i18n",
            path: "objects.deal_template.name",
          },
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      permission: "getPermission",
    }),
    activeContent() {
      return this.$t("objects.deal_template.title");
    },
    saleContracts() {
      return this.contracts.filter(
        (contract) =>
          contract.category === "sale" ||
          contract.category === "not_initial" ||
          contract.category === "not_initial"
      );
    },
    notInitialContracts() {
      return this.contracts.filter(
        (contract) => contract.category === "not_initial"
      );
    },
    reserveContracts() {
      return this.contracts.filter(
        (contract) => contract.category === "reserve"
      );
    },
    reissueContracts() {
      return this.contracts.filter(
        (contract) => contract.category === "reissue"
      );
    },
    parkingContracts() {
      return this.contracts.filter(
        (contract) => contract.category === "parking"
      );
    },
    additionalContracts() {
      return this.contracts.filter(
        (contract) => contract.category === "additional"
      );
    },
  },
  async created() {
    await this.getDealTemplateList();
  },
  methods: {
    updateLoading(loadingValue) {
      this.loading = loadingValue;
    },
    updateContent({ category }) {
      if (category === "sale") this.contractTabs = 0;
      else if (category === "reserve") this.contractTabs = 1;
      else if (category === "not_initial") this.contractTabs = 2;
      else if (category === "reissue") {
        this.contractTabs = 3;
      }

      this.getDealTemplateList();
    },
    async getDealTemplateList() {
      this.loading = true;
      const { id } = this.$route.params;
      await v3ServiceApi.templates
        .getDealTemplateList(id)
        .then((response) => {
          this.contracts = response.data.data;
          const objectCrumb = {
            route: {
              name: "apartments",
              params: {
                object: this.$route.params.id,
              },
            },
            content: {
              type: "string",
              path: response.data.object_name,
            },
          };
          const hasApartmentLink = this.breadCrumbs.findIndex(
            (breadcrumb) => breadcrumb.routeName === "apartments"
          );
          if (hasApartmentLink === -1) {
            this.breadCrumbs.unshift(objectCrumb);
          }
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<template>
  <div>
    <div>
      <app-header>
        <!--        <template #header-breadcrumb>-->
        <!--          <app-breadcrumb-->
        <!--              page="objects.deal_template.title"-->
        <!--              page-info="objects.deal_template.name"-->
        <!--          />-->
        <!--        </template>-->

        <template #header-title>
          {{ $t("objects.deal_template.name") }}
        </template>

        <template #header-actions>
          <b-button
            v-if="instructionPermission"
            v-b-modal.instructions-content
            class="button__new__contract"
            variant="info"
          >
            <i class="far fa-info-circle mr-2" />
            <span>{{ $t("instruction") }}</span>
          </b-button>
          <b-button
            v-if="createPermission"
            v-b-modal.creation-content
            class="button__new__contract"
            variant="primary"
          >
            <i class="fal fa-plus mr-2" />
            {{ $t("add") }}
          </b-button>
        </template>
      </app-header>

      <!--   Contract List    -->
      <b-card no-body class="mt-3">
        <b-tabs
          v-model="contractTabs"
          pills
          card
          active-nav-item-class="active__contract__tab"
        >
          <b-tab :title="$t('objects.sale')">
            <base-contract-list-table
              :contracts="saleContracts"
              type="sale"
              @update-loading="updateLoading"
              @update-content="getDealTemplateList"
            />
          </b-tab>
          <b-tab :title="$t('reservation')">
            <base-contract-list-table
              :contracts="reserveContracts"
              type="reservation"
              @update-loading="updateLoading"
              @update-content="getDealTemplateList"
            />
          </b-tab>
          <b-tab :title="$t('contract_regeneration')">
            <base-contract-list-table
              :contracts="reissueContracts"
              type="reissue"
              @update-loading="updateLoading"
              @update-content="getDealTemplateList"
            />
          </b-tab>
          <b-tab :title="$t('parking')">
            <base-contract-list-table
              :contracts="parkingContracts"
              type="parking"
              @update-loading="updateLoading"
              @update-content="getDealTemplateList"
            />
          </b-tab>
          <b-tab :title="$t('additional')">
            <base-contract-list-table
              :contracts="additionalContracts"
              type="additional"
              @update-loading="updateLoading"
              @update-content="getDealTemplateList"
            />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>

    <!-- Creation Modal   -->
    <create-deal-docs-template @update-content="updateContent" />

    <!--  Instructions Modal  -->
    <instructions-modal />

    <!--  XLoadingWrapper Content  -->
    <b-overlay :show="loading" no-wrap opacity="0.5" style="z-index: 2222">
      <template #overlay>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<style lang="scss">
.button__new__contract {
  margin-right: 0;
  margin-top: 0 !important;
}

.active__contract__tab {
  background-color: #7367f0 !important;
}
</style>
