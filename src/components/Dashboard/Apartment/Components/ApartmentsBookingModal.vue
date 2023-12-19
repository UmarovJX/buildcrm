<script>
export default {
  name: 'ApartmentsBookingModal',
  emits: ['set-client-data'],
  data: () => ({
    client: {
      first_name: null,
      last_name: null,
      phone: null,
      period_date: null,
      apartment_id: null,
      language: 'uz',
    },
    error: false,
    errors: [],
    getLoading: false,
  }),

  methods: {
    closeModal() {
      this.$nextTick(() => {
        this.$bvModal.hide('booking-creation-modal')
      })
    },
    resetModal() {
      this.client.first_name = null
      this.client.last_name = null
      this.client.phone = null
      this.client.period_date = null
      this.error = false
      this.errors = []
    },

    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
    },

    submitForm() {
      this.$refs['booking-creation-modal'].hide()
      this.$emit('set-client-data', this.client)
    },
  },
}
</script>

<template>
  <div>
    <b-modal
      id="booking-creation-modal"
      ref="booking-creation-modal"
      :title="$t('apartments.list.book')"
      hide-footer
      @show="resetModal"
    >
      <b-alert
        v-if="error"
        show
        variant="danger"
      >
        <ul>
          <li
            v-for="(error, index) in errors"
            :key="index"
          >
            <span
              v-for="msg in error"
              :key="msg"
            >
              {{ msg }}
            </span>
          </li>
        </ul>
      </b-alert>

      <form
        ref="form"
        @submit.prevent="submitForm"
      >
        <b-form-group
          label-cols="4"
          label-cols-lg="2"
          :label="$t('user.first_name')"
          label-for="first_name"
        >
          <b-form-input
            id="first_name"
            v-model="client.first_name"
          />
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
          />
        </b-form-group>

        <b-form-group
          label-cols="4"
          label-cols-lg="2"
          :label="$t('user.phone')"
          label-for="phone"
        >
          <b-form-input
            id="phone"
            v-model="client.phone"
          />
        </b-form-group>

        <div
          role="group"
          class="form-row form-group"
        >
          <label
            for="language"
            class="col-lg-2 col-4 col-form-label"
          >
            {{ $t("clients.language") }}
          </label>
          <div class="bv-no-focus-ring col">
            <select
              id="language"
              v-model="client.language"
              class="form-control"
            >
              <option value="uz">
                Узбекский
              </option>
              <option value="ru">
                Русский
              </option>
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
          />
        </b-form-group>

        <div class="w-100 d-flex justify-content-center">
          <b-button
            type="button"
            variant="light"
            @click="$bvModal.hide('booking-creation-modal')"
          >
            {{ $t("cancel") }}
          </b-button>

          <b-button
            type="submit"
            class="ml-1 mr-0"
            variant="success"
          >
            <b-icon-box-arrow-up-right />
            {{ $t("apartments.list.book") }}
          </b-button>
        </div>
      </form>
    </b-modal>

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
</template>
