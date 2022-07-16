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
                v-for="({title,active,rows,id}) in permissionTabs"
                :key="id"
                :title="$t(title)"
                :active="active"
            >
              <table class="table">
                <tbody>
                <tr
                    v-for="({
                    label,width,parent,
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
                        :checked="getCheckboxStatus(refer,parent)"
                        :switch="checkboxSwitch"
                        :size="checkboxSize"
                        @input="setCheckboxReferenceValue(refer,parent,$event)"
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
        ...crudPermission,
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
        }
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
        contract_templates: false
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
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: form.general,
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
              parent: form.general,
            },

            {
              ...row,
              label: 'тема (темная, светлая)',
              refer: 'theme',
              parent: form.general,
            },

            {
              ...row,
              label: 'язык (русский, узбекский)',
              refer: 'language',
              parent: form.general,
            },

            {
              ...row,
              label: 'настройки полфиля',
              refer: 'settings',
              parent: form.general,
            },

            {
              ...row,
              label: 'право изменть данные пользователя',
              refer: 'profile_settings',
              parent: form.general,
            },

            {
              ...row,
              label: 'право изменять пароль пользователя',
              refer: 'password_settings',
              parent: form.general,
            },
          ],
        },
        {
          id: uuid(),
          title: 'objects.title',
          active: false,
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: form.objects,
            },
            {
              ...row,
              label: 'право на просмотр страницу объектов',
              refer: 'view',
              parent: form.objects,
            },

            {
              ...row,
              label: 'право на создания объекта',
              refer: 'create',
              parent: form.objects,
            },

            {
              ...row,
              label: 'право на редактирования объектов',
              refer: 'edit',
              parent: form.objects,
            },

            {
              ...row,
              label: 'право на удаление объекта',
              refer: 'delete',
              parent: form.objects,
            },

            {
              ...row,
              label: 'право загрузить логотип',
              refer: 'upload_logo',
              parent: form.objects,
            },
          ],
        },
        {
          id: uuid(),
          title: 'promos',
          active: false,
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: form.promos,
            },
            {
              ...row,
              label: 'право на просмотр страницу акции',
              refer: 'view',
              parent: form.promos,
            },

            {
              ...row,
              label: 'право на создания акции',
              refer: 'create',
              parent: form.promos,
            },

            {
              ...row,
              label: 'право на редактирования акции',
              refer: 'edit',
              parent: form.promos,
            },

            {
              ...row,
              label: 'право на удаление акции',
              refer: 'delete',
              parent: form.promos,
            }
          ],
        },
        {
          id: uuid(),
          title: 'plans',
          active: false,
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: form.plans,
            },
            {
              ...row,
              label: 'право на просмотр страницу планировки',
              refer: 'view',
              parent: form.plans,
            },

            {
              ...row,
              label: 'право на создания планировки',
              refer: 'create',
              parent: form.plans,
            },

            {
              ...row,
              label: 'право на редактирования планировки',
              refer: 'edit',
              parent: form.plans,
            },

            {
              ...row,
              label: 'право на удаление планировки',
              refer: 'delete',
              parent: form.plans,
            }
          ],
        },
        {
          id: uuid(),
          title: '_apartments',
          active: false,
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: form.apartments,
            },
            {
              ...row,
              label: 'право просмотра списка квартир (страница одного объекта)',
              refer: 'view',
              parent: form.apartments,
            },

            {
              ...row,
              label: 'право пользования фильтром на странице списка квартир',
              refer: 'filter',
              parent: form.apartments,
            },

            {
              ...row,
              label: 'право редактировать квартиру (страница одного объекта)',
              refer: 'edit',
              parent: form.apartments,
            },

            {
              ...row,
              label: 'право снять с продажи и вернуть в продажу квартиру (страница одного объекта)',
              refer: 'is_sold',
              parent: form.apartments,
            },

            {
              ...row,
              label: 'право пользования списком для изменения вида списка квартир',
              refer: 'list',
              parent: form.apartments.lists,
            },

            {
              ...row,
              label: 'право пользования шахматкой 1.0 для изменения вида списка квартир',
              refer: 'grid',
              parent: form.apartments.lists,
            },

            {
              ...row,
              label: 'право пользования шахматкой 2.0 для изменения вида списка квартир',
              refer: 'grid_sm',
              parent: form.apartments.lists,
            },

            {
              ...row,
              label: 'право пользования планировкой для изменения вида списка квартир',
              refer: 'plan',
              parent: form.apartments.lists,
            },
          ],
        },
        {
          id: uuid(),
          title: 'checkout',
          active: false,
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: form.checkout,
            },
            {
              ...row,
              label: 'право забронировать квартиру (страница одного объекта)',
              refer: 'book',
              parent: form.checkout,
            },

            {
              ...row,
              label: 'право оформления квартиры',
              refer: 'checkout',
              parent: form.checkout,
            },

            {
              ...row,
              label: 'право отмечать знакомых',
              refer: 'mark_friends',
              parent: form.checkout,
            },

            {
              ...row,
              label: 'право оформить договор по другой цене',
              refer: 'mark_price',
              parent: form.checkout,
            },

            {
              ...row,
              label: 'право оформить договор по другой цене',
              refer: 'edit_date',
              parent: form.checkout,
            },

            {
              ...row,
              label: 'право оформить договор по другому ежемесячному платежу',
              refer: 'monthly_payment',
              parent: form.checkout,
            },

            {
              ...row,
              label: 'full access',
              refer: 'root',
              parent: form.checkout,
            }
          ],
        },
        {
          id: uuid(),
          title: '_contracts',
          active: false,
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: form.contracts,
            },
            {
              ...row,
              label: 'право просмотра списка договоров',
              refer: 'view',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'право пользования фильтром списка договоров',
              refer: 'filter',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'право на просмотр одного договора',
              refer: 'show',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'право скачивания договоров',
              refer: 'download',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'право отменить договоров',
              refer: 'cancel',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'право изменить тип клиента (вкладка \'Детали клиента\')',
              refer: 'client_type',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'право просмотра все договора филиала (менеджер филиала)',
              refer: 'root_branch',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'право посмотреть все контракты',
              refer: 'root',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'право импортировать оплаты (страница одного договора)',
              refer: 'import',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'право на просмотр список оплат (страница одного договора)',
              refer: 'list',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'право на редактирования оплаты (страница одного договора)',
              refer: 'edit',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'право на удаление оплаты (страница одного договора)',
              refer: 'delete',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'право добавить оплату (страница одного договора)',
              refer: 'create',
              parent: form.contracts.payments,
            },

            {
              ...row,
              label: 'право на создание первоначального типа оплаты',
              refer: 'create',
              parent: form.contracts.payments.initial_type,
            },

            {
              ...row,
              label: 'право на редактирования первоначального типа оплаты',
              refer: 'edit',
              parent: form.contracts.payments.initial_type,
            },

            {
              ...row,
              label: 'право на удаления первоначального типа оплаты',
              refer: 'delete',
              parent: form.contracts.payments.initial_type,
            },

            {
              ...row,
              label: 'право на создание ежемесячного типа оплаты',
              refer: 'create',
              parent: form.contracts.payments.monthly_type,
            },

            {
              ...row,
              label: 'право на редактирования ежемесячного типа оплаты',
              refer: 'edit',
              parent: form.contracts.payments.monthly_type,
            },

            {
              ...row,
              label: 'право на удаления ежемесячного типа оплаты',
              refer: 'delete',
              parent: form.contracts.payments.monthly_type,
            },
          ],
        },
        {
          id: uuid(),
          title: '_users',
          active: false,
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: form.users,
            },
            {
              ...row,
              label: 'право просмотра списка пользователей',
              refer: 'view',
              parent: form.users,
            },

            {
              ...row,
              label: 'право на создания акции',
              refer: 'create',
              parent: form.users,
            },

            {
              ...row,
              label: 'право на редактирования акции',
              refer: 'edit',
              parent: form.users,
            },

            {
              ...row,
              label: 'право на удаление акции',
              refer: 'delete',
              parent: form.users,
            }
          ],
        },
        {
          id: uuid(),
          title: '_roles',
          active: false,
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: form.roles,
            },
            {
              ...row,
              label: 'право просмотра списка ролей',
              refer: 'view',
              parent: form.roles,
            },

            {
              ...row,
              label: 'право добавления ролей',
              refer: 'create',
              parent: form.roles,
            },

            {
              ...row,
              label: 'право редактирования ролей',
              refer: 'edit',
              parent: form.roles,
            },

            {
              ...row,
              label: 'право редактирования ролей',
              refer: 'delete',
              parent: form.roles,
            }
          ],
        },
        {
          id: uuid(),
          title: '_debtors',
          active: false,
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: form.debtors,
            },
            {
              ...row,
              label: 'право просмотра списка должников',
              refer: 'view',
              parent: form.debtors,
            }
          ],
        },
        {
          id: uuid(),
          title: '_companies',
          active: false,
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: form.companies,
            },
            {
              ...row,
              label: 'право просмотра списка компаний',
              refer: 'view',
              parent: form.companies,
            },

            {
              ...row,
              label: 'право просмотра одной компании',
              refer: 'create',
              parent: form.companies,
            },

            {
              ...row,
              label: 'право редактирования компании',
              refer: 'edit',
              parent: form.companies,
            },

            {
              ...row,
              label: 'право удаления компанию',
              refer: 'delete',
              parent: form.companies,
            }
          ],
        },
        {
          id: uuid(),
          title: '_payment_account',
          active: false,
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: form.payment_account,
            },
            {
              ...row,
              label: 'право просмотра списка рассчетных счетов',
              refer: 'view',
              parent: form.payment_account,
            },

            {
              ...row,
              label: 'право добавления рассчетнего счета',
              refer: 'create',
              parent: form.payment_account,
            },

            {
              ...row,
              label: 'право редактирования рассчетнего счета',
              refer: 'edit',
              parent: form.payment_account,
            },

            {
              ...row,
              label: 'право редактирования рассчетнего счета',
              refer: 'delete',
              parent: form.payment_account,
            }
          ],
        },
        {
          id: uuid(),
          title: '_branches',
          active: false,
          rows: [
            {
              ...row,
              label: 'Active All',
              refer: 'all',
              parent: form.branches,
            },
            {
              ...row,
              label: 'право просмотра списка филиалов',
              refer: 'view',
              parent: form.branches,
            },

            {
              ...row,
              label: 'право добавления филиала',
              refer: 'create',
              parent: form.branches,
            },

            {
              ...row,
              label: 'право редактирования филиала',
              refer: 'edit',
              parent: form.branches,
            },

            {
              ...row,
              label: 'право удаления филиала',
              refer: 'delete',
              parent: form.branches,
            },

            {
              ...row,
              label: 'право просмотра шаблона договора',
              refer: 'contract_templates',
              parent: form.branches,
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
    getCheckboxStatus(refer, parent) {
      console.log(parent[refer])
      return parent[refer]
    },
    initPermissions() {
      this.form = {
        ...this.form,
        ...this.permissions
      }
      this.name = this.updatingName
    },
    setCheckboxReferenceValue(refer, parent, value) {
      if (refer === 'all') {
        this.deepSet(parent, value)
      } else {
        parent[refer] = value
      }
    },
    deepSet(obj, valueToSet) {
      for (let [key, value] of Object.entries(obj)) {
        if (typeof value === 'object') {
          this.deepSet(value, valueToSet)
        } else {
          obj[key] = valueToSet
          console.log(obj)
        }
      }
    },
    createNewRole() {
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

