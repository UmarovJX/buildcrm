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
        contract_templates: false,
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
              label: 'Active All',
              refer: 'all',
              parent: 'general',
            },

            {
              ...row,
              label: 'roles.permissions.name_ru',
              refer: 'ru',
              parent: name,
              inputActive: true,
              inputPlaceholder: 'roles.permissions.placeholder_ru',
              checkboxActive: false,
            },

            {
              ...row,
              label: 'roles.permissions.name_uz',
              refer: 'uz',
              parent: name,
              inputActive: true,
              inputPlaceholder: 'roles.permissions.placeholder_uz',
              checkboxActive: false,
            },

            {
              ...row,
              label: 'курс валют',
              refer: 'currency',
              parent: 'general',
            },

            {
              ...row,
              label: 'тема (темная, светлая)',
              refer: 'theme',
              parent: 'general',
            },

            {
              ...row,
              label: 'язык (русский, узбекский)',
              refer: 'language',
              parent: 'general',
            },

            {
              ...row,
              label: 'настройки полфиля',
              refer: 'settings',
              parent: 'general',
            },

            {
              ...row,
              label: 'право изменть данные пользователя',
              refer: 'profile_settings',
              parent: 'general',
            },

            {
              ...row,
              label: 'право изменять пароль пользователя',
              refer: 'password_settings',
              parent: 'general',
            },
          ],
        },
        {
          id: uuid(),
          title: 'objects.title',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: 'objects',
            },
            {
              ...row,
              label: 'право на просмотр страницу объектов',
              refer: 'view',
              parent: 'objects',
            },

            {
              ...row,
              label: 'право на создания объекта',
              refer: 'create',
              parent: 'objects',
            },

            {
              ...row,
              label: 'право на редактирования объектов',
              refer: 'edit',
              parent: 'objects',
            },

            {
              ...row,
              label: 'право на удаление объекта',
              refer: 'delete',
              parent: 'objects',
            },

            {
              ...row,
              label: 'право загрузить логотип',
              refer: 'upload_logo',
              parent: 'objects',
            },
          ],
        },
        {
          id: uuid(),
          title: 'promos',
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
              label: 'право на просмотр страницу акции',
              refer: 'view',
              parent: 'promos',
            },

            {
              ...row,
              label: 'право на создания акции',
              refer: 'create',
              parent: 'promos',
            },

            {
              ...row,
              label: 'право на редактирования акции',
              refer: 'edit',
              parent: 'promos',
            },

            {
              ...row,
              label: 'право на удаление акции',
              refer: 'delete',
              parent: 'promos',
            }
          ],
        },
        {
          id: uuid(),
          title: 'plans',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: 'plans',
            },
            {
              ...row,
              label: 'право на просмотр страницу планировки',
              refer: 'view',
              parent: 'plans',
            },

            {
              ...row,
              label: 'право на создания планировки',
              refer: 'create',
              parent: 'plans',
            },

            {
              ...row,
              label: 'право на редактирования планировки',
              refer: 'edit',
              parent: 'plans',
            },

            {
              ...row,
              label: 'право на удаление планировки',
              refer: 'delete',
              parent: 'plans',
            }
          ],
        },
        {
          id: uuid(),
          title: '_apartments',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: 'apartments',
            },
            {
              ...row,
              label: 'право просмотра списка квартир (страница одного объекта)',
              refer: 'view',
              parent: 'apartments',
            },

            {
              ...row,
              label: 'право пользования фильтром на странице списка квартир',
              refer: 'filter',
              parent: 'apartments',
            },

            {
              ...row,
              label: 'право редактировать квартиру (страница одного объекта)',
              refer: 'edit',
              parent: 'apartments',
            },

            {
              ...row,
              label: 'право снять с продажи и вернуть в продажу квартиру (страница одного объекта)',
              refer: 'is_sold',
              parent: 'apartments',
            },

            {
              ...row,
              label: 'право пользования списком для изменения вида списка квартир',
              refer: 'lists.list',
              parent: 'apartments',
            },

            {
              ...row,
              label: 'право пользования шахматкой 1.0 для изменения вида списка квартир',
              refer: 'lists.grid',
              parent: 'apartments',
            },

            {
              ...row,
              label: 'право пользования шахматкой 2.0 для изменения вида списка квартир',
              refer: 'lists.grid_sm',
              parent: 'apartments',
            },

            {
              ...row,
              label: 'право пользования планировкой для изменения вида списка квартир',
              refer: 'lists.plan',
              parent: 'apartments',
            },
          ],
        },
        {
          id: uuid(),
          title: 'checkout',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: 'checkout',
            },
            {
              ...row,
              label: 'право забронировать квартиру (страница одного объекта)',
              refer: 'book',
              parent: 'checkout',
            },

            {
              ...row,
              label: 'право оформления квартиры',
              refer: 'checkout',
              parent: 'checkout',
            },

            {
              ...row,
              label: 'право отмечать знакомых',
              refer: 'mark_friends',
              parent: 'checkout',
            },

            {
              ...row,
              label: 'право оформить договор по другой цене',
              refer: 'mark_price',
              parent: 'checkout',
            },

            {
              ...row,
              label: 'право оформить договор по другой цене',
              refer: 'edit_date',
              parent: 'checkout',
            },

            {
              ...row,
              label: 'право оформить договор по другому ежемесячному платежу',
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
          title: '_contracts',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: 'contracts',
            },
            {
              ...row,
              label: 'право просмотра списка договоров',
              refer: 'view',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'право пользования фильтром списка договоров',
              refer: 'filter',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'право на просмотр одного договора',
              refer: 'show',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'право скачивания договоров',
              refer: 'download',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'право отменить договоров',
              refer: 'cancel',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'право изменить тип клиента (вкладка \'Детали клиента\')',
              refer: 'client_type',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'право просмотра все договора филиала (менеджер филиала)',
              refer: 'root_branch',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'право посмотреть все контракты',
              refer: 'root',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'право импортировать оплаты (страница одного договора)',
              refer: 'import',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'право на просмотр список оплат (страница одного договора)',
              refer: 'list',
              parent: 'contracts',
            },

            /*{
              ...row,
              label: 'право на редактирования оплаты (страница одного договора)',
              refer: 'edit',
              parent: 'contracts',
            },*/

            /*{
              ...row,
              label: 'право на удаление оплаты (страница одного договора)',
              refer: 'delete',
              parent: 'contracts',
            },*/

            {
              ...row,
              label: 'право добавить оплату (страница одного договора)',
              refer: 'payments.create',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'право на создание первоначального типа оплаты',
              refer: 'payments.initial_type.create',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'право на редактирования первоначального типа оплаты',
              refer: 'payments.initial_type.edit',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'право на удаления первоначального типа оплаты',
              refer: 'payments.initial_type.delete',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'право на создание ежемесячного типа оплаты',
              refer: 'payments.monthly_type.create',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'право на редактирования ежемесячного типа оплаты',
              refer: 'payments.monthly_type.edit',
              parent: 'contracts',
            },

            {
              ...row,
              label: 'право на удаления ежемесячного типа оплаты',
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
          title: '_users',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: 'users',
            },
            {
              ...row,
              label: 'право просмотра списка пользователей',
              refer: 'view',
              parent: 'users',
            },

            {
              ...row,
              label: 'право на создания акции',
              refer: 'create',
              parent: 'users',
            },

            {
              ...row,
              label: 'право на редактирования акции',
              refer: 'edit',
              parent: 'users',
            },

            {
              ...row,
              label: 'право на удаление акции',
              refer: 'delete',
              parent: 'users',
            }
          ],
        },
        {
          id: uuid(),
          title: '_roles',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: 'roles',
            },
            {
              ...row,
              label: 'право просмотра списка ролей',
              refer: 'view',
              parent: 'roles',
            },

            {
              ...row,
              label: 'право добавления ролей',
              refer: 'create',
              parent: 'roles',
            },

            {
              ...row,
              label: 'право редактирования ролей',
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
          title: '_debtors',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: 'debtors',
            },
            {
              ...row,
              label: 'право просмотра списка должников',
              refer: 'view',
              parent: 'debtors',
            }
          ],
        },
        {
          id: uuid(),
          title: '_companies',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: 'companies',
            },
            {
              ...row,
              label: 'право просмотра списка компаний',
              refer: 'view',
              parent: 'companies',
            },

            {
              ...row,
              label: 'право просмотра одной компании',
              refer: 'create',
              parent: 'companies',
            },

            {
              ...row,
              label: 'право редактирования компании',
              refer: 'edit',
              parent: 'companies',
            },

            {
              ...row,
              label: 'право удаления компанию',
              refer: 'delete',
              parent: 'companies',
            }
          ],
        },
        {
          id: uuid(),
          title: '_payment_account',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: 'payment_account',
            },
            {
              ...row,
              label: 'право просмотра списка рассчетных счетов',
              refer: 'view',
              parent: 'payment_account',
            },

            {
              ...row,
              label: 'право добавления рассчетнего счета',
              refer: 'create',
              parent: 'payment_account',
            },

            {
              ...row,
              label: 'право редактирования рассчетнего счета',
              refer: 'edit',
              parent: 'payment_account',
            },

            {
              ...row,
              label: 'право редактирования рассчетнего счета',
              refer: 'delete',
              parent: 'payment_account',
            }
          ],
        },
        {
          id: uuid(),
          title: '_branches',
          active: false,
          parent: 'form',
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: 'branches',
            },
            {
              ...row,
              label: 'право просмотра списка филиалов',
              refer: 'view',
              parent: 'branches',
            },

            {
              ...row,
              label: 'право добавления филиала',
              refer: 'create',
              parent: 'branches',
            },

            {
              ...row,
              label: 'право редактирования филиала',
              refer: 'edit',
              parent: 'branches',
            },

            {
              ...row,
              label: 'право удаления филиала',
              refer: 'delete',
              parent: 'branches',
            },

            /*{
              ...row,
              label: 'право просмотра шаблона договора',
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

