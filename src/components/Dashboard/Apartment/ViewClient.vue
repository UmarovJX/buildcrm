<script>
import { mapGetters } from "vuex";
import api from "@/services/api";

export default {
  props: {
    ApartmentData: {},
  },
  data() {
    return {
      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },
    };
  },
  computed: mapGetters([
    "getReserveClient",
    "getPermission",
    "getApartment",
    "getMe",
  ]),
  methods: {
    handleSubmit() {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_cancel_reserve"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yes_cancel_reserve"),
      }).then((result) => {
        if (result.value) {
          this.sendData();
        }
      });
    },
    async sendData() {
      await api.orders
        .deactivateReserveOrders(this.getReserveClient.id)
        .then((response) => {
          this.toasted(response.data.message, "success");
          this.$swal(this.$t("sweetAlert.canceled_reserve"), "", "success");
          this.$emit("CancelReserve", this.client);
          this.$root.$emit("bv::hide::modal", "modal-view-reserved-client");
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
        })
        .finally(() => {});
    },

    closeModal() {
      // this.$bvModal.hide("modal-view-reserved-client");
      // this.$refs["modal-view-reserved-client"].hide();
      this.$root.$emit("bv::hide::modal", "modal-view-reserved-client");
      //this.$emit('CloseReserveInfo');
    },
  },
};
</script>

<template>
  <div>
    <b-modal
      id="modal-view-reserved-client"
      ref="modal-view-reserved-client"
      :title="$t('apartments.list.view_client')"
      hide-footer
    >
      <form ref="form" @submit.prevent="handleSubmit">
        <b-form-group
          label-cols="4"
          label-cols-lg="2"
          :label="$t('user.first_name')"
          label-for="first_name"
        >
          <b-form-input
            id="first_name"
            disabled
            :value="
              getReserveClient.first_name && getReserveClient.first_name.lotin
            "
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
            :value="
              getReserveClient.last_name && getReserveClient.last_name.lotin
            "
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
            :value="getReserveClient.phone"
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
            :value="getReserveClient.booking_date"
          ></b-form-datepicker>
        </b-form-group>

        <div class="d-flex justify-content-center">
          <b-button type="button" variant="light" @click="closeModal">
            {{ $t("close") }}
          </b-button>

          <b-button
            v-if="
              (getApartment.order.status === 'booked' &&
                getApartment.order.user.id === getMe.user.id) ||
              (getMe.role.id === 1 && getApartment.order.status === 'booked') ||
              (getApartment.order.status === 'booked' &&
                getPermission.apartments.root_contract)
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

<style scoped></style>
