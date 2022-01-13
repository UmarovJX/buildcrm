<template>
  <div>
    <b-sidebar
      id="apartment-list-filter"
      right
      shadow
      width="420px"
      backdrop
      :title="$t('apartments.list.filter')"
      ref="mySidebar"
      :no-close-on-route-change="true"
    >
      <div class="container">
        <!-- Номер квартира -->
        <div class="mb-3">
          <label for="tags-separators">Номер квартира: </label>
          <b-form-tags
            input-id="tags-separators"
            v-model="filter.number"
            separator=" "
            remove-on-delete
            tag-pills
            inputType="tel"
            addButtonVariant="primary"
            addButtonText="+"
            placeholder="Номер квартира"
          ></b-form-tags>
        </div>

        <!-- Количество комнат -->
        <div class="mb-3">
          <label class="d-block">
            {{ $t("apartments.filter.apartments") }}
          </label>
          <div class="room">
            <span v-for="(room, index) in getFilterParams.rooms" :key="index">
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

        <!-- Этаж -->
        <div class="mb-3">
          <label class="d-block">
            {{ $t("apartments.filter.floor") }}
          </label>
          <div class="room">
            <span v-for="(floor, index) in getFilterParams.floors" :key="index">
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

        <!-- Блоки -->
        <div class="mb-3">
          <label class="d-block">
            {{ $t("apartments.filter.blocks") }}
          </label>
          <div class="room">
            <span v-for="(block, index) in getFilterParams.blocks" :key="index">
              <input
                v-model="filter.blocks"
                type="checkbox"
                :id="'block' + index"
                :value="block.id"
              />
              <label :for="'block' + index">{{ block.name }}</label>
            </span>
          </div>
        </div>

        <!-- Цена -->
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

        <!-- Площадь -->
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

        <!-- Статус -->
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

          <div class="d-flex align-items-center">
            <div class="custom-control custom-checkbox mr-4">
              <input
                type="checkbox"
                class="custom-control-input"
                id="usd"
                value="1"
                v-model="filter.usd"
              />
              <label class="custom-control-label" for="usd">{{
                $t("apartments.filter.usd")
              }}</label>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="d-flex justify-content-center align-items-center my-2">
          <button
            class="btn btn-default mr-2 mt-0"
            type="reset"
            @click="filterClear"
          >
            <i class="far fa-times"></i> {{ $t("apartments.filter.clear") }}
          </button>

          <b-button
            class="mt-0 mr-0"
            variant="primary"
            size="md"
            type="button"
            @click="Filter"
          >
            <i class="far fa-sliders-h mr-2"></i>
            Фильтровать</b-button
          >
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  data() {
    return {
      filter: {
        filtered: false,
        number: [],
        rooms: [],
        floors: [],
        blocks: [],
        price_from: null,
        price_to: null,
        area_from: null,
        area_to: null,
        status: null,
        usd: false,
        page: 1,
      },
    };
  },
  props: {
    filtered: {
      type: Object,
    },
  },
  watch: {
    "filter.number": function() {
      this.filter.filtered = true;
    },
    "filter.rooms": function() {
      this.filter.filtered = true;
    },
    "filter.floors": function() {
      this.filter.filtered = true;
    },
    "filter.blocks": function() {
      this.filter.filtered = true;
    },
    "filter.price_from": function() {
      this.filter.filtered = true;
    },
    "filter.price_to": function() {
      this.filter.filtered = true;
    },
    "filter.area_from": function() {
      this.filter.filtered = true;
    },
    "filter.area_to": function() {
      this.filter.filtered = true;
    },
    "filter.status": function() {
      this.filter.filtered = true;
    },
    "filter.usd": function() {
      this.filter.filtered = true;
    },
  },

  mounted() {
    if (this.filtered.status) {
      if (this.filtered.number === true) {
        this.filtered.status = true;
      } else {
        this.filtered.status = null;
      }
    }
    if (this.filtered.number) {
      if (typeof this.filtered.number === "string") {
        const newArr = [];
        const newArrItem = parseInt(this.filtered.number);
        newArr.push(newArrItem);
        this.filtered.number = newArr;
      }
    }
    if (this.filtered.rooms) {
      if (typeof this.filtered.rooms === "string") {
        const newArr = [];
        const newArrItem = parseInt(this.filtered.rooms);
        newArr.push(newArrItem);
        this.filtered.rooms = newArr;
      }
    }

    if (this.filtered.floors) {
      if (typeof this.filtered.floors === "string") {
        const newArr = [];
        const newArrItem = parseInt(this.filtered.floors);
        newArr.push(newArrItem);
        this.filtered.floors = newArr;
      }
    }

    if (this.filtered.blocks) {
      if (typeof this.filtered.blocks === "string") {
        const newArr = [];
        const newArrItem = parseInt(this.filtered.blocks);
        newArr.push(newArrItem);
        this.filtered.blocks = newArr;
      }
    }

    this.filter.filtered = this.filtered.filtered
      ? this.filtered.filtered
      : this.filter.filtered;
    this.filter.number = this.filtered.number
      ? this.filtered.number
      : this.filter.number;
    this.filter.rooms = this.filtered.rooms
      ? this.filtered.rooms
      : this.filter.rooms;
    this.filter.floors = this.filtered.floors
      ? this.filtered.floors
      : this.filter.floors;
    this.filter.blocks = this.filtered.blocks
      ? this.filtered.blocks
      : this.filter.blocks;
    this.filter.price_from = this.filtered.price_from
      ? this.filtered.price_from
      : this.filter.price_from;
    this.filter.price_to = this.filtered.price_to
      ? this.filtered.price_to
      : this.filter.price_to;
    this.filter.area_from = this.filtered.area_from
      ? this.filtered.area_from
      : this.filter.area_from;
    this.filter.area_to = this.filtered.area_to
      ? this.filtered.area_to
      : this.filter.area_to;
    this.filter.status = this.filtered.status
      ? this.filtered.status
      : this.filter.status;
    this.filter.usd = this.filtered.usd ? this.filtered.usd : this.filter.usd;
    this.filter.sort_by = this.filtered.sort_by
      ? this.filtered.sort_by
      : this.filter.sort_by;
    this.filter.order_by = this.filtered.order_by
      ? this.filtered.order_by
      : this.filter.order_by;
    this.filter.page = this.filtered.page
      ? this.filtered.page
      : this.filter.page;

    this.fetchFilterObject(this);
  },

  computed: mapGetters(["getObjects", "getFilterParams"]),

  methods: {
    ...mapActions(["fetchApartments", "fetchObjects", "fetchFilterObject"]),

    async Filter() {
      let filter = {};
      if (this.filter.number.length > 0) {
        filter.number = this.filter.number;
      }
      if (this.filter.rooms.length > 0) {
        filter.rooms = this.filter.rooms;
      }
      if (this.filter.floors.length > 0) {
        filter.floors = this.filter.floors;
      }
      if (this.filter.blocks.length > 0) {
        filter.blocks = this.filter.blocks;
      }

      if (this.filter.price_from !== null) {
        filter.price_from = this.filter.price_from;
      }
      if (this.filter.price_to !== null) {
        filter.price_to = this.filter.price_to;
      }
      if (this.filter.area_from !== null) {
        filter.area_from = this.filter.area_from;
      }
      if (this.filter.area_to !== null) {
        filter.area_to = this.filter.area_to;
      }
      if (this.filter.status !== 0) {
        filter.status = this.filter.status;
      }
      if (this.filter.usd !== false) {
        filter.usd = this.filter.usd;
      }
      if (this.$route.query.sort_by && this.$route.query) {
        filter.sort_by = this.$route.query.sort_by;
      }
      if (this.$route.query.order_by && this.$route.query) {
        filter.order_by = this.$route.query.order_by;
      }
      if (this.$route.query.status && this.$route.query) {
        filter.status = this.$route.query.status;
      }

      this.filter.page = 1;

      this.$emit("filteredForm", filter);
      // await this.fetchApartments(this);
      this.$refs.mySidebar.hide();
    },

    async filterClear() {
      this.filter = {
        filtered: false,
        number: [],
        rooms: [],
        floors: [],
        blocks: [],
        price_from: null,
        price_to: null,
        area_from: null,
        area_to: null,
        status: null,
        usd: false,
        sort_by: null,
        order_by: null,
        page: 1,
      };
      this.$emit("filteredForm", this.filter);
      this.$router.push({
        name: "apartments",
        query: {},
      });
      // this.fetchApartments(this);
    },
  },
};
</script>

<style scoped></style>
