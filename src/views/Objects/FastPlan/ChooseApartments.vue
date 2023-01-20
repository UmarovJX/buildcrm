<template>
    <div>
        <app-header>
            <template #header-breadcrumb>
                <app-breadcrumb
                    :page="header.page"
                    :page-info="header.pageInfo"
                    :breadcrumbs="header.breadcrumbs"
                    :go-back-method="backPlan"
                />
            </template>
        </app-header>

        <div>
            <div
                class="d-flex align-items-center justify-content-between mb-4"
                style="row-gap: 0.5rem"
            >
                <base-search-input
                    class="base-search-input w-75"
                    :placeholder="`${ $t('apartment_number') }`"
                    :value="search"
                    @trigger-input="filterBySearchContent"
                />

                <div class="d-flex align-items-center">
                    <base-filter-button
                        class="base-filter-button"
                        @click="openFilterContent"
                    />
                </div>
            </div>

            <base-right-modal
                ref="filter-modal"
                @reset-fields="resetFilterFields"
                @start-filtering="filterItems"
                @show="setFilterProperties"
            >
                <div class="filter-modal-content">
                    <x-form-select
                        class="mb-4"
                        v-model="filter.floors"
                        :multiple="true"
                        :options="filterOptions.floors"
                        :placeholder="$t('apartments.list.floor')"
                        @change="inputFilterObject"
                    />
                    <x-form-select
                        class="mb-4"
                        v-model="filter.area"
                        :multiple="true"
                        :options="filterOptions.area"
                        :placeholder="$t('apartments.list.area')"
                        @change="inputFilterObject"
                    />
                    <x-form-select
                        class="mb-4"
                        v-model="filter.rooms"
                        :multiple="true"
                        :options="filterOptions.rooms"
                        :placeholder="$t('apartments.list.rooms')"
                        @change="inputFilterObject"
                    />
                </div>
            </base-right-modal>
        </div>


        <b-table
            thead-tr-class="row__head__bottom-border"
            tbody-tr-class="row__body__bottom-border"
            ref="apartment-list-table"
            id="my-table"
            class="table__list"
            sticky-header
            borderless
            show-empty
            responsive
            sort-icon-left
            :items="apartments"
            :fields="fields"
            :busy="showLoading"
            :sort-by="sortBy"
            :sort-desc="sortDesc"
            :empty-text="$t('no_data')"
            :selectable="selectable"
            select-mode="single"
        >
            <template #table-busy>
                <base-loading/>
            </template>

            <template #empty="scope" class="text-center">
                  <span class="d-flex justify-content-center align-items-center">
                    {{ scope.emptyText }}
                  </span>
            </template>

            <template #head(check)="{item}" class="p-0">
                  <span>
                    <base-checkbox
                        :checked="checkAll"
                        @input="chooseAllApartment"
                    />
                  </span>
            </template>

            <template #cell(check)="data" class="p-0">
                <base-checkbox
                    :checked="data.item.checked"
                    @input="activateApartment(data,$event)"
                />
            </template>

            <template #cell(number)="data" class="p-0">
                <span>{{ data.item.number }}</span>
            </template>

            <template #cell(area)="data">
                <span v-if="data.item.plan"> {{ data.item.plan.area }} м² </span>
            </template>

        </b-table>

        <div v-if="!showLoading && pagination.total" class="pagination__vue">

            <!--   Pagination   -->
            <vue-paginate
                :page-count="pagination.total"
                :value="pagination.current"
                :container-class="'container'"
                :page-class="'page-item'"
                :page-link-class="'page-link'"
                :next-class="'page-item'"
                :prev-class="'page-item'"
                :prev-link-class="'page-link'"
                :next-link-class="'page-link'"
                @change-page="changeCurrentPage"
            >
                <template #next-content>
                      <span class="d-flex align-items-center justify-content-center">
                        <base-arrow-right-icon/>
                      </span>
                </template>

                <template #prev-content>
                      <span class="d-flex align-items-center justify-content-center">
                        <base-arrow-left-icon/>
                      </span>
                </template>
            </vue-paginate>

            <!--  Show By Select    -->
            <div class="show__by">
                <x-form-select
                    :label="false"
                    :options="showByOptions"
                    v-model="showByValue"
                    @change="limitChanged"
                >
                    <template #output-prefix>
                        <span class="show-by-description">
                            {{ $t('contracts.show_by') }}:
                        </span>
                    </template>
                </x-form-select>
            </div>

        </div>

        <BaseCheckboxModal
            :chosen="checkedApartments.length"
            @go-to-contract="createDrawing"
            btn-text="Добавить планировку"
        />


    </div>

</template>

<script>
import {isPrimitiveValue, sortObjectValues} from "@/util/reusable";
import api from "@/services/api";
import BaseCheckboxModal from "@/components/Reusable/BaseCheckboxModal.vue";
import BaseCheckbox from "@/components/Reusable/BaseCheckbox.vue";
import {XFormSelect} from "@/components/ui-components/form-select";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon.vue";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon.vue";
import BaseRightModal from "@/components/Reusable/BaseRightModal.vue";
import {isUndefinedOrNullOrEmpty} from "@/util/inspect";
import router from "@/routes";
import AppHeader from "@/components/Header/AppHeader.vue";
import AppBreadcrumb from "@/components/AppBreadcrumb.vue";
import BaseSearchInput from "@/components/Reusable/BaseSearchInput.vue";
import BaseFilterButton from "@/components/Elements/BaseFilterButton.vue";
import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import {mapGetters} from "vuex";

export default {
    name: "ChooseApartments",
    components: {
        BaseSearchInput,
        BaseCheckboxModal,
        BaseCheckbox,
        XFormSelect,
        BaseArrowLeftIcon,
        BaseArrowRightIcon,
        BaseRightModal,
        AppHeader,
        AppBreadcrumb,
        BaseFilterButton,
        BaseLoading,
    },
    data() {
        const showByOptions = []

        for (let number = 10; number <= 50; number += 10) {
            showByOptions.push({
                value: number,
                text: number
            })
        }

        let {limit: showByValue} = this.$route.query

        if (!showByValue) {
            showByValue = 20
        }


        const header = {
            pageInfo: {
                title: this.$t('objects.create.fast_plan.choose_apartments'),
                titleHighlight: ''
            },
            page: {
                type: 'multi_language',
                path: 'objects.create.fast_plan.select_room'
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
                    content: {
                        type: "string",
                        path: ''
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
                {
                    content: {
                        type: 'multi_language',
                        path: 'objects.create.fast_plan.add_plan'
                    },
                    route: {
                        name: 'fast_plan_add',
                        params: {
                            object: this.$route.params.object
                        },
                    }
                },
            ],
        }

        return {
            header,
            showByValue,
            showByOptions,
            pagination: {},
            apartments: [],
            page: 1,
            reserve: false,
            apartment_id: 0,
            order_id: 0,
            edit: false,
            check_all: false,
            chosen: 0,
            fields: [
                {
                    key: "check",
                    // item: BaseCheckbox,
                },
                {
                    key: "number",
                    label: this.$t('object.sort.number_flat'),
                    sortable: true,
                },
                {
                    key: "floor",
                    label: this.$t('apartments.list.floor'),
                    sortable: true,
                },
                {
                    key: "entrance",
                    label: this.$t('apartments.list.entrance'),
                    sortable: true,
                },
                {
                    key: "rooms",
                    label: 'Комнатность',
                    sortable: true,
                },
                {
                    key: "area",
                    label: this.$t('apartments.list.area'),
                    sortable: true,
                },
            ],
            sortBy: "",
            sortDesc: false,
            currentPage: 1,
            showLoading: false,
            selectMode: "single",
            contract: {},
            selectable: true,
            selected: {
                view: false,
                confirm: false,
                values: [],
            },
            checkoutList: [],
            checkAll: false,
            search: null,
            filter: {
                floors: [],
                area: [],
                rooms: [],
            },
            filterOptions: {
                floors: [],
                area: [],
                rooms: []
            },
        }
    },

    async created() {
        await this.fetchContractList()
        await this.getFilterFields()


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
    mounted() {
        if (!(this.getFastPlanImage && this.getFastPlanName)) {
            this.$router.push({name: 'fast_plan', params: {object: this.$route.params.object}})
        }
        if (this.query && this.query.number) {
            this.search = this.query.number[0]
        }
    },
    computed: {
        ...mapGetters(['getFastPlanImage', 'getFastPlanName', 'getFastPlanId']),
        checkedApartments() {
            return this.checkoutList.filter(ch => ch.checked)
        },
        query() {
            return Object.assign({}, this.$route.query)
        },
        countOfItems() {
            return this.apartments.length
        },
    },

    watch: {
        '$route.query': {
            handler(value) {
                if (value) {
                    this.fetchContractList()
                }
            },
            deep: true,
        },
    },

    methods: {
        backPlan() {
            const {object} = this.$route.params
            this.$router.push({name: 'fast_plan_add', params: {object}})
        },
        async createDrawing() {
            const objectId = this.$route.params.object
            const body = new FormData()
            body.append('name', this.getFastPlanName)
            if (!(typeof this.getFastPlanImage === 'string')) {
                body.append('image', this.getFastPlanImage)
            }
            body.append('plan_id', this.$route.params.plan)
            this.checkoutList.forEach((item, index) => {
                body.append(`apartments[${index}]`, item.id)
            })

            if (!this.getFastPlanId) {
                await api.plans.createFastPlan(objectId, body)
                    .then(() => {
                        this.$router.push(
                            {
                                name: 'fast_plan',
                                params: {
                                    object: objectId
                                }
                            })
                        this.$store.dispatch('notify/openNotify', {type: 'success', duration: 3000})
                    })
                    .catch((err) => {
                        this.$store.dispatch('notify/openNotify', {type: 'error', duration: 3000})
                        return err
                    })
            } else {
                await api.plans.updateFastPlan(objectId, this.getFastPlanId, body)
                    .then(() => {
                        this.$router.push(
                            {
                                name: 'fast_plan',
                                params: {
                                    object: objectId
                                }
                            })
                        this.$store.dispatch('notify/openNotify', {type: 'success', duration: 3000})
                    })
                    .catch((err) => {
                        this.$store.dispatch('notify/openNotify', {type: 'error', duration: 3000})
                        return err
                    })
            }

        },
        startLoading() {
            this.showLoading = true
        },
        finishLoading() {
            this.showLoading = false
        },

        activateApartment({index, item}, event) {
            const {current} = this.pagination
            const {checked} = event.target
            this.apartments[index].checked = checked
            if (checked) {
                this.checkoutList.push({checked, id: item.id, page: current})
                const allActive = this.apartments.every(a => a.checked === true)
                if (allActive) {
                    this.checkAll = true
                }
            } else {
                this.checkoutList = this.checkoutList.filter(ch => ch.id !== item.id)
                if (this.checkAll) {
                    this.checkAll = false
                }
            }
        },

        chooseAllApartment(event) {
            const {current} = this.pagination
            const {checked} = event.target
            this.checkAll = checked
            this.apartments = this.apartments.map(a => ({...a, checked}))
            this.apartments.forEach(a => {
                const index = this.checkoutList.findIndex(ch => ch.id === a.id)
                if (a.checked) {
                    if (index === -1) {
                        this.checkoutList.push({checked, id: a.id, page: current})
                    }
                } else {
                    if (index !== -1) {
                        this.checkoutList.splice(index, 1)
                    }
                }
            })
        },

        limitChanged() {
            this.changeFetchLimit()
        },

        async fetchContractList() {
            this.showLoading = true

            const {object} = this.$route.params
            this.checkAll = false
            await api.objectsV2.fetchObjectApartments(object, this.query)
                .then((response) => {
                    this.$emit('counter', response.data.counts)
                    this.pagination = response.data.pagination
                    this.header.breadcrumbs[1].content.path = response.data?.items[0]?.object?.name
                    this.showByValue = response.data.pagination.perPage
                    this.apartments = response.data.items.map((item) => {
                        const isChecked = this.checkoutList.find(ch => ch.id === item.id)
                        if (isChecked) {
                            return {
                                ...item,
                                checked: true
                            }
                        } else {
                            return {
                                ...item,
                                checked: false
                            }
                        }
                    })
                    this.checkAll = this.apartments.every(apm => apm.checked)
                }).catch((err) => {
                    this.toastedWithErrorCode(err)
                })
                .finally(() => {
                    this.showLoading = false
                })
        },


        async getFilterFields() {
            const {object} = this.$route.params

            await api.objectsV2.fetchObjectFields(object)
                .then((res) => {
                    this.filterOptions = res.data
                    delete this.filterOptions['blocks']
                    Object.entries(this.filterOptions).forEach(([key, value]) => {
                        if (value) {
                            value.forEach((ch, index) => {
                                if (ch && ch !== 'null') {
                                    this.filterOptions[key][index] = {value: ch, text: ch}
                                }
                            })
                        }
                    })
                }).catch((err) => {
                    this.toastedWithErrorCode(err)
                })
                .finally(() => {
                    this.showLoading = false
                })
        },


        changeFetchLimit() {
            const query = {
                ...this.query, page: this.query.page || 1
            }
            const limit = this.showByValue
            this.pushRouter({...query, limit})
        },

        replaceRouter(query) {
            const sortQuery = sortObjectValues(query)
            this.$router.replace({query: sortQuery})
        },

        pushRouter(query) {
            const sortQuery = sortObjectValues(query)
            this.$router.push({query: sortQuery})
        },

        changeCurrentPage(page) {
            const currentPage = this.query.page
            if (page === currentPage) return
            this.replaceRouter({...this.query, page})
        },


        async filteredForm() {
            Object.entries(this.filter).forEach(([keyField, value]) => {
                this.query[keyField] = value
            })
            this.query['page'] = '1'
            this.pushRouter(this.query)
        },

        filterItems() {
            this.filteredForm()
            this.pushRouter()
        },

        resetFilterFields() {
            this.filter.rooms = []
            this.filter.area = []
            this.filter.floors = []
            this.pushRouter(this.filter)
        },

        setFilterProperties() {
            this.filter.rooms = this.query.rooms
            this.filter.area = this.query.area
            this.filter.floors = this.query.floors
            this.filter.number = this.query.number
        },

        openFilterContent() {
            this.$refs['filter-modal'].show()
        },

        filterBySearchContent(event) {
            this.search = event
            event ? this.query['number'] = [event] : delete this.query['number']
            this.pushRouter(this.query)
        },

        inputFilterObject() {

        }

    }
}
</script>

<style lang="scss" scoped>

@import "@/assets/scss/utils/pagination.scss";
@import "@/assets/scss/utils/b-table-redesign.scss";

::v-deep .table.b-table > thead > tr > [aria-sort=ascending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=ascending] {
    background-size: 20px;
    background-position: right calc(2rem / 6) center !important;
    background-image: url('../../../assets/icons/icon-arrow-down.svg') !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort=descending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=descending] {
    background-size: 20px;
    background-position: right calc(2rem / 6) center !important;
    background-image: url('../../../assets/icons/icon-arrow-down.svg') !important;
}

.search__content {
    margin-top: 0;
}

.apartment-list-filter {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 70vh;
}

.apartments__lock {
    position: absolute;
    left: 0;
    top: 25%;
    transform: translateY(-30%);
}


.filter-modal-content {
    padding-top: 2rem;
    padding-bottom: 2rem;
}


</style>