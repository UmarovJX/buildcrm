<template>
    <div class="base-avatar" :style="{background: background}">
        <slot name="avatar"></slot>
        <img
            v-if="!hasAvatarSlot"
            :src="imagePath" alt="img"
        />
        <div class="person">
            <span class="full_name"><slot name="full_name"></slot></span>
            <span class="full_name" v-if="!hasFullNameSlot">{{ full_name }}</span>
            <span class="role"><slot name="role"></slot></span>
            <span class="role" v-if="!hasRoleSlot">{{ role }}</span>
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
    margin-top: 3rem;
    display: flex;
    gap: 8px;
    width: max-content;
    align-items: center;
    border-radius: 32px;
    margin-right: 0;
    padding: 7px 16px 7px 8px;

    img {
        width: 40px;
        height: 40px;
    }

    .person {
        display: flex;
        font-family: "Inter", serif;
        flex-direction: column;

        .full_name {
            color: #4B5563;
            font-weight: 600;
            font-size: 16px;
            line-height: 22px;
        }

        .role {
            color: #9CA3AF;
            font-weight: 600;
            font-size: 14px;
            line-height: 20px;
        }
    }
}
</style>