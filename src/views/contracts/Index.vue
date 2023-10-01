<script>
import BaseFilterTabsContent from "@/components/Reusable/BaseFilterTabsContent";
import SearchBarContent from "@/components/Contracts/SearchBarContent";
import BaseArrowDownIcon from "@/components/icons/BaseArrowDownIcon";
// import BaseStarIcon from "@/components/icons/BaseStarIcon";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseLoading from "@/components/Reusable/BaseLoading";
import { XFormSelect } from "@/components/ui-components/form-select";
import { XIcon } from "@/components/ui-components/material-icons";
import { XSquareBackground } from "@/components/ui-components/square-background";
import ExportDropdown from "@/views/contracts/components/ExportDropdown.vue";
import api from "@/services/api";
import {
  formatDateWithDot,
  formatToPrice,
  phonePrettier,
  sortObjectValues,
} from "@/util/reusable";
import { mapGetters } from "vuex";
import ContractsPermission from "@/permission/contract";
import AppHeader from "@/components/Header/AppHeader";
import {
  isNotUndefinedNullEmptyZero,
  isNull,
  isObject,
  isPrimitive,
  isUndefinedOrNullOrEmpty,
} from "@/util/inspect";
import { hasOwnProperty, keys } from "@/util/object";
import { formatDateToHM } from "@/util/date/calendar.util";
import Permission from "@/permission";

export default {
  name: "Contracts",
  components: {
    ExportDropdown,
    AppHeader,
    BaseFilterTabsContent,
    BaseArrowDownIcon,
    SearchBarContent,
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
    // BaseStarIcon,
    // BaseDownIcon,
    BaseLoading,
    XFormSelect: XFormSelect,
    XIcon,
    XSquareBackground,
  },
  data() {
    const showByOptions = [];

    for (let number = 10; number <= 50; number += 10) {
      showByOptions.push({
        value: number,
        text: number,
      });
    }

    const filterTabList = [
      {
        name: "tab_status.all",
        status: "",
        counts: 0,
      },
      {
        name: "tab_status.booked",
        status: "booked",
        counts: 0,
      },
      {
        name: "tab_status.sold",
        status: "contract",
        counts: 0,
      },
      {
        name: "tab_status.on_payment",
        status: "sold",
        counts: 0,
      },
      {
        name: "tab_status.closed",
        status: "closed",
        counts: 0,
      },
      {
        name: "tab_status.reorder",
        status: "reorder",
        counts: 0,
      },
      {
        name: "tab_status.deleted",
        status: "trashed",
        counts: 0,
      },
    ];

    const hasAdminRole = Permission.hasAdminRole();

    if (hasAdminRole) {
      filterTabList.splice(filterTabList.length - 1, 0, {
        name: "tab_status.archived",
        status: "archived",
        counts: 0,
      });
    }

    let { search: searchValue, limit: showByValue } = this.$route.query;

    if (!showByValue) {
      showByValue = 20;
    }

    const contractsPermission = ContractsPermission.contracts();

    const permissionDownloadReport = hasAdminRole
      ? true
      : hasOwnProperty(contractsPermission, "download_report")
      ? contractsPermission.download_report
      : false;

    return {
      hasAdminRole,
      showByValue,
      searchValue,
      showByOptions,
      filterTabList,
      tableItems: [],
      pagination: {},
      showLoading: false,
      selectMode: "single",
      selectable: true,
      counts: {},
      importFile: {
        requestLimit: 5 * 60,
        fetching: false,
        selected: null,
        options: [
          {
            text: "order",
            value: "order",
          },
          {
            text: "report",
            value: "report",
          },
        ],
      },
      permissionDownloadReport,
      filterPermission: ContractsPermission.getContractsFilterPermission(),
      downloadPermission: ContractsPermission.getContractsDownloadPermission(),
    };
  },
  computed: {
    ...mapGetters({
      permission: "getPermission",
    }),
    statuses() {
      if (keys(this.counts).length) {
        return this.filterTabList.map((filterTab) => {
          // eslint-disable-next-line no-prototype-builtins
          const findIndex = this.counts.hasOwnProperty(filterTab.status);
          if (findIndex) {
            return {
              ...filterTab,
              counts: this.counts[filterTab.status],
            };
          } else if (filterTab.status === "trashed") {
            return {
              ...filterTab,
              counts: this.counts.deleted,
            };
          }

          const sum = () => {
            let init = 0;
            for (let [, value] of Object.entries(this.counts)) {
              init += value;
            }
            return init;
          };

          if (filterTab.status === "") {
            return {
              ...filterTab,
              counts: sum(),
            };
          }
        });
      }

      return this.filterTabList;
    },
    tableFields() {
      let fields = [
        {
          key: "contract",
          label: this.$t("contracts.table.contract"),
        },
        {
          key: "client",
          label: this.$t("contracts.table.client"),
        },
        {
          key: "apartmentsNumber",
          label: this.$t("contracts.apartment_number"),
          formatter: (v, key, item) => {
            let list = [];
            if (item.type === "parking") {
              list = item.parkings;
            } else {
              list = item.apartments;
            }

            return list
              .reduce((acc, app) => acc + "," + app.number, "")
              .slice(1);
          },
        },
        {
          key: "status",
          label: this.$t("contracts.table.status"),
        },
        {
          key: "payments.transaction_price",
          label: this.$t("contracts.table.cost"),
          formatter: (price) => formatToPrice(price) + " " + this.$t("ye"),
        },
        {
          key: "object",
          label: this.$t("contracts.table.object"),
          formatter: (object) => object?.name,
        },
        {
          key: "date",
          label: this.$t("contracts.table.date"),
        },
        {
          key: "actions",
          label: "",
        },
      ];

      if (
        hasOwnProperty(this.$route.query, "status") &&
        ["trashed", "deleted"].includes(this.$route.query.status)
      ) {
        fields.splice(1, 0, {
          key: "deleted_at",
          label: this.$t("deleted_date"),
          formatter: (date) => {
            if (isNull()) {
              return "";
            }

            return formatDateToHM(date) + "\t" + formatDateWithDot(date);
          },
        });
      }

      return fields;
    },
    query() {
      return Object.assign({}, this.$route.query);
    },
    countOfItems() {
      if (this.tableItems) return this.tableItems.length;
      return 0;
    },
  },
  watch: {
    "$route.query": {
      handler: function () {
        this.fetchContractList();
      },
      deep: true,
    },
    searchValue() {
      this.getContractListBySearch();
    },
    // "importFile.selected"(vSelected) {
    //   if (vSelected === "order") {
    //     this.importOrder();
    //   }
    //
    //   if (vSelected === "report") {
    //     this.importReport();
    //   }
    // },
  },
  created() {
    Promise.allSettled([
      this.fetchContractList(),
      this.fetchStatusesOfCounts(),
    ]);
  },
  methods: {
    formattingPhone: (phone) => phonePrettier(phone),
    dateReverser: (time) => formatDateWithDot(time),
    async fetchStatusesOfCounts() {
      try {
        const response = await api.contractV2.getCounts();
        this.counts = response.data.result;
      } catch (e) {
        this.toastedWithErrorCode(e);
      }
    },
    limitChanged() {
      this.changeFetchLimit();
    },
    checkLocales(name) {
      if (localStorage.locale) return name[localStorage.locale];
      else return name["ru"];
    },
    getClientMajorPhone(phones) {
      if (!phones.length) {
        return "";
      }

      phones = phones.filter((p) => {
        return (
          isNotUndefinedNullEmptyZero(p.phone) && p.phone.toString().length > 3
        );
      });

      if (phones.length > 0) {
        return this.formattingPhone(phones[0].phone);
      }
    },
    downloadContractLink(id) {
      api.contract
        .downloadContract(id)
        .then(({ data, headers }) => {
          // eslint-disable-next-line no-prototype-builtins
          const filename = headers.hasOwnProperty("x-filename")
            ? headers["x-filename"]
            : "contract";
          const fileURL = window.URL.createObjectURL(new Blob([data]));
          const fileLink = document.createElement("a");
          fileLink.href = fileURL;
          fileLink.setAttribute("download", filename);
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch(() => {
          return "#";
        });
    },
    getClientName(client) {
      if (isUndefinedOrNullOrEmpty(client.attributes)) {
        return "";
      }

      let language = "kirill";

      if (this.$i18n.locale === "uz") {
        language = "lotin";
      }

      if (client.subject === "legal") {
        return (
          client.attributes.company.name[this.$i18n.locale] +
          " " +
          client.attributes.name
        );
      }

      const { first_name, last_name, middle_name } =
        client.attributes ?? client;
      return (
        this.clientName(last_name, language) +
        " " +
        this.clientName(first_name, language) +
        " " +
        this.clientName(middle_name, language)
      );
    },
    contractView({ id }, index, event) {
      const clickedDownloadBtn =
        event.target.classList.contains("download__icon");
      if (clickedDownloadBtn) {
        if (this.downloadPermission) {
          this.downloadContractLink(id);
        }
      } else {
        this.$router.push({
          name: "contracts-view",
          params: {
            id,
          },
        });
      }
    },
    clientName(multiName, language) {
      if (!isObject(multiName)) {
        return "";
      }

      const lastNameByLang = multiName[language];
      if (lastNameByLang) {
        return lastNameByLang;
      } else {
        const lastNameOtherLang =
          language === "kirill" ? multiName["lotin"] : multiName["kirill"];
        if (lastNameOtherLang) return lastNameOtherLang;
      }

      return "";
    },
    fetchContentByStatus(status) {
      const query = Object.assign({}, this.query);
      // eslint-disable-next-line no-prototype-builtins
      if (query.hasOwnProperty("page")) {
        delete query.page;
      }

      this.replaceRouter({ ...query, status });
    },
    changeCurrentPage(page) {
      const currentPage = this.query.page;
      if (page === currentPage) return;
      this.replaceRouter({ ...this.query, page });
    },
    changeFetchLimit() {
      const { query } = this;
      const isNotUpdate =
        query.limit?.toString() === this.showByValue.toString();
      if (isPrimitive(query.limit) && isNotUpdate) return;
      const localQuery = {
        ...this.query,
        page: 1,
      };
      const limit = this.showByValue;
      this.replaceRouter({ ...localQuery, limit });
    },
    // setSearchValue(search) {
    //   const hasSearchQuery = this.query.hasOwnProperty('search')
    //   if (search?.length < 3 && hasSearchQuery) {
    //     this.replaceRouter({})
    //   }
    //
    //   if (this.searchValue === search || search.length < 3) return
    //   this.searchValue = search
    // },
    getContractListBySearch() {
      const { query, searchValue } = this;
      // eslint-disable-next-line no-prototype-builtins
      const hasSearchQuery = query.hasOwnProperty("search");
      if (!hasSearchQuery) {
        this.pushRouter({
          search: searchValue,
        });
        return;
      }

      query.search = searchValue;
      this.pushRouter(query);
    },
    async fetchContractList() {
      const query = sortObjectValues(this.query);
      const propArrayList = [
        "object_id",
        "blocks",
        "floors",
        "branch",
        "manager",
        "contract_number",
        "apartment_number",
      ];

      propArrayList.forEach((prop) => {
        if (
          // eslint-disable-next-line no-prototype-builtins
          query.hasOwnProperty(prop) &&
          typeof query[prop] === "string"
        ) {
          query[prop] = [query[prop]];
        }
      });

      this.showLoading = true;
      this.tableItems = [];

      if (!this.hasAdminRole && this.$route.query.status === "archived") {
        delete query.status;
      }

      await api.contractV2
        .fetchContractsList(query)
        .then((response) => {
          response.data.items.forEach((dataItem) => {
            this.tableItems.push(
              dataItem
              // Object.assign(dataItem, {
              //   _rowVariant: dataItem.archived ? "warning" : "light",
              // })
            );
          });
          this.pagination = response.data.pagination;
          this.showByValue = response.data.pagination.perPage;
        })
        .finally(() => {
          this.showLoading = false;
        });
    },
    searchQueryFilter(searchQuery) {
      // eslint-disable-next-line no-prototype-builtins
      const hasQueryStatus = this.query.hasOwnProperty("status");
      if (hasQueryStatus) {
        const { status } = this.query;
        this.pushRouter({
          ...searchQuery,
          status,
        });
        return;
      }

      this.pushRouter(searchQuery);
    },
    replaceRouter(query) {
      const sortQuery = sortObjectValues(query);
      this.$router.replace({ query: sortQuery });
    },
    pushRouter(query) {
      const sortQuery = sortObjectValues(query);
      this.$router.push({ query: {} });
      this.$router.push({ query: sortQuery });
    },
  },
};
</script>

<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t("contracts.list_contracts") }}
      </template>

      <template #header-actions>
        <export-dropdown v-if="permissionDownloadReport" />
      </template>
    </app-header>

    <!--  Tabs  -->
    <base-filter-tabs-content
      :filter-tab-list="statuses"
      @get-new-content="fetchContentByStatus"
    />

    <!--  Search Content  -->
    <search-bar-content
      ref="filterModal"
      v-if="filterPermission"
      @replace-router="searchQueryFilter"
      @search-by-filter="searchQueryFilter"
    />

    <!--  Table List -->
    <b-table
      sticky-header
      borderless
      responsive
      :busy="showLoading"
      :items="tableItems"
      :fields="tableFields"
      class="table__list"
      :empty-text="$t('no_data')"
      thead-tr-class="row__head__bottom-border"
      tbody-tr-class="row__body__bottom-border cursor-pointer"
      show-empty
      sort-icon-left
      @row-clicked="contractView"
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
      <!--      <template #cell(phone)="data">-->
      <!--        <span class="phone-col">-->
      <!--          {{ getClientMajorPhone(data.item.client.phones) }}-->
      <!--        </span>-->
      <!--      </template>-->

      <!--!  CONTRACT NUMBER   -->
      <template #cell(contract)="data">
        <span class="d-flex align-items-center">
          <x-square-background
            v-if="data.item.archived"
            padding="0.4"
            class="mr-2 bg-yellow-200"
          >
            <x-icon name="archive" class="color-yellow-600"></x-icon>
          </x-square-background>
          <x-square-background
            v-if="data.item.type === 'parking'"
            padding="0.4"
            class="mr-2 bg-violet-600"
          >
            <x-icon name="local_parking" class="color-yellow-400"></x-icon>
          </x-square-background>
          <span>
            {{ data.item.contract }}
          </span>
        </span>
      </template>

      <!--   Date   -->
      <template #cell(date)="data">
        <span>{{ dateReverser(data.item.created_at) }}</span>
      </template>

      <!--   Client LFP   -->
      <template #cell(client)="{ item }">
        <div class="d-flex">
          <div
            v-if="item.client.client_type.is_vip"
            class="d-flex align-items-center mr-1"
          >
            <x-square-background
              :id="'clientName' + item.id"
              class="bg-violet-100 cursor-pointer"
              padding="0.2"
            >
              <x-icon
                :name="item.client.client_type.icon"
                color="var(--violet-600)"
                size="18"
              />
            </x-square-background>
            <b-tooltip :target="'clientName' + item.id">
              {{ checkLocales(item.client.client_type.name) }}
            </b-tooltip>
          </div>
          <span>{{ getClientName(item.client) }}</span>
        </div>
      </template>

      <!--   Status   -->
      <template #cell(status)="{ item }">
        <span class="current__status" :class="item.status">
          {{ $t(`contracts.status.${item.status}`) }}
        </span>
      </template>

      <!--  Actions    -->
      <template #cell(actions)>
        <span v-if="downloadPermission" class="arrow__down-violet">
          <base-arrow-down-icon
            class="download__icon"
            :width="20"
            :height="20"
            fill="#fff"
          />
        </span>
      </template>

      <!--  Busy Animation    -->
      <template #table-busy>
        <base-loading />
      </template>

      <template #empty>
        <div
          class="d-flex justify-content-center align-items-center flex-column not__found"
        >
          <p class="head">{{ $t("contracts_not_found.title") }}</p>
          <p>{{ $t("contracts_not_found.description") }}</p>
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
            <base-arrow-right-icon />
          </span>
        </template>

        <template #prev-content>
          <span class="d-flex align-items-center justify-content-center">
            <base-arrow-left-icon />
          </span>
        </template>
      </vue-paginate>

      <!--  Show By Select    -->
      <div class="show__by">
        <x-form-select
          :label="false"
          :options="showByOptions"
          v-model="showByValue"
          @change="limitChanged"
        >
          <template #output-prefix>
            <span class="show-by-description">
              {{ $t("contracts.show_by") }}:
            </span>
          </template>
        </x-form-select>
      </div>
    </div>
  </div>
</template>

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

  .table.b-table[aria-busy="true"] {
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
    //background-color: var(--violet-800);

    svg {
      transform: scale(1.5);
      transition: all 500ms ease-in-out;
    }
  }
}

//.friends__mark {
//    background-color: var(--violet-100);
//    min-width: 1.5rem;
//    width: 1.5rem;
//    height: 1.5rem;
//    border-radius: 50%;
//    display: flex;
//    justify-content: center;
//    align-items: center;
//    margin-right: 0.25rem;
//}

.current__status {
  display: inline-flex;
  justify-content: center;
  //justify-content: flex-start;
  align-items: center;
  min-width: 11rem;
  border-radius: 2rem;
  padding: 0.5rem 1.5rem;

  &.sold {
    background-color: var(--green-100);
    color: var(--green-600);
  }

  &.waiting {
    background-color: var(--violet-100);
    color: var(--violet-600);
  }

  &.contract {
    background-color: var(--blue-100);
    color: var(--blue-600);
  }

  &.booked {
    background-color: var(--yellow-100);
    color: var(--yellow-600);
  }

  &.closed,
  &.cancelled {
    background-color: var(--red-100);
    color: var(--red-600);
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
    padding: 0.75rem 1.5rem;
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

.show-by-description {
  color: var(--gray-400);
}
</style>
