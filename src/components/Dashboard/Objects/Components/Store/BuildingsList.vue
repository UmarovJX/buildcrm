<template>
  <div>
    <div v-for="(building, index) in buildings" :key="index">
      <div v-if="!building.edit">
        <h3 class="title__middle my-3">
          {{ building.name }}
        </h3>
      </div>

      <div v-if="!building.edit">
        <p class="my-3">
          {{ $t("objects.create.balcony_price") }}:
          {{ building.balcony_price ? building.balcony_price : $t("no") }} $
        </p>
      </div>

      <div v-else>
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

        <button
            class="btn btn-success"
            @click="UpdateBuild(building)"
            type="button"
        >
          <i class="fa fa-save"></i> {{ $t("save") }}
        </button>
      </div>

      <div class="new-object__inside px-3 px-sm-4 py-4 my-4">
        <!-- Квартирные блоки -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="title__middle mb-0">
            {{ $t("objects.create.blocks_apartment") }}
          </h3>
          <div>
            <div class="dropdown my-dropdown dropleft">
              <button
                  type="button"
                  class="dropdown-toggle"
                  data-toggle="dropdown"
              >
                <i class="far fa-ellipsis-h"></i>
              </button>
              <div class="dropdown-menu">
                <a
                    class="dropdown-item dropdown-item--inside"
                    href="#"
                    @click="building.edit = true"
                >
                  <i class="fas fa-pen"></i> {{ $t("edit") }}
                </a>

                <!--                                <a class="dropdown-item dropdown-item&#45;&#45;inside" href="#" >-->
                <!--                                    <i class="fas fa-copy"></i> {{ $t('objects.create.copy_building') }}-->
                <!--                                </a>-->

                <a
                    @click="DeleteBuild(building, index)"
                    class="dropdown-item dropdown-item--inside"
                    href="#"
                >
                  <i class="far fa-trash"></i> {{ $t("delete") }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="object">
          <!--mb-5-->
          <div
              class="object__item object__item--inside"
              v-for="(block, block_index) in building.blocks"
              :key="block_index"
          >
            <div class="object__more-info">
              <div class="dropdown my-dropdown dropleft">
                <button
                    type="button"
                    class="dropdown-toggle"
                    data-toggle="dropdown"
                >
                  <i class="far fa-ellipsis-h"></i>
                </button>
                <div class="dropdown-menu">
                  <b-link
                      class="dropdown-item dropdown-item--inside"
                      href="#"
                      @click="editBlock(building, block, index, block_index)"
                  >
                    <i class="fas fa-pen"></i> {{ $t("edit") }}
                  </b-link>

                  <!--                                    <a class="dropdown-item dropdown-item&#45;&#45;inside" >-->
                  <!--                                        <i class="far fa-copy"></i>{{ $t('objects.create.copy_block') }}-->
                  <!--                                    </a>-->

                  <a
                      class="dropdown-item dropdown-item--inside"
                      @click="DeleteBlock(block, block_index, index)"
                  >
                    <i class="far fa-trash"></i> {{ $t("delete") }}
                  </a>
                </div>
              </div>
            </div>

            <a href="#" class="object__link">
              <div
                  class="object__img object__img--inside"
                  :style="
                  'background-image: url(' +
                  require('@/assets/img/object__img2.png') +
                  ');'
                "
              ></div>
              <div class="object__name object__name--inside">
                {{ block.name }}
              </div>
              <div class="object__info object__info--inside">
                {{ $t("objects.create.apartments") }}:
                {{ block.apartments.length }},
                {{ $t("objects.create.floors") }}: {{ block.floor }}
              </div>
            </a>
          </div>

          <div class="object__item object__item--inside object__item-last">
            <b-link @click="CreateBlock(building, index)" class="object__link">
              <div class="object__add object__add--inside">
                <i class="fal fa-plus"></i>
              </div>
              <div class="object__name object__name--inside">
                {{ $t("objects.create.new_block") }}
              </div>
            </b-link>
          </div>
        </div>

        <!-- Parking lot -->
      </div>
    </div>
    <create-block
        :type-plans="plans"
        @CreateBlockClose="CreateBlockClose"
        @InsertBlock="InsertBlock"
        :building="building"
        :block="block_data"
    ></create-block>
    <edit-block
        :type-plans="plans"
        :building="building"
        @save-edit-block="SaveEditBlock"
        :block="block_edit"
    ></edit-block>
  </div>
</template>

<script>
import CreateBlock from "../Block/Create";
import EditBlock from "../Block/Edit";
import api from "@/services/api";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

export default {
  name: "BuildingList",
  props: {
    plans: {},
    buildings: {},
    object: {},
  },

  components: {
    "create-block": CreateBlock,
    "edit-block": EditBlock,
    "date-picker": DatePicker
  },

  data: () => ({
    building: {
      id: null,
      balcony_price: 0,
      edit: false,
      name: null,
      blocks: [],
      installment_month: '',
      completion_date: '',
    },

    block_data: {
      id: null,
      name: null,
      floor: 0,
      floors: null,
      prices: [],
      apartment_count: null,
      apartments: [],
    },

    block_edit: {
      id: null,
      name: null,
      floor: 0,
      floors: null,
      prices: [],
      apartment_count: null,
      apartments: [],
    },

    block_building_index: null,
    block_index: null,

    disabled: {
      block: {
        create: false,
        update: false,
      },
    },

    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },
  }),

  methods: {
    async UpdateBuild(building) {
      try {
        const {data, status} = await api.objects.updateBuilding(this.object.id, building.id, building)

        if (status === 202) {
          building.edit = false;
          building = data;
        }
      } catch (error) {
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },

    CreateBlockClose() {
      this.block_data = {
        id: null,
        name: null,
        floor: 0,
        floors: null,
        apartment_count: null,
        apartments: [],
      };
    },

    SaveEditBlock() {
      this.block_edit = {
        id: null,
        name: null,
        floor: 0,
        floors: null,
        apartment_count: null,
        apartments: [],
      };
      this.$bvModal.hide("modal-edit-block");
    },

    InsertBlock(event) {
      let index = this.block_building_index;
      this.buildings[index].blocks.push({...event});
      this.$bvModal.hide("modal-create-block");

      this.block_data = {
        id: null,
        name: null,
        floor: null,
        floors: null,
        apartment_count: null,
        apartments: [],
      };
    },

    async CreateBlock(building, index) {
      this.building = building;

      try {
        const {data, status} = await api.objects.createBuildingBlock(building.id, {})

        if (status === 201) {
          this.disabled.block.create = true;
          this.block_building_index = index;
          this.block_data = data;
          this.$bvModal.show("modal-create-block");
        }
      } catch (error) {
        this.building_id = null;
        this.disabled.block.create = false;
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },

    editBlock(building, block, index, block_index) {
      this.building = building;

      this.block_edit = block;

      this.block_index = block_index;
      this.block_building_index = index;

      this.$bvModal.show("modal-edit-block");
    },

    DeleteBuild(building, index) {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yes"),
      }).then((result) => {
        if (result.value) {
          api.objects.deleteBuilding(this.object.id, building.id)
              .then((response) => {
                if (response.status === 204) {
                  this.buildings.splice(index, 1);
                }
              })
              .catch((error) => {
                this.toastedWithErrorCode(error);

                if (error.response.status === 422) {
                  this.error = true;
                  this.errors = error.response.data;
                }
              });
        }
      });
    },

    DeleteBlock(block, block_index, index) {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yes"),
      }).then((result) => {
        if (result.value) {
          api.objects.deleteBlock(block.id)
              .then((response) => {
                if (response.status === 204) {
                  this.buildings[index].blocks.splice(block_index, 1);
                }
              })
              .catch((error) => {
                this.toastedWithErrorCode(error);

                if (error.response.status === 422) {
                  this.error = true;
                  this.errors = error.response.data;
                }
              });
        }
      });
    },
  },
};
</script>

<style scoped></style>
