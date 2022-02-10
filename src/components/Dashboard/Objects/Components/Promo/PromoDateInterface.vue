<template>
  <div class="promo__creation__modal">
    <div class="row flex-column flex-lg-row justify-content-lg-between mb-4">
      <div class="col-12 col-lg-6 pr-2">
        <!-- Promo name (ru) -->
        <b-form-group
            :label="formNameRuTextLabel"
            label-for="input-promo-name-ru"
            desclass="mb-0"
        >
          <b-form-input
              id="input-promo-name-ru"
              v-model="form.name_ru"
          ></b-form-input>
        </b-form-group>
      </div>

      <div class="col-12 col-lg-6">
        <!--  Promo start date  -->
        <b-form-group
            class="promo__date"
            label-for="input-promo-name-uz"
            desclass="mb-0"
        >
          <template>
            <button
                v-b-tooltip.hover.right="{variant:'primary'}"
                :title="$t('promo.date_of_start_label')"
                class="promo__info__button"
            >
          <span>
            {{ $t('promo.date_of_start_title') }}
          </span>
              <i class="fas fa-info-circle"></i>
            </button>
          </template>

          <div class="time__select">
            <b-form-input
                type="date"
                id="input-promo-name-uz"
                v-model="form.start_date"
                class="input__date"
            ></b-form-input>

            <b-form-timepicker
                v-model="form.start_time"
                v-bind="timePicker.start"
                locale="uz"
                :class="'form__timepicker'"
            >
            </b-form-timepicker>
          </div>

        </b-form-group>
      </div>
    </div>

    <div class="row flex-column flex-lg-row mb-4">
      <div class="col-12 col-lg-6 pr-2">
        <!-- Promo name (uz) -->
        <b-form-group
            :label="formNameUzTextLabel"
            label-for="input-promo-name-uz"
            desclass="mb-0"
        >
          <b-form-input
              id="input-promo-name-uz"
              v-model="form.name_uz"
          ></b-form-input>
        </b-form-group>
      </div>

      <div class="col-12 col-lg-6">
        <!--  Promo end date  -->
        <b-form-group
            class="promo__date"
            label-for="input-promo-name-uz"
            desclass="mb-0"
        >
          <template>
            <button
                v-b-tooltip.hover.right="{variant:'primary'}"
                :title="$t('promo.date_of_end_label')"
                class="promo__info__button"
            >
          <span>
            {{ $t('promo.date_of_end_title') }}
          </span>
              <i class="fas fa-info-circle"></i>
            </button>
          </template>

          <div class="time__select">
            <b-form-input
                type="date"
                id="input-promo-name-uz"
                v-model="form.end_date"
                class="input__date"
            ></b-form-input>

            <b-form-timepicker
                v-model="form.end_time"
                v-bind="timePicker.end"
                locale="uz"
                :class="'form__timepicker'"
            >
            </b-form-timepicker>
          </div>

        </b-form-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PromoDateInterface",
  data() {
    return {
      form: {
        name_ru: '',
        name_uz: '',
        start_date: '',
        end_date: '',
        start_time: '00:00:00',
        end_time: '00:00:00'
      },
      timePicker: {
        start: {
          labelNoTimeSelected: ''
        },
        end: {
          labelNoTimeSelected: ''
        }
      }
    }
  },
  computed: {
    formNameRuTextLabel() {
      return this.$t('promo.modal_input_text_label') + ' (Рус) '
    },
    formNameUzTextLabel() {
      return this.$t('promo.modal_input_text_label') + ' (Uzb) '
    }
  }
}
</script>

<style lang="scss">
.promo__creation__modal {
  //.col__content {
  //  margin-right: 72px;
  //}

  .btn {
    margin: 0 !important;
  }
}

.promo__info__button {
  background: transparent;
  border-radius: 50% !important;
  margin: 0 0 0.5rem 0 !important;
  padding: 0;
  outline: none;
  border: none;
}

.time__select {
  display: flex;
  max-height: 40px;

  .input__date {
    max-width: 180px;
    height: 100%;
    margin-right: 1rem;
  }

  .form__timepicker {
    max-width: 150px;
    height: 100%;
  }
}
</style>