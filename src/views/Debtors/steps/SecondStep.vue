<template>
    <div>

        <ValidationObserver ref="contract-validation" class="main__row">
            <b-tabs v-model="tabIndex" card class="custom-tab">
                <template #tabs-start>
                    <div class="bottom__line"></div>
                </template>

                <b-tab>

                    <template #title>
                        <div class="custom-title">
                            {{ $t('found') }}
                            <span>{{ foundItems.length }}</span>
                        </div>
                    </template>

                    <!--  FILE CONTRACTS  -->


                    <b-table
                        :fields="foundFields"
                        :items="foundItems"
                        class="fixed-table"
                        :empty-text="$t('no_data')"
                        thead-tr-class="row__head__bottom-border"
                        tbody-tr-class="row__body__bottom-border"
                        borderless
                        fixed
                    >

                        <template #empty>
                            <span v-if="foundItems">
                                {{ $t('no_data') }}
                            </span>
                        </template>

                        <template #head()="data">
                            <span>{{ $t(`${data.label}`) }}</span>
                        </template>

                        <template #cell(key)="data">
                            <span>
                                {{ data.item.key }}
                            </span>
                        </template>


                        <template #cell(value)="data">
                            <span>
                                {{ data.item.value.alias || $t('no') }}
                            </span>
                        </template>


                    </b-table>

                </b-tab>

                <b-tab>

                    <template #title>
                        <div class="custom-title">
                            {{ $t('not_found') }}
                            <span>{{ notFoundItems.length }}</span>
                        </div>
                    </template>

                    <!--  SYSTEM CONTRACTS -->
                    <b-table
                        :fields="notFoundFields"
                        :items="notFoundItems"
                        class="fixed-table"
                        :empty-text="$t('no_data')"
                        thead-tr-class="row__head__bottom-border"
                        tbody-tr-class="row__body__bottom-border"
                        borderless
                        fixed
                    >

                        <template #head()="data">
                            <span>{{ $t(`${data.label}`) }}</span>
                        </template>

                        <template #cell(key)="data">
                            <span>
                                {{ data.item.key }}
                            </span>
                        </template>

                        <template #cell(value)="data">
                            <ValidationProvider v-slot="{ errors }" rules="required" :name="$t('contracts.name')"
                                                class="cell position-relative">
                                <v-select
                                    :options="data.item.option"
                                    :filterable="false"
                                    label="contract"
                                    v-model="data.item.value.contract"
                                    @open="openListId = data.item.key"
                                    @search="searchContract(data.item)"
                                    @input="selectOptionSystem(data.item.key,$event)"
                                />
                            </ValidationProvider>
                        </template>

                    </b-table>

                </b-tab>
            </b-tabs>
        </ValidationObserver>

    </div>
</template>

<script>
// import XFormSelect from "@/components/ui-components/form-select/FormSelect";
import api from "@/services/api";
import BaseInput from "@/components/Reusable/BaseInput";
import {mapGetters} from "vuex";

import 'vue-select/dist/vue-select.css';


export default {
    name: "SecondStep",
    components: {
        BaseInput,
        // XFormSelect,
    },
    props: {
        importData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            foundItems: [],
            notFoundItems: [],
            foundFields: [
                {
                    key: 'key',
                    label: 'debtors.contract_system',
                    thClass: 'theadKey',
                    tdClass: 'tbodyKey',
                },
                {
                    key: 'value',
                    label: 'debtors.alias_system',
                    thClass: 'theadValue',
                    tdClass: 'tbodyValue',
                }
            ],
            notFoundFields: [
                {
                    key: 'key',
                    label: 'debtors.contract_file',
                    thClass: 'theadKey',
                    tdClass: 'tbodyKey',
                },
                {
                    key: 'value',
                    label: 'debtors.contract_system',
                    thClass: 'theadValue',
                    tdClass: 'tbodyValue',
                },
            ],
            options: [],
            tabIndex: 0,
            openListId: null,
            selected: null,
            listForCreate: [],
            allList: []

        }
    },
    computed: {
        ...mapGetters({
            getDebtorsSheets: 'getDebtorsSheets'
        }),
        debtorsSheet() {
            if (this.getDebtorsSheets.rows) {
                return this.getDebtorsSheets.rows.slice(1)
            }
            return []
        }
    },

    created() {
        this.setupOptions()
    },
    methods: {
        selectOptionSystem(itemKey, option) {
            this.notFoundItems.forEach((item, index) => {
                if (item.key === itemKey) {
                    this.notFoundItems[index] = {
                        key: item.key,
                        option: [],
                        value: {
                            alias: item.key,
                            uuid: option.uuid,
                            contract: option.contract
                        }
                    }
                }
            })
            this.openListId = null
        },
        setupOptions() {
            this.foundItems = this.importData.found.map((item) => {
                return {
                    key: item.contract_number,
                    value: {
                        alias: item.alias,
                        contract: item.contract_number,
                        uuid: item.uuid
                    }
                }
            })
            this.notFoundItems = this.importData.not_found.map((item) => {
                return {
                    key: item,
                    option: [],
                    value: {
                        alias: null,
                        contract: null,
                        uuid: null
                    }
                }
            })
        },
        searchContract(item) {
            const uuid = item.key
            const params = {
                contract: item.value.contract
            }
            api.debtorsV2.searchContract(params).then((res) => {
                this.openListId = uuid
                this.notFoundItems.forEach((fItem, index) => {
                    if (fItem && fItem.key === uuid) {
                        this.notFoundItems[index].option = res.data.map((item) => {
                                return {
                                    alias: item.alias || null,
                                    contract: item.contract_number || null,
                                    uuid: item.uuid || null
                                }
                            }
                        )
                    }
                })
            }).catch(err => {
                return err
            })
        },
        getContractNumbers() {
            const contractFieldName = this.foundItems[0].type
            let contractsList = []
            if (this.debtorsSheet.length) {
                this.debtorsSheet.rows.map(item => {
                    for (const [key, value] of Object.entries(item)) {
                        if (key === contractFieldName) {
                            contractsList = [...contractsList, value]
                        }
                    }
                })
            }
            return contractsList
        },
        async validateSecondStep() {
            let createAliases = []
            let updateAliases = []
            let {allList} = this

            if (this.foundItems && this.foundItems.length) {
                this.foundItems.forEach((item) => {
                    updateAliases = [...updateAliases, item.value]
                })
            }

            if (this.notFoundItems && this.notFoundItems.length) {
                this.notFoundItems.forEach((item) => {
                    if (item.value && item.value.uuid) {
                        createAliases = [...createAliases, item.value]
                    }
                })
            }

            if (createAliases && createAliases.length) {
                const createBody = {
                    aliases: createAliases
                }
                await api.debtorsV2.createAliases(createBody).then(() => {
                    allList = [...allList, ...createAliases]
                }).catch((error) => {
                    this.toastedWithErrorCode(error);
                })

            }

            allList = [...allList, ...updateAliases]


            allList.forEach((item, index) => {
                this.debtorsSheet.forEach((sheet) => {
                    if (item.alias === sheet.contract || item.contract === sheet.contract) {
                        allList[`${index}`] = Object.assign(allList[`${index}`], sheet)
                    }
                })

            })

            await this.$emit('all-debtors', allList)
        },
        iTranslate(text) {
            return this.$t(`${text}`)
        },


    }

}
</script>

<style lang="sass" scoped>
.error__provider
    color: red
    font-size: 12px


.select-list
    position: absolute
    display: flex
    flex-direction: column
    align-items: center
    height: 500px
    background-color: #fff
    overflow-y: auto
    z-index: 3


    &__item
        display: flex
        padding: 4px 8px
        height: 40px


::v-deep .custom-tab
    margin-top: 3rem


    .bottom__line
        display: flex
        height: 8px
        width: 100%
        position: absolute
        bottom: 0
        left: 0
        border-radius: 1rem 1rem 0 0
        background-color: var(--gray-100)

    .card-header
        position: relative
        padding: 0
        background-color: transparent
        margin: 0
        border-bottom: none
        margin-bottom: 2rem


    .tab-content
        position: relative
    //padding-top: 12px

    .card-body
        padding: 0

    .card-header-tabs
        margin: 0

    .custom-title
        display: flex
        align-items: center
        justify-content: center
        column-gap: .5rem
        font-weight: 600
        font-size: 16px
        line-height: 22px
        color: var(--gray-600)

        span
            display: flex
            justify-content: center
            align-items: center
            height: 30px
            padding: .25rem .5rem
            border-radius: 2rem
            background-color: var(--gray-100)
            color: var(--gray-400)

    .nav-tabs
        display: flex
        flex-wrap: nowrap
        column-gap: .5rem
        position: relative

        &:after
            //content: ''
            height: 8px
            width: 100%
            position: absolute
            bottom: 0
            left: 0
            background-color: var(--gray-100)

        .nav-item
            z-index: 2

            .active
                .custom-title
                    color: var(--violet-600)

                    span
                        background-color: var(--violet-100)
                        color: var(--violet-600)


        .nav-link
            display: flex
            justify-content: center
            align-items: center
            border: none
            font-weight: 600
            font-size: 16px
            line-height: 22px
            padding: 0 .5rem 1.5rem
            color: var(--gray-600)

            &.active
                position: relative
                color: var(--violet-600)


                &:after
                    content: ''
                    height: 8px
                    width: 100%
                    position: absolute
                    bottom: 0
                    left: 0
                    border-radius: 1rem 1rem 0 0
                    background-color: var(--violet-600)
                    z-index: 3


</style>