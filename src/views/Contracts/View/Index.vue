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
          <b-dropdown-item href="#" @click="openPaymentDeletionModal">
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

    <!-- WARNING BEFORE DELETE CONTRACT -->
    <base-modal ref="payment-deletion-warning">
      <template #header>
          <span class="warning__before__delete-head">
            <span>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.4"
                      d="M51.3346 27.9996C51.3346 40.8889 40.8883 51.3329 28.0013 51.3329C15.1143 51.3329 4.66797 40.8889 4.66797 27.9996C4.66797 15.1149 15.1143 4.66626 28.0013 4.66626C40.8883 4.66626 51.3346 15.1149 51.3346 27.9996"
                      fill="#EF4444"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M30.3081 29.5574C30.3081 30.7612 29.2661 31.7427 27.988 31.7427C26.71 31.7427 25.668 30.7612 25.668 29.5574V18.5185C25.668 17.3148 26.71 16.3333 27.988 16.3333C29.2661 16.3333 30.3081 17.3148 30.3081 18.5185V29.5574ZM25.6811 37.4814C25.6811 36.2776 26.7178 35.2961 27.9879 35.2961C29.2951 35.2961 30.3345 36.2776 30.3345 37.4814C30.3345 38.6852 29.2951 39.6667 28.0144 39.6667C26.7284 39.6667 25.6811 38.6852 25.6811 37.4814Z"
                      fill="#EF4444"/>
              </svg>
            </span>
            <span class="title">{{ $t('contracts.warning') }}</span>
          </span>
      </template>

      <template #main>
          <span class="warning__before__delete-main">
            {{ $t('contracts.warn_before_delete_contract') }}
          </span>
      </template>

      <template #footer>
        <div class="d-flex justify-content-between align-items-center warning__before__delete-footer">
          <base-button
              @click="closePaymentDeletionModal"
              :text="`${ $t('no_cancel') }`"
          >
          </base-button>
          <base-button
              @click="deleteContact"
              :text="`${ $t('yes_delete') }`"
              class="add__button"
          >
          </base-button>
        </div>
      </template>
    </base-modal>
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
import BaseModal from "@/components/Reusable/BaseModal";
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
    BaseModal,
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
    openPaymentDeletionModal() {
      this.$refs['payment-deletion-warning'].openModal()
    },
    closePaymentDeletionModal() {
      this.$refs['payment-deletion-warning'].closeModal()
    },
    async deleteContact() {
      const {id} = this.$route.params
      this.showLoading = true
      this.closePaymentDeletionModal()
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

.warning__before__delete {
  &-head {
    display: flex;
    align-items: center;

    .title {
      font-size: 2.25rem;
      line-height: 42px;
    }
  }

  &-main {
    display: block;
    max-width: 60%;
    font-family: Inter, sans-serif;
    color: var(--gray-600);
    margin-left: 0.5rem;
  }

  &-footer {
    gap: 2rem;

    button {
      flex-grow: 1;
    }
  }
}
</style>