<template>
    <header>
        <div class="slot-block">
            <slot v-if="hasBreadcrumbSlot" name="breadcrumb"></slot>
            <h3 class="title">
                <slot v-if="hasTitleSlot" name="title"></slot>
            </h3>
        </div>
        <div class="user-block">
            <slot name="actions"></slot>
            <div class="notification-block">
                <BaseNotificationIcon/>
            </div>
            <div class="notification-block">
                <BaseQuestionsIcon/>
            </div>

            <BaseAvatar
                :class="{'collapsed':userCollapse}"
                :name-snippet="getNameSnippet"
                :avatar="getUserAvatarUrl">
                <template #full_name>
                    {{ getFullName }}
                </template>
                <template #role>
                    {{ getRole }}
                </template>
            </BaseAvatar>
        </div>
    </header>
</template>

<script>
import BaseAvatar from "@/components/Reusable/BaseAvatar";
import {mapGetters} from "vuex";
import BaseNotificationIcon from "@/components/icons/BaseNotificationsIcon";
import BaseQuestionsIcon from "@/components/icons/BaseQuestionsIcon";

export default {
    name: "AppHeaderNew",
    components: {
        BaseQuestionsIcon,
        BaseNotificationIcon,
        BaseAvatar
    },
    // props: {
    //     headerProperties: {
    //         type: Object,
    //         required: true,
    //     }
    // },
    data() {
        return {
            userCollapse: false,
        }
    },
    computed: {
        ...mapGetters(["getPermission", "getMe"]),
        hasTitleSlot() {
            return this.$slots.hasOwnProperty('title')
        },
        hasBreadcrumbSlot() {
            return this.$slots.hasOwnProperty('breadcrumb')
        },
        getFullName() {
            if (this.getMe?.user) {
                const {firstName, lastName} = this.getMe.user
                if (firstName !== '' && lastName !== '') {
                    return firstName + " " + lastName
                }
            }
            return ''
        },
        getNameSnippet() {
            if (this.getMe?.user) {
                const {firstName, lastName} = this.getMe.user
                if (firstName !== '' && lastName !== '') {
                    return firstName[0] + lastName[0]
                }
            }
            return ''
        },
        getUserAvatarUrl() {
            if (this.getMe?.user?.avatar) {
                return this.getMe.user.avatar
            }
            return ''
        },
        getRole() {
            if (this.getMe?.role?.name) {
                if (localStorage.locale)
                    return this.getMe?.role?.name[localStorage.locale]
                else
                    return this.getMe?.role?.name['ru']
            } else {
                return 'no-role'
            }
        }
    }
}
</script>


<style lang="scss" scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    margin-bottom: 2rem;

    .notification-block {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3.5rem;
        height: 3.5rem;
        padding: 1rem;
        border-radius: 2rem;
        background-color: var(--gray-100)

    }

    .slot-block {
        .title {
            font-family: CraftworkSans, serif;
            font-style: normal;
            font-weight: 900;
            font-size: 36px;
            line-height: 42px;
            color: var(--gray-600);
        }

        .header-title {
            font-family: CraftworkSans, serif;
            font-style: normal;
            font-weight: 900;
            font-size: 36px;
            line-height: 42px;
            color: var(--gray-600);
        }
    }

    .user-block {
        display: flex;
        align-items: center;
        column-gap: .5rem;
        justify-self: flex-end;


    }
}


</style>