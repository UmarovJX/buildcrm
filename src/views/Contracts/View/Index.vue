<template>
  <main class="main__class">
    <!--  Header Navigation  -->
    <div v-if="hasConstructorOrder" class="navigation__content justify-content-between">
      <div class="d-flex align-items-center">
        <span class="go__back" @click="backNavigation">
          <base-arrow-left :width="32" :height="32"></base-arrow-left>
        </span>
        <span class="breadcrumb__content">
          <span>
            {{ $t('payments.payment_list') }}
            <base-arrow-right :width="18" :height="18"/>
            <span>{{ order.contract }}</span>
          </span>
          <span class="head">
            {{ $t('payments.contract') }} <span class="contract__number">{{ order.contract }}</span>
          </span>
        </span>
      </div>
      <div>
        <b-dropdown right>
          <template #button-content>
            {{ $t('contracts.view.actions') }}
          </template>
          <b-dropdown-item href="#" @click="downloadContact">
            {{ $t('contracts.view.download_contract') }}
          </b-dropdown-item>
          <b-dropdown-item href="#" @click="deleteContact">
            {{ $t('contracts.view.cancel_contract') }}
          </b-dropdown-item>
        </b-dropdown>
      </div>
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
import TabPaymentSchedule from "@/components/Contracts/view/TabPaymentSchedule";
import TabObjectDetails from "@/components/Contracts/view/TabObjectDetails";
import TabClientDetails from "@/components/Contracts/view/TabClientDetails";
import TabContractDetails from "@/components/Contracts/view/TabContractDetails";
import BaseButton from "@/components/Reusable/BaseButton";

export default {
  name: "ContractView",
  components: {
    BaseArrowRight,
    BaseFilterTabsContent,
    BaseArrowLeft,
    TabPaymentSchedule,
    TabObjectDetails,
    TabClientDetails,
    TabContractDetails,
    BaseLoading,
    BaseButton
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
    async downloadContact() {
      const {id} = this.$route.params
      await api.contract.downloadContract(id)
          .then(({data, headers}) => {
            const filename = headers.hasOwnProperty('x-filename') ? headers['x-filename'] : 'contract'
            const fileURL = window.URL.createObjectURL(new Blob([data]))
            const fileLink = document.createElement('a')
            fileLink.href = fileURL
            fileLink.setAttribute('download', filename)
            document.body.appendChild(fileLink)
            fileLink.click()
          })
          .catch(() => {
            return '#'
          })
    },
    async deleteContact() {
      const {id} = this.$route.params
      this.showLoading = true
      await api.contractV2.deleteContract(id)
          .then(() => {
            this.$router.push({
              name: 'contracts'
            })
            this.$swal({
              title: this.$t('successfully'),
              icon: "success",
              button: this.$t('yes')
            })
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.showLoading = false
          })
    },
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


::v-deep {
  .b-dropdown .btn:not(.dropdown-item), .btn-secondary:not(.dropdown-item) {
    font-family: Inter, serif;
    padding: 1rem 1rem 1rem 1.5rem !important;
    height: 56px;
    font-weight: 600 !important;
    line-height: 22px !important;
    border-radius: 2rem !important;
    color: var(--gray-600) !important;
    font-size: 1rem !important;
    border: none !important;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: var(--gray-200) !important;
    margin: 0 !important;
  }

  .dropdown-toggle::after {
    border: none;
    width: 24px;
    height: 24px;
    display: flex;
    margin-left: 1rem;
    background: url("../../../assets/icons/icon-down.svg");
    transition: all .2s ease-in-out;
  }

  .show .dropdown-toggle::after {
    transform: rotate(-180deg);
  }


  .dropdown-menu {
    border: 1px solid var(--gray-200);
    box-sizing: border-box;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.08);
    border-radius: 24px;
    padding: .5rem;


    .dropdown-item {
      font-weight: 600 !important;
      font-size: 16px !important;
      line-height: 22px !important;
      border-radius: 1rem;
      padding: 12px 17px;
      min-width: 256px;

      &:hover {
        background-color: var(--gray-200);
      }
    }
  }
}

</style>