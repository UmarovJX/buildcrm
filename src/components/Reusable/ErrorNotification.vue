<template>
    <div class="notification-bar" :class="[value.type,value.visible?'':'d-none']">
        <p>
            {{ value.message }}
        </p>
    </div>
</template>

<script>

export default {
    name: "ErrorNotification",
    props: {
        value: {
            type: Object,
            default: () => {
                return {
                    type: 'success',
                    message: 'Успешно',
                    visible: false
                }
            }
        },
    },
    data() {
        return {
            timeoutId: null
        }
    },
    watch: {
        'value.visible'() {
            this.filterDebounce()
        }
    },

    methods: {
        filterDebounce(debounceDuration = 3000) {
            if (this.timeoutId !== null) {
                clearTimeout(this.timeoutId)
            }
            this.timeoutId = setTimeout(() => {
                return this.$emit('close-bar')
            }, debounceDuration)
        },
    }

}
</script>


<style lang="scss" scoped>
.notification-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0 0 2rem 2rem;
    padding: 20px;
    z-index: 9999;
    animation: fade-top .5s linear;

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
            top: 10px;
        }
        100% {
            opacity: 1;
            transform: rotateX(0);
            top: 0;
        }
    }
}

.success {
    background-color: var(--green-500);
}

.error {
    background-color: var(--red-500);
}


</style>