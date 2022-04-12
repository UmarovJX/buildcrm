<template>
  <div>
    <div class="client__details col-12 px-0">
      <b-form class="client__details_info">
        <div class="d-flex">
          <h3 class="client__details__title mr-5">Застройщик</h3>
          <h3 class="client__details__title">Другие детали</h3>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label>Компания</label>
            <b-form-input disabled :value="companyDetails['company_name']"/>
          </div>
          <div class="client__details_info_card">
            <label>Номер договора</label>
            <b-form-input disabled :value="otherDetails.contract"/>
          </div>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label>Представитель</label>
            <b-form-input disabled :value="companyDetails['full_name']"/>
          </div>
          <div class="client__details_info_card">
            <label>Сумма договора</label>
            <b-form-input disabled :value="pricePrettier(otherDetails.transaction_price)"/>
          </div>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label>Р/С</label>
            <b-form-input disabled value=""/>
          </div>
          <div class="client__details_info_card">
            <label>Дата</label>
            <b-form-input disabled :value="datePrettier(otherDetails.contract_date)"/>
          </div>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label>ИНН</label>
            <b-form-input disabled :value="companyDetails.inn"/>
          </div>
          <div class="client__details_info_card">
            <label>Оформил</label>
            <b-form-input disabled :value="otherDetails.created_by" id="firstname"/>
          </div>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label>МФО</label>
            <b-form-input disabled :value="otherDetails.mfo" id="firstname"/>
          </div>
          <div class="client__details_info_card">
            <label>Статус</label>
            <b-form-input disabled :value="getStatus(otherDetails.status)" id="firstname"/>
          </div>
        </div>
      </b-form>
    </div>

  </div>
</template>

<script>
import {formatDateWithDot, formatToPrice} from "@/util/reusable";
import api from "@/services/api";

export default {
  name: "TabClientDetails",
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  emits: ['start-loading', 'finish-loading'],
  data() {
    return {
      companyDetails: {},
      otherDetails: {}
    }
  },
  created() {
    this.fetchContractDetails()
  },
  methods: {
    datePrettier: (time) => formatDateWithDot(time),
    fetchContractDetails() {
      this.startLoading()
      const {id} = this.$route.params
      api.contractV2.fetchContractDetails(id)
          .then(response => {
            this.companyDetails = response.data['company_details']
            this.otherDetails = response.data['other_details']
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.finishLoading()
          })
    },
    startLoading() {
      this.$emit('start-loading')
    },
    finishLoading() {
      this.$emit('finish-loading')
    },
    pricePrettier(price) {
      return formatToPrice(price) + ' ' + this.$t('ye')
    },
    getStatus(status) {
      return this.$t(`contracts.status.${status}`)
    },
    getClientName(client) {
      let language = 'kirill'
      if (this.$i18n.locale === 'uz') {
        language = 'lotin'
      }
      const {last_name, first_name} = client
      return this.clientName(last_name, language) + ' ' + this.clientName(first_name, language)
    },
    clientName(multiName, language) {
      const lastNameByLang = multiName[language]
      if (lastNameByLang) {
        return lastNameByLang
      } else {
        const lastNameOtherLang = language === 'kirill' ? multiName['lotin'] : multiName['kirill']
        if (lastNameOtherLang) return lastNameOtherLang
      }

      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  font-family: CraftworkSans, serif;
  font-style: normal;
  line-height: 22px;
  color: var(--gray-600);
  font-weight: 600;
}

.custom__container {
  margin: 32px 90px;
  background: #fff;
  height: 80vh;
}

.client__details {
  display: flex;
  flex-direction: column;

  &__title {
    font-size: 1.5rem;
    line-height: 28px;
    color: var(--gray-400);
    margin: 2rem 0 1rem 0;
    width: 100%;
    max-width: 40rem;
  }

  &_info {
    //display: grid;
    //grid-template-columns: 1fr 1fr;
    //column-gap: 3rem;

    &_card {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 40rem;
      height: 56px;
      border: 2px solid #E5E7EB;
      border-radius: 32px;
      padding: 0 16px;
      position: relative;
      margin-top: 1rem;

      & svg {
        position: absolute;
        right: 20px;
        //z-index: 100;
      }

      & label {
        text-transform: uppercase;
        margin: 0;
        padding-right: 10px;
        color: var(--gray-400);
        white-space: nowrap;
        font-size: 0.8rem;
        letter-spacing: 1px;
      }

      input {
        height: 100%;
        width: 100%;
        border: none;
        text-align: right;
        padding-right: 4px;
        font-size: 1.0125rem;
        color: var(--gray-600);
      }

      select {
        width: 140px;
        height: 24px;
        padding: 0;
        margin-top: 0 !important;
        position: absolute;
        top: 45%;
        transform: translateY(-50%);
        right: 20px;
        border: none;

        option {
          padding: 20px;
          border: none;
        }
      }
    }
  }

  .form-control:disabled {
    background: #fff;
  }
}

@media screen and (max-width: 1100px) {
  .client__details_info_card {
    label, input {
      font-size: 0.75rem;
    }
  }
}

@media screen and (max-width: 950px) {
  .client__details_info_card {
    label {
      font-size: 0.6rem;
      white-space: normal;
    }
  }
}

</style>