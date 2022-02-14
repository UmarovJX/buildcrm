<template>
  <div class="promo__creation__modal">
    <ValidationObserver ref="promo-observer">

      <div class="row flex-column flex-lg-row justify-content-lg-between mb-4">
        <div class="col-12 col-lg-6 pr-2">

          <!-- PROMO NAME (RU) -->
          <ValidationProvider
              :name="formNameRuTextLabel"
              rules="required"
              v-slot="{ errors }"
          >
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

            <span class="error__provider" v-if="errors[0]">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
        </div>

        <div class="col-12 col-lg-6">
          <!--  PROMO START DATE  -->
          <ValidationProvider
              :name="startOfDate"
              rules="required"
              v-slot="{ errors }"
          >
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

            <span class="error__provider" v-if="errors[0]">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
        </div>
      </div>

      <div class="row flex-column flex-lg-row mb-4">
        <div class="col-12 col-lg-6 pr-2">

          <!-- PROMO NAME (UZ) -->
          <ValidationProvider
              :name="formNameUzTextLabel"
              rules="required"
              v-slot="{ errors }"
          >
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

            <span class="error__provider" v-if="errors[0]">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
        </div>

        <div class="col-12 col-lg-6">
          <!--  PROMO END DATE  -->
          <ValidationProvider
              :name="endOfDate"
              rules="required"
              v-slot="{ errors }"
          >
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
            <span class="error__provider" v-if="errors[0]">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
        </div>
      </div>

    </ValidationObserver>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

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
    ...mapGetters(['getEditHistoryContext']),
    formNameRuTextLabel() {
      return this.$t('promo.modal_input_text_label') + ' (Рус) '
    },
    formNameUzTextLabel() {
      return this.$t('promo.modal_input_text_label') + ' (Uzb) '
    },
    startOfDate() {
      return this.$t('promo.date_of_start_title')
    },
    endOfDate() {
      return this.$t('promo.date_of_end_title')
    }
  },
  methods: {
    setUpHistoryContext() {
      this.setHistoryName()
      this.setStartDate()
      this.setStartedTime()
      this.setEndDate()
      this.setEndTime()
    },
    setHistoryName() {
      const {name} = this.getEditHistoryContext
      this.form.name_ru = name.ru
      this.form.name_uz = name.uz
    },
    setStartDate() {
      const {start_date} = this.getEditHistoryContext
      const date = new Date(start_date)
      const year = date.getFullYear()
      const baseMonth = date.getMonth() + 1
      const month = baseMonth < 10 ? `0${baseMonth}` : baseMonth
      const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
      this.form.start_date = `${year}-${month}-${day}`
    },
    setStartedTime() {
      const {start_date} = this.getEditHistoryContext
      const date = new Date(start_date)
      const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
      const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
      this.form.start_time = `${hours}:${minutes}:${seconds}`
    },
    setEndDate() {
      const {end_date} = this.getEditHistoryContext
      const date = new Date(end_date)
      const year = date.getFullYear()
      const baseMonth = date.getMonth() + 1
      const month = baseMonth < 10 ? `0${baseMonth}` : baseMonth
      const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
      this.form.end_date = `${year}-${month}-${day}`
    },
    setEndTime() {
      const {end_date} = this.getEditHistoryContext
      const date = new Date(end_date)
      const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
      const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
      this.form.end_time = `${hours}:${minutes}:${seconds}`
    },
    async getValidDates() {
      const valid = await this.$refs['promo-observer'].validate()
      if (valid) {

        const {name_ru, name_uz, start_date, end_date, start_time, end_time} = this.form

        const form = {
          start_date: start_date + ' ' + start_time,
          end_date: end_date + ' ' + end_time,
          name: {
            uz: name_uz,
            ru: name_ru
          }
        }

        return {
          form,
          valid
        }
      }

      return {
        valid: false
      }
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

.modal-content .error__provider {
  color: red;
  font-size: 14px;
}
</style>