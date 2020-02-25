<template>
    <div v-if="getAuth">
        <nav class="navbar navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="#">Xon-Saroy</a>

                <div class="form-inline">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                            <a class="nav-link" @click="Logout" href="#">{{ $t('logout') }}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="#">{{ $t('home') }}</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">

                        <li v-for="(item, index) in getMenus" :key="index" class="nav-item active" >
                            <router-link :class="'nav-link'" :to="{ name: item.action }">
                                {{ $t(item.action + '.title')}}
                            </router-link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    export default {
        data: () => ({

        }),

        async mounted() {
            this.fetchAuth(this);
            this.fetchMenu(this)
        },


        methods: {
            ...mapActions(['fetchAuth', 'fetchMenu', 'nullableAuth', 'nullMe']),

            Logout () {
                localStorage.clear();
                this.nullableAuth();
                this.nullMe();
                this.$router.push({name: 'login'});
            }
        },
        computed: mapGetters(['getAuth', 'getMenus']),

    }
</script>

<style scoped>

</style>
