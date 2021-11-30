<template>
  <div>
    <b-modal
      id="modal-create"
      ref="modal"
      :title="$t('add')"
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

      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group :label="$t('companies.type')" label-for="roles">
          <b-form-select v-model="company.type_id" id="roles">
            <b-form-select-option value="0">
              {{ $t("companies.type_enter") }}
            </b-form-select-option>

            <b-form-select-option
              v-for="(type, index) in getBranchTypes"
              :key="index"
              :value="type.id"
            >
              {{ getName(type.name) }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>

        <b-form-group :label="$t('companies.name')" label-for="name">
          <b-form-input id="name" v-model="company.name"></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('companies.payment_account')"
          label-for="payment_account"
        >
          <b-form-input
            id="payment_account"
            v-model="company.payment_account"
          ></b-form-input>
        </b-form-group>

        <b-form-group :label="$t('companies.inn')" label-for="inn">
          <b-form-input id="inn" v-model="company.inn"></b-form-input>
        </b-form-group>

        <b-form-group :label="$t('companies.mfo')" label-for="mfo">
          <b-form-input id="mfo" v-model="company.mfo"></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('companies.first_name')"
          label-for="first_name"
        >
          <b-form-input
            id="first_name"
            v-model="company.first_name"
          ></b-form-input>
        </b-form-group>

        <b-form-group :label="$t('companies.last_name')" label-for="last_name">
          <b-form-input
            id="last_name"
            v-model="company.last_name"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('companies.second_name')"
          label-for="second_name"
        >
          <b-form-input
            id="second_name"
            v-model="company.second_name"
          ></b-form-input>
        </b-form-group>

        <b-form-group :label="$t('companies.phone')" label-for="phone">
          <b-form-input id="phone" v-model="company.phone"></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('companies.other_phone')"
          label-for="other_phone"
        >
          <b-form-input
            id="other_phone"
            v-model="company.other_phone"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('companies.bank_name') + ' Ru'"
          label-for="bank_name_ru"
        >
          <b-form-input
            id="bank_name_ru"
            v-model="company.bank_name.ru"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('companies.bank_name') + ' Uz'"
          label-for="bank_name_uz"
        >
          <b-form-input
            id="bank_name_uz"
            v-model="company.bank_name.uz"
          ></b-form-input>
        </b-form-group>

        <div class="d-flex justify-content-center pb-4">
          <b-button variant="light" @click="resetModal">
            {{ $t("cancel") }}
          </b-button>

          <b-button type="submit" class="ml-1" variant="success">
            <i class="fas fa-save"></i> {{ $t("save") }}
          </b-button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  data() {
    return {
      company: {
        first_name: null,
        last_name: null,
        second_name: null,

        payment_account: null,
        name: null,
        inn: null,
        mfo: null,
        bank_name: {
          ru: null,
          uz: null,
        },
        phone: null,
        other_phone: null,

        type_id: null,
      },

      error: false,
      errors: [],

      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },
    };
  },

  computed: mapGetters(["getBranchTypes"]),

  mounted() {
    this.fetchBranchTypes(this);
  },

  methods: {
    ...mapActions(["fetchBranchTypes"]),

    resetModal() {
      this.company = {
        first_name: null,
        last_name: null,
        second_name: null,

        payment_account: null,
        name: null,
        inn: null,
        mfo: null,
        bank_name: {
          ru: null,
          uz: null,
        },

        phone: null,
        other_phone: null,
        type_id: 0,
      };

      this.$bvModal.hide("modal-create");

      this.error = false;
      this.errors = [];

      this.objects = [];
    },

    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },

    async handleSubmit() {
      try {
        const response = await this.axios.post(
          process.env.VUE_APP_URL + "/companies",
          this.company,
          this.header
        );

        this.toasted(response.data.message, "success");

        this.$nextTick(() => {
          this.$bvModal.hide("modal-create");
        });

        this.$emit("CreateCompany", this.company);
      } catch (error) {
        if (!error.response) {
          this.toasted("Error: Network Error", "error");
        } else {
          if (error.response.status === 403) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 401) {
            this.toasted(error.response.data, "error");
          } else if (error.response.status === 500) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 422) {
            this.error = true;
            this.errors = error.response.data;
          } else {
            this.toasted(error.response.data.message, "error");
          }
        }
      }
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
  },
};
</script>

<style scoped></style>
