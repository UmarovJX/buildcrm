<script>
import { mapActions, mapGetters } from 'vuex'
import api from '@/services/api'
import ViewClient from '../Apartment/ViewClient'
import XDropdown from "@/components/ui-components/dropdown/XDropdown.vue";

export default {
  components: {
    XDropdown,
    'view-client': ViewClient,
  },

  data: () => ({
    info_reserve: false,
    apartment_preview: {},
    client_id: 0,

    page: 1,

    header: {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    },

    search: '',
  }),

  computed: mapGetters([
    'getClients',
    'getMe',
    'getPermission',
    'getClientsPaginate',
    'getLoading',
  ]),

  mounted() {
    this.fetchClients(this)
  },

  methods: {
    ...mapActions(['fetchClients', 'fetchReserveClient', 'fetchClientsSearch']),

    ReserveInfo(status) {
      this.info_reserve = true
      this.apartment_preview = {
        id: client.apartment_id,
        booking_date: client.apartment.booking_date,
      }
      this.client_id = client.id

      this.fetchReserveClient(this)
      // this.$bvModal.show('modal-view-status');
    },

    PageCallBack(pageNum) {
      this.page = pageNum

      if (this.search.length > 0) {
        this.fetchClientsSearch(this)
      } else {
        this.fetchClients(this)
      }
    },

    CancelContract(client_id) {
      this.$swal({
        title: this.$t('sweetAlert.title'),
        text: this.$t('sweetAlert.text_cancel_contract'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: this.$t('cancel'),
        confirmButtonText: this.$t('sweetAlert.yes_cancel_contract'),
      }).then(result => {
        if (result.value) {
          api.clients
            .cancelContract(client_id, {})
            .then(response => {
              this.toasted(response.data.message, 'success')

              if (this.search.length > 0) {
                this.fetchClientsSearch(this)
              } else {
                this.fetchClients(this)
              }

              this.$swal(
                this.$t('sweetAlert.canceled_contract'),
                '',
                'success',
              )
            })
            .catch(error => {
              if (!error.response) {
                this.toasted('Error: Network Error', 'error')
              } else if (error.response.status === 403) {
                this.toasted(error.response.data.message, 'error')
              } else if (error.response.status === 401) {
                this.toasted(error.response.data.message, 'error')
              } else if (error.response.status === 500) {
                this.toasted(error.response.data.message, 'error')
              } else {
                this.error = true
                this.errors = error.response.data.errors
              }
            })
        }
      })
    },

    DeleteClient(status) {
      this.$swal({
        title: this.$t('sweetAlert.title'),
        text: this.$t('sweetAlert.text'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: this.$t('cancel'),
        confirmButtonText: this.$t('sweetAlert.yes'),
      }).then(result => {
        if (result.value) {
          api.clients
            .deleteClientFromDB(client)
            .then(response => {
              this.toasted(response.data.message, 'success')

              if (this.search.length > 0) {
                this.fetchClientsSearch(this)
              } else {
                this.fetchClients(this)
              }

              this.$swal(this.$t('sweetAlert.deleted'), '', 'success')
            })
            .catch(error => {
              if (!error.response) {
                this.toasted('Error: Network Error', 'error')
              } else if (error.response.status === 403) {
                this.toasted(error.response.data.message, 'error')
              } else if (error.response.status === 401) {
                this.toasted(error.response.data.message, 'error')
              } else if (error.response.status === 500) {
                this.toasted(error.response.data.message, 'error')
              } else {
                this.error = true
                this.errors = error.response.data.errors
              }
            })
        }
      })
    },

    CloseReserveInfo() {
      this.info_reserve = false
      this.apartment_preview = {}
      this.fetchClients(this)
    },

    SearchInput(event) {
      this.page = 1
      this.search = event.target.value
      this.fetchClientsSearch(this)
    },
  },

  filters: {
    getStatus(status, buy, book) {
      let msg
      switch (status) {
        case 'buy':
          msg = `Покупал ${buy}`
          break
        case 'booking':
          msg = `Забронировал до ${book}`
          break
        default:
          msg = 'отказался купить или другое'
          break
      }

      return msg
    },
  },
}
</script>

<template>
  <div>
    <div>
      <form
        action=""
        class="my-form"
      >
        <div class="mb-3 searching">
          <input
            v-model="search"
            class="my-form__input"
            type="text"
            :placeholder="$t('clients.search')"
            @input="SearchInput"
          >
          <button><i class="far fa-search" /></button>
        </div>
      </form>

      <div class="table-responsive">
        <table class="table table-borderless my-table my-table-third">
          <thead>
            <tr>
              <th class="text-center">
                <i class="fas fa-sort" /> {{ $t("clients.number") }}
              </th>
              <th>{{ $t("clients.fio") }}</th>
              <th>{{ $t("clients.phone") }}</th>
              <th>{{ $t("clients.amount") }}</th>
              <th>{{ $t("clients.apartment") }}</th>
              <th>{{ $t("clients.date") }}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-if="getLoading">
              <td
                colspan="7"
                style=""
              >
                <div class="d-flex justify-content-center w-100">
                  <div class="lds-ellipsis">
                    <div />
                    <div />
                    <div />
                    <div />
                  </div>
                </div>
              </td>
            </tr>

            <tr v-if="getClients.length === 0 && !getLoading">
              <td colspan="7">
                <center>
                  {{ $t("no_data") }}
                </center>
              </td>
            </tr>

            <tr
              v-for="(status, index) in getClients"
              :key="index"
              :class="[
                client.status === 'booking' ? 'table-warning' : '',
                client.status === 'cancelled' ? 'table-danger' : '',
              ]"
            >
              <td class="text-center">
                {{ status.contract_number }}
              </td>
              <td>
                {{ status.first_name }} {{ status.last_name }}
                {{ status.second_name }}
              </td>
              <td>+{{ status.phone }}</td>
              <td>
                <span v-if="client.price_apartment">
                  {{
                    status.price_apartment
                      | number("0,0.00", {
                        thousandsSeparator: " ",
                        decimalSeparator: ",",
                      })
                  }}
                  {{ $t("ye") }}
                </span>
              </td>

              <td>
                <span v-if="client.apartment_id">
                  {{ status.apartment.number }}
                </span>
              </td>
              <td>
                <small v-if="client.status == 'cancelled'">{{
                  status.status | getStatus("", "")
                }}</small>
                <small v-else>{{
                  status.status
                    | getStatus(
                      $moment(status.buyed_date).format("DD.MM.YYYY"),
                      $moment(status.apartment.booking_date).format(
                        "DD.MM.YYYY"
                      )
                    )
                }}</small>
              </td>
              <td>
                <x-dropdown>
                  <b-link
                      v-if="
                        (client.status === 'booking' &&
                          client.manager_id === getMe.user.id) ||
                          (getMe.role.id === 1 && client.status === 'booking')
                      "
                      v-b-modal.modal-view-client
                      class="dropdown-item dropdown-item--inside"
                      @click="ReserveInfo(client)"
                  >
                    <i class="far fa-eye" />
                    {{ $t("apartments.list.view_client") }}
                  </b-link>

                  <router-link
                      v-if="client.status == 'booking'"
                      :to="{
                        name: 'apartment-view',
                        params: { id: client.apartment.id },
                      }"
                      :class="'dropdown-item dropdown-item--inside'"
                  >
                    <i class="far fa-ballot-check" />
                    {{ $t("apartments.list.confirm") }}
                  </router-link>

                  <a
                      v-if="client.status === 'buy'"
                      class="dropdown-item dropdown-item--inside"
                      href="product-item.html"
                  >
                    <i class="far fa-eye" />
                    {{ $t("apartments.list.more") }}
                  </a>

                  <a
                      v-if="client.status === 'buy'"
                      class="dropdown-item dropdown-item--inside"
                      href="product-item.html"
                  >
                    <i class="fas fa-download" />
                    {{ $t("apartments.list.download_contract") }}
                  </a>

                  <b-button
                      v-if="
                        (client.status === 'buy' &&
                          getPermission.clients.cancel_contract) ||
                          (client.status === 'buy' && getMe.role.id === 1)
                      "
                      class="dropdown-item dropdown-item--inside"
                      @click="CancelContract(client.id)"
                  >
                    <i class="fas fa-eraser" />
                    {{ $t("apartments.list.cancel_contract") }}
                  </b-button>

                  <!--                                    <a class="dropdown-item dropdown-item&#45;&#45;inside" href="javascript:void(0)"-->
                  <!--                                       data-target="#client_edit" data-toggle="modal"><i class="fas fa-pen"></i>-->
                  <!--                                        Редактировать-->
                  <!--                                    </a>-->

                  <b-button
                      v-if="getPermission.clients.delete"
                      class="dropdown-item dropdown-item--inside"
                      @click="DeleteClient(client.id)"
                  ><i class="far fa-trash" /> {{ $t("delete") }}
                  </b-button>
                </x-dropdown>
              </td>
            </tr>
          </tbody>
        </table>

        <paginate
          :page-count="getClientsPaginate.pageCount"
          :click-handler="PageCallBack"
          :prev-text="`<i class='fa fa-chevron-left'></i>`"
          :next-text="`<i class='fa fa-chevron-right'></i>`"
          :container-class="'pagination'"
          :page-class="'page-item'"
          :page-link-class="'page-link'"
          :next-class="'page-item'"
          :prev-class="'page-item'"
          :prev-link-class="'page-link'"
          :next-link-class="'page-link'"
        />
      </div>
    </div>

    <view-client
      v-if="info_reserve"
      :apartment-data="apartment_preview"
      :client-id="client_id"
      @CancelReserve="CloseReserveInfo"
    />
  </div>
</template>

<style scoped></style>
