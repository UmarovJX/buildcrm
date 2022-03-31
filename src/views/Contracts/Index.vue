<template>
  <main class="main__content">
    <!--  Tabs  -->
    <base-filter-tabs-content
        :filter-tab-list="filterTabList"
        @get-new-content="fetchContentByStatus"
    />

    <!--  Search Content  -->
    <search-bar-content/>

    <!--  Table List -->
    <b-table
        sticky-header
        borderless
        responsive
        :items="tableItems"
        :fields="tableFields"
        class="table__list"
        :empty-text="$t('no_data')"
        thead-tr-class="row__head__bottom-border"
        tbody-tr-class="row__body__bottom-border"
        show-empty
        sort-icon-left
    >
      <!--   Checkbox Head    -->
      <template #head(checkbox)="data">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="14" height="14" rx="3" stroke="#9CA3AF" stroke-width="2"/>
        </svg>
      </template>

      <!--   Checkbox  Body   -->
      <template #cell(checkbox)="data">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="14" height="14" rx="3" stroke="#9CA3AF" stroke-width="2"/>
        </svg>
      </template>

      <!--   Phone Number   -->
      <template #cell(phone)="data">
        <span>{{ formattingPhone(data.item.client.phone) }}</span>
      </template>

      <!--   Phone Number   -->
      <template #cell(date)="data">
        <span>{{ dateReverser(data.item.object.build_date) }}</span>
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


      <template #cell(actions)="data">
        <span class="arrow__down-violet">
          <base-arrow-down-icon :width="20" :height="20" fill="#fff"/>
        </span>
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

      <template #empty="scope" class="text-center">
            <span class="d-flex justify-content-center align-items-center">
              {{ scope['emptyText'] }}
            </span>
      </template>
    </b-table>

    <div class="pagination__contract">
      <!--   Pagination   -->
      <vue-paginate
          :page-count="20"
          :container-class="'container'"
          :page-class="'page-item'"
          :page-link-class="'page-link'"
          :next-class="'page-item'"
          :prev-class="'page-item'"
          :prev-link-class="'page-link'"
          :next-link-class="'page-link'"
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
          <b-form-select v-model="showByValue" :options="showByOptions"></b-form-select>
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
import api from "@/services/api";
import {formatDateWithDot, formatToPrice, phonePrettier} from "@/util/reusable";

export default {
  name: "Contracts",
  components: {
    BaseFilterTabsContent,
    BaseArrowDownIcon,
    SearchBarContent,
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
    BaseStarIcon,
    BaseDownIcon
  },
  data() {
    const showByOptions = []

    for (let number = 10; number <= 100; number += 10) {
      showByOptions.push({
        value: number,
        text: number
      })
    }

    const filterTabList = [
      {
        name: this.$t('tab_status.all'),
        status: 0,
        counts: 900
      },
      {
        name: this.$t('tab_status.booked'),
        status: 1,
        counts: 50
      },
      {
        name: this.$t('tab_status.sold'),
        status: 2,
        counts: 60
      },
      {
        name: this.$t('tab_status.on_payment'),
        status: 3,
        counts: 700
      },
      {
        name: this.$t('tab_status.closed'),
        status: 4,
        counts: 90
      }
    ]

    return {
      showByOptions,
      filterTabList,
      tableItems: [],
      pagination: {},
      showByValue: 10
    }
  },
  computed: {
    tableFields() {
      return [
        {
          key: "checkbox",
          label: "",
        },
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
          key: "transaction_price",
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
    }
  },
  async created() {
    await this.fetchContractList()
  },
  methods: {
    formattingPhone: (phone) => phonePrettier(phone),
    dateReverser: (time) => formatDateWithDot(time),
    getClientName(client) {
      let language = 'kirill'
      if (this.$i18n.locale === 'uz') {
        language = 'lotin'
      }
      const {last_name, first_name} = client
      return last_name[language] + ' ' + first_name[language]
    },
    fetchContentByStatus() {

    },
    async fetchContractList() {
      const query = this.$route.query
      query.page = '1'
      await api.contractV2.fetchContractsList(query)
          .then((response) => {
            this.tableItems = response.data.items
            this.pagination = response.data.pagination
          })
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
  justify-content: start;
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

::v-deep .pagination__contract {
  display: flex;
  margin-top: 2rem;

  ul.container {
    list-style-type: none;
    display: flex;
    padding: 0;
    margin: 0;

    .page-item {
      margin-right: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;

      .page-link {
        background-color: var(--gray-100);
        color: var(--gray-600);
        border-radius: 50%;
        padding: 1rem;
        min-width: 3rem;
        min-height: 3rem;
        border: none;
        transition: all 200ms ease-in;

        &:hover {
          background-color: var(--violet-300);
          color: var(--violet-800);
        }
      }

      &.active .page-link {
        background-color: var(--violet-100);
        color: var(--violet-600);
      }
    }
  }
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
</style>