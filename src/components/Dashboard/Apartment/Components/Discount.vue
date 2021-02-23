<template>
    <div class="apartment">
        <h6>{{ $t('apartments.view.variant') }}</h6>
        <div class="apartment__variant">
            <div class="apartment__info">
                Предоплата: <span>{{ discount.prepay_from }}%  -  {{ discount.prepay_to }}%</span>
            </div>
            <div class="apartment__info">Скидка: <span>{{ discount.discount }}% - {{ getDiscount() | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}</span></div>
            <div class="apartment__info">
                Первый взнос - <span>{{ getPrepay() | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}</span>
            </div>

            <div class="apartment__info" v-if="getDebt() > 0">
                Ежемесячный: <span>6 месяцев {{ getMonth() | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }} </span>
            </div>

            <div class="apartment__info" v-if="getDebt() > 0">
                Остаток: <span>{{ getDebt() | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}</span>
            </div>

            <div class="apartment__info">Итого: <span>{{ getTotal() | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}</span></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            discount: {},
            apartment: {}
        },

        name: "Discount",

        methods: {
            getPrepay() {
                let total_discount = this.getDiscount();

                let total = this.apartment.price - total_discount;

                return this.discount.prepay_to * total / 100;
            },

            getDiscount() {
                return this.discount.discount * this.apartment.price / 100;
            },

            getMonth() {
                return (this.getTotal() - this.getPrepay()) / 6;
            },

            getDebt() {
                return this.getTotal() - this.getPrepay();
            },

            getTotal() {
                let total_discount = this.getDiscount();

                // let total = price * area;
                let total = this.apartment.price - total_discount;

                return total;
            }
        }
    }
</script>

<style scoped>

</style>
