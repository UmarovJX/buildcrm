<template>
  <div class="col-md-12">
    <div class="row">
      <div class="col-md-12">
        <button
            type="button"
            @click="updateApartmentsPrice"
            class="btn btn-primary"
        >
          <i class="fa fa-refresh"></i> {{ $t("objects.create.price_update") }}
        </button>
      </div>
      <div
          class="col-lg-4 my-2"
          v-for="(apartment, index) in apartments"
          :key="index"
      >
        <div class="apartment">
          <button
              type="button"
              @click="RemoveApartment(apartment, index)"
              class="apartment__close"
          >
            <i class="fal fa-times"></i>
          </button>

          <div class="apartment__info">
            {{ $t("objects.create.apartment") }} <span>{{ index + 1 }}</span>
          </div>

          <div class="apartment__info">
            <div class="dropdown my-dropdown__two">
              {{ $t("objects.create.plan.name") }}
              <select
                  class="custom-select"
                  v-model="apartment.plan"
                  @change="ApartmentUpdate(apartment, 'plan')"
              >
                <option
                    disabled
                    :value="{
                    id: null,
                    name: null,
                    area: null,
                    balcony: false,
                    balcony_area: 0,
                    image: null,
                  }"
                >
                  {{ $t("objects.create.choose_plan") }}
                </option>

                <option
                    v-for="(plan, index) in typePlans"
                    :value="{
                    id: plan.id,
                    name: plan.name,
                    area: plan.area,
                    balcony: plan.balcony,
                    balcony_area: plan.balcony_area,
                    image: plan.image ? plan.image : null,
                  }"
                    :key="index"
                >
                  {{ plan.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="apartment__info">
            {{ $t("objects.create.rooms") }}:
            <input
                type="number"
                min="1"
                class="form-control"
                @change="ApartmentUpdate(apartment, 'rooms')"
                v-model="apartment.rooms"
            />
          </div>

          <div class="apartment__info">
            {{ $t("objects.create.entrance") }}:
            <input
                type="number"
                min="1"
                class="form-control"
                @change="ApartmentUpdate(apartment, 'entrance')"
                v-model="apartment.entrance"
            />
          </div>

          <div class="apartment__info">
            {{ $t("objects.create.area") }}:
            <input
                type="number"
                min="0"
                class="form-control"
                disabled
                v-if="apartment.plan.id === null"
            />
            <input
                type="number"
                min="1"
                class="form-control"
                disabled
                v-else
                v-model="apartment.plan.area"
            />
          </div>

          <div v-if="apartment.plan.id && apartment.plan.balcony">
            <div class="apartment__info">
              {{ $t("objects.create.plan.balcony_area") }}:
              <input
                  type="number"
                  min="0"
                  class="form-control"
                  disabled
                  v-if="apartment.plan.id === null"
              />
              <input
                  type="number"
                  min="1"
                  class="form-control"
                  disabled
                  v-else
                  v-model="apartment.plan.balcony_area"
              />
            </div>

            {{ $t("objects.create.plan.balcony_paid") }}:
            <input
                type="checkbox"
                @change="ApartmentUpdate(apartment, 'balcony_paid')"
                v-model="apartment.balcony_paid"
            />
          </div>

          <div class="apartment__info">
            {{ $t("objects.create.other_price") }}:
            <input
                type="checkbox"
                @change="ApartmentUpdate(apartment, 'other_price')"
                v-model="apartment.check_other_price"
            />
          </div>

          <div class="apartment__info" v-if="apartment.check_other_price">
            {{ $t("objects.create.price_m2") }}:
            <input
                type="number"
                min="1"
                class="form-control"
                @change="ApartmentUpdate(apartment, 'price')"
                v-model="apartment.other_price"
            />
          </div>

          <div class="apartment__info">
            {{ $t("objects.create.price") }}:
            <span
            >{{
                calcApartmentPrice(index, apartment, 0)
                    | number("0,0.00", {
                  thousandsSeparator: " ",
                  decimalSeparator: ",",
                })
              }}
              {{ $t("usd") }}</span
            ><br/>

            {{ $t("objects.create.price") }} {{ $t("ye") }}:
            <span
            >{{
                calcApartmentPrice(index, apartment, getCurrency.usd)
                    | number("0,0.00", {
                  thousandsSeparator: " ",
                  decimalSeparator: ",",
                })
              }}
              {{ $t("ye") }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import api from "@/services/api";

export default {
  props: {
    building: {},
    apartments: {},
    typePlans: {},
    block: {},
  },

  data: () => ({
    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },
  }),

  mounted() {
    this.apartmentsSetPrice();
  },

  computed: mapGetters(["getCurrency"]),

  watch: {
    apartments: function () {
      this.apartmentsSetPrice();
    },

    block: function () {
      this.apartmentsSetPrice();
    },
  },

  methods: {
    async RemoveApartment(apartment, index) {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes"),
      }).then((result) => {
        if (result.value) {
          api.objects.deleteApartment(apartment.id)
              .then((response) => {
                if (response.status === 204) {
                  this.apartments.splice(index, 1);
                  this.$emit("RemoveApartment");
                  this.apartmentsSetPrice();
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

    async ApartmentUpdate(apartment, type) {
      let data = {};

      if (type === "plan") {
        data = {
          type: type,
          plan_id: apartment.plan.id,
          price_id: apartment.price.id,
        };
      } else if (type === "entrance") {
        data = {
          type: type,
          entrance: apartment.entrance,
          price_id: apartment.price.id,
        };
      } else if (type === "rooms") {
        data = {
          type: type,
          rooms: apartment.rooms,
          price_id: apartment.price.id,
        };
      } else if (type === "balcony_paid") {
        data = {
          type: type,
          balcony_paid: apartment.balcony_paid,
          price_id: apartment.price.id,
        };
      } else if (type === "other_price") {
        data = {
          type: type,
          check_other_price: apartment.check_other_price,
          price_id: apartment.price.id,
        };
      } else if (type === "price") {
        data = {
          type: type,
          check_other_price: apartment.check_other_price,
          price: apartment.other_price,
          price_id: null,
        };
      }

      try {
        await api.objects.updateApartment(apartment.id, data)
      } catch (error) {
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },

    updateApartmentsPrice() {
      this.apartmentsSetPrice();
      this.UpdateAllApartments();
    },

    apartmentsSetPrice() {
      for (var apartment = 0; apartment < this.apartments.length; apartment++) {
        if (this.apartments[apartment].check_other_price) {
          this.apartments[apartment].price_id = null;
        } else {
          for (var prices = 0; prices < this.block.prices.length; prices++) {
            if (this.block.prices[prices].floors) {
              for (
                  var floors = 0;
                  floors < this.block.prices[prices].floors.length;
                  floors++
              ) {
                if (
                    this.block.prices[prices].floors[floors] ===
                    this.apartments[apartment].floor
                ) {
                  this.apartments[apartment].price = this.block.prices[prices];
                  // price = apartment.price.price;
                }
              }
            }
          }
        }
      }
    },

    UpdateAllApartments() {
      this.$emit("UpdateApartments");
    },

    calcApartmentPrice(index, apartment, currency) {
      let price = 0;
      const area = apartment.plan;

      if (area.area === 0 || area.area === null) return 0;

      // if ()
      if (apartment.check_other_price) {
        price = apartment.other_price ? apartment.other_price : 0;
      } else {
        if (apartment.price.id === null) {
          price = 0;
        } else {
          price = apartment.price.price;
        }
      }

      if (currency === 0) {
        if (area.balcony && apartment.balcony_paid)
          return (
              price * area.area +
              parseFloat(this.building.balcony_price) * area.balcony_area
          );

        return price * area.area;
      } else {
        if (area.balcony && apartment.balcony_paid)
          return (
              (price * area.area +
                  parseFloat(this.building.balcony_price) * area.balcony_area) *
              currency
          );

        return price * area.area * currency;
      }
    },
  },
};
</script>

<style scoped></style>
