<template>
  <div>
    <b-modal
        id="modal-reserve-create"
        ref="modal-reserve-create"
        :title="$t('apartments.list.book')"
        hide-footer
        @show="resetModal"
    >
      <b-alert show variant="danger" v-if="error">
        <ul>
          <li v-for="(error, index) in errors" :key="index">
            <span v-for="msg in error" :key="msg">
              {{ msg }}
            </span>
          </li>
        </ul>
      </b-alert>

      <form ref="form" @submit.prevent="handleSubmit">
        <b-form-group
            label-cols="4"
            label-cols-lg="2"
            :label="$t('user.first_name')"
            label-for="first_name"
        >
          <b-form-input
              id="first_name"
              v-model="client.first_name"
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
              v-model="client.last_name"
          ></b-form-input>
        </b-form-group>

        <b-form-group
            label-cols="4"
            label-cols-lg="2"
            :label="$t('user.phone')"
            label-for="phone"
        >
          <b-form-input id="phone" v-model="client.phone"></b-form-input>
        </b-form-group>

        <div role="group" class="form-row form-group">
          <label for="language" class="col-lg-2 col-4 col-form-label">
            {{ $t("clients.language") }}
          </label>
          <div class="bv-no-focus-ring col">
            <select
                class="form-control"
                id="language"
                v-model="client.language"
            >
              <option value="uz">Узбекский</option>
              <option value="ru">Русский</option>
            </select>
          </div>
        </div>

        <b-form-group
            label-cols="4"
            label-cols-lg="4"
            :label="$t('apartments.list.period_date')"
            label-for="period_date"
        >
          <b-form-datepicker
              v-model="client.period_date"
              locale="ru"
          ></b-form-datepicker>
        </b-form-group>

        <div class="w-100 d-flex justify-content-center">
          <b-button
              type="button"
              variant="light"
              @click="$bvModal.hide('modal-reserve-create')"
          >
            {{ $t("cancel") }}
          </b-button>

          <b-button type="submit" class="ml-1 mr-0" variant="success">
            <b-icon-box-arrow-up-right></b-icon-box-arrow-up-right>
            {{ $t("apartments.list.book") }}
          </b-button>
        </div>
      </form>
    </b-modal>

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
</template>

<script>
import api from "@/services/api";

export default {
  props: ["apartment"],

  data: () => ({
    client: {
      first_name: null,
      last_name: null,
      phone: null,
      period_date: null,
      apartment_id: null,
      language: "uz",
    },

    error: false,
    errors: [],

    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },

    getLoading: false
  }),

  methods: {
    closeModal() {
      this.$nextTick(() => {
        this.$bvModal.hide("modal-reserve-create");
      });
    },
    resetModal() {
      this.client.first_name = null;
      this.client.last_name = null;
      this.client.phone = null;
      this.client.period_date = null;
      this.error = false;
      this.errors = [];
    },

    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },

    async handleSubmit() {
      this.getLoading = true
      try {
        delete this.client.apartment_id
        this.client.apartments = [this.apartment];
        const response = await api.apartments.bookingApartments(this.client)
        this.toasted(response.data.message, "success");
        this.$bvModal.hide("modal-reserve-create");
        this.getLoading = false
        this.$emit("CreateReserve", this.client);
        // const {contract_path} = response.data
        // this.downloadContract(contract_path)
      } catch (error) {
        this.getLoading = false
        if (!error.response) {
          this.toasted("Error: Network Error", "error");
        } else {
          if (error.response.status === 403) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 422) {
            this.error = true;
            this.errors = error.response.data;
          } else {
            this.error = true;
            this.errors = error.response.data;
          }
        }
      }
    },
    downloadContract(url) {
      const a = document.createElement('a')
      a.href = url
      a.click()
      document.body.removeChild(a)
    },
  },
};
</script>

<style scoped></style>
