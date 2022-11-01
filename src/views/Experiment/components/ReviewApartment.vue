<template>
    <div class="apn-result">
        <div class="apn-result__item" v-for="apartment in gtsApartments" :key="apartment.id">
            <section-title :bilingual="true" :title="$t('apartment')+' '+apartment.number" class="km-b-2"/>
            <div class="apn-result__item-content">
                <ch-plan-details :apartment="apartment" :remove="true"/>
                <ch-payment-result :apm="apartment" :result="true" class="pd-payment-result"/>
            </div>
        </div>
        <div class="apn-result__total">
            <p>Итоговая общая цена</p>
            <p>2 160 000 000 сум</p>
        </div>
    </div>
</template>

<script>
import SectionTitle from "@/views/Experiment/elements/SectionTitle";
import {mapGetters} from "vuex";
import ChPaymentResult from "@/views/Experiment/components/PaymentResult";
import ChPlanDetails from "@/views/Experiment/components/PlanDetails";

export default {
    name: "ChReviewApartment",
    components: {
        SectionTitle,
        ChPaymentResult,
        ChPlanDetails,
    },
    computed: {
        ...mapGetters('Experiment', ['gtsApartments'])
    },
}
</script>

<style lang="scss" scoped>
.apn-result {
    display: flex;
    flex-direction: column;
    row-gap: 3rem;

    &__item {
        &-content {
            display: flex;
            column-gap: 3rem;

            .apartment-details-content,
            .pd-payment-result {
                flex-basis: 50%;
            }
        }

    }

    &__total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 3rem 0;
        border-top: 6px dashed var(--gray-200);

        p {
            font-family: CraftworkSans, serif;
            font-style: normal;
            font-weight: 900;
            font-size: 36px;
            line-height: 42px;
            color: var(--violet-700);
            margin-bottom: 0;
        }
    }
}
</style>