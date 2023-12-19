<script>
import BaseLoading from '@/components/Reusable/BaseLoading'
import BaseArrowLeftIcon from '@/components/icons/BaseArrowLeftIcon'
import BaseArrowRightIcon from '@/components/icons/BaseArrowRightIcon'
import AppHeader from '@/components/Header/AppHeader'
import XFormSelect from '@/components/ui-components/form-select/FormSelect.vue'
import { XIcon } from '@/components/ui-components/material-icons'
import { XSquareBackground } from '@/components/ui-components/square-background'
import { v3ServiceApi } from '@/services/v3/v3.service'
import api from '@/services/api'
import {
  phonePrettier,
  formatToPrice,
  formatDateWithDot,
} from '@/util/reusable'
import BaseFilterTabsContent from '@/components/Reusable/BaseFilterTabsContent2'
import BaseButton from '@/components/Reusable/BaseButton.vue'

export default {
  name: 'ClientView',
  components: {
    BaseButton,
    BaseFilterTabsContent,
    XSquareBackground,
    XFormSelect,
    BaseArrowRightIcon,
    BaseArrowLeftIcon,
    BaseLoading,
    AppHeader,
    XIcon,
  },
  data() {
    return {
      showLoading: false,
      showSecondaryLoading: false,
      client: null,
      currentTab: 'orders',
      pagination: {},
      showByValue: this.$route.query.limit || 10,
      showByOptions: [10, 20, 30, 40, 50].map(e => ({ value: e, text: e })),
      ordersFields: [
        {
          key: 'contract',
          label: this.$t('contracts.table.contract'),
        },

        {
          key: 'apartmentsNumber',
          label: this.$t('contracts.apartment_number'),
          formatter: (v, key, item) => {
            let list = []
            if (item.type === 'parking') {
              list = item.parkings
            } else {
              list = item.apartments
            }

            return list
              .reduce((acc, app) => `${acc},${app.number}`, '')
              .slice(1)
          },
          thStyle: 'width: 110px',
        },
        {
          key: 'status',
          label: this.$t('contracts.table.status'),
          thStyle: 'width: 90px',
        },
        {
          key: 'payments.transaction_prices',
          label: this.$t('contracts.table.cost'),
          formatter: price => `${formatToPrice(price)} ${this.$t('ye')}`,
        },
        {
          key: 'object',
          label: this.$t('contracts.table.object'),
          formatter: object => object?.name,
        },
        {
          key: 'created',
          label: this.$t('roles.manager'),
          formatter: created => `${created?.first_name} ${created?.last_name}`,
        },
        {
          key: 'date',
          label: this.$t('contracts.table.date'),
        },
        {
          key: 'actions',
          label: '',
        },
      ],
      telegramAccountsFields: [
        {
          key: 'id',
          label: 'ID',
        },
        {
          key: 'phone',
          label: 'Номер телефона',
        },
        {
          key: 'username',
          label: 'Имя пользователя',
        },
        {
          key: 'language',
          label: 'Язык',
        },
        {
          key: 'created_at',
          label: 'Дата Создания',
          formatter: d => formatDateWithDot(d),
        },
        {
          key: 'updated_at',
          label: 'Дата Изменения',
          formatter: d => formatDateWithDot(d),
        },
        {
          key: 'logged_at',
          formatter: d => (d ? formatDateWithDot(d) : ''),
          label: 'Последняя активность',
        },
      ],
      items: [],

      showEditForm: false,
      clientTypesList: [],
      countriesList: [],
    }
  },
  computed: {
    showEditButton() {
      return this.clientTypesList.length > 0 && this.countriesList.length > 0
    },
    fields() {
      return this[`${this.currentTab}Fields`]
    },
    clientName() {
      if (!this.client) return ''
      const { locale } = this.$i18n
      let lang = 'lotin'
      if (locale === 'ru') {
        lang = 'kirill'
      }
      if (this.client.subject === 'physical') {
        const { first_name, last_name, middle_name } = this.client.attributes
        return `${first_name[lang]} ${last_name[lang]} ${middle_name[lang]} `
      }
      return (
        `${this.client.attributes.company.name[locale]
        } ${
          this.client.attributes.name}`
      )
    },
    tabs() {
      const t = {
        orders: 'Договоры',
        telegramAccounts: 'Телеграм Аккаунты',
      }
      return ['orders', 'telegramAccounts'].map(el => ({
        name: t[el],
        status: el,
        count: 0,
      }))
    },
  },

  watch: {
    '$route.query': {
      handler() {
        this.fetchSecondaryData()
      },
    },
    currentTab() {
      const currentPage = this.$route.query.page
      if (+currentPage === 1) return this.fetchSecondaryData()
      this.$router.replace({ query: { ...this.$route.query, page: 1 } })
    },
    showByValue(n, o) {
      const isNotUpdate = n === null || n === o
      if (isNotUpdate) return
      const localQuery = {
        ...this.$route.query,
        page: 1,
      }
      const limit = n
      this.$router.replace({ query: { ...localQuery, limit } })
    },
  },
  created() {
    this.fetchData()
    this.fetchSecondaryData()
    Promise.all([this.getClientTypesList(), this.getCountriesList()])
  },

  methods: {
    dateReverser: time => formatDateWithDot(time),
    formattingPhone: phone => phonePrettier(phone),
    formatPrice: e => formatToPrice(e),
    fetchContentByStatus(status) {
      this.currentTab = status
    },
    changeCurrentPage(page) {
      const currentPage = this.$route.query.page
      if (page === currentPage) return
      this.$router.replace({ query: { ...this.$route.query, page } })
    },
    async fetchData() {
      this.showLoading = true
      const { uuid } = this.$route.params
      await v3ServiceApi.clients
        .findOne({ uuid })
        .then(response => {
          this.client = response.data.result
          console.log(this.client)
        })
        .catch(error => {
          this.toastedWithErrorCode(error)
        })
        .finally(() => {
          this.showLoading = false
        })
    },
    async fetchSecondaryData() {
      const { query } = this.$route
      this.showSecondaryLoading = true

      this.items = []
      if (!query.page) {
        query.page = 1
      }
      if (!query.limit) {
        query.limit = this.showByValue
      }
      const newQuery = { ...query, uuid: this.$route.params.uuid }
      v3ServiceApi.clients[this.currentTab](newQuery)
        .then(res => {
          this.items = res.data.result
          this.pagination = res.data.pagination
        })
        .finally(() => {
          this.showSecondaryLoading = false
        })
    },
    contractView({ id }) {
      if (this.currentTab === 'telegramAccounts') return
      this.$router.push({
        name: 'contracts-view',
        params: {
          id,
        },
      })
    },
    openEditModal() {
      this.$router.push({
        name: 'client-edit',
      })
    },
    async getCountriesList() {
      try {
        const { data: countriesList } = await api.settingsV2.fetchCountries()
        this.countriesList = countriesList.map(cty => ({
          value: cty.id,
          text: cty.name.uz,
        }))
      } catch (e) {
        this.toastedWithErrorCode(e)
      }
    },
    async getClientTypesList() {
      try {
        const { data: clientTypesList } = await api.settingsV2.getClientTypes()
        this.clientTypesList = clientTypesList.map(({ name, id }) => ({
          text: name[this.$i18n.locale],
          value: id,
        }))
      } catch (e) {
        this.toastedWithErrorCode(e)
      }
    },
  },
}
</script>
<template>
  <div>
    <AppHeader>
      <template #header-breadcrumb>
        <div class="d-flex align-items-center">
          <div
            class="go__back"
            @click="$router.go(-1)"
          >
            <BaseArrowLeftIcon
              :width="32"
              :height="32"
            />
          </div>
          <div class="breadcrumb__content card-title mb-0">
            {{ clientName }}
          </div>
        </div>
      </template>
      <template #header-status />
      <template #header-actions>
        <base-button
          v-if="showEditButton"
          text="Редактировать"
          @click="openEditModal"
        >
          <template #left-icon>
            <x-icon
              name="edit"
              :size="20"
              class="violet-600"
              color="var(--violet-600)"
            />
          </template>
        </base-button>
      </template>
    </AppHeader>

    <base-loading v-if="showLoading" />
    <template v-else>
      <div class="cards">
        <div class="currency__chart currency__chart">
          <span class="card-title">Общая информация</span>
          <div class="row mb-2">
            <span class="bottom__info col-5"> Субьект </span>
            <span class="price col-7">{{
              client.subject === "legal"
                ? "Юридическое лицо"
                : "Физическое лицо"
            }}</span>
          </div>
          <!-------------->
          <div class="row mb-2">
            <span class="bottom__info col-5"> Номера телефонов: </span>
            <span class="price col-7">
              <div
                v-for="p in client.phones"
                :key="p.id"
              >
                {{ formattingPhone(p.phone) }}
              </div>
            </span>
          </div>
          <!-------------->
          <div class="row mb-2">
            <span class="bottom__info col-5"> Язык </span>
            <span class="price col-7">{{ client.language }}</span>
          </div>
          <!-------------->
          <div class="row mb-2">
            <span class="bottom__info col-5"> Количество заказов </span>
            <span class="price col-7">{{ client.order_counts }}</span>
          </div>
          <!-------------->
        </div>

        <div class="currency__chart currency__chart">
          <span class="card-title">Платежи</span>
          <div class="row mb-2">
            <span class="bottom__info col-5">Общая сумма договоров </span>
            <span class="price col-7">{{
              formatPrice(client.total_payments.transaction_prices) +
                ` ${$t("ye")}`
            }}</span>
          </div>
          <!-------------->
          <div class="row mb-2">
            <span class="bottom__info col-5"> Всего платежей </span>
            <span class="price col-7">{{
              formatPrice(client.total_payments.total_payments) + ` ${$t("ye")}`
            }}</span>
          </div>
          <!-------------->

          <div class="row mb-2">
            <span class="bottom__info col-5"> Общая задолженность </span>
            <span class="price col-7">{{
              formatPrice(client.total_payments.total_debts) + ` ${$t("ye")}`
            }}</span>
          </div>
          <!-------------->
          <div class="row mb-2">
            <span class="bottom__info col-5"> Задолженность на сегодня </span>
            <span class="price col-7">{{
              formatPrice(client.total_payments.overdue_debts) + ` ${$t("ye")}`
            }}</span>
          </div>
          <!-------------->
        </div>

        <div class="currency__chart currency__chart">
          <span class="card-title">Личная информация</span>
          <div class="row mb-2">
            <span class="bottom__info col-5"> Дата рождения</span>
            <span class="price col-7">{{
              client.attributes.date_of_birth
            }}</span>
          </div>
          <!-------------->
          <div class="row mb-2">
            <span class="bottom__info col-5"> Серия паспорта</span>
            <span class="price col-7">{{
              client.attributes.passport_series
            }}</span>
          </div>
          <!-------------->
          <div class="row mb-2">
            <span class="bottom__info col-5">Место выдачи</span>
            <span class="price col-7">{{
              client.attributes.passport_issued_by
            }}</span>
          </div>
          <!-------------->
          <div class="row mb-2">
            <span class="bottom__info col-5"> Дата выдачи </span>
            <span class="price col-7">{{
              client.attributes.passport_issued_date
            }}</span>
          </div>
          <!-------------->
          <div class="row mb-2">
            <span class="bottom__info col-5"> Адрес </span>
            <span class="price col-7">{{
              client.subject === "legal"
                ? client.attributes.legal_address
                : client.attributes.address_line
            }}</span>
          </div>
          <!-------------->
        </div>
      </div>
      <!--  Tabs  -->
      <base-filter-tabs-content
        :current="currentTab"
        :filter-tab-list="tabs"
        @get-new-content="fetchContentByStatus"
      />
      <b-table
        responsive
        striped
        :busy="showSecondaryLoading"
        :items="items"
        :fields="fields"
        class="table__list mt-4"
        :empty-text="$t('no_data')"
        thead-tr-class="row__head__bottom-border"
        tbody-tr-class="row__body__bottom-border cursor-pointer"
        show-empty
        sort-icon-left
        @row-clicked="contractView"
      >
        <!--!  CONTRACT NUMBER   -->
        <template #cell(contract)="data">
          <span class="d-flex align-items-center">
            <x-square-background
              v-if="data.item.archived"
              padding="0.4"
              class="mr-2 bg-yellow-200"
            >
              <x-icon
                name="archive"
                class="color-yellow-600"
              />
            </x-square-background>
            <x-square-background
              v-if="data.item.type === 'parking'"
              padding="0.4"
              class="mr-2 bg-violet-600"
            >
              <x-icon
                name="local_parking"
                class="color-yellow-400"
              />
            </x-square-background>
            <span>
              {{ data.item.contract_number }}
            </span>
            <!-- <approver-list :approvers="data.item.approved" /> -->
          </span>
        </template>

        <!--   Date   -->
        <template #cell(date)="data">
          <span>{{ dateReverser(data.item.created_at) }}</span>
        </template>

        <!--   Status   -->
        <template #cell(status)="{ item }">
          <span
            class="current__status"
            :class="item.status"
          >
            {{ $t(`contracts.status.${item.status}`) }}
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
            <p class="head">
              {{ $t("contracts_not_found.title") }}
            </p>
            <p>{{ $t("contracts_not_found.description") }}</p>
          </div>
        </template>
      </b-table>
      <div
        v-if="!showLoading && pagination.totalPage"
        class="pagination__vue"
      >
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
            v-model="showByValue"
            :label="false"
            :options="showByOptions"
          >
            <template #output-prefix>
              <span class="show-by-description">
                {{ $t("contracts.show_by") }}:
              </span>
            </template>
          </x-form-select>
        </div>
      </div>
    </template>
    <client-edit
      v-if="showEditForm"
      :edit-item="client"
      :client-options="clientTypesList"
      :country-options="countriesList"
      @close-creating-modal="showEditForm = false"
    />
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

.main__class {
  background-color: white;
  padding: 3rem;
  min-height: 100vh;
  color: var(--gray-600);
}

.go__back {
  width: 56px;
  height: 56px;
  border-radius: 100%;
  background-color: var(--gray-100);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: var(--gray-200);
  }
}

.navigation__content {
  display: flex;
  align-items: center;
  //margin-bottom: 52px;

  .breadcrumb__content {
    display: inline-flex;
    flex-direction: column;
    margin-left: 1rem;
    font-weight: 600;
    font-size: 14px;
    color: #9ca3af;
  }

  .head {
    font-size: 24px;
    line-height: 28px;
    color: #4b5563;

    .contract__number {
      color: var(--violet-600);
    }
  }
}

.delete-comment {
  width: 100%;
  height: 100px;

  &__title {
    font-weight: 600;
    font-size: 18px;
    color: var(--gray-600);
    margin-top: 1.5rem;
  }
}

.warning__before__delete {
  &-head {
    display: flex;
    align-items: center;

    .title {
      font-size: 2.25rem;
      line-height: 42px;
      margin-left: 1rem;
    }
  }

  &-main {
    display: block;
    max-width: 60%;
    font-family: Inter, sans-serif;
    color: var(--gray-600);
    //margin-left: 0.5rem;
  }

  &-footer {
    display: flex;
    gap: 2rem;
  }
}

.reContract-modal {
  & .modal-dialog .modal-content .title {
    font-family: CraftworkSans, serif;
    font-weight: 900;
    font-size: 36px;
    line-height: 42px;
  }

  &__warning {
    display: flex;
    align-items: center;
    padding: 24px;
    column-gap: 12px;
    background: var(--orange-50);
    border-radius: 32px;

    p {
      margin-bottom: 0;
      color: var(--orange-600);
    }
  }

  &__select {
    margin-top: 2rem;
  }
}

.apartment__status {
  font-family: Inter, sans-serif;
  background-color: var(--gray-100);
  border-radius: 2rem;
  font-size: 16px;
  min-width: max-content;
  padding: 1rem 3rem;
  margin: 0 1rem 0 2rem;
}

.cards {
  display: flex;
  gap: 2%;

  .currency__chart {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    //width: 306px;
    //height: 160px;
    max-width: 32%;
    flex-grow: 1;
    border-radius: 32px;
    margin-top: 32px;
    margin-bottom: 2rem;
    background-color: var(--gray-50);
    border: 2px solid var(--gray-200);
    padding: 1.5rem;
  }
}
.card-title {
  font-family: CraftworkSans, serif;
  font-size: 1.25rem;
  font-weight: 900;
  line-height: 14px;
  color: var(--violet-600);
  display: block;
  margin-bottom: 1rem;
  letter-spacing: 1px;
}
.price {
  font-size: 1.25rem;
}
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
</style>
