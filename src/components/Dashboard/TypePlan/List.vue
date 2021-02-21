<template>
    <main>
        <div class="d-flex justify-content-between align-items-center flex-md-row flex-column pb-3 pt-0 px-0 py-lg-3">
            <div class="d-flex w-100 align-items-center flex-md-row flex-column mb-md-0 mb-3">
                <h1 class="title__big my-0 order-md-0 order-1">{{ $t('type_plan.list') }}</h1>
                <ul class="breadcrumb ml-md-4 ml-3 mb-3 mb-md-0 align-self-start">
                    <li class="breadcrumb-item">
                        <router-link :to="{ name: 'home' }">
                            <i class="far fa-home"></i>
                        </router-link>
                    </li>

                    <li class="breadcrumb-item">
                        <router-link :to="{name: 'type_plan'}">
                            {{ $t('type_plan.title') }}
                        </router-link>
                    </li>

                    <li class="breadcrumb-item">
                        <a href="#">
                            {{ getPlan.name }}
                        </a>
                    </li>

                    <li class="breadcrumb-item active">
                        {{ $t('type_plan.list') }}
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
                        <th width="150">{{ $t('type_plan.plan') }}</th>
                        <th>{{ $t('type_plan.name') }}</th>
                        <th>{{ $t('type_plan.area') }}</th>
                        <th>{{ $t('type_plan.balcony') }}</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-if="getLoading">
                            <td colspan="4" style="">
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
                            <td colspan="4" v-if="getPlan.plans.length === 0 && !getLoading">
                                <center>
                                    {{ $t('no_data') }}
                                </center>
                            </td>
                        </tr>

                        <tr v-for="(plan, index) in getPlan.plans" :key="index">
                            <td>
                                {{ plan.id }}
                            </td>

                            <td>
                                <img :src="plan.image" width="100%">
                            </td>

                            <td>
                                {{ plan.name }}
                            </td>

                            <td>
                                {{ plan.area }} м²
                            </td>

                            <td>
                                {{ plan.balcony ? plan.balcony_area  + ' м²' : $t('no') }}
                            </td>
                            <td class="float-right">
                                <div class="dropdown my-dropdown dropleft" v-if="getPermission.type_plan.update">
                                    <button type="button" class="dropdown-toggle" data-toggle="dropdown">
                                        <i class="far fa-ellipsis-h"></i>
                                    </button>

                                    <div class="dropdown-menu">
                                        <button class="dropdown-item dropdown-item--inside" @click="edit(plan.id)">
                                            <i class="fas fa-pen"></i>
                                            {{ $t('edit') }}
                                        </button>
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

        computed: mapGetters(['getPlan', 'getLoading', 'getPermission']),

        mounted() {
            this.fetchPlans(this);
        },

        methods: {
            ...mapActions(['fetchPlans']),

            edit(id) {
                this.$router.push({ name: 'type-plan-edit', params: { object: this.getPlan.id, id: id } })
            }
        }

    }
</script>

<style scoped>

</style>
