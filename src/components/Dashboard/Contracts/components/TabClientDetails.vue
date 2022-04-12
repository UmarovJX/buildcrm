<template>
  <div v-if="haveClient">
    <div class="client__details col-12 px-0">
      <b-form class="client__details_info">
        <div class="d-flex">
          <h3 class="client__details__title mr-5">Основные</h3>
          <h3 class="client__details__title">Паспортные данные</h3>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label for="firstname">ФИО</label>
            <b-form-input disabled :value="getClientName(client)" id="firstname"/>
          </div>
          <div class="client__details_info_card">
            <label for="birthdate">Дата рождения</label>
            <b-form-input disabled :value="datePrettier(client.birth_day)" id="birthdate"/>
          </div>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label for="phone">Телефон (Основной)</label>
            <b-form-input disabled :value="formattingPhone(client.phone)" id="phone"/>
          </div>
          <div class="client__details_info_card">
            <label for="series">Серия</label>
            <b-form-input disabled :value="client.passport_series" id="series"/>
          </div>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label for="second_number">Телефон (Дополнительный)</label>
            <b-form-input disabled :value="formattingPhone(client.other_phone)" id="second_number"/>
          </div>
          <div class="client__details_info_card">
            <label for="date_of_given_place">Выдан</label>
            <b-form-input disabled :value="client.issued_by_whom" id="date_of_given_place"/>
          </div>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label for="client_type">Тип клиента</label>
            <div class="selection__content">
              <select
                  @change="changeClientType"
                  name="client_type"
                  id="client_type"
                  class="client__type"
                  :value="client.friends"
              >
                <option :value="false">Незнакомый</option>
                <option :value="true">Знакомый</option>
              </select>
              <!--              <span class="edit__icon">-->`
              <!--                <base-edit-icon :height="16" :width="16" fill="#ffffff"/>-->
              <!--              </span>-->
            </div>
          </div>
          <div class="client__details_info_card">
            <label for="date_of_issue">Дата выдачи</label>
            <b-form-input disabled :value="datePrettier(client.date_of_issue)" id="date_of_issue"/>
          </div>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script>
import {formatDateWithDot, phonePrettier} from "@/util/reusable";
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
      selected: null,
      options: [
        {value: "Незнакомый", text: "Незнакомый"},
        {value: "Знакомый", text: "Знакомый"}
      ],
      client: {},
      contractId: this.$route.params.id
    }
  },
  computed: {
    haveClient() {
      return Object.keys(this.client).length
    }
  },
  created() {
    this.getClientInformation()
  },
  methods: {
    datePrettier: (time) => formatDateWithDot(time),
    async getClientInformation() {
      this.startLoading()
      await api.contractV2.fetchClientInfo(this.contractId)
          .then((response) => {
            this.client = response.data
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
    formattingPhone: (phone) => phonePrettier(phone),
    dateReverser: (time) => formatDateWithDot(time),
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
    },
    async changeClientType() {
      this.startLoading()
      await api.contractV2.toggleClientType(this.contractId).finally(() => {
        this.finishLoading()
      })
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
        font-size: 0.75rem;
        letter-spacing: 1px;
      }

      input {
        height: 100%;
        width: 100%;
        border: none;
        text-align: right;
        padding-right: 4px;
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

.selection__content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 1.6rem;
}

//.selection__content .client__type {
//-webkit-appearance: none;
//-moz-appearance: none;
//top: auto;
//right: auto;
//background: transparent;
//background-image: url('../../../../assets/img/edit-button.png');

//}

//.edit__icon {
//  width: 1.5rem;
//  height: 1.5rem;
//  padding: 0.25rem;
//  border-radius: 50%;
//  background-color: var(--violet-600);
//  display: block;
//  margin-bottom: 1.6rem;
//  margin-right: 1.5rem;
//}

.client__details_info_card {
  display: flex;
  align-items: center;
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