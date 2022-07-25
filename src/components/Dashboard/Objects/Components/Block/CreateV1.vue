<template>
  <div>
    <b-modal
        id="modal-create-block"
        class="py-4"
        ref="modal"
        :title="$t('objects.create.new_block')"
        size="lg"
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
                    required
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
                        required
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
                        @click="createApartments"
                        :disabled="!block.floor ?? false"
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
                      required
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
              v-if="disabled.settings && block.prices.length === 0"
          >
            <i class="fa fa-info-circle"></i>
            {{ $t("objects.create.alert_price") }}
          </div>

          <div
              class="object__item object__item--inside object__item-last"
              v-if="disabled.settings && block.prices.length === 0"
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
              v-if="disabled.settings && block.prices.length > 0"
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
              <h2 class="mb-0">
                <button
                    class="btn btn-link btn-block text-left"
                    type="button"
                    data-toggle="collapse"
                    :data-target="'#collapseOne' + index"
                    aria-expanded="true"
                    :aria-controls="'collapseOne' + index"
                    style="color: black"
                >
                  {{ floor }}-{{ $t("objects.create.floor") }} -
                  {{ $t("objects.create.apartments") }} ({{
                    settings.apartments[index].length
                  }})
                </button>
              </h2>
            </div>

            <div
                :id="'collapseOne' + index"
                :class="index === 0 ? 'collapse show' : 'collapse show'"
                :aria-labelledby="'headingOne' + index"
                data-parent="#floors"
            >
              <div class="card-body">
                <div class="row">
                  <apartments
                      :building="building"
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
                        block.apartments.length > 0 &&
                        settings.apartments[index].length === 0
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
                      block.apartments.length > 0 &&
                      settings.apartments[index].length === 0
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
                                  :disabled="index_clone === index ?? false"
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
                              class="btn"
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

      btn_save: false,
    },

    disabled: {
      apartments: false,
      block_create: false,
      settings: false,
      btn_save: false,
      price_update: false,
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
      this.updateBlock();
      if (this.block.name.length > 0 && this.block.floor > 0) {
        this.settings.btn_save = true;
      }
    },

    // 'block.floor': function() {
    //     this.updateBlock();
    // },

    // 'block.floors': function() {
    //     this.updateBlock();
    // },

    //     'block_preview.apartment': function () {
    //         if (this.block_preview.apartment > 0 && this.block_preview.floor > 0) {
    //             this.disabled.btn_save = true;
    //         }
    //     },

    "block.apartments": function () {
      this.setGroupApartments();
    },

    "block.floors": function () {
      //this.setFloors();
    },

    "block.floor": function (newVal, oldVal) {
      var old = parseInt(oldVal);

      if (newVal === old) {
        return;
      }

      if (this.block.floor > 0) {
        this.disabled.btn_save = true;
      }

      if (this.block.name.length > 0 && this.block.floor > 0) {
        this.settings.btn_save = true;
      }
    },
  },

  computed: mapGetters(["getCurrency"]),

  methods: {
    saveBlock() {
      this.$emit("InsertBlock", this.block);
      // this.$emit('RemoveBlock');
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

    removeBlock() {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yes"),
      }).then((result) => {
        if (result.value) {
          api.objects.deleteBlock(this.block.id)
              .then((response) => {
                if (response.status === 204) {
                  this.$bvModal.hide("modal-create-block");
                  this.$emit("CreateBlockClose");
                  //this.buildings.splice(index, 1);
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

    CopyFloor() {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_copy_block"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
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
                  this.block = response.data;
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
      // this.block_preview.apartment = 1;
      // this.block_preview.apartments = [];
      // this.block_preview.floor = 1;
      // this.block_preview.floors = [];
      // this.block_preview.name = '';
      // this.block_preview.prices = [];
      //
      // this.disabled.block_create = false;
      // this.disabled.btn_save = true;
      // this.disabled.settings = false;
      // this.disabled.apartments = false;
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

    createApartments() {
      this.block.floors = [];
      this.settings.available_floors = [];

      for (let i = 1; i <= this.block.floor; i++) {
        this.block.floors.push(i);
        // this.settings.available_floors.push(i);
      }

      // if (this.settings.available_floors.length > 0|| this.settings.disabled_floors.length > 0) {
      //     for (let i = 1; i <= this.block.floor; i++) {
      //         this.block.floors.push(i);
      //         this.settings.available_floors.push(i);
      //     }
      //     this.settings.disabled_floors = [];
      //     this.block.prices = [{
      //         price: 0,
      //         floors: []
      //     }];
      // } else {
      //     for (let i = 1; i <= this.block.floor; i++) {
      //         this.block.floors.push(i);
      //         this.settings.available_floors.push(i);
      //     }
      // }

      this.disabled.settings = true;
      this.disabled.btn_save = false;

      this.setFloors();
      this.updateBlock();
    },

    selectFloor(price) {
      // let keyy = 0;
      // this.settings.available_floors.map((value, key) => {
      //     if (value === index) {
      //         keyy =  key;
      //     }
      // });

      // this.settings.available_floors.splice(keyy, 1);
      // this.settings.disabled_floors.push(index);
      // this.sortDisabledFloors();

      this.updatePrice(price);
    },

    removeFloor(price) {
      // let keyy = 0;
      //
      // this.settings.disabled_floors.map((value, key) => {
      //     if (value === index) {
      //         keyy =  key;
      //     }
      // });
      //
      // this.settings.disabled_floors.splice(keyy, 1);

      // this.setFloors();
      // this.settings.available_floors.push(index);
      //this.sortAvailableFloors();
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
      if (this.block.prices.length === 0) {
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

    async AddApartment(floor) {
      try {
        const {data, status} = await api.objects.apartmentAddition(this.block.id, {floor})
        if (status === 202) {
          this.block = data;
        }
      } catch (error) {
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },

    setGroupApartments() {
      let apartments = this.block.apartments;

      if (this.block.floors === null) {
        this.block.floors = [];
      }
      // var sources = images.reduce(function(result, img) {
      //     if (img.src.split('.').pop() !== "json") {
      //         result.push(img.src);
      //     }
      //     return result;
      // }, []);
      //
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
      var a = [],
          diff = [];

      for (var c = 0; c < a1.length; c++) {
        a[a1[c]] = true;
      }

      for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
          delete a[a2[i]];
        } else {
          a[a2[i]] = true;
        }
      }

      for (var k in a) {
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

    // createApartment() {
    //     this.block_preview.apartments.push({
    //         floor: 1,
    //         type_plan: null,
    //         rooms: 0,
    //         //area: 0,
    //         price: 0,
    //         balcony_paid: false,
    //         entrance: 1,
    //     });
    //
    //     let apartment_count = this.block_preview.apartment + 1;
    //
    //     this.block_preview.apartment = apartment_count;
    // },

    async addPrice() {
      try {
        const {data, status} = await api.objects.addBlockPrice(this.block.id, {})
        if (status === 201) {
          this.block = data;
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

    async removePrice(price) {
      try {
        const {data, status} = await api.objects.deleteBlockPrice(this.block.id, price.id)
        if (status === 202) {
          this.block = data;
          this.setFloors();
        }
      } catch (error) {
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }

      // this.block_preview.prices[index].floors.map((value) => {
      //     for (let ii = 0; ii < this.settings.disabled_floors.length; ii++) {
      //         if (value == this.settings.disabled_floors[ii]) {
      //             this.settings.disabled_floors.splice(ii, 1);
      //             this.settings.available_floors.push(value);
      //             this.sortAvailableFloors();
      //             this.sortDisabledFloors();
      //         }
      //     }
      // });
      // this.block_preview.prices.splice(index, 1);
    },
    //
    // removeApartment(index) {
    // this.block_preview.apartment -= 1;
    // this.block_preview.apartments.splice(index, 1)
    // }
  },
};
</script>

<style scoped></style>
