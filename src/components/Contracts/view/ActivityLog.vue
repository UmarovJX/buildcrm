<template>
  <div>
    <div class="accordion" role="tablist">
      <b-card v-for="(activity, index) in activityLog.items" :key="index" no-body class="accordion-item">
        <b-card-header header-tag="header" class="accordion-item__header" v-b-toggle.accordion-1 role="tab">
          <div class="header-status deleted" v-if="activity.type==='deleted'">
            <BasePaperFailIcon fill="white"/>
          </div>
          <div class="header-status created" v-else-if="activity.type==='created'">
            <BaseEditIcon fill="white"/>
          </div>
          <div class="header-status edit" v-else-if="activity.type==='updated'">
            <BaseEditIcon fill="white"/>
          </div>
          <div class="header-status warning" v-else>
            {{ activity.type }}
          </div>
          <div class="header-nav">
            <div class="header-nav__item">
              <div class="avatar">
                <img :src="imageMaker(activity.user.avatar)" alt="">
              </div>
              <h5 class="name">
                {{ activity.user.first_name }} {{ activity.user.last_name }}
                <span class="name-dot">
                ·
              </span>
                <span class="name-rank">
                Менеджер продаж
              </span>
              </h5>
            </div>
            <div class="header-nav__item">
              <p class="date">{{ dateFormatter(activity.created_at) }}</p>
              <div class="collapse-button">
                <img :src="require('@/assets/icons/icon-down.svg')" alt="">
              </div>
            </div>
          </div>
          <div class="header-text">
            <p>
              {{ activityDefiner(activity.action) }}
            </p>
          </div>
          <div v-if="hasComment(activity.properties.attributes)" class="header-comment">
            <p>{{ activity.properties.attributes.comment }}</p>
          </div>
        </b-card-header>
        <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel"
                    v-if="activity.action==='reissue'">
          <b-card-body class="accordion-item__body">
            <h5 class="body-title">
              Изменённые файлы
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
import api from "@/services/api";
import moment from "moment";
import BaseEditIcon from "@/components/icons/BaseEditIcon";
import BasePaperFailIcon from "@/components/icons/BasePaperFailIcon";

export default {
  name: "ActivityLog",
  components: {BasePaperFailIcon, BaseEditIcon, BaseContractsIcon, BaseButton},

  data() {
    return {
      activityLog: [],
      comment: "",
      activityStatus:{
        reissue: "contracts.activity_log.reissue",
        comments: "contracts.activity_log.comments",
        payments_histories: "contracts.activity_log.payments_histories"
      }
    }
  },
  async created() {
    await this.fetchActivityLog()
  },
  methods: {
    hasComment(attributes) {
      return attributes && attributes.hasOwnProperty("comment") && attributes.comment !== null
    },
    activityDefiner(activity) {
      return this.$t(this.activityStatus[activity])
    },
    imageMaker(image) {
      return process.env.VUE_APP_URL + "/" + image
    },
    dateFormatter(date) {
      // 10:53 27.06.2022
      let d = moment(date).format('L')
      d = d.replaceAll("/", ".")
      let t = moment(date).format('LT')
      t = t.slice(0, -2)
      return t + d
    },
    async fetchActivityLog() {
      const {id} = this.$route.params
      await api.contractV2.fetchActivityLog(id)
          .then((response) => {
                this.activityLog = response.data;
              }
          )
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.showLoading = false
          })
    }
  }
}
</script>

<style lang="scss" scoped>

::v-deep .accordion {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  & > .card:not(:last-of-type) {
    border-bottom: 2px solid var(--gray-200);
    border-bottom-left-radius: 2rem;
    border-bottom-right-radius: 2rem;
  }

  & > .card:not(:first-of-type) {
    border-top: 2px solid var(--gray-200);
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
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

    &-body {
      border-top: 2px solid var(--gray-200);
    }
  }

  &-item {
    background: var(--gray-50);
    border: 2px solid var(--gray-200);
    border-radius: 2rem;
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

      &.warning,
      &.deleted {
        background-color: var(--red-600);
      }

      &.created {
        background-color: var(--green-600);
      }
    }

    &:after {
      position: absolute;
      content: '';
      bottom: 0;
      left: -45px;
      width: 2px;
      height: calc(100% - 52px);
      background-color: #D9D9D9;
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
        }
      }

      .header-text {
        display: flex;
        padding-top: 12px;

        p {
          font-family: Inter, sans-serif;
          font-weight: 600;
          font-size: 14px;
          line-height: 20px;
          color: var(--gray-600);
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

      .date {
        font-family: Inter, sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
        color: var(--gray-400);
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