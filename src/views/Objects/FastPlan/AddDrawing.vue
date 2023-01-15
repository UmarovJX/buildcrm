<template>
    <div>
        <app-header>
            <template #header-breadcrumb>
                <app-breadcrumb
                    :page="header.page"
                    :page-info="header.pageInfo"
                    :breadcrumbs="header.breadcrumbs"
                    :go-back-method="backDrawing"
                />
            </template>
        </app-header>


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
                    :items="planList"
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
                        <div class="d-flex justify-content-center w-100">
                            <div class="lds-ellipsis">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
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

                    <template #cell(actions)="data">
                        <div class="d-flex justify-content-end">
                            <x-circular-background size="small" @click="connectPlan(data.item.id)"
                                                   class="bg-yellow-600">
                                <x-icon name="link" class="color-white"/>
                            </x-circular-background>
                        </div>

                    </template>

                </b-table>
            </div>

        </div>

    </div>
</template>

<script>
import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox.css";
import {mapGetters, mapActions} from "vuex";
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
    name: 'AddDrawing',
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
        XIcon,
        XCircularBackground
    },
    data() {
        return {
            header: {
                pageInfo: {
                    title: this.$t('objects.create.choose_plan'),
                    titleHighlight: ''
                },
                page: {
                    type: 'multi_language',
                    path: 'objects.create.fast_plan.add_plan'
                },
                breadcrumbs: [
                    {
                        content: {
                            type: 'multi_language',
                            path: 'objects.title'
                        },
                        route: {
                            name: 'objects'
                        }
                    },
                    {
                        content: {
                            type: "string",
                            path: '',
                        },
                        route: {
                            name: 'objects',
                            path: '/objects'
                        }
                    },
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
                    {
                        content: {
                            type: "multi_language",
                            path: 'objects.create.fast_plan.name'
                        },
                        route: {
                            name: 'fast_plan',
                            params: {
                                object: this.$route.params.object
                            },
                        }
                    },
                ],
            },
            objectName: '',
            editPermission: PlansPermission.getPlansEditPermission(),
            deletePermission: PlansPermission.getPlansDeletePermission(),
            showLoading: false,
            manager: {},
            manager_id: null,
            fields: [
                {
                    key: "image",
                    label: this.$t('type_plan.image'),
                },
                {
                    key: "plan",
                    label: this.$t('type_plan.plan'),
                },
                {
                    key: "rooming",
                    label: this.$t('type_plan.rooming'),
                },
                {
                    key: "area",
                    label: this.$t('type_plan.area'),
                },
                {
                    key: "actions",
                    label: this.$t('type_plan.actions'),
                    class: 'text-right'
                },
            ],
            deletePlan: {
                plans: [],
                message: '',
                removePlan: {}
            },
            sendPlan: {},
            loading: false,

            //last
            planList: [],
        }
    },
    computed: {
        ...mapGetters(["getPermission", 'getFastPlanImage', 'getFastPlanName']),
    },
    created() {
        window.onbeforeunload = function (e) {
            e = e || window.event;
            //old browsers
            if (e) {
                e.returnValue = 'Changes you made may not be saved';
            }
            //safari, chrome(chrome ignores text)
            return 'Changes you made may not be saved';
        };
    },
    async mounted() {
        await this.fetchFastPlans()
        Fancybox.bind("[data-fancybox]");
        if (!(this.getFastPlanImage && this.getFastPlanName)) {
            this.$router.push({name: 'fast_plan', params: {object: this.$route.params.object}})
        }
    },
    methods: {
        ...mapActions(["fetchPlans"]),
        async fetchFastPlans() {
            const objectId = this.$route.params.object
            await api.objects.getObjectPlans(objectId)
                .then((res) => {
                    this.header.breadcrumbs[1].content.path = res.data.name
                    this.planList = res.data.plans
                })
                .catch((error) => error.response)
                .finally(() => {
                    this.showLoading = false
                })
        },
        backDrawing() {
            this.$route.push({name: 'objects'})
        },
        imagePath(item) {
            if (item && item.images[0]) return item.images[0].path
            return null
        },
        connectPlan(id) {
            const object = this.$route.params.object
            this.$router.push(
                {
                    name: 'fast_plan_apartments',
                    params: {
                        object,
                        plan: id
                    }
                })
        },
        showAddModal() {
            this.$refs['create-update'].openModal()
        },
    },
}
</script>

<style lang="scss" scoped>

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
