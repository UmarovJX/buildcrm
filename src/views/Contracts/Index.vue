<template>
  <main class="main__content">
    <!--  Tabs  -->
    <base-filter-tabs-content
        :filter-tab-list="filterTabList"
        @get-new-content="fetchContentByStatus"
    />

    <!--  Search Content  -->
    <search-bar-content
        @trigger-input="setSearchValue"
        @search-by-filter="searchQueryFilter"
        @replace-router="searchQueryFilter"
    />

    <!--  Table List -->
    <b-table
        sticky-header
        borderless
        responsive
        :busy="showLoading"
        :items="tableItems"
        :fields="tableFields"
        @row-clicked="contractView"
        class="table__list"
        :empty-text="$t('no_data')"
        thead-tr-class="row__head__bottom-border"
        tbody-tr-class="row__body__bottom-border cursor-pointer"
        show-empty
        sort-icon-left
    >
      <!--   Checkbox Head    -->
      <!--
        <template #head(checkbox)="data">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="14" height="14" rx="3" stroke="#9CA3AF" stroke-width="2"/>
          </svg>
        </template>
      -->

      <!--   Checkbox  Body   -->
      <!--
       <template #cell(checkbox)="data">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="14" height="14" rx="3" stroke="#9CA3AF" stroke-width="2"/>
        </svg>
      </template>
      -->

      <!--   Phone Number   -->
      <template #cell(phone)="data">
        <span class="phone-col">{{ formattingPhone(data.item.client.phone) }}</span>
      </template>

      <!--   Date   -->
      <template #cell(date)="data">
        <span>{{ dateReverser(data.item.created_at) }}</span>
      </template>

      <!--   Client LFP   -->
      <template #cell(client)="{ item }">
        <span class="d-flex">
          <span v-if="item.client.friends" class="friends__mark">
            <base-star-icon :width="14" :height="14" fill="#7C3AED"/>
          </span>
          <span>{{ getClientName(item.client) }}</span>
        </span>
      </template>

      <!--   Status   -->
      <template #cell(status)="{ item }">
        <span class="current__status" :class="item.status">
          {{ $t(`contracts.status.${item.status}`) }}
        </span>
      </template>


      <!--  Actions    -->
      <template #cell(actions)="data">
          <span class="arrow__down-violet">
            <base-arrow-down-icon class="download__icon" :width="20" :height="20" fill="#fff"/>
          </span>
      </template>

      <!--  Busy Animation    -->
      <template #table-busy>
        <base-loading/>
      </template>

      <template #empty="scope" class="text-center">
        <div class="d-flex justify-content-center align-items-center flex-column not__found">
          <p class="head">Договоры не были найдены</p>
          <p>Попробуйте ввести другие данные для поиска</p>
        </div>
      </template>
    </b-table>

    <div v-if="!showLoading && countOfItems" class="pagination__vue">
      <!--   Pagination   -->
      <vue-paginate
          :page-count="pagination.total"
          :value="pagination.current"
          :container-class="'container'"
          :page-class="'page-item'"
          :page-link-class="'page-link'"
          :next-class="'page-item'"
          :prev-class="'page-item'"
          :prev-link-class="'page-link'"
          :next-link-class="'page-link'"
          @change-page="changeCurrentPage"
      >
        <template #next-content>
          <span class="d-flex align-items-center justify-content-center">
            <base-arrow-right-icon/>
          </span>
        </template>

        <template #prev-content>
          <span class="d-flex align-items-center justify-content-center">
            <base-arrow-left-icon/>
          </span>
        </template>
      </vue-paginate>

      <!--  Show By Select    -->
      <div class="show__by">
        <span class="show__by__content">
          <span class="description">{{ $t('contracts.show_by') }}:</span>
          <b-form-select
              @input="limitChanged"
              v-model="showByValue"
              :options="showByOptions"
          ></b-form-select>
          <span class="arrow__down">
            <base-down-icon/>
          </span>
        </span>
      </div>
    </div>
  </main>
</template>

<script>
import BaseFilterTabsContent from "@/components/Reusable/BaseFilterTabsContent";
import SearchBarContent from "@/components/Contracts/SearchBarContent";
import BaseArrowDownIcon from "@/components/icons/BaseArrowDownIcon";
import BaseStarIcon from "@/components/icons/BaseStarIcon";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseDownIcon from "@/components/icons/BaseDownIcon";
import BaseLoading from "@/components/Reusable/BaseLoading";
import api from "@/services/api";
import {
  formatDateWithDot,
  formatToPrice,
  phonePrettier,
  sortObjectValues
} from "@/util/reusable";

export default {
  name: "Contracts",
  components: {
    BaseFilterTabsContent,
    BaseArrowDownIcon,
    SearchBarContent,
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
    BaseStarIcon,
    BaseDownIcon,
    BaseLoading
  },
  data() {
    const showByOptions = []

    for (let number = 10; number <= 50; number += 10) {
      showByOptions.push({
        value: number,
        text: number
      })
    }

    const filterTabList = [
      {
        name: 'tab_status.all',
        status: '',
        counts: 0
      },
      {
        name: 'tab_status.booked',
        status: 'booked',
        counts: 0
      },
      {
        name: 'tab_status.sold',
        status: 'contract',
        counts: 0
      },
      {
        name: 'tab_status.on_payment',
        status: 'sold',
        counts: 0
      },
      {
        name: 'tab_status.closed',
        status: 'closed',
        counts: 0
      }
    ]

    let {search: searchValue, limit: showByValue} = this.$route.query

    if (!showByValue) {
      showByValue = 20
    }

    return {
      showByValue,
      searchValue,
      showByOptions,
      filterTabList,
      tableItems: [],
      pagination: {},
      showLoading: false,
      selectMode: 'single',
      selectable: true,
      counts: {}
    }
  },
  computed: {
    tableFields() {
      return [
        /*
          {
            key: "checkbox",
            label: "",
          },
        */
        {
          key: "contract",
          label: this.$t("contracts.table.contract"),
        },
        {
          key: "client",
          label: this.$t("contracts.table.client")
        },
        {
          key: "phone",
          label: this.$t("contracts.table.phone_number")
        },
        {
          key: "status",
          label: this.$t("contracts.table.status"),
        },
        {
          key: "payments.transaction_price",
          label: this.$t("contracts.table.cost"),
          formatter: (price) => formatToPrice(price) + ' ' + this.$t('ye')
        },
        {
          key: "object",
          label: this.$t("contracts.table.object"),
          formatter: (object) => object.name
        },
        {
          key: "date",
          label: this.$t("contracts.table.date"),
        },
        {
          key: "actions",
          label: '',
        }
      ]
    },
    query() {
      return Object.assign({}, this.$route.query)
    },
    countOfItems() {
      return this.tableItems.length
    }
  },
  watch: {
    '$route.query': {
      handler: function () {
        this.fetchContractList()
      },
      deep: true
    },
    searchValue() {
      this.getContractListBySearch()
    }
  },
  async created() {
    await this.fetchContractList()
  },
  methods: {
    formattingPhone: (phone) => phonePrettier(phone),
    dateReverser: (time) => formatDateWithDot(time),
    limitChanged() {
      this.changeFetchLimit()
    },
    downloadContractLink(id) {
      api.contract.downloadContract(id)
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
    getClientName(client) {
      let language = 'kirill'
      if (this.$i18n.locale === 'uz') {
        language = 'lotin'
      }
      const {last_name, first_name, second_name} = client
      return this.clientName(last_name, language) + ' ' + this.clientName(first_name, language) + ' ' + this.clientName(second_name, language)
    },
    contractView({id}, index, event) {
      const clickedDownloadBtn = event.target.classList.contains('download__icon')
      if (clickedDownloadBtn) {
        this.downloadContractLink(id)
      } else {
        this.$router.push({
          name: 'contracts-view',
          params: {
            id
          }
        })
      }
    },
    clientName(multiName, language) {
      const lastNameByLang = multiName[language]
      if (lastNameByLang) {
        return lastNameByLang
      } else {
        const lastNameOtherLang = language === 'kirill' ? multiName['lotin'] : multiName['kirill']
        if (lastNameOtherLang) return lastNameOtherLang
      }

      return ''
    },
    fetchContentByStatus(status) {
      const query = Object.assign({}, this.query)
      if (query.hasOwnProperty('page')) {
        delete query.page
      }
      this.replaceRouter({...query, status})
    },
    changeCurrentPage(page) {
      const currentPage = this.query.page
      if (page === currentPage) return
      this.replaceRouter({...this.query, page})
    },
    changeFetchLimit() {
      const query = {
        ...this.query, page: 1
      }
      const limit = this.showByValue
      this.replaceRouter({...query, limit})
    },
    setSearchValue(search) {
      const hasSearchQuery = this.query.hasOwnProperty('search')
      if (search?.length < 3 && hasSearchQuery) {
        this.replaceRouter({})
      }

      if (this.searchValue === search || search.length < 3) return
      this.searchValue = search
    },
    getContractListBySearch() {
      const {query, searchValue} = this
      const hasSearchQuery = query.hasOwnProperty('search')
      if (!hasSearchQuery) {
        this.pushRouter({
          search: searchValue
        })
        return
      }

      query.search = searchValue
      this.pushRouter(query)
    },
    async fetchContractList() {
      const query = sortObjectValues(this.query)

      if (query.hasOwnProperty('object_id') && typeof query.object_id === 'string') {
        query.object_id = [query.object_id]
      }

      this.showLoading = true
      await api.contractV2.fetchContractsList(query)
          .then((response) => {
            this.tableItems = response.data.items
            this.pagination = response.data.pagination
            this.counts = response.data.counts
            this.showByValue = response.data.pagination.perPage
            this.initCounts()
          })
          .finally(() => {
            this.showLoading = false
          })
    },
    initCounts() {
      this.filterTabList = this.filterTabList.map(filterTab => {
        const findIndex = this.counts.hasOwnProperty(filterTab.status)
        if (findIndex) {
          return {
            ...filterTab,
            counts: this.counts[filterTab.status]
          }
        }

        const sum = () => {
          let init = 0
          for (let [, value] of Object.entries(this.counts)) {
            init += value
          }
          return init
        }

        if (filterTab.status === '') {
          return {
            ...filterTab,
            counts: sum()
          }
        }
      })
    },
    searchQueryFilter(searchQuery) {
      const hasQueryStatus = this.query.hasOwnProperty('status')
      if (hasQueryStatus) {
        const {status} = this.query
        this.pushRouter({
          ...searchQuery,
          status
        })
        return
      }

      this.pushRouter(searchQuery)
    },
    replaceRouter(query) {
      const sortQuery = sortObjectValues(query)
      this.$router.replace({query: sortQuery})
    },
    pushRouter(query) {
      const sortQuery = sortObjectValues(query)
      this.$router.push({query: {}})
      this.$router.push({query: sortQuery})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/utils/pagination";

* {
  font-family: Inter, serif;
  font-style: normal;
  line-height: 22px;
  color: var(--gray-600);
  font-weight: 600;
}

.main__content {
  background-color: #ffffff;
  padding-bottom: 20rem;
  padding-top: 1rem;
}

::v-deep .table__list {
  max-height: none;

  table {
    color: var(--gray-600);

    thead tr th {
      font-family: CraftworkSans, serif;
      font-weight: 600;
      line-height: 14px;
      letter-spacing: 1px;
      color: var(--gray-400) !important;
      padding: 1.25rem 1rem;
    }

    td {
      vertical-align: middle;
    }
  }

  .table.b-table[aria-busy=true] {
    opacity: 1 !important;
  }
}

.phone-col {
  display: flex;
  width: max-content;
}

.arrow__down-violet {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  padding: 8px;
  background-color: var(--violet-600);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: var(--violet-800);

    svg {
      transform: scale(1.5);
      transition: all 500ms ease-in-out;
    }
  }
}

.friends__mark {
  background-color: var(--violet-100);
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.25rem;
}

.current__status {
  display: inline-flex;
  justify-content: center;
  //justify-content: flex-start;
  align-items: center;
  min-width: 9rem;
  border-radius: 2rem;
  padding: 0.5rem 2rem;

  &.sold {
    background-color: var(--green-100);
    color: var(--green-600);
  }

  &.waiting {
    background-color: var(--violet-100);
    color: var(--violet-600);
  }

  &.contract,
  &.booked {
    background-color: var(--yellow-100);
    color: var(--yellow-600);
  }

  &.closed {
    background-color: var(--gray-100);
    color: var(--gray-600);
  }
}

::v-deep .row__head__bottom-border {
  border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .row__body__bottom-border:not(:last-child) {
  border-bottom: 2px solid var(--gray-200) !important;
}

.show__by {
  width: 100%;
  display: flex;
  justify-content: center;

  &__content {
    display: flex;
    align-items: center;
    border-radius: 2rem;
    background-color: var(--gray-100);
    padding: .75rem 1.5rem;
    width: auto;
    position: relative;

    .custom-select {
      width: auto;
      border: none;
      background: none;
      cursor: pointer;
      font-weight: 600;
      color: var(--gray-600);
    }

    .description {
      color: var(--gray-400);
    }

    .arrow__down {
      position: absolute;
      right: 1.75rem;
    }
  }
}

.not__found {
  min-height: 30rem;

  p {
    color: var(--gray-400);
    line-height: 1.75rem;
  }

  p.head {
    font-size: 2rem;
  }
}

.download__arrow__button {
  position: absolute;
  top: 50%;
  right: 50%;
  z-index: 10;
  transform: translate(-50%, -50%);
}
</style>