<template>
    <div>
        <div class="app-tab-content">
            <ValidationObserver ref="client-validation">
                <section class="tab-section">
                    <h3 class="section-title">Детали договора</h3>
                    <div class="section-container">
                        <output-information
                            v-if="order && order.contract_number"
                            property="Номер договора"
                            :value="order.contract_number"
                        >
                            <template #actions>
                                            <span
                                                @click="openEditNumberModal"
                                                class="d-flex align-items-center cursor-pointer"
                                            >
                                              <base-circle-wrapper
                                                  class="d-flex justify-content-center align-items-center edit-icon-wrapper">
                                                <base-edit-icon :width="13.5" :height="13.5" fill="#fff"/>
                                              </base-circle-wrapper>
                                            </span>
                            </template>
                        </output-information>
                        <ValidationProvider
                            :name="$t('create_date')"
                            rules="required"
                            v-slot="{ errors }"
                        >
                            <base-date-picker
                                v-model="client.contract_date"
                                :range="false"
                                class="data-picker"
                                format="DD.MM.YYYY"
                                :error="!!errors[0]"
                                :icon-fill="datePickerIconFill"
                                :placeholder="`${ $t('create_date') }`"
                            />
                        </ValidationProvider>
                    </div>
                </section>

                <section class="tab-section mt-5 mb-5">
                    <h3 class="section-title">Детали клиента</h3>
                    <div class="section-container row-gap-1">
                        <ValidationProvider
                            name="Номер паспорта (напр. AB1234567)"
                            rules="required|min:9"
                            v-slot="{ errors }"
                        >
                            <base-input
                                v-model="client.passport_series"
                                @input="clientDebounce"
                                mask="AA#######"
                                :label="true"
                                :error="!!errors[0]"
                                class="w-100"
                                placeholder="Номер паспорта (напр. AB1234567)"
                            />
                        </ValidationProvider>
                        <ValidationProvider
                            name="Место выдачи паспорта"
                            rules="required"
                            v-slot="{ errors }"
                        >
                            <base-input
                                v-model="client.issued_by_whom"
                                :label="true"
                                :error="!!errors[0]"
                                placeholder="Место выдачи паспорта"
                                class="w-100"
                            />
                        </ValidationProvider>
                        <ValidationProvider
                            name="Дата выдачи паспорта"
                            rules="required"
                            v-slot="{ errors }"
                        >
                            <base-date-picker
                                v-model="client.date_of_issue"
                                :range="false"
                                :error="!!errors[0]"
                                class="data-picker"
                                format="DD.MM.YYYY"
                                placeholder="Дата выдачи паспорта"
                                :icon-fill="datePickerIconFill"
                            />
                        </ValidationProvider>
                        <ValidationProvider
                            name="Дата рождения"
                            rules="required"
                            v-slot="{ errors }"
                        >
                            <base-date-picker
                                v-model="client.birth_day"
                                class="w-100"
                                :range="false"
                                :error="!!errors[0]"
                                format="DD.MM.YYYY"
                                placeholder="Дата рождения"
                                :icon-fill="datePickerIconFill"
                            />
                        </ValidationProvider>
                        <ValidationProvider
                            name="Фамилия (кир.)"
                            rules="required|min:1"
                            v-slot="{ errors }"
                        >
                            <base-input
                                v-model="client.last_name.kirill"
                                :label="true"
                                :error="!!errors[0]"
                                placeholder="Фамилия (кир.)"
                                class="w-100"
                                @input="translateLatin('last_name', $event)"
                            />
                        </ValidationProvider>
                        <ValidationProvider
                            name="Фамилия (лат.)"
                            rules="required|min:1"
                            v-slot="{ errors }"
                        >
                            <base-input
                                v-model="client.last_name.lotin"
                                :label="true"
                                :error="!!errors[0]"
                                placeholder="Фамилия (лат.)"
                                class="w-100"
                                @input="translateCyrillic('last_name', $event)"
                            />
                        </ValidationProvider>
                        <ValidationProvider
                            name="Имя (кир.)"
                            rules="required|min:1"
                            v-slot="{ errors }"
                        >
                            <base-input
                                v-model="client.first_name.kirill"
                                :label="true"
                                :error="!!errors[0]"
                                placeholder="Имя (кир.)"
                                class="w-100"
                                @input="translateLatin('first_name', $event)"
                            />
                        </ValidationProvider>
                        <ValidationProvider
                            name="Имя (лат.)"
                            rules="required|min:1"
                            v-slot="{ errors }"
                        >
                            <base-input
                                v-model="client.first_name.lotin"
                                :label="true"
                                :error="!!errors[0]"
                                placeholder="Имя (лат.)"
                                class="w-100"
                                @input="translateCyrillic('first_name', $event)"
                            />
                        </ValidationProvider>
                        <ValidationProvider
                            name="Отчество (кир.)"
                            rules="required|min:1"
                            v-slot="{ errors }"
                        >
                            <base-input
                                v-model="client.second_name.kirill"
                                :label="true"
                                :error="!!errors[0]"
                                placeholder="Отчество (кир.)"
                                class="w-100"
                                @input="translateLatin('second_name', $event)"
                            />
                        </ValidationProvider>
                        <ValidationProvider
                            name="Отчество (лат.)"
                            rules="required|min:1"
                            v-slot="{ errors }"
                        >
                            <base-input
                                v-model="client.second_name.lotin"
                                :label="true"
                                :error="!!errors[0]"
                                placeholder="Отчество (лат.)"
                                class="w-100"
                                @input="translateCyrillic('second_name', $event)"
                            />
                        </ValidationProvider>
                        <ValidationProvider
                            name="Номер телефона"
                            rules="required|min:12"
                            v-slot="{ errors }"
                        >
                            <base-input
                                v-model="client.phone"
                                :label="true"
                                :error="!!errors[0]"
                                mask="+### ## ### ## ##"
                                placeholder="Номер телефона"
                                class="w-100"
                            />
                        </ValidationProvider>
                        <ValidationProvider
                            name="Дополнительный номер телефона"
                            v-slot="{ errors }"
                        >
                            <base-input
                                v-model="client.other_phone"
                                :label="true"
                                mask="+### ## ### ## ##"
                                placeholder="Дополнительный номер телефона"
                                class="w-100"
                            />
                        </ValidationProvider>
                        <ValidationProvider
                            name="Язык"
                            rules="required"
                            v-slot="{ errors }"
                        >
                            <base-select
                                :label="true"
                                :error="!!errors[0]"
                                :noPlaceholder="true"
                                :options="options"
                                :value="client.language"
                                @change="client.language = $event"
                                placeholder="Язык"
                            />
                        </ValidationProvider>
                        <ValidationProvider
                            name="Тип клиента"
                            rules="required"
                            v-slot="{ errors }"
                        >
                            <base-select
                                :label="true"
                                :error="!!errors[0]"
                                :noPlaceholder="true"
                                :options="clientTypeOption"
                                :value="client.friends"
                                @change="client.friends = $event"
                                placeholder="Тип клиента"
                            />
                        </ValidationProvider>
                    </div>
                </section>
            </ValidationObserver>
        </div>
        <base-modal ref="edit-contract-number" design="auto-height">
            <template #header>
                            <span class="d-flex align-items-center justify-content-between">
                              <!--    TITLE      -->
                              <span class="title">{{ $t('apartments.agree.number') }}</span>
                                <!--   CLOSE    -->
                              <span class="go__back" @click="closeEditNumberModal">
                                <BaseCloseIcon :width="56" :height="56"/>
                              </span>
                            </span>
            </template>

            <template #main>
                <div>
                    <base-input
                        v-model="newContractNumber"
                        :label="true"
                        placeholder="Номер договора"
                        class="w-100"
                    />
                </div>
            </template>
            <template #footer>
                <base-button
                    @click="setNewContractNumber"
                    :disabled="!changedContractNumber"
                    class="violet-gradient w-100"
                    text="Применить"
                />
            </template>
        </base-modal>
    </div>
</template>

<script>
import OutputInformation from "@/components/Elements/Outputs/OutputInformation";
import BaseEditIcon from "@/components/icons/BaseEditIcon";
import BaseCircleWrapper from "@/components/Reusable/BaseCircleWrapper";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import BaseInput from "@/components/Reusable/BaseInput";
import BaseSelect from "@/components/Reusable/BaseSelect";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import BaseModal from "@/components/Reusable/BaseModal";
import api from "@/services/api";
// import {phonePrettier} from "@/util/reusable";

export default {
    name: "DetailsContract",
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
        }
    },
    data() {
        return {
            newContractNumber: '',
            changedContractNumber: false,
            datePickerIconFill: 'var(--violet-600)',
            options: [
                {
                    text: 'UZ',
                    value: 'uz'
                },
                {
                    text: 'RU',
                    value: 'ru'
                }
            ],
            clientTypeOption: [
                {text: 'Незнакомый', value: 'false'},
                {text: 'Знакомый', value: 'true'},
            ],
            validationError: {
                type: '',
                message: '',
                visible: false,
            },
            timeoutId: null,
        }
    },
    watch: {
        newContractNumber(value) {
            this.changedContractNumber = !!(value && value.length && !(value === this.order.contract_number));
        }
    },
    computed: {
        flexCenter() {
            return 'd-flex justify-content-center align-items-center'
        },
        client: {
            get() {
                return this.clientData
            },
            set(value) {
                return this.$emit('set-client', value)
            }
        }
    },
    methods: {
        // phone(value) {
        //     return phonePrettier(value)
        // },
        clientDebounce() {
            if (this.timeoutId !== null) {
                clearTimeout(this.timeoutId)
            }
            this.timeoutId = setTimeout(() => {
                this.getClientByPassport()
            }, 500)
        },
        getClientByPassport() {
            if (this.client.passport_series.length === 9)
                api.clientsV2.fetchClientData(this.client.passport_series)
                    .then(response => {
                        console.log(response, 'response');
                        const newClient = response.data
                        this.client = {...newClient, friends: 'false'}
                    }).catch((error) => {
                    this.client =
                        {
                            first_name: {
                                lotin: "",
                                kirill: "",
                            },
                            last_name: {
                                lotin: "",
                                kirill: "",
                            },
                            second_name: {
                                lotin: "",
                                kirill: "",
                            },
                            passport_series: this.client.passport_series,
                            issued_by_whom: null,
                            date_of_issue: null,
                            language: "uz",
                            friends: 'false',
                            birth_day: null,
                            phone: null,
                            other_phone: null,
                            first_payment_date: null,
                            payment_date: null,
                        }
                    this.toastedWithErrorCode(error);
                })
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
                            this.client.first_name.kirill = this.symbolLatinToCyrillic(event);
                        }
                        break;
                    case 'last_name':
                        if (!this.client.last_name.kirill) {
                            this.client.last_name.kirill = this.symbolLatinToCyrillic(event);
                        }
                        break;
                    case 'second_name':
                        if (!this.client.second_name.kirill) {
                            this.client.second_name.kirill = this.symbolLatinToCyrillic(event);
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
                        if (!this.client.first_name.lotin) {
                            this.client.first_name.lotin = this.symbolCyrillicToLatin(event);
                        }
                        break;
                    case 'last_name':
                        if (!this.client.last_name.lotin) {
                            this.client.last_name.lotin = this.symbolCyrillicToLatin(event);
                        }
                        break;
                    case 'second_name':
                        if (!this.client.second_name.lotin) {
                            this.client.second_name.lotin = this.symbolCyrillicToLatin(event);
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
    }
}
</script>

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

</style>