<template>
    <div>
        <!--  FILTER CONTENT  -->
        <filter-content
            ref="filter-content"
            :query="query"
            :default-type-of-view="typeOfView"
            @change-view-type="changeViewType"
            @change-date="changeCalendarDate"
            @sort-items="filterDebts"
            @go-to-today="showCurrentDay"
            @reset-filter-fields="disableFilter"
            @sort-by-search="sortBySearchField"
        />

        <!--  TABLE UI  -->
        <template v-if="showListOfDebtorsTable">
            <b-table
                show-empty
                borderless
                responsive
                sticky-header
                sort-icon-left
                :busy="appLoading"
                :items="tableItems"
                :fields="fields"
                :empty-text="$t('no_data')"
                :sort-by.sync="table.sortBy"
                :sort-desc.sync="table.sortDesc"
                @sort-changed="changeSortSituation"
                @row-clicked="showDebtorViewModal"
                class="table__list"
                thead-tr-class="row__head__bottom-border"
                tbody-tr-class="row__body__bottom-border cursor-pointer"
            >
                <!--  LOADING ANIMATION    -->
                <template #table-busy>
                    <base-loading/>
                </template>

                <template #cell(client)="tableItems">
          <span v-if="tableItems.item.order.friends">
            <span class="friend">
              <BaseStarIcon fill="#7C3AED"/>
            </span>
            <span class="full-name">
              {{ getClientName(tableItems.item.client) }}
            </span>
          </span>
                    <span v-else>
            <span class="full-name">
              {{ getClientName(tableItems.item.client) }}
            </span>
          </span>
                </template>

                <!--  SHOW EMPTY MESSAGE WHEN CONTENT NOT FOUND   -->
                <template class="text-center" #empty>
                    <div class="d-flex justify-content-center align-items-center flex-column not__found">
                        <p class="head">Должники не были найдены</p>
                        <p>Попробуйте ввести другие данные для поиска</p>
                    </div>
                </template>
            </b-table>

            <!-- PAGINATION   -->
            <base-pagination
                :default-count-view="parseInt(tablePagination.limit)"
                :pagination-count="parseInt(tablePagination.total)"
                :pagination-current="parseInt(tablePagination.current)"
                @change-page="changeCurrentPage"
                @change-view="changeCountOfView"
            />
        </template>

        <!-- MONTHLY UI   -->
        <base-huge-calendar-ui
            class="mt-4"
            ref="huge-calendar-ui"
            v-if="showMonthly"
            :items="month.items"
            :starter="month.starter"
            :get-full-name="getFullName"
            @show-debtor-view-modal="showDebtorViewModal"
            @go-more-detail="goMoreDetail"
        >
        </base-huge-calendar-ui>

        <!--  WEEKLY UI   -->
        <weekly-debts-ui
            class="mt-4"
            v-if="showWeeklyDebts"
            :items="week.items"
            :get-full-name="getFullName"
            @show-debtor-view-modal="showDebtorViewModal"
        />

        <!--  APP LOADING  -->
        <base-loading v-if="appLoading"/>

        <!--  DEBTOR VIEW MODAL  -->
        <base-right-modal
            ref="debtor-view-modal"
            @show="getMoreDataAboutDebt"
        >
            <template #modal-title>
        <span class="pl-3 modal-title">
          {{ $t('payments.contract') }}
          <span class="color-violet-600">{{ debtorViewModalItem.order.contract }}</span>
        </span>
            </template>

            <base-loading v-if="debtorViewModalItem.appLoading"/>

            <template v-else>
                <!--   CONTRACT DETAILS     -->
                <div class="contract-details">
                    <!--    CONTRACT DETAILS    -->
                    <p class="contract-details-title">{{ $t('contract_details') }}</p>
                    <!--  CLIENT INFORMATION      -->
                    <output-information
                        :property="`${ $t('client') }`"
                        :value="getFullName(debtorViewModalItem.client)"
                        class="mt-4 mb-4"
                    />
                    <!--    PHONE NUMBER    -->
                    <output-information
                        :property="`${ $t('phone') }`"
                        :value="phonePrettier(debtorViewModalItem.client.phone)"
                        class="mt-4 mb-4"
                    />
                    <!--   CLIENT TYPE     -->
                    <output-information
                        :property="`${ $t('client_type') }`"
                        :value="getClientType(debtorViewModalItem.order)"
                        class="mt-4 mb-4"
                    />
                    <!--   CONTRACT PRICE     -->
                    <output-information
                        :price="true"
                        :property="`${ $t('contract_price') }`"
                        :value="pricePrettier(debtorViewModalItem.amount)"
                        class="mt-4 mb-4"
                    />
                    <!--   INITIAL PRICE     -->
                    <output-information
                        :price="true"
                        :property="`${ $t('payments.initial_fee') }`"
                        :value="pricePrettier(debtorViewModalItem.order.initial_payment)"
                        class="mt-4 mb-4"
                    />
                    <!--   INSTALLMENT PRICE    -->
                    <output-information
                        v-if="debtorViewModalItem.order.installment_payment"
                        :price="true"
                        :property="`
              ${ $t('payments.installment') }
              ( ${debtorViewModalItem.order.installment_month} ${ $t('month') })
              `"
                        :value="pricePrettier(debtorViewModalItem.order.installment_payment)"
                        class="mt-4 mb-4"
                    />
                </div>

                <!--    DEBT DETAILS    -->
                <div class="contract-details">
                    <!--    TITLE    -->
                    <p class="contract-details-title">{{ $t('debt_details') }}</p>
                    <!--   DEBT PRICE    -->
                    <output-information
                        :price="true"
                        :property="`${ $t('debt') }`"
                        :value="pricePrettier(subtractResult(debtorViewModalItem.amount,debtorViewModalItem.amount_paid))"
                        class="mt-4 mb-4"
                    />
                    <!--   DEBT DATE    -->
                    <output-information
                        :property="`${ $t('date') }`"
                        :value="formatDateWithDot(debtorViewModalItem.date_payment)"
                        class="mt-4 mb-4"
                    />
                </div>
            </template>

            <template #modal-footer>
                <base-button
                    :text="$t('go_to_contract')"
                    :fixed="true"
                    @click="$router.push({ name: 'contracts-view', params:{ id:debtorViewModalItem.order.uuid } })"
                />
            </template>
        </base-right-modal>
    </div>
</template>

<script>
import {formatDateWithDot, formatToPrice, phonePrettier, sortInFirstRelationship} from "@/util/reusable";
import {dateConvertor, dateProperties, formatDateToYMD} from "@/util/calendar";
import {debtorsV2} from "@/services/api";
import BaseLoading from "@/components/Reusable/BaseLoading";
import BasePagination from "@/components/Reusable/Navigation/BasePagination";
import FilterContent from "@/components/Debtors/FilterContent";
import BaseHugeCalendarUi from "@/components/Debtors/BaseHugeCalendarUi";
import BaseRightModal from "@/components/Reusable/BaseRightModal";
import OutputInformation from "@/components/Elements/Outputs/OutputInformation";
import WeeklyDebtsUi from "@/components/Debtors/WeeklyDebtsUi";
import BaseStarIcon from "@/components/icons/BaseStarIcon";
import BaseButton from "@/components/Reusable/BaseButton";

export default {
    name: "Debtors",
    components: {
        BaseStarIcon,
        BaseLoading,
        BasePagination,
        FilterContent,
        BaseHugeCalendarUi,
        BaseRightModal,
        OutputInformation,
        WeeklyDebtsUi,
        BaseButton
    },
    data() {
        const query = Object.assign({}, this.$route.query)
        const hasStarterMoment = query.hasOwnProperty('starter_moment')
        let sortBy = query.sort_by
        let orderBy = query.order_by

        const table = {
            sortBy: undefined,
            sortDesc: undefined
        }

        const fields = {
            date: 'date',
            price: 'amount',
            client: 'client',
            'contract_number': 'order.contract',
        }

        if (sortBy) {
            table.sortBy = fields[sortBy]
        }

        if (orderBy === 'desc') {
            table.sortDesc = true
        } else if (orderBy === 'asc') {
            table.sortDesc = false
        }

        const {month, year} = dateProperties(new Date())
        let starter = formatDateToYMD(new Date(year, month, 1))
        if (hasStarterMoment) {
            starter = query.starter_moment
        }

        let limit = 10

        if (typeof query.limit === 'string') {
            if (parseInt(query.limit)) {
                limit = parseInt(query.limit)
            }
        }

        let typeOfView = query.type_of_view ?? 'list' /* list / month / week / day */

        return {
            table,
            list: {
                items: [],
                pagination: {
                    total: 1,
                    current: 1,
                    limit
                },
            },
            month: {
                starter,
                items: []
            },
            week: {
                starter,
                items: []
            },
            day: {
                starter,
                items: [],
                pagination: {
                    total: 1,
                    current: 1,
                    limit
                },
            },
            debtorViewModalItem: {
                appLoading: false,
                order: {
                    installment_payment: null,
                    installment_month: null
                },
                client: {}
            },
            typeOfView,
            lastParams: null,
            appLoading: false
        }
    },
    computed: {
        fields() {
            return [
                {
                    key: "order.contract",
                    label: this.$t("contracts.table.contract"),
                    sortable: true
                },
                {
                    key: "client",
                    label: this.$t("contracts.table.client"),
                    formatter: (client) => client.last_name.lotin + ' ' + client.first_name.lotin,
                    sortable: true
                },
                {
                    key: "client.phone",
                    label: this.$t("contracts.table.phone_number"),
                    formatter: (phone) => phonePrettier(phone)
                },
                {
                    key: "amount",
                    label: this.$t("contracts.table.cost"),
                    formatter: (price) => formatToPrice(price) + ' ' + this.$t('ye'),
                    sortable: true
                },
                {
                    key: "date",
                    label: this.$t("contracts.table.date"),
                    formatter: (date) => formatDateWithDot(date),
                    sortable: true
                },
                /*
                  {
                    key: "object",
                    label: this.$t("contracts.table.object"),
                    formatter: (object) => object.name
                  },
                */
            ]
        },
        tableItems() {
            if (this.typeOfView === 'day') {
                return this.day.items
            }
            return this.list.items
        },
        tablePagination() {
            if (this.typeOfView === 'day') {
                return this.day.pagination
            }
            return this.list.pagination
        },
        showListOfDebtorsTable() {
            return this.type === 'list'
        },
        showMonthly() {
            return this.typeOfView === 'month' && this.month.items.length
        },
        showWeeklyDebts() {
            return this.typeOfView === 'week' && this.week.items.length
        },
        query() {
            return Object.assign({}, this.$route.query)
        },
        type() {
            switch (this.typeOfView) {
                case 'month':
                case 'week': {
                    return 'calendar'
                }
                default: {
                    return 'list'
                }
            }
        }
    },
    created() {
        this.initStarterMoment()
        this.initDebtorUi()
    },
    methods: {
        getClientName(client) {
            let language = 'kirill'
            if (this.$i18n.locale === 'uz') {
                language = 'lotin'
            }
            const {first_name, second_name} = client
            return this.clientName(first_name, language) + ' ' + this.clientName(second_name, language)
        },
        clientName(multiName, language) {
            const lastNameByLang = multiName[language]
            if (lastNameByLang) {
                return lastNameByLang
            } else {
                const lastNameOtherLang = language === 'kirill' ? multiName['lotin'] : multiName['kirill']
                if (lastNameOtherLang) return lastNameOtherLang
            }

            return ''
        },
        phonePrettier: (phone) => formatToPrice(phone),
        pricePrettier: (price) => formatToPrice(price),
        formatDateWithDot,
        subtractResult(a, b) {
            if (b) {
                return a - b
            }
            return a
        },
        getFullName(client) {
            if (client && Object.keys(client).length) {
                const {first_name, last_name} = client
                const language = this.$i18n.locale === 'ru' ? 'kirill' : 'lotin'
                return last_name[language] + ' ' + first_name[language]
            }
            return ''
        },
        async getMoreDataAboutDebt() {
            this.debtorViewModalItem.appLoading = true
            await debtorsV2.getMoreDataAboutDebt(this.debtorViewModalItem.uuid)
                .then((response) => {
                    this.debtorViewModalItem = response.data
                })
                .catch((error) => {
                    this.toastedWithErrorCode(error)
                })
                .finally(() => {
                    this.debtorViewModalItem.appLoading = false
                })
        },
        getClientType(order) {
            if (order.friends) {
                return this.$t('familiar')
            } else {
                return this.$t('unfamiliar')
            }
        },
        changeTypeOfView(type) {
            this.typeOfView = type
        },
        sortBySearchField(searchingValue) {
            let search = searchingValue
            if (!search) {
                search = undefined
            }
            this.changeRouterQuery({
                search
            })
            this.initDebtorUi()
        },
        changeSortSituation({sortBy, sortDesc}) {
            this.changeRouterQuery({
                page: 1
            })

            const fields = {
                'order.contract': 'contract_number',
                amount: 'price',
                client: 'client',
                date: 'date'
            }
            const sort_by = fields[sortBy]
            this.changeRouterQuery({
                sort_by,
                order_by: sortDesc ? 'desc' : 'asc'
            })
            this.initDebtorUi()
        },
        initStarterMoment() {
            const hasStarterTime = this.query.hasOwnProperty('starter_moment')
            if (!hasStarterTime) {
                const starter_moment = formatDateToYMD(new Date())
                this.changeRouterQuery({starter_moment})
            }
        },
        setStarterMoment(starter_moment) {
            this.changeRouterQuery({starter_moment})
        },
        goMoreDetail(ymd) {
            this.changeRouterQuery({
                starter_moment: ymd
            })
            this.$refs['filter-content'].setViewType('day')
            this.$refs['filter-content'].setCalendarDate(ymd)
            this.changeViewType('day')
        },
        async initDebtorUi() {
            const {
                starterPoint: monthStarter,
                endPoint: monthEnd
            } = this.getDateDistance(41, this.month.starter)

            const {
                starterPoint: weekStarter,
                endPoint: weekEnd
            } = this.getDateDistance(6, this.week.starter)

            const sortQuery = sortInFirstRelationship(this.query)

            let params = {
                type: this.type
            }

            if (this.typeOfView === 'month') {
                params.date = [monthStarter.ymd, monthEnd.ymd]
            } else if (this.typeOfView === 'week') {
                params.date = [weekStarter.ymd, weekEnd.ymd]
            } else {
                params.limit = this.tablePagination.limit
                params.page = this.tablePagination.current
                const hasSortBy = this.query.hasOwnProperty('sort_by')
                const hasOrderBy = this.query.hasOwnProperty('order_by')
                const hasSearchQuery = this.query.hasOwnProperty('search')

                if (hasSortBy) {
                    params.sort_by = this.query.sort_by
                }

                if (hasOrderBy) {
                    params.order_by = this.query.order_by
                }

                if (hasSearchQuery) {
                    params.search = this.query.search
                }
            }

            if (sortQuery && typeof sortQuery.object_id === 'string') {
                sortQuery.object_id = [sortQuery.object_id]
            }

            params = {...params, ...sortQuery}

            /* CLEAR ITEMS ARRAY BEFORE UPDATE */
            this[this.typeOfView].items = []
            const items = await this.fetchItems(params)
            this.lastParams = params
            switch (this.typeOfView) {
                case 'list': {
                    await this.initListItems(items)
                    break
                }
                case 'month': {
                    await this.initMonthItems(items)
                    break
                }
                case 'week': {
                    await this.initWeekItems(items)
                    break
                }
                case 'day': {
                    await this.initDayItems(items)
                    break
                }
            }
        },
        async fetchItems(params) {
            this.appLoading = true
            return await debtorsV2.fetchDebtorsList(params)
                .then((response) => response.data)
                .catch((error) => {
                    this.toastedWithErrorCode(error)
                    return []
                })
                .finally(() => {
                    this.appLoading = false
                })
        },
        getDateDistance(distanceLength, ymd) {
            const moment = dateConvertor(ymd)
            const getMomentDate = moment.getDate()
            const getCurrentDate = moment.getDay()
            let countOfBackDate = (getCurrentDate - 1)
            if (countOfBackDate === -1) {
                countOfBackDate = 6
            }
            const getStarterPoint = dateConvertor(moment).setDate(getMomentDate - countOfBackDate)
            const starterPoint = dateConvertor(getStarterPoint)
            const getStarterPointDate = starterPoint.getDate()
            const getEndPoint = dateConvertor(starterPoint).setDate(getStarterPointDate + distanceLength)
            const endPoint = dateConvertor(getEndPoint)
            return {
                starterPoint: {
                    date: starterPoint,
                    ymd: formatDateToYMD(starterPoint)
                },
                endPoint: {
                    date: endPoint,
                    ymd: formatDateToYMD(endPoint)
                }
            }
        },
        initListItems({items, pagination}) {
            this.list.items = items
            let limit = this.query.limit
            if (!limit) {
                limit = 10
            }
            this.list.pagination = {
                limit: typeof limit === 'string' ? parseInt(limit) : limit,
                ...pagination
            }
        },
        initMonthItems(items) {
            const {starterPoint} = this.getDateDistance(41, this.month.starter)
            let loopItems = []
            loopItems.push({
                ymd: starterPoint.ymd,
                dayOfMonth: starterPoint.date.getDate(),
                dayOfWeek: starterPoint.date.getDay(),
                debts: items[starterPoint.ymd],
                show: false
            })
            for (let i = 1; i < 42; i++) {
                const nextMoment = starterPoint.date.setDate(starterPoint.date.getDate() + 1)
                const loopDate = dateConvertor(nextMoment)
                const loopPoint = formatDateToYMD(loopDate)
                loopItems.push({
                    ymd: loopPoint,
                    dayOfMonth: loopDate.getDate(),
                    dayOfWeek: loopDate.getDay(),
                    debts: items[loopPoint],
                    show: false
                })
            }
            this.month.items = loopItems
        },
        initWeekItems(items) {
            const {starterPoint} = this.getDateDistance(6, this.week.starter)
            let loopItems = []
            loopItems.push({
                ymd: starterPoint.ymd,
                dayOfMonth: starterPoint.date.getDate(),
                dayOfWeek: starterPoint.date.getDay(),
                debts: items[starterPoint.ymd],
                show: false
            })
            for (let i = 1; i < 7; i++) {
                const nextMoment = starterPoint.date.setDate(starterPoint.date.getDate() + 1)
                const loopDate = dateConvertor(nextMoment)
                const loopPoint = formatDateToYMD(loopDate)
                loopItems.push({
                    ymd: loopPoint,
                    dayOfMonth: loopDate.getDate(),
                    dayOfWeek: loopDate.getDay(),
                    debts: items[loopPoint],
                    show: false
                })
            }
            this.week.items = loopItems
        },
        initDayItems({items, pagination}) {
            this.day.items = items
            let limit = this.query.limit
            if (!limit) {
                limit = 10
            }
            this.day.pagination = {
                limit: typeof limit === 'string' ? parseInt(limit) : limit,
                ...pagination
            }
        },
        changeCurrentPage(page) {
            this.changeRouterQuery({
                page
            })

            if (this.typeOfView)

                this.initDebtorUi()
        },
        changeCountOfView(limit) {
            this.changeRouterQuery({
                limit,
                page: 1
            })
            this.initDebtorUi()
        },
        changeViewType(type) {
            if (type !== this.typeOfView) {
                this.typeOfView = type
                const starter = this.query.starter_moment ?? formatDateToYMD(new Date())
                const {year, month, dayOfMonth} = dateProperties(dateConvertor(starter))
                if (type === 'day') {
                    this.day.starter = starter
                    this.refreshRouteQuery({
                        date: [starter, starter],
                        type_of_view: 'day',
                        starter_moment: starter
                    })
                } else {
                    const starter = formatDateToYMD(new Date(year, month, 1))
                    this.refreshRouteQuery({
                        date: undefined,
                        starter_moment: starter,
                        type_of_view: type
                    })
                    if (type === 'month') {
                        this.month.starter = starter
                    } else if (type === 'week') {
                        this.week.starter = formatDateToYMD(new Date(year, month, dayOfMonth))
                    }
                }
                this.initDebtorUi()
            }
        },
        showDebtorViewModal(debt) {
            this.debtorViewModalItem = debt
            this.$refs['debtor-view-modal'].show()
        },
        changeCalendarDate(lastDate) {
            const {year, month, dayOfMonth, ymd} = dateProperties(lastDate)
            switch (this.typeOfView) {
                case 'month': {
                    const ymd = formatDateToYMD(new Date(year, month, 1))
                    if (ymd !== this.month.starter) {
                        this.month.starter = ymd
                        this.month.items = []
                    }
                    break
                }
                case 'week': {
                    const ymd = formatDateToYMD(new Date(year, month, dayOfMonth))
                    if (ymd !== this.week.starter) {
                        this.week.starter = ymd
                        this.week.items = []
                    }
                    break
                }
                case 'day': {
                    if (ymd !== this.day.starter) {
                        this.day.starter = ymd
                        this.changeRouterQuery({
                            date: [this.day.starter, this.day.starter]
                        })
                        this.day.items = []
                    }
                }
            }
            this.initDebtorUi()
        },
        filterDebts({date, price_from, price_to, client_type, object_id}) {
            const type = this.typeOfView
            const query = {price_from, price_to, client_type, object_id}
            for (let [key, value] of Object.entries(query)) {
                if (value === null) {
                    query[key] = undefined
                }
            }
            query.page = undefined
            switch (type) {
                case 'month':
                case 'week' : {
                    this.changeRouterQuery(query)
                    break
                }
                default: {
                    if (date === null) {
                        query.date = undefined
                    } else {
                        query.date = date
                    }
                    this.changeRouterQuery(query)
                }
            }

            this.initDebtorUi()
        },
        showCurrentDay() {
            const {month, year, dayOfMonth} = dateProperties(new Date())
            let firstOfCurrentDay = formatDateToYMD(new Date(year, month, 1))
            if (this.typeOfView === 'week') {
                firstOfCurrentDay = formatDateToYMD(new Date(year, month, dayOfMonth))
            }
            this.setStarterByTypeOfView(firstOfCurrentDay)
        },
        disableFilter() {
            const resetQuery = {
                date: undefined,
                price_from: undefined,
                price_to: undefined,
                client_type: undefined,
                object_id: undefined
            }

            if (this.type === 'calendar') {
                delete resetQuery.date
            }

            this.changeRouterQuery(resetQuery)
            this.initDebtorUi()
        },
        setStarterByTypeOfView(moment) {
            switch (this.typeOfView) {
                case 'month': {
                    this.month.starter = moment
                    break
                }
                case 'week': {
                    this.week.starter = moment
                    break
                }
                case 'day': {
                    this.day.starter = moment
                }
            }
            this.setStarterMoment(moment)
        },
        refreshRouteQuery(query) {
            this.$router.push({
                query
            })
            this.setLimitAndPage()
        },
        changeRouterQuery(query) {
            this.$router.push({
                query: {
                    ...this.query,
                    ...query
                }
            })
            this.setLimitAndPage()
        },
        setLimitAndPage() {
            if (this.typeOfView === 'list') {
                this.list.pagination.current = this.query.page ?? 1
            } else if (this.typeOfView === 'day') {
                this.day.pagination.current = this.query.page ?? 1
            }

            if (this.typeOfView === 'list') {
                this.list.pagination.limit = this.query.limit ?? 10
            } else if (this.typeOfView === 'day') {
                this.day.pagination.limit = this.query.limit ?? 10
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/reusable/table-depend-on-design";

.contract-details {
    margin-top: 3.5rem;

    &-title {
        font-size: 1.5rem;
        color: var(--gray-400);
        font-family: CraftworkSans, serif;
    }
}

.debtor-view-modal {
    padding: 3rem;
    margin: 0;
}

.modal-title {
    font-size: 1.5rem;
    color: var(--gray-600);
    font-family: CraftworkSans, serif;
}

::v-deep .table.b-table > thead > tr > [aria-sort="none"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="none"] {
    background-position: right calc(2rem / 2) center !important;
    padding-right: 20px;
}

::v-deep .table.b-table > thead > tr > [aria-sort=ascending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=ascending] {
    background-position: right calc(2rem / 2) center !important;
    background-size: 20px;
    background-image: url("../../assets/icons/icon-arrow-down.svg") !important;
}


::v-deep .table.b-table > thead > tr > [aria-sort=descending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=descending] {
    background-position: right calc(2rem / 2) center !important;
    background-size: 20px;
    background-image: url("../../assets/icons/icon-arrow-up.svg") !important;
}

.friend {
    padding: 0.5px 4px 3px 4px;
    border-radius: 50%;
    background: #EDE9FE;

    svg {
        height: 13px;
        width: 13px;
    }
}
</style>