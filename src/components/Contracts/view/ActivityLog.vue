<template>
    <div class="logs-content">
        <filter-content
            ref="filter-content"
            class="custom-filter"
            :query="query"
            @sort-by-search="SearchInput"
        />

        <div class="accordion-list">
            <div v-for="(activity, index) in daysList" :key="index" class="accordion" role="tablist">
                <p class="date date-day">{{ dateFormatter(activity.date) }}</p>
                <b-card class="accordion-item" v-for="item in activity.activities" :key="item.id">
                    <b-card-header header-tag="header" class="accordion-item__header"
                                   v-b-toggle="'accordion-' + item.id"
                                   role="tab">
                        <div :class="activityType(item.type).class">
                            <component :is="activityType(item.type).component" fill="white"/>
                        </div>

                        <div class="header-nav">
                            <div class="header-nav__item">
                                <p class="date date-time">{{ timeFormatter(item.created_at) }}</p>
                            </div>
                            <div class="header-nav__item">
                                <div class="collapse-button">
                                    <img :src="require('@/assets/icons/icon-down.svg')" alt="">
                                </div>
                            </div>
                        </div>

                        <div class="header-text">
                            <p>
                                {{ activityDefiner(item.action, item.type) }}
                            </p>
                        </div>
                        <div class="header-nav">
                            <div class="header-nav__item">
                                <div class="avatar">
                                    <img :src="item.user.avatar" alt="avatar"/>
                                </div>
                                <h5 class="name">
                                    {{ item.user.first_name }} {{ item.user.last_name }}
                                    <span class="name-dot">
                                        Â·
                                      </span>
                                    <span class="name-rank">
                                        {{ getClientRole(item.user.role.name) }}
                                    </span>
                                </h5>
                            </div>
                        </div>

                    </b-card-header>
                    <b-collapse class="accordion-item__body" :id="`accordion-${item.id}`"
                                :accordion="`accordion-${item.id}`"
                                role="tabpanel">
                        <b-card-body>
                            <div v-if="hasComment(item.properties)" class="header-comment">
                                <p>
                                    {{ item.properties.attributes.comment }}
                                </p>
                            </div>
                            <div v-if="item.action === 'orders' || item.action === 'payment_histories'"
                                 class="body-content">

                                <a v-if="item.properties.old" target="_blank"
                                   :href="item.properties.old.path"
                                   :download="item.properties.old.name">
                                    <base-button :text="item.properties.old.name">
                                        <template #left-icon>
                                            <base-document-icon/>
                                        </template>
                                    </base-button>
                                </a>
                                <a v-if="item.properties.files"
                                   :href="item.download_url" target="_blank"
                                   :download="item.properties.files.name">
                                    <base-button :text="item.properties.files.name">
                                        <template #left-icon>
                                            <base-document-icon/>
                                        </template>
                                    </base-button>
                                </a>
                            </div>

                            <h5 class="body-title"
                                v-if="checkTitleType(item) && item.type">
                                {{ $t(`contracts.activity_log.actions.${item.type}`) }}:
                            </h5>

                            <div v-if="item.properties.old || item.properties.attributes" class="header-data">
                                <div
                                    :class="!item.properties.attributes ? 'header-data-row w-100' : 'header-data-row'"
                                    v-if="item.properties.old">
                                    <output-information v-if="item.properties.old.amount"
                                                        :value="item.properties.old.amount"
                                                        property="Label"/>
                                    <output-information v-if="item.properties.old.date_paid"
                                                        :value="item.properties.old.date_paid"
                                                        property="Label"/>
                                    <output-information v-if="item.properties.old.payment_type"
                                                        :value="item.properties.old.payment_type"
                                                        property="Label"/>
                                    <output-information v-if="item.properties.old.status"
                                                        :value="item.properties.old.status"
                                                        property="Label"/>
                                    <output-information v-if="item.properties.old.type"
                                                        :value="item.properties.old.type"
                                                        property="Label"/>
                                </div>
                                <div class="header-data-row row-icons"
                                     v-if="item.properties.attributes && item.properties.old">
                                    <template v-if="item.properties.attributes.amount">
                                        <BaseRightIcon height="56"/>
                                    </template>
                                    <template v-if="item.properties.attributes.date_paid">
                                        <BaseRightIcon height="56"/>
                                    </template>
                                    <template v-if="item.properties.attributes.payment_type">
                                        <BaseRightIcon height="56"/>
                                    </template>
                                    <template v-if="item.properties.attributes.status">
                                        <BaseRightIcon height="56"/>
                                    </template>
                                    <template v-if="item.properties.attributes.type">
                                        <BaseRightIcon height="56"/>
                                    </template>
                                </div>
                                <div :class="!item.properties.old? 'header-data-row w-100' : 'header-data-row'"
                                     v-if="item.properties.attributes">
                                    <output-information v-if="item.properties.attributes.amount"
                                                        :value="item.properties.attributes.amount"
                                                        property="Label"/>
                                    <output-information v-if="item.properties.attributes.date_paid"
                                                        :value="item.properties.attributes.date_paid"
                                                        property="Label"/>
                                    <output-information v-if="item.properties.attributes.payment_type"
                                                        :value="item.properties.attributes.payment_type"
                                                        property="Label"/>
                                    <output-information v-if="item.properties.attributes.status"
                                                        :value="item.properties.attributes.status"
                                                        property="Label"/>
                                    <output-information v-if="item.properties.attributes.type"
                                                        :value="item.properties.attributes.type"
                                                        property="Label"/>
                                </div>
                            </div>

                        </b-card-body>
                    </b-collapse>
                </b-card>
            </div>
        </div>

        <!-- PAGINATION   -->
        <div v-if="countOfItems" class="pagination__vue">
            <!--   Pagination   -->
            <vue-paginate
                :page-count="activityLogPagination.total"
                :value="activityLogPagination.current"
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
                [

                ]
                <template #prev-content>
          <span class="d-flex align-items-center justify-content-center">
            <base-arrow-left-icon/>
          </span>
                </template>
            </vue-paginate>

            <!--  Show By Select    -->
            <div class="show__by">
        <span class="show__by__content">
          <span class="description">{{ $t('contracts.show_by') }}:</span>
          <b-form-select
              @input="limitChanged"
              v-model="showByValue"
              :options="showByOptions"
          ></b-form-select>
          <span class="arrow__down">
            <base-down-icon/>
          </span>
        </span>
            </div>
        </div>
    </div>
</template>

<script>

import BaseButton from "@/components/Reusable/BaseButton";
import FilterContent from "@/components/Contracts/FilterContent";
import BaseDocumentIcon from "@/components/icons/BaseDocumentIcon";
import api from "@/services/api";
import moment from "moment"
import BaseEditIcon from "@/components/icons/BaseEditIcon";
import BasePaperFailIcon from "@/components/icons/BasePaperFailIcon";
import BasePagination from "@/components/Reusable/Navigation/BasePagination";
import OutputInformation from "@/components/Elements/Outputs/OutputInformation";
import BaseRightIcon from "@/components/icons/BaseRightIcon";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseDownIcon from "@/components/icons/BaseDownIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import {sortObjectValues} from "@/util/reusable";

export default {
    name: "ActivityLog",
    components: {
        BaseArrowLeftIcon,
        BaseDownIcon,
        BaseRightIcon,
        BaseArrowRightIcon,
        OutputInformation,
        BasePagination, BaseDocumentIcon, FilterContent, BaseButton, BaseEditIcon, BasePaperFailIcon
    },
    data() {
        let {limit: showByValue} = this.$route.query
        if (!showByValue) {
            showByValue = 20
        }
        const showByOptions = []
        for (let number = 10; number <= 50; number += 10) {
            showByOptions.push({
                value: number,
                text: number
            })
        }
        return {
            activityLog: [],
            activityStatus: {
                reissue: "contracts.activity_log.reissue",
                payments_histories: "contracts.activity_log.payments_histories",
                comments: "contracts.activity_log.comments",
                orders: "contracts.activity_log.orders"
            },
            activityActionType: {
                deleted: "contracts.activity_log.actions.deleted",
                updated: "contracts.activity_log.actions.edited",
                created: "contracts.activity_log.actions.created",
                reissue: "contracts.activity_log.actions.reissue",
            },
            activityTypes: {
                created: {
                    component: BaseEditIcon,
                    class: "header-status created"
                },
                updated: {
                    component: BaseEditIcon,
                    class: "header-status updated"
                },
                deleted: {
                    component: BasePaperFailIcon,
                    class: "header-status warning"
                },
            },
            daysList: [],
            showByValue,
            showByOptions,
            page: 1,
            currentPage: 1,
            activityLogPagination: {},
            users: []
        }
    },
    async created() {
        await this.fetchActivityLog()
    },
    methods: {
        checkTitleType(item) {
            if (item.properties.old || item.properties.attributes)
                return !!(!Array.isArray(item.properties.old) || !Array.isArray(item.properties.attributes))
            return true
        },
        activityType(type) {
            return this.activityTypes[type]
        },
        dateFormatter(date) {
            const d = moment(date).format('LL')
            return d.slice(0, -6)
        },
        timeFormatter(date) {
            const t = moment(date).format('LT')
            return t.slice(0, -3)
        },
        hasComment(properties) {
            return properties.attributes && properties.attributes.comment
        },
        activityDefiner(action, type) {
            return `${this.$t(this.activityActionType[type])} ${this.$t(this.activityStatus[action])}`
        },
        async fetchActivityLog() {
            this.daysList = []
            const {id} = this.$route.params
            const query = sortObjectValues(this.query)
            await api.contractV2.fetchActivityLog(id, query)
                .then((response) => {
                    this.activityLogPagination = response.data.pagination
                    response.data.items.forEach((item) => {
                        const index = this.daysList.findIndex(day => day.date.slice(0, 10) === item.created_at.slice(0, 10))
                        if (index !== -1) {
                            this.daysList[index].activities.push(item)
                        } else {
                            // const dateFormat = new Date(item.created_at);
                            this.daysList.push({
                                date: item.created_at.slice(0, 10),
                                activities: [item]
                            })
                        }
                    })
                    // this.daysList = this.getDateListByDescending(this.daysList)
                })
                .catch((error) => {
                    this.toastedWithErrorCode(error)
                })
                .finally(() => {
                    this.showLoading = false
                })
        },
        changeCurrentPage(page) {
            const currentPage = this.query.page
            if (page === currentPage) return
            this.replaceRouter({...this.query, page})
            this.fetchActivityLog()
        },
        limitChanged() {
            this.changeFetchLimit()
        },
        replaceRouter(query) {
            const sortQuery = sortObjectValues(query)
            this.$router.replace({query: sortQuery})
        },
        changeFetchLimit() {
            const query = {
                ...this.query, page: 1
            }
            const limit = this.showByValue
            this.replaceRouter({...query, limit})
            this.fetchActivityLog()
        },
        getClientRole(client) {
            let language = 'kirill'
            if (this.$i18n.locale === 'uz') {
                language = 'lotin'
            }
            return this.clientRole(client, language)
        },
        clientRole(multiRole, language) {
            const roleByLang = multiRole[language]
            if (roleByLang) {
                return roleByLang
            } else {
                const roleOtherLang = language === 'kirill' ? multiRole['ru'] : multiRole['uz']
                if (roleOtherLang) return roleOtherLang
            }

            return ''
        },
        SearchInput(event) {
            const query = {
                ...this.query, page: 1
            }
            const search = event
            this.replaceRouter({...query, search})
            this.fetchActivityLog()
        }
    },
    computed: {
        query() {
            return Object.assign({}, this.$route.query)
        },
        countOfItems() {
            return this.daysList.length
        },
    },
    watch: {
        query() {
            this.fetchActivityLog()
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/pagination";

::v-deep.custom-filter {
    margin-top: 32px;

    .d-flex {
        .d-flex {
            .custom-select {
                display: none;
            }
        }
    }
}

.logs-content {
    display: flex;
    flex-direction: column;
}

.accordion-list {
    padding-top: 1.5rem;
}

::v-deep .accordion {
    //margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;


    .accordion-item:last-child {
        margin-bottom: 0 !important;

        &:after {
            display: none;
        }
    }

    .date {
        font-family: Craftwork Sans, sans-serif;
        font-weight: 900;
        color: #9CA3AF;

        &-day {
            line-height: 22px;
            margin: 1.5rem 0 1.5rem;
            font-size: 18px;
            align-self: center;
        }

        &-time {
            font-size: 14px;
            margin-bottom: 4px;
            line-height: 20px;
            font-weight: 600;
        }
    }

    .card-body {
        padding: 0;
        //padding: 0 1.5rem 1.5rem;

        &__title {
            margin: 1rem 0;
        }
    }

    .header-data {
        display: flex;
        width: 100%;
        justify-content: space-between;

        &-row {
            width: 50%;
            display: flex;
            flex-direction: column;
            gap: 1rem;

        }

        .row-icons {
            align-items: center;
            justify-content: space-between;
            width: auto !important;
            padding: 0 8px;
        }
    }


    .w-100 {
        width: 100% !important;
    }

    header[aria-expanded="true"] {
        .collapse-button {
            transform: rotate(-180deg);
        }


    }

    .header-comment {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        background-color: var(--white);
        border: 2px solid var(--gray-200);
        border-radius: 32px;
        //margin-top: 24px;
        transition: all .3s linear;
        margin-bottom: 24px;

        p {
            font-family: Inter, sans-serif;
            font-weight: 600;
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 0;
        }
    }


    .card {
        overflow: visible;
        position: relative;
        margin-bottom: 1.5rem;

        &-header {
            border-bottom: none;
            background-color: transparent;
            //margin: 0 !important;
        }
    }

    .collapsed {
        padding: 24px;
        border-radius: 16px !important;
        //margin-top: -16px !important;
    }

    .collapsed:hover {
        background: #F9FAFB;
    }

    &-item {
        border: none;
        width: calc(100% - 56px);

        .header-status {
            position: absolute;
            content: '';
            top: 24px;
            left: -56px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99;

            &.updated {
                background-color: var(--yellow-600);
            }

            &.created {
                background-color: var(--green-600);
            }

            &.warning {
                background-color: var(--red-600);
            }

        }

        &:after {
            position: absolute;
            content: '';
            top: 76px;
            left: -33px;
            width: 2px;
            height: calc(100% - 33px);
            background-color: #F3F4F6;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99;
        }


        &__header {
            padding: 1.5rem;

            .collapse-button {
                transition: all linear .3s;
            }

            .header-nav {
                display: flex;
                align-items: center;
                justify-content: space-between;

                &__item {
                    display: flex;
                    align-items: center;
                    column-gap: 1rem;

                    h5 {
                        margin-bottom: 0;
                    }
                }
            }

            .header-text {
                display: flex;
                margin-top: 2px;
                margin-bottom: 10px;

                p {
                    font-family: Inter, sans-serif;
                    font-style: normal;
                    font-weight: 600;
                    font-size: 18px;
                    line-height: 24px;
                    color: #4B5563;
                }
            }


            h5, p {
                margin-bottom: 0;
            }

            .avatar {
                width: 2rem;
                height: 2rem;
                border-radius: 50%;

                img {
                    border-radius: 50%;
                    object-fit: cover;
                    width: 100%;
                    height: 100%;
                }
            }

            .name {
                display: flex;
                column-gap: 6px;
                font-family: CraftworkSans, serif;
                font-weight: 900;
                font-size: 14px;
                color: var(--violet-600);
                margin-bottom: 4px;

                &-rank {
                    color: var(--gray-600);
                }

                &-dot {
                    font-family: Inter, sans-serif;
                    font-weight: 600;
                    font-size: 14px;
                    line-height: 20px;
                    color: var(--gray-400);
                }
            }

        }


        &__body {
            padding: 0 1.5rem 1.5rem;

            .body-title {
                font-family: CraftworkSans, serif;
                font-weight: 900;
                font-size: 16px;
                line-height: 18px;
                color: var(--gray-400);
                margin-bottom: 1rem;
            }

            .body-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .base__button .text {
                font-weight: 600;
                font-size: 16px;
                line-height: 22px;
                color: var(--gray-600);
            }
        }
    }

}
</style>