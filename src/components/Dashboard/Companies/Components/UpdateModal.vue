<template>
  <div>
    <b-modal
      id="modal-update"
      ref="modal"
      :title="$t('edit')"
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
          <b-form-select v-model="getBranch.type_id" id="roles">
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
          <b-form-input id="name" v-model="getBranch.name"></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('companies.payment_account')"
          label-for="payment_account"
        >
          <b-form-input
            id="payment_account"
            v-model="getBranch.payment_account"
          ></b-form-input>
        </b-form-group>

        <b-form-group :label="$t('companies.inn')" label-for="inn">
          <b-form-input id="inn" v-model="getBranch.inn"></b-form-input>
        </b-form-group>

        <b-form-group :label="$t('companies.mfo')" label-for="mfo">
          <b-form-input id="mfo" v-model="getBranch.mfo"></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('companies.first_name')"
          label-for="first_name"
        >
          <b-form-input
            id="first_name"
            v-model="getBranch.first_name"
          ></b-form-input>
        </b-form-group>

        <b-form-group :label="$t('companies.last_name')" label-for="last_name">
          <b-form-input
            id="last_name"
            v-model="getBranch.last_name"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('companies.second_name')"
          label-for="middle_name"
        >
          <b-form-input
            id="second_name"
            v-model="getBranch.second_name"
          ></b-form-input>
        </b-form-group>

        <b-form-group :label="$t('companies.phone')" label-for="phone">
          <b-form-input id="phone" v-model="getBranch.phone"></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('companies.other_phone')"
          label-for="other_phone"
        >
          <b-form-input
            id="other_phone"
            v-model="getBranch.other_phone"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('companies.bank_name') + ' Ru'"
          label-for="bank_name_ru"
        >
          <b-form-input
            id="bank_name_ru"
            v-model="getBranch.bank_name.ru"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('companies.bank_name') + ' Uz'"
          label-for="bank_name_uz"
        >
          <b-form-input
            id="bank_name_uz"
            v-model="getBranch.bank_name.uz"
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
import api from "@/services/api";

export default {
  props: {
    branchId: {},
  },

  mounted() {
    this.getBranch();
    this.fetchBranchTypes(this);
  },

  computed: mapGetters(["getBranchTypes", "getBranch"]),

  data() {
    return {
      branch: {},
      error: null,
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
        type_id: 0,
      },

      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },
    };
  },

  methods: {
    ...mapActions(["fetchBranchTypes"]),

    resetModal() {
      this.$bvModal.hide("modal-update");

      // this.$emit('UpdateCompany', this.company);

      this.error = false;
      this.errors = [];

      this.objects = [];
    },

    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },

    async handleSubmit() {
      const branch = this.getBranch;

      try {
        branch.id = this.branchId
        const response = await api.companies.updateCompany(branch)
        this.toasted(response.data.message, "success");

        this.$nextTick(() => {
          this.$bvModal.hide("modal-update");
        });

        this.$emit("UpdateCompany");
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
