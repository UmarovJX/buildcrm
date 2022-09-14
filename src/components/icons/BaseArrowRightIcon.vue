<template>
    <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9.20252 5C9.50902 5 9.81712 5.12105 10.0514 5.36315L15.647 11.1172C15.8732 11.351 16 11.6677 16 11.9994C16 12.3294 15.8732 12.6461 15.647 12.8799L10.0514 18.6373C9.58123 19.1215 8.8206 19.1215 8.35043 18.6339C7.88186 18.1464 7.88346 17.3588 8.35364 16.8746L13.0923 11.9994L8.35364 7.12419C7.88346 6.63999 7.88186 5.85399 8.35043 5.36647C8.58471 5.12105 8.89442 5 9.20252 5Z"
            :fill="fill"
        />
    </svg>
</template>
<script>
export default {
    name: "BaseArrowRightIcon",
    props: {
        fill: {
            type: String,
            default: "#9CA3AF"
        },
        width: {
            type: Number,
            default: 24
        },
        height: {
            type: Number,
            default: 24
        }
    },
    computed: {
        viewBox() {
            return `0 0 ${this.height} ${this.width}`
        }
    }
}
</script>