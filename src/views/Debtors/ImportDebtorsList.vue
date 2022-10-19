<template>
    <div>
        <app-header>
            <template #header-breadcrumb>
                <div v-if="haveConstructorOrder" class="navigation__content">
                    <div class="go__back" @click="backNavigation">
                        <base-arrow-left-icon :width="32" :height="32"/>
                    </div>
                    <div class="breadcrumb__content">
                        <div>
                            {{ $t('debtors.title') }}
                            <base-arrow-right-icon :width="18" :height="18"/>
                            <span>{{ $t('debtors.import_debtors') }}</span>
                        </div>
                        <div class="head">
                            <!--                            {{ file.name }}-->
                            {{ $t('import') }} <span class="file_name"> “{{ fileName }}”</span>
                        </div>
                    </div>
                </div>
            </template>
        </app-header>


        <div>
            <b-tabs
                pills
                v-model="tabIndex"
                content-class="app-tabs-content"
                nav-class="app-tabs-content-header"
            >

                <!--  FIRST TAB    -->
                <b-tab active>
                    <template #title>
                        <div class="app-tab-title">
                            <span class="app-tab-title-number">1</span>
                            <p class="app-tab-title-content">{{ $t('debtors.file_field') }}</p>
                            <div class="app-tab-title-right-icon">
                                <base-right-icon :width="20" :height="20"/>
                            </div>
                        </div>
                    </template>

                    <div>
                        <first-step ref="first-step"></first-step>
                    </div>

                </b-tab>
                <!--  END OF FIRST TAB    -->

                <!--   SECOND TAB   -->
                <b-tab :disabled="stepTwoDisable">
                    <template #title>
                        <div class="app-tab-title">
                            <span class="app-tab-title-number">2</span>
                            <p class="app-tab-title-content">{{ $t('contracts.list_contracts') }}</p>
                            <div class="app-tab-title-right-icon">
                                <base-right-icon :width="20" :height="20"/>
                            </div>
                        </div>
                    </template>

                    <div v-if="tabIndex===1">
                        <second-step ref="second-step" :import-data="importContracts"
                                     @all-debtors="setDebtorsList"></second-step>
                    </div>
                </b-tab>


                <!-- THIRD TAB-->
                <b-tab :disabled="stepThirdDisable">
                    <template #title>
                        <div class="app-tab-title">
                            <span class="app-tab-title-number">3</span>
                            <p class="app-tab-title-content">{{ $t('recheck') }}</p>
                        </div>
                    </template>

                    <div v-if="tabIndex===2">
                        <third-step :list="resultList" :loading="listLoading"></third-step>
                    </div>
                </b-tab>

                <!--   END OF THIRD TAB   -->


                <!--        TABS END -->
                <template #tabs-end>
                    <b-nav-item role="presentation" href="#">
                        <base-button
                            v-if="tabIndex === 2"
                            @click="submitConcludeDebtors"
                            class="violet-gradient"
                            :text="`${ $t('create_agree') }`"
                            :app-loading="appLoading"
                        >
                            <template #right-icon>
                                <base-arrow-right-icon fill="var(--white)"/>
                            </template>
                        </base-button>
                        <base-button
                            v-else
                            :text="`${ $t('next') }`"
                            class="violet-gradient"
                            @click="changeTab"
                        >
                            <template #right-icon>
                                <base-arrow-right-icon fill="var(--white)"/>
                            </template>
                        </base-button>
                    </b-nav-item>
                </template>

            </b-tabs>
        </div>


        <base-modal ref="leave-modal" design="auto-height">
            <template #header>
                <div class="d-flex align-items-center" style="gap:1rem">
                    <div>
                        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.4"
                                  d="M51.3346 27.9996C51.3346 40.8889 40.8883 51.3329 28.0013 51.3329C15.1143 51.3329 4.66797 40.8889 4.66797 27.9996C4.66797 15.1149 15.1143 4.66626 28.0013 4.66626C40.8883 4.66626 51.3346 15.1149 51.3346 27.9996"
                                  fill="#EF4444"/>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M30.3081 29.5574C30.3081 30.7612 29.2661 31.7427 27.988 31.7427C26.71 31.7427 25.668 30.7612 25.668 29.5574V18.5185C25.668 17.3148 26.71 16.3333 27.988 16.3333C29.2661 16.3333 30.3081 17.3148 30.3081 18.5185V29.5574ZM25.6811 37.4814C25.6811 36.2776 26.7178 35.2961 27.9879 35.2961C29.2951 35.2961 30.3345 36.2776 30.3345 37.4814C30.3345 38.6852 29.2951 39.6667 28.0144 39.6667C26.7284 39.6667 25.6811 38.6852 25.6811 37.4814Z"
                                  fill="#EF4444"/>
                        </svg>
                    </div>
                    <div class="title">{{ $t('leave_import') }}</div>
                </div>
            </template>

            <template #main>
                <span v-html="$t('leave_import_text')"/>
            </template>

            <template #footer>
                <div class="d-flex align-items-center" style="gap: 2rem">
                    <base-button
                        @click="cancelLeave"
                        :fixed="true"
                        :text="`${ $t('no_leave') }`"
                    >
                    </base-button>
                    <base-button
                        @click="confirmLeave"
                        :text="`${ $t('yes_leave') }`"
                        :fixed="true"
                        class="violet-gradient"
                    >
                    </base-button>
                </div>
            </template>
        </base-modal>


    </div>
</template>

<script>
import AppHeader from "@/components/Header/AppHeader";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseRightIcon from "@/components/icons/BaseRightIcon";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
// import KFormSelect from "@/components/ui-components/form-select/FormSelect";
import {mapGetters} from "vuex";
import api from "@/services/api";
import FirstStep from "@/views/Debtors/steps/FirstStep";
import SecondStep from "@/views/Debtors/steps/SecondStep";
import ThirdStep from "@/views/Debtors/steps/ThirdStep";
import BaseModal from "@/components/Reusable/BaseModal";

export default {
    name: "ImportDebtorsList",
    components: {
        FirstStep,
        SecondStep,
        ThirdStep,
        // KFormSelect,
        BaseArrowLeftIcon,
        BaseRightIcon,
        BaseArrowRightIcon,
        AppHeader,
        BaseButton,
        BaseModal
    },
    beforeRouteLeave(to, from, next) {
        this.$refs['leave-modal'].openModal()
        this.nextRoute = to.name
        if (this.permissionLeave) {
            next();
        } else {
            next(false);
        }
    },

    data() {
        return {
            tabIndex: 0,
            stepTwoDisable: false,
            stepThirdDisable: false,
            appLoading: false,
            importContracts: {},
            resultList: [
                {
                    "uuid": "277a6359-5680-4a38-9b17-2c259b8b206c",
                    "contract_number": "1SPI22YD",
                    "client": {
                        "uuid": "1c40b9db-a808-4db5-b6cb-a3427ca30488",
                        "first_name": {
                            "lotin": "Ulugbek",
                            "kirill": "Улуғбек"
                        },
                        "last_name": {
                            "lotin": "Tukhtaev",
                            "kirill": "Тухтаев"
                        },
                        "second_name": {
                            "lotin": "Turaxonovich",
                            "kirill": "Турахонович"
                        },
                        "phone": 998901234567,
                        "other_phone": 998903214567
                    },
                    "alias": {
                        "uuid": "277a6359-5680-4a38-9b17-2c259b8b206c",
                        "contract_number": "1SPI22YD",
                        "alias": "1SPI22"
                    }
                }
            ],
            listLoading: false,
            resultDebtors: [],
            permissionLeave: false,
            nextRoute: ''
        }
    },
    computed: {
        ...mapGetters({
            getDebtorsSheets: 'getDebtorsSheets'
        }),
        haveConstructorOrder() {
            return Object.keys(this.getDebtorsSheets).length > 0
        },
        fileName() {
            const debt = this.getDebtorsSheets
            if (debt && debt.file) {
                return this.getDebtorsSheets.file.name
            }
            return ''
        }
    },
    methods: {
        cancelLeave() {
            this.permissionLeave = false
            this.$refs['leave-modal'].closeModal()
        },
        confirmLeave() {
            this.permissionLeave = true
            this.$router.push({name: this.nextRoute})
            this.$refs['leave-modal'].closeModal()
        },
        backNavigation() {
            this.$router.go(-1)
        },
        async submitConcludeDebtors() {
            const body = {
                payments: this.resultDebtors
            }
            await api.debtorsV2.activatePayments(body).then(() => {
                this.permissionLeave = true
                this.$router.push({name: 'debtors'})
            }).catch((err) => {
                return err
            })
        },
        async changeTab() {
            if (this.tabIndex === 0) {
                const typeFieldValidation = await this.$refs['first-step'].validateFirstStep()

                if (typeFieldValidation) {
                    const body = {
                        contracts: this.$refs['first-step'].getContractNumbers()
                    }
                    api.debtorsV2.checkImportDebtors(body).then((res) => {
                        this.validationError = {
                            visible: true,
                            message: 'Успешно',
                            type: "success"
                        }
                        this.importContracts = res.data
                        // this.foundContracts = res.data.found
                        // this.notFoundContracts = res.data.not_found

                        if (this.tabIndex === 0) {
                            this.stepTwoDisable = false
                            setTimeout(() => {
                                this.tabIndex = 1
                            }, 100)
                        }
                    }).catch((err) => {
                        let error = []
                        for (const value of Object.values(err.response.data)) {
                            error = [...error, value]
                        }
                        this.validationError = {
                            visible: true,
                            message: error.join(', '),
                            type: "error"
                        }
                        this.stepTwoDisable = true
                    })
                } else {
                    this.validationError = {
                        visible: true,
                        message: 'Поля, выделенные красным цветом, не заполнены или заполнены неправильно',
                        type: "error"
                    }
                    this.stepTwoDisable = true
                }
            } else if (this.tabIndex === 1) {
                await this.$refs['second-step'].validateSecondStep()
            }

        },
        setDebtorsList(debtors) {
            this.resultDebtors = debtors
            this.listLoading = true
            const body = {
                contracts: debtors
            }
            api.debtorsV2.viewImportList(body).then((res) => {
                this.resultList = res.data
                this.tabIndex = 2
            }).catch((err) => {
                this.resultList = []
                return err
            }).finally(() => {
                this.listLoading = false
            })
        }
    },
}
</script>

<style lang="scss" scoped>

::v-deep .app-tabs-content {
    &-header {
        display: flex;
        align-items: center !important;
        justify-content: flex-start;
        flex-wrap: nowrap;
        margin-bottom: 2rem;
        border-top: 6px solid var(--gray-100);
        border-bottom: 6px solid var(--gray-100);
        padding: 24px 0;

        .nav-item {
            min-width: max-content;

            .nav-link {
                padding: 8px 6px;
            }

            .active {
                background-color: transparent;

                .app-tab-title-number {
                    background-color: var(--violet-100);
                    color: var(--violet-600);
                }

                p {
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

.app-tab-title {
    display: flex;
    align-items: center;
    justify-content: center;

    &-number {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.navigation__content {
    display: flex;
    align-items: center;

    .go__back {
        min-width: 56px;
        width: 56px;
        height: 56px;
        border-radius: 100%;
        background-color: var(--gray-100);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .breadcrumb__content {
        display: inline-flex;
        flex-direction: column;
        margin-left: 1rem;
        font-weight: 600;
        font-size: 14px;
        color: #9CA3AF;
    }

    .head {
        font-size: 24px;
        line-height: 28px;
        color: #4B5563;

        .file_name {
            color: var(--violet-600);
        }
    }
}


.header {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid var(--gray-200);
    font-size: 1rem;

    .row {
        color: var(--gray-400);
        font-family: CraftworkSans, serif;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 3.5rem;
        letter-spacing: 1px;
        text-transform: uppercase;
    }
}

.main__section {
    .main__row {
        color: var(--gray-600);
        font-size: 1.2rem;
        font-family: Inter, serif;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;

        .cell {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--gray-200);

            &__item {
                display: flex;
                justify-content: flex-start;
                width: 100%;
                padding: 1rem 0;
            }
        }
    }
}

::v-deep .fixed-table {
    thead, tbody {
        tr {
            display: flex;
            border-top: 2px solid var(--gray-100);


            th {
                font-family: CraftworkSans, serif;
                font-weight: 900;
                font-size: 12px;
                line-height: 14px;
                color: var(--gray-400);
                letter-spacing: 1px;
                padding: 21px 16px;
            }

            td {
                display: flex;
                align-items: center;
                font-family: Inter, sans-serif;
                font-style: normal;
                font-weight: 600;
                font-size: 16px;
                line-height: 22px;
                color: var(--gray-600);
                padding: .25rem 1rem;
                margin: 18px 0;
                //max-height: 500px;
                //overflow-y: hidden;

                .cell {
                    width: 100%;
                }
            }
        }
    }

    thead tr {
        border-top: none;
    }

    .theadKey, .tbodyKey {
        width: 12rem;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .theadValue, .tbodyValue {
        width: 22rem;
        text-overflow: ellipsis;
        //overflow: hidden;

    }
}

.error__provider {
    color: red;
    font-size: 12px;
}

</style>