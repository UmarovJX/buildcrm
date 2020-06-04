<template>
    <div v-if="getAuth">

        <nav class="navbar navbar-expand-sm d-flex justify-content-between align-items-center fixed-top px-lg-4 px-md-3 px-auto">
            <router-link :to="{ name: 'dashboard'}" class="navbar-brand">
                ХON SAROY
            </router-link>

            <div class="dropdown my-dropdown dropdown-user dropleft">
                <button type="button" class="dropdown-toggle dropdown-user__button" data-toggle="dropdown">
                    <div class="user d-flex align-items-center">
                        <div class="user__img" style="background-image: url('/vendor/dashboard/img/noavatar.png'); border-radius: 50%"></div>
                        <div class="ml-2 d-none d-sm-block">
                            <div class="user__name">{{ getMe.first_name}} {{ getMe.last_name }}</div>
                            <div class="user__permission">
                                {{ $t('roles.' + getMe.role.slug)}}
                            </div>
                        </div>
                    </div>
                </button>
                <div class="dropdown-menu dropdown-menu__user">
                    <a class="dropdown-item" href="javascript:void(0)">
                        <label class="switch">
                            <input type="checkbox" @click="changeLocale" v-model="locale">
                            <div class="slider round">
                                <span>Ру</span>
                                <span>Uz</span>
                            </div>
                        </label>
                    </a>
                    <a class="dropdown-item" href="#">
                        <i class="fas fa-cog"></i> {{ $t('settings') }}
                    </a>

                    <a class="dropdown-item" @click="Logout" href="#">
                        <i class="fas fa-sign-out"></i> {{ $t('logout') }}
                    </a>
                </div>
            </div>
        </nav>

        <div class="fixed-menu">
            <div class="menu">
                <router-link :to="{ name: item.action }" :class="'menu__item ' + item.icon" v-for="(item, index) in getMenus" :key="index">
                    <div class="menu__img"></div>
                    <div class="menu__name">
                        {{ $t(item.action + '.title')}}
                    </div>

                    <div class="menu__count" v-if="item.count > 0">
                        {{ item.count }}
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    export default {
        data: () => ({
            locale: null
        }),

        async mounted() {
            this.fetchAuth(this);
            this.fetchMenu(this);

            this.locale = localStorage.locale == 'uz' ? false : true;
        },


        methods: {
            ...mapActions(['fetchAuth', 'fetchMenu', 'nullableAuth', 'nullMe']),

            Logout () {
                localStorage.clear();
                this.nullableAuth();
                this.nullMe();
                this.$router.push({name: 'login'});
            },

            changeLocale() {
                if (this.locale == false) {
                    localStorage.locale = 'ru';
                    this.$i18n.locale = 'ru';
                } else {
                    localStorage.locale = 'uz';
                    this.$i18n.locale = 'uz';
                }
            }
        },

        computed: mapGetters(['getAuth', 'getMenus', 'getMe']),

    }
</script>

<style scoped>

</style>
