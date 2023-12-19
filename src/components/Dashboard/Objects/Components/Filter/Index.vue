<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data: () => ({
    header: {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    },

    filter: {
      rooms: [],
      floors: [],
      price_from: null,
      price_to: null,
      status: 0,
      objects: [],

      area_from: null,
      area_to: null,
    },
  }),

  mounted() {
    this.fetchObjects(this)
    this.fetchApartmentsFloors(this)
    this.fetchApartmentsRooms(this)
  },

  computed: mapGetters([
    'getObjects',
    'getPermission',
    'getFilterRooms',
    'getFilterFloors',
  ]),

  methods: {
    ...mapActions([
      'fetchObjects',
      'fetchApartmentsFloors',
      'fetchApartmentsRooms',
      'fetchFilterApartments',
    ]),

    filterSend() {
      this.fetchFilterApartments(this)
      this.$router.push({ name: 'objects-filter' })
    },

    filterClear() {
      this.filter = {}
    },
  },
}
</script>

<template>
  <div>
    <b-modal
      id="modal-filter-index"
      ref="modal"
      class="py-4"
      :title="$t('apartments.list.filter')"
      hide-footer
    >
      <form
        class="my-form"
        @submit.prevent="filterSend"
      >
        <div class="container px-0 mx-0">
          <div class="mb-3">
            <label class="d-block">
              {{ $t("apartments.filter.apartments") }}
            </label>
            <div class="room">
              <span
                v-for="(room, index) in getFilterRooms"
                :key="index"
              >
                <input
                  :id="'rooms' + index"
                  v-model="filter.rooms"
                  type="checkbox"
                  :value="room"
                >
                <label :for="'rooms' + index">{{ room }}</label>
              </span>
            </div>
          </div>
          <div class="mb-3">
            <label class="d-block">
              {{ $t("apartments.filter.floor") }}
            </label>
            <div class="room">
              <span
                v-for="(floor, index) in getFilterFloors"
                :key="index"
              >
                <input
                  :id="'floor' + index"
                  v-model="filter.floors"
                  type="checkbox"
                  :value="floor"
                >
                <label :for="'floor' + index">{{ floor }}</label>
              </span>
            </div>
          </div>

          <div class="mb-3">
            <label class="d-block">{{ $t("apartments.filter.price") }}</label>
            <div class="d-flex justify-content-between align-items-center">
              <div class="">
                <input
                  v-model="filter.price_from"
                  class="my-form__input"
                  type="number"
                  :placeholder="$t('objects.create.prepay_from')"
                >
              </div>
              <div class="mx-2 long-horizontal-line">
                &#8213;
              </div>
              <div class="">
                <input
                  v-model="filter.price_to"
                  class="my-form__input"
                  type="number"
                  :placeholder="$t('objects.create.prepay_to')"
                >
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label class="d-block">{{ $t("apartments.filter.area") }}</label>
            <div class="d-flex justify-content-between align-items-center">
              <div class="">
                <input
                  v-model="filter.area_from"
                  class="my-form__input"
                  type="number"
                  :placeholder="$t('objects.create.prepay_from')"
                >
              </div>
              <div class="mx-2 long-horizontal-line">
                &#8213;
              </div>
              <div class="">
                <input
                  v-model="filter.area_to"
                  class="my-form__input"
                  type="number"
                  :placeholder="$t('objects.create.prepay_to')"
                >
              </div>
            </div>
          </div>

          <div class="mt-4 my-custom-control">
            <div>
              <label class="d-block">{{
                $t("apartments.filter.object")
              }}</label>
            </div>
            <div class="d-flex align-items-center">
              <div
                v-for="(object, index) in getObjects"
                :key="index"
                class="custom-control custom-checkbox mr-4"
              >
                <input
                  :id="'object' + index"
                  v-model="filter.objects"
                  type="checkbox"
                  class="custom-control-input"
                  :value="object.id"
                >
                <label
                  class="custom-control-label"
                  :for="'object' + index"
                >{{
                  object.name
                }}</label>
              </div>
            </div>
          </div>

          <div class="mt-4 my-custom-control">
            <div>
              <label class="d-block">{{
                $t("apartments.filter.status")
              }}</label>
            </div>

            <div class="d-flex align-items-center">
              <div class="custom-control custom-checkbox mr-4">
                <input
                  id="status"
                  v-model="filter.status"
                  type="checkbox"
                  class="custom-control-input"
                  value="1"
                >
                <label
                  class="custom-control-label"
                  for="status"
                >{{
                  $t("apartments.filter.free")
                }}</label>
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-4 d-flex justify-content-md-start justify-content-center float-right"
        >
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="filterClear"
          >
            <i class="far fa-times" /> {{ $t("apartments.filter.clear") }}
          </button>

          <button
            type="submit"
            class="btn btn-success"
          >
            <i class="far fa-sliders-h" /> {{ $t("apartments.list.filter") }}
          </button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<style scoped></style>
