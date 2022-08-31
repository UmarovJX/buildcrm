<template>
  <div>
    <filter-content
        ref="filter-content"
        class="custom-filter"
        :query="query"
        @change-view-type="changeViewType"
        @change-date="changeCalendarDate"
        @sort-items="filterDebts"
        @go-to-today="showCurrentDay"
        @reset-filter-fields="disableFilter"
        @sort-by-search="sortBySearchField"
    />
    <div v-for="(activity, index) in daysList" :key="index">
      <div class="accordion" role="tablist">
        <p class="date date-day">{{ dateFormatter(activity.date) }}</p>
        <b-card no-body class="accordion-item" v-for="(item, index2) in activity.activities" :key="index2">
          <b-card-header header-tag="header" class="accordion-item__header" v-b-toggle="'accordion-' + (index+index2+1)"
                         role="tab">
            <div :class="activityType(item.type).class">
              <component :is="activityType(item.type).component" fill="white"/>
            </div>
            <p class="date date-time">{{ timeFormatter(item.created_at) }}</p>
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
                ·
              </span>
                  <span class="name-rank">
                {{ getClientRole(item.user.role.name) }}
              </span>
                </h5>
              </div>
              <div class="header-nav__item">
                <div class="collapse-button">
                  <img :src="require('@/assets/icons/icon-down.svg')" alt="">
                </div>
              </div>
            </div>
            <div v-if="hasComment(item.properties)" class="header-comment">
              <p>{{ item.properties.attributes.comment }}</p>
            </div>
          </b-card-header>
          <b-collapse :id="`accordion-${index+index2+1}`" :accordion="`accordion-${index+index2+1}`" role="tabpanel">
            <b-card-body class="accordion-item__body" v-if="item.action==='orders'">
              <h5 class="body-title">
                {{ $t('contracts.activity_log.edited_file') }}
              </h5>
              <div class="body-content">
                <a v-if="item.properties.old.length" target="_blank" :href="item.properties.old.path"
                   :download="item.properties.old.name">
                  <base-button :text="item.properties.old.name">
                    <template #left-icon>
                      <base-document-icon/>
                    </template>
                  </base-button>
                </a>
                <a v-if="item.properties.files" :href="item.download_url" target="_blank"
                   :download="item.properties.files.name">
                  <base-button :text="item.properties.files.name">
                    <template #left-icon>
                      <base-document-icon/>
                    </template>
                  </base-button>
                </a>
              </div>
            </b-card-body>
            <b-card-body class="accordion-item__body" v-else-if="item.action==='payment_histories'">
              <h5 class="body-title">
                {{ $t('contracts.activity_log.edited_file') }}
              </h5>
              <div class="body-content">
                <a v-if="item.properties.old && item.properties.old" :href="item.download_url"
                   :download="item.properties.old.name">
                  <base-button :text="item.properties.old.name">
                    <template #left-icon>
                      <base-document-icon/>
                    </template>
                  </base-button>
                </a>
                <a v-if="item.properties.files" :href="item.download_url" :download="item.properties.files.name">
                  <base-button :text="item.properties.files.name">
                    <template #left-icon>
                      <base-document-icon/>
                    </template>
                  </base-button>
                </a>
              </div>
            </b-card-body>
            <h5 class="body-title"
                v-if="item.type==='updated' && (!Array.isArray(item.properties.old)  || Array.isArray(item.properties.attributes))">
              {{ $t('contracts.activity_log.actions.edited') }}:
            </h5>
            <h5 class="body-title"
                v-else-if="item.type==='created' && (!Array.isArray(item.properties.old) || Array.isArray(item.properties.attributes))">
              {{ $t('contracts.activity_log.actions.created') }}:
            </h5>
            <h5 class="body-title"
                v-else-if="item.type==='deleted' && (!Array.isArray(item.properties.old) || Array.isArray(item.properties.attributes))">
              {{ $t('contracts.activity_log.actions.deleted') }}:
            </h5>
            <h5 class="body-title"
                v-else-if="item.type==='reissue' && (!Array.isArray(item.properties.old) || Array.isArray(item.properties.attributes))">
              {{ $t('contracts.activity_log.actions.reissue') }}:
            </h5>
            <div v-if="item.properties.old || item.properties.attributes" class="header-data">
              <div :class="!item.properties.attributes ? 'header-data-row w-100' : 'header-data-row'"
                   v-if="item.properties.old">
                <output-information v-if="item.properties.old.amount" :value="item.properties.old.amount"
                                    property="Label"/>
                <output-information v-if="item.properties.old.date_paid" :value="item.properties.old.date_paid"
                                    property="Label"/>
                <output-information v-if="item.properties.old.payment_type" :value="item.properties.old.payment_type"
                                    property="Label"/>
                <output-information v-if="item.properties.old.status" :value="item.properties.old.status"
                                    property="Label"/>
                <output-information v-if="item.properties.old.type" :value="item.properties.old.type" property="Label"/>
              </div>
              <div class="header-data-row row-icons" v-if="item.properties.attributes && item.properties.old">
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
                <output-information v-if="item.properties.attributes.amount" :value="item.properties.attributes.amount"
                                    property="Label"/>
                <output-information v-if="item.properties.attributes.date_paid"
                                    :value="item.properties.attributes.date_paid" property="Label"/>
                <output-information v-if="item.properties.attributes.payment_type"
                                    :value="item.properties.attributes.payment_type" property="Label"/>
                <output-information v-if="item.properties.attributes.status" :value="item.properties.attributes.status"
                                    property="Label"/>
                <output-information v-if="item.properties.attributes.type" :value="item.properties.attributes.type"
                                    property="Label"/>
              </div>
            </div>
          </b-collapse>
        </b-card>
      </div>
    </div>
    <!-- PAGINATION   -->
<!--    <base-pagination-->
<!--        :default-count-view="activityLogPagination.page"-->
<!--        :pagination-current="activityLogPagination.limit"-->
<!--        :pagination-count="2"-->
<!--        @change-page="swipeSchedulePage"-->
<!--    />-->
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
import {dateConvertor, dateProperties, formatDateToYMD} from "@/util/calendar";
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
      activityLogPagination: {}
    }
  },
  async created() {
    await this.fetchActivityLog()
  },
  methods: {
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
            response.data.items.forEach((item) => {
              const index = this.daysList.findIndex(day => day.date.slice(0, 10) === item.created_at.slice(0, 10))
              if (index !== -1) {
                this.daysList[index].activities.push(item)
              } else {
                this.daysList.push({
                  date: item.created_at,
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
    // getDateListByDescending(dateList) {
    //   console.log("date-list", dateList);
    //   return dateList.sort((a,b) => {
    //     const firstDate = dateConvertor(a.date)
    //     const secondDate = dateConvertor(b.date)
    //     return secondDate.getTime() - firstDate.getTime()
    //   })
    // },
    // swipeSchedulePage(page) {
    //   this.activityLogPagination.page = page
    //   this.fetchActivityLog(this.activityLogPagination)
    // },
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


    sortBySearchField(searchingValue) {
      let search = searchingValue
      if (!search) {
        search = undefined
      }
      this.changeRouterQuery({
        search
      })
      // this.initActivityLogUi()
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
      // this.initDebtorUi()
    },
    showCurrentDay() {
      const {month, year, dayOfMonth} = dateProperties(new Date())
      let firstOfCurrentDay = formatDateToYMD(new Date(year, month, 1))
      if (this.typeOfView === 'week') {
        firstOfCurrentDay = formatDateToYMD(new Date(year, month, dayOfMonth))
      }
      this.setStarterByTypeOfView(firstOfCurrentDay)
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
      // this.initDebtorUi()
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
    },
    changeViewType(type) {
      if (type !== this.typeOfView) {
        this.typeOfView = type
        const starter = this.query.starter_moment ?? formatDateToYMD(new Date())
        const {year, month, dayOfMonth} = dateProperties(dateConvertor(starter))
        if (type === 'day') {
          this.day.starter = starter
          // this.refreshRouteQuery({
          //   date: [starter, starter],
          //   type_of_view: 'day',
          //   starter_moment: starter
          // })
        } else {
          const starter = formatDateToYMD(new Date(year, month, 1))
          // this.refreshRouteQuery({
          //   date: undefined,
          //   starter_moment: starter,
          //   type_of_view: type
          // })
          if (type === 'month') {
            this.month.starter = starter
          } else if (type === 'week') {
            this.week.starter = formatDateToYMD(new Date(year, month, dayOfMonth))
          }
        }
        // this.initDebtorUi()
      }
    },
  },
  computed: {
    query() {
      return Object.assign({}, this.$route.query)
    },
    countOfItems() {
      return this.daysList.length
    },
  },
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

::v-deep .accordion {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .date {
    font-family: Craftwork Sans, sans-serif;
    font-weight: 900;
    color: #9CA3AF;

    &-day {
      line-height: 22px;
      margin: 20px 0 40px;
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

  .body-title {
    margin: 1rem 0;
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
      justify-content: center;
      width: auto !important;
    }
  }

  .show {
    padding: 0 30px;
  }

  .w-100 {
    width: 100% !important;
  }

  header[aria-expanded="true"] {
    .collapse-button {
      transform: rotate(-180deg);
    }

    .header-comment {
      display: flex;
    }
  }

  .card {
    overflow: visible;
    position: relative;
    margin-bottom: 1.5rem;

    &-header {
      border-bottom: none;
      background-color: transparent;
      margin: 0 !important;
    }
  }

  .collapsed {
    padding: 24px;
    border-radius: 16px !important;
    margin-top: -16px !important;
  }

  .collapsed:hover {
    background: #F9FAFB;
  }

  &-item {
    border: none;
    width: calc(100% - 68px);

    .header-status {
      position: absolute;
      content: '';
      top: 0;
      left: -68px;
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
      bottom: -17px;
      left: -45px;
      width: 2px;
      height: calc(100% - 36px);
      background-color: #F3F4F6;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99;
    }


    &__header {
      padding: 0 1.5rem 1.5rem;

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

      .header-comment {
        display: none;
        align-items: center;
        padding: 16px 20px;
        background-color: var(--white);
        border: 2px solid var(--gray-200);
        border-radius: 32px;
        margin-top: 1rem;
        transition: all .3s linear;

        p {
          font-family: Inter, sans-serif;
          font-weight: 600;
          font-size: 14px;
          line-height: 20px;
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