<script>
import BaseFilterTabsContent from "@/components/Reusable/BaseFilterTabsContent2";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseLoading from "@/components/Reusable/BaseLoading";
import { XFormSelect } from "@/components/ui-components/form-select";
import { XIcon } from "@/components/ui-components/material-icons";
import { XSquareBackground } from "@/components/ui-components/square-background";
import ExportDropdown from "@/views/contracts/components/ExportDropdown.vue";
import { v3ServiceApi } from "@/services/v3/v3.service";

import BaseSearchInput from "@/components/Reusable/BaseSearchInput";

import { phonePrettier } from "@/util/reusable";
import AppHeader from "@/components/Header/AppHeader";

export default {
  name: "Clients",
  components: {
    BaseSearchInput,
    ExportDropdown,
    AppHeader,
    BaseFilterTabsContent,
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
    BaseLoading,
    XFormSelect: XFormSelect,
    XIcon,
    XSquareBackground,
  },
  data() {
    return {
      timeout: null,
      showLoading: false,
      counts: { active: 0, no_active: 0 },
      search: this.$route.query.search || "",
      phone: this.$route.query.phone || "",
      currentTab: this.$route.query.is_active == 0 ? "no_active" : "active",
      clientType: "physical",
      clientOptions: [
        { value: "physical", name: "Физическое лицо" },
        { value: "legal", name: "Юридическое лицо" },
      ],
      tableItems: [],
      pagination: {},
      showByValue: this.$route.query.limit || 20,
      showByOptions: [10, 20, 30, 40, 50].map((e) => ({ value: e, text: e })),
    };
  },
  computed: {
    statuses() {
      const t = {
        active: "Активные",
        no_active: "Неактивные",
      };
      return ["active", "no_active"].map((el) => ({
        name: t[el],
        status: el,
        counts: this.counts[el],
      }));
    },
    searchPlaceholder() {
      return this.clientType === "physical" ? "Серия паспорта" : "ИНН";
    },
    query() {
      return Object.assign({}, this.$route.query);
    },
    fields() {
      return [
        {
          key: "name",
          label: "Ф.И.О.",
        },
        {
          key: "subject",
          label: "Тип клиента",
          formatter: (t) =>
            t === "legal" ? "Юридическое лицо" : "Физическое лицо",
        },
        {
          key: "language",
          label: "Язык",
          formatter: (l) => this.$t(l),
          thStyle: "width: 100px;",
        },
        {
          key: "phones",
          label: "Телефоны",
        },
        {
          key: "order_counts",
          label: "Количество заказов",
          thStyle: "width: 150px;",
        },
        {
          key: "telegram_account_counts",
          label: "Телеграмм аккануты",
          thStyle: "width: 150px;",
        },
      ];
    },
  },
  watch: {
    clientType() {
      if (this.search) {
        this.fetchData();
      }
    },
    showByValue(n, o) {
      const isNotUpdate = n === null || n === o;
      if (isNotUpdate) return;
      const localQuery = {
        ...this.createQuery(),
        page: 1,
      };
      const limit = n;
      this.$router.replace({ query: { ...localQuery, limit } });
    },
    "$route.query": {
      handler: function () {
        this.fetchData();
      },
      deep: true,
    },
  },
  created() {
    this.fetchData();
    this.fetchCounts();
  },
  methods: {
    getInputValue(value) {
      this.search = value;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        const query = this.createQuery();
        this.$router.replace({ query });
      }, 500);
    },
    handlePhoneSearch(value) {
      this.phone = value;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        const query = this.createQuery();
        this.$router.replace({ query });
      }, 500);
    },
    clientName(item) {
      const locale = this.$i18n.locale;
      let lang = "lotin";
      if (locale === "ru") {
        lang = "kirill";
      }
      if (item.subject === "physical") {
        const { first_name, last_name, middle_name } = item.attributes;
        return `${first_name[lang]} ${last_name[lang]} ${middle_name[lang]} `;
      } else {
        return (
          item.attributes.company.name[locale] + " " + item.attributes.name
        );
      }
    },
    formattingPhone: (phone) => phonePrettier(phone),
    checkLocales(name) {
      return name[this.$i18n.locale];
    },
    clientView(item) {
      this.$router.push({
        name: "client-view",
        params: {
          uuid: item.id,
        },
      });
    },
    fetchContentByStatus(status) {
      this.currentTab = status;
      const query = Object.assign({}, this.query);
      // eslint-disable-next-line no-prototype-builtins
      if (query.hasOwnProperty("page")) {
        delete query.page;
      }

      const newQuery = { limit: this.showByValue, ...query };
      newQuery.is_active = +(status !== "no_active");

      this.$router.replace({ query: newQuery });
    },
    togglePhones(item) {
      item.showPhones = !item.showPhones;
    },
    changeCurrentPage(page) {
      const currentPage = this.query.page;
      if (page === currentPage) return;
      this.$router.replace({ query: { ...this.query, page } });
    },
    async fetchData() {
      this.showLoading = true;
      this.tableItems = [];
      await v3ServiceApi.clients
        .findAll(this.createQuery())
        .then((response) => {
          this.tableItems = response.data.result.map((el) => ({
            ...el,
            showPhones: false,
          }));
          this.pagination = response.data.pagination;
        })
        .finally(() => {
          this.showLoading = false;
        });
    },
    async fetchCounts() {
      await v3ServiceApi.clients
        .getCount(this.createQuery())
        .then((response) => {
          this.counts = response.data.result;
        });
    },
    createQuery() {
      const query = this.query;
      if (query.is_active === undefined) {
        query.is_active = 1;
      }
      if (!query.page) {
        query.page = 1;
      }
      if (!query.limit) {
        query.limit = this.showByValue;
      }
      if (this.search) {
        query.field = this.search;
        query.subject = this.clientType;
      } else {
        delete query.subject;
        delete query.field;
      }
      if (this.phone) {
        query.phone = this.phone;
      } else {
        delete query.phone;
      }
      return query;
    },
  },
};
</script>

<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t("clients.title") }}
      </template>

      <template #header-actions>
        <export-dropdown v-if="permissionDownloadReport" />
      </template>
    </app-header>

    <!--  Tabs  -->
    <base-filter-tabs-content
      :current="currentTab"
      :filter-tab-list="statuses"
      @get-new-content="fetchContentByStatus"
    />

    <!--  Search Content  -->
    <div class="row mt-4">
      <div class="col-5">
        <BaseSearchInput
          class="w-100"
          :placeholder="searchPlaceholder"
          @trigger-input="getInputValue"
        />
      </div>
      <div class="col-5">
        <BaseSearchInput
          class="w-100"
          placeholder="Номер телефона"
          @trigger-input="handlePhoneSearch"
        />
      </div>
      <div class="col-2">
        <x-form-select
          value-field="value"
          text-field="name"
          v-model="clientType"
          :multiple="false"
          :options="clientOptions"
          :placeholder="$t('Тип клиента')"
        />
      </div>
    </div>
    <!--  Table List -->
    <b-table
      sticky-header
      borderless
      responsive
      :busy="showLoading"
      :items="tableItems"
      :fields="fields"
      class="table__list mt-4"
      :empty-text="$t('no_data')"
      thead-tr-class="row__head__bottom-border"
      tbody-tr-class="row__body__bottom-border cursor-pointer"
      show-empty
      sort-icon-left
    >
      <template #cell(name)="{ item }">
        <div class="d-flex align-items-center" @click="clientView(item)">
          <div
            v-if="item.client_type.is_vip"
            class="d-flex align-items-center mr-1"
          >
            <x-square-background
              :id="'clientName' + item.id"
              class="bg-violet-100 cursor-pointer"
              padding="0.2"
            >
              <x-icon
                :name="item.client_type.icon"
                color="var(--violet-600)"
                size="18"
              />
            </x-square-background>
            <b-tooltip :target="'clientName' + item.id">
              {{ checkLocales(item.client_type.name) }}
            </b-tooltip>
          </div>
          <span> {{ clientName(item) }} </span>
        </div>
      </template>
      <template #cell(phones)="{ item }">
        <div>
          <div class="d-flex align-items-center">
            {{ formattingPhone(item.phones[0]?.phone) }}
            <template v-if="item.phones?.length > 1">
              <x-square-background
                v-if="item.showPhones"
                :id="'clientName' + item.id"
                class="bg-violet-100 cursor-pointer ml-2"
                padding="0.2"
                @click="togglePhones(item)"
              >
                <x-icon
                  name="arrow_drop_up"
                  color="var(--violet-600)"
                  size="20"
                />
              </x-square-background>
              <x-square-background
                v-else
                :id="'clientName' + item.id"
                class="bg-violet-100 cursor-pointer ml-2"
                padding="0.2"
                @click="togglePhones(item)"
              >
                <x-icon
                  name="arrow_drop_down"
                  color="var(--violet-600)"
                  size="20"
                />
              </x-square-background>
            </template>
          </div>
          <template v-if="item.showPhones">
            <div v-for="el in item.phones.slice(1)" :key="el.id" class="mt-2">
              {{ formattingPhone(el.phone) }}
            </div>
          </template>
        </div>
      </template>
      <!--  Actions    -->
      <!-- <template #cell(actions)>
        <span v-if="downloadPermission" class="arrow__down-violet">
          <base-arrow-down-icon
            class="download__icon"
            :width="20"
            :height="20"
            fill="#fff"
          />
        </span>
      </template> -->

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
    <div v-if="!showLoading && pagination.totalPage" class="pagination__vue">
      <!--   Pagination   -->
      <vue-paginate
        :page-count="pagination.totalPage"
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
  min-width: 9rem;
  border-radius: 2rem;
  padding: 0.5rem 0.5rem;

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
