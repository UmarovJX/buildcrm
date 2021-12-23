<template>
  <div>
    <div class="card px-3 pt-4 pb-4 border mb-3">
      <table class="w-100">
        <tbody>
          <tr>
            <td style="width: 120px">
              <i
                style="width: 20px; text-align:center"
                class="mr-1 far fa-building"
              ></i>
              № Дома:
            </td>
            <td class="text-left">
              <span>{{ apartment.number }}</span>
            </td>
          </tr>
          <tr>
            <td>
              <i
                style="width: 20px; text-align:center"
                class="mr-1 far fa-dollar-sign"
              ></i>
              Цена:
            </td>
            <td>
              <ApartmentPrice
                :item="apartment.price"
                :area="apartment.plan.area"
                :id="apartment.id"
                @apartmentPrice="apartmentPrice"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <b-collapse :id="'collapse' + index">
        <table class="w-100">
          <tbody>
            <tr>
              <td style="width: 120px">
                <i
                  style="width: 20px; text-align:center"
                  class="mr-1 far fa-expand"
                ></i>
                Площадь:
              </td>
              <td class="text-left">{{ apartment.plan.area }} m2</td>
            </tr>
            <tr>
              <td style="width: 120px">
                <i
                  style="width: 20px; text-align:center"
                  class="mr-1 far fa-inbox"
                ></i>
                Балкон:
              </td>
              <td class="text-left">{{ apartment.plan.balcony_area }} m2</td>
            </tr>
            <tr>
              <td style="width: 120px">
                <i
                  style="width: 20px; text-align:center"
                  class="mr-1 far fa-door-open"
                ></i>
                Комнат:
              </td>
              <td class="text-left">{{ apartment.rooms }}</td>
            </tr>
            <tr>
              <td style="width: 120px">
                <i
                  style="width: 20px; text-align:center"
                  class="mr-1 far fa-industry"
                ></i>
                Этаж:
              </td>
              <td class="text-left">{{ apartment.floor }}</td>
            </tr>
          </tbody>
        </table>
      </b-collapse>
      <div
        class="d-flex justify-content-center"
        style="position: absolute; left: 50%; transform: translateX(-50%); bottom: -10px"
      >
        <b-button
          style="transform: scale(0.6)"
          class="m-0 p-0"
          variant="secondary"
          v-b-toggle="'collapse' + index"
          size="sm"
        >
          <i class="fa fa-chevron-down"></i>
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import ApartmentPrice from "./ApartmentPrice";

export default {
  components: {
    ApartmentPrice,
  },
  data() {
    return {};
  },
  props: {
    apartment: {
      type: Object,
    },
    index: {
      type: Number,
    },
  },
  watch: {
    apartment(val, newVal) {
      console.log(val, newVal);
    }
  },
  methods: {
    apartmentPrice(price, id, edited) { 
      console.log('in quick view apartment', price, id, edited);
       this.$emit("changedApartmentPrice", price, id, edited);
    }
  }
};
</script>

<style lang="scss" scoped></style>
