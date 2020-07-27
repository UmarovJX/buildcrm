<template>
    <main>
        <div class="d-flex justify-content-between align-items-center flex-md-row flex-column pb-3 pt-0 px-0 py-lg-3">
            <div class="d-flex w-100 align-items-center flex-md-row flex-column mb-md-0 mb-3">
                <h1 class="title__big my-0 order-md-0 order-1">{{ $t('type_plan.title') }}</h1>
                <ul class="breadcrumb ml-md-4 ml-3 mb-3 mb-md-0 align-self-start">
                    <li class="breadcrumb-item">
                        <router-link :to="{ name: 'objects' }">
                            <i class="far fa-home"></i>
                        </router-link>
                    </li>

                    <li class="breadcrumb-item">
                        <a href="#">
                            {{ $t('type_plan.title') }}
                        </a>
                    </li>
                    <li class="breadcrumb-item active">
                        {{ $t('list') }}
                    </li>
                </ul>
            </div>
        </div>

        <div class="my-container px-0 mx-0">
            <div class="table-responsive">
                <table class="table table-borderless my-table">
                    <thead>
                    <tr>
                        <th width="50"><i class="fas fa-hashtag"></i></th>
                        <th>{{ $t('managers.object') }}</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>

                        <tr v-if="getLoading">
                            <td colspan="3" style="">
                                <div class="d-flex justify-content-center w-100">
                                    <div class="lds-ellipsis">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="3" v-if="getObjects.length === 0 && !getLoading">
                                <center>
                                    {{ $t('no_data') }}
                                </center>
                            </td>
                        </tr>

                        <tr v-for="(object, index) in getObjects" :key="index">
                            <td>
                                {{ object.id }}
                            </td>

                            <td>
                                {{ object.name }}
                            </td>
                            <td class="float-right">
                                <div class="dropdown my-dropdown dropleft">
                                    <button type="button" class="dropdown-toggle" data-toggle="dropdown">
                                        <i class="far fa-ellipsis-h"></i>
                                    </button>

                                    <div class="dropdown-menu">
                                        <b-button class="dropdown-item dropdown-item--inside" @click="PlanView(object.id)">
                                            <i class="fas fa-eye"></i>
                                            {{ $t('type_plan.plans') }}
                                        </b-button>
                                    </div>
                                </div>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>

    </main>
</template>

<script>

    import { mapGetters, mapActions } from 'vuex';

    export default {


        data: () => ({
            manager: {},
            manager_id: null,

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }
        }),

        computed: mapGetters(['getPermission', 'getObjects', 'getLoading']),

        mounted() {
            this.fetchObjects(this)
        },

        methods: {
            ...mapActions(['fetchObjects']),

            PlanView(id) {
                this.$router.push({ name: 'type-plan-view', params: { id: id } })
            }
        }

    }
</script>

<style scoped>

</style>
