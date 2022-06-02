<template>
  <div>
    <b-modal
        id="modal-edit-block"
        class="py-4"
        ref="modal"
        :title="$t('objects.create.edit_block')"
        size="xl"
        hide-footer
        hide-header-close
        no-close-on-backdrop
    >
      <form class="my-form" @submit.prevent="saveBlock">
        <div class="container px-0 mx-0">
          <div class="row">
            <div class="col-12">
              <div class="mb-3">
                <label class="d-block" for="new_block_title">
                  {{ $t("objects.create.name") }}
                </label>
                <input
                    v-model="block.name"
                    :placeholder="$t('objects.placeholder.block_name')"
                    id="new_block_title"
                    class="my-form__input"
                    type="text"
                />
              </div>
            </div>
            <div class="col-lg-9">
              <div class="row">
                <div class="col-lg-6">
                  <div class="mb-3">
                    <label class="d-block" for="new_block_floor-count">
                      {{ $t("objects.create.count_floors") }}
                    </label>
                    <input
                        v-model="block.floor"
                        class="my-form__input"
                        type="number"
                        value="15"
                        id="new_block_floor-count"
                        min="1"
                        max="100"
                    />
                  </div>
                </div>
                <div
                    class="
                    col-lg-3
                    ml-2
                    d-flex
                    flex-column
                    justify-content-end
                    align-items-end
                  "
                >
                  <div class="mb-3" v-if="disabled.btn_save">
                    <button
                        type="button"
                        @click="createFloor"
                        :disabled="!block.floor ? true : false"
                        class="btn btn-primary"
                    >
                      {{ $t("create") }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="disabled.settings">
            <div
                class="row"
                v-for="(price, index) in block.prices"
                :key="index"
            >
              <div class="col-lg-4">
                <div class="mb-3">
                  <label class="d-block" for="new_block_price">
                    {{ $t("objects.create.price_area") }}
                  </label>
                  <input
                      id="new_block_price"
                      class="my-form__input"
                      @change="updatePrice(price)"
                      type="number"
                      v-model="price.price"
                      min="1"
                  />
                </div>
              </div>
              <div class="col-lg-8">
                <div class="mb-3">
                  <div>
                    <label class="d-block">
                      {{ $t("objects.create.floors") }}
                    </label>
                  </div>
                  <div class="d-flex align-items-center">
                    <div class="flex-grow-1">
                      <multiselect
                          v-model="price.floors"
                          :multiple="true"
                          :options="settings.available_floors"
                          @select="selectFloor(price, index)"
                          @remove="removeFloor(price, index)"
                      >
                      </multiselect>
                    </div>
                    <div>
                      <button
                          type="button"
                          class="btn btn-danger ml-2"
                          v-if="block.prices.length != 1"
                          @click="removePrice(price, index)"
                      >
                        <i class="far fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
              class="alert alert-info"
              v-if="disabled.settings && block.prices && block.prices.length === 0"
          >
            <i class="fa fa-info-circle"></i>
            {{ $t("objects.create.alert_price") }}
          </div>

          <div
              class="object__item object__item--inside object__item-last"
              v-if="disabled.settings && block.prices &&  block.prices.length === 0"
          >
            <b-link class="object__link" @click="addPrice">
              <div class="object__add object__add--inside">
                <i class="fal fa-plus"></i>
              </div>
              <div class="object__name object__name--inside">
                {{ $t("objects.create.create_price") }}
              </div>
            </b-link>
          </div>

          <div
              class="mt-4 d-flex justify-content-md-start justify-content-center"
              v-if="disabled.settings && block.prices && block.prices.length > 0"
          >
            <button type="button" class="btn btn-primary" @click="addPrice">
              <i class="fal fa-plus mr-2"></i>
              {{ $t("objects.create.new_price") }}
            </button>
          </div>
        </div>

        <div class="accordion mt-3" id="floors" v-if="disabled.apartments">
          <div class="card" v-for="(floor, index) in block.floors" :key="index">
            <div class="card-header" :id="'headingOne' + index">
              <!--              {{ settings.apartments[index].length + 'lalalal' }}-->
              <h2 class="mb-0">
                <button
                    class="btn btn-link btn-block text-left apartment__list"
                    type="button"
                    data-toggle="collapse"
                    :data-target="'#collapseOne' + index"
                    aria-expanded="true"
                    :aria-controls="'collapseOne' + index"
                >
                  {{ floor }}-{{ $t("objects.create.floor") }} -
                  {{ $t("objects.create.apartments") }} (
                  {{ settings.apartments[index].length }}
                  )
                </button>
              </h2>
            </div>

            <div
                :id="'collapseOne' + index"
                :class="index === 0 ? 'collapse' : 'collapse'"
                :aria-labelledby="'headingOne' + index"
                data-parent="#floors"
            >
              <div class="card-body">
                <div class="row">
                  <apartments
                      :building="building"
                      @RemoveApartment="RemoveApartment"
                      :apartments="settings.apartments[index]"
                      @UpdateApartments="UpdateApartments"
                      :block="block"
                      :type-plans="typePlans"
                  ></apartments>

                  <div class="col-lg-4 my-2">
                    <div class="apartment apartment-last">
                      <a
                          href="#"
                          @click="AddApartment(floor)"
                          class="object__link position-relative top-0 left-0"
                      >
                        <div class="object__add object__add--inside">
                          <i class="fal fa-plus"></i>
                        </div>
                        <div class="object__name object__name--inside">
                          {{ $t("objects.create.apartment") }}
                        </div>
                      </a>
                    </div>
                  </div>

                  <div class="col-lg-4 my-2">
                    <div
                        class="apartment apartment-last"
                        v-if="
                        block.apartments.length > 0 && settings.apartments[index] &&
                        !settings.apartments[index].length
                      "
                    >
                      <a
                          data-toggle="collapse"
                          :href="'#collapseCopy' + index"
                          role="button"
                          aria-expanded="false"
                          :aria-controls="'collapseCopy' + index"
                          class="object__link position-relative top-0 left-0"
                      >
                        <div class="object__add object__add--inside">
                          <i class="fal fa-copy"></i>
                        </div>
                        <div class="object__name object__name--inside">
                          {{ $t("objects.create.clone_apartments") }}
                        </div>
                      </a>
                    </div>
                  </div>

                  <div
                      class="col-md-12"
                      v-if="
                      block.apartments.length > 0 && settings.apartments[index] &&
                      !settings.apartments[index].length
                    "
                  >
                    <div class="collapse" :id="'collapseCopy' + index">
                      <div class="card">
                        <div class="card-body">
                          <div class="form-group">
                            <label :for="'clone' + index">
                              {{ $t("objects.create.choose_clone") }}
                            </label>
                            <select
                                class="form-control"
                                @change="cloneSelectFloor(index)"
                                v-model="settings.clone_floor_select"
                            >
                              <option
                                  v-for="(
                                  floor, index_clone
                                ) in settings.apartments"
                                  :disabled="index_clone === index ? true : false"
                                  :value="index_clone"
                                  :key="index_clone"
                              >
                                {{ index_clone + 1 }} -
                                {{ $t("objects.create.floor") }}
                              </option>
                            </select>
                          </div>
                        </div>

                        <div class="card-footer">
                          <button
                              type="button"
                              @click="CopyFloor"
                              class="btn btn-primary"
                          >
                            <i class="fa fa-copy"></i>
                            {{ $t("objects.create.clone") }}
                          </button>

                          <button
                              type="button"
                              class="btn btn-secondary"
                              data-toggle="collapse"
                              :data-target="'#collapseCopy' + index"
                              aria-expanded="false"
                              :aria-controls="'collapseCopy' + index"
                          >
                            {{ $t("close") }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
            class="
            mt-4
            d-flex
            justify-content-md-start justify-content-center
            float-right
          "
        >
          <button
              type="button"
              class="btn btn-default mr-2"
              @click="removeBlock"
          >
            {{ $t("cancel") }}
          </button>

          <button
              type="submit"
              v-if="settings.btn_save"
              class="btn btn-success"
          >
            <i class="fa fa-save"></i> {{ $t("save") }}
          </button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Apartments from "./Apartments";
import api from "@/services/api";

export default {
  props: {
    typePlans: {},
    building: {},
    block: {},
  },

  data: () => ({
    settings: {
      available_floors: [],
      disabled_floors: [],

      apartments: [],

      clone_floor: null,
      clone_floor_select: null,

      btn_save: true,
    },

    disabled: {
      create: true,
      apartments: true,
      block_create: true,
      settings: true,
      btn_save: false,
      price_update: true,
    },

    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },
  }),

  components: {
    apartments: Apartments,
  },

  watch: {
    "block.name": function () {
      if (this.block.id !== null) {
        this.disabled.create = true;

        this.updateBlock();
        if (this.block.name.length > 0 && this.block.floor > 0) {
          this.settings.btn_save = true;
        }
      }
    },

    "block.apartments": function () {
      if (this.block.id != null) {
        this.setGroupApartments();
      }
    },

    // "block.floors": function () {
    //   //this.setFloors();
    // },

    "block.floor": function (newVal, oldVal) {
      let old = parseInt(oldVal);

      if (newVal === old) {
        return;
      }

      if (this.block.floor == null) {
        return;
      }

      if (this.block.floor > 0) {
        this.disabled.btn_save = true;
      }
      if (this.block.name && this.block.name.length > 0 && this.block.floor > 0) {
        this.settings.btn_save = true;
      }
    },
  },

  computed: mapGetters(["getCurrency"]),

  methods: {
    saveBlock() {
      this.$emit("save-edit-block", this.block);
      this.clearPreviewBlock();
    },

    async updatePrice(price) {
      try {
        await api.objects.updateBlockPrice(this.block.id, price.id, price)

        this.setFloors();
        // if (status === 202) {
        //     this.block = data;
        // }
      } catch (error) {
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },

    async RemoveApartment() {
      try {
        const {data, status} = await api.objects.getBlockApartments(this.block.id)
        if (status === 200) {
          this.block.apartments = [];
          this.block.apartments = data;
          this.setGroupApartments();
        }
      } catch (error) {
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },

    removeBlock() {
      this.$bvModal.hide("modal-edit-block");
      this.$emit("save-edit-block");
      this.clearPreviewBlock();
    },

    CopyFloor() {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_copy_block"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes_clone"),
      }).then((result) => {
        if (result.value) {
          const data = {
            apartments:
                this.settings.apartments[this.settings.clone_floor_select],
            floor: this.block.floors[this.settings.clone_floor],
          };

          api.objects.cloneFloors(this.block.id, data)
              .then((response) => {
                if (response.status === 201) {
                  this.block.apartments = [];
                  this.block.apartments = response.data;
                  this.setGroupApartments();

                  this.settings.clone_floor = null;
                  this.settings.clone_floor_select = null;

                  // this.this.setFloors();
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

    cloneSelectFloor(event) {
      this.settings.clone_floor = event;
    },

    clearPreviewBlock() {
      this.settings = {
        available_floors: [],
        disabled_floors: [],

        apartments: [],

        clone_floor: null,
        clone_floor_select: null,

        btn_save: true,
      };

      this.disabled = {
        create: true,
        apartments: true,
        block_create: true,
        settings: true,
        btn_save: false,
        price_update: true,
      };

    },

    async AddApartment(floor) {
      try {
        const {data, status} = await api.objects.apartmentAddition(this.block.id, {floor})

        if (status === 201) {
          this.block.apartments.push(data);
        }
      } catch (error) {
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },

    async UpdateApartments() {
      try {
        const body = {apartments: this.block.apartments}
        await api.objects.updateApartments(body)
      } catch (error) {
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },

    createFloor() {
      this.block.floors = [];
      this.settings.available_floors = [];

      for (let i = 1; i <= this.block.floor; i++) {
        this.block.floors.push(i);
        // this.settings.available_floors.push(i);
      }

      this.disabled.settings = true;
      this.disabled.btn_save = false;

      this.setFloors();
      this.updateBlock();
      this.setGroupApartments();
    },

    selectFloor(price) {
      this.updatePrice(price);
    },

    removeFloor(price) {
      this.updatePrice(price);
    },

    sortDisabledFloors() {
      this.settings.disabled_floors.sort((a, b) => {
        return a - b;
      });
    },

    sortAvailableFloors() {
      this.settings.available_floors.sort((a, b) => {
        return a - b;
      });
    },

    setFloors() {
      if (this.block.prices && !this.block.prices.length) {
        for (let i = 1; i <= this.block.floor; i++) {
          this.settings.available_floors.push(i);
        }
      } else {
        let floors = this.block.prices.map(function (price) {
          if (price.floors === null) {
            return [];
          } else {
            return price.floors;
          }
        });

        if (floors.flat().length) {
          this.settings.disabled_floors = floors.flat();

          let available = this.rr_diff(floors.flat(), this.block.floors);

          available = available.map(function (key) {
            return parseInt(key);
          });

          this.settings.available_floors = available;
        } else {
          let available = this.rr_diff(floors.flat(), this.block.floors);

          available = available.map(function (key) {
            return parseInt(key);
          });

          this.settings.available_floors = available;
        }
      }
    },

    setGroupApartments() {
      let apartments = this.block.apartments;

      if (this.block.floors === null) {
        this.block.floors = [];
      }

      let floors = this.block.floors
          .map(function (floor) {
            let group = [];
            let apartment;
            if (apartments.length > 0) {
              apartment = apartments
                  .map(function (apartment) {
                    if (apartment.floor === floor) {
                      return apartment;
                    }
                    return null;
                  })
                  .filter(function (e) {
                    return e != null;
                  });
            } else {
              apartment = [];
            }

            group[floor] = apartment;

            return group;
          })
          .flat();

      this.settings.apartments = floors;
    },

    rr_diff(a1, a2) {
      let a = [],
          diff = [];

      for (let c = 0; c < a1.length; c++) {
        a[a1[c]] = true;
      }

      for (let i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
          delete a[a2[i]];
        } else {
          a[a2[i]] = true;
        }
      }

      for (let k in a) {
        diff.push(k);
      }

      return diff;
    },

    async updateBlock() {
      try {
        await api.objects.updateBlock(this.block.id, this.block)
      } catch (error) {
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },

    async addPrice() {
      try {
        const {data, status} = await api.objects.addBlockPrice(this.block.id, {})
        if (status === 201) {
          this.block.prices.push(data);
          this.disabled.apartments = true;
          this.setFloors();
        }
      } catch (error) {
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },

    async removePrice(price, index) {
      try {
        const {status} = await api.objects.deleteBlockPrice(this.block.id, price.id)
        if (status === 204) {
          this.block.prices.splice(index, 1);
          this.setFloors();
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

<style scoped>
.apartment__list {
  color: var(--object-color) !important;
}
</style>
