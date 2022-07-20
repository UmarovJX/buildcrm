<template>
  <main>
    <div class="d-flex justify-content-end">
      <BaseButton @click="showAddModal" :text="`${ $t('companies.add_company') }`">
        <template #left-icon>
          <BasePlusIcon fill="#7C3AED"/>
        </template>
      </BaseButton>
    </div>
    <create-update-modal
        ref="create-modal"
        class="add_modal"
        @updated-company="updatedCompany"
        @created-new-company="createdNewCompany"
        :history-edit-info="editedItem"
        :modal-properties="modalProperties"
    />
    <companies-list
        :companies="companies"
        @delete-company="deleteCompany"
        @edit-selected-company="openEditingModal"
        @updated-company="updatedCompany"
    />
    <b-overlay :show="loading" no-wrap opacity="0.5" class="loading__overlay">
      <template #overlay>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </template>
    </b-overlay>
  </main>
</template>

<script>
import api from "@/services/api";
import CreateUpdateModal from "./Components/CreateUpdateModal";
import CompaniesList from "@/components/Dashboard/Companies/Components/CompaniesList";
import {isPrimitiveValue, sortObjectValues} from "@/util/reusable";
import BaseButton from "@/components/Reusable/BaseButton";
import BasePlusIcon from "@/components/icons/BasePlusIcon";

export default {
  name: 'Companies',
  components: {
    BasePlusIcon,
    CreateUpdateModal,
    CompaniesList,
    BaseButton,
  },
  mounted() {
    if (this.searchInput?.length) {
      this.toggleClearIcon()
    }
  },
  data() {
    return {
      loading: false,
      companies: [],
      editedItem: {},
      searchInput: this.$route.query.search,
      company_id: false,
      showClearIcon: false,
      activeContent: this.$t('list'),
      modalProperties: {
        position: 'create',
        title: this.$t('companies.add_title'),
      },
      newCompany: {
        type: null,
        name: null,
        director_name: null,
        director_surname: null,
        director_middle_name: null,
        company_address: null,
        phone: null,
        extra_phone: null,
        inn: null,
        mfo: null,
        register_code: null
      },
      breadCrumbs: [
        {
          routeName: this.$route.name,
          textContent: this.$t('companies.title')
        }
      ]
    }
  },
  watch: {
    '$route.query': {
      handler: function () {
        this.fetchCompaniesList()
      },
      deep: true
    },
    searchValue() {
      this.getCompaniesListBySearch()
    }
  },
  async created() {
    await this.fetchCompaniesList()
  },
  computed: {
    query() {
      return Object.assign({}, this.$route.query)
    },
  },
  methods: {
    getInputValue(value) {
      this.searchInput = value
    },
    async fetchCompaniesList() {
      const query = sortObjectValues(this.query)
      this.loading = true
      await api.companies.getCompaniesList(query)
          .then((response) => {
            this.companies = response.data
            this.tableItems = response.data.map(item => ({...item, toggleCollapse: false}))
            this.loading = true
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.loading = false
          })
    },
    showAddModal() {
      this.modalProperties = {
        title: this.$t('companies.addPayment'),
        position: 'create'
      }
      // this.$bvModal.show('modal-create')
      this.$refs['create-modal'].show()
    },
    fetchContentByStatus(status) {
      const query = Object.assign({}, this.query)
      if (query.hasOwnProperty('page')) {
        delete query.page
      }
      this.replaceRouter({...query, status})
    },
    openEditingModal(item) {
      this.modalProperties = {
        title: this.$t('edit'),
        position: 'edit'
      }
      this.$bvModal.show('modal-create')
      this.editedItem = {...item}
    },
    createdNewCompany({message}) {
      this.fetchCompaniesList(false)
      this.$swal({
        title: this.$t("sweetAlert.success_create_company"),
        text: message,
        icon: "success",
        showCancelButton: false,
        confirmButtonText: this.$t("next"),
      })
    },

    updatedCompany({message}) {
      this.fetchCompaniesList(false)
      this.$swal({
        title: this.$t("sweetAlert.success_update_company"),
        text: message,
        icon: "success",
        showCancelButton: false,
        confirmButtonText: this.$t("next"),
      });
    },

    async deleteCompany(id) {
      await api.companies.deleteCompany(id)
          .then((response) => {
            const {message} = response.data
            this.fetchCompaniesList(false)
            this.$swal({
              title: this.$t("sweetAlert.success_delete_company"),
              text: message,
              icon: "success",
              showCancelButton: false,
              confirmButtonText: this.$t("next"),
            })
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
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
    setSearchValue(search) {
      const hasSearchQuery = this.query.hasOwnProperty('search')
      if (search?.length < 3 && hasSearchQuery) {
        this.replaceRouter({})
      }

      if (this.searchValue === search || search.length < 3) return
      this.searchValue = search
    },
    getCompaniesListBySearch() {
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
    addModalOpened() {
      const haveInRouteQuery = (property) => {
        const query = Object.assign({}, this.query)
        const hasOwnProperty = query.hasOwnProperty(property)
        if (hasOwnProperty)
          return query[property]
        return false
      }

      for (let property of Object.keys(this.filter)) {
        const query = haveInRouteQuery(property)
        if (property === 'apartment_number' && typeof query === 'string') {
          const toNumber = parseInt(query)
          this.filter[property] = isNaN(toNumber) ? [] : [toNumber]
          continue
        }

        /*if (property === 'object_id' && query) {
          if (Array.isArray(query)) {
            this.filter[property] = parseInt(query[0])
          } else {
            this.filter[property] = parseInt(query)
          }
          continue
        }*/

        if (property === 'object_id' && query) {
          if (isPrimitiveValue(query)) {
            this.filter[property] = [parseInt(query)]
          } else {
            this.filter[property] = query.map(value => parseInt(value))
          }
          continue
        }

        if (query) this.filter[property] = query
      }
    }
  }
}
</script>

<style scoped lang="scss">
.exit {
  padding: 7px;
  border-radius: 100%;
  background-color: var(--gray-100);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.search__content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  &-input {
    width: 50%;
    height: 3.5rem;
    border-radius: 2rem;
    background-color: var(--gray-100);
    display: flex;
    align-items: center;
    padding-left: 1.25rem;
    position: relative;
  }

  &-add {
    height: 100%;
    width: 250px;
    border-radius: 2rem;
    padding: 1rem 1.5rem;
    background-color: var(--gray-100);
    margin-left: 0.5rem;
    cursor: pointer;

    .plus__icon {
      margin-right: 1.25rem;
    }
  }

  input {
    width: 100%;
    background-color: transparent;
    margin-left: 1.25rem;
    height: 100%;
    outline: none;
    border: none;
    font-weight: 700;
    color: var(--gray-600);

    &::placeholder {
      font-weight: 600;
      color: var(--gray-400);
    }
  }
}

</style>
