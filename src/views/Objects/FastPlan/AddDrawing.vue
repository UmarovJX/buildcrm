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
                        <div class="d-flex justify-content-center w-100">
                            <div class="lds-ellipsis">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
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

                    <template #cell(balcony_area)="data">
                        {{ data.item.balcony ? data.item.balcony_area + " м²" : $t("no") }}
                    </template>

                    <template #cell(actions)="data">
                        <div v-if="editPermission || deletePermission"
                             class="actions">
                            <BaseButton
                                v-if="editPermission"
                                class="button rounded-circle"
                                text=''
                                @click="edit(data.item)"
                            >
                                <template #right-icon>
                                    <BaseEditIcon fill="#ffff"/>
                                </template>
                            </BaseButton>
                            <BaseButton
                                v-if="deletePermission"
                                class="bg-danger button rounded-circle"
                                text=''
                                @click="deleteTypePlan(data.item)"
                            >
                                <template #right-icon>
                                    <BaseDeleteIcon fill="#ffff"/>
                                </template>
                            </BaseButton>
                        </div>


                    </template>

                </b-table>
            </div>

            <delete-has-apartment
                ref="delete-plan-modal"
                :plan-list="deletePlan.plans"
                :remove-plan="deletePlan.removePlan"
                @successfully-updated="successfullyDeletePlan"
                @close-delete-modal="closeDeletePlanModal"
            />

            <create-modal ref="create-update"/>

        </div>

        <b-button
            @click="$router.push({name:'fast_plan_apartments',params:{object:$route.params.object,plan:1}})">redirect</b-button>

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

export default {
    name: 'AddDrawing',
    components: {
        BaseLoadingContent,
        BaseDeleteIcon,
        CreateModal,
        BaseSearchInput,
        BaseButton,
        BaseEditIcon,
        DeleteHasApartment,
        AppHeader,
        AppBreadcrumb,
        XButton
    },
    data() {
        const header = {
            pageInfo: {
                title: this.$t('objects.create.choose_plan'),
                titleHighlight: ''
            },
            page: {
                type: 'multi_language',
                path: 'objects.create.fast_plan.add'
            },
            breadcrumbs: [
                {
                    content: {
                        type: 'multi_language',
                        path: 'objects.title'
                    },
                    route: {
                        name: 'objects',
                        path: '/objects'
                    }
                },
                {
                    // content: {
                    //     type: "multi_language",
                    //     path: 'objects.create.plan.fast_plan'
                    // },
                    content: {
                        type: "string",
                        path: 'Sayram'
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
                        name: 'objects',
                        path: '/objects'
                    }
                },
                {
                    content: {
                        type: "multi_language",
                        path: 'objects.create.fast_plan.name'
                    },
                    route: {
                        name: 'objects',
                        path: '/objects'
                    }
                },
            ],
        }
        return {
            header,
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
        ...mapActions(["fetchPlans"]),
        async fetchFastPlans() {
            await api.plans.fastPlanList(1)
                .then((res) => {
                    console.log(res.data, 'fastList');
                    this.fastList = res.data
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
        async deleteTypePlan(item) {
            const objectId = this.$route.params.id
            const {apartments_count, id: planId} = item
            if (apartments_count) {
                this.showLoading = true
                const response = await api.plans.deletePlanWhenHasApartment(objectId, planId)
                    .then(() => ({}))
                    .catch((error) => error.response)
                    .finally(() => {
                        this.showLoading = false
                    })

                const hadResponse = Object.keys(response).length
                if (hadResponse) {
                    const {plans, message} = response.data
                    this.deletePlan.plans = plans
                    this.deletePlan.message = message
                    this.deletePlan.removePlan = item
                    this.$bvModal.show('delete-plan-modal')
                }
            } else {
                this.showLoading = true
                api.plans.deletePlan(objectId, planId)
                    .then(() => {
                        this.successfullyDeletePlan()
                    })
                    .catch((error) => {
                        this.toastedWithErrorCode(error)
                    })
                    .finally(() => {
                        this.showLoading = false
                    })
            }
        },
        async updateList() {
            this.loading = true
            await this.fetchPlans(this);
            this.loading = false
        },
        showAddModal() {
            this.$refs['create-update'].openModal()
        },
        successfullyDeletePlan() {
            this.closeDeletePlanModal()
            const message = `${this.$t("sweetAlert.deleted")}`
            this.$swal(message, "", "success")
            this.fetchPlans(this)
        },
        closeDeletePlanModal() {
            this.$bvModal.hide('delete-plan-modal')
        },
        edit(item) {
            // this.$router.push({
            //     name: "type-plan-edit",
            //     params: {object: this.getPlan.id, id: id},
            // })
            this.sendPlan = item
            this.$refs['create-update'].openPlanModal()
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
