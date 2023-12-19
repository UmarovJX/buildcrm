<script>
import { mapGetters } from 'vuex'
import api from '@/services/api'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

export default {

  components: {
    'date-picker': DatePicker,
  },
  props: {
    building: {},
    apartments: {},
    typePlans: {},
    block: {},
  },

  data: () => ({
    header: {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    },
  }),

  mounted() {
    this.apartmentsSetPrice()
  },

  computed: mapGetters(['getCurrency']),

  watch: {
    apartments() {
      this.apartmentsSetPrice()
    },

    block() {
      this.apartmentsSetPrice()
    },
  },

  methods: {
    async RemoveApartment(apartment, index) {
      this.$swal({
        title: this.$t('sweetAlert.title'),
        text: this.$t('sweetAlert.text'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: this.$t('cancel'),
        confirmButtonText: this.$t('sweetAlert.yes'),
      }).then(result => {
        if (result.value) {
          api.objects
            .deleteApartment(apartment.id)
            .then(response => {
              if (response.status === 204) {
                this.apartments.splice(index, 1)
                this.$emit('RemoveApartment')
                this.apartmentsSetPrice()
              }
            })
            .catch(error => {
              this.toastedWithErrorCode(error)

              if (error.response.status === 422) {
                this.error = true
                this.errors = error.response.data
              }
            })
        }
      })
    },

    async ApartmentUpdate(apartment, type) {
      let data = {}

      if (type === 'plan') {
        data = {
          type,
          plan_id: apartment.plan.id,
          price_id: apartment.price.id,
        }
      } else if (type === 'entrance') {
        data = {
          type,
          entrance: apartment.entrance,
          price_id: apartment.price.id,
        }
      } else if (type === 'rooms') {
        data = {
          type,
          rooms: apartment.rooms,
          price_id: apartment.price.id,
        }
      } else if (type === 'balcony_paid') {
        data = {
          type,
          balcony_paid: apartment.balcony_paid,
          price_id: apartment.price.id,
        }
      } else if (type === 'other_price') {
        data = {
          type,
          check_other_price: apartment.check_other_price,
          price_id: apartment.price.id,
        }
      } else if (type === 'price') {
        data = {
          type,
          check_other_price: apartment.check_other_price,
          price: apartment.other_price,
          price_id: null,
        }
      } else if (type === 'installment_month') {
        data = {
          type,
          installment_month: apartment.installment_month,
        }
      } else if (
        type === 'check_installment_month'
        || apartment.check_installment_month
      ) {
        apartment.installment_month = null
        data = {
          type: 'installment_month',
          installment_month: null,
        }
      }

      try {
        await api.objects.updateApartment(apartment.id, data)
      } catch (error) {
        this.toastedWithErrorCode(error)

        if (error.response.status === 422) {
          this.error = true
          this.errors = error.response.data
        }
      }
    },

    updateApartmentsPrice() {
      this.apartmentsSetPrice()
      this.UpdateAllApartments()
    },

    apartmentsSetPrice() {
      if (this.apartments !== undefined) {
        for (
          let apartment = 0;
          apartment < this.apartments.length;
          apartment++
        ) {
          if (this.apartments[apartment].check_other_price) {
            this.apartments[apartment].price_id = null
          } else {
            for (let prices = 0; prices < this.block.prices.length; prices++) {
              if (this.block.prices[prices].floors) {
                for (
                  let floors = 0;
                  floors < this.block.prices[prices].floors.length;
                  floors++
                ) {
                  if (
                    this.block.prices[prices].floors[floors]
                    === this.apartments[apartment].floor
                  ) {
                    this.apartments[apartment].price = this.block.prices[prices]
                    // price = apartment.price.price;
                  }
                }
              }
            }
          }
        }
      }
    },

    UpdateAllApartments() {
      this.$emit('UpdateApartments')
    },

    calcApartmentPrice(index, apartment, currency) {
      let price = 0
      const area = apartment.plan

      if (area.area === 0 || area.area === null) return 0

      if (apartment.check_other_price) {
        price = apartment.other_price ? apartment.other_price : 0
      } else if (apartment.price.id === null) {
        price = 0
      } else {
        price = apartment.price.price
      }

      if (currency === 0) {
        if (area.balcony && apartment.balcony_paid) {
          return (
            price * area.area
            + parseFloat(this.building.balcony_price) * area.balcony_area
          )
        }

        return price * area.area
      }
      if (area.balcony && apartment.balcony_paid) {
        return (
          (price * area.area
              + parseFloat(this.building.balcony_price) * area.balcony_area)
            * currency
        )
      }

      return price * area.area * currency
    },
  },
}
</script>

<template>
  <div class="col-md-12">
    <div class="row">
      <div class="col-md-12">
        <button
          type="button"
          class="btn btn-primary"
          @click="updateApartmentsPrice"
        >
          <i class="fa fa-refresh" /> {{ $t("objects.create.price_update") }}
        </button>
      </div>
      <div
        v-for="(apartment, index) in apartments"
        :key="index"
        class="col-lg-4 my-2"
      >
        <div class="apartment">
          <button
            type="button"
            class="apartment__close"
            @click="RemoveApartment(apartment, index)"
          >
            <i class="fal fa-times" />
          </button>

          <div class="apartment__info">
            {{ $t("objects.create.apartment") }} <span>{{ index + 1 }}</span>
          </div>
          <div class="apartment__info">
            <div class="dropdown my-dropdown__two">
              {{ $t("objects.create.plan.name") }}
              <select
                v-model="apartment.plan"
                class="custom-select"
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
                  :key="index"
                  :value="{
                    id: plan.id,
                    name: plan.name,
                    area: plan.area,
                    balcony: plan.balcony,
                    balcony_area: plan.balcony_area,
                    image: plan.image ? plan.image : null,
                  }"
                >
                  {{ plan.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="apartment__info">
            {{ $t("objects.create.rooms") }}:
            <input
              v-model="apartment.rooms"
              type="number"
              min="1"
              class="form-control"
              @change="ApartmentUpdate(apartment, 'rooms')"
            >
          </div>

          <div class="apartment__info">
            {{ $t("objects.create.entrance") }}:
            <input
              v-model="apartment.entrance"
              type="number"
              min="1"
              class="form-control"
              @change="ApartmentUpdate(apartment, 'entrance')"
            >
          </div>

          <div class="apartment__info">
            {{ $t("objects.create.area") }}:
            <input
              v-if="apartment.plan.id === null"
              type="number"
              min="0"
              class="form-control"
              disabled
            >
            <input
              v-else
              v-model="apartment.plan.area"
              type="number"
              min="1"
              class="form-control"
              disabled
            >
          </div>

          <div v-if="apartment.plan.id && apartment.plan.balcony">
            <div class="apartment__info">
              {{ $t("objects.create.plan.balcony_area") }}:
              <input
                v-if="apartment.plan.id === null"
                type="number"
                min="0"
                class="form-control"
                disabled
              >
              <input
                v-else
                v-model="apartment.plan.balcony_area"
                type="number"
                min="1"
                class="form-control"
                disabled
              >
            </div>

            {{ $t("objects.create.plan.balcony_paid") }}:
            <input
              v-model="apartment.balcony_paid"
              type="checkbox"
              @change="ApartmentUpdate(apartment, 'balcony_paid')"
            >
          </div>

          <div class="apartment__info">
            {{ $t("objects.create.other_price") }}:
            <input
              v-model="apartment.check_other_price"
              type="checkbox"
              @change="ApartmentUpdate(apartment, 'other_price')"
            >
          </div>

          <div
            v-if="apartment.check_other_price"
            class="apartment__info"
          >
            {{ $t("objects.create.price_m2") }}:
            <input
              v-model="apartment.other_price"
              type="number"
              min="1"
              class="form-control"
              @change="ApartmentUpdate(apartment, 'price')"
            >
          </div>

          <div class="apartment__info">
            {{ $t("objects.credit_month") }}:
            <input
              v-model="apartment.check_installment_month"
              type="checkbox"
              @change="ApartmentUpdate(apartment, 'check_installment_month')"
            >
          </div>

          <div
            v-if="apartment.check_installment_month"
            class="apartment__info"
          >
            {{ $t("objects.credit_month") }}:
            <date-picker
              id="installment_month"
              v-model="apartment.installment_month"
              value-type="YYYY-MM-DD"
              format="DD.MM.YYYY"
              class="form-inline"
              @input="ApartmentUpdate(apartment, 'installment_month')"
            />
          </div>

          <div class="apartment__info">
            {{ $t("objects.create.price") }}:
            <span>{{
                    calcApartmentPrice(index, apartment, 0)
                      | number("0,0.00", {
                        thousandsSeparator: " ",
                        decimalSeparator: ",",
                      })
                  }}
              {{ $t("usd") }}</span><br>

            {{ $t("objects.create.price") }} {{ $t("ye") }}:
            <span>{{
                    calcApartmentPrice(index, apartment, getCurrency.usd)
                      | number("0,0.00", {
                        thousandsSeparator: " ",
                        decimalSeparator: ",",
                      })
                  }}
              {{ $t("ye") }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
