<template>
    <div class="apartment-list-filter">
        <div>
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
                @sort-changed="sortingChanged"
                :selectable="selectable"
                select-mode="single"
                @row-selected="onRowSelected"
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
                  <span v-if="data.item.is_sold && data.item.order.status === 'available'">
                    <base-checkbox
                        :checked="data.item.checked"
                        @input="activateApartment(data,$event)"
                    />
                  </span>
                </template>
                <template #cell(number)="data" class="p-0">
                    <div class="d-flex position-relative">
                        <div v-if="!data.item.is_sold" class="apartments__lock">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                class="svg-lock-button"
                            >
                                <path
                                    d="M17 9V7C17 4.2 14.8 2 12 2C9.2 2 7 4.2 7 7V9C5.3 9 4 10.3 4 12V19C4 20.7 5.3 22 7 22H17C18.7 22 20 20.7 20 19V12C20 10.3 18.7 9 17 9ZM9 7C9 5.3 10.3 4 12 4C13.7 4 15 5.3 15 7V9H9V7Z"
                                />
                            </svg>
                        </div>
                        <span style="padding-left: 20px">{{ data.item.number }}</span>
                    </div>
                </template>

                <template #cell(area)="data">
                    <span v-if="data.item.plan"> {{ data.item.plan.area }} м² </span>
                </template>

                <template #cell(balcony)="data">
          <span v-if="data.item.plan.balcony">
            {{ data.item.plan.balcony_area }} м²
          </span>

                    <span v-else>
            {{ $t("no") }}
          </span>
                </template>

                <template #cell(price)="data">
          <span v-if="data.item.order.status !== 'sold' && data.item.order.status !== 'closed' && data.item.is_sold">
            {{
                  data.item.prices.price
                      | number("0,0.00", {
                      thousandsSeparator: " ",
                      decimalSeparator: ",",
                  })
              }}
          {{ $t("ye") }}
          </span>
                </template>

                <template #cell(status)="data">
          <span v-if="!data.item.is_sold" class="disable">
            {{ $t('not_for_sale') }}
          </span>
                    <span v-else :class="getStatus(data.item.order.status).class">
              {{ getStatus(data.item.order.status).statusText }}
          </span>
                </template>

                <template #cell(actions)="data">
                    <div class="float-right">
                        <div class="dropdown my-dropdown dropleft">
                            <button
                                type="button"
                                class="dropdown-toggle"
                                data-toggle="dropdown"
                            >
                                <i class="far fa-ellipsis-h"></i>
                            </button>

                            <div class="dropdown-menu">
                                <template v-if="hasPermission">
                                    <!-- Редактировать -->
                                    <b-link
                                        v-if="editPermission"
                                        class="dropdown-item dropdown-item--inside"
                                        @click="[(edit = true), (apartment_id = data.item.id)]"
                                        v-b-modal.modal-edit
                                    >
                                        <i class="far fa-pencil"></i> {{ $t("edit") }}
                                    </b-link>


                                    <!--        Вернуть к продаже          -->
                                    <b-link
                                        v-if="(isSoldPermission) && data.item.is_sold && data.item.order.status === 'available'"
                                        @click="openSoldModal(data.item)"
                                        class="dropdown-item dropdown-item--inside"
                                    >
                                        <i class="far fa-unlock"></i> {{ $t("remove_from_sale") }}
                                    </b-link>

                                    <b-link
                                        v-if="(isSoldPermission) && !data.item.is_sold && data.item.order.status === 'available'"
                                        @click="openSoldModal(data.item)"
                                        class="dropdown-item dropdown-item--inside"
                                    >
                                        <i class="far fa-lock"></i> {{ $t("return_to_sale") }}
                                    </b-link>
                                </template>

                                <!--                &lt;!&ndash;  Забронировать &ndash;&gt;-->
                                <!--                <b-link-->
                                <!--                    v-if="-->
                                <!--                                    data.item.is_sold &&-->
                                <!--                                    getPermission.apartments &&-->
                                <!--                                      getPermission.apartments.reserve &&-->
                                <!--                                      data.item.order.status === 'available'-->
                                <!--                                  "-->
                                <!--                    @click="[(reserve = true), (apartment_id = data.item.id)]"-->
                                <!--                    v-b-modal.modal-reserve-create-->
                                <!--                    class="dropdown-item dropdown-item&#45;&#45;inside"-->
                                <!--                >-->
                                <!--                  <i class="far fa-calendar-check"></i>-->
                                <!--                  {{ $t("apartments.list.book") }}-->
                                <!--                </b-link>-->

                                <!--                &lt;!&ndash; Посмотреть клиент  &ndash;&gt;-->
                                <!--                <b-link-->
                                <!--                    v-if="clientsView(data)"-->
                                <!--                    @click="ReserveInfo(data.item)"-->
                                <!--                    class="dropdown-item dropdown-item&#45;&#45;inside"-->
                                <!--                >-->
                                <!--                  <i class="far fa-eye"></i>-->
                                <!--                  {{ $t("apartments.list.view_client") }}-->
                                <!--                </b-link>-->

                                <!--                &lt;!&ndash;  Информация о менеджера  &ndash;&gt;-->
                                <!--                <b-link-->
                                <!--                    v-if="data.item.order.status === 'booked' && data.item.order.user.id !== getMe.user.id-->
                                <!--                                  "-->
                                <!--                    @click="getInfoReserve(data.item)"-->
                                <!--                    v-b-modal.modal-view-info-manager-->
                                <!--                    class="dropdown-item dropdown-item&#45;&#45;inside"-->
                                <!--                >-->
                                <!--                  <i class="far fa-info-circle"></i>-->
                                <!--                  {{ $t("apartments.list.view_manager") }}-->
                                <!--                </b-link>-->

                                <!--  Подробная информация  -->
                                <router-link
                                    :to="{
                        name: 'apartment-view',
                        params: {
                          object: $route.params.object,
                          id: data.item.id
                        }
                    }"
                                    :class="'dropdown-item dropdown-item--inside'"
                                >
                                    <i class="far fa-eye"></i>
                                    {{ $t("apartments.list.more") }}
                                </router-link>

                                <!-- Подробная информация  -->

                                <!--                &lt;!&ndash;  Оформить &ndash;&gt;-->
                                <!--                <b-link-->
                                <!--                    @click="orderHold([data.item.id])"-->
                                <!--                    :class="'dropdown-item dropdown-item&#45;&#45;inside'"-->
                                <!--                    v-if="allowViewWhenProcessing(data) && !statusHold(data)"-->
                                <!--                >-->
                                <!--                  <i class="far fa-ballot-check"></i>-->
                                <!--                  {{ $t("apartments.list.confirm") }}-->
                                <!--                </b-link>-->

                                <!--                &lt;!&ndash;  Оформить when processing  &ndash;&gt;-->
                                <!--                <b-link-->
                                <!--                    @click="goOrderHold([data.item.order.id])"-->
                                <!--                    :class="'dropdown-item dropdown-item&#45;&#45;inside'"-->
                                <!--                    v-if="allowViewWhenProcessing(data) && statusHold(data)"-->
                                <!--                >-->
                                <!--                  <i class="far fa-ballot-check"></i>-->
                                <!--                  Продолжить оформление-->
                                <!--                </b-link>-->


                            </div>
                        </div>
                    </div>
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
                    <k-form-select
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
                    </k-form-select>
                </div>

            </div>

            <!--      <div>-->
            <reserve-add
                v-if="
                  reserve || getPermission.apartments &&
                    getPermission.apartments.reserve
                "
                :apartment="apartment_id"
                @CreateReserve="CreateReserveSuccess"
            ></reserve-add>

            <!--        <filter-form-->
            <!--            v-if="getPermission.apartments && getPermission.apartments.filter"-->
            <!--            @filteredForm="filteredForm"-->
            <!--            :filtered="filter"-->
            <!--        ></filter-form>-->

            <!--        <view-client-->
            <!--            v-if="info_reserve"-->
            <!--            @CancelReserve="CloseReserveInfo"-->
            <!--            :apartment-data="apartment_preview"-->
            <!--        ></view-client>-->

            <edit-modal
                v-if="editPermission"
                :apartment="apartment_id"
                @EditApartment="EditApartment"
            ></edit-modal>


            <base-modal ref="is-sold" design="auto-height">
                <template #header>
                    <div class="d-flex align-items-center justify-content-between">
                        <!--    TITLE      -->
                        <div class="title">
                            <template v-if="reSoldItem && !reSoldItem.is_sold">
                                Вернуть к продаже
                            </template>
                            <template v-else>
                                Снять с продажи
                            </template>
                            <!--              {{ $t('apartments.agree.number')  }}-->
                        </div>
                        <!--   CLOSE    -->
                        <div class="go__back" @click="closeSoldModal">
                            <BaseCloseIcon :width="56" :height="56"/>
                        </div>
                    </div>
                </template>

                <template #main>
                    <div>
                        <p class="label">
                            Для завершение действии необходим комментарий
                        </p>
                        <base-input
                            v-model="soldComment"
                            :label="true"
                            placeholder="Комментарий"
                            class="w-100"
                        />
                    </div>
                </template>
                <template #footer>
                    <div class="d-flex justify-content-between" style="gap: 2rem">
                        <base-button
                            @click="closeSoldModal"
                            :fixed="true"
                            :text="$t('cancel')"
                        />
                        <base-button
                            @click="toggleApartmentToSale"
                            :disabled="!soldComment"
                            :fixed="true"
                            design="violet-gradient"
                            :text="$t('apply')"
                        />
                    </div>
                </template>
            </base-modal>

            <!--        &lt;!&ndash;        <info-manager-modal&ndash;&gt;-->
            <!--        &lt;!&ndash;            :manager-data="this.manager_apartment"&ndash;&gt;-->
            <!--        &lt;!&ndash;            @ManagerInfo="ManagerInfo"&ndash;&gt;-->
            <!--        &lt;!&ndash;        ></info-manager-modal>&ndash;&gt;-->

            <!--        <agree-modal-->
            <!--            v-if="selected.confirm"-->
            <!--            :apartments="selected.values"-->
            <!--            @successAgree="successAgree"-->
            <!--            @CloseAgree="CloseAgree"-->
            <!--        ></agree-modal>-->

            <!--        <success-agree :contract="contract"></success-agree>-->
            <!--      </div>-->

        </div>

        <BaseCheckboxModal
            :chosen="checkedApartments.length"
            @go-to-contract="makeContract"
        />

    </div>
</template>

<script>
// import {mapActions, mapMutations, mapGetters} from "vuex";
import api from "@/services/api"
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import {isPrimitiveValue, sortObjectValues} from "@/util/reusable";
import BaseLoading from "@/components/Reusable/BaseLoading";
import {mapGetters} from "vuex";
// import Filter from "@/components/Dashboard/Apartment/Components/ApartmentsFilter";
import ReserveAdd from "@/components/Dashboard/Apartment/Components/Reserve";
// import ViewClient from "@/components/Dashboard/Apartment/ViewClient";
import EditApartment from "@/components/Dashboard/Apartment/Components/Edit";
import ApartmentsPermission from "@/permission/apartments";
import BaseCheckbox from "@/components/Reusable/BaseCheckbox";
import BaseCheckboxModal from "@/components/Reusable/BaseCheckboxModal";
// import InfoManager from "@/components/Dashboard/Apartment/InfoManager";
// import AgreeMultiple from "@/components/Dashboard/Apartment/Components/AgreeMultiple";
// import SuccessAgree from "@/components/Dashboard/Apartment/Components/SuccessAgree";
import {orderApartment} from "@/util/apartment";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseInput from "@/components/Reusable/BaseInput";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import {KFormSelect} from "@/components/ui-components/form-select";

export default {
    name: 'ObjectTable',
    components: {
        BaseCheckboxModal,
        BaseCheckbox,
        BaseArrowRightIcon,
        BaseArrowLeftIcon,
        KFormSelect,
        BaseLoading,
        BaseModal,
        BaseInput,
        BaseButton,
        BaseCloseIcon,
        // "filter-form": Filter,
        "reserve-add": ReserveAdd,
        // "view-client": ViewClient,
        "edit-modal": EditApartment,
        // "info-manager-modal": InfoManager,
        // "agree-modal": AgreeMultiple,
        // "success-agree": SuccessAgree,

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

        return {
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
                // {
                //   key: "building.name",
                //   label: "ЗДАНИЯ",
                //   sortable: true,
                // },
                // {
                //   key: "block.name",
                //   label: "КОРПУС",
                // },
                // {
                //   key: "is_promo",
                //   label: this.$t('promo.in_promo'),
                //   sortable: true,
                // },
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
                {
                    key: "balcony",
                    label: this.$t('objects.create.plan.balcony_area'),
                    sortable: true,
                },
                // {
                //   key: "price_area",
                //   label: this.$t('apartments.list.price'),
                //   sortable: true,
                // },
                {
                    key: "price",
                    label: this.$t('apartments.list.price'),
                    sortable: true,
                },
                // {
                //   key: "price_currency",
                //   label: this.$t('apartments.list.price'),
                //   sortable: true,
                // },
                {
                    key: "status",
                    label: this.$t('apartments.list.status'),
                },
                {
                    key: "actions",
                    label: "",
                },
            ],
            sortBy: "",
            sortDesc: false,
            currentPage: 1,
            showLoading: false,
            selectMode: "single",
            unfinishedContracts: [],
            contract: {},
            selectable: true,
            selected: {
                view: false,
                confirm: false,
                values: [],
            },
            soldComment: null,
            reSoldItem: null,
            checkoutList: [],
            checkAll: false,
            editPermission: ApartmentsPermission.getApartmentEditPermission(),
            isSoldPermission: ApartmentsPermission.getApartmentIsSoldPermission(),
            viewPermission: ApartmentsPermission.getApartmentViewPermission()
        }
    },

    async created() {
        this.filter = this.query
        this.currentPage = Number(this.filter.page);
        await this.fetchContractList()
    },
    computed: {
        ...mapGetters(["getPermission", "getMe"]),
        // ...mapActions([ "fetchReserveClient"]),
        hasPermission() {
            return this.editPermission || this.isSoldPermission || this.viewPermission
        },

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
        orderApartment,
        async makeContract() {
            const ids = this.checkoutList.map(ch => ch.id)
            this.startLoading()
            await this.orderApartment(ids)
            await this.finishLoading()
        },
        startLoading() {
            this.showLoading = true
        },
        finishLoading() {
            this.showLoading = false
        },
        closeSoldModal() {
            this.$refs['is-sold'].closeModal()
            this.soldComment = null
        },
        openSoldModal(data) {
            this.reSoldItem = data
            this.$refs['is-sold'].openModal()
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
                    if (index === -1 && a.is_sold && a.order.status === 'available') {
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
            let query = sortObjectValues(this.query)
            const queryArrayFareList = [
                'status',
                'area',
                'rooms',
                'floors',
                'number',
                'object',
                'blocks'
            ]

            const queryPair = Object.entries(query)
            queryPair.forEach(([key, value]) => {
                const isNotPrimitive = queryArrayFareList.includes(key)
                const valueFare = isPrimitiveValue(value)
                if (isNotPrimitive && valueFare) {
                    query[key] = [value]
                }
            })

            const {object} = this.$route.params
            this.checkAll = false
            await api.objectsV2.fetchObjectApartments(object, query)
                .then((response) => {
                    this.$emit('counter', response.data.counts)
                    this.pagination = response.data.pagination
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
        changeFetchLimit() {
            const query = {
                ...this.query, page: 1
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

        onRowSelected(items) {
            // this.$router.push({
            //   name: "apartment-view",
            //   params: {object: this.$route.params.object, id: items[0].id},
            // });
            this.$emit('show-express-sidebar', items[0])
        },

        sortingChanged(val) {
            this.showLoading = true
            this.filter.filtered = true;
            this.filter.sort_by = val.sortBy;
            this.filter.order_by = val.sortDesc ? "desc" : "asc";

            this.$router.push({
                name: "apartments",
                params: this.$route.params.object,
                query: this.filter,
            }).then(() => {
                const element = document.getElementById("my-table");
                element.scrollIntoView();
            });

        },

        moment: function () {
            return this.$moment();
        },

        getStatus(value) {
            switch (value) {
                case 'available': {
                    return {statusText: this.$t('object.status.available'), class: 'teal'}
                }
                case 'waiting':
                case 'sold': {
                    return {statusText: this.$t('object.status.sold'), class: 'gray'}
                }
                case 'closed': {
                    return {statusText: this.$t('object.status.sold'), class: 'gray'}
                }
                case 'booked': {
                    return {statusText: this.$t('object.status.booked'), class: 'yellow'}
                }
                case 'contract': {
                    return {statusText: this.$t('object.status.contract'), class: 'blue'}
                }
                case 'hold': {
                    return {statusText: this.$t('object.status.hold'), class: 'yellow'}
                }
                default:
                    return {statusText: this.$t('object.status.available'), class: 'teal'}
            }
        },


        async EditApartment() {
            this.apartment_id = 0;
            this.edit = false;

            await this.$router.push({
                name: "apartments",
                query: this.filter,
            });

            // if (this.filter.filtered) await this.fetchApartments(this);
            // else await this.fetchApartments(this);
        },

        CreateReserve(id) {
            this.reserve = true;
            this.apartment_id = id;
        },

        // CreateReserveSuccess() {
        //     this.fetchApartments(this).then(() => {
        //         location.reload();
        //     });
        // },

        CloseReserveInfo() {
            this.info_reserve = false;
            this.apartment_preview = {};
            // this.fetchApartments(this).then(() => {
            //     location.reload();
            // });
        },

        ReserveInfo(apartment) {
            this.info_reserve = true;
            this.apartment_preview = apartment;
            this.order_id = apartment.order.id;
            // this.fetchReserveClient(this).then(() => {
            //     this.$root.$emit("bv::show::modal", "modal-view-reserved-client");
            // });
        },

        getInfoReserve(apartment) {
            this.info_manager = true;
            this.manager_apartment = apartment.order.user;
        },

        async orderHold(arr) {
            this.loading = true;
            await api.orders.holdOrder(arr).then((res) => {
                this.loading = false;
                if (res) {
                    // localStorage.setItem("order", JSON.stringify(res.data));
                    this.$router.push({
                        name: "confirm-apartment",
                        params: {id: res.data.uuid},
                    })
                    this.selected.view = false;
                    this.selected.values = [];
                    this.selectable = true;
                }
            });
        },

        goOrderHold(order_id) {
            this.selected.view = false;
            this.selected.values = [];
            this.selectable = true;
            this.$router.push({
                name: "confirm-apartment",
                params: {id: order_id[0]},
            })
        },

        async toggleApartmentToSale() {
            if (this.soldComment) {
                const body = {
                    comment: this.soldComment
                }
                const id = this.$route.params.object
                const apartmentUID = this.reSoldItem.id
                await api.apartmentsV2.isAvailableToSold(id, apartmentUID, body).then(response => {
                    const updatingIndex = this.apartments.findIndex((apartment) => apartment.id === response.data.id)
                    if (updatingIndex !== -1) {
                        this.apartments.splice(updatingIndex, 1, response.data)
                    }
                }).finally(() => {
                    this.closeSoldModal()
                })
            }

        },

        statusHold(data) {
            return data.item.order.status === 'hold'
        },

        allowViewWhenProcessing(data) {
            const status = data.item.order.status
            const userId = data.item.order['user_id']

            const permissionApartment = this.getPermission.apartments
            const sameUserId = userId === this.getMe.user.id

            const unnecessaryStatus = ['sold', 'contract']
            const notSolidOrContract = !unnecessaryStatus.includes(status)

            const firstOption = notSolidOrContract && status === 'booked' && sameUserId && permissionApartment.contract
            const secondOption = !notSolidOrContract && permissionApartment && permissionApartment.root_contract
            const thirdOption = notSolidOrContract && status === 'available' && permissionApartment.contract

            return (firstOption || secondOption || thirdOption) && status === 'hold'
        },

        clientsView(data) {
            const firstOption = data.item.order.status === 'booked' && data.item.order.user.id === this.getMe.user.id
            const secondOption = (this.getPermission.apartments && this.getPermission.apartments.root_contract && data.item.order.status === 'booked')
            return firstOption || secondOption
        },

        async filteredForm(event) {
            this.filter = event;
            this.selected.view = false;
            this.selected.values = [];
            this.selectable = true;
            this.scrollActive = true;
            this.page = 1;
            this.filter.page = 1;
            this.currentPage = this.filter.page;

            await this.$router.push({
                name: "apartments",
                query: this.filter,
            });

            // const vm = this;
            // await this.fetchApartments(vm)
        },
    },

};
</script>

<style scoped lang="scss">

@import "@/assets/scss/utils/pagination";

.search__content {
    margin-top: 0;
}

::v-deep .row__head__bottom-border {
    border-bottom: 2px solid var(--gray-200) !important;

    th:first-child {
        input {
            width: 1rem;
            height: 1rem;
        }
    }
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
            font-size: 12px;
            line-height: 14px;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: var(--gray-400) !important;
            padding: 1.125rem 1rem;
            vertical-align: middle;
        }

        thead tr th:first-child {
            padding-left: 0.75rem;
        }

        td {
            font-family: Inter, sans-serif;
            font-weight: 600;
            font-size: 16px;
            line-height: 22px;
            color: var(--gray-600);
            vertical-align: middle;
        }
    }


    .table.b-table[aria-busy=true] {
        opacity: 1 !important;
    }


    .yellow, .teal, .gray, .blue, .disable {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 9px;
        border-radius: 24px;
        min-width: max-content;
    }

    .yellow {
        color: var(--yellow-600);
        background-color: var(--yellow-100);
    }

    .teal {
        color: var(--teal-600);
        background-color: var(--teal-100);
    }

    .blue {
        color: var(--light-blue-600);
        background-color: var(--light-blue-100);
    }

    .gray {
        color: var(--red-600);
        background-color: var(--red-100);
    }

    .disable {
        color: var(--gray-400);
        background-color: var(--gray-100);
        min-width: max-content;
    }

}


::v-deep .table.b-table > thead > tr > [aria-sort="none"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="none"] {
    background-position: right calc(2rem / 5) center !important;
    //background-position: right !important;
    padding-right: 20px;
}

::v-deep .table.b-table > thead > tr > [aria-sort=ascending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=ascending] {
    background-position: right calc(2rem / 6) center !important;
    background-size: 20px;
    background-image: url("../../assets/icons/icon-arrow-down.svg") !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort=descending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=descending] {
    background-position: right calc(2rem / 6) center !important;
    background-size: 20px;
    background-image: url("../../assets/icons/icon-arrow-up.svg") !important;
}

.apartments__lock {
    position: absolute;
    left: 0;
    top: 25%;
    transform: translateY(-30%);
}

</style>
