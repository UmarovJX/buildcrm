<template>
  <main>
    <div class="app-content">

      <div class="d-flex align-items-center">
        <base-search-input placeholder="ФИО, телефон, email" @trigger-input="setSearchValue"/>
        <base-button v-if="getPermission.users && getPermission.users.create"
                     design="violet-gradient mb-3"
                     :text="$t('add')"
                     v-b-modal.modal-create>
          <template #left-icon>
            <i class="fal fa-plus mr-2"></i>
          </template>
        </base-button>
      </div>

      <div class="pt-2">
        <b-table
            thead-tr-class="row__head__bottom-border"
            tbody-tr-class="row__body__bottom-border"
            ref="contracts-table"
            id="users-table"
            class="table__list"
            borderless
            responsive
            show-empty
            sort-icon-left
            :busy="loading"
            @sort-changed="sortingChanged"
            :items="tableItems"
            :fields="fields"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :empty-text="$t('no_data')"
        >

          <template #table-busy>
            <base-loading/>
          </template>

          <template #empty="scope" class="text-center">
            <div class="d-flex justify-content-center align-items-center flex-column not__found">
              <p class="head">{{ scope.emptyText }}</p>
              <p>Попробуйте ввести другие данные для поиска</p>
            </div>
          </template>


          <!-- INDEX COLUMN -->
          <template #cell(id)="data">
            <span>
              {{ data.item.id }}
            </span>
          </template>

          <template #cell(first_name)="data">
            {{ data.item.first_name }} {{ data.item.last_name }} {{ data.item.second_name }}
          </template>

          <template #cell(branch)="data">
            {{ data.item.branch.name }}
          </template>

          <template #cell(objects)="data">

            <span>
              <span v-for="object in showByCollapse(data.item)" :key="object.uuid">
                {{ object.name }},
              </span>
              <div v-if="data.item.objects.length > 3 && !data.item.toggleCollapse"
                   @click="data.item.toggleCollapse = !data.item.toggleCollapse">...</div>
            </span>

          </template>

          <template #cell(role)="data">
            {{ getName(data.item.role.name) }}
          </template>

          <template #cell(actions)="data">
            <div class="float-right">
              <div
                  class="dropdown my-dropdown dropleft"
              >
                <!--user.role.id != 1 &&-->
                <button
                    type="button"
                    class="dropdown-toggle"
                    data-toggle="dropdown"
                >
                  <i class="far fa-ellipsis-h"></i>
                </button>

                <div
                    class="dropdown-menu"
                >
                  <b-button
                      @click="clickManager(data)"
                      class="dropdown-item dropdown-item--inside"
                      v-b-modal.modal-edit
                  >
                    <i class="fas fa-pen"></i>
                    {{ $t("edit") }}
                  </b-button>

                  <b-button
                      class="dropdown-item dropdown-item--inside"
                      @click="Delete(data.item.uuid)"
                  >
                    <i class="far fa-trash"></i> {{ $t("delete") }}
                  </b-button>
                </div>
              </div>
            </div>
          </template>
        </b-table>
      </div>

      <create-modal
          v-if="getPermission.users && getPermission.users.create"
          @CreateManager="CreateManager"
      ></create-modal>
      <edit-modal
          v-if="manager_id && getPermission.users.update"
          :manager-id="manager_id"
          :edit-history-context="editHistoryContext"
          @EditManager="EditManager"
      ></edit-modal>

      <div v-if="!loading && countOfItems" class="pagination__vue">
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
    </div>

  </main>

</template>

<script>
import Create from "./Modal/Create";
import Edit from "./Modal/Edit";
import api from "@/services/api";
import {sortObjectValues} from "@/util/reusable";
import BaseSearchInput from "@/components/Reusable/BaseSearchInput";
import BaseButton from "@/components/Reusable/BaseButton"
import BaseLoading from "@/components/Reusable/BaseLoading"
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseDownIcon from "@/components/icons/BaseArrowDownIcon";
import {mapGetters} from "vuex";


export default {
  name: 'Users',
  components: {
    BaseSearchInput,
    BaseLoading,
    BaseButton,
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
    BaseDownIcon,
    "create-modal": Create,
    "edit-modal": Edit,
  },

  created() {
    this.filter = {
      ...this.$route.query,
    }
    this.currentPage = Number(this.filter.page)
  },
  data() {

    const showByOptions = []

    for (let number = 10; number <= 50; number += 10) {
      showByOptions.push({
        value: number,
        text: number
      })
    }

    let {search: searchValue, limit: showByValue} = this.$route.query

    if (!showByValue) {
      showByValue = 20
    }
    return {
      searchValue,
      showByOptions,
      filter: {},
      page: 1,
      currentPage: 1,
      manager: {},
      manager_id: null,
      editHistoryContext: {
        id: 0
      },
      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },
      sortBy: "",
      sortDesc: false,
      fields: [
        {
          key: "id",
          label: "#",
        },
        {
          key: "first_name",
          label: this.$t("users.name"),
          sortable: true,
        },
        {
          key: "branch",
          label: this.$t("users.branch"),
        },
        {
          key: "objects",
          label: this.$t("users.object"),
        },
        {
          key: "phone",
          label: this.$t("users.phone"),
          sortable: true,
        },
        {
          key: "role",
          label: this.$t("users.roles"),
        },
        {
          key: "email",
          label: this.$t("users.login"),
          sortable: true,
        },
        {
          key: "actions",
          label: "",
        },
      ],
      tableItems: [],
      loading: false,
      showByValue,
      pagination: {},
    };
  },
  watch: {
    '$route.query': {
      handler: function () {
        this.fetchUsers()
      },
      deep: true
    },
    searchValue() {
      this.getUsersListBySearch()
    }
  },
  computed: {
    ...mapGetters(["getPermission"]),

    countOfItems() {
      return this.tableItems.length
    },
    query() {
      return Object.assign({}, this.$route.query)
    },
  },

  mounted() {
    this.fetchUsers();
  },

  methods: {
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
      this.replaceRouter({...this.query, page})
    },
    changeFetchLimit() {
      const query = {
        ...this.query, page: 1
      }
      const limit = this.showByValue
      this.replaceRouter({...query, limit})
    },

    getUsersListBySearch() {
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

    pushRouter(query) {
      const sortQuery = sortObjectValues(query)
      this.$router.push({query: sortQuery})
    },

    async fetchUsers() {
      const query = sortObjectValues(this.query)
      this.loading = true
      await api.userV2.getUsersList(query)
          .then((response) => {
            this.tableItems = response.data.items.map(item => ({...item, toggleCollapse: false}))
            this.pagination = response.data.pagination
            this.showByValue = response.data.pagination.perPage
            this.loading = true
          }).finally(() => {
            this.loading = false
          })
    },

    replaceRouter(query) {
      const sortQuery = sortObjectValues(query)
      this.$router.replace({query: sortQuery})
    },


    CreateManager() {
      this.fetchUsers();
    },

    EditManager() {
      this.fetchUsers();
    },

    clickManager(data) {
      // console.log(data);
      this.manager_id = data.item.uuid;
      this.editHistoryContext = data.item
    },

    getName(name) {
      let locale = localStorage.locale;
      let value = "";

      if (locale) {
        switch (locale) {
          case "ru":
            value = name.ru;
            break;
          case "uz":
            value = name.uz;
            break;
        }
      } else {
        value = name.ru;
      }

      return value;
    },

    Delete(user) {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes"),
      }).then((result) => {
        if (result.value) {
          this.loading = true
          api.userV2.deleteUserFromDB(user)
              .then((response) => {
                this.loading = false
                this.toasted(response.data.message, "success");
                this.fetchUsers();
                this.loading = false
                this.$swal(this.$t("sweetAlert.deleted"), "", "success");
              })
              .catch((error) => {
                this.loading = false
                if (!error.response) {
                  this.toasted("Error: Network Error", "error");
                } else {
                  this.toasted(error.response.data.error, "error");
                }
              });
        }
      });
    },

    sortingChanged(val) {
      this.filter.sort_by = val.sortBy;
      this.filter.order_by = val.sortDesc ? "desc" : "asc";
      this.filter.page = 1;
      this.currentPage = this.filter.page;

      this.$router.push({
        name: "users",
        query: this.filter,
      });
    },

  }
  ,
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/pagination";

.search__content {
  margin-top: 0;
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


  .table.b-table[aria-busy=true] {
    opacity: 1 !important;
  }
}


::v-deep .table.b-table > thead > tr > [aria-sort="none"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="none"] {
  background-position: right calc(2rem / 2) center !important;
  //background-position: right !important;
  padding-right: 20px;
}

::v-deep .table.b-table > thead > tr > [aria-sort=ascending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=ascending] {
  background-position: right calc(2rem / 2) center !important;
  background-size: 20px;
  background-image: url("../../../assets/icons/icon-arrow-down.svg") !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort=descending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=descending] {
  background-position: right calc(2rem / 2) center !important;
  background-size: 20px;
  background-image: url("../../../assets/icons/icon-arrow-up.svg") !important;
}


</style>