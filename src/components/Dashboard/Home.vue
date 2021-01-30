<template>
    <main>
        <div class="d-flex justify-content-between align-items-center flex-md-row flex-column pb-3 pt-0 px-0 py-lg-3">
            <div class="d-flex w-100 align-items-center flex-md-row flex-column mb-md-0 mb-3">
                <h1 class="title__big my-0 order-md-0 order-1">{{ $t('home.title') }}</h1>
            </div>
        </div>

        <div class="col-md-12">
            <div class="row">
                <div class="col-md-3" v-if="getPermission.objects.view">
                    <router-link :to="{ name: 'objects' }" >
                        <div class="card-counter primary">
                            <i class="far fa-building"></i>
                            <span class="count-numbers">{{ getHomeCounts.objects }}</span>
                            <span class="count-name">{{ $t('objects.title') }}</span>
                        </div>
                    </router-link>
                </div>

                <div class="col-md-3" v-if="getPermission.clients.view">
                    <router-link :to="{ name: 'clients' }" >
                        <div class="card-counter danger">
                            <i class="far fa-users-class"></i>
                            <span class="count-numbers">{{ getHomeCounts.clients }}</span>
                            <span class="count-name">{{ $t('clients.title') }}</span>
                        </div>
                    </router-link>
                </div>

                <div class="col-md-3" v-if="getPermission.users.view">
                    <router-link :to="{ name: 'users' }" >
                        <div class="card-counter success">
                            <i class="far fa-users"></i>
                            <span class="count-numbers">{{ getHomeCounts.users }}</span>
                            <span class="count-name">{{ $t('users.title') }}</span>
                        </div>
                    </router-link>
                </div>

<!--                <div class="col-md-3">-->
<!--                    <div class="card-counter info">-->
<!--                        <i class="far fa-cogs"></i>-->
<!--                        <span class="count-numbers"></span>-->
<!--                        <span class="count-name">{{ $t('settings.title') }}</span>-->
<!--                    </div>-->
<!--                </div>-->


                <div class="col-md-3" v-if="getPermission.apartments.view">
                    <router-link :to="{ name: 'objects-filter' }" >
                        <div class="card-counter apartments">
                            <i class="far fa-home"></i>
                            <span class="count-numbers">{{ getHomeCounts.apartments }}</span>
                            <span class="count-name">{{ $t('objects.apartments') }}</span>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>

    </main>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';

    export default {
        data: () => ({

        }),

        mounted() {
            this.fetchCounts(this);
        },

        computed: mapGetters(['getHomeCounts', 'getPermission']),

        methods: {
            ...mapActions(['fetchCounts'])
        }
    }
</script>

<style>
    .card-counter{
        box-shadow: 2px 2px 10px #DADADA;
        margin: 5px;
        padding: 20px 10px;
        background-color: #fff;
        height: 100px;
        border-radius: 5px;
        transition: .3s linear all;
    }

    .card-counter:hover{
        box-shadow: 4px 4px 20px #DADADA;
        transition: .3s linear all;
    }

    .card-counter.primary{
        background-color: #007bff;
        color: #FFF;
    }

    .card-counter.danger{
        background-color: #ef5350;
        color: #FFF;
    }

    .card-counter.success{
        background-color: #66bb6a;
        color: #FFF;
    }

    .card-counter.info{
        background-color: #26c6da;
        color: #FFF;
    }


    .card-counter.apartments{
        background-color: #9a67ea;
        color: #FFF;
    }

    .card-counter i{
        font-size: 5em;
        opacity: 0.2;
    }

    .card-counter .count-numbers{
        position: absolute;
        right: 35px;
        top: 20px;
        font-size: 32px;
        display: block;
    }

    .card-counter .count-name{
        position: absolute;
        right: 35px;
        top: 65px;
        font-style: italic;
        text-transform: capitalize;
        opacity: 0.5;
        display: block;
        font-size: 18px;
    }
</style>
