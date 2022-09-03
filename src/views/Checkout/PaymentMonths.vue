<template>
    <div class="payments-list">
        <b-table
            class="table__list font-inter"
            thead-tr-class="row__head__bottom-border"
            tbody-tr-class="row__body__bottom-border"
            sticky-header
            borderless
            responsive
            :items="months"
            :fields="fields"
            show-empty
            :empty-text="$t('no_data')"
        >
            <template class="header_label" #head(name)="data">
                <span>
                  {{ data.label }}
                </span>
            </template>

            <template #cell(month)="data">
                {{ formatDate(data.item.month) }}
            </template>

            <template #cell(edit)="data">
                {{ data.item.edit }}
            </template>

<!--            <template #cell(amount)="data">-->
<!--                {{ data.item.amount }}-->
<!--            </template>-->

            <!--   ACTION   -->
            <template #cell(actions)="data">
                <div class="action-buttons">
                    <BaseButton
                        text=''
                        class="violet rounded-circle"
                        @click="editSelectedPayment(data.item)"
                    >
                        <template #right-icon>
                            <BaseEditIcon fill="var(--white)"/>
                        </template>
                    </BaseButton>
                    <BaseButton
                        text=''
                        class="red rounded-circle"
                        @click="deleteInitialPayment(data.item)"
                    >
                        <template #right-icon>
                            <BaseDeleteIcon fill="var(--white)"/>
                        </template>
                    </BaseButton>
                    <BaseButton
                        text=''
                        class="green rounded-circle"
                        @click="addInitialPayment(data.item)"
                    >
                        <template #right-icon>
                            <BasePlusIcon fill="var(--white)"/>
                        </template>
                    </BaseButton>
                </div>
            </template>
        </b-table>
    </div>
</template>

<script>
import {formatDateWithDot, formatToPrice} from "@/util/reusable";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseEditIcon from "@/components/icons/BaseEditIcon";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";

export default {
    name: "PaymentMonths",
    components: {
        BaseDeleteIcon,
        BasePlusIcon,
        BaseButton,
        BaseEditIcon
    },
    data() {
        return {
            detailsField: [
                {
                    key: "bank_name",
                    label: this.$t("companies.bank_name"),
                },
                {
                    key: "payment_account",
                    label: this.$t("companies.payment_account"),
                },
                {
                    key: "inn",
                    label: this.$t("companies.inn"),
                },
                {
                    key: "mfo",
                    label: this.$t("companies.mfo"),
                },
                {
                    key: "is_primary",
                    label: "",
                }
            ],
            months: [
                {
                    amount: 14616055.35,
                    edit: false,
                    edited: true,
                    month: "Wed Aug 31 2022 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Fri Sep 30 2022 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Mon Oct 31 2022 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Wed Nov 30 2022 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Sat Dec 31 2022 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Tue Jan 31 2023 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Tue Feb 28 2023 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Fri Mar 31 2023 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Sun Apr 30 2023 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Wed May 31 2023 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Fri Jun 30 2023 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Mon Jul 31 2023 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Thu Aug 31 2023 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Sat Sep 30 2023 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Tue Oct 31 2023 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Thu Nov 30 2023 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Sun Dec 31 2023 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Wed Jan 31 2024 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Thu Feb 29 2024 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }, {
                    amount: 14616055.35,
                    edit: false,
                    edited: false,
                    month: "Sun Mar 31 2024 00:00:00 GMT+0500 (Uzbekistan Standard Time)"
                }
            ],
        }
    },
    computed: {
        fields() {
            return [
                {
                    key: "month",
                    label: this.$t("companies.number"),
                },
                {
                    key: "edit",
                    label: this.$t("companies.name"),
                    sortable: true
                },
                {
                    key: "amount",
                    label: this.$t("companies.phone"),
                    formatter: (value) => formatToPrice(value, 2),
                },
                {
                    key: "actions",
                    label: this.$t("companies.actions"),
                },
            ]
        },
    },
    methods: {
        formatDate(date) {
            return formatDateWithDot(date)
        },
        editSelectedPayment(payment) {
            console.log(payment, 'payment');
        },
        addInitialPayment(payment) {
            console.log(payment, 'payment');
        },
        deleteInitialPayment(payment) {
            console.log(payment, 'payment');
        }
    }
}
</script>

<style lang="scss" scoped>

.payments-list {
    margin-bottom: 3rem;
}

::v-deep .row__head__bottom-border {
    border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .row__body__bottom-border:not(:last-child) {
    border-bottom: 2px solid var(--gray-200) !important;
}


::v-deep .table__list {
    min-height: 250px;
    max-height: none;

    table {
        color: var(--gray-600);

        thead tr th {
            font-family: CraftworkSans, serif;
            font-weight: 900;
            font-size: 14px;
            line-height: 14px;
            letter-spacing: 1px;
            color: var(--gray-400) !important;
            padding: 1.125rem 1rem;
            vertical-align: middle;
        }

        td {
            font-family: Inter, sans-serif;
            cursor: pointer;
            vertical-align: middle;
            padding: 21px 16px;
            font-size: 1rem;
            line-height: 22px;
            font-weight: 600;
            color: var(--gray-600);
        }
    }


    .table.b-table[aria-busy=true] {
        opacity: 1 !important;
    }
}


::v-deep .table.b-table > thead > tr > [aria-sort="none"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="none"] {
    background-position: right calc(2rem / 2) center !important;
    //background-position: right !important;
    padding-right: 20px;
}

::v-deep .table.b-table > thead > tr > [aria-sort=ascending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=ascending] {
    background-position: right calc(2rem / 2) center !important;
    background-size: 20px;
    background-image: url("../../assets/icons/icon-arrow-down.svg") !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort=descending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=descending] {
    background-position: right calc(2rem / 2) center !important;
    background-size: 20px;
    background-image: url("../../assets/icons/icon-arrow-up.svg") !important;
}


.action-buttons {
    display: flex;
    justify-content: flex-end;
    column-gap: 1rem;

    .base__button {
        width: 32px;
        height: 32px;
        padding: .25rem !important;


        ::v-deep .right__icon {
            margin: 0 !important;
        }

        svg {
            width: 18px;
            height: 18px;
        }
    }
}

</style>