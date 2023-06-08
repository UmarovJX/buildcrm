<script>
import { mapGetters } from "vuex";

export default {
  props: {
    ManagerData: {},
  },

  data: function () {
    return {
      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },
    };
  },

  mounted() {},

  computed: mapGetters(["getReserveClient"]),

  methods: {
    resetModal() {
      this.$bvModal.hide("modal-view-info-manager");
      //this.$emit('CloseReserveInfo');
    },
  },
};
</script>

<template>
  <div>
    <b-modal
      id="modal-view-info-manager"
      ref="modal"
      :title="$t('apartments.list.view_manager')"
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
            v-model="ManagerData.first_name"
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
            v-model="ManagerData.last_name"
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
            v-model="ManagerData.phone"
          ></b-form-input>
        </b-form-group>

        <div class="float-right">
          <b-button variant="light" @click="resetModal">
            {{ $t("close") }}
          </b-button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<style scoped></style>
