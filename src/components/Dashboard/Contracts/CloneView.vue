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
          <base-arrow-right :width="18" :height="18"/>
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
        v-show="!showLoading"
        @start-loading="startLoading"
        @finish-loading="finishLoading"
        @refresh-details="refreshDetails"
    >
    </component>
    <base-loading v-if="showLoading"/>
  </main>
</template>

<script>
import api from "@/services/api";
import BaseLoading from "@/components/Reusable/BaseLoading";
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
    BaseFilterTabsContent,
    BaseArrowLeft,
    TabPaymentSchedule,
    TabObjectDetails,
    TabClientDetails,
    TabContractDetails,
    BaseLoading
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
      const list = [
        {
          name: this.$t('payment_schedule'),
        },
        {
          name: this.$t('object_details'),
        },
        {
          name: this.$t('client_details'),
        },
        {
          name: this.$t('contract_details'),
        }
      ]

      const {status} = this.order
      if (status === 'booked') {
        return list.slice(1).map((ls, index) => ({...ls, status: index}))
      }
      return list.map((ls, index) => ({...ls, status: index}))
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
      await api.contractV2.fetchContractView(id)
          .then((response) => {
            this.order = response.data
            this.tabsConfiguration()
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.showLoading = false
          })
    },
    tabsConfiguration() {
      const {status} = this.order
      if (status === 'booked') {
        this.activeTab = 'TabObjectDetails'
        this.tabs = this.tabs.filter(tab => tab !== 'TabPaymentSchedule')
      }
    },
    startLoading() {
      this.showLoading = true
    },
    finishLoading() {
      this.showLoading = false
    },
    backNavigation() {
      this.$router.go(-1)
    },
    changeTabOrder(status) {
      this.activeTab = this.tabs[status]
    },
    refreshDetails() {
      this.fetchContractData()
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  font-family: Inter, serif;
  font-style: normal;
  line-height: 22px;
  color: var(--gray-600);
  font-weight: 600;
}

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