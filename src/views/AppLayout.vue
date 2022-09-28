<template>
    <div>
        <header-block
            v-if="showHeaderContent"
            :theme="theme"
        />
        <main v-if="showHeaderContent" class="main-content">
            <div class="app-content">
                <router-view />
            </div>
        </main>
        <template v-else>
            <router-view/>
        </template>
    </div>
</template>

<script>

export default {
    name: "AppLayout",
    props: {
        theme: {
            type: String,
            default: 'light-theme'
        }
    },
    data() {
        return {
            showHeaderContent: false,
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

}
</script>
