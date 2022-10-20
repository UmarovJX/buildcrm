<template>
    <div v-if="haveClient">
        <div class="client__details col-12 px-0">
            <b-form class="client__details_info">
                <div class="d-flex">
                    <h3 class="client__details__title mr-5">{{ $t('main') }}</h3>
                    <h3 class="client__details__title">{{ $t('passport') }}</h3>
                </div>

                <div class="d-flex">
                    <div class="client__details_info_card mr-5">
                        <label for="firstname">{{ $t('fio') }}</label>
                        <b-form-input disabled :value="getClientName(client)" id="firstname"/>
                    </div>
                    <div class="client__details_info_card">
                        <label for="birthdate">{{ $t('birth_day') }}</label>
                        <b-form-input disabled :value="datePrettier(client.birth_day)" id="birthdate"/>
                    </div>
                </div>

                <div class="d-flex">
                    <div class="client__details_info_card mr-5">
                        <label for="phone">{{ $t('phone') }} ({{ $t('main') }})</label>
                        <b-form-input disabled :value="formattingPhone(client.phone)" id="phone"/>
                    </div>
                    <div class="client__details_info_card">
                        <label for="series">{{ $t('series') }}</label>
                        <b-form-input disabled :value="client.passport_series" id="series"/>
                    </div>
                </div>

                <div class="d-flex">
                    <div class="client__details_info_card mr-5">
                        <label for="second_number">{{ $t('phone') }} ({{ $t('extra') }})</label>
                        <b-form-input disabled :value="formattingPhone(client.other_phone)" id="second_number"/>
                    </div>
                    <div class="client__details_info_card">
                        <label for="date_of_given_place">{{ $t('given') }}</label>
                        <b-form-input disabled :value="client.issued_by_whom" id="date_of_given_place"/>
                    </div>
                </div>

                <div class="d-flex">
                    <div class="client__details_info_card mr-5" style="padding-right: 0;">
                        <label for="client_type">{{ $t('client_type') }}</label>
                        <k-form-select
                            v-if="permissionClientType"
                            :label="false"
                            :value="client.friends"
                            :disabled="!(permissionClientType)"
                            @change="changeClientType"
                        >
                            <k-form-select-option :option="{value:false,text:$t('unfamiliar')}"/>
                            <k-form-select-option :option="{value:true,text:$t('familiar')}"/>
                        </k-form-select>
                    </div>
                    <div class="client__details_info_card">
                        <label for="date_of_issue">{{ $t('given_date') }}</label>
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
import {mapGetters} from "vuex";
import ContractsPermission from "@/permission/contract";
import {KFormSelect, KFormSelectOption} from "@/components/ui-components/form-select";

export default {
    name: "TabClientDetails",
    components: {
        KFormSelect,
        KFormSelectOption
    },
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
        ...mapGetters({
            permission: 'getPermission'
        }),
        haveClient() {
            return Object.keys(this.client).length
        },
        permissionClientType() {
            return ContractsPermission.getContractsClientTypePermission()
        },
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
            const {first_name, last_name, second_name} = client
            return this.clientName(last_name, language) + ' ' + this.clientName(first_name, language) + ' ' + this.clientName(second_name, language)
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
        //max-width: 40rem;
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
    padding-top: 1rem;
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
    justify-content: space-between;
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