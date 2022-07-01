<template>
  <main class="main__content">
    <b-tabs v-model="tabIndex" v-on:activate-tab="tabActivated" pills nav-class="reContract-header"
            content-class="reContract" id="reContract">
      <b-tab active>
        <template #title>
          <div class="tab-title">
            <span>1</span>
            <p>Детали цессионарий</p>
            <div class="next-icon">
              <img :src="require('@/assets/icons/icon-right.svg')" alt="">
            </div>

          </div>
        </template>

        <ValidationObserver tag="form" class="assignee" ref="client-form">
          <div class="row">
            <div class="col-6">
              <div class="assignee-header">
                <p class="assignee-header__title">Цедент</p>
                <span class="custom-tooltip" style="cursor: pointer" id="assignee-tooltip">
                  <img
                      :src="require('@/assets/icons/icon-questions__circle.svg')" alt="">
                  <b-tooltip
                      custom-class="custom-tooltip"
                      target="assignee-tooltip"
                      triggers="hover"
                      variant="secondary"
                  >
                    Цедент – это участник договора цессии, который в рамках договора цессии уступает иному лицу свое право требования.
                  </b-tooltip>
                </span>

              </div>
            </div>
            <div class="col-6">
              <div class="assignee-header">
                <p class="assignee-header__title">цессионарий</p>
                <span class="custom-tooltip" style="cursor: pointer" id="session-tooltip">
                  <img
                      :src="require('@/assets/icons/icon-questions__circle.svg')" alt="">
                </span>
                <b-tooltip
                    style="width: 400px !important;"
                    custom-class="custom-tooltip"
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
                <div class="client__details_info_card ">
                  <label>{{ $t('series') }}</label>
                  <b-form-input disabled :value="oldClient['passport_series']"/>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="assignee-item">
                <ValidationProvider
                    rules="required|min:9"
                    class="cell"
                    :name="`${$t('series')}`"
                    v-slot="{errors}"
                >
                  <base-input
                      :class="{'error' : errors[0]}"
                      type="text"
                      mask="AA#######"
                      class="client__details_info_card" :label="true"
                      :placeholder="$t('series')"
                      @input="fetchClientSeries"
                      v-model="newClient['passport_series']"
                  />
                </ValidationProvider>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="assignee-item">
                <div class="client__details_info_card">
                  <label>{{ $t('user.last_name') }}</label>
                  <b-form-input disabled :value="nameDivide(oldClient.last_name)"/>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="assignee-item">
                <ValidationProvider
                    rules="required|min:2"
                    class="cell mr-2"
                    :name="`${$t('user.last_name') +' '+ $t('lotin_compress')}`"
                    v-slot="{errors}"
                >
                  <base-input :class="{'error' : errors[0]}" class="client__details_info_card mr-2" :label="true"
                              :placeholder="`${$t('user.last_name') +' '+ $t('lotin_compress')}`"
                              v-model="newClient.second_name.lotin"
                              @input="translateCyrillic('second_name', $event)"/>
                </ValidationProvider>
                <ValidationProvider
                    rules="required|min:2"
                    class="cell"
                    :name="`${$t('user.last_name')}`"
                    v-slot="{errors}"
                >
                  <base-input :class="{'error' : errors[0]}" class="client__details_info_card" :label="true"
                              :placeholder="`${$t('user.last_name') +' '+ $t('cyrill_compress')}`"
                              v-model="newClient.second_name.kirill" @input="translateLatin('second_name', $event)"/>
                </ValidationProvider>

              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="assignee-item">
                <div class="client__details_info_card">
                  <label>{{ $t('user.first_name') }}</label>
                  <b-form-input disabled :value="nameDivide(oldClient.first_name)"/>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="assignee-item">
                <ValidationProvider
                    rules="required|min:2"
                    class="cell mr-2"
                    :name="`${$t('user.first_name')}`"
                    v-slot="{errors}"
                >
                  <base-input :class="{'error' : errors[0]}" class="client__details_info_card" :label="true"
                              :placeholder="`${$t('user.first_name') +' '+ $t('lotin_compress')}`"
                              v-model="newClient.first_name.lotin" @input="translateCyrillic('first_name', $event)"/>
                </ValidationProvider>
                <ValidationProvider
                    rules="required|min:2"
                    class="cell"
                    :name="`${$t('user.first_name') +' '+ $t('cyrill_compress')}`"
                    v-slot="{errors}"
                >
                  <base-input :class="{'error' : errors[0]}" class="client__details_info_card" :label="true"
                              :placeholder="`${$t('user.first_name') +' '+ $t('cyrill_compress')}`"
                              v-model="newClient.first_name.kirill" @input="translateLatin('first_name', $event)"/>
                </ValidationProvider>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="assignee-item">
                <div class="client__details_info_card">
                  <label>{{ $t('user.second_name') }}</label>
                  <b-form-input disabled :value="nameDivide(oldClient.second_name)"/>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="assignee-item">
                <ValidationProvider
                    rules="required|min:2"
                    class="cell mr-2"
                    :name="`${$t('user.second_name') +' '+ $t('lotin_compress')}`"
                    v-slot="{errors}"
                >
                  <base-input :class="{'error' : errors[0]}" class="client__details_info_card mr-2" :label="true"
                              :placeholder="`${$t('user.second_name') +' '+ $t('lotin_compress')}`"
                              v-model="newClient.last_name.lotin" @input="translateCyrillic('last_name', $event)"/>
                </ValidationProvider>
                <ValidationProvider
                    rules="required|min:2"
                    class="cell"
                    :name="`${$t('user.second_name') +' '+ $t('cyrill_compress')}`"
                    v-slot="{errors}"
                >
                  <base-input :class="{'error' : errors[0]}" class="client__details_info_card" :label="true"
                              :placeholder="`${$t('user.second_name') +' '+ $t('cyrill_compress')}`"
                              v-model="newClient.last_name.kirill" @input="translateLatin('last_name', $event)"/>
                </ValidationProvider>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-6">
              <div class="assignee-item">
                <div class="client__details_info_card">
                  <label>{{ $t('apartments.agree.issued_by_whom') }}</label>
                  <b-form-input disabled :value="oldClient['issued_by_whom']"/>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="assignee-item">
                <ValidationProvider
                    rules="required"
                    class="cell"
                    :name="`${$t('apartments.agree.issued_by_whom')}`"
                    v-slot="{errors}"
                >
                  <base-input
                      :class="{'error' : errors[0]}"
                      class="client__details_info_card"
                      :label="true"
                      :placeholder="$t('apartments.agree.issued_by_whom')"
                      v-model="newClient['issued_by_whom']"/>
                </ValidationProvider>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="assignee-item">
                <div class="client__details_info_card ">
                  <label>{{ $t('apartments.agree.date_of_issue') }}</label>
                  <b-form-input disabled :value="oldClient['date_of_issue']"/>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="assignee-item">
                <ValidationProvider
                    rules="required"
                    class="cell"
                    :name="`${$t('apartments.agree.date_of_issue')}`"
                    v-slot="{errors}"
                >
                  <base-date-picker
                      class="data-picker"
                      :range="false"
                      :default-value="newClient.date_of_issue"
                      :placeholder="$t('apartments.agree.date_of_issue')"
                      v-model="newClient.date_of_issue"
                  />
                  <span class="error__provider" v-if="errors[0]">
                      {{ errors[0] }}
                  </span>
                </ValidationProvider>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="assignee-item">
                <div class="client__details_info_card ">
                  <label>{{ $t('birth_day') }}</label>
                  <b-form-input disabled :value="oldClient['birth_day']"/>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="assignee-item">
                <ValidationProvider
                    rules="required"
                    class="cell"
                    :name="`${$t('birth_day')}`"
                    v-slot="{errors}"
                >
                  <base-date-picker
                      class="data-picker"
                      :range="false"
                      :default-value="newClient.birth_day"
                      :placeholder="$t('birth_day')"
                      v-model="newClient.birth_day"
                  />
                  <span class="error__provider" v-if="errors[0]">
                      {{ errors[0] }}
                    </span>
                </ValidationProvider>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="assignee-item">
                <div class="client__details_info_card ">
                  <label>{{ $t('number') }} ({{ $t('main_number') }})</label>
                  <b-form-input disabled :value="phone(oldClient['phone'])"/>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="assignee-item">
                <ValidationProvider
                    rules="required|min:12"
                    class="cell"
                    :name="`${ $t('number')} (${$t('main_number')})`"
                    v-slot="{errors}"
                >
                  <base-input :class="{'error' : errors[0]}" mask="+### ## ### ## ##" type="tel"
                              class="client__details_info_card" :label="true"
                              :placeholder="`${ $t('number')} (${$t('main_number')})`"
                              v-model="newClient['phone']"/>
                </ValidationProvider>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="assignee-item">
                <div class="client__details_info_card ">
                  <label>{{ $t('number') }} ({{ $t('extra') }})</label>
                  <b-form-input disabled :value="phone(oldClient['other_phone'])"/>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="assignee-item">
                <ValidationProvider
                    rules="required|min:12"
                    class="cell"
                    :name="`${ $t('number')} (${$t('extra')})`"
                    v-slot="{errors}"
                >
                  <base-input
                      :class="{'error' : errors[0]}"
                      type="tel" mask="+### ## ### ## ##"
                      class="client__details_info_card" :label="true"
                      :placeholder="`${ $t('number')} (${$t('extra')})`"
                      v-model="newClient['other_phone']"
                  />
                </ValidationProvider>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="assignee-item">
                <div class="client__details_info_card ">
                  <label>{{ $t('number') }} ({{ $t('extra') }})</label>
                  <b-form-input disabled :value="oldClient['language']"/>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="assignee-item">
                <ValidationProvider
                    rules="required"
                    class="cell"
                    :name="`${$t('reason_recontract')}`"
                    v-slot="{errors}"
                >
                  <base-select
                      :class="{'error' : errors[0]}"
                      class="client__details_info_card"
                      @change="setFormProperty('language',$event)"
                      :noPlaceholder="true"
                      :placeholder="$t('clients.language')"
                      v-model="newClient.language"
                      :label="true"
                      :options="languages"
                  />
                </ValidationProvider>
              </div>
            </div>
          </div>
        </ValidationObserver>
      </b-tab>

      <b-tab>
        <template #title>
          <div class="tab-title">
            <span>2</span>
            <p>Детали соглашения</p>
          </div>
        </template>

        <ValidationObserver tag="form" class="agree" ref="reContract-form">

          <div class="row agree-row">
            <div class="col-6">
              <div class="agree-item">
                <ValidationProvider
                    rules="required"
                    class="cell"
                    :name="`${$t('create_date')}`"
                    v-slot="{errors}"
                >
                  <base-date-picker
                      class="data-picker"
                      :range="false"
                      :default-value="contract.date"
                      :placeholder="$t('create_date')"
                      v-model="contract.date"
                  />
                  <span class="error__provider" v-if="errors[0]">
                      {{ errors[0] }}
                    </span>
                </ValidationProvider>
              </div>
            </div>
            <div class="col-6">
              <div class="agree-item">

                <div class="input-price-group">
                  <!-- PRICE FROM   -->
                  <base-input
                      :label="true"
                      :disable="true"
                      :placeholder="$t('payments.contract')"
                      v-model="order.contract"
                      :top-placeholder="true"
                      class="price-from"
                  />
                  <!--  PRICE TO  -->
                  <base-input
                      :class="{'error' : !contract.agreement_number}"
                      :label="true"
                      style="border-radius: 0 2rem 2rem 0"
                      :currency="`${$t('ye')}`"
                      :placeholder="$t('number_agree')"
                      v-model="contract.agreement_number"
                      :top-placeholder="true"
                      :permission-change="true"
                      class="price-to"
                  />
                </div>

              </div>
            </div>

            <div class="col-6">
              <div class="agree-item">

                <b-dropdown left>
                  <template v-if="contract.reorder_type_id" #button-content>

                    <div class="input-block">
                      <span class="input-label">{{ $t('reason_recontract') }}</span>
                      <p v-for="type in types" :key="type.id" class="input-text">
                        <template v-if="type.id === contract.reorder_type_id">
                          {{ checkLocales(type.name) }}
                        </template>
                      </p>
                    </div>

                  </template>
                  <template v-else #button-content>
                    <p class="default-label">
                      {{ $t('reason_recontract') }}
                    </p>
                  </template>
                  <b-dropdown-text href="#">

                    <!--                    <b-form-group v-slot="{ ariaDescribedby }">-->
                    <ValidationProvider
                        rules="required"
                        class="cell"
                        :name="`${$t('reason_recontract')}`"
                        v-slot="{errors}"
                    >
                      <!--                        <b-form-checkbox-group-->
                      <!--                            id="checkbox-group-2"-->
                      <!--                            v-model="contract.reorder_type_id"-->
                      <!--                            :aria-describedby="ariaDescribedby"-->
                      <!--                            name="flavour-2"-->
                      <!--                        >-->
                      <b-form-checkbox v-model="contract.reorder_type_id" v-for="option in types" :key="option.id"
                                       :value="option.id">
                        {{ checkLocales(option.name) }}
                      </b-form-checkbox>
                      <!--                        </b-form-checkbox-group>-->
                      <span class="error__provider" v-if="errors[0]">{{ errors[0] }}</span>

                    </ValidationProvider>

                    <!--                    </b-form-group>-->

                  </b-dropdown-text>
                </b-dropdown>

              </div>
            </div>
          </div>

        </ValidationObserver>


      </b-tab>

      <template #tabs-end>
        <b-nav-item role="presentation" href="#">

          <base-button
              v-show="tabIndex !== 0"
              type="div"
              @click="backTab"
              :text="$t(`back`)"
              style="margin-right: .5rem;"
          >
            <template #left-icon>
              <BaseArrowLeftIcon fill="#7C3AED" :width="20" :height="20"/>
            </template>
          </base-button>

          <base-button v-show="tabIndex === 0" @click="nextTab" class="violet-gradient"
                       :text="$t(`${tabBtnText}`)">
            <template #right-icon>
              <BaseArrowRightIcon fill="#fff"/>
            </template>
          </base-button>
          <base-button v-show="tabIndex === 1" @click="validateContractForm" :disabled="contractBtn"
                       class="violet-gradient"
                       :text="$t(`${tabBtnText}`)">
          </base-button>

        </b-nav-item>
      </template>

    </b-tabs>
  </main>
</template>

<script>

import BaseButton from "@/components/Reusable/BaseButton";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseInput from "@/components/Reusable/BaseInput";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseSelect from "@/components/Reusable/BaseSelect";
import api from "@/services/api";
import {phonePrettier} from "@/util/reusable";

export default {
  name: "ReContract",
  components: {
    BaseArrowLeftIcon,
    BaseInput,
    BaseButton,
    BaseArrowRightIcon,
    BaseDatePicker,
    BaseSelect,
  },

  data() {
    return {
      tabIndex: 0,
      tabBtnText: 'next',
      oldClient: {},
      newClient: {
        first_name: {
          lotin: '',
          kirill: '',
        },
        second_name: {
          lotin: '',
          kirill: '',
        },
        last_name: {
          lotin: '',
          kirill: '',
        },
        passport_series: '',
        issued_by_whom: '',
        date_of_issue: '',
        birth_day: '',
        phone: null,
        other_phone: null,
        language: 'uz',
        type_client: 'unknown',
      },
      contract: {
        date: null,
        reorder_type_id: null,
        agreement_number: '',
        client_uuid: null,
      },
      client_id: '',
      order: {},
      types: [],
      languages: [
        {
          value: 'uz',
          text: 'Uzbek',
        },
        {
          value: 'ru',
          text: 'Russian'
        }
      ],
      timeoutId: null,
      contractBtn: true,
    }
  },

  async created() {
    await this.fetchOldClient()
    if (this.$route.params?.type) {
      this.contract.reorder_type_id = this.$route.params.type
    } else {
      this.contract.reorder_type_id = 1
    }

    if (this.client_id) {
      this.tabIndex = 1
      this.tabBtnText = 're_contract'
      this.contractBtn = false
    }
  },

  methods: {
    async validateClientForm() {
      const isValid = await this.$refs['client-form'].validate()
      if (isValid) {
        if (!this.client_id) {
          this.confirmClient()
        }
        this.tabIndex = 1
        this.tabBtnText = 're_contract'
        this.contractBtn = false
      }
    },

    async validateContractForm() {
      const isValid = await this.$refs['reContract-form'].validate()
      if (this.contract.agreement_number !== null && isValid) {
        this.confirmContract()
      }
    },

    backTab() {
      this.tabIndex = 0
      this.tabBtnText = 'next'
    },

    async nextTab() {
      const isValid = await this.$refs['client-form'].validate()
      if (isValid) {
        this.tabIndex = 1
        this.tabBtnText = 're_contract'
        this.contractBtn = false
      }
    },

    fetchClientSeries(value) {
      if (value && value.length === 9) {
        api.clients.fetchClientData(value).then((res) => {
          const {data} = res
          if (data.id !== null) {
            this.newClient = {
              ...this.newClient,
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
              phone: this.phone(data.phone),
              other_phone: this.phone(data.other_phone),
              date_of_issue: data.date_of_issue,
              discount: {id: null},
            };
          }
        }).catch((error) => {
          this.toastedWithErrorCode(error);
        })

      }
    },

    nameDivide(value) {
      if (value && Object.keys(value).length)
        return value.kirill + ' / ' + value.lotin
      return value
    },

    checkLocales(name) {
      if (localStorage.locale)
        return name[localStorage.locale]
      else
        return name['ru']
    },

    translateCyrillic(type, event) {
      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId)
      }
      this.timeoutId = setTimeout(() => {
        switch (type) {
          case 'first_name':
            if (!this.newClient.first_name.kirill) {
              this.newClient.first_name.kirill = this.symbolLatinToCyrillic(event);
            }
            break;
          case 'last_name':
            if (!this.newClient.last_name.kirill) {
              this.newClient.last_name.kirill = this.symbolLatinToCyrillic(event);
            }
            break;
          case 'second_name':
            if (!this.newClient.second_name.kirill) {
              this.newClient.second_name.kirill = this.symbolLatinToCyrillic(event);
            }
            break;
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
            if (!this.newClient.first_name.kirill) {
              this.newClient.first_name.kirill = this.symbolCyrillicToLatin(event);
            }
            break;
          case 'last_name':
            if (!this.newClient.last_name.kirill) {
              this.newClient.last_name.kirill = this.symbolCyrillicToLatin(event);
            }
            break;
          case 'second_name':
            if (!this.newClient.second_name.kirill) {
              this.newClient.second_name.kirill = this.symbolCyrillicToLatin(event);
            }
            break;
        }
      }, 1000)

    },

    symbolCyrillicToLatin(word) {
      this.symbolIsCyrillic(word)

      let result = '';
      const A = {};

      A["Ё"] = "YO";
      A["Й"] = "I";
      A["Ц"] = "TS";
      A["У"] = "U";
      A["К"] = "K";
      A["Е"] = "E";
      A["Н"] = "N";
      A["Г"] = "G";
      A["Ш"] = "SH";
      A["Щ"] = "SCH";
      A["З"] = "Z";
      A["Х"] = "H";
      A["Ъ"] = "'";
      A["ё"] = "yo";
      A["й"] = "i";
      A["ц"] = "ts";
      A["у"] = "u";
      A["к"] = "k";
      A["е"] = "e";
      A["н"] = "n";
      A["г"] = "g";
      A["ш"] = "sh";
      A["щ"] = "sch";
      A["з"] = "z";
      A["х"] = "h";
      A["ъ"] = "'";
      A["Ф"] = "F";
      A["Ы"] = "I";
      A["В"] = "V";
      A["А"] = "A";
      A["П"] = "P";
      A["Р"] = "R";
      A["О"] = "O";
      A["Л"] = "L";
      A["Д"] = "D";
      A["Ж"] = "ZH";
      A["Э"] = "E";
      A["ф"] = "f";
      A["ы"] = "i";
      A["в"] = "v";
      A["а"] = "a";
      A["п"] = "p";
      A["р"] = "r";
      A["о"] = "o";
      A["л"] = "l";
      A["д"] = "d";
      A["ж"] = "zh";
      A["э"] = "e";
      A["Я"] = "YA";
      A["Ч"] = "CH";
      A["С"] = "S";
      A["М"] = "M";
      A["И"] = "I";
      A["Т"] = "T";
      A["Ь"] = "'";
      A["Б"] = "B";
      A["Ю"] = "YU";
      A["я"] = "ya";
      A["ч"] = "ch";
      A["с"] = "s";
      A["м"] = "m";
      A["и"] = "i";
      A["т"] = "t";
      A["ь"] = "'";
      A["б"] = "b";
      A["ю"] = "yu";


      for (let i in word) {

        if (word.hasOwnProperty(i)) {
          if (A[word[i]] === undefined) {
            result += word[i];
          } else {
            result += A[word[i]];
          }
        }
      }


      return result;
    },

    symbolLatinToCyrillic(word) {
      word = this.symbolIsLatin(word);

      let result = '';
      const a = {};

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
      a["y"] = "й";
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


      word = word.replaceAll("Sh", "Ш");
      word = word.replaceAll("sh", "ш");

      word = word.replaceAll("Ch", "Ч");
      word = word.replaceAll("ch", "ч");

      word = word.replaceAll("Q", "Қ");
      word = word.replaceAll("q", "қ");

      word = word.replaceAll("O'", "Ў");
      word = word.replaceAll("o'", "ў");

      word = word.replaceAll("G'", "Ғ");
      word = word.replaceAll("g'", "ғ");

      word = word.replaceAll("Yu", "Ю");
      word = word.replaceAll("yu", "ю");

      word = word.replaceAll("Ya", "Я");
      word = word.replaceAll("Ya", "я");

      word = word.replaceAll("Yo", "Ё");
      word = word.replaceAll("yo", "ё");

      word = word.replaceAll("Ye", "Е");
      word = word.replaceAll("ye", "е");

      word = word.replaceAll("Kh", "Х");
      word = word.replaceAll("kh", "х");

      word = word.replaceAll("H", "Ҳ");
      word = word.replaceAll("h", "ҳ");


      for (let i in word) {
        if (word.hasOwnProperty(i)) {
          if (a[word[i]] === undefined) {
            result += word[i];
          } else {
            result += a[word[i]];
          }
        }
      }
      return result;
    },

    symbolIsCyrillic(event) {
      return event
          .replace(/[^а-яё ҚқЎўҲҳҒғ]/i, "")
          .replace(/(\..*?)\..*/g, "$1");
    },

    symbolIsLatin(event) {
      return event.replace(/[^a-z. ']/i, "").replace(/(\..*?)\..*/g, "$1");
    },

    phone(value) {
      return phonePrettier(value)
    },

    async fetchOldClient() {
      const id = this.$route.params.id
      await api.contractV2.reOrderDetails(id).then(res => {
        this.oldClient = res.data.client
        this.order = res.data.order
        this.types = res.data.types
      }).catch(err =>
          err
      )
    },

    confirmClient() {
      let other_phone = ''
      let phone = ''
      if (typeof this.newClient.other_phone === "string") {
        other_phone = parseInt(this.newClient.other_phone.replaceAll(' ', '').replaceAll('+', '').trim())
      } else {
        other_phone = this.newClient.other_phone
      }
      if (typeof this.newClient.phone === "string") {
        phone = parseInt(this.newClient.phone.replaceAll(' ', '').replaceAll('+', '').trim())
      } else {
        phone = this.newClient.phone
      }
      const data = {...this.newClient, other_phone, phone}

      api.clientsV2.createClient(data).then((res) => {
        this.client_id = res.data.id
      }).catch((err) => {
        return err
      }).finally(() => {

      })

    },

    confirmContract() {
      this.contract.client_uuid = this.client_id
      api.contractV2.reOrderConfirm(this.order.uuid, this.contract).then(() => {
        this.client_id = ''
        this.$router.push({name: 'contracts-view', params: {id: this.$route.params.id}})
      }).catch(error => {
        if (error.response.data.message) {
          this.$toasted.show(error.response.data.message, {
            type: 'error'
          })
          this.client_id = ''
          this.$router.push({name: 'contracts-view', params: {id: this.$route.params.id}})
        }
      }).finally(() => {

      })
    },

    async tabActivated(newTabIndex, oldTabIndex) {

      if (newTabIndex === 1) {
        if (!this.client_id) {
          await this.validateClientForm()
        }
        this.tabIndex = 1
        this.tabBtnText = 're_contract'
      } else if (oldTabIndex === 1 && newTabIndex === 0) {
        this.tabIndex = 0
        this.tabBtnText = 'next'
      } else {
        await this.validateContractForm()
      }
      if (newTabIndex === 0) {
        this.tabIndex = 0
        this.tabBtnText = 'next'
      }
    },

    setFormProperty(property, value) {
      this.newClient[property] = value
      // this.errors[property] = false

    },

    setContractProperty(property, value) {
      this.contract[property] = value
      this.errors[property] = false
    },
  }
}
</script>

<style lang="scss" scoped>

.cell {
  width: 100%;
}

.error__provider {
  color: red;
  display: flex;
  justify-content: flex-end;
  margin-top: 0;
  margin-bottom: 0rem;
}

::v-deep .reContract {
  &-header {
    display: flex;
    align-items: center !important;
    flex-wrap: nowrap;
    margin-bottom: 2rem;
    border-top: 6px solid var(--gray-100);
    border-bottom: 6px solid var(--gray-100);
    padding: 20px 0;

    .nav-item {
      min-width: max-content;

      .nav-link {
        padding: 8px 6px;
      }

      .active {
        background-color: transparent;
        color: var(--violet-600);

        p {
          color: var(--violet-600);
        }

        span {
          background-color: var(--violet-100);
          color: var(--violet-600);
        }
      }

      &:last-child {
        width: 100%;

        .nav-link {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
}

.tab-title {
  display: flex;
  justify-content: center;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;


  span {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3rem;
    min-width: 2rem;
    width: 2rem;
    height: 2rem;
    font-size: 14px;
    line-height: 20px;
    margin-right: .5rem;
    background-color: var(--gray-100);
    color: var(--gray-400);
  }

  p {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 0;
    color: var(--gray-400);
  }

  .next-icon {
    display: flex;
    align-items: center;
    margin-left: 12px;
  }
}

.assignee {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  &-header {
    display: flex;
    align-items: center;
    column-gap: .25rem;
    padding: 1rem 1.25rem;
    font-family: CraftworkSans, serif;
    font-style: normal;
    font-weight: 900;
    font-size: 12px;
    line-height: 14px;
    color: var(--gray-400);

    &__title {
      text-transform: uppercase;
      margin: 0;
    }
  }

  .row {
    margin: 0 auto;
    width: 100%;
    border-bottom: 2px solid var(--gray-200);

    &:last-child {
      border-bottom: none;
    }
  }

  &-item {
    display: flex;

    //:last-child {
    //  border: none;
    //}

    .data-picker {
      height: 56px;
      max-height: 56px;
      width: 100%;
      margin: 1.25rem auto;
      border: 2px solid #E5E7EB;
      border-radius: 32px;
    }

    ::v-deep .base-calendar .date-picker .mx-input-wrapper .mx-input {
      height: 52px !important;
      padding: .5rem .5rem .5rem 20px !important;
      width: 100%;
      font-weight: 700;
      font-size: 1rem;
      color: var(--gray-600);
    }

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
        //display: grid;
        //grid-template-columns: 1fr 1fr;
        //column-gap: 3rem;

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
          margin: 1.25rem auto;

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


    }

  }
}


.agree {
  &-row {
    flex-direction: column;
    row-gap: 1rem;
  }

  &-item {
    .data-picker {
      height: 56px;
      max-height: 56px;
      width: 100%;
      border: 2px solid #E5E7EB;
      border-radius: 32px;
    }

    ::v-deep .base-calendar .date-picker .mx-input-wrapper .mx-input {
      height: 52px !important;
      padding: .5rem .5rem .5rem 20px !important;
      width: 100%;
      font-weight: 700;
      font-size: 1rem;
      color: var(--gray-600);
    }

    .form-control:disabled {
      background-color: #fff;
    }
  }


}


.input-price-group {
  height: 3.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  grid-template-columns: 1fr 3fr;
  border-radius: 2rem;
  background-color: var(--gray-100);
  color: var(--gray-600);

  .price-from,
  .price-to {
    height: 100%;
    padding: 0 1.25rem;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    border: none;
    font-family: inherit;
    color: inherit;

    &::placeholder {
      font-family: Inter, sans-serif;
      color: var(--gray-400);
      font-weight: 600;
    }
  }

  .price-from {
    width: 30%;
    //border-right: 1px solid var(--gray-300);
    border-right: 1px solid var(--gray-300);
    border-radius: 0 !important;
    padding-right: 0;
  }

  .price-to {
    width: 70%;
  }
}

::v-deep {

  .b-dropdown {
    width: 100%;
  }


  .b-dropdown .btn:not(.dropdown-item), .btn-secondary:not(.dropdown-item) {
    font-family: Inter, sans-serif;
    padding: 1rem 1rem 1rem 1.5rem !important;
    height: 56px;
    font-style: normal;
    line-height: 22px !important;
    border-radius: 2rem !important;
    color: var(--gray-400) !important;
    font-size: 1rem !important;
    border: none !important;
    outline: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: var(--gray-100) !important;
    margin: 0 !important;

    &:hover {
      -webkit-box-shadow: 0 8px 25px -8px var(--gray-400) !important;
      box-shadow: 0 8px 25px -8px var(--gray-400) !important;
    }

    .input-block {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .input-label {
      font-weight: 900;
      font-size: 8px;
      line-height: 10px;
      margin: 0 2px 0 0;
      //margin-bottom: 2px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--gray-400);

    }

    .error {
      border: .25rem solid var(--red-500) !important;
    }

    .input-text {
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      color: var(--gray-600);
      margin: 0;
      max-width: 300px;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }

    .default-label {
      line-height: 22px;
      font-size: 1rem;
      color: var(--gray-400);
      margin: 0;
    }

  }

  .dropdown-toggle::after {
    border: none;
    width: 24px;
    height: 24px;
    display: flex;
    margin-left: 1rem;
    background: url("../../assets/icons/icon-down.svg");
    transition: all .2s ease-in-out;
  }

  .show .dropdown-toggle::after {
    transform: rotate(-180deg);
  }

  .dropdown-menu {
    border: 1px solid var(--gray-200);
    box-sizing: border-box;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
    border-radius: 24px;
    padding: .5rem;
    width: 100%;


    .dropdown-item {
      font-weight: 600 !important;
      font-size: 16px !important;
      line-height: 22px !important;
      border-radius: 1rem;
      padding: 12px 17px;
      min-width: 256px;

      &:hover {
        background-color: var(--gray-200);
      }
    }

  }


  .b-dropdown-text {
    min-width: 16rem;
    padding: .5rem !important;

    .form-group {
      margin-bottom: 0;
    }
  }

  .custom-control-label {
    display: flex;
    align-items: center;
    padding-left: 2rem;
    width: 100%;
    height: 100%;

    &:before, &:after {
      top: 50%;
      transform: translateY(-50%);
      left: 0;
    }
  }

  .custom-control-input:focus ~ .custom-control-label::before {
    -webkit-box-shadow: 0 0 0 0.2rem rgba(196, 181, 253, 5%);
    box-shadow: 0 0 0 0.2rem rgba(196, 181, 253, 5%);
  }

  .custom-control-input:checked ~ .custom-control-label::before {
    border-color: var(--violet-600);
    background-color: var(--violet-600);
  }

  .custom-checkbox {
    width: 100%;
    display: flex;
    align-items: center;
    padding: .15rem .15rem .15rem 1rem;
    height: 50px;
    font-weight: 600;
    border-radius: 1rem;
    color: var(--gray-600);
    font-size: 1rem;

    &:hover {
      background-color: var(--gray-200);
    }
  }

}

</style>