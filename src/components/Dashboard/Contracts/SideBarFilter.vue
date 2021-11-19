<template>
  <b-sidebar
    id="contracts-list-filter"
    right
    shadow
    width="420px"
    backdrop
    :title="$t('apartments.list.filter')"
    ref="mySidebarFilter"
    :no-close-on-route-change="true"
  >
    <div class="container">
      <!-- Номер контракта -->
      <label for="contract-number">Номер контракта: </label>
      <div class="mb-3">
        <input
          id="contract-number"
          class="my-form__input"
          type="text"
          v-model="filter.contract_number"
          placeholder="Номер контракта"
        />
      </div>

      <!-- Объект -->
      <div class="mb-3">
        <label for="object-number">Объект: </label>
        <!-- fetchObjects -->
        <select
          id="status"
          class="form-control"
          v-model="filter.object_id"
          multiple
          style="height: 100px !important"
        >
          <option
            :value="obj.id"
            v-for="obj in getObjects"
            :key="'obj' + obj.id"
          >
            {{ obj.name }}
          </option>
        </select>
      </div>

      <!-- Номер квартира -->
      <div class="mb-3">
        <label for="apartment-number">Номер квартира: </label>
        <b-form-tags
          input-id="apartment-number"
          v-model="filter.apartment_number"
          separator=" "
          remove-on-delete
          tag-pills
          inputType="tel"
          addButtonVariant="primary"
          addButtonText="+"
          placeholder="Номер квартира"
        ></b-form-tags>
      </div>

      <!-- Status -->
      <div class="mb-3" v-if="false">
        <label for="status">Статус: </label>
        <select
          id="status"
          class="form-control"
          v-model="filter.status"
          multiple
          style="height: 100px !important"
        >
          <option value="sold">Проданные</option>
          <option value="contract">Неоплаченные</option>
          <option value="booked">Забронированные</option>
        </select>
      </div>

      <!-- Номер телефона -->
      <div class="mb-3">
        <label for="phone-number">Номер телефона: </label>
        <input
          id="phone-number"
          class="my-form__input"
          type="tel"
          v-model="filter.phone"
          placeholder="Номер телефона"
        />
      </div>

      <!-- Ф.И.О -->
      <div class="mb-3">
        <label for="full_name">Ф.И.О: </label>
        <input
          id="full_name"
          class="my-form__input"
          type="tel"
          v-model="filter.full_name"
          placeholder="Ф.И.О"
        />
      </div>

      <!-- Фильтр по дате -->
      <div class="mb-3">
        <label for="filter-by-date">Фильтр по дате: </label>
        <date-picker
          id="filter-by-date"
          v-model="filter.date"
          type="date"
          range
          value-type="format"
          format="YYYY-MM-DD"
          placeholder="Select date range"
          class="w-100"
        ></date-picker>
      </div>
    </div>
    <template #footer>
      <div class="d-flex justify-content-center align-items-center my-2">
        <button
          class="btn btn-default mr-2 mt-0"
          type="reset"
          @click="filterContractsClear"
        >
          <i class="far fa-times"></i> {{ $t("apartments.filter.clear") }}
        </button>

        <b-button
          class="mt-0 mr-0"
          variant="primary"
          size="md"
          type="button"
          @click="contractsFilter"
        >
          <i class="far fa-sliders-h mr-2"></i>
          Фильтровать</b-button
        >
      </div>
    </template>
  </b-sidebar>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
export default {
  data() {
    return {
      filter: {
        contract_number: "",
        object_id: [],
        apartment_number: [],
        // status: [],
        full_name: "",
        phone: "",
        date: [],
      },
      client_phone: "",
      client_fullname: "",
    };
  },

  components: {
    DatePicker,
  },

  computed: mapGetters(["getObjects"]),
  mounted() {
    this.fetchObjects(this);
  },

  methods: {
    ...mapActions(["fetchObjects"]),

    contractsFilter() {
      console.log(1);
    
      this.$emit("contractsFiltered", this.filter);
      this.$refs.mySidebarFilter.hide();
    },

    async filterContractsClear() {

      this.filter = {
        contract_number: "",
        object_id: [],
        apartment_number: [],
        // status: [],
        phone: "",
        full_name: "",
        date: [],
        page: 1,
      };
    },
  },
};
</script>

<style scoped></style>
