<template>
  <div class="row">
    <!-- apartments.agree.passport_series -->
    <div class="col-md-4">
      <validation-provider
          :name="`'${$t('apartments.agree.passport_series')}'`"
          :rules="{required: true}"
          v-slot="validationContext"
          class="mb-3"
      >
        <b-form-group
            :label="$t('apartments.agree.passport_series')"
            label-for="checkout-pasport"
        >
          <b-form-input
              id="checkout-pasport"
              name="checkout-pasport"
              type="text"
              @change="getClientData"
              @focus="userFocused"
              :placeholder="
                        $t('apartments.agree.placeholder.passport_series')
                      "
              v-model="client.passport_series"
              :state="getValidationState(validationContext)"
              aria-describedby="checkout-pasport-feedback"
          ></b-form-input>

          <b-form-invalid-feedback id="checkout-pasport-feedback" class="error__provider">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
    </div>

    <!-- apartments.agree.issued_by_whom -->
    <div class="col-md-4">
      <validation-provider
          :name="`'${$t('apartments.agree.issued_by_whom')}'`"
          :rules="{required: true}"
          v-slot="validationContext"
          class="mb-3"
      >
        <b-form-group
            :label="$t('apartments.agree.issued_by_whom')"
            label-for="issue_passport"
        >
          <b-form-input
              id="issue_passport"
              name="issue_passport"
              type="text"
              :placeholder="
                        $t('apartments.agree.placeholder.issued_by_whom')
                      "
              v-model="client.issued_by_whom"
              :state="getValidationState(validationContext)"
              aria-describedby="issue_passport-feedback"
              @focus="userFocused"
          ></b-form-input>

          <b-form-invalid-feedback id="issue_passport-feedback" class="error__provider">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
    </div>

    <!-- apartments.agree.date_of_issue -->
    <div class="col-md-4">
      <validation-provider
          :name="`'${$t('apartments.agree.date_of_issue')}'`"
          :rules="{required: true}"
          v-slot="validationContext"
          class="mb-3"
      >
        <b-form-group
            :label="$t('apartments.agree.date_of_issue')"
            label-for="date_of_issue"
        >
          <b-form-input
              id="date_of_issue"
              name="date_of_issue"
              type="date"
              :placeholder="$t('apartments.agree.date_of_issue')"
              v-model="client.date_of_issue"
              :state="getValidationState(validationContext)"
              aria-describedby="date_of_issue-feedback"
              @focus="userFocused"
          ></b-form-input>

          <b-form-invalid-feedback id="date_of_issue-feedback" class="error__provider">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
    </div>

    <!-- client.birth_day -->
    <div class="col-md-4">
      <validation-provider
          :name="`'${$t('apartments.agree.birth_day')}'`"
          :rules="{required: true}"
          v-slot="validationContext"
          class="mb-3"
      >
        <b-form-group
            :label="$t('apartments.agree.birth_day')"
            label-for="birth_day"
        >
          <b-form-input
              id="birth_day"
              name="birth_day"
              type="date"
              :placeholder="$t('apartments.agree.birth_day')"
              v-model="client.birth_day"
              :state="getValidationState(validationContext)"
              aria-describedby="birth_day-feedback"
              @focus="userFocused"
          ></b-form-input>

          <b-form-invalid-feedback id="birth_day-feedback" class="error__provider">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
    </div>

    <div class="col-md-12">
      <hr/>
    </div>

    <!-- last_name_kirill -->
    <div class="col-md-4">
      <validation-provider
          :name="`'${$t('apartments.agree.last_name')} (kirill)'`"
          :rules="{required: true}"
          v-slot="validationContext"
          class="mb-3"
      >
        <b-form-group
            :label="`${$t('apartments.agree.last_name')} (kirill)`"
            label-for="last_name_kirill"
        >
          <b-form-input
              id="last_name_kirill"
              name="last_name_kirill"
              type="text"
              :placeholder="$t('apartments.agree.placeholder.last_name')"
              v-model="client.last_name.kirill"
              @input="isCyrillic('last_name', client.last_name.kirill)"
              @change="textToLatin('last_name', $event)"
              :state="getValidationState(validationContext)"
              aria-describedby="last_name_kirill-feedback"
              @focus="userFocused"
          ></b-form-input>

          <b-form-invalid-feedback id="last_name_kirill-feedback" class="error__provider">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
    </div>

    <!-- first_name_kirill -->
    <div class="col-md-4">
      <validation-provider
          :name="`'${$t('apartments.agree.first_name')} (kirill)'`"
          :rules="{required: true}"
          v-slot="validationContext"
          class="mb-3"
      >
        <b-form-group
            :label="`${$t('apartments.agree.first_name')} (kirill)`"
            label-for="first_name_kirill"
        >
          <b-form-input
              id="first_name_kirill"
              name="first_name_kirill"
              type="text"
              :placeholder="$t('apartments.agree.placeholder.first_name')"
              v-model="client.first_name.kirill"
              @input="isCyrillic('first_name', client.first_name.kirill)"
              @change="textToLatin('first_name', $event)"
              :state="getValidationState(validationContext)"
              aria-describedby="first_name_kirill-feedback"
              @focus="userFocused"
          ></b-form-input>

          <b-form-invalid-feedback id="first_name_kirill-feedback" class="error__provider">{{
              validationContext.errors[0]
            }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
    </div>

    <!-- second_name_kirill -->
    <div class="col-md-4">
      <validation-provider
          :name="`'${$t('apartments.agree.second_name')} (kirill)'`"
          :rules="{required: true}"
          v-slot="validationContext"
          class="mb-3"
      >
        <b-form-group
            :label="`${$t('apartments.agree.second_name')} (kirill)`"
            label-for="second_name_kirill"
        >
          <b-form-input
              id="second_name_kirill"
              name="second_name_kirill"
              type="text"
              :placeholder="$t('apartments.agree.placeholder.second_name')"
              v-model="client.second_name.kirill"
              @input="isCyrillic('second_name', client.second_name.kirill)"
              @change="textToLatin('second_name', $event)"
              :state="getValidationState(validationContext)"
              aria-describedby="second_name_kirill-feedback"
              @focus="userFocused"
          ></b-form-input>

          <b-form-invalid-feedback id="second_name_kirill-feedback" class="error__provider">{{
              validationContext.errors[0]
            }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
    </div>

    <div class="col-md-12">
      <hr/>
    </div>

    <!-- last_name_lotin -->
    <div class="col-md-4">
      <validation-provider
          :name="`'${$t('apartments.agree.last_name')} (lotin)'`"
          :rules="{required: true}"
          v-slot="validationContext"
          class="mb-3"
      >
        <b-form-group
            :label="`${$t('apartments.agree.last_name')} (lotin)`"
            label-for="last_name_lotin"
        >
          <b-form-input
              id="last_name_lotin"
              name="last_name_lotin"
              type="text"
              :placeholder="$t('apartments.agree.placeholder.last_name_lotin')"
              v-model="client.last_name.lotin"
              @input="isLatin('last_name', client.last_name.lotin)"
              @change="textToCyrillic('last_name', $event)"
              :state="getValidationState(validationContext)"
              aria-describedby="last_name_lotin-feedback"
              @focus="userFocused"
          ></b-form-input>

          <b-form-invalid-feedback id="last_name_lotin-feedback" class="error__provider">{{
              validationContext.errors[0]
            }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
    </div>

    <!-- first_name_lotin -->
    <div class="col-md-4">
      <validation-provider
          :name="`'${$t('apartments.agree.first_name')} (lotin)'`"
          :rules="{required: true}"
          v-slot="validationContext"
          class="mb-3"
      >
        <b-form-group
            :label="`${$t('apartments.agree.first_name')} (lotin)`"
            label-for="first_name_lotin"
        >
          <b-form-input
              id="first_name_lotin"
              name="first_name_lotin"
              type="text"
              :placeholder="$t('apartments.agree.placeholder.first_name_lotin')"
              v-model="client.first_name.lotin"
              @input="isLatin('first_name', client.first_name.lotin)"
              @change="textToCyrillic('first_name', $event)"
              :state="getValidationState(validationContext)"
              aria-describedby="first_name_lotin-feedback"
              @focus="userFocused"
          ></b-form-input>

          <b-form-invalid-feedback id="first_name_lotin-feedback" class="error__provider">{{
              validationContext.errors[0]
            }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
    </div>

    <!-- second_name_lotin -->
    <div class="col-md-4">
      <validation-provider
          :name="`'${$t('apartments.agree.second_name')} (lotin)'`"
          :rules="{required: true}"
          v-slot="validationContext"
          class="mb-3"
      >
        <b-form-group
            :label="`${$t('apartments.agree.second_name')} (lotin)`"
            label-for="second_name_lotin"
        >
          <b-form-input
              id="second_name_lotin"
              name="second_name_lotin"
              type="text"
              :placeholder="$t('apartments.agree.placeholder.second_name_lotin')"
              v-model="client.second_name.lotin"
              @input="isLatin(client.second_name.lotin)"
              @change="textToCyrillic('second_name', $event)"
              :state="getValidationState(validationContext)"
              aria-describedby="second_name_lotin-feedback"
              @focus="userFocused"
          ></b-form-input>

          <b-form-invalid-feedback id="second_name_lotin-feedback" class="error__provider">{{
              validationContext.errors[0]
            }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
    </div>

    <div class="col-md-12">
      <hr/>
    </div>

    <!-- client.phone -->
    <div class="col-md-4">
      <validation-provider
          :name="`'${$t('apartments.agree.phone')}'`"
          :rules="{required: true}"
          v-slot="validationContext"
          class="mb-3"
      >
        <b-form-group
            :label="$t('apartments.agree.phone')"
            label-for="phone"
        >
          <b-form-input
              id="phone"
              name="phone"
              type="tel"
              :placeholder="$t('apartments.agree.placeholder.phone')"
              v-model="clientPhoneNumber"
              :state="getValidationState(validationContext)"
              v-mask="maskForPhoneNumber"
              aria-describedby="phone-feedback"
              @focus="userFocused"
          />

          <b-form-invalid-feedback id="phone-feedback" class="error__provider">{{
              validationContext.errors[0]
            }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
    </div>

    <!-- client.other_phone -->
    <div class="col-md-4">
      <div class="mb-3">
        <label class="d-block" for="other_phone">{{
            $t("apartments.agree.other_phone")
          }}</label>
        <input
            id="other_phone"
            class="my-form__input form-control"
            type="tel"
            :placeholder="$t('apartments.agree.placeholder.other_phone')"
            v-model="clientOtherPhoneNumber"
            v-mask="maskForPhoneNumber"
            @focus="userFocused"
        />
      </div>
    </div>

    <!-- apartments.agree.language -->
    <div class="col-md-4">
      <div class="mb-3">
        <label class="d-block" for="language">{{
            $t("apartments.agree.language")
          }}</label>
        <select
            class="form-control"
            id="language"
            v-model="client.language"
        >
          <option value="uz">Узбекский</option>
          <option value="ru">Русский</option>
        </select>
      </div>
    </div>

    <!-- apartments.agree.type_client -->
    <div
        class="col-md-4"
        v-if="
                  (getMe.role && getMe.role.id === 1) ||
                    (getPermission &&
                      getPermission.checkout &&
                      getPermission.checkout.mark_friends)
                "
    >
      <div class="mb-3">
        <label class="d-block" for="type_client">{{
            $t("apartments.agree.type_client")
          }}</label>
        <select
            class="form-control"
            id="type_client"
            v-model="client.type_client"
        >
          <option selected value="unknown">Незнакомый</option>
          <option value="friends">Знакомый</option>
        </select>
      </div>
    </div>

    <div class="col-md-12">
      <hr/>
    </div>

  </div>
</template>

<script>
import {mapGetters} from "vuex";
import api from "@/services/api";

export default {
  name: "ClientInputConfirm",
  emits: ['focus'],
  props: {
    client: {}
  },

  data() {
    return {
      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },
      maskForPhoneNumber: `+### ## ### ## ##`,
    }
  },

  watch: {
    client: function () {
      this.$emit('clientSet', this.client)
    },
  },

  computed: {
    ...mapGetters([
      "getReserveClient",
      "getPermission",
      "getMe",
    ]),
    clientPhoneNumber: {
      get() {
        return this.client.phone
      },
      set(val) {
        this.client.phone = val.replace(/\s/g, '')
      }
    },
    clientOtherPhoneNumber: {
      get() {
        return this.client.other_phone
      },
      set(val) {
        this.client.other_phone = val.replace(/\s/g, '')
      }
    }
  },


  methods: {
    userFocused() {
      this.$emit('focus')
    },
    async getClientData() {
      if (this.client.passport_series.length === 9) {
        this.loading = true;
        try {
          // console.log(api.clientsV2, 'api 2');
          const {data} = await api.clientsV2.fetchClientData(this.client.passport_series)
          // console.log(data, 'data');
          this.client = {
            id: data.id,
            first_name: data.first_name ?? {
              lotin: null,
              kirill: null,
            },
            last_name: data.last_name ?? {
              lotin: null,
              kirill: null,
            },
            second_name: data.second_name ?? {
              lotin: null,
              kirill: null,
            },
            passport_series: data.passport_series,
            issued_by_whom: data.issued_by_whom,
            language: data.language,
            birth_day: data.birth_day,
            phone: data.phone,
            other_phone: data.other_phone,
            date_of_issue: data.date_of_issue,
            discount: {id: null},
            type_client: 'unknown'
          };
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.toastedWithErrorCode(error);
        }
      } else {
        this.toasted("Введите номер и серию паспорта правильно", "error");
      }
    },

    getValidationState({dirty, validated, valid = null}) {
      return dirty || validated ? valid : null;
    },


    // form
    isCyrillic(type, value) {
      switch (type) {
        case 'first_name':
          this.client.first_name.kirill = this.symbolIsCyrillic(value);
          break;
        case 'last_name':
          this.client.last_name.kirill = this.symbolIsCyrillic(value);
          break;
        case 'second_name':
          this.client.second_name.kirill = this.symbolIsCyrillic(value);
          break;
      }
    },

    isLatin(type, value) {
      switch (type) {
        case 'first_name':
          this.client.first_name.lotin = this.symbolIsLatin(value);
          break;
        case 'last_name':
          this.client.last_name.lotin = this.symbolIsLatin(value);
          break;
        case 'second_name':
          this.client.second_name.lotin = this.symbolIsLatin(value);
          break;
      }
    },

    textToLatin(type, event) {
      // console.log(type)
      // console.log(event)

      // console.log(this.client.first_name.lotin.length)
      switch (type) {
        case 'first_name':
          if (this.client.first_name.lotin.length === 0) {
            this.client.first_name.lotin = this.translateTextToLatin(event);
          }
          break;
        case 'last_name':
          if (this.client.last_name.lotin.length === 0) {
            this.client.last_name.lotin = this.translateTextToLatin(event);
          }
          break;
        case 'second_name':
          if (this.client.second_name.lotin.length === 0) {
            this.client.second_name.lotin = this.translateTextToLatin(event);
          }
          break;
      }

    },

    textToCyrillic(type, event) {

      switch (type) {
        case 'first_name':
          if (this.client.first_name.kirill.length === 0) {
            this.client.first_name.kirill = this.translateTextToCyrillic(event);
          }
          break;
        case 'last_name':
          if (this.client.last_name.kirill.length === 0) {
            this.client.last_name.kirill = this.translateTextToCyrillic(event);
          }
          break;
        case 'second_name':
          if (this.client.second_name.kirill.length === 0) {
            this.client.second_name.kirill = this.translateTextToCyrillic(event);
          }
          break;
      }
    },

    symbolIsCyrillic(event) {
      return event
          .replace(/[^а-яё ҚқЎўҲҳҒғ]/i, "")
          .replace(/(\..*?)\..*/g, "$1");
    },
    symbolIsLatin(event) {
      return event.replace(/[^a-z. ']/i, "").replace(/(\..*?)\..*/g, "$1");
    },

    translateTextToLatin(value) {
      return this.symbolCyrillicToLatin(value);
    },

    translateTextToCyrillic(value) {
      value = value.replace("Sh", "Ш");
      value = value.replace("sh", "ш");

      value = value.replace("Ch", "Ч");
      value = value.replace("ch", "ч");

      value = value.replace("Q", "Қ");
      value = value.replace("q", "қ");

      value = value.replace("O'", "Ў");
      value = value.replace("o'", "ў");

      value = value.replace("G'", "Ғ");
      value = value.replace("g'", "ғ");

      value = value.replace("Yu", "Ю");
      value = value.replace("yu", "ю");

      value = value.replace("Ya", "Я");
      value = value.replace("Ya", "я");

      value = value.replace("Yo", "Ё");
      value = value.replace("yo", "ё");

      value = value.replace("Ye", "Е");
      value = value.replace("ye", "е");

      value = value.replace("Kh", "Х");
      value = value.replace("kh", "х");

      value = value.replace("H", "Ҳ");
      value = value.replace("h", "ҳ");

      return this.symbolLatinToCyrillic(value);
    },
    symbolCyrillicToLatin(word) {
      var answer = "",
          a = {};

      a["Ё"] = "YO";
      a["Й"] = "I";
      a["Ц"] = "TS";
      a["У"] = "U";
      a["К"] = "K";
      a["Е"] = "E";
      a["Н"] = "N";
      a["Г"] = "G";
      a["Ш"] = "Sh";
      a["Щ"] = "Sch";
      a["З"] = "Z";
      a["Х"] = "Kh";
      a["Ъ"] = "'";
      a["ё"] = "yo";
      a["й"] = "i";
      a["ц"] = "ts";
      a["у"] = "u";
      a["к"] = "k";
      a["е"] = "e";
      a["н"] = "n";
      a["г"] = "g";
      a["ш"] = "sh";
      a["щ"] = "sch";
      a["з"] = "z";
      a["х"] = "kh";
      a["ъ"] = "'";
      a["Ф"] = "F";
      a["Ы"] = "I";
      a["В"] = "V";
      a["А"] = "A";
      a["П"] = "P";
      a["Р"] = "R";
      a["О"] = "O";
      a["Л"] = "L";
      a["Д"] = "D";
      a["Ж"] = "J";
      a["Э"] = "E";
      a["ф"] = "f";
      a["ы"] = "i";
      a["в"] = "v";
      a["а"] = "a";
      a["п"] = "p";
      a["р"] = "r";
      a["о"] = "o";
      a["л"] = "l";
      a["д"] = "d";
      a["ж"] = "j";
      a["э"] = "e";
      a["Я"] = "Ya";
      a["Ч"] = "Ch";
      a["С"] = "S";
      a["М"] = "M";
      a["И"] = "I";
      a["Т"] = "T";
      a["Ь"] = "'";
      a["Б"] = "B";
      a["Ю"] = "Yu";
      a["я"] = "ya";
      a["ч"] = "ch";
      a["с"] = "s";
      a["м"] = "m";
      a["и"] = "i";
      a["т"] = "t";
      a["ь"] = "'";
      a["б"] = "b";
      a["ю"] = "yu";

      a["Қ"] = "Q";
      a["қ"] = "q";

      a["Ў"] = "O'";
      a["ў"] = "o'";

      a["Ҳ"] = "H";
      a["ҳ"] = "h";

      a["Ғ"] = "G'";
      a["ғ"] = "g'";

      for (let i in word) {
        if (word.hasOwnProperty(i)) {
          if (a[word[i]] === undefined) {
            answer += word[i];
          } else {
            answer += a[word[i]];
          }
        }
      }
      return answer;
    },
    symbolLatinToCyrillic(word) {
      var answer = "",
          a = {};

      a["Q"] = "Қ";
      a["q"] = "қ";

      a["O'"] = "Ў";
      a["o'"] = "ў";

      a["H"] = "Ҳ";
      a["h"] = "ҳ";

      a["G'"] = "Ғ";
      a["g'"] = "ғ";

      a["I"] = "И";
      a["U"] = "У";
      a["K"] = "К";
      a["N"] = "Н";
      a["G"] = "Г";
      a["Z"] = "З";
      a["i"] = "и";
      a["u"] = "у";
      a["k"] = "к";
      a["E"] = "Е";
      a["e"] = "е";
      a["n"] = "н";
      a["g"] = "г";
      a["z"] = "з";
      a["F"] = "Ф";
      a["V"] = "В";
      a["P"] = "П";
      a["R"] = "Р";
      a["O"] = "О";
      a["L"] = "Л";
      a["D"] = "Д";
      a["J"] = "Ж";
      a["f"] = "ф";
      a["v"] = "в";
      a["a"] = "а";
      a["A"] = "А";
      a["p"] = "п";
      a["r"] = "р";
      a["o"] = "о";
      a["l"] = "л";
      a["d"] = "д";
      a["j"] = "ж";

      a["S"] = "С";
      a["M"] = "М";
      a["I"] = "И";
      a["T"] = "Т";
      a["B"] = "Б";

      a["s"] = "с";
      a["m"] = "м";
      a["i"] = "и";
      a["t"] = "т";
      a["b"] = "б";

      for (let i in word) {
        if (word.hasOwnProperty(i)) {
          if (a[word[i]] === undefined) {
            answer += word[i];
          } else {
            answer += a[word[i]];
          }
        }
      }
      return answer;
    },
  }
}
</script>

<style scoped>
.error__provider {
  color: red;
  display: block;
  font-size: 14px;
}
</style>