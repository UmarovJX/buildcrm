<template>
  <main>
    <div class="app-content">

      <!--   Add New Contract    -->
      <div class="d-flex justify-content-end">
        <b-button
            v-b-modal.creation-content
            class="button__new__contract"
            variant="primary"
        >
          <i class="fal fa-plus mr-2"></i>
          {{ $t("add") }}
        </b-button>
      </div>

      <!--   Contract List    -->
      <b-card no-body class="mt-3">
        <b-tabs v-model="contractTabs" pills card active-nav-item-class="active__contract__tab">
          <b-tab :title="$t('objects.sale')">
            <base-contract-list-table @update-content="getDealTemplateList" :contracts="saleContracts"/>
          </b-tab>
          <b-tab :title="$t('reservation')">
            <base-contract-list-table @update-content="getDealTemplateList" :contracts="reserveContracts"/>
          </b-tab>
          <!--          <b-tab :title="$t('free_of_charge')">-->
          <!--            <base-contract-list-table :contracts="notInitialContracts"/>-->
          <!--          </b-tab>-->
        </b-tabs>
      </b-card>

    </div>

    <!-- Creation Modal   -->
    <create-deal-docs-template @update-content="updateContent"/>

    <!--  Loading Content  -->
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
import api from "@/services/api";
import CreateDealDocsTemplate from "@/components/Dashboard/Objects/Components/Deals/CreateDealDocsTemplate";
import BaseContractListTable from "@/components/Dashboard/Objects/Components/BaseContractListTable";

export default {
  name: 'DealDocsTemplate',
  components: {
    CreateDealDocsTemplate,
    BaseContractListTable
  },
  data() {
    return {
      loading: false,
      contracts: [],
      contractTabs: 0
    }
  },
  computed: {
    saleContracts() {
      return this.contracts.filter(contract => {
        return contract.category === 'sale' || contract.category === 'not_initial'
      })
    },
    notInitialContracts() {
      return this.contracts.filter(contract => {
        return contract.category === 'not_initial'
      })
    },
    reserveContracts() {
      return this.contracts.filter(contract => {
        return contract.category === 'reserve'
      })
    }
  },
  async created() {
    await this.getDealTemplateList()
  },
  methods: {
    updateContent({category}) {
      if (category === 'sale')
        this.contractTabs = 0
      else if (category === 'reserve')
        this.contractTabs = 1
      else if (category === 'not_initial')
        this.contractTabs = 2

      this.getDealTemplateList()
    },
    async getDealTemplateList() {
      this.loading = true
      const {id} = this.$route.params
      await api.objects.getDealTemplateList(id)
          .then((response) => {
            this.contracts = response.data
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

<style lang="scss">
.button__new__contract {
  margin-right: 0;
}

.active__contract__tab {
  background-color: #7367f0 !important;
}
</style>