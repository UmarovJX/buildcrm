<script>
import api from '@/services/api'
import { phonePrettier, sortObjectValues } from '@/util/reusable'
import BaseSearchInput from '@/components/Reusable/BaseSearchInput'
import BaseButton from '@/components/Reusable/BaseButton'
import BaseLoading from '@/components/Reusable/BaseLoading'
import BaseArrowLeftIcon from '@/components/icons/BaseArrowLeftIcon'
import BaseArrowRightIcon from '@/components/icons/BaseArrowRightIcon'
import BaseDownIcon from '@/components/icons/BaseArrowDownIcon'
import { mapGetters } from 'vuex'
import UsersPermission from '@/permission/users'
import AppHeader from '@/components/Header/AppHeader'
import BasePlusIcon from '@/components/icons/BasePlusIcon'
import BaseFilterTabsContent from '@/components/Reusable/BaseFilterTabsContent'
import { XFormSelect, XFormSelectOption } from '@/components/ui-components/form-select'
import { XCircularBackground } from '@/components/ui-components/circular-background'
import { XIcon } from '@/components/ui-components/material-icons'

import { hasOwnProperty } from '@/util/object'
import { isNull } from '@/util/inspect'
import XDropdown from '@/components/ui-components/dropdown/XDropdown.vue'
import Edit from './Modal/Edit'
import Create from './Modal/Create'

export default {
  name: 'UsersPage',
  components: {
    XDropdown,
    XFormSelectOption,
    XIcon,
    XCircularBackground,
    XFormSelect,
    BasePlusIcon,
    AppHeader,
    BaseSearchInput,
    BaseLoading,
    BaseButton,
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
    BaseDownIcon,
    BaseFilterTabsContent,
    'create-modal': Create,
    'edit-modal': Edit,
  },
  data() {
    const showByOptions = []

    for (let number = 10; number <= 50; number += 10) {
      showByOptions.push({
        value: number,
        text: number,
      })
    }

    let { search: searchValue, limit: showByValue } = this.$route.query

    if (!showByValue) {
      showByValue = 20
    }

    const filterTabList = [
      {
        name: 'tab_status.active',
        status: '',
        counts: 0,
      },
      {
        name: 'tab_status.de_active',
        status: 'deactivated',
        counts: 0,
      },
    ]

    return {
      createPermission: UsersPermission.getUsersCreatePermission(),
      editPermission: UsersPermission.getUsersEditPermission(),
      deletePermission: UsersPermission.getUsersDeletePermission(),
      unblockPermission: UsersPermission.getUsersUnblockPermission(),
      searchValue,
      showByOptions,
      filterTabList,
      filter: {},
      page: 1,
      currentPage: 1,
      manager: {},
      manager_id: null,
      editHistoryContext: {
        id: 0,
      },
      sortBy: '',
      sortDesc: false,
      fields: [
        {
          key: 'id',
          label: 'id',
        },
        {
          key: 'blocked_at',
          label: '',
        },
        {
          key: 'first_name',
          label: 'users.name',
          sortable: true,
        },
        {
          key: 'branch',
          label: 'users.branch',
        },
        {
          key: 'objects',
          label: 'users.object',
        },
        {
          key: 'phone',
          label: 'users.phone',
          sortable: true,
          // formatter: (phone) => phonePrettier(phone)
        },
        {
          key: 'role',
          label: 'users.roles',
        },
        {
          key: 'email',
          label: 'users.login',
          sortable: true,
        },
        {
          key: 'actions',
          label: '',
        },
      ],
      tableItems: [],
      loading: false,
      showByValue,
      pagination: {},

      rolesList: [],
      selectRole: null,
    }
  },
  watch: {
    '$route.query': {
      handler() {
        this.fetchUsers()
      },
      deep: true,
    },
    searchValue() {
      this.getUsersListBySearch()
    },
    selectRole(srValue) {
      this.$router.push({
        query: {
          role_id: isNull(srValue) ? undefined : srValue,
        },
      })
    },
  },
  computed: {
    ...mapGetters(['getPermission']),
    countOfItems() {
      return this.tableItems.length
    },
    query() {
      return { ...this.$route.query }
    },
    rolesFilterOption() {
      const { locale } = this.$i18n
      return this.rolesList.map(roleItem => ({
        value: roleItem.id,
        text: roleItem.name[locale],
        count: roleItem.users_count,
      }))
    },
  },
  async created() {
    this.filter = {
      ...this.$route.query,
    }
    this.currentPage = Number(this.filter.page)

    try {
      this.loading = true
      await Promise.allSettled([this.fetchUsers(), this.fetchRoles()])
    } finally {
      this.loading = false
    }
  },
  methods: {
    async fetchRoles() {
      const rolesRsp = await api.roles.fetchRoles()
      this.rolesList = rolesRsp.data
      this.setFilterRole()
    },
    setFilterRole() {
      const hasQueryOfRole = hasOwnProperty(this.$route.query, 'role_id')
      if (hasQueryOfRole) {
        this.selectRole = this.rolesFilterOption.find(
          opt => opt.value === parseInt(this.$route.query.role_id),
        ).value
      }
    },
    fetchContentByStatus(status) {
      const query = { ...this.query }
      if (query.hasOwnProperty('page')) {
        delete query.page
      }

      this.replaceRouter({ ...query, status })
    },
    phoneFormat(value) {
      return phonePrettier(value)
    },
    showByCollapse(item) {
      if (item.toggleCollapse) {
        return item.objects
      }
      return item.objects.slice(0, 3)
    },
    setSearchValue(search) {
      const hasSearchQuery = this.query.hasOwnProperty('search')
      if (search?.length < 3 && hasSearchQuery) {
        this.replaceRouter({})
      }

      if (this.searchValue === search || search.length < 3) return
      this.searchValue = search
    },

    limitChanged() {
      this.changeFetchLimit()
    },
    changeCurrentPage(page) {
      const currentPage = this.query.page
      if (page === currentPage) return
      this.replaceRouter({ ...this.query, page })
    },
    changeFetchLimit() {
      const query = {
        ...this.query,
        page: 1,
      }
      const limit = this.showByValue
      this.replaceRouter({ ...query, limit })
    },

    getUsersListBySearch() {
      const { query, searchValue } = this
      const hasSearchQuery = query.hasOwnProperty('search')
      if (!hasSearchQuery) {
        this.pushRouter({
          search: searchValue,
        })
        return
      }
      query.search = searchValue
      this.pushRouter(query)
    },

    pushRouter(query) {
      const sortQuery = sortObjectValues(query)
      this.$router.push({ query: sortQuery })
    },

    async fetchUsers() {
      const query = sortObjectValues(this.query)
      await api.userV2.getUsersList(query).then(response => {
        this.tableItems = response.data.items.map(item => ({
          ...item,
          toggleCollapse: false,
        }))
        this.pagination = response.data.pagination
        this.showByValue = response.data.pagination.perPage
      })
    },

    replaceRouter(query) {
      const sortQuery = sortObjectValues(query)
      this.$router.replace({ query: sortQuery })
    },

    CreateManager() {
      this.fetchUsers()
    },

    EditManager() {
      this.fetchUsers()
    },

    clickManager(data) {
      this.manager_id = data.item.uuid
      this.editHistoryContext = data.item
    },

    getName(name) {
      const { locale } = localStorage
      let value = ''

      if (locale) {
        switch (locale) {
          case 'ru':
            value = name.ru
            break
          case 'uz':
            value = name.uz
            break
        }
      } else {
        value = name.ru
      }

      return value
    },
    unblockUser(user) {
      this.loading = true
      api.userV2
        .removeUserBlock(user.uuid)
        .then(res => {
          this.toasted(res.data.message, 'success')
          this.fetchUsers()
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          if (!error.response) {
            this.toasted('Error: Network Error', 'error')
          } else {
            this.toasted(error.response.data.error, 'error')
          }
          this.loading = false
        })
    },

    deleteUser(user) {
      this.$swal({
        title: this.$t('sweetAlert.title'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: this.$t('cancel'),
        confirmButtonText: this.$t('sweetAlert.yesPure'),
      }).then(result => {
        if (result.value) {
          this.loading = true
          api.userV2
            .deleteUserFromDB(user)
            .then(response => {
              this.loading = false
              this.toasted(response.data.message, 'success')
              this.fetchUsers()
              this.loading = false
              this.$swal(this.$t('sweetAlert.success'), '', 'success')
            })
            .catch(error => {
              this.loading = false
              if (!error.response) {
                this.toasted('Error: Network Error', 'error')
              } else {
                this.toasted(error.response.data.error, 'error')
              }
            })
        }
      })
    },

    sortingChanged(val) {
      this.filter.sort_by = val.sortBy
      this.filter.order_by = val.sortDesc ? 'desc' : 'asc'
      this.filter.page = 1
      this.currentPage = this.filter.page

      this.$router.push({
        name: 'users',
        query: this.filter,
      })
    },
  },
}
</script>
<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t("users.title") }}
      </template>

      <template #header-actions>
        <div class="content__form__select">
          <x-form-select
            v-if="rolesFilterOption.length"
            id="selectType"
            v-model="selectRole"
            style="min-width: 250px"
            class="w-100"
            value-field="value"
            text-field="text"
            :placeholder="`${$t('filter.by_role')}`"
          >
            <x-form-select-option
              v-for="roleOption in rolesFilterOption"
              :id="roleOption.value"
              :key="roleOption.value"
              :option="roleOption"
            >
              <span class="d-flex">
                <span>{{ roleOption.text }}</span>
                <span
                  v-if="roleOption.count"
                  class="ml-2 bg-violet-600 text-white d-flex align-items-center justify-content-center"
                  style="
                    font-size: 0.75rem;
                    border-radius: 1rem;
                    height: 1rem;
                    min-width: 1rem;
                    padding: 0.75rem;
                  "
                >
                  <span> {{ roleOption.count }} </span>
                </span>
              </span>
            </x-form-select-option>
          </x-form-select>
        </div>
      </template>
    </app-header>

    <!--  Tabs  -->
    <base-filter-tabs-content
      :filter-tab-list="filterTabList"
      @get-new-content="fetchContentByStatus"
    />

    <div class="d-flex align-items-center mt-4 mb-4">
      <base-search-input
        class="w-100"
        :placeholder="$t('users.placeholder')"
        @trigger-input="setSearchValue"
      />
      <base-button
        v-if="createPermission"
        v-b-modal.modal-create
        design="violet-gradient"
        :text="$t('add')"
        class="ml-4"
      >
        <template #left-icon>
          <base-plus-icon fill="#fff" />
        </template>
      </base-button>
    </div>

    <div class="pt-2">
      <b-table
        id="users-table"
        ref="contracts-table"
        v-model:sort-by="sortBy"
        v-model:sort-desc="sortDesc"
        thead-tr-class="row__head__bottom-border"
        tbody-tr-class="row__body__bottom-border"
        class="table__list"
        borderless
        responsive
        show-empty
        sort-icon-left
        :busy="loading"
        :items="tableItems"
        :fields="fields"
        :empty-text="$t('no_data')"
        @sort-changed="sortingChanged"
      >
        <template #table-busy>
          <base-loading />
        </template>

        <template
          #empty="scope"
          class="text-center"
        >
          <div
            class="d-flex justify-content-center align-items-center flex-column not__found"
          >
            <p class="head">
              {{ scope.emptyText }}
            </p>
            <p>Попробуйте ввести другие данные для поиска</p>
          </div>
        </template>

        <template #head()="data">
          <span>{{ $t(data.label) }}</span>
        </template>

        <!-- INDEX COLUMN -->
        <template #cell(id)="data">
          <span>
            {{ data.item.id }}
          </span>
        </template>
        <template #cell(blocked_at)="data">
          <div
            v-if="data.item.blocked_at"
            class="d-flex"
          >
            <x-circular-background
              :id="'blocked_' + data.item.id"
              class="bg-red-500 p-1"
            >
              <x-icon
                name="lock"
                class="color-white"
                size="18"
              />
            </x-circular-background>
            <b-tooltip
              :target="'blocked_' + data.item.id"
              triggers="hover"
              variant="secondary"
            >
              Заблокирован <br>{{ data.item.blocked_at }}
            </b-tooltip>
          </div>
        </template>

        <template #cell(first_name)="data">
          {{ data.item.first_name }} {{ data.item.last_name }}
          {{ data.item.second_name }}
        </template>

        <template #cell(branch)="data">
          {{ data.item.branch.name }}
        </template>

        <template #cell(phone)="data">
          <span class="phone-col">
            {{ phoneFormat(data.item.phone) }}
          </span>
        </template>

        <template #cell(objects)="data">
          <span>
            <span
              v-for="object in showByCollapse(data.item)"
              :key="object.uuid"
            >
              {{ object.name }},
            </span>
            <div
              v-if="data.item.objects.length > 3 && !data.item.toggleCollapse"
              @click="data.item.toggleCollapse = !data.item.toggleCollapse"
            >
              ...
            </div>
          </span>
        </template>

        <template #cell(role)="data">
          {{ getName(data.item.role.name) }}
        </template>

        <template #cell(actions)="data">
          <div class="float-right">
            <x-dropdown v-if="deletePermission || editPermission">
              <!--user.role.id != 1 &&-->
              <b-button
                v-if="editPermission"
                v-b-modal.modal-edit
                class="dropdown-item dropdown-item--inside"
                @click="clickManager(data)"
              >
                <i class="far fa-pen" />
                {{ $t("edit") }}
              </b-button>
              <b-button
                v-if="unblockPermission && data.item.blocked_at"
                v-b-modal.modal-edit
                class="dropdown-item dropdown-item--inside"
                @click="unblockUser(data.item)"
              >
                <i class="far fa-unlock" />
                Разблокировать
              </b-button>

              <b-button
                v-if="deletePermission"
                class="dropdown-item dropdown-item--inside"
                @click="deleteUser(data.item.uuid)"
              >
                <i
                  v-if="query.status === 'deactivated'"
                  class="far fa-trash-undo"
                />
                <i
                  v-else
                  class="far fa-trash"
                />
                {{
                  query.status === "deactivated"
                    ? $t("undelete")
                    : $t("delete")
                }}
              </b-button>
            </x-dropdown>
          </div>
        </template>
      </b-table>
    </div>

    <create-modal
      v-if="createPermission"
      @CreateManager="CreateManager"
    />
    <edit-modal
      v-if="manager_id && editPermission"
      :manager-id="manager_id"
      :edit-history-context="editHistoryContext"
      @EditManager="EditManager"
    />

    <div
      v-if="!loading && countOfItems"
      class="pagination__vue"
    >
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
        <span class="show__by__content">
          <span class="description">{{ $t("contracts.show_by") }}:</span>
          <b-form-select
            v-model="showByValue"
            :options="showByOptions"
            @input="limitChanged"
          />
          <span class="arrow__down">
            <base-down-icon />
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/utils/pagination";
.relative {
  position: relative;
}
.block-info {
  border-radius: 10%;
  width: fit-content;
  position: absolute;
  top: 100%;
  display: none;
  background-color: var(--blue-100);
  padding: 0.3rem 2rem;
}

.search__content {
  margin-top: 0;
}

.base-search-input {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.phone-col {
  display: flex;
  width: max-content;
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
  background-image: url("../../../assets/icons/icon-arrow-down.svg") !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort="descending"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="descending"] {
  background-position: right calc(2rem / 2) center !important;
  background-size: 20px;
  background-image: url("../../../assets/icons/icon-arrow-up.svg") !important;
}

.content__form__select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--gray-100);
  border-radius: 2rem !important;
  border: none;
  color: var(--gray-600);
  position: relative;

  .form__select {
    background-color: transparent;
    border: none;
    color: var(--gray-600);
    margin: 0 1rem;
    width: 100%;
  }

  ::v-deep .x-form-select-main .x-form-select-options {
    max-height: 200px !important;
  }
}
</style>
