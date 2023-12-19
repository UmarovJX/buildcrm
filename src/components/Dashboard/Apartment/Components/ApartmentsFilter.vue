<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    filtered: {
      type: Object,
    },
  },
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
    }
  },

  mounted() {
    if (this.filtered.status) {
      if (this.filtered.number === true) {
        this.filtered.status = true
      } else {
        this.filtered.status = null
      }
    }
    if (this.filtered.number) {
      if (typeof this.filtered.number === 'string') {
        const newArr = []
        const newArrItem = parseInt(this.filtered.number)
        newArr.push(newArrItem)
        this.filtered.number = newArr
      }
    }
    if (this.filtered.rooms) {
      if (typeof this.filtered.rooms === 'string') {
        const newArr = []
        const newArrItem = parseInt(this.filtered.rooms)
        newArr.push(newArrItem)
        this.filtered.rooms = newArr
      }
    }

    if (this.filtered.floors) {
      if (typeof this.filtered.floors === 'string') {
        const newArr = []
        const newArrItem = parseInt(this.filtered.floors)
        newArr.push(newArrItem)
        this.filtered.floors = newArr
      }
    }

    if (this.filtered.blocks) {
      if (typeof this.filtered.blocks === 'string') {
        const newArr = []
        const newArrItem = parseInt(this.filtered.blocks)
        newArr.push(newArrItem)
        this.filtered.blocks = newArr
      }
    }

    this.filter = {
      ...this.filter,
      ...this.filtered,
    }

    this.fetchFilterObject(this)
  },

  computed: mapGetters(['getObjects', 'getFilterParams']),

  methods: {
    ...mapActions(['fetchApartments', 'fetchObjects', 'fetchFilterObject']),

    async Filter() {
      const filter = {}
      for (const [key, value] of Object.entries(this.filter)) {
        const notUsedProperties = typeof value === 'object' && value === null
        if (notUsedProperties) continue

        const isString = typeof value === 'string' && value !== ''
        const isArray = Array.isArray(value) && value.length > 0
        const isBoolean = typeof value === 'boolean'
        if (isString || isArray || isBoolean) {
          filter[key] = value
        }
      }

      const { query } = this.$route
      const usedProperties = ['sort_by', 'order_by', 'status']
      const hasProperties = Object.keys(query).length > 0

      const initRouteFilterQuery = () => {
        for (const [key, value] of Object.entries(query)) {
          const findIndex = usedProperties.findIndex(
            property => property === key,
          )
          if (findIndex !== -1) {
            this.filter[key] = value
          }
        }
      }

      hasProperties && initRouteFilterQuery()

      this.filter.page = 1
      this.$emit('filteredForm', filter)
      this.$refs.mySidebar.hide()
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
      }
      this.$emit('filteredForm', this.filter)
      this.$router.push({
        name: 'apartments',
        query: {},
      })
      // this.fetchApartments(this);
    },
  },
}
</script>

<template>
  <div>
    <b-sidebar
      id="apartment-list-filter"
      ref="mySidebar"
      right
      shadow
      width="420px"
      backdrop
      :title="$t('apartments.list.filter')"
      :no-close-on-route-change="true"
    >
      <div class="container">
        <!-- Номер квартира -->
        <div class="mb-3">
          <label
            for="tags-separators"
          >{{ $t("apartments.filter.apartment_number") }}:
          </label>
          <b-form-tags
            v-model="filter.number"
            input-id="tags-separators"
            separator=" "
            remove-on-delete
            tag-pills
            input-type="tel"
            add-button-variant="primary"
            add-button-text="+"
            :placeholder="$t('apartments.filter.apartment_number')"
          />
        </div>

        <!-- Количество комнат -->
        <div class="mb-3">
          <label class="d-block">
            {{ $t("apartments.filter.apartments") }}
          </label>
          <div class="room">
            <span
              v-for="(room, index) in getFilterParams.rooms"
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

        <!-- Этаж -->
        <div class="mb-3">
          <label class="d-block">
            {{ $t("apartments.filter.floor") }}
          </label>
          <div class="room">
            <span
              v-for="(floor, index) in getFilterParams.floors"
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

        <!-- Блоки -->
        <div class="mb-3">
          <label class="d-block">
            {{ $t("apartments.filter.blocks") }}
          </label>
          <div class="room">
            <span
              v-for="(block, index) in getFilterParams.blocks"
              :key="index"
            >
              <input
                :id="'block' + index"
                v-model="filter.blocks"
                type="checkbox"
                :value="block.id"
              >
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

        <!-- Статус -->
        <div class="mt-4 my-custom-control">
          <div>
            <label class="d-block">{{ $t("apartments.filter.status") }}</label>
          </div>

          <div class="d-flex align-items-center">
            <div class="custom-control custom-checkbox mr-4">
              <input
                id="usd"
                v-model="filter.usd"
                type="checkbox"
                class="custom-control-input"
                value="1"
              >
              <label
                class="custom-control-label"
                for="usd"
              >{{
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
            <i class="far fa-times" /> {{ $t("apartments.filter.clear") }}
          </button>

          <b-button
            class="mt-0 mr-0"
            variant="primary"
            size="md"
            type="button"
            @click="Filter"
          >
            <i class="far fa-sliders-h mr-2" />
            {{ $t("apartments.filter.filter_btn") }}
          </b-button>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<style scoped></style>
