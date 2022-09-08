<template>
    <div class="basket" :class="[apartmentCount?'':'d-none']">
        <p>
            Убранные квартиры: {{ apartmentCount }}
        </p>
        <base-button @click="returnApartment" design="violet500" text="Вернуть все квартиры"/>
    </div>
</template>

<script>
import BaseButton from "@/components/Reusable/BaseButton";

export default {
    name: "TrashBasket",
    components: {
        BaseButton
    },

    props: {
        apartmentCount: {
            type: Number,
            default: 0
        }
    },
    methods: {
        returnApartment() {
            this.$emit('return-apartment')
        }
    }

}
</script>


<style lang="scss" scoped>
.basket {
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    width: calc(100% - 92px);
    margin: 0 auto -2rem;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 2rem 2rem 0 0;
    padding: 12px 32px;
    z-index: 999;
    animation: fade-top .5s linear;
    background-color: var(--violet-600);

    .violet500 {
        background-color: var(--violet-500);
        color: var(--white);
    }

    p {
        margin: 0;
        padding: 0;
        color: var(--white);
        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    @keyframes fade-top {
        0% {
            opacity: 0;
            transform: rotateX(90deg);
            bottom: -10px;
        }
        100% {
            opacity: 1;
            transform: rotateX(0);
            bottom: 0;
        }
    }
}


</style>