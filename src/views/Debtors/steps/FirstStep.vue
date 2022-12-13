<template>
    <div>
        <!--  MAIN NAVIGATION  -->
        <ValidationObserver ref="type-validation" class="main__row">
            <b-table
                :fields="typeFields"
                :items="fileFields"
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

                <template #cell(field)="data">
                    <span>
                        {{ $t(`${data.item.field}`) }}
                    </span>
                </template>

                <template #cell(type)="data">
                    <ValidationProvider
                        v-slot="{ errors }"
                        rules="required"
                        class="cell"
                        :name="$t(`${data.item.field}`)"
                    >
                        <k-form-select class="w-100"
                                       v-model="data.item.type"
                                       :options="options"
                                       :placeholder="iTranslate(data.item.field)"
                        />
                        <span class="error__provider" v-if="errors[0]">
                          {{ errors[0] }}
                        </span>
                    </ValidationProvider>
                </template>
            </b-table>
        </ValidationObserver>
    </div>
</template>

<script>
import KFormSelect from "@/components/ui-components/form-select/FormSelect";
import {mapGetters} from "vuex";

export default {
    name: "FirstStep",
    components: {
        KFormSelect,
    },
    data() {
        return {
            fileFields: [
                {
                    field: 'contracts.table.contract',
                    type: null,
                    default: 'contract'
                },
                {
                    field: 'sum',
                    type: null,
                    default: 'amount'
                },
                {
                    field: 'date',
                    type: null,
                    default: 'date'
                },
                {
                    field: 'contracts.comment',
                    type: null,
                    default: 'comment'
                },
                {
                    field: 'payment_type',
                    type: null,
                    default: 'payment_type'
                },
                {
                    field: 'contracts.view.payment_type',
                    type: null,
                    default: 'type'
                }
            ],
            typeFields: [
                {
                    key: 'field',
                    label: 'debtors.property',
                    thClass: 'theadKey',
                    tdClass: 'tbodyKey',
                },
                {
                    key: 'type',
                    label: 'debtors.file',
                    thClass: 'theadValue',
                    tdClass: 'tbodyValue',
                }
            ],
            options: [],
        }
    },
    computed: {
        ...mapGetters({
            getDebtorsSheets: 'getDebtorsSheets'
        }),

    },
    created() {
        this.setupOptions()
    },
    methods: {
        setupOptions() {
            const {rows} = this.getDebtorsSheets
            this.options = rows[0].map((item) => {
                return {
                    value: item,
                    text: item
                }
            })
        },
        getContractNumbers() {
            const contractFieldName = this.fileFields[0].type
            let debtorsSheets = this.getDebtorsSheets
            let contractsList = []

            if (debtorsSheets.rows && debtorsSheets.rows.length) {
                debtorsSheets = debtorsSheets.rows.slice(1)
                debtorsSheets.map((item, index) => {

                    Object.entries(item).forEach(([key, value]) => {
                        if (key === contractFieldName || key === 'contract') {
                            contractsList = [...contractsList, value]
                        }
                    })

                    this.fileFields.forEach((field) => {
                        if (debtorsSheets[index][`${field.default}`]) {
                            debtorsSheets[index][`${field.default}`] = debtorsSheets[index][`${field.type}`]
                            delete debtorsSheets[index][`${field.type}`]
                        }
                    })

                })
            }
            return contractsList
        },
        async validateFirstStep() {
            return await this.$refs['type-validation'].validate()
        },
        iTranslate(text) {
            return this.$t(`${text}`)
        },
    }

}
</script>

<style scoped>
.error__provider {
    color: red;
    font-size: 12px;
}
</style>