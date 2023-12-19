<script>
import OutputInformation from '@/components/Elements/Outputs/OutputInformation'
import BaseEditIcon from '@/components/icons/BaseEditIcon'
import BaseCircleWrapper from '@/components/Reusable/BaseCircleWrapper'
import BaseDatePicker from '@/components/Reusable/BaseDatePicker'
import BaseInput from '@/components/Reusable/BaseInput'
import BaseSelect from '@/components/Reusable/BaseSelect'
import BaseButton from '@/components/Reusable/BaseButton'
import BaseCloseIcon from '@/components/icons/BaseCloseIcon'
import BaseModal from '@/components/Reusable/BaseModal'
import api from '@/services/api'
// import {phonePrettier} from "@/util/reusable";

export default {
  name: 'DetailsContract',
  components: {
    BaseInput,
    BaseSelect,
    BaseButton,
    BaseModal,
    BaseEditIcon,
    BaseDatePicker,
    OutputInformation,
    BaseCircleWrapper,
    BaseCloseIcon,
  },
  props: {
    order: {
      type: Object,
    },
    apartments: {
      type: Array,
    },
    clientData: {
      type: Object,
    },
  },
  emits: ['change-contract-number'],
  data() {
    return {
      newContractNumber: '',
      changedContractNumber: false,
      datePickerIconFill: 'var(--violet-600)',
      options: [
        {
          text: 'UZ',
          value: 'uz',
        },
        {
          text: 'RU',
          value: 'ru',
        },
      ],
      validationError: {
        type: '',
        message: '',
        visible: false,
      },
      timeoutId: null,
      autoFill: false,
    }
  },
  computed: {
    clientTypeOption() {
      return [
        {
          text: this.$t('unfamiliar'),
          value: 'false',
        },
        {
          text: this.$t('familiar'),
          value: 'true',
        },
      ]
    },
    flexCenter() {
      return 'd-flex justify-content-center align-items-center'
    },
    client: {
      get() {
        return this.clientData
      },
      set(value) {
        return this.$emit('set-client', value)
      },
    },
  },
  watch: {
    newContractNumber(value) {
      this.changedContractNumber = !!(
        value
        && value.length
        && !(value === this.order.contract_number)
      )
      if (this.changedContractNumber) {
        this.$emit('change-contract-number', value)
      }
    },
  },
  methods: {
    async validate() {
      return await this.$refs['client-validation'].validate()
    },
    clientDebounce() {
      if (this.client.passport_series) {
        console.log(this.client.passport_series)
        if (this.timeoutId !== null) {
          clearTimeout(this.timeoutId)
        }
        this.timeoutId = setTimeout(() => {
          this.getClientByPassport()
        }, 500)
      } else if (this.autoFill) {
        this.resetClientContext()
        this.turnedOffAutoFill()
      }
    },
    turnedOnAutoFill() {
      this.autoFill = true
    },
    turnedOffAutoFill() {
      this.autoFill = false
    },
    async getClientByPassport() {
      if (this.client.passport_series.length === 9) {
        await api.clientsV2
          .getClientBySearch({
            field: this.client.passport_series,
          })
          .then(response => {
            console.log(response.data)
            // const newClient = response.data
            // this.status = {
            //   ...newClient,
            //   friends: 'false',
            //   contract_date: this.status.contract_date
            // }
            // this.turnedOnAutoFill()
          })
          .catch(error => {
            this.resetClientContext()
            this.toastedWithErrorCode(error)
            this.turnedOffAutoFill()
          })
      }
    },
    resetClientContext() {
      this.client = {
        first_name: {
          lotin: null,
          kirill: null,
        },
        last_name: {
          lotin: null,
          kirill: null,
        },
        second_name: {
          lotin: null,
          kirill: null,
        },
        passport_series: this.client.passport_series,
        issued_by_whom: null,
        date_of_issue: null,
        language: null,
        friends: 'false',
        birth_day: null,
        phone: null,
        other_phone: null,
        first_payment_date: null,
        payment_date: null,
      }
    },
    setNewContractNumber() {
      this.order.contract_number = this.newContractNumber
      this.closeEditNumberModal()
    },
    closeEditNumberModal() {
      this.$refs['edit-contract-number'].closeModal()
      this.changedContractNumber = false
    },
    openEditNumberModal() {
      this.newContractNumber = this.order.contract_number
      this.$refs['edit-contract-number'].openModal()
    },
    setFormProperty(property, value) {
      this.client[property] = value
      this.errors[property] = false
    },

    translateCyrillic(type, event) {
      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId)
      }
      this.timeoutId = setTimeout(() => {
        switch (type) {
          case 'first_name':
            if (!this.client.first_name.kirill) {
              this.client.first_name.kirill = this.symbolLatinToCyrillic(event)
            }
            break
          case 'last_name':
            if (!this.client.last_name.kirill) {
              this.client.last_name.kirill = this.symbolLatinToCyrillic(event)
            }
            break
          case 'second_name':
            if (!this.client.second_name.kirill) {
              this.client.second_name.kirill = this.symbolLatinToCyrillic(event)
            }
            break
        }
      }, 1000)
    },

    translateLatin(type, event) {
      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId)
      }
      this.timeoutId = setTimeout(() => {
        switch (type) {
          case 'first_name':
            if (!this.client.first_name.lotin) {
              this.client.first_name.lotin = this.symbolCyrillicToLatin(event)
            }
            break
          case 'last_name':
            if (!this.client.last_name.lotin) {
              this.client.last_name.lotin = this.symbolCyrillicToLatin(event)
            }
            break
          case 'second_name':
            if (!this.client.second_name.lotin) {
              this.client.second_name.lotin = this.symbolCyrillicToLatin(event)
            }
            break
        }
      }, 1000)
    },

    symbolCyrillicToLatin(word) {
      this.symbolIsCyrillic(word)

      let result = ''
      const A = {}

      A['Ё'] = 'YO'
      A['Й'] = 'I'
      A['Ц'] = 'TS'
      A['У'] = 'U'
      A['К'] = 'K'
      A['Е'] = 'E'
      A['Н'] = 'N'
      A['Г'] = 'G'
      A['Ш'] = 'SH'
      A['Щ'] = 'SCH'
      A['З'] = 'Z'
      A['Х'] = 'H'
      A['Ъ'] = "'"
      A['ё'] = 'yo'
      A['й'] = 'i'
      A['ц'] = 'ts'
      A['у'] = 'u'
      A['к'] = 'k'
      A['е'] = 'e'
      A['н'] = 'n'
      A['г'] = 'g'
      A['ш'] = 'sh'
      A['щ'] = 'sch'
      A['з'] = 'z'
      A['х'] = 'h'
      A['ъ'] = "'"
      A['Ф'] = 'F'
      A['Ы'] = 'I'
      A['В'] = 'V'
      A['А'] = 'A'
      A['П'] = 'P'
      A['Р'] = 'R'
      A['О'] = 'O'
      A['Л'] = 'L'
      A['Д'] = 'D'
      A['Ж'] = 'ZH'
      A['Э'] = 'E'
      A['ф'] = 'f'
      A['ы'] = 'i'
      A['в'] = 'v'
      A['а'] = 'a'
      A['п'] = 'p'
      A['р'] = 'r'
      A['о'] = 'o'
      A['л'] = 'l'
      A['д'] = 'd'
      A['ж'] = 'zh'
      A['э'] = 'e'
      A['Я'] = 'YA'
      A['Ч'] = 'CH'
      A['С'] = 'S'
      A['М'] = 'M'
      A['И'] = 'I'
      A['Т'] = 'T'
      A['Ь'] = "'"
      A['Б'] = 'B'
      A['Ю'] = 'YU'
      A['я'] = 'ya'
      A['ч'] = 'ch'
      A['с'] = 's'
      A['м'] = 'm'
      A['и'] = 'i'
      A['т'] = 't'
      A['ь'] = "'"
      A['б'] = 'b'
      A['ю'] = 'yu'

      for (const i in word) {
        if (word.hasOwnProperty(i)) {
          if (A[word[i]] === undefined) {
            result += word[i]
          } else {
            result += A[word[i]]
          }
        }
      }

      return result
    },

    symbolLatinToCyrillic(word) {
      word = this.symbolIsLatin(word)

      let result = ''
      const a = {}

      a.Q = 'Қ'
      a.q = 'қ'

      a["O'"] = 'Ў'
      a["o'"] = 'ў'

      a.H = 'Ҳ'
      a.h = 'ҳ'

      a["G'"] = 'Ғ'
      a["g'"] = 'ғ'

      a.I = 'И'
      a.U = 'У'
      a.K = 'К'
      a.N = 'Н'
      a.G = 'Г'
      a.Z = 'З'
      a.i = 'и'
      a.u = 'у'
      a.k = 'к'
      a.E = 'Е'
      a.e = 'е'
      a.n = 'н'
      a.g = 'г'
      a.z = 'з'
      a.F = 'Ф'
      a.V = 'В'
      a.P = 'П'
      a.R = 'Р'
      a.O = 'О'
      a.L = 'Л'
      a.D = 'Д'
      a.J = 'Ж'
      a.f = 'ф'
      a.v = 'в'
      a.a = 'а'
      a.y = 'й'
      a.A = 'А'
      a.p = 'п'
      a.r = 'р'
      a.o = 'о'
      a.l = 'л'
      a.d = 'д'
      a.j = 'ж'

      a.S = 'С'
      a.M = 'М'
      a.I = 'И'
      a.T = 'Т'
      a.B = 'Б'

      a.s = 'с'
      a.m = 'м'
      a.i = 'и'
      a.t = 'т'
      a.b = 'б'

      word = word.replaceAll('Sh', 'Ш')
      word = word.replaceAll('sh', 'ш')

      word = word.replaceAll('Ch', 'Ч')
      word = word.replaceAll('ch', 'ч')

      word = word.replaceAll('Q', 'Қ')
      word = word.replaceAll('q', 'қ')

      word = word.replaceAll("O'", 'Ў')
      word = word.replaceAll("o'", 'ў')

      word = word.replaceAll("G'", 'Ғ')
      word = word.replaceAll("g'", 'ғ')

      word = word.replaceAll('Yu', 'Ю')
      word = word.replaceAll('yu', 'ю')

      word = word.replaceAll('Ya', 'Я')
      word = word.replaceAll('Ya', 'я')

      word = word.replaceAll('Yo', 'Ё')
      word = word.replaceAll('yo', 'ё')

      word = word.replaceAll('Ye', 'Е')
      word = word.replaceAll('ye', 'е')

      word = word.replaceAll('Kh', 'Х')
      word = word.replaceAll('kh', 'х')

      word = word.replaceAll('H', 'Ҳ')
      word = word.replaceAll('h', 'ҳ')

      for (const i in word) {
        if (word.hasOwnProperty(i)) {
          if (a[word[i]] === undefined) {
            result += word[i]
          } else {
            result += a[word[i]]
          }
        }
      }
      return result
    },

    symbolIsCyrillic(event) {
      return event
        .replace(/[^а-яё ҚқЎўҲҳҒғ]/i, '')
        .replace(/(\..*?)\..*/g, '$1')
    },

    symbolIsLatin(event) {
      return event.replace(/[^a-z. ']/i, '').replace(/(\..*?)\..*/g, '$1')
    },
  },
}
</script>

<template>
  <div>
    <div class="app-tab-content">
      <ValidationObserver ref="status-validation">
        <section class="tab-section">
          <h3 class="section-title">
            {{ $t("contract_details") }}
          </h3>
          <div class="section-container">
            <output-information
              v-if="order && order.contract_number"
              :property="$t('apartments.agree.number')"
              :value="order.contract_number"
            >
              <template #right-icon>
                <span
                  class="d-flex align-items-center cursor-pointer"
                  @click="openEditNumberModal"
                >
                  <base-circle-wrapper
                    class="d-flex justify-content-center align-items-center edit-icon-wrapper"
                  >
                    <base-edit-icon
                      :width="13.5"
                      :height="13.5"
                      fill="#fff"
                    />
                  </base-circle-wrapper>
                </span>
              </template>
            </output-information>
            <ValidationProvider
              v-slot="{ errors }"
              :name="`${$t('create_date')}`"
              rules="required"
            >
              <base-date-picker
                v-model="client.contract_date"
                :range="false"
                class="data-picker"
                format="DD.MM.YYYY"
                :error="!!errors[0]"
                :icon-fill="datePickerIconFill"
                :placeholder="`${$t('create_date')}`"
              />
            </ValidationProvider>
          </div>
        </section>

        <section class="tab-section mt-5 mb-5">
          <h3 class="section-title">
            {{ $t("client_details") }}
          </h3>
          <div class="section-container row-gap-1">
            <ValidationProvider
              v-slot="{ errors }"
              rules="required|min:9"
              :name="`${$t('passport_series')} (${$t(
                'for_example'
              )}. AB1234567)`"
            >
              <base-input
                v-model="client.passport_series"
                mask="AA#######"
                :label="true"
                :error="!!errors[0]"
                class="w-100"
                :placeholder="`${$t('apartments.agree.passport_series')} (${$t(
                  'for_example'
                )}. AB1234567) `"
                @input="clientDebounce"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="`${$t('apartments.agree.passport_series')}`"
              rules="required"
            >
              <base-input
                v-model="client.issued_by_whom"
                :label="true"
                :error="!!errors[0]"
                :placeholder="`${$t('apartments.agree.passport_series')}`"
                class="w-100"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="`${$t('passport_issue_date')}`"
              rules="required"
            >
              <base-date-picker
                v-model="client.date_of_issue"
                :range="false"
                :error="!!errors[0]"
                class="data-picker"
                format="DD.MM.YYYY"
                :placeholder="`${$t('passport_issue_date')}`"
                :icon-fill="datePickerIconFill"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="`${$t('birth_day')}`"
              rules="required"
            >
              <base-date-picker
                v-model="client.birth_day"
                class="w-100"
                :range="false"
                :error="!!errors[0]"
                format="DD.MM.YYYY"
                :placeholder="`${$t('birth_day')}`"
                :icon-fill="datePickerIconFill"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="`${$t('last_name')} (${$t('cyrillic_shortcut')}.)`"
              rules="required|min:1"
            >
              <base-input
                v-model="client.last_name.kirill"
                :label="true"
                class="w-100"
                :error="!!errors[0]"
                :placeholder="`${$t('last_name')} (${$t(
                  'cyrillic_shortcut'
                )}.)`"
                @input="translateLatin('last_name', $event)"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="`${$t('last_name')} (${$t('latin_shortcut')}.)`"
              rules="required|min:1"
            >
              <base-input
                v-model="client.last_name.lotin"
                class="w-100"
                :label="true"
                :error="!!errors[0]"
                :placeholder="`${$t('last_name')} (${$t('latin_shortcut')}.)`"
                @input="translateCyrillic('last_name', $event)"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="`${$t('name')} (${$t('cyrillic_shortcut')}.)`"
              rules="required|min:1"
            >
              <base-input
                v-model="client.first_name.kirill"
                class="w-100"
                :label="true"
                :error="!!errors[0]"
                :placeholder="`${$t('name')} (${$t('cyrillic_shortcut')}.)`"
                @input="translateLatin('first_name', $event)"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="`${$t('name')} (${$t('latin_shortcut')}.)`"
              rules="required|min:1"
            >
              <base-input
                v-model="client.first_name.lotin"
                class="w-100"
                :label="true"
                :error="!!errors[0]"
                :placeholder="`${$t('name')} (${$t('latin_shortcut')}.)`"
                @input="translateCyrillic('first_name', $event)"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="`${$t('second_name')} (${$t('cyrillic_shortcut')}.)`"
              rules="required|min:1"
            >
              <base-input
                v-model="client.second_name.kirill"
                class="w-100"
                :label="true"
                :error="!!errors[0]"
                :placeholder="`${$t('second_name')} (${$t(
                  'cyrillic_shortcut'
                )}.)`"
                @input="translateLatin('second_name', $event)"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="`${$t('second_name')} (${$t('latin_shortcut')}.)`"
              rules="required|min:1"
            >
              <base-input
                v-model="client.second_name.lotin"
                class="w-100"
                :label="true"
                :error="!!errors[0]"
                :placeholder="`${$t('second_name')} (${$t('latin_shortcut')}.)`"
                @input="translateCyrillic('second_name', $event)"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="`${$t('phone')}`"
              rules="required|min:12"
            >
              <base-input
                v-model="client.phone"
                class="w-100"
                :label="true"
                :error="!!errors[0]"
                mask="+### ## ### ## ##"
                :placeholder="`${$t('phone')}`"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="`${$t('additional')} ${$t('phone')}`"
            >
              <base-input
                v-model="client.other_phone"
                class="w-100"
                :label="true"
                mask="+### ## ### ## ##"
                :placeholder="`${$t('additional')} ${$t('phone')}`"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="`${$t('language')}`"
              rules="required"
            >
              <base-select
                :label="true"
                :error="!!errors[0]"
                :no-placeholder="true"
                :options="options"
                :value="client.language"
                :placeholder="`${$t('language')}`"
                @change="client.language = $event"
              />
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              :name="`${$t('client_type')}`"
              rules="required"
            >
              <base-select
                :label="true"
                :error="!!errors[0]"
                :no-placeholder="true"
                :options="clientTypeOption"
                :value="client.friends"
                :placeholder="`${$t('client_type')}`"
                @change="client.friends = $event"
              />
            </ValidationProvider>
          </div>
        </section>
      </ValidationObserver>
    </div>
    <base-modal
      ref="edit-contract-number"
      design="auto-height"
    >
      <template #header>
        <span class="d-flex align-items-center justify-content-between">
          <!--    TITLE      -->
          <span class="title">{{ $t("apartments.agree.number") }}</span>
          <!--   CLOSE    -->
          <span
            class="go__back"
            @click="closeEditNumberModal"
          >
            <BaseCloseIcon
              :width="56"
              :height="56"
            />
          </span>
        </span>
      </template>

      <template #main>
        <div>
          <base-input
            v-model="newContractNumber"
            :label="true"
            class="w-100"
            padding-left="2px !important"
            :placeholder="`${$t('apartments.agree.number')}`"
          />
        </div>
      </template>
      <template #footer>
        <base-button
          :disabled="!changedContractNumber"
          class="violet-gradient w-100"
          :text="`${$t('apply')}`"
          @click="setNewContractNumber"
        />
      </template>
    </base-modal>
  </div>
</template>

<style lang="scss" scoped>
.row-gap-1 {
  row-gap: 1rem;
}

.edit-icon-wrapper {
  padding: 5.25px;
  background-color: var(--violet-600);
  width: 24px;
  height: 24px;
  margin-left: 1rem;
}

.go__back {
  cursor: pointer;
}
</style>
