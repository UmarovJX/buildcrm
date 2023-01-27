<template>
    <div>

        <app-header>
            <template #header-title>
                {{ $t('re_contract') }}
            </template>
        </app-header>


        <b-tabs
            pills
            v-model="tabIndex"
            v-on:activate-tab="tabActivated"
            nav-class="reContract-header"
            content-class="reContract"
            id="reContract"
        >
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
                                    <b-form-input disabled :value="oldClient.attributes['passport_series']"/>
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
                                        v-model="newClient.attributes['passport_series']"
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
                                    <b-form-input disabled :value="nameDivide(oldClient.attributes.last_name)"/>
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
                                    <base-input :class="{'error' : errors[0]}" class="client__details_info_card mr-2"
                                                :label="true"
                                                :placeholder="`${$t('user.last_name') +' '+ $t('lotin_compress')}`"
                                                v-model="newClient.attributes.middle_name.lotin"
                                                @input="translateCyrillic('second_name', $event)"/>
                                </ValidationProvider>
                                <ValidationProvider
                                    rules="required|min:2"
                                    class="cell"
                                    :name="`${$t('user.last_name')}`"
                                    v-slot="{errors}"
                                >
                                    <base-input :class="{'error' : errors[0]}" class="client__details_info_card"
                                                :label="true"
                                                :placeholder="`${$t('user.last_name') +' '+ $t('cyrill_compress')}`"
                                                v-model="newClient.attributes.middle_name.kirill"
                                                @input="translateLatin('second_name', $event)"/>
                                </ValidationProvider>

                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="assignee-item">
                                <div class="client__details_info_card">
                                    <label>{{ $t('user.first_name') }}</label>
                                    <b-form-input disabled :value="nameDivide(oldClient.attributes.first_name)"/>
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
                                    <base-input :class="{'error' : errors[0]}" class="client__details_info_card"
                                                :label="true"
                                                :placeholder="`${$t('user.first_name') +' '+ $t('lotin_compress')}`"
                                                v-model="newClient.attributes.first_name.lotin"
                                                @input="translateCyrillic('first_name', $event)"/>
                                </ValidationProvider>
                                <ValidationProvider
                                    rules="required|min:2"
                                    class="cell"
                                    :name="`${$t('user.first_name') +' '+ $t('cyrill_compress')}`"
                                    v-slot="{errors}"
                                >
                                    <base-input :class="{'error' : errors[0]}" class="client__details_info_card"
                                                :label="true"
                                                :placeholder="`${$t('user.first_name') +' '+ $t('cyrill_compress')}`"
                                                v-model="newClient.attributes.first_name.kirill"
                                                @input="translateLatin('first_name', $event)"/>
                                </ValidationProvider>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="assignee-item">
                                <div class="client__details_info_card">
                                    <label>{{ $t('user.second_name') }}</label>
                                    <b-form-input disabled :value="nameDivide(oldClient.attributes.middle_name)"/>
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
                                    <base-input :class="{'error' : errors[0]}" class="client__details_info_card mr-2"
                                                :label="true"
                                                :placeholder="`${$t('user.second_name') +' '+ $t('lotin_compress')}`"
                                                v-model="newClient.attributes.last_name.lotin"
                                                @input="translateCyrillic('last_name', $event)"/>
                                </ValidationProvider>
                                <ValidationProvider
                                    rules="required|min:2"
                                    class="cell"
                                    :name="`${$t('user.second_name') +' '+ $t('cyrill_compress')}`"
                                    v-slot="{errors}"
                                >
                                    <base-input :class="{'error' : errors[0]}" class="client__details_info_card"
                                                :label="true"
                                                :placeholder="`${$t('user.second_name') +' '+ $t('cyrill_compress')}`"
                                                v-model="newClient.attributes.last_name.kirill"
                                                @input="translateLatin('last_name', $event)"/>
                                </ValidationProvider>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-6">
                            <div class="assignee-item">
                                <div class="client__details_info_card">
                                    <label>{{ $t('apartments.agree.issued_by_whom') }}</label>
                                    <b-form-input disabled :value="oldClient.attributes['passport_issued_by']"/>
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
                                        v-model="newClient.attributes['passport_issued_by']"/>
                                </ValidationProvider>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="assignee-item">
                                <div class="client__details_info_card ">
                                    <label>{{ $t('apartments.agree.date_of_issue') }}</label>
                                    <b-form-input disabled
                                                  :value="checkDate(oldClient.attributes['passport_issued_date'])"/>
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
                                        :default-value="newClient.attributes.passport_issued_date"
                                        :placeholder="$t('apartments.agree.date_of_issue')"
                                        v-model="newClient.attributes.passport_issued_date"
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
                                    <b-form-input disabled :value="checkDate(oldClient.attributes['date_of_birth'])"/>
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
                                        :default-value="newClient.attributes.date_of_birth"
                                        :placeholder="$t('birth_day')"
                                        v-model="newClient.attributes.date_of_birth"
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
                                    <label>{{ $t('nation') }}</label>
                                    <b-form-input disabled :value="checkCountry(oldClient.attributes.country)"/>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="assignee-item">
                                <ValidationProvider
                                    rules="required"
                                    class="cell"
                                    :name="$t('nation')"
                                    v-slot="{errors}"
                                >
                                    <x-form-select
                                        class="select"
                                        :error="!!errors[0]"
                                        v-model="newClient.attributes.country_id"
                                        :options="nationList"
                                        :placeholder="$t('nation')"
                                        :multilingual="true"
                                    />
                                </ValidationProvider>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="assignee-item">
                                <div class="client__details_info_card ">
                                    <label>{{ $t('number') }} ({{ $t('main_number') }})</label>
                                    <b-form-input disabled :value="phone(oldClient.phones[0].phone)"/>
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
                                                v-model="newClient.phones[0].phone"/>
                                </ValidationProvider>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="assignee-item">
                                <div class="client__details_info_card ">
                                    <label>{{ $t('number') }} ({{ $t('extra') }})</label>
                                    <b-form-input disabled :value="phone(oldClient.phones[1].phone)"/>
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
                                        v-model="newClient.phones[1].phone"
                                    />
                                </ValidationProvider>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="assignee-item">
                                <div class="client__details_info_card ">
                                    <label>{{ $t('language') }} </label>
                                    <b-form-input disabled :value="checkLang(oldClient['language'])"/>
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
                                    <x-form-select
                                        class="select"
                                        :error="!!errors[0]"
                                        v-model="newClient.language"
                                        :options="languages"
                                        :placeholder="$t('clients.language')"
                                    />
                                </ValidationProvider>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="assignee-item">
                                <div class="client__details_info_card ">
                                    <label>{{ $t('client_type') }}</label>
                                    <b-form-input disabled :value="checkClientType(oldClient.client_type)"/>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="assignee-item">
                                <ValidationProvider
                                    rules="required"
                                    class="cell"
                                    :name="`${$t('client_type')}`"
                                    v-slot="{errors}"
                                >
                                    <x-form-select
                                        v-if="clientTypesList.length"
                                        class="select"
                                        :error="!!errors[0]"
                                        value-field="id"
                                        text-field="name"
                                        :multilingual="true"
                                        v-model="newClient.client_type_id"
                                        :options="clientTypesList"
                                        :placeholder="$t('client_type')"
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

                                <ValidationProvider
                                    rules="required"
                                    class="cell"
                                    :name="`${$t('reason_recontract')}`"
                                    v-slot="{errors}"
                                >
                                    <x-form-select
                                        class="select"
                                        :error="!!errors[0]"
                                        v-model="contract.reorder_type_id"
                                        :options="types"
                                        :placeholder="$t('reason_recontract')"
                                        :multilingual="true"
                                    />
                                </ValidationProvider>


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
    </div>
</template>

<script>

import BaseButton from "@/components/Reusable/BaseButton";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseInput from "@/components/Reusable/BaseInput";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseSelect from "@/components/Reusable/BaseSelect";
import api from "@/services/api";
import {formatDateWithDot, phonePrettier} from "@/util/reusable";
import {XFormSelect} from "@/components/ui-components/form-select";
import AppHeader from "@/components/Header/AppHeader.vue";

export default {
    name: "ReContract",
    components: {
        BaseArrowLeftIcon,
        BaseInput,
        BaseButton,
        BaseArrowRightIcon,
        BaseDatePicker,
        BaseSelect,
        XFormSelect,
        AppHeader
    },

    data() {
        return {
            tabIndex: 0,
            tabBtnText: 'next',
            oldClient: {},
            newClient: {
                attributes: {
                    first_name: {
                        lotin: '',
                        kirill: '',
                    },
                    middle_name: {
                        lotin: '',
                        kirill: '',
                    },
                    last_name: {
                        lotin: '',
                        kirill: '',
                    },
                    country_id: null,
                    date_of_birth: null,
                    passport_series: null,
                    passport_issued_by: null,
                    passport_issued_date: null,
                },
                client_type_id: null,
                email: '',
                phones: [
                    {id: null, phone: null},
                    {id: null, phone: null}
                ],
                language: 'uz',
                subject: 'physical',
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
            nationList: [],
            clientTypesList: [],
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

    async mounted() {
        await this.fetchOldClient()
        await this.getCountriesList()
        await this.getClientTypesList()
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
    computed: {
        clientTypeOptions() {
            return this.clientTypesList.map(({name, id}) => ({
                text: name[this.$i18n.locale],
                value: id
            }))
        }
    },

    methods: {
        async getClientTypesList() {
            try {
                const {data: clientTypesList} = await api.settingsV2.getClientTypes()
                this.clientTypesList = clientTypesList
            } catch (e) {
                this.toastedWithErrorCode(e)
            }
        },
        async getCountriesList() {
            try {
                const {data: countriesList} = await api.settingsV2.fetchCountries()
                this.nationList = countriesList.map(cty => (
                    {
                        value: cty.id,
                        text: cty.name.uz,
                    }
                ))
            } catch (e) {
                this.toastedWithErrorCode(e)
            }
        },
        checkLang(item) {
            let langName = null
            this.languages.forEach(lang => {
                if (lang.value === item) {
                    langName = lang.text
                }
            })
            return langName
        },
        checkDate(item) {
            return formatDateWithDot(item)
        },
        checkClientType(item) {
            return item.name[localStorage.locale]
        },
        checkCountry(item) {
            return item.name[localStorage.locale]
        },
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
                            attributes: {
                                first_name: data.first_name ?? {
                                    lotin: null,
                                    kirill: null,
                                },
                                last_name: data.last_name ?? {
                                    lotin: null,
                                    kirill: null,
                                },
                                middle_name: data.middle_name ?? {
                                    lotin: null,
                                    kirill: null,
                                },
                                country_id: data.attributes.country,
                                passport_issued_by: data.attributes.passport_issued_by,
                                passport_issued_date: data.attributes.passport_issued_date,
                                date_of_birth: data.attributes.date_of_birth,
                                passport_series: data.attributes.passport_series,
                            },
                            language: data.language,
                            phones: [
                                {
                                    id: data.phones[0].id,
                                    phone: this.phone(data.phones[0].phone),
                                },
                                {
                                    id: data.phones[0].id,
                                    phone: this.phone(data.phones[1].phone),
                                },
                            ],
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
                        if (!this.newClient.attributes.first_name.kirill) {
                            this.newClient.attributes.first_name.kirill = this.symbolLatinToCyrillic(event);
                        }
                        break;
                    case 'last_name':
                        if (!this.newClient.attributes.last_name.kirill) {
                            this.newClient.attributes.last_name.kirill = this.symbolLatinToCyrillic(event);
                        }
                        break;
                    case 'second_name':
                        if (!this.newClient.attributes.second_name.kirill) {
                            this.newClient.attributes.second_name.kirill = this.symbolLatinToCyrillic(event);
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
                        if (!this.newClient.attributes.first_name.lotin) {
                            this.newClient.attributes.first_name.lotin = this.symbolCyrillicToLatin(event);
                        }
                        break;
                    case 'last_name':
                        if (!this.newClient.attributes.last_name.lotin) {
                            this.newClient.attributes.last_name.lotin = this.symbolCyrillicToLatin(event);
                        }
                        break;
                    case 'second_name':
                        if (!this.newClient.attributes.second_name.lotin) {
                            this.newClient.attributes.second_name.lotin = this.symbolCyrillicToLatin(event);
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
                this.types = res.data.types.map((item) => {
                    return {
                        value: item.id,
                        text: item.name[localStorage.locale]
                    }
                })
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
            const data = {
                ...this.newClient,
                other_phone,
                phone,
            }

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
                if (error.response.status === 406) {
                    this.$toasted.show(error.response.data.message, {
                        type: 'error'
                    })
                    this.client_id = ''
                    this.$router.push({name: 'contracts-view', params: {id: this.$route.params.id}})
                }
                this.$toasted.show(error.response.data.message, {
                    type: 'error'
                })
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
        .select {
            max-height: 56px;
            margin: 1.25rem auto
        }

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

</style>