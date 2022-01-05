<template>
  <main>
    <div class="app-content apartment-list-filter">
      <div class="mt-4">
        <b-table
          ref="apartment-list-table"
          id="my-table"
          class="custom-table"
          sticky-header
          borderless
          show-empty
          responsive
          sort-icon-left
          :items="items"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :empty-text="$t('no_data')"
        >
          <template #empty="scope" class="text-center">
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
            <span>{{
                $moment(data.item.expiry_at).format("DD.MM.YYYY"),
            }}</span>
          </template>

          <template #cell(actions)="data">
            <div class="float-right">
              <div class="dropdown my-dropdown dropleft">
                <button
                  type="button"
                  class="dropdown-toggle"
                  data-toggle="dropdown"
                >
                  <i class="far fa-ellipsis-h"></i>
                </button>

                <div class="dropdown-menu">
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
                    <i class="far fa-eye"></i>
                    Продолжить оформление
                  </router-link>

                  <!-- Отменить -->
                  <b-link
                    class="dropdown-item dropdown-item--inside"
                    @click="cancelContract(data.item.uuid)"
                  >
                    <i class="far fa-trash text-danger"></i> Отменить оформление
                  </b-link>
                </div>
              </div>
            </div>
          </template>
        </b-table>

        <b-overlay :show="getLoading" no-wrap opacity="0.5" style="z-index: 2222">
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
      </div>

      <div>
        <!-- <success-agree :contract="contract"></success-agree> -->
      </div>
    </div>
  </main>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
// import SuccessAgree from "./Components/SuccessAgree";

export default {
  components: {
    // "success-agree": SuccessAgree,
  },

  data() {
    return {
      page: 1,
      fields: [
        {
          key: "contract_number",
          label: "Contract Number",
          sortable: true,
        },
        {
          key: "created_by",
          label: "First Name",
          sortable: true,
        },
        {
          key: "created_by.phone",
          label: "Phone",
          sortable: true,
        },
        {
          key: "expiry_at",
          label: "Expiry at",
          sortable: true,
        },
        {
          key: "actions",
          label: "",
        },
      ],
      sortBy: "",
      items: [],
      sortDesc: false,
      currentPage: 1,
      scrollActive: true,
      getLoading: true,
      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },
    };
  },

  computed: {
    ...mapGetters(["getApartments", "getPermission", "getMe"]),
  },
  mounted() {
    this.getUnfinishedOrders();
  },

  methods: {
    ...mapActions(["fetchApartments", "fetchReserveClient"]),
    async getUnfinishedOrders() {
      this.getLoading = true;
      await this.axios
        .get(process.env.VUE_APP_URL + "/orders/hold", this.header)
        .then((res) => {
          if (res) {
            this.items = res.data;
          }
          this.getLoading = false;
        })
        .catch(() => {
          this.getLoading = false;
        });
    },
    cancelContract(id) {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_cancel_agree"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes_close"),
      }).then((result) => {
        if (result.value) {
          this.expiredConfirm(id);
        }
      });
    },
    async expiredConfirm(id) {
      this.getLoading = true;
      try {
        await this.axios
          .delete(process.env.VUE_APP_URL + `/orders/${id}/hold/`, this.header)
          .then(() => {
            this.getUnfinishedOrders();
          })
          .catch(() => {
            this.getLoading = false;
          });
      } catch (error) {
        this.getLoading = false;
        if (!error.response) {
          this.toasted("Error: Network Error", "error");
        } else {
          if (error.response.status === 403) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 401) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 500) {
            this.toasted(error.response.data.message, "error");
          } else {
            this.toasted(error.response.data.message, "error");
          }
        }
      }
    },
    CloseAgree() {
      this.confirm = false;
    },

    async successAgree(value) {
      this.contract = value;
      await this.fetchApartments(this);
      // this.$bvModal.show("modal-success-agree");
      this.selected.confirm = false;
      this.selected.view = false;
      this.selected.values = [];
      this.selectable = true;
    },
  },
};
</script>

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
