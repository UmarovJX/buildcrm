<script>
import ApartmentPrice from './ApartmentPrice'

export default {
  components: {
    ApartmentPrice,
  },

  props: {
    apartment: {},
    contract: {},
    index: {},
  },

  data() {
    return {}
  },

  watch: {
    apartment() {
      console.log('QuickViewApartments change')
    },
  },

  methods: {
    apartmentPrice() {
      this.$emit('changedApartmentPrice', {})
    },
  },
}
</script>

<template>
  <div class="card px-3 pt-4 pb-4 border mb-3">
    <table class="w-100">
      <tbody>
        <tr>
          <td style="width: 120px">
            <i
              style="width: 20px; text-align: center"
              class="mr-1 far fa-building"
            />
            № Дома:
          </td>
          <td class="text-left">
            <span>{{ apartment.number }}</span>
          </td>
        </tr>
        <tr>
          <td>
            <i
              style="width: 20px; text-align: center"
              class="mr-1 far fa-dollar-sign"
            />
            Цена:
          </td>
          <td>
            <ApartmentPrice
              :apartment="apartment"
              :contract="contract"
              @apartmentPrice="apartmentPrice"
            />
            <!--              :area="apartment.plan.area"-->
            <!--              :id="apartment.id"-->
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
                style="width: 20px; text-align: center"
                class="mr-1 far fa-expand"
              />
              Площадь:
            </td>
            <td class="text-left">
              {{ apartment.plan.area }} m2
            </td>
          </tr>
          <tr>
            <td style="width: 120px">
              <i
                style="width: 20px; text-align: center"
                class="mr-1 far fa-inbox"
              />
              Балкон:
            </td>
            <td class="text-left">
              {{ apartment.plan.balcony_area }} m2
            </td>
          </tr>
          <tr>
            <td style="width: 120px">
              <i
                style="width: 20px; text-align: center"
                class="mr-1 far fa-door-open"
              />
              Комнат:
            </td>
            <td class="text-left">
              {{ apartment.rooms }}
            </td>
          </tr>
          <tr>
            <td style="width: 120px">
              <i
                style="width: 20px; text-align: center"
                class="mr-1 far fa-industry"
              />
              Этаж:
            </td>
            <td class="text-left">
              {{ apartment.floor }}
            </td>
          </tr>
        </tbody>
      </table>
    </b-collapse>
    <div
      class="d-flex justify-content-center"
      style="
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -10px;
      "
    >
      <b-button
        v-b-toggle="'collapse' + index"
        style="transform: scale(0.6)"
        class="m-0 p-0"
        variant="secondary"
        size="sm"
      >
        <i class="fa fa-chevron-down" />
      </b-button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
