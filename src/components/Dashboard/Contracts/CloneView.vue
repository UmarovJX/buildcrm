<template>
  <main class="main__class">
    <!--  Header Navigation  -->
    <div v-if="hasConstructorOrder" class="navigation__content">
      <span class="go__back" @click="backNavigation">
        <base-arrow-left :width="32" :height="32"></base-arrow-left>
      </span>
      <span class="breadcrumb__content">
        <span>
          Список договоров
          <base-arrow-right/>
          <span>{{ order.contract }}</span>
        </span>
        <span class="head">
          Договор <span class="contract__number">{{ order.contract }}</span>
        </span>
      </span>
    </div>
    <!--  Tabs  -->
    <base-filter-tabs-content
        :filter-tab-list="filterTabList"
        @get-new-content="changeTabOrder"
    />
    <component
        :is="activeTab"
        :order="order"
        :has-constructor-order="hasConstructorOrder"
    >
    </component>
    <base-loading-content :loading="showLoading"/>
  </main>
</template>

<script>
import api from "@/services/api";
import BaseLoadingContent from "@/components/BaseLoadingContent";
import BaseArrowRight from "@/components/icons/BaseArrowRightIcon";
import BaseFilterTabsContent from "@/components/Reusable/BaseFilterTabsContent";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";
import TabPaymentSchedule from "@/components/Dashboard/Contracts/components/TabPaymentSchedule";
import TabObjectDetails from "@/components/Dashboard/Contracts/components/TabObjectDetails";
import TabClientDetails from "@/components/Dashboard/Contracts/components/TabClientDetails";
import TabContractDetails from "@/components/Dashboard/Contracts/components/TabContractDetails";

export default {
  name: "CloneView",
  components: {
    BaseArrowRight,
    BaseLoadingContent,
    BaseFilterTabsContent,
    BaseArrowLeft,
    TabPaymentSchedule,
    TabObjectDetails,
    TabClientDetails,
    TabContractDetails
  },
  data() {
    return {
      order: {},
      showLoading: false,
      activeTab: 'TabPaymentSchedule',
      tabs: ['TabPaymentSchedule', 'TabObjectDetails', 'TabClientDetails', 'TabContractDetails']
    }
  },
  computed: {
    filterTabList() {
      return [
        {
          name: this.$t('payment_schedule'),
          status: 0
        },
        {
          name: this.$t('object_details'),
          status: 1
        },
        {
          name: this.$t('client_details'),
          status: 2
        },
        {
          name: this.$t('contract_details'),
          status: 3
        }
      ]
    },
    hasConstructorOrder() {
      return Object.keys(this.order).length > 0
    },
  },
  async created() {
    await this.fetchContractData()
  },
  methods: {
    async fetchContractData() {
      this.showLoading = true
      const {id} = this.$route.params
      await api.contract.fetchContract(id)
          .then((response) => {
            this.order = response.data
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.showLoading = false
          })
    },
    backNavigation() {
      this.$router.go(-1)
    },
    changeTabOrder(status) {
      this.activeTab = this.tabs[status]
    }
  }
}
</script>

<style lang="scss" scoped>
.main__class {
  background-color: white;
  padding: 3rem;
  min-height: 100vh;
  color: var(--gray-600);
}

.navigation__content {
  display: flex;
  align-items: center;
  margin-bottom: 52px;

  .go__back {
    width: 56px;
    height: 56px;
    border-radius: 100%;
    background-color: var(--gray-100);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .breadcrumb__content {
    display: inline-flex;
    flex-direction: column;
    margin-left: 1rem;
    font-weight: 600;
    font-size: 14px;
    color: #9CA3AF;
  }

  .head {
    font-size: 24px;
    line-height: 28px;
    color: #4B5563;

    .contract__number {
      color: var(--violet-600);
    }
  }
}
</style>