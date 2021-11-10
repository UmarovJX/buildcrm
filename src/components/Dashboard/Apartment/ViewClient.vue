<template>
  <div>
    <b-modal
      id="modal-view-client"
      ref="modal"
      :title="$t('apartments.list.view_client')"
      hide-footer
      @show="resetModal"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label-cols="4"
          label-cols-lg="2"
          :label="$t('user.first_name')"
          label-for="first_name"
        >
          <b-form-input
            id="first_name"
            disabled
            v-model="getReserveClient.first_name.lotin"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols="4"
          label-cols-lg="2"
          :label="$t('user.last_name')"
          label-for="last_name"
        >
          <b-form-input
            id="last_name"
            disabled
            v-model="getReserveClient.last_name.lotin"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols="4"
          label-cols-lg="2"
          :label="$t('user.phone')"
          label-for="phone"
        >
          <b-form-input
            id="phone"
            disabled
            v-model="getReserveClient.phone"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols="4"
          label-cols-lg="4"
          :label="$t('apartments.list.period_date')"
          label-for="period_date"
        >
          <b-form-datepicker
            disabled
            locale="ru"
            v-model="getReserveClient.booking_date"
          ></b-form-datepicker>
        </b-form-group>

        <div class="float-right">
          <b-button variant="light" @click="resetModal">
            {{ $t("close") }}
          </b-button>

          <b-button
            v-if="
              getPermission.apartments.reserve_cancel ||
              getPermission.apartments.root_contract
            "
            type="submit"
            class="ml-1"
            variant="danger"
          >
            <i class="fas fa-eraser"></i>
            {{ $t("apartments.list.cancel_reserve") }}
          </b-button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
export default {
  props: {
    ClientId: {},
    ApartmentData: {},
  },

  data: function () {
    return {
      client_id: this.ClientId,

      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },
    };
  },

  mounted() {},

  computed: mapGetters(["getReserveClient", "getPermission"]),

  methods: {
    async handleSubmit() {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_cancel_reserve"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes_cancel_reserve"),
      }).then((result) => {
        if (result.value) {
          this.axios
            .delete(
              process.env.VUE_APP_URL +
                "/orders/" +
                this.getReserveClient.id +
                "/reserve",
              this.header
            )
            .then((response) => {
              this.toasted(response.data.message, "success");

              this.$nextTick(() => {
                this.$bvModal.hide("modal-view-client");
              });

              this.$emit("CancelReserve", this.client);

              this.$swal(this.$t("sweetAlert.canceled_reserve"), "", "success");
            })
            .catch((error) => {
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
                  this.error = true;
                  this.errors = error.response.data.errors;
                }
              }
            });
        }
      });
    },

    resetModal() {
      this.$bvModal.hide("modal-view-client");
      //this.$emit('CloseReserveInfo');
    },
  },
};
</script>

<style scoped></style>
