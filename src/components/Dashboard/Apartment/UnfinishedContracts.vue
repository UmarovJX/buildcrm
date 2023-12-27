<script>
import { mapActions, mapGetters } from 'vuex'
// import SuccessAgree from "./Components/SuccessAgree";
import BaseBreadCrumb from '@/components/BaseBreadCrumb'
import api from '@/services/api'
import XDropdown from "@/components/ui-components/dropdown/XDropdown.vue";

export default {
  components: {
    XDropdown,
    // "success-agree": SuccessAgree,
    BaseBreadCrumb,
  },

  data() {
    return {
      page: 1,
      fields: [
        {
          key: 'contract_number',
          label: 'Contract Number',
          sortable: true,
        },
        {
          key: 'created_by',
          label: 'First Name',
          sortable: true,
        },
        {
          key: 'created_by.phone',
          label: 'Phone',
          sortable: true,
        },
        {
          key: 'expiry_at',
          label: 'Expiry at',
          sortable: true,
        },
        {
          key: 'actions',
          label: '',
        },
      ],
      sortBy: '',
      items: [],
      sortDesc: false,
      currentPage: 1,
      scrollActive: true,
      getLoading: true,
      header: {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      },
    }
  },

  computed: {
    ...mapGetters(['getApartments', 'getPermission', 'getMe']),
    breadCrumbs() {
      return [
        {
          routeName: 'objects',
          textContent: this.$t('objects.title'),
        },
      ]
    },
    activeContent() {
      return this.$t('objects.unfinished_contract')
    },
  },
  mounted() {
    this.getUnfinishedOrders()
  },

  methods: {
    ...mapActions(['fetchApartments', 'fetchReserveClient']),
    async getUnfinishedOrders() {
      this.getLoading = true
      await api.orders
        .fetchUnfinishedOrders()
        .then(res => {
          if (res) {
            this.items = res.data
          }
        })
        .finally(() => {
          this.getLoading = false
        })
    },
    cancelContract(id) {
      this.$swal({
        title: this.$t('sweetAlert.title'),
        text: this.$t('sweetAlert.text_cancel_agree'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: this.$t('cancel'),
        confirmButtonText: this.$t('sweetAlert.yes_close'),
      }).then(result => {
        if (result.value) {
          this.expiredConfirm(id)
        }
      })
    },
    async expiredConfirm(id) {
      this.getLoading = true
      try {
        await api.orders
          .deactivateOrderHold(id)
          .then(() => {
            this.getUnfinishedOrders()
          })
          .catch(() => {
            this.getLoading = false
          })
      } catch (error) {
        this.getLoading = false
        if (!error.response) {
          this.toasted('Error: Network Error', 'error')
        } else if (error.response.status === 403) {
          this.toasted(error.response.data.message, 'error')
        } else if (error.response.status === 401) {
          this.toasted(error.response.data.message, 'error')
        } else if (error.response.status === 500) {
          this.toasted(error.response.data.message, 'error')
        } else {
          this.toasted(error.response.data.message, 'error')
        }
      }
    },
    CloseAgree() {
      this.confirm = false
    },

    async successAgree(value) {
      this.contract = value
      await this.fetchApartments(this)
      // this.$bvModal.show("modal-success-agree");
      this.selected.confirm = false
      this.selected.view = false
      this.selected.values = []
      this.selectable = true
    },
  },
}
</script>

<template>
  <div class="apartment-list-filter">
    <base-bread-crumb
      :bread-crumbs="breadCrumbs"
      :active-content="activeContent"
    />
    <div class="mt-4">
      <b-table
        id="my-table"
        ref="apartment-list-table"
        v-model:sort-by="sortBy"
        v-model:sort-desc="sortDesc"
        class="custom-table"
        sticky-header
        borderless
        show-empty
        responsive
        sort-icon-left
        :items="items"
        :fields="fields"
        :empty-text="$t('no_data')"
      >
        <template
          #empty="scope"
          class="text-center"
        >
          <span class="d-flex justify-content-center align-items-center">{{
            scope.emptyText
          }}</span>
        </template>

        <template #cell(created_by)="data">
          <span v-if="data.item.created_by">
            {{ data.item.created_by.first_name }}
            {{ data.item.created_by.last_name }}
          </span>
        </template>

        <template #cell(expiry_at)="data">
          <span>{{ $moment(data.item.expiry_at).format("DD.MM.YYYY") }}</span>
        </template>

        <template #cell(actions)="data">
          <div class="float-right">
            <x-dropdown>
              <!--  Продолжить оформление -->
              <router-link
                  :to="{
                    name: 'confirm-apartment',
                    params: {
                      id: data.item.uuid,
                      object: data.item.apartments[0].object.id,
                    },
                  }"
                  :class="'dropdown-item dropdown-item--inside'"
              >
                <i class="far fa-eye" />
                Продолжить оформление
              </router-link>

              <!-- Отменить -->
              <b-link
                  class="dropdown-item dropdown-item--inside"
                  @click="cancelContract(data.item.uuid)"
              >
                <i class="far fa-trash text-danger" /> Отменить оформление
              </b-link>
            </x-dropdown>
          </div>
        </template>
      </b-table>

      <b-overlay
        :show="getLoading"
        no-wrap
        opacity="0.5"
        style="z-index: 2222"
      >
        <template #overlay>
          <div class="d-flex justify-content-center w-100">
            <div class="lds-ellipsis">
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        </template>
      </b-overlay>
    </div>

    <div>
      <!-- <success-agree :contract="contract"></success-agree> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.dropdown-menu .active {
  background: transparent;
}

table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--background-color-nav);
}

.my-table thead tr th {
  padding-top: 20px;
  padding-bottom: 20px;
}

table tbody th {
  position: relative;
}

table tbody th {
  position: sticky;
  left: 0;
  z-index: 1;
}

.apartment-list-filter {
  @media screen and (max-width: 576px) {
    .btn {
      width: 100%;
    }
  }
}
</style>
