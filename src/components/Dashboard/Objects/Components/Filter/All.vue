<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({
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
    this.fetchObjects(this);
    this.fetchApartmentsFloors(this);
    this.fetchApartmentsRooms(this);
  },

  watch: {
    "filter.rooms": function () {
      this.fetchFilterApartments(this);
    },

    "filter.floors": function () {
      this.fetchFilterApartments(this);
    },

    "filter.price_from": function () {
      this.fetchFilterApartments(this);
    },

    "filter.price_to": function () {
      this.fetchFilterApartments(this);
    },

    "filter.area_from": function () {
      this.fetchFilterApartments(this);
    },

    "filter.area_to": function () {
      this.fetchFilterApartments(this);
    },

    "filter.status": function () {
      this.fetchFilterApartments(this);
    },

    "filter.objects": function () {
      this.fetchFilterApartments(this);
    },
  },
  computed: mapGetters(["getObjects", "getFilterRooms", "getFilterFloors"]),

  methods: {
    ...mapActions([
      "fetchFilterApartments",
      "fetchObjects",
      "fetchApartmentsFloors",
      "fetchApartmentsRooms",
    ]),

    Filter() {
      this.$bvModal.hide("modal-filter-all");
      this.$emit("Filtered", this.filter);
    },

    filterClear() {
      this.filter = {
        rooms: [],
        floors: [],
        price_from: null,
        price_to: null,
        status: 0,
        objects: [],

        area_from: null,
        area_to: null,
      };
    },
  },
};
</script>

<template>
  <div>
    <b-modal
      id="modal-filter-all"
      class="py-4"
      ref="modal"
      :title="$t('apartments.list.filter')"
      hide-footer
    >
      <div class="container px-0 mx-0">
        <div class="mb-3">
          <label class="d-block">
            {{ $t("apartments.filter.apartments") }}
          </label>
          <div class="room">
            <span v-for="(room, index) in getFilterRooms" :key="index">
              <input
                type="checkbox"
                :id="'rooms' + index"
                :value="room"
                v-model="filter.rooms"
              />
              <label :for="'rooms' + index">{{ room }}</label>
            </span>
          </div>
        </div>
        <div class="mb-3">
          <label class="d-block">
            {{ $t("apartments.filter.floor") }}
          </label>
          <div class="room">
            <span v-for="(floor, index) in getFilterFloors" :key="index">
              <input
                v-model="filter.floors"
                type="checkbox"
                :id="'floor' + index"
                :value="floor"
              />
              <label :for="'floor' + index">{{ floor }}</label>
            </span>
          </div>
        </div>

        <div class="mb-3">
          <label class="d-block">{{ $t("apartments.filter.price") }}</label>
          <div class="d-flex justify-content-between align-items-center">
            <div class="">
              <input
                class="my-form__input"
                type="number"
                v-model="filter.price_from"
                :placeholder="$t('objects.create.prepay_from')"
              />
            </div>
            <div class="mx-2 long-horizontal-line">&#8213;</div>
            <div class="">
              <input
                class="my-form__input"
                type="number"
                v-model="filter.price_to"
                :placeholder="$t('objects.create.prepay_to')"
              />
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
              />
            </div>
            <div class="mx-2 long-horizontal-line">&#8213;</div>
            <div class="">
              <input
                v-model="filter.area_to"
                class="my-form__input"
                type="number"
                :placeholder="$t('objects.create.prepay_to')"
              />
            </div>
          </div>
        </div>

        <div class="mt-4 my-custom-control">
          <div>
            <label class="d-block">{{ $t("apartments.filter.object") }}</label>
          </div>
          <div class="d-flex align-items-center">
            <div
              class="custom-control custom-checkbox mr-4"
              v-for="(object, index) in getObjects"
              :key="index"
            >
              <input
                type="checkbox"
                class="custom-control-input"
                v-model="filter.objects"
                :id="'object' + index"
                :value="object.id"
              />
              <label class="custom-control-label" :for="'object' + index">{{
                object.name
              }}</label>
            </div>
          </div>
        </div>

        <div class="mt-4 my-custom-control">
          <div>
            <label class="d-block">{{ $t("apartments.filter.status") }}</label>
          </div>

          <div class="d-flex align-items-center">
            <div class="custom-control custom-checkbox mr-4">
              <input
                type="checkbox"
                class="custom-control-input"
                id="status"
                value="1"
                v-model="filter.status"
              />
              <label class="custom-control-label" for="status">{{
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
          type="reset"
          @click="filterClear"
        >
          <i class="far fa-times"></i> {{ $t("apartments.filter.clear") }}
        </button>

        <button type="button" @click="Filter" class="btn btn-success">
          <i class="far fa-sliders-h"></i> {{ $t("apartments.list.filter") }}
        </button>
      </div>
    </b-modal>
  </div>
</template>

<style scoped></style>
