<script>
import api from '@/services/api'
import XDropdown from '@/components/ui-components/dropdown/XDropdown.vue'

export default {
  components: { XDropdown },
  props: ['apartment'],

  data: () => ({
    apartment_info: {
      block: {
        floors: [],
      },
      area: 0,
      number: 0,
      plan_id: 0,
    },
    plans: [],
    floors: [],

    error: false,
    errors: [],

    header: {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    },

    getLoading: false,
  }),

  watch: {
    apartment() {
      this.GetInfoApartment()
    },
  },

  methods: {
    async GetInfoApartment() {
      this.getLoading = true
      try {
        const { data } = await api.apartments.fetchApartmentInfo(
          this.apartment,
        )
        this.apartment_info = data
        this.plans = data.plans
        this.floors = data.floors
        this.getLoading = false
      } catch (error) {
        this.getLoading = false
        if (!error.response) {
          this.toasted('Error: Network Error', 'error')
        } else if (error.response.status === 403) {
          this.toasted(error.response.data.message, 'error')
        } else {
          this.error = true
          this.errors = error.response.data.errors
        }
      }
    },

    resetModal() {
      this.$bvModal.hide('modal-edit')

      this.error = false
      this.errors = []
    },

    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },

    async handleSubmit() {
      this.getLoading = true
      try {
        const info = {
          rooms: this.apartment_info.rooms,
          plan_id: this.apartment_info.plan_id,
          floor: this.apartment_info.floor,
          entrance: this.apartment_info.entrance,
          number: this.apartment_info.number,
        }

        const { data } = await api.apartments.updateApartmentsInfo(
          this.apartment_info.id,
          info,
        )

        this.toasted(data.message, 'success')

        this.$nextTick(() => {
          this.$bvModal.hide('modal-edit')
        })

        this.getLoading = false
        this.$emit('EditApartment')
      } catch (error) {
        this.getLoading = false
        if (!error.response) {
          this.toasted('Error: Network Error', 'error')
        } else if (error.response.status === 403) {
          this.toasted(error.response.data.message, 'error')
        } else {
          this.error = true
          this.errors = error.response.data.errors
        }
      }
    },
  },
}
</script>

<template>
  <div>
    <b-modal
      id="modal-edit"
      ref="modal"
      :title="$t('edit') + ' - ' + apartment_info.number"
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
        @submit.stop.prevent="handleSubmit"
      >
        <div class="apartment__info mb-3">
          {{ $t("objects.create.apartment") }}:<br>
          <input
            v-model="apartment_info.number"
            type="text"
            required
            class="form-control"
          >
        </div>

        <div class="apartment__info mb-3">
          {{ $t("apartments.list.entrance") }}:
          <input
            v-model="apartment_info.entrance"
            type="number"
            min="1"
            required
            class="form-control"
          >
        </div>

        <div class="apartment__info mb-3">
          {{ $t("objects.create.rooms") }}:
          <input
            v-model="apartment_info.rooms"
            type="number"
            min="1"
            required
            class="form-control"
          >
        </div>

        <div class="apartment__info mb-3">
          <x-dropdown>
            <template #button-content>
              {{ $t("objects.create.plan.name") }}
            </template>

            <select
              v-model="apartment_info.plan_id"
              class="custom-select"
              required
            >
              <option
                disabled
                value="null"
              >
                {{ $t("objects.create.choose_plan") }}
              </option>

              <option
                v-for="(plan, index) in plans"
                :key="index"
                :value="plan.id"
              >
                {{ plan.name }} - {{ $t("apartments.list.balcony") }}:
                {{ plan.balcony ? plan.balcony_area : $t("no") }}
              </option>
            </select>
          </x-dropdown>
        </div>

        <div class="apartment__info mb-3">
          {{ $t("objects.create.floor") }}:

          <select
            v-model="apartment_info.floor"
            class="custom-select"
          >
            <option
              v-for="floor in floors"
              :key="floor"
              :value="floor"
            >
              {{ floor }}
            </option>
          </select>
        </div>

        <div
          class="mt-4 d-flex justify-content-md-start justify-content-center float-right"
        >
          <button
            type="button"
            class="btn btn-default mr-2"
            @click="resetModal"
          >
            {{ $t("cancel") }}
          </button>

          <button
            type="submit"
            class="btn btn-success"
          >
            <i class="fa fa-save" /> {{ $t("save") }}
          </button>
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

<style scoped></style>
