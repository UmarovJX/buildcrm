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

      <button class="btn btn-success" type="submit">
        <i class="fa fa-save"></i> {{ $t("save") }}
      </button>
    </form>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  props: {
    object: {},
  },

  data: () => ({
    building: {
      name: null,
      balcony_price: null,
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
        const {data, status} = await api.objects.createBuilding(this.object.id, this.building)

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

<style scoped></style>
