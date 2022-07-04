<template>
  <div>
    <div class="agree">
      <div class="row">
        <div class="col-6">
          <div class="assignee-header">
            <p class="assignee-header__title">{{ $t('details_of_the_agreement') }}</p>
          </div>
        </div>

      </div>
      <div class="row">
        <div class="col-6">
          <div class="row assignee-row">
            <div class="col-12">
              <div class="assignee-item">
                <div class="client__details_info_card mr-5">
                  <label>{{ $t('date_of_the_agreement') }}</label>
                  <b-form-input disabled :value="order.date"/>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="assignee-item">
                <div class="client__details_info_card mr-5">
                  <label>{{ $t('agreement_number') }}</label>
                  <b-form-input disabled :value="order.contract_number"/>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="assignee-item">
                <div class="client__details_info_card mr-5">
                  <label>{{ $t('reason_for_reissuing') }}</label>
                  <b-form-input v-if="order['reorder_type']" disabled :value="checkLocales(order.reorder_type.name)"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6">
          <base-button @click="downloadContact" class="download-button" :text="$t(`recontract_download`)">
            <template #left-icon>
              <BaseArrowDownIcon :width="20" :height="20" fill="#7C3AED"/>
            </template>
          </base-button>
        </div>
      </div>
    </div>
    <div class="assignee">
      <div class="row">
        <div class="col-6">
          <div class="assignee-header">
            <p class="assignee-header__title">Цедент</p>
            <span class="assignee-header__tooltip" style="cursor: pointer" id="assignee-tooltip">
                  <img
                      :src="require('@/assets/icons/icon-questions__circle.svg')" alt=""/>
            </span>
            <b-tooltip
                target="assignee-tooltip"
                triggers="hover"
                variant="secondary"
            >
              Цедент – это участник договора цессии, который в рамках договора цессии уступает иному лицу свое право
              требования.
            </b-tooltip>
          </div>
        </div>
        <div class="col-6">
          <div class="assignee-header">
            <p class="assignee-header__title">цессионарий</p>
            <span class="assignee-header__tooltip" style="cursor: pointer" id="session-tooltip">
                  <img
                      :src="require('@/assets/icons/icon-questions__circle.svg')" alt="">
            </span>
            <b-tooltip
                style="width: 400px !important;"
                target="session-tooltip"
                variant="secondary"
                triggers="hover"
            >
              Цессионарий – участник договора цессии, приобретающий право, уступаемое цедентом.
            </b-tooltip>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="assignee-item">
            <div class="client__details_info_card mr-5">
              <label>{{ $t('fio') }}</label>
              <b-form-input disabled :value="fullName(assignor)"/>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="assignee-item">
            <div class="client__details_info_card mr-5">
              <label>{{ $t('fio') }}</label>
              <b-form-input disabled :value="fullName(assignee)"/>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="assignee-item">
            <div class="client__details_info_card mr-5">
              <label>{{ $t('series') }}</label>
              <b-form-input disabled :value="assignor['passport_series']"/>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="assignee-item">
            <div class="client__details_info_card mr-5">
              <label>{{ $t('series') }}</label>
              <b-form-input disabled :value="assignee['passport_series']"/>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="assignee-item">
            <div class="client__details_info_card mr-5">
              <label>{{ $t('apartments.agree.issued_by_whom') }}</label>
              <b-form-input disabled :value="assignor['issued_by_whom']"/>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="assignee-item">
            <div class="client__details_info_card mr-5">
              <label>{{ $t('apartments.agree.issued_by_whom') }}</label>
              <b-form-input disabled :value="assignee['issued_by_whom']"/>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="assignee-item">
            <div class="client__details_info_card mr-5">
              <label>{{ $t('apartments.agree.date_of_issue') }}</label>
              <b-form-input disabled :value="assignor['date_of_issue']"/>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="assignee-item">
            <div class="client__details_info_card mr-5">
              <label>{{ $t('apartments.agree.date_of_issue') }}</label>
              <b-form-input disabled :value="assignee['date_of_issue']"/>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="assignee-item">
            <div class="client__details_info_card mr-5">
              <label>{{ $t('birth_day') }}</label>
              <b-form-input disabled :value="assignor['birth_day']"/>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="assignee-item">
            <div class="client__details_info_card mr-5">
              <label>{{ $t('birth_day') }}</label>
              <b-form-input disabled :value="assignee['birth_day']"/>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="assignee-item">
            <div class="client__details_info_card mr-5">
              <label>{{ $t('number') }} ({{ $t('main_number') }})</label>
              <b-form-input disabled :value="phone(assignor['phone'])"/>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="assignee-item">
            <div class="client__details_info_card mr-5">
              <label>{{ $t('number') }} ({{ $t('main_number') }})</label>
              <b-form-input disabled :value="phone(assignee['phone'])"/>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="assignee-item">
            <div class="client__details_info_card mr-5">
              <label>{{ $t('number') }} ({{ $t('extra') }})</label>
              <b-form-input disabled :value="phone(assignor['other_phone'])"/>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="assignee-item">
            <div class="client__details_info_card mr-5">
              <label>{{ $t('number') }} ({{ $t('extra') }})</label>
              <b-form-input disabled :value="phone(assignee['other_phone'])"/>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
w
<script>
import BaseButton from "@/components/Reusable/BaseButton";
import BaseArrowDownIcon from "@/components/icons/BaseArrowDownIcon";
import api from "@/services/api";
import {phonePrettier} from "@/util/reusable";

export default {
  name: "TabReContractDetails",
  components: {
    BaseArrowDownIcon,
    BaseButton
  },
  data() {
    return {
      clientDetails: {
        full_name: 'sas'
      },
      assignee: {},
      assignor: {},
      order: {},
      errors: [],
    }
  },
  async created() {
    await this.getDetails()
  },
  methods: {
    checkLocales(name) {
      if (localStorage.locale)
        return name[localStorage.locale]
      else
        return name['ru']
    },

    phone(value) {
      return phonePrettier(value)
    },

    fullName(value) {
      if (value && value.first_name && value.last_name && value.second_name)
        return value.first_name.lotin + ' ' + value.last_name.lotin + ' ' + value.second_name.lotin
      return ''
    },

    setFormProperty(property, value) {
      this.form[property] = value
      this.errors[property] = false
    },

    async getDetails() {
      const id = this.$route.params.id
      await api.contractV2.getReissue(id).then((res) => {
        this.assignee = res.data.assignee
        this.assignor = res.data.assignor
        this.order = res.data.order
      }).catch(() => {

      })
    },

    downloadContact() {
      const id = this.order.uuid
      api.contractV2.downloadReContract(id)
          .then(({data, headers}) => {
            const filename = headers.hasOwnProperty('x-filename') ? headers['x-filename'] : 'contract'
            const fileURL = window.URL.createObjectURL(new Blob([data]))
            const fileLink = document.createElement('a')
            fileLink.href = fileURL
            fileLink.setAttribute('download', filename)
            document.body.appendChild(fileLink)
            fileLink.click()
          })
          .catch(() => {
            return '#'
          })

    },
  }
}
</script>

<style lang="scss" scoped>


.assignee {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  &-row {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;

    .assignee-item {
      .client__details {
        &_info {
          &_card {
            margin: 0 auto;
          }
        }
      }
    }
  }

  &-header {
    display: flex;
    align-items: center;
    column-gap: .5rem;
    //padding: 1rem 1.25rem;
    font-family: CraftworkSans, serif;
    font-style: normal;
    font-weight: 900;
    font-size: 24px;
    line-height: 28px;
    color: var(--gray-400);
    margin-bottom: 2rem;

    &__tooltip {
      display: flex;
      align-items: center;

      img {
        width: 20px;
        height: 20px;
      }
    }

    &__title {
      text-transform: uppercase;
      margin: 0;
    }


  }

  .row {
    margin: 0 auto;
    width: 100%;

  }

  &-item {
    .form-control:disabled {
      background-color: #fff;
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

        &_card {
          display: flex;
          align-items: center;
          width: 100%;
          //max-width: 40rem;
          height: 56px;
          border: 2px solid #E5E7EB;
          border-radius: 32px;
          padding: 0 20px;
          position: relative;
          margin: .5rem auto;

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
            font-family: CraftworkSans, serif;
            height: 100%;
            width: 100%;
            border: none;
            text-align: right;
            padding-right: 4px;
            font-size: 18px;
            line-height: 22px;
            font-weight: 900;
            color: var(--gray-600);
          }

        }
      }

    }

  }
}


.agree {
  margin-top: 32px;
  margin-bottom: 48px;

  &-row {
    flex-direction: column;
    row-gap: 1rem;
  }

}

.download-button {
  cursor: pointer;
  width: 100%;
}


</style>