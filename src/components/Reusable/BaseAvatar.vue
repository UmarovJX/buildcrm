<template>
    <div class="base-avatar" :style="{background: background}">
        <slot name="avatar"></slot>
        <img
            v-if="!hasAvatarSlot"
            :src="imagePath" alt="img"
        />
        <div class="person">
            <p class="full_name">
                <slot name="full_name"></slot>
            </p>
            <p class="full_name" v-if="!hasFullNameSlot">{{ full_name }}</p>
            <p class="role">
                <slot name="role"></slot>
            </p>
            <p class="role" v-if="!hasRoleSlot">{{ role }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "BaseAvatar",
    components: {},
    props: {
        background: {
            type: String,
            required: false,
            default: "#F3F4F6"
        },
        avatar: {
            type: String,
            required: false
        },
        full_name: {
            type: String,
            required: false
        },
        role: {
            type: String,
            required: false
        }
    },
    computed: {
        hasAvatarSlot() {
            return this.$slots.hasOwnProperty('avatar')
        },
        hasFullNameSlot() {
            return this.$slots.hasOwnProperty('full_name')
        },
        hasRoleSlot() {
            return this.$slots.hasOwnProperty('role')
        },
        imagePath() {
            if (this.avatar !== '') {
                return require(`${this.avatar}`);
            }
            return require("@/assets/img/object__img1.png")
        }
    },
}
</script>

<style lang="scss" scoped>


.base-avatar {
    display: flex;
    gap: 8px;
    width: max-content;
    align-items: center;
    border-radius: 32px;
    margin-right: 0;
    padding: 7px 16px 7px 8px;

    &.collapsed {
        padding: 7px 8px;

        .person {
            display: none !important;
        }
    }


    p {
        margin-bottom: 0;
        max-width: 250px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    img {
        border-radius: 32px;
        background-color: red;
        object-fit: contain;
        width: 40px;
        height: 40px;
    }

    .person {
        display: flex;
        font-family: "Inter", serif;
        flex-direction: column;

        .full_name {
            color: var(--gray-600);
            font-weight: 600;
            font-size: 16px;
            line-height: 22px;
        }

        .role {
            color: var(--gray-400);
            font-weight: 600;
            font-size: 14px;
            line-height: 20px;
        }
    }
}
</style>