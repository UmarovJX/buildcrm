<template>
  <main>
    <div class="app-content">
      <div
          class="
          d-flex
          justify-content-between
          align-items-center
          flex-md-row flex-column
          pb-3
          pt-0
          px-0
          py-lg-3
        "
      >
        <div
            class="d-flex w-100 align-items-center flex-md-row flex-column mb-0"
        >
          <h1 class="title__big my-0">{{ $t("roles.title") }}</h1>
          <ul class="breadcrumb ml-md-4 ml-md-3 mb-0 mb-md-0">
            <li class="breadcrumb-item">
              <router-link :to="{name: 'home'}">
                <i class="far fa-home"></i>
              </router-link>
            </li>

            <li class="breadcrumb-item">
              <router-link :to="{name: 'roles'}">
                {{ $t("roles.title") }}
              </router-link>
            </li>
            <li class="breadcrumb-item active">
              {{ $t("edit") }}
            </li>
          </ul>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <b-tabs content-class="mt-3">
            <b-tab
                v-for="({title,active,rows,id},pmIndex) in permissionTabs"
                :key="id"
                :title="$t(title)"
                :active="active"
            >
              <table class="table">
                <tbody>
                <tr
                    v-for="({
                    label,width,
                    refer,checkboxSwitch,
                    checkboxActive,checkboxSize,inputActive,
                    inputClass,inputPlaceholder,inputType},index) in rows"
                    :key="index+label+id"
                >
                  <td :width="width">
                    {{ $t(label) }}
                  </td>
                  <td v-if="checkboxActive">
                    <b-form-checkbox
                        :switch="checkboxSwitch"
                        :size="checkboxSize"
                        v-model="permissionTabs[pmIndex]['rows'][index].vBind"
                        @input="activeAllTabPermission(refer,pmIndex,index,$event)"
                    ></b-form-checkbox>
                  </td>
                  <td v-if="inputActive">
                    <input
                        :type="inputType"
                        :class="inputClass"
                        :placeholder="$t(inputPlaceholder)"
                        v-model="name[refer]"
                    >
                  </td>
                </tr>
                </tbody>
              </table>
            </b-tab>
          </b-tabs>
        </div>

        <div class="card-footer d-flex">
          <button class="btn btn-primary" @click="createNewRole">
            <i class="fas fa-save"></i> {{ $t("save") }}
          </button>

          <button class="btn btn-default" @click="$router.go(-1)">
            {{ $t("cancel") }}
          </button>
        </div>
      </div>
    </div>

    <b-overlay :show="getLoading" no-wrap opacity="0.5">
      <template #overlay>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </template>
    </b-overlay>
  </main>
</template>

<script>
import api from "@/services/api";
import {v4 as uuid} from 'uuid';

export default {
  name: 'Roles',
  props: {
    comeFrom: {
      type: String,
      default: 'create'
    },
    updatingName: {
      type: Object,
      default: () => ({
        uz: '',
        ru: ''
      })
    },
    permissions: {
      type: Object,
      default: () => ({})
    },
    appLoading: {
      type: String,
      default: 'default'
    }
  },
  emits: ['submit'],
  data() {
    const row = {
      width: '50%',
      inputActive: false,
      inputType: 'text',
      inputPlaceholder: '',
      inputClass: 'form-control',
      checkboxActive: true,
      checkboxSize: 'lg',
      checkboxSwitch: true,
      vBind: false
    }

    const crudPermission = {
      view: false,
      create: false,
      edit: false,
      delete: false
    }

    const name = this.updatingName

    const form = {
      general: {
        currency: false,
        theme: false,
        language: false,
        settings: false,
        profile_settings: false,
        password_settings: false
      },
      objects: {
        ...crudPermission,
        show: false,
        upload_logo: false
      },
      promos: {
        ...crudPermission
      },
      plans: {
        ...crudPermission
      },
      apartments: {
        view: false,
        filter: false,
        lists: {
          list: false,
          grid: false,
          grid_sm: false,
          plan: false
        },
        edit: false,
        is_sold: false,
      },
      checkout: {
        book: false,
        checkout: false,
        mark_friends: false,
        mark_price: false,
        edit_date: false,
        monthly_payment: false,
        root: false
      },
      contracts: {
        view: false,
        create: false,
        filter: false,
        download: false,
        cancel: false,
        client_type: false,
        root_branch: false,
        root: false,
        uniformity: false,
        comments: false,
        edit: true,
        payments: {
          create: false,
          initial_type: {
            ...crudPermission
          },
          monthly_type: {
            ...crudPermission
          },
          import: false,
          list: false
        },
        reissue: {
          view: true,
          create: true
        },
      },
      users: {
        ...crudPermission
      },
      roles: {
        ...crudPermission
      },
      companies: {
        ...crudPermission
      },
      payment_account: {
        ...crudPermission
      },
      branches: {
        ...crudPermission,
        // contract_templates: false,
        templates: {
          view: true,
          create: true,
          delete: true,
          is_primary: true,
          instruction: true,
          download: true
        },
      },
      debtors: {
        view: false
      },
    }

    return {
      form,
      name,
      permissionTabs: [
        {
          id: uuid(),
          title: 'general',
          active: true,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: 'general',
            },

            {
              ...row,
              label: 'roles_permission.general.role_name_ru',
              refer: 'ru',
              parent: name,
              inputActive: true,
              inputPlaceholder: 'roles_permission.placeholder_ru',
              checkboxActive: false,
            },

            {
              ...row,
              label: 'roles_permission.general.role_name_uz',
              refer: 'uz',
              parent: name,
              inputActive: true,
              inputPlaceholder: 'roles_permission.placeholder_uz',
              checkboxActive: false,
            },

            {
              ...row,
              label: 'roles_permission.general.exchange_rates',
              refer: 'currency',
              parent: 'general',
            },

            {
              ...row,
              label: 'roles_permission.general.theme',
              refer: 'theme',
              parent: 'general',
            },

            {
              ...row,
              label: 'roles_permission.general.language',
              refer: 'language',
              parent: 'general',
            },

            {
              ...row,
              label: 'roles_permission.general.profile_settings',
              refer: 'settings',
              parent: 'general',
            },

            {
              ...row,
              label: 'roles_permission.general.user_data',
              refer: 'profile_settings',
              parent: 'general',
            },

            {
              ...row,
              label: 'roles_permission.general.user_password',
              refer: 'password_settings',
              parent: 'general',
            },
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.objects',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: 'objects',
            },
            {
              ...row,
              label: 'roles_permission.objects.watch_objects',
              refer: 'view',
              parent: 'objects',
            },

            {
              ...row,
              label: 'roles_permission.objects.create_object',
              refer: 'create',
              parent: 'objects',
            },

            {
              ...row,
              label: 'roles_permission.objects.edit_object',
              refer: 'edit',
              parent: 'objects',
            },

            {
              ...row,
              label: 'roles_permission.objects.delete_object',
              refer: 'delete',
              parent: 'objects',
            },

            {
              ...row,
              label: 'roles_permission.objects.download_logo',
              refer: 'upload_logo',
              parent: 'objects',
            },
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.promos',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: 'promos',
            },
            {
              ...row,
              label: 'roles_permission.promos.watch_promos_page',
              refer: 'view',
              parent: 'promos',
            },

            {
              ...row,
              label: 'roles_permission.promos.create_promo',
              refer: 'create',
              parent: 'promos',
            },

            {
              ...row,
              label: 'roles_permission.promos.edit_promo',
              refer: 'edit',
              parent: 'promos',
            },

            {
              ...row,
              label: 'roles_permission.promos.delete_promo',
              refer: 'delete',
              parent: 'promos',
            }
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.layouts',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: 'plans',
            },
            {
              ...row,
              label: 'roles_permission.layouts.watch_layouts',
              refer: 'view',
              parent: 'plans',
            },

            {
              ...row,
              label: 'roles_permission.layouts.create_layouts',
              refer: 'create',
              parent: 'plans',
            },

            {
              ...row,
              label: 'roles_permission.layouts.edit_layouts',
              refer: 'edit',
              parent: 'plans',
            },

            {
              ...row,
              label: 'roles_permission.layouts.delete_layouts',
              refer: 'delete',
              parent: 'plans',
            }
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.apartments',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: 'apartments',
            },
            {
              ...row,
              label: 'roles_permission.apartments.watch_apartments',
              refer: 'view',
              parent: 'apartments',
            },

            {
              ...row,
              label: 'roles_permission.apartments.filter_apartments',
              refer: 'filter',
              parent: 'apartments',
            },

            {
              ...row,
              label: 'roles_permission.apartments.edit_apartment',
              refer: 'edit',
              parent: 'apartments',
            },

            {
              ...row,
              label: 'roles_permission.apartments.status_apartments',
              refer: 'is_sold',
              parent: 'apartments',
            },

            {
              ...row,
              label: 'roles_permission.apartments.change_list_apartments',
              refer: 'lists.list',
              parent: 'apartments',
            },

            {
              ...row,
              label: 'roles_permission.apartments.list_apartments1',
              refer: 'lists.grid',
              parent: 'apartments',
            },

            {
              ...row,
              label: 'roles_permission.apartments.list_apartments2',
              refer: 'lists.grid_sm',
              parent: 'apartments',
            },

            {
              ...row,
              label: 'roles_permission.apartments.using_layouts',
              refer: 'lists.plan',
              parent: 'apartments',
            },
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.execution',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: 'checkout',
            },
            {
              ...row,
              label: 'roles_permission.execution.book_apartment',
              refer: 'book',
              parent: 'checkout',
            },

            {
              ...row,
              label: 'roles_permission.execution.decorate_apartment',
              refer: 'checkout',
              parent: 'checkout',
            },

            {
              ...row,
              label: 'roles_permission.execution.tag_acquaintances',
              refer: 'mark_friends',
              parent: 'checkout',
            },

            {
              ...row,
              label: 'roles_permission.execution.change_payment',
              refer: 'mark_price',
              parent: 'checkout',
            },

            {
              ...row,
              label: 'roles_permission.execution.change_monthly_payment',
              refer: 'edit_date',
              parent: 'checkout',
            },

            {
              ...row,
              label: 'roles_permission.execution.full_access',
              refer: 'monthly_payment',
              parent: 'checkout',
            },

            {
              ...row,
              label: 'full access',
              refer: 'root',
              parent: 'checkout',
            }
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.contracts',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: 'contracts',
            },
            {
              ...row,
              label: 'roles_permission.contracts.watch_deals',
              refer: 'view',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'roles_permission.contracts.filter_deals',
              refer: 'filter',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'roles_permission.contracts.watch_deal',
              refer: 'show',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'roles_permission.contracts.download_deal',
              refer: 'download',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'roles_permission.contracts.decline_deal',
              refer: 'cancel',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'roles_permission.contracts.client_type',
              refer: 'client_type',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'roles_permission.contracts.watch_branch_deals',
              refer: 'root_branch',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'roles_permission.contracts.import',
              refer: 'root',
              parent: 'contracts',
            },

            /*{
              ...row,
              label: 'roles_permission.contracts.edit_payment',
              refer: 'edit',
              parent: 'contracts',
            },*/

            /*{
              ...row,
              label: 'roles_permission.contracts.delete_payment',
              refer: 'delete',
              parent: 'contracts',
            },*/
            {
              ...row,
              label: 'To\'lovlarni ko\'rish huquqi',
              refer: 'payments.list',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'To\'lovlarni yuklab olish huquqi',
              refer: 'payments.import',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'roles_permission.contracts.add_payment',
              refer: 'payments.create',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'roles_permission.contracts.create_type_payment',
              refer: 'payments.initial_type.create',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'roles_permission.contracts.edit_type_payment',
              refer: 'payments.initial_type.edit',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'roles_permission.contracts.delete_type_payment',
              refer: 'payments.initial_type.delete',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'roles_permission.contracts.create_monthly_payment',
              refer: 'payments.monthly_type.create',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'roles_permission.contracts.edit_monthly_type',
              refer: 'payments.monthly_type.edit',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'roles_permission.contracts.delete_monthly_type',
              refer: 'payments.monthly_type.delete',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'reissue view',
              refer: 'reissue.view',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'reissue create',
              refer: 'reissue.create',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'Равномерностью',
              refer: 'uniformity',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'allow to comment in the contract page',
              refer: 'comments',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'given permission to edit contract',
              refer: 'edit',
              parent: 'contracts',
            },
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.users',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: 'users',
            },
            {
              ...row,
              label: 'roles_permission.users.watch_users',
              refer: 'view',
              parent: 'users',
            },

            {
              ...row,
              label: 'roles_permission.users.create_user',
              refer: 'create',
              parent: 'users',
            },

            {
              ...row,
              label: 'roles_permission.users.edit_user',
              refer: 'edit',
              parent: 'users',
            },

            {
              ...row,
              label: 'roles_permission.users.delete_user',
              refer: 'delete',
              parent: 'users',
            }
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.roles',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: 'roles',
            },
            {
              ...row,
              label: 'roles_permission.roles.watch_roles',
              refer: 'view',
              parent: 'roles',
            },

            {
              ...row,
              label: 'roles_permission.roles.add_roles',
              refer: 'create',
              parent: 'roles',
            },

            {
              ...row,
              label: 'roles_permission.roles.edit_roles',
              refer: 'edit',
              parent: 'roles',
            },

            {
              ...row,
              label: 'право редактирования ролей',
              refer: 'delete',
              parent: 'roles',
            }
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.debtors',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: 'debtors',
            },
            {
              ...row,
              label: 'roles_permission.debtors.watch_debtors',
              refer: 'view',
              parent: 'debtors',
            }
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.companies',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'roles_permission.apartments.status_apartments',
              refer: 'all',
              parent: 'companies',
            },
            {
              ...row,
              label: 'roles_permission.companies.watch_companies',
              refer: 'view',
              parent: 'companies',
            },

            {
              ...row,
              label: 'roles_permission.companies.watch_company',
              refer: 'create',
              parent: 'companies',
            },

            {
              ...row,
              label: 'roles_permission.companies.edit_companies',
              refer: 'edit',
              parent: 'companies',
            },

            {
              ...row,
              label: 'roles_permission.companies.delete_company',
              refer: 'delete',
              parent: 'companies',
            }
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.payment_account',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: 'payment_account',
            },
            {
              ...row,
              label: 'roles_permission.payment_account.access_payments_list',
              refer: 'view',
              parent: 'payment_account',
            },

            {
              ...row,
              label: 'roles_permission.payment_account.add_payment',
              refer: 'create',
              parent: 'payment_account',
            },

            {
              ...row,
              label: 'roles_permission.payment_account.edit_payment',
              refer: 'edit',
              parent: 'payment_account',
            },

            {
              ...row,
              label: 'roles_permission.payment_account.delete_payment',
              refer: 'delete',
              parent: 'payment_account',
            }
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.branches',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: 'branches',
            },
            {
              ...row,
              label: 'roles_permission.branches.watch_branches',
              refer: 'view',
              parent: 'branches',
            },

            {
              ...row,
              label: 'roles_permission.branches.edit_branch',
              refer: 'create',
              parent: 'branches',
            },

            {
              ...row,
              label: 'roles_permission.branches.delete_branch',
              refer: 'edit',
              parent: 'branches',
            },

            {
              ...row,
              label: 'roles_permission.branches.delete_branch',
              refer: 'delete',
              parent: 'branches',
            },

            /*{
              ...row,
              label: 'roles_permission.branches.watch_contract_template',
              refer: 'contract_templates',
              parent: 'branches',
            },*/

            {
              ...row,
              label: 'given permission to view branches template',
              refer: 'templates.view',
              parent: 'branches',
            },

            {
              ...row,
              label: 'given permission to create branches template',
              refer: 'templates.create',
              parent: 'branches',
            },

            {
              ...row,
              label: 'given permission to delete branches template',
              refer: 'templates.delete',
              parent: 'branches',
            },

            {
              ...row,
              label: 'given permission to make the main branches contract template',
              refer: 'templates.is_primary',
              parent: 'branches',
            },

            {
              ...row,
              label: 'given permission to make the main branches contract template',
              refer: 'templates.is_primary',
              parent: 'branches',
            },

            {
              ...row,
              label: 'given permission to be able to view contract template instruction',
              refer: 'templates.instruction',
              parent: 'branches',
            },

            {
              ...row,
              label: 'given permission to be able to view contract template instruction',
              refer: 'templates.instruction',
              parent: 'branches',
            },

            {
              ...row,
              label: 'given permission to be able to download contract template',
              refer: 'templates.download',
              parent: 'branches',
            }
          ],
        },
      ],
      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },
      getLoading: false,
    }
  },
  watch: {
    appLoading(loadingState) {
      if (loadingState === 'finished' && this.comeFrom === 'update') {
        this.initPermissions()
      }
    }
  },
  methods: {
    initPermissions() {
      this.$nextTick(() => {
        this.form = {
          ...this.form,
          ...this.permissions
        }
        this.name = this.updatingName
        this.permissionTabs = this.permissionTabs.map(pmTab => {
          const rows = pmTab.rows.map(row => {
            if (row.refer === 'ru' || row.refer === 'uz') {
              return row
            }
            const pmTabParent = this[pmTab.parent][row.parent]
            const hierarchyList = row.refer.split('.')
            const [one, two, three, four, five] = hierarchyList

            switch (hierarchyList.length) {
              case 1 : {
                row.vBind = pmTabParent[one] ?? false
                break
              }
              case 2 : {
                row.vBind = pmTabParent[one][two]
                break
              }
              case 3 : {
                row.vBind = pmTabParent[one][two][three]
                break
              }
              case 4 : {
                row.vBind = pmTabParent[one][two][three][four]
                break
              }
              case 5 : {
                row.vBind = pmTabParent[one][two][three][four][five]
                break
              }
            }
            return row
          })
          const isAllActive = rows.every(row => {
            const overlookList = ['all', 'ru', 'uz']
            if (overlookList.includes(row.refer)) {
              return true
            }
            return row.vBind
          })
          if (isAllActive) {
            const indexOfAllSwitch = rows.findIndex(row => row.refer === 'all')
            if (indexOfAllSwitch !== -1) {
              rows[indexOfAllSwitch].vBind = true
            }
          }
          return {
            ...pmTab,
            rows
          }
        })
      })
    },
    activeAllTabPermission(refer, pmIndex, index, value) {
      // const allActivateSwitchIndex = this.permissionTabs[pmIndex]['rows'].findIndex(row => row.refer === 'all')
      if (refer === 'all') {
        this.permissionTabs[pmIndex]['rows'] = this.permissionTabs[pmIndex]['rows'].map(row => {
          return {
            ...row,
            vBind: value
          }
        })
      }
      // else if (allActivateSwitchIndex !== -1) {
      //   const isAllActive = this.permissionTabs[pmIndex]['rows'].every(row => {
      //     if (row.refer === 'all') return true
      //     return row.vBind
      //   })
      //   const isAllInactive = this.permissionTabs[pmIndex]['rows'].every(row => {
      //     if (row.refer === 'all') return false
      //     return !row.vBind
      //   })
      //   if (isAllActive) {
      //     this.permissionTabs[pmIndex]['rows'][allActivateSwitchIndex].vBind = true
      //   }
      //
      //   // console.log(isAllActive, isAllInactive)
      //
      //   if (isAllInactive) {
      //     this.permissionTabs[pmIndex]['rows'][allActivateSwitchIndex].vBind = false
      //   }
      // }
      // else if (allActivateSwitchIndex !== -1) {
      //   const {vBind} = this.permissionTabs[pmIndex]['rows'][allActivateSwitchIndex]
      //   if (!value && vBind) {
      //     this.permissionTabs[pmIndex]['rows'][allActivateSwitchIndex].vBind = false
      //   }
      // }
    },
    deepSet(obj, valueToSet) {
      for (let [key, value] of Object.entries(obj)) {
        if (typeof value === 'object') {
          this.deepSet(value, valueToSet)
        } else {
          obj[key] = valueToSet
        }
      }
    },
    generateRole() {
      this.permissionTabs.forEach(pmTab => {
        pmTab.rows.filter((row => {
          const overlookList = ['all', 'ru', 'uz']
          return !overlookList.includes(row.refer)
        })).forEach(row => {
          const pmTabParent = this[pmTab.parent][row.parent]
          const hierarchyList = row.refer.split('.')
          const [one, two, three, four, five] = hierarchyList
          switch (hierarchyList.length) {
            case 1 : {
              pmTabParent[one] = row.vBind
              break
            }
            case 2 : {
              pmTabParent[one][two] = row.vBind
              break
            }
            case 3 : {
              pmTabParent[one][two][three] = row.vBind
              break
            }
            case 4 : {
              pmTabParent[one][two][three][four] = row.vBind
              break
            }
            case 5 : {
              pmTabParent[one][two][three][four][five] = row.vBind
              break
            }
          }
        })
      })
    },
    createNewRole() {
      this.generateRole()
      if (this.comeFrom === 'update') {
        this.$emit('submit', {
          name: this.name,
          permissions: this.form
        })
      } else {
        this.getLoading = true
        let data = {
          name: this.name,
          permissions: this.form,
        }

        api.roles.createRole(data)
            .then((response) => {
              this.getLoading = false;
              this.toasted(response.data.message, "success")

              this.$router.push({name: "roles"})

              this.$swal(`${this.$t("sweetAlert.success_create_role")}`, "", "success")
            })
            .catch((error) => {
              this.toastedWithErrorCode(error)
            })
            .finally(() => {
              this.getLoading = false
            })
      }
    }
  },
}
</script>

