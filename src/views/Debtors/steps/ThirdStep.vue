<template>
    <div>
        <b-table
            sticky-header
            borderless
            responsive="xl"
            sort-icon-left
            :items="list"
            :fields="fields"
            class="table__list"
            :empty-text="$t('no_data')"
            thead-tr-class="row__head__bottom-border"
            tbody-tr-class="row__body__bottom-border"
            :busy="loading"
        >

            <template #head()="data">
                <span>{{ $t(`${data.label}`) }}</span>
            </template>

            <template #cell(contract)="data">
                <span>{{ data.item.contract_number }} ( {{ data.item.alias.alias }} )</span>
            </template>

            <template #cell(payment_type)="data">
                <span>{{ getPaymentType(data.item.data.payment_type) }}</span>
            </template>

            <template #cell(type)="data">
                <span>{{ getType(data.item.data.type) }}</span>
            </template>


            <!-- INDEX COLUMN -->
            <template #cell(client)="data">
                <span>{{ fullName(data.item.client) }}</span>
            </template>

            <template #cell(date)="data">

                <span>{{ dateFormat(data.item.data.date) }}</span>
            </template>


        </b-table>

    </div>
</template>

<script>
import {formatDateWithDot} from "@/util/reusable";

export default {
    name: "ThirdStep",
    props: {
        list: {
            type: Array,
            required: true
        },
        loading: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            fields: [
                {
                    key: 'contract_number',
                    label: 'contracts.name'
                },
                {
                    key: 'client',
                    label: 'client'
                },
                {
                    key: 'client.phone',
                    label: 'phone'
                },
                {
                    key: 'data.amount',
                    label: 'contracts.view.sum'
                },
                {
                    key: 'payment_type',
                    label: 'contracts.view.payment_type'
                },
                {
                    key: 'type',
                    label: 'contracts.view.type'
                },
                {
                    key: 'date',
                    label: 'contracts.view.payment_date'
                },
                {
                    key: 'data.comment',
                    label: 'contracts.view.comments'
                }
            ],
            pagination: {}
        }
    },
    methods: {
        fullName(client) {
            if (client.first_name && client.last_name && client.second_name) {
                return client.first_name.lotin + ' ' + client.last_name.lotin + ' ' + client.second_name.lotin
            }
            return ''
        },
        dateFormat(date) {
            console.log(date, 'date');
            return formatDateWithDot(date)
        },
        getPaymentType(type) {
            let msg;

            switch (type) {
                case "payme":
                    msg = "Payme";
                    break;
                case "click":
                    msg = "Click";
                    break;
                case "transfer":
                    msg = "Перечисления";
                    break;
                case "other":
                    msg = "Другое";
                    break;
                case "cash":
                    msg = "Наличные";
                    break;
                default:
                    msg = type;
                    break;
            }

            return msg;
        },
        getType(type) {
            let msg;

            switch (type) {
                case "debt":
                case "monthly":
                    msg = "Ежемесячно";
                    break;
                case "manual":
                    msg = "Ручной создано";
                    break;
                default:
                    msg = "Первоначальный взнос";
                    break;
            }

            return msg;
        },
    }

}
</script>

<style lang="scss" scoped>

::v-deep .table__list {
    max-height: none;
    min-height: 70vh;

    table {
        color: var(--gray-600);

        thead tr th {
            font-family: CraftworkSans, serif;
            font-weight: 600;
            line-height: 14px;
            letter-spacing: 1px;
            color: var(--gray-400) !important;
            padding: 1.25rem 1rem;
        }

        td {
            vertical-align: middle;
        }
    }

    .table.b-table[aria-busy=true] {
        opacity: 1 !important;
    }
}

::v-deep .row__head__bottom-border {
    border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .row__body__bottom-border:not(:last-child) {
    border-bottom: 2px solid var(--gray-200) !important;
}


</style>