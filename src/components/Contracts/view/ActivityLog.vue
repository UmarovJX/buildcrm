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
          <b-card no-body class="accordion-item" v-for="(item, index) in activity.activities" :key="index">
            <b-card-header header-tag="header" class="accordion-item__header" v-b-toggle="'accordion-' + (index+1)"
                           role="tab">
              <div :class="activityType(item.type).class">
                <component :is="activityType(item.type).component" fill="white"/>
              </div>
              <p class="date date-time">{{ timeFormatter(item.created_at) }}</p>
              <div class="header-text">
                <p>
                  {{ activityDefiner(item.action) }}
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
                {{getClientRole(item.user.role.name)}}
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
            <b-collapse :id="`accordion-${index+1}`" :accordion="`accordion-${index+1}`" role="tabpanel">
              <b-card-body class="accordion-item__body" v-if="item.action==='reissue'">
                <h5 class="body-title">
                  {{ $t('contracts.activity_log.attached_files') }}
                </h5>
                <div class="body-content">
                  <base-button text="oldcontract.pdf">
                    <template #left-icon>
                      <base-document-icon/>
                    </template>
                  </base-button>
                  <base-button text="newcontract.pdf">
                    <template #left-icon>
                      <base-document-icon/>
                    </template>
                  </base-button>
                </div>
              </b-card-body>
              <b-card-body class="accordion-item__body" v-else-if="item.action==='payments_histories'">
                <h5 class="body-title">
                  {{ $t('contracts.activity_log.attached_files') }}
                </h5>
                <div class="body-content">
                  <base-button text="oldcontract.pdf">
                    <template #left-icon>
                      <base-document-icon/>
                    </template>
                  </base-button>
                  <base-button text="newcontract.pdf">
                    <template #left-icon>
                      <base-document-icon/>
                    </template>
                  </base-button>
                </div>
              </b-card-body>
            </b-collapse>
          </b-card>
      </div>
    </div>
    <!-- PAGINATION   -->
    <base-pagination
        v-if="activityLog.length >= 60"
        :default-count-view="activityLogPagination.per_page"
        :pagination-current="activityLogPagination.current"
        :pagination-count="3"
        @change-page="swipeSchedulePage"
    />
    <base-pagination
        v-else-if="activityLog.length >= 20"
        :default-count-view="activityLogPagination.per_page"
        :pagination-current="activityLogPagination.current"
        :pagination-count="2"
        @change-page="swipeSchedulePage"
    />
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

export default {
  name: "ActivityLog",
  components: {BasePagination, BaseDocumentIcon, FilterContent, BaseButton, BaseEditIcon, BasePaperFailIcon},
  data() {
    return {
      activityLog: [],
      activityStatus: {
        reissue: "contracts.activity_log.reissue",
        payments_histories: "contracts.activity_log.payments_histories",
        comments: "contracts.activity_log.comments"
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
      activityLogPagination: {
        next: null,
        per_page: 20
      }
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
    activityDefiner(action) {
      return this.$t(this.activityStatus[action])
    },
    async fetchActivityLog() {
      const {id} = this.$route.params
      await api.contractV2.fetchActivityLog(id, this.activityLogPagination)
          .then((response) => {
            this.activityLogPagination.current = response.data.pagination.current
            this.activityLogPagination.per_page = response.data.pagination.per_page
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
            this.daysList = this.getDateListByDescending(this.daysList)
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.showLoading = false
          })
    },
    getDateListByDescending(dateList) {
      console.log("date-list", dateList);
      return dateList.sort((a,b) => {
        const firstDate = dateConvertor(a.date)
        const secondDate = dateConvertor(b.date)
        return secondDate.getTime() - firstDate.getTime()
      })
    },
    swipeSchedulePage(page) {
      this.activityLogPagination.current = page
      this.activityLogPagination.next = ++page
      this.activityLogPagination.previous = --page
      this.fetchActivityLog()
      this.changeRouterQuery()
    },
    changeRouterQuery() {
      this.$router.push({
        query: {
          ...this.activityLogPagination
        }
      })
      this.setLimitAndPage()
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
        // this.initDebtorUi()
      }
    },
  },
  computed: {
    query() {
      return Object.assign({}, this.$route.query)
    },
  },
}
</script>

<style lang="scss" scoped>
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
    border-radius: 16px!important;
    margin-top: -16px!important;
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