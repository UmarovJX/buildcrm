<template>
    <div>
        <app-header>
            <template #header-breadcrumb>
                <app-breadcrumb
                    :page="header.page"
                    :page-info="header.pageInfo"
                    :breadcrumbs="header.breadcrumbs"
                    :go-back-method="backObject"
                />
            </template>
        </app-header>


        <div class="search__content">
            <!--  Search Content  -->
            <base-search-input
                class="base-search-input w-100"
                :placeholder="`${ $t('objects.create.fast_plan.search') }`"
            />

            <x-button
                @click="createPlan"
                :text="$t('objects.create.fast_plan.add')"
                left-icon="add"
            />

        </div>

        <div>
            <div class="mt-4">
                <b-table
                    thead-tr-class="row__head__bottom-border"
                    tbody-tr-class="row__body__bottom-border"
                    class="table__list"
                    sticky-header
                    show-empty
                    borderless
                    responsive
                    :items="fastList"
                    :empty-text="$t('no_data')"
                    :fields="fields"
                    :busy="showLoading"
                >
                    <template #empty="scope" class="text-center">
                        <div class="d-flex justify-content-center align-items-center">
                            {{ scope.emptyText }}
                        </div>
                    </template>
                    <template #table-busy>
                        <base-loading/>
                    </template>

                    <template #cell(plan)="data">
                        {{ data.item.name }}
                    </template>


                    <template #cell(image)="data">
                        <img
                            style="cursor: pointer; object-fit: contain"
                            :data-fancybox="imagePath(data.item)"
                            :src="imagePath(data.item)"
                            width="80"
                            height="80"
                            alt="plan_image"
                            fluid
                        />
                    </template>

                    <template #cell(apartments_count)="data">
                        {{ data.item.apartments_count }}
                    </template>

                    <template #cell(actions)="data">
                        <div class="actions">
                            <x-circular-background size="small" @click="editPlan(data.item)"
                                                   class="bg-violet-600">
                                <x-icon name="edit" class="color-white"/>
                            </x-circular-background>
                            <x-circular-background size="small" @click="deletePlanFunction(data.item.id)"
                                                   class="bg-red-600">
                                <x-icon name="delete" class="color-white"/>
                            </x-circular-background>
                        </div>


                    </template>

                </b-table>
            </div>

            <create-modal ref="create-update"/>

        </div>

        <base-loading-content :loading="loading"/>

    </div>
</template>

<script>
import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox.css";
import {mapGetters, mapActions, mapMutations} from "vuex";
import api from "@/services/api";
import CreateModal from "@/views/Objects/FastPlan/CreateModal.vue";
import BaseSearchInput from "@/components/Reusable/BaseSearchInput";
import BaseEditIcon from "@/components/icons/BaseEditIcon"
import DeleteHasApartment from "@/components/Dashboard/TypePlan/DeleteHasApartment";
import PlansPermission from "@/permission/plans";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import BaseLoadingContent from "@/components/BaseLoadingContent";
import AppHeader from "@/components/Header/AppHeader";
import {XButton} from "@/components/ui-components/button";
import AppBreadcrumb from "@/components/AppBreadcrumb.vue";
import {XCircularBackground} from "@/components/ui-components/circular-background";
import {XIcon} from "@/components/ui-components/material-icons";
import BaseLoading from "@/components/Reusable/BaseLoading.vue";

export default {
    name: 'FastPlanList',
    components: {
        BaseLoading,
        BaseLoadingContent,
        BaseDeleteIcon,
        CreateModal,
        BaseSearchInput,
        BaseButton,
        BaseEditIcon,
        DeleteHasApartment,
        AppHeader,
        AppBreadcrumb,
        XButton,
        XCircularBackground,
        XIcon
    },
    data() {
        const header = {
            pageInfo: {
                title: this.$t('objects.create.fast_plan.name'),
                titleHighlight: ''
            },
            page: {
                type: 'multi_language',
                path: 'objects.create.fast_plan.name'
            },
            breadcrumbs: [
                {
                    content: {
                        type: 'multi_language',
                        path: 'objects.title'
                    },
                    route: {
                        name: 'objects',
                    }
                },
                // {
                //     content: {
                //         type: "string",
                //         path: 'Sayram'
                //     },
                //     route: {
                //         name: 'objects',
                //         path: '/objects'
                //     }
                // },
                {
                    content: {
                        type: "multi_language",
                        path: 'objects.create.plan.name'
                    },
                    route: {
                        name: 'type-plan-view',
                        params: {
                            id: this.$route.params.object
                        },

                    }
                },
            ],
        }
        return {
            header,
            showLoading: false,
            fields: [
                {
                    key: "image",
                    label: this.$t('type_plan.image'),
                },
                {
                    key: "name",
                    label: this.$t('type_plan.name'),
                },
                {
                    key: "apartments_count",
                    label: this.$t('type_plan.connect_plan'),
                },
                {
                    key: "actions",
                    label: this.$t('type_plan.actions'),
                },
            ],
            sendPlan: {},
            loading: false,

            //last
            fastList: [],
        }
    },
    computed: {
        ...mapGetters(["getLoading", "getPermission"]),
    },
    mounted() {
        this.fetchFastPlans();
        Fancybox.bind("[data-fancybox]");
    },
    methods: {
        ...mapMutations[{
            updateFastPlanImage: 'updateFastPlanImage',
            updateFastPlanName: 'updateFastPlanName'
        }],
        async fetchFastPlans() {
            this.showLoading = true
            const objectId = this.$route.params.object
            await api.plans.fastPlanList(objectId)
                .then((res) => {
                    this.fastList = res.data
                })
                .catch((error) => error.response)
                .finally(() => {
                    this.showLoading = false
                })
        },
        backObject() {
            const {object} = this.$route.params
            this.$router.push({name: 'type-plan-view', params: {id: object}})
        },
        imagePath(item) {
            if (item && item.image) return item.image
            return null
        },
        async deletePlanFunction(id) {
            const objectId = this.$route.params.object
            this.showLoading = true
            return await api.plans.deleteFastPlan(objectId, id)
                .then(() => {
                    this.$swal(this.$t("sweetAlert.deleted"), "", "success")
                    this.fetchFastPlans()
                })
                .catch(() => {
                    this.$swal(this.$t("error"), "", "error")
                })
                .finally(() => {
                    this.showLoading = false
                })

        },
        async updateList() {
            this.loading = true
            await this.fetchFastPlans();
            this.loading = false
        },
        showAddModal() {
            this.$refs['create-update'].openModal()
        },
        createPlan() {
            this.$store.commit('updateFastPlanImage', null)
            this.$store.commit('updateFastPlanName', null)
            this.$store.commit('updateFastPlanId', null)
            this.showAddModal()
        },
        editPlan(item) {
            this.$store.commit('updateFastPlanImage', item.image)
            this.$store.commit('updateFastPlanName', item.name)
            this.$store.commit('updateFastPlanId', item.id)
            this.showAddModal()
        },
    },
}
</script>

<style lang="scss" scoped>


.actions {
    display: flex;
    align-items: center;
    gap: .5rem;
}

.search__content {
    display: flex;
    //flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
}

::v-deep .row__head__bottom-border {
    border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .row__body__bottom-border:not(:last-child) {
    border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .table__list {
    min-height: 250px;
    max-height: none;

    table {
        color: var(--gray-600);

        thead tr th {
            font-family: CraftworkSans, serif;
            font-weight: 900;
            font-size: 14px;
            line-height: 14px;
            letter-spacing: 1px;
            color: var(--gray-400) !important;
            padding: 1.125rem 1rem;
            vertical-align: middle;

            //&.b-table-sort-icon-left {
            //display: flex;
            //align-items: center;
            //}
        }

        td {
            font-family: Inter, sans-serif;
            font-size: 1rem;
            line-height: 22px;
            font-weight: 600;
            vertical-align: middle;
        }
    }

    .table.b-table[aria-busy=true] {
        opacity: 1 !important;
    }
}


::v-deep .table.b-table > thead > tr > [aria-sort="none"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="none"] {
    background-position: right calc(2rem / 2) center !important;
    //background-position: right !important;
    padding-right: 20px;
}

::v-deep .table.b-table > thead > tr > [aria-sort=ascending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=ascending] {
    background-position: right calc(2rem / 2) center !important;
    background-size: 20px;
    background-image: url("../../../assets/icons/icon-arrow-down.svg") !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort=descending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=descending] {
    background-position: right calc(2rem / 2) center !important;
    background-size: 20px;
    background-image: url("../../../assets/icons/icon-arrow-up.svg") !important;
}
</style>
