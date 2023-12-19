<script>
import '@fancyapps/ui/dist/fancybox.css'
import { mapGetters, mapMutations } from 'vuex'
import clickOutside from '@/directives/click-outside'

import AppHeader from '@/components/Header/AppHeader'
import BaseArrowLeftIcon from '@/components/icons/BaseArrowLeftIcon'
import BaseArrowRightIcon from '@/components/icons/BaseArrowRightIcon'
import BaseArrowLeft from '@/components/icons/BaseArrowLeftIcon'
import BaseButton from '@/components/Reusable/BaseButton'

import { XFormSelect } from '@/components/ui-components/form-select'
import { XFormInput } from '@/components/ui-components/form-input'

import { v3ServiceApi } from '@/services/v3/v3.service'
import { XIcon } from '@/components/ui-components/material-icons'
import { XCircularBackground } from '@/components/ui-components/circular-background'

export default {
  name: 'BadContracts',
  components: {
    BaseButton,
    XIcon,
    XCircularBackground,
    XFormSelect,
    XFormInput,
    BaseArrowRightIcon,
    BaseArrowLeftIcon,
    BaseArrowLeft,

    AppHeader,
  },
  directives: {
    clickOutside,
  },
  data() {
    return {
      showLoading: false,
      items: [],
      pagination: {},

      currentRow: null,
      currentValue: undefined,
      currentId: null,
      contractOptions: [],
      showOptions: false,
      timer: null,
      statistics: null,

      isUpdatingContract: false,

      iSet: false,

      totalPage: 0,
      showByValue: +this.$route.query.limit || 20,
      showByOptions: [10, 20, 30, 40, 50].map(el => ({
        value: el,
        text: el,
      })),

      fields: [
        {
          key: 'contract',
          label: this.$t('Договор'),
          thStyle: 'width: 20%',
        },
        {
          key: 'count',
          label: this.$t('Кол-во оплат'),
          thStyle: 'width: 20%',
        },
        {
          key: 'total_amount',
          label: this.$t('Общая сумма'),
          thStyle: 'width: 20%',
        },
        {
          key: 'actions',
          label: '',
        },
      ],

      statisticsFields: [
        {
          key: 'name',
          label: '',
        },
        {
          key: 'count',
          label: 'Количество',
          thStyle: 'text-align: right;',
        },
        {
          key: 'sum',
          label: 'Общая сумма',
          thStyle: 'text-align: right;',
        },
      ],
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['getLoading', 'getPermission']),
    query() {
      return { ...this.$route.query }
    },
  },
  watch: {
    '$route.query': {
      handler(value) {
        if (value) {
          this.fetchItems()
        }
      },
      deep: true,
    },
    showByValue() {
      const l = this.query.limit
      if (l === this.showByValue) return
      this.$router.replace({
        query: { ...this.query, page: 1, limit: this.showByValue },
      })
    },
    currentValue(val) {
      this.showOptions = false
      if (this.timer) clearTimeout(this.timer)
      if (this.iSet) return (this.iSet = false)
      this.currentId = null
      this.timer = setTimeout(() => {
        v3ServiceApi.orders
          .contractFilterList({ contract: val })
          .then(res => {
            this.contractOptions = res.data.result
            this.showOptions = true
          })
      }, 500)
    },
  },
  mounted() {
    this.fetchItems()
    this.fetchStatistics()
  },
  methods: {
    closeDropdown() {
      this.showOptions = false
    },
    fetchStatistics() {
      const l = {
        total: 'Всего',
        success: 'Успешные',
        failed: 'Неуспешные',
      }
      v3ServiceApi.orders.statisticsTotal().then(
        res => (this.statistics = ['total', 'success', 'failed'].map(el => ({
          name: l[el],
          count: res.data.result.count[el],
          sum: res.data.result.sum[el],
        }))),
      )
    },
    fixContract() {
      this.isUpdatingContract = true
      v3ServiceApi.orders
        .bulkUpdate(this.currentRow.contract, this.currentId)
        .then(() => {
          this.toasted(`${this.$t('success')}`, 'success')
          this.currentRow = null
          this.nullify()
          this.fetchItems()
        })
        .catch(e => this.toastedWithErrorCode(e))
        .finally(() => {
          this.isUpdatingContract = false
        })
    },
    chooseContract(c) {
      this.currentValue = c.contract_number
      this.currentId = c.id
      this.showOptions = false
      this.iSet = true
    },
    startEdit(i) {
      this.currentRow = i
      this.nullify()
    },
    nullify() {
      this.currentValue = undefined
      this.currentId = null
      this.contractOptions = []
      this.showOptions = false
    },
    handleRowClick(item) {
      this.$router.push({
        name: 'bad-contract-details',
        params: { contract: item.contract },
      })
    },
    changeFetchLimit() {
      const query = {
        ...this.query,
        page: this.query.page || 1,
      }
      const limit = this.showByValue
      this.$router.replace({ query: { ...query, limit } })
    },
    changeCurrentPage(page) {
      const currentPage = this.query.page
      if (+page === +currentPage) return
      const query = {
        ...this.query,
        page,
      }
      const limit = this.query.limit || 20
      this.$router.replace({ query: { ...query, page, limit } })
    },
    ...mapMutations(['updateLoading']),
    async fetchItems() {
      this.showLoading = true
      v3ServiceApi.orders
        .findAll({
          page: this.$route.query.page || 1,
          limit: this.$route.query.limit || 20,
        })
        .then(res => {
          this.items = res.data.result
          this.pagination = res.data.pagination
        })
        .catch(e => {
          this.toastedWithErrorCode(e)
        })
        .finally(() => (this.showLoading = false))
    },
  },
}
</script>

<template>
  <div>
    <app-header>
      <template #header-title>
        <div
          class="go__back"
          @click="$router.go(-1)"
        >
          <BaseArrowLeft
            :width="32"
            :height="32"
          />
        </div>
        {{ $t("Проблемные Оплаты") }}
      </template>
      <template #header-actions>
        <div class="statistics position-relative">
          <base-button
            id="statistics"
            text="Статистика"
          />
          <div
            class="statistics-detail position-absolute options-container"
            style="
              right: 0;
              top: 100%;
              min-width: 400px;
              overflow: hidden;
              height: 200px;
            "
          >
            <b-table
              thead-tr-class="row__head__bottom-border"
              tbody-tr-class="row__body__bottom-border cursor-pointer"
              class="table__list"
              sticky-header
              show-empty
              borderless
              responsive
              :items="statistics"
              :empty-text="$t('no_data')"
              :fields="statisticsFields"
              :busy="showLoading"
              @row-clicked="handleRowClick"
            >
              <template #cell(name)="{ item }">
                <div class="text-capitalize">
                  {{ item.name }}
                </div>
              </template>
              <template #cell(sum)="{ item }">
                <div class="text-right">
                  {{ item.sum.toLocaleString("en") }}
                </div>
              </template>
              <template #cell(count)="{ item }">
                <div class="text-right">
                  {{ item.count.toLocaleString("en") }}
                </div>
              </template>
            </b-table>
          </div>
        </div>
      </template>
    </app-header>

    <div>
      <div class="mt-4">
        <b-table
          thead-tr-class="row__head__bottom-border"
          tbody-tr-class="row__body__bottom-border"
          class="table__list"
          sticky-header
          show-empty
          borderless
          responsive
          :items="items"
          :empty-text="$t('no_data')"
          :fields="fields"
          :busy="showLoading"
        >
          <template
            #empty="scope"
            class="text-center"
          >
            <div class="d-flex justify-content-center align-items-center">
              {{ scope.emptyText }}
            </div>
          </template>
          <template #table-busy>
            <div class="d-flex justify-content-center w-100">
              <div class="lds-ellipsis">
                <div />
                <div />
                <div />
                <div />
              </div>
            </div>
          </template>
          <template #cell(contract)="{ item }">
            <div
              class="cursor-pointer"
              @click="handleRowClick(item)"
            >
              {{ item.contract }}
            </div>
          </template>
          <template #cell(count)="{ item }">
            <div
              class="cursor-pointer"
              @click="handleRowClick(item)"
            >
              {{ item.count.toLocaleString("en-GB") }}
            </div>
          </template>
          <template #cell(total_amount)="{ item }">
            <div
              class="cursor-pointer"
              @click="handleRowClick(item)"
            >
              {{ item.total_amount.toLocaleString("en-GB") }} {{ $t("ye") }}
            </div>
          </template>

          <template #cell(actions)="{ item }">
            <div
              class="d-flex justify-content-end align-items-center"
              @click.stop
            >
              <template v-if="item === currentRow">
                <div
                  v-click-outside="closeDropdown"
                  class="position-relative w-100"
                >
                  <x-form-input
                    v-model="currentValue"
                    class="mr-2"
                    :disabled="isUpdatingContract"
                  />
                  <div
                    v-if="showOptions && contractOptions.length > 0"
                    class="w-75 position-absolute options-container"
                  >
                    <div
                      v-for="c of contractOptions"
                      :key="c.id"
                      class="contract-option"
                      @click="chooseContract(c)"
                    >
                      {{ c.contract_number }}
                    </div>
                  </div>
                </div>
                <div class="">
                  <x-circular-background
                    class="cursor-pointer"
                    :class="currentId ? 'bg-violet-600' : 'bg-violet-400'"
                    @click="fixContract()"
                  >
                    <span
                      v-if="isUpdatingContract"
                      class="animation"
                    >
                      <svg
                        :width="30"
                        :height="30"
                        viewBox="0 0 64 64"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32ZM8.96 32C8.96 44.7246 19.2754 55.04 32 55.04C44.7246 55.04 55.04 44.7246 55.04 32C55.04 19.2754 44.7246 8.96 32 8.96C19.2754 8.96 8.96 19.2754 8.96 32Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M32 4.48C32 2.00577 34.0154 -0.0321753 36.4654 0.313092C39.1321 0.688898 41.7468 1.40069 44.2459 2.43586C48.1283 4.04401 51.6559 6.40111 54.6274 9.37259C57.5989 12.3441 59.956 15.8717 61.5641 19.7541C62.5993 22.2532 63.3111 24.8679 63.6869 27.5346C64.0322 29.9846 61.9942 32 59.52 32V32C57.0458 32 55.0839 29.9758 54.6058 27.5482C54.3121 26.0566 53.8707 24.5942 53.2862 23.183C52.1283 20.3876 50.4312 17.8477 48.2917 15.7083C46.1523 13.5688 43.6124 11.8717 40.817 10.7138C39.4058 10.1293 37.9434 9.68792 36.4519 9.39419C34.0242 8.91611 32 6.95423 32 4.48V4.48Z"
                          fill="#7C3AED"
                        />
                      </svg>
                    </span>
                    <x-icon
                      v-else
                      name="save"
                      class="color-white"
                      size="28"
                    />
                  </x-circular-background>
                </div>
              </template>

              <template v-else>
                <div title="save">
                  <x-circular-background
                    class="bg-violet-600 cursor-pointer"
                    @click="startEdit(item)"
                  >
                    <x-icon
                      name="attach_file"
                      class="color-white"
                      size="28"
                    />
                  </x-circular-background>
                </div>
              </template>
            </div>
          </template>
        </b-table>
        <div
          v-if="!showLoading && pagination.totalPage"
          class="pagination__vue"
        >
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
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/utils/pagination.scss";
.animation {
  animation: 1s spin infinite linear;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.statistics-detail {
  display: none;
}
.statistics:hover .statistics-detail {
  display: block;
}
.label {
  color: #7c3aed;
  margin-right: 3px;
  font-weight: 500;
}

.fal {
  font-weight: 500;
}

.text {
  font-weight: 600;
}

.button {
  height: auto;
  background-color: #7c3aed;
  width: auto;
  padding: 8px;

  ::v-deep span {
    margin-left: 0 !important;
  }
}

.actions {
  display: flex;
  gap: 16px;
}

.search__content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}

::v-deep .row__head__bottom-border {
  border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .row__body__bottom-border:not(:last-child) {
  border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .table__list {
  min-height: 250px;
  max-height: none;

  table {
    color: var(--gray-600);

    thead tr th {
      font-family: CraftworkSans, serif;
      font-weight: 900;
      font-size: 14px;
      line-height: 14px;
      letter-spacing: 1px;
      color: var(--gray-400) !important;
      padding: 1.125rem 1rem;
      vertical-align: middle;

      //&.b-table-sort-icon-left {
      //display: flex;
      //align-items: center;
      //}
    }

    td {
      font-family: Inter, sans-serif;
      font-size: 1rem;
      line-height: 22px;
      font-weight: 600;
      vertical-align: middle;
    }
  }

  .table.b-table[aria-busy="true"] {
    opacity: 1 !important;
  }
}

::v-deep .table.b-table > thead > tr > [aria-sort="none"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="none"] {
  background-position: right calc(2rem / 2) center !important;
  //background-position: right !important;
  padding-right: 20px;
}

::v-deep .table.b-table > thead > tr > [aria-sort="ascending"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="ascending"] {
  background-position: right calc(2rem / 2) center !important;
  background-size: 20px;
  background-image: url("../../assets/icons/icon-arrow-down.svg") !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort="descending"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="descending"] {
  background-position: right calc(2rem / 2) center !important;
  background-size: 20px;
  background-image: url("../../assets/icons/icon-arrow-up.svg") !important;
}

.options-container {
  border: 1px solid #e5e7eb;
  -webkit-box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
  border-radius: 24px;
  background-color: white;
  z-index: 20;
  max-height: 260px;
  overflow-y: auto;
}
.contract-option {
  margin: 8px;
  cursor: pointer;
  padding: 1rem;
  border-radius: 1rem;
  font-weight: 600;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
}
.contract-option:hover {
  background-color: var(--violet-100);
  color: var(--violet-600);
}
</style>
