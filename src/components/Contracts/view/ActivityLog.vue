<template>
  <div>
    <div class="accordion" role="tablist">
      <b-card no-body class="accordion-item">
        <b-card-header header-tag="header" class="accordion-item__header" v-b-toggle.accordion-1 role="tab">
          <div class="header-status warning">
            <img :src="require('@/assets/icons/icon-paper-fail.svg')" alt="">
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
              <p class="date">10:53 27.06.2022</p>
              <div class="collapse-button">
                <img :src="require('@/assets/icons/icon-down.svg')" alt="">
              </div>
            </div>
          </div>
          <div class="header-text">
            <p>
              Внес(ла) изменения в договор
            </p>
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
              <p class="date">10:53 27.06.2022</p>
              <div class="collapse-button">
                <img :src="require('@/assets/icons/icon-down.svg')" alt="">
              </div>
            </div>
          </div>
          <div class="header-text">
            <p>
              Внес(ла) изменения в договор
            </p>
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
              <p class="date">10:53 27.06.2022</p>
              <div class="collapse-button">
                <img :src="require('@/assets/icons/icon-down.svg')" alt="">
              </div>
            </div>
          </div>
          <div class="header-text">
            <p>
              Внес(ла) изменения в договор
            </p>
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

export default {
  name: "ActivityLog",
  components: {BaseContractsIcon, BaseButton},

  data() {
    return {}
  },
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

      &.warning {
        background-color: var(--red-600);
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