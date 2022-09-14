<template>
    <div>
        <header-block
            v-if="showHeaderContent"
            :theme="theme"
        />

        <main v-if="showHeaderContent" class="main-content">
            <!--            <header>-->
            <!--                <slot name="breadcrumb"></slot>-->
            <!--                <BaseAvatar :avatar="getUserAvatarUrl">-->
            <!--                    <template #full_name>-->
            <!--                        {{ getNameSnippet }}-->
            <!--                    </template>-->
            <!--                    <template #role>-->
            <!--                        {{ getRole }}-->
            <!--                    </template>-->
            <!--                </BaseAvatar>-->
            <!--            </header>-->
            <div class="app-content">
                <router-view/>
            </div>
        </main>
        <template v-else>
            <router-view/>
        </template>

    </div>
</template>

<script>
import {mapGetters} from "vuex";
// import BaseAvatar from "@/components/Reusable/BaseAvatar";

export default {
    name: "AppLayout",
    components: {
        // BaseAvatar
    },

    props: {
        theme: {
            type: String,
            default: 'light-theme'
        }
    },
    data() {
        return {
            showHeaderContent: false
        }
    },
    watch: {
        '$route.name': {
            handler: function (name) {
                const unnecessaryRoute = ['login', 'home-2']
                const indexOfRoute = unnecessaryRoute.findIndex(routeName => routeName === name)
                this.showHeaderContent = indexOfRoute === -1
            },
            deep: true,
            immediate: true
        },
    },
    computed: {
        ...mapGetters(["getPermission", "getMe"]),
        getNameSnippet() {
            if (this.getMe?.user) {
                const {firstName, lastName} = this.getMe.user
                if (firstName !== '' && lastName !== '') {
                    return lastName[0] + firstName[0]
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

<style scoped>

</style>