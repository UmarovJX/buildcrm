<script>
import api from "@/services/api";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

export default {
  props: {
    object: {},
  },
  components: {
    "date-picker": DatePicker,
  },

  data: () => ({
    building: {
      name: null,
      balcony_price: null,
      completion_date: "",
      installment_month: "",
    },

    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },
  }),

  methods: {
    async saveBuilding() {
      try {
        const { data, status } = await api.objects.createBuilding(
          this.object.id,
          this.building
        );

        if (status === 201) {
          this.building = {
            name: null,
            balcony_price: null,
          };

          this.$emit("saveBuilding", data);
        }
      } catch (error) {
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },
  },
};
</script>

<template>
  <div>
    <form @submit.prevent="saveBuilding">
      <div class="mb-3">
        <label for="building_name" class="form-label">
          {{ $t("objects.placeholder.building_name") }}
        </label>
        <input
          type="text"
          class="form-control"
          id="building_name"
          required
          v-model="building.name"
          :placeholder="$t('objects.placeholder.building_name')"
        />
      </div>

      <div class="mb-3">
        <label for="balcony_price" class="form-label">
          {{ $t("objects.create.balcony_price") }}
        </label>
        <input
          type="number"
          class="form-control"
          v-model="building.balcony_price"
          min="0"
          step="0.1"
          id="balcony_price"
          :placeholder="$t('objects.create.balcony_price')"
        />
      </div>

      <div class="mb-3">
        <label for="completion_date" class="form-label">
          {{ $t("objects.build_date") }}
        </label>
        <date-picker
          v-model="building.completion_date"
          value-type="YYYY-MM-DD"
          format="DD.MM.YYYY"
          class="form-inline"
          id="completion_date"
          required
          :placeholder="$t('objects.build_date')"
        />
      </div>

      <div class="mb-3">
        <label for="installment_month" class="form-label">
          {{ $t("objects.credit_month") }}
        </label>
        <date-picker
          v-model="building.installment_month"
          value-type="YYYY-MM-DD"
          format="DD.MM.YYYY"
          class="form-inline"
          id="installment_month"
          required
          :placeholder="$t('objects.placeholder.credit_month')"
        />
      </div>

      <button class="btn btn-success" type="submit">
        <i class="fa fa-save"></i> {{ $t("save") }}
      </button>
    </form>
  </div>
</template>

<style scoped></style>
