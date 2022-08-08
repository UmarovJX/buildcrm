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
    <div class="accordion" role="tablist">
      <p class="date date-day">14 июль</p>
      <b-card no-body class="accordion-item">
        <b-card-header header-tag="header" class="accordion-item__header" v-b-toggle.accordion-1 role="tab">
          <div class="header-status warning">
            <img :src="require('@/assets/icons/icon-paper-fail.svg')" alt="">
          </div>
          <p class="date date-time">10:53</p>
          <div class="header-text">
            <p>
              Внес(ла) изменения в договор
            </p>
          </div>
          <div class="header-nav">
            <div class="header-nav__item">
              <div class="avatar">
                <img :src="require('@/assets/img/avatar.svg')" alt="">
              </div>
              <h5 class="name">
                Темурбек Якубов
                <span class="name-dot">
                ·
              </span>
                <span class="name-rank">
                Менеджер продаж
              </span>
              </h5>
            </div>
            <div class="header-nav__item">
              <div class="collapse-button">
                <img :src="require('@/assets/icons/icon-down.svg')" alt="">
              </div>
            </div>
          </div>
          <div class="header-comment">
            <p>Это удивительный комментарий к тому, что я сделал. Неважно, что я сделал, важно то, чего я не сделал.</p>
          </div>
        </b-card-header>
        <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
          <b-card-body class="accordion-item__body">
            <h5 class="body-title">
              Прикрепленные файлы
            </h5>
            <div class="body-content">
              <base-button text="oldcontract.pdf">
                <template #left-icon>
                  <base-contracts-icon fill="var(--violet-600)"/>
                </template>
              </base-button>
              <base-button text="newcontract.pdf">
                <template #left-icon>
                  <base-contracts-icon fill="var(--violet-600)"/>
                </template>
              </base-button>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="accordion-item">
        <b-card-header header-tag="header" class="accordion-item__header" v-b-toggle.accordion-2 role="tab">
          <p class="date date-time">10:53</p>
          <div class="header-text">
            <p>
              Внес(ла) изменения в договор
            </p>
          </div>
          <div class="header-status edit">
            <img :src="require('@/assets/icons/icon-edit.svg')" alt="">
          </div>
          <div class="header-nav">
            <div class="header-nav__item">
              <div class="avatar">
                <img :src="require('@/assets/img/avatar.svg')" alt="">
              </div>
              <h5 class="name">
                Темурбек Якубов
                <span class="name-dot">
                ·
              </span>
                <span class="name-rank">
                Менеджер продаж
              </span>
              </h5>
            </div>
            <div class="header-nav__item">
              <div class="collapse-button">
                <img :src="require('@/assets/icons/icon-down.svg')" alt="">
              </div>
            </div>
          </div>
          <div class="header-comment">
            <p>Это удивительный комментарий к тому, что я сделал. Неважно, что я сделал, важно то, чего я не сделал.</p>
          </div>
        </b-card-header>
        <b-collapse id="accordion-2" visible accordion="my-accordion" role="tabpanel">
          <b-card-body class="accordion-item__body">
            <h5 class="body-title">
              Прикрепленные файлы
            </h5>
            <div class="body-content">
              <base-button text="oldcontract.pdf">
                <template #left-icon>
                  <base-contracts-icon fill="var(--violet-600)"/>
                </template>
              </base-button>
              <base-button text="newcontract.pdf">
                <template #left-icon>
                  <base-contracts-icon fill="var(--violet-600)"/>
                </template>
              </base-button>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="accordion-item">
        <b-card-header header-tag="header" class="accordion-item__header" v-b-toggle.accordion-3 role="tab">
          <p class="date date-time">10:53</p>
          <div class="header-text">
            <p>
              Внес(ла) изменения в договор
            </p>
          </div>
          <div class="header-status edit">
            <img :src="require('@/assets/icons/icon-edit.svg')" alt="">
          </div>
          <div class="header-nav">
            <div class="header-nav__item">
              <div class="avatar">
                <img :src="require('@/assets/img/avatar.svg')" alt="">
              </div>
              <h5 class="name">
                Темурбек Якубов
                <span class="name-dot">
                ·
              </span>
                <span class="name-rank">
                Менеджер продаж
              </span>
              </h5>
            </div>
            <div class="header-nav__item">
              <div class="collapse-button">
                <img :src="require('@/assets/icons/icon-down.svg')" alt="">
              </div>
            </div>
          </div>
          <div class="header-comment">
            <p>Это удивительный комментарий к тому, что я сделал. Неважно, что я сделал, важно то, чего я не сделал.</p>
          </div>
        </b-card-header>
        <b-collapse id="accordion-3" visible accordion="my-accordion" role="tabpanel">
          <b-card-body class="accordion-item__body">
            <h5 class="body-title">
              Прикрепленные файлы
            </h5>
            <div class="body-content">
              <base-button text="oldcontract.pdf">
                <template #left-icon>
                  <base-contracts-icon fill="var(--violet-600)"/>
                </template>
              </base-button>
              <base-button text="newcontract.pdf">
                <template #left-icon>
                  <base-contracts-icon fill="var(--violet-600)"/>
                </template>
              </base-button>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>

    </div>
  </div>
</template>

<script>

import BaseButton from "@/components/Reusable/BaseButton";
import BaseContractsIcon from "@/components/icons/BaseContractsIcon";
import FilterContent from "@/components/Debtors/FilterContent";
import {dateConvertor, dateProperties, formatDateToYMD} from "@/util/calendar";

export default {
  name: "ActivityLog",
  components: {BaseContractsIcon, FilterContent, BaseButton},
  methods: {
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
    }
  },
  data() {
    return {}
  },
  computed: {
    query() {
      return Object.assign({}, this.$route.query)
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep.custom-filter {
  margin-top: 32px;
  .search__content {
    width: 80%;
  }
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

      &.edit {
        background-color: var(--yellow-600);
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
      }

      .name {
        display: flex;
        column-gap: 6px;
        font-family: CraftworkSans, serif;
        font-weight: 900;
        font-size: 14px;
        line-height: 16px;
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
      padding: 1.5rem;

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