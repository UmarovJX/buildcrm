<template>
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
            <div class="item-row" @click="collapseItems(index)">
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
              <div class="icon down-icon" v-if="!collapse">
                <BaseUpIcon/>
              </div>
            </div>
            <p v-if="collapse===false">
            <span v-for="({icon, name, route}, index) in items" v-bind:key="index">
              <router-link :to="{name: route}">
                <BaseButton :text="`${ $t(name) }`">
                  <template #left-icon>
                    <component :is="icon"/>
                  </template>
                </BaseButton>
              </router-link>
            </span>
            </p>
          </template>
          <template v-else>
            <router-link :to="{name: route}">
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
  name: 'Header',
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
            },
            {
              icon: null,
              name: 'debtors.new_title',
              route: 'debtors',
            },
            {
              icon: null,
              name: 'payments.payment_list',
              route: 'payments',
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
              items: null,
            },
            {
              icon: null,
              name: 'debtors.new_title',
              route: 'debtors',
              items: null,
            },
            {
              icon: null,
              name: 'payments.payment_list',
              route: 'payments',
              items: null,
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
            },
            {
              icon: null,
              name: 'debtors.new_title',
              route: 'debtors',
            },
            {
              icon: null,
              name: 'payments.payment_list',
              route: 'payments',
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
.sm {
  width: 104px;
  img {
    width: 56px;
    height: 30px;
  }
}
.lg {
  width: 304px;
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
  padding: 48px 24px;
  &-top {
    width: 100%;
    .items {
      display: flex;
      flex-direction: column;
      gap: 8px;
      .item {
        padding: 19px 20px;
        &:hover {
          background: linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%);
          border-radius: 16px;
          color: white!important;
        }
      }
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
    .item-row {
      display: flex;
      cursor: pointer;
      justify-content: space-between;
      align-items: center;
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
    align-items: center;
    padding: 19px 30px;
  }
}
</style>
