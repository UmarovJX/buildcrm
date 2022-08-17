<template>
  <div class="sidebar">
    <header>
      <p>Xon Saroy Design System • Component</p>
      <h1>sidebar</h1>
    </header>
    <div class="sidebar-content">
      <div :class="menu_collapse===false ? 'sidebar-container lg' : 'sidebar-container sm'">
        <div class="sidebar-container-top">
          <router-link
              :to="{name:'home'}"
          >
            <img src="@/assets/img/object__img1.png" alt="Xonsaroy"/>
          </router-link>
          <div class="items">
            <div
                class="item"
                v-for="({icon, name, route, items, collapse},index) in items"
                v-bind:key="index"
            >
              <template v-if="items">
                <div :class="!collapse ? 'item-row purple-bg' : 'item-row'" @click="collapseItems(index)">
                  <div class="item-row-left">
                    <div class="icon">
                      <component :is="icon"/>
                    </div>
                    <div class="text" v-if="!menu_collapse">
                      <p>{{ $t(name) }}</p>
                    </div>
                  </div>
                  <div class="icon down-icon" v-if="!menu_collapse && collapse">
                    <BaseDownIcon/>
                  </div>
                  <div class="icon down-icon" v-if="!collapse && !menu_collapse">
                    <BaseUpIcon/>
                  </div>
                </div>
                <p class="sub-items" v-if="collapse===false">
            <span v-for="({icon, name, route, collapsed_view}, index) in items" v-bind:key="index">
              <router-link :to="{name: route}">
                <template v-if="!menu_collapse">
                  <BaseButton :text="`${ $t(name) }`">
                  <template #left-icon>
                    <component :is="icon"/>
                  </template>
                </BaseButton>
                </template>
                <template v-if="menu_collapse && icon">
                  <span class="icon">
                    <component :is="icon"/>
                  </span>
                </template>
                <template v-if="menu_collapse && !icon">
                  <span class="collapsed-text">
                    {{ $t(collapsed_view) }}
                  </span>
                </template>
              </router-link>
            </span>
                </p>
              </template>
              <template v-else>
                <router-link :to="{name: route}" :class="!collapse ? 'item-row purple-bg' : 'item-row'">
                  <div class="item-row-left" @click="collapseItems(index)">
                    <div class="icon">
                      <component :is="icon"/>
                    </div>
                    <div class="text" v-if="!menu_collapse">
                      <p>{{ $t(name) }}</p>
                    </div>
                  </div>
                </router-link>
              </template>
            </div>
          </div>
        </div>
        <div class="hide" @click="collapseMenu" v-if="menu_collapse">
          <BaseCollapseRightIcon/>
        </div>
        <div class="hide" @click="collapseMenu" v-else>
          <BaseCollapseLeftIcon/>
          {{ $t('hide_menu') }}
        </div>
      </div>
    </div>
  </div>

</template>

<script>

import BaseHomeIcon from "@/components/icons/BaseHomeIcon";
import BaseObjectsIcon from "@/components/icons/BaseObjectsIcon";
import BaseUsersIcon from "@/components/icons/BaseUsersIcon";
import BaseSettingsIcon from "@/components/icons/BaseSettingsIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseDocumentIcon from "@/components/icons/BaseDocumentIcon";
import BaseCollapseLeftIcon from "@/components/icons/BaseCollapseLeftIcon";
import BaseRightIcon from "@/components/icons/BaseRightIcon";
import BaseDownIcon from "@/components/icons/BaseDownIcon";
import BaseUpIcon from "@/components/icons/BaseUpIcon";
import BaseCollapseRightIcon from "@/components/icons/BaseCollapseRightIcon";

export default {
  name: 'Sidebar',
  components: {BaseCollapseRightIcon, BaseUpIcon, BaseDownIcon, BaseRightIcon, BaseCollapseLeftIcon, BaseButton},
  props: {
    theme: {
      type: String,
      default: "",
    },
  },
  data(){
    return {
      menu_collapse: false,
      items: [
        {
          icon: BaseHomeIcon,
          name: 'home.title',
          route: 'home',
          items: 0,
          collapse: true,
        },
        {
          icon: BaseObjectsIcon,
          name: 'objects.title',
          collapse: true,
          items: [
            {
              icon: null,
              name: 'contracts.list_contracts',
              route: 'contracts-list',
              collapsed_view: "contracts.collapsed_contracts_list"
            },
            {
              icon: null,
              name: 'debtors.new_title',
              route: 'debtors',
              collapsed_view: "debtors.collapsed_new_title"
            },
            {
              icon: null,
              name: 'payments.payment_list',
              route: 'payments',
              collapsed_view: "payments.collapsed_payment_list"
            },
          ]
        },
        {
          icon: BaseDocumentIcon,
          name: 'contracts.title',
          collapse: true,
          items: [
            {
              icon: null,
              name: 'contracts.list_contracts',
              route: 'contracts-list',
              collapsed_view: "contracts.collapsed_contracts_list"
            },
            {
              icon: null,
              name: 'debtors.new_title',
              route: 'debtors',
              collapsed_view: "debtors.collapsed_new_title"
            },
            {
              icon: null,
              name: 'payments.payment_list',
              route: 'payments',
              collapsed_view: "payments.collapsed_payment_list"
            },
          ]
        },
        {
          icon: BaseUsersIcon,
          name: 'roles.users',
          collapse: true,
          items: [
            {
              icon: null,
              name: 'contracts.list_contracts',
              route: 'contracts-list',
              collapsed_view: "contracts.collapsed_contracts_list"
            },
            {
              icon: null,
              name: 'debtors.new_title',
              route: 'debtors',
              collapsed_view: "debtors.collapsed_new_title"
            },
            {
              icon: null,
              name: 'payments.payment_list',
              route: 'payments',
              collapsed_view: "payments.collapsed_payment_list"
            },
          ]
        },
        {
          icon: BaseSettingsIcon,
          name: 'settings.title',
          route: 'profile',
          items: 0,
          collapse: true,
        },
      ]
    }
  },
  methods: {
    collapseMenu(){
      this.menu_collapse = !this.menu_collapse
    },
    collapseItems(index) {
      this.items[index].collapse = !this.items[index].collapse
    }
  },
}
</script>

<style lang="scss" scoped>
.sidebar {
  &-content {
    padding: 0 64px 64px;
  }
  .sm {
    width: 104px;
    padding: 48px 20px;

    img {
      width: 56px;
      height: 30px;
    }
  }
  .lg {
    width: 304px;
    padding: 48px 24px;
  }
  .collapsed-text {
    padding: 13px 15.5px;
    border-radius: 16px;
    width: 100%;
    display: flex;
    background: #E5E7EB;
    justify-content: center;
    align-items: center;
    &:hover {
      color: #7C3AED;
    }
  }
  .sidebar-container {
    min-height: 92vh;
    display: flex;
    flex-direction: column;
    gap: 46px;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #F3F4F6;
    border-radius: 56px;
    .item {
      .sub-items {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 8px;
        .base__button {
          background: #E5E7EB;
          width: 100%;
          font-style: normal;
          font-weight: 600;
          font-size: 16px;
          line-height: 22px;
          color: #4B5563;
          padding: 13px 24px;
          border-radius: 16px;
          justify-content: flex-start;
          &:hover {
            color: #7C3AED!important;
          }
        }
      }
    }
    &-top {
      width: 100%;
      .items {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      a {
        display: flex;
      }
      img {
        max-width: 135px;
        margin: 0 auto 24px;
      }
      p {
        margin-bottom: 0;
      }
      .purple-bg {
        background: linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%);
        border-radius: 16px;
        color: white!important;
      }
      .item-row {
        display: flex;
        cursor: pointer;
        padding: 19px 20px;
        justify-content: space-between;
        align-items: center;
        &:hover {
          background: linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%);
          border-radius: 16px;
          color: white!important;
        }
        &-left {
          display: flex;
          gap: 20px;
          align-content: center;
        }
      }
    }
    .hide {
      display: flex;
      gap: 20px;
      color: #9CA3AF;
      cursor: pointer;
      align-items: center;
      padding: 19px 30px;
    }
  }
  header {
    background: #F3F4F6;
    padding: 64px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 60px;
    p {
      letter-spacing: 1px;
      text-transform: uppercase;
      font-family: 'CraftworkSans', serif;
      font-weight: 900;
      color: #9CA3AF;
      font-size: 16px;
      line-height: 19px;
      margin: 0;
    }
    h1 {
      text-transform: uppercase;
      font-family: 'CraftworkSans', serif;
      margin: 0;
      font-weight: 900;
      font-size: 64px;
      line-height: 77px;
      color: #4B5563;
    }
  }
}

</style>
