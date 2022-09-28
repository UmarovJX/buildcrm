<template>
    <div>
        <div class="search__content">
            <!--  Search Content  -->
            <base-search-input
                class="base-search-input w-50 mr-2"
                :placeholder="`${ $t('objects.create.plan.search') }`"
            />

            <BaseButton @click="showAddModal" class="text" :text="$t('objects.create.plan.add')">
                <template #left-icon>
                    <i class="fal fa-plus color-gray-900"></i>
                </template>
            </BaseButton>
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
                    :items="getPlan.plans"
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

            <create-modal
                ref="create-update"
                @update-list="updateList"
                :plan="sendPlan"/>

        </div>

        <base-loading-content :loading="loading"/>

    </div>
</template>

<script>
import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox.css";
import {mapGetters, mapActions} from "vuex";
import api from "@/services/api";
import CreateModal from "@/components/Dashboard/TypePlan/Components/CreateModal";
import BaseSearchInput from "@/components/Reusable/BaseSearchInput";
import BaseEditIcon from "@/components/icons/BaseEditIcon"
import DeleteHasApartment from "@/components/Dashboard/TypePlan/DeleteHasApartment";
import PlansPermission from "@/permission/plans";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import BaseLoadingContent from "@/components/BaseLoadingContent";

export default {
    name: 'TypePlanList',
    components: {
        BaseLoadingContent,
        BaseDeleteIcon,
        CreateModal,
        BaseSearchInput,
        BaseButton,
        BaseEditIcon,
        DeleteHasApartment
    },
    data() {
        return {
            editPermission: PlansPermission.getPlansEditPermission(),
            deletePermission: PlansPermission.getPlansDeletePermission(),
            showLoading: false,
            manager: {},
            manager_id: null,
            header: {
                modalProperties: {
                    position: 'create',
                    title: this.$t('add')
                },
            },
            fields: [
                {
                    key: "image",
                    label: this.$t('type_plan.image'),
                },
                {
                    key: "plan",
                    label: this.$t('type_plan.name'),
                },
                {
                    key: "area",
                    label: this.$t('type_plan.area'),
                },
                {
                    key: "balcony_area",
                    label: this.$t('type_plan.balcony'),
                },
                {
                    key: "apartments_count",
                    label: this.$t("apartments_count")
                },
                {
                    key: "actions",
                    label: "",
                },
            ],
            deletePlan: {
                plans: [],
                message: '',
                removePlan: {}
            },
            sendPlan: {},
            loading: false,
        }
    },
    computed: {
        ...mapGetters(["getPlan", "getLoading", "getPermission"]),
    },
    mounted() {
        this.fetchPlans(this);
        Fancybox.bind("[data-fancybox]");
    },
    methods: {
        ...mapActions(["fetchPlans"]),
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
            this.$refs['create-update'].openPlanModal()
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
.label {
    color: #7C3AED;
    margin-right: 3px;
    font-weight: 500;
}

.fal {
    font-weight: 500;
}

.text {
    font-weight: 600;
}

.button {
    height: auto;
    background-color: #7C3AED;
    width: auto;
    padding: 8px;

    ::v-deep span {
        margin-left: 0 !important;
    }
}

.actions {
    display: flex;
    gap: 16px;
}

.search__content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
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
