<script>
import BaseHomeIcon from '@/components/icons/BaseHomeIcon'
import BaseObjectsIcon from '@/components/icons/BaseObjectsIcon'
import BaseUsersIcon from '@/components/icons/BaseUsersIcon'
import BaseSettingsIcon from '@/components/icons/BaseSettingsIcon'
import BaseButton from '@/components/Reusable/BaseButton'
import BaseDocumentIcon from '@/components/icons/BaseDocumentIcon'
import BaseCollapseLeftIcon from '@/components/icons/BaseCollapseLeftIcon'
import BaseRightIcon from '@/components/icons/BaseRightIcon'
import BaseDownIcon from '@/components/icons/BaseDownIcon'
import BaseUpIcon from '@/components/icons/BaseUpIcon'
import BaseCollapseRightIcon from '@/components/icons/BaseCollapseRightIcon'
import DocHeader from '@/views/documentation/DocHeader'

export default {
  name: 'Sidebar',
  components: {
    DocHeader,
    BaseCollapseRightIcon,
    BaseUpIcon,
    BaseDownIcon,
    BaseRightIcon,
    BaseCollapseLeftIcon,
    BaseButton,
  },
  props: {
    theme: {
      type: String,
      default: '',
    },
  },
  data() {
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
              collapsed_view: 'contracts.collapsed_contracts_list',
            },
            {
              icon: null,
              name: 'debtors.new_title',
              route: 'debtors',
              collapsed_view: 'debtors.collapsed_new_title',
            },
            {
              icon: null,
              name: 'payments.payment_list',
              route: 'payments',
              collapsed_view: 'payments.collapsed_payment_list',
            },
          ],
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
              collapsed_view: 'contracts.collapsed_contracts_list',
            },
            {
              icon: null,
              name: 'debtors.new_title',
              route: 'debtors',
              collapsed_view: 'debtors.collapsed_new_title',
            },
            {
              icon: null,
              name: 'payments.payment_list',
              route: 'payments',
              collapsed_view: 'payments.collapsed_payment_list',
            },
          ],
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
              collapsed_view: 'contracts.collapsed_contracts_list',
            },
            {
              icon: null,
              name: 'debtors.new_title',
              route: 'debtors',
              collapsed_view: 'debtors.collapsed_new_title',
            },
            {
              icon: null,
              name: 'payments.payment_list',
              route: 'payments',
              collapsed_view: 'payments.collapsed_payment_list',
            },
          ],
        },
        {
          icon: BaseSettingsIcon,
          name: 'settings.title',
          route: 'profile',
          items: 0,
          collapse: true,
        },
      ],
    }
  },
  methods: {
    collapseMenu() {
      this.menu_collapse = !this.menu_collapse
    },
    collapseItems(index) {
      this.items[index].collapse = !this.items[index].collapse
    },
  },
}
</script>

<template>
  <main class="sidebar">
    <DocHeader title="sidebar" />
    <div class="sidebar-content">
      <div
        :class="
          menu_collapse === false
            ? 'sidebar-container lg'
            : 'sidebar-container sm'
        "
      >
        <div class="sidebar-container-top">
          <router-link :to="{ name: 'home' }">
            <img
              src="@/assets/img/object__img1.png"
              alt="Xonsaroy"
            >
          </router-link>
          <div class="items">
            <div
              v-for="({ icon, name, route, items, collapse }, index) in items"
              :key="index"
              class="item"
            >
              <template v-if="items">
                <div
                  :class="!collapse ? 'item-row purple-bg' : 'item-row'"
                  @click="collapseItems(index)"
                >
                  <div class="item-row-left">
                    <div class="icon">
                      <component :is="icon" />
                    </div>
                    <div
                      v-if="!menu_collapse"
                      class="text"
                    >
                      <p>{{ $t(name) }}</p>
                    </div>
                  </div>
                  <div
                    v-if="!menu_collapse && collapse"
                    class="icon down-icon"
                  >
                    <BaseDownIcon />
                  </div>
                  <div
                    v-if="!collapse && !menu_collapse"
                    class="icon down-icon"
                  >
                    <BaseUpIcon />
                  </div>
                </div>
                <p
                  v-if="collapse === false"
                  class="sub-items"
                >
                  <span
                    v-for="(
                      { icon, name, route, collapsed_view }, index
                    ) in items"
                    :key="index"
                  >
                    <router-link :to="{ name: route }">
                      <template v-if="!menu_collapse">
                        <BaseButton :text="`${$t(name)}`">
                          <template #left-icon>
                            <component :is="icon" />
                          </template>
                        </BaseButton>
                      </template>
                      <template v-if="menu_collapse && icon">
                        <span class="icon">
                          <component :is="icon" />
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
                <router-link
                  :to="{ name: route }"
                  :class="!collapse ? 'item-row purple-bg' : 'item-row'"
                >
                  <div
                    class="item-row-left"
                    @click="collapseItems(index)"
                  >
                    <div class="icon">
                      <component :is="icon" />
                    </div>
                    <div
                      v-if="!menu_collapse"
                      class="text"
                    >
                      <p>{{ $t(name) }}</p>
                    </div>
                  </div>
                </router-link>
              </template>
            </div>
          </div>
        </div>
        <div
          v-if="menu_collapse"
          class="hide"
          @click="collapseMenu"
        >
          <BaseCollapseRightIcon />
        </div>
        <div
          v-else
          class="hide"
          @click="collapseMenu"
        >
          <BaseCollapseLeftIcon />
          {{ $t("hide_menu") }}
        </div>
      </div>
    </div>
  </main>
</template>

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
    background: #e5e7eb;
    justify-content: center;
    align-items: center;
    &:hover {
      color: #7c3aed;
    }
  }
  .sidebar-container {
    min-height: 92vh;
    display: flex;
    flex-direction: column;
    gap: 46px;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #f3f4f6;
    border-radius: 56px;
    .item {
      .sub-items {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 8px;
        .base__button {
          background: #e5e7eb;
          width: 100%;
          font-style: normal;
          font-weight: 600;
          font-size: 16px;
          line-height: 22px;
          color: #4b5563;
          padding: 13px 24px;
          border-radius: 16px;
          justify-content: flex-start;
          &:hover {
            color: #7c3aed !important;
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
        background: linear-gradient(88.25deg, #7c3aed 0%, #818cf8 100%);
        border-radius: 16px;
        color: white !important;
      }
      .item-row {
        display: flex;
        cursor: pointer;
        padding: 19px 20px;
        justify-content: space-between;
        align-items: center;
        &:hover {
          background: linear-gradient(88.25deg, #7c3aed 0%, #818cf8 100%);
          border-radius: 16px;
          color: white !important;
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
      color: #9ca3af;
      cursor: pointer;
      align-items: center;
      padding: 19px 30px;
    }
  }
}
</style>
