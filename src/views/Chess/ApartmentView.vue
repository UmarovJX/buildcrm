<template>
  <main>
    <div v-if="!appLoading" class="main__content">
      <!--  HEADER NAVIGATION  -->
      <div class="navigation__content justify-content-between">
        <div class="d-flex align-items-center">
        <span class="go__back" @click="$router.go(-1)">
          <base-arrow-left :width="32" :height="32"></base-arrow-left>
        </span>
          <span class="breadcrumb__content">
          <span class="d-flex align-items-center">
            <span class="mr-2">{{ $t('objects.title') }}</span>
            <base-arrow-right :width="16" :height="16"/>
            <span class="ml-2">{{ apartment.object.name }}</span>
            <base-arrow-right :width="16" :height="16"/>
            <span class="ml-2">
              {{ $t('apartment') }} № {{ apartment.number }}
            </span>
          </span>
          <span class="head color-violet-600">
            {{ $t('apartment') }} № {{ apartment.number }}
          </span>
        </span>
        </div>
      </div>

      <div class="d-flex justify-content-between">
        <primary-information class="primary__information" :apartment="apartment"/>
        <div class="calculator-content">
          <h3 class="title">Выберите вариант оплаты</h3>
          <div>
            <base-select
                :label="true"
                :options="paymentOption"
                v-model="selectedOption"
                placeholder="Вариант оплаты"
            ></base-select>
          </div>
        </div>
      </div>
    </div>

    <!--  LOADING    -->
    <base-loading v-if="appLoading"/>
  </main>
</template>

<script>
import api from "@/services/api";
import BaseSelect from "@/components/Reusable/BaseSelect";
import BaseLoading from "@/components/Reusable/BaseLoading";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRight from "@/components/icons/BaseArrowRightIcon";
import PrimaryInformation from "@/components/Objects/View/elements/PrimaryInformation";

export default {
  name: "ApartmentView",

  components: {
    BaseSelect,
    BaseLoading,
    BaseArrowLeft,
    BaseArrowRight,
    PrimaryInformation
  },

  data() {
    return {
      appLoading: false,
      selectedOption: null,
      apartment: []
    }
  },

  computed: {
    hasApartment() {
      return Object.keys(this.apartment).length > 0
    },
    paymentOption() {
      const discounts = [...this.apartment.discounts]
      if (!this.hasApartment) return
      return discounts.sort((a, b) => a.prepay - b.prepay)
          .map((discount, index) => {
            let text = this.$t("apartments.view.variant")
            if (discount.type === 'promo') text += ' ' + this.$t('promo.by_promo')
            text += ' ' + (index + 1) + ' - ' + discount.prepay + '%'
            return {
              text,
              value: discount
            }
          })
    }
  },

  async created() {
    await this.fetchApartmentView()
  },

  methods: {
    async fetchApartmentView() {
      this.appLoading = true
      const {object, id} = this.$route.params
      await api.apartments.getApartmentView(object, id)
          .then(response => {
            this.apartment = response.data
          }).catch((error) => {
            this.toastedWithErrorCode(error)
          }).finally(() => {
            this.appLoading = false
          })
    },
  }
}
</script>

<style lang="sass" scoped>
.main__content
  padding-left: 1rem
  padding-right: 1rem

.main__class
  background-color: white
  padding: 3rem
  min-height: 100vh
  color: var(--gray-600)

.go__back
  width: 56px
  height: 56px
  border-radius: 100%
  background-color: var(--gray-100)
  display: flex
  justify-content: center
  align-items: center
  cursor: pointer

.breadcrumb__content
  display: inline-flex
  flex-direction: column
  margin-left: 1rem
  font-weight: 600
  font-size: 14px
  color: #9CA3AF

.head
  font-size: 24px
  line-height: 28px
  color: #4B5563

.primary__information
  width: 42rem

</style>