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
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: form.general,
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
              parent: form.general,
            },

            {
              ...row,
              label: 'roles_permission.general.theme',
              refer: 'theme',
              parent: form.general,
            },

            {
              ...row,
              label: 'roles_permission.general.language',
              refer: 'language',
              parent: form.general,
            },

            {
              ...row,
              label: 'roles_permission.general.profile_settings',
              refer: 'settings',
              parent: form.general,
            },

            {
              ...row,
              label: 'roles_permission.general.user_data',
              refer: 'profile_settings',
              parent: form.general,
            },

            {
              ...row,
              label: 'roles_permission.general.user_password',
              refer: 'password_settings',
              parent: form.general,
            },
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.objects',
          active: false,
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: form.objects,
            },
            {
              ...row,
              label: 'roles_permission.objects.watch_objects',
              refer: 'view',
              parent: form.objects,
            },

            {
              ...row,
              label: 'roles_permission.objects.create_object',
              refer: 'create',
              parent: form.objects,
            },

            {
              ...row,
              label: 'roles_permission.objects.edit_object',
              refer: 'edit',
              parent: form.objects,
            },

            {
              ...row,
              label: 'roles_permission.objects.delete_object',
              refer: 'delete',
              parent: form.objects,
            },

            {
              ...row,
              label: 'roles_permission.objects.download_logo',
              refer: 'upload_logo',
              parent: form.objects,
            },
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.promos',
          active: false,
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: form.promos,
            },
            {
              ...row,
              label: 'roles_permission.promos.watch_promos_page',
              refer: 'view',
              parent: form.promos,
            },

            {
              ...row,
              label: 'roles_permission.promos.create_promo',
              refer: 'create',
              parent: form.promos,
            },

            {
              ...row,
              label: 'roles_permission.promos.edit_promo',
              refer: 'edit',
              parent: form.promos,
            },

            {
              ...row,
              label: 'roles_permission.promos.delete_promo',
              refer: 'delete',
              parent: form.promos,
            }
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.layouts',
          active: false,
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: form.plans,
            },
            {
              ...row,
              label: 'roles_permission.layouts.watch_layouts',
              refer: 'view',
              parent: form.plans,
            },

            {
              ...row,
              label: 'roles_permission.layouts.create_layouts',
              refer: 'create',
              parent: form.plans,
            },

            {
              ...row,
              label: 'roles_permission.layouts.edit_layouts',
              refer: 'edit',
              parent: form.plans,
            },

            {
              ...row,
              label: 'roles_permission.layouts.delete_layouts',
              refer: 'delete',
              parent: form.plans,
            }
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.apartments',
          active: false,
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: form.apartments,
            },
            {
              ...row,
              label: 'roles_permission.apartments.watch_apartments',
              refer: 'view',
              parent: form.apartments,
            },

            {
              ...row,
              label: 'roles_permission.apartments.filter_apartments',
              refer: 'filter',
              parent: form.apartments,
            },

            {
              ...row,
              label: 'roles_permission.apartments.edit_apartment',
              refer: 'edit',
              parent: form.apartments,
            },

            {
              ...row,
              label: 'roles_permission.apartments.status_apartments',
              refer: 'is_sold',
              parent: form.apartments,
            },

            {
              ...row,
              label: 'roles_permission.apartments.change_list_apartments',
              refer: 'list',
              parent: form.apartments.lists,
            },

            {
              ...row,
              label: 'roles_permission.apartments.list_apartments1',
              refer: 'grid',
              parent: form.apartments.lists,
            },

            {
              ...row,
              label: 'roles_permission.apartments.list_apartments2',
              refer: 'grid_sm',
              parent: form.apartments.lists,
            },

            {
              ...row,
              label: 'roles_permission.apartments.using_layouts',
              refer: 'plan',
              parent: form.apartments.lists,
            },
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.execution',
          active: false,
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: form.checkout,
            },
            {
              ...row,
              label: 'roles_permission.execution.book_apartment',
              refer: 'book',
              parent: form.checkout,
            },

            {
              ...row,
              label: 'roles_permission.execution.decorate_apartment',
              refer: 'checkout',
              parent: form.checkout,
            },

            {
              ...row,
              label: 'roles_permission.execution.tag_acquaintances',
              refer: 'mark_friends',
              parent: form.checkout,
            },

            {
              ...row,
              label: 'roles_permission.execution.change_payment',
              refer: 'mark_price',
              parent: form.checkout,
            },

            {
              ...row,
              label: 'roles_permission.execution.change_monthly_payment',
              refer: 'edit_date',
              parent: form.checkout,
            },

            {
              ...row,
              label: 'roles_permission.execution.full_access',
              refer: 'monthly_payment',
              parent: form.checkout,
            },
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.contracts',
          active: false,
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: form.contracts,
            },
            {
              ...row,
              label: 'roles_permission.contracts.watch_deals',
              refer: 'view',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'roles_permission.contracts.filter_deals',
              refer: 'filter',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'roles_permission.contracts.watch_deal',
              refer: 'show',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'roles_permission.contracts.download_deal',
              refer: 'download',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'roles_permission.contracts.decline_deal',
              refer: 'cancel',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'roles_permission.contracts.client_type',
              refer: 'client_type',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'roles_permission.contracts.watch_branch_deals',
              refer: 'root_branch',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'roles_permission.contracts.import',
              refer: 'root',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'roles_permission.contracts.change_date_deal',
              refer: 'import',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'roles_permission.contracts.edit_monthly_payment',
              refer: 'list',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'roles_permission.contracts.edit_payment',
              refer: 'edit',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'roles_permission.contracts.delete_payment',
              refer: 'delete',
              parent: form.contracts,
            },

            {
              ...row,
              label: 'roles_permission.contracts.add_payment',
              refer: 'create',
              parent: form.contracts.payments,
            },

            {
              ...row,
              label: 'roles_permission.contracts.create_type_payment',
              refer: 'create',
              parent: form.contracts.payments.initial_type,
            },

            {
              ...row,
              label: 'roles_permission.contracts.edit_type_payment',
              refer: 'edit',
              parent: form.contracts.payments.initial_type,
            },

            {
              ...row,
              label: 'roles_permission.contracts.delete_type_payment',
              refer: 'delete',
              parent: form.contracts.payments.initial_type,
            },

            {
              ...row,
              label: 'roles_permission.contracts.create_monthly_payment',
              refer: 'create',
              parent: form.contracts.payments.monthly_type,
            },

            {
              ...row,
              label: 'roles_permission.contracts.edit_monthly_type',
              refer: 'edit',
              parent: form.contracts.payments.monthly_type,
            },

            {
              ...row,
              label: 'roles_permission.contracts.delete_monthly_type',
              refer: 'delete',
              parent: form.contracts.payments.monthly_type,
            },
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.users',
          active: false,
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: form.users,
            },
            {
              ...row,
              label: 'roles_permission.users.watch_users',
              refer: 'view',
              parent: form.users,
            },

            {
              ...row,
              label: 'roles_permission.users.create_user',
              refer: 'create',
              parent: form.users,
            },

            {
              ...row,
              label: 'roles_permission.users.edit_user',
              refer: 'edit',
              parent: form.users,
            },

            {
              ...row,
              label: 'roles_permission.users.delete_user',
              refer: 'delete',
              parent: form.users,
            }
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.roles',
          active: false,
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: form.roles,
            },
            {
              ...row,
              label: 'roles_permission.roles.watch_roles',
              refer: 'view',
              parent: form.roles,
            },

            {
              ...row,
              label: 'roles_permission.roles.add_roles',
              refer: 'create',
              parent: form.roles,
            },

            {
              ...row,
              label: 'roles_permission.roles.edit_roles',
              refer: 'edit',
              parent: form.roles,
            },
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.debtors',
          active: false,
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: form.debtors,
            },
            {
              ...row,
              label: 'roles_permission.debtors.watch_debtors',
              refer: 'view',
              parent: form.debtors,
            }
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.companies',
          active: false,
          rows: [
            {
              ...row,
              label: 'roles_permission.apartments.status_apartments',
              refer: 'all',
              parent: form.companies,
            },
            {
              ...row,
              label: 'roles_permission.companies.watch_companies',
              refer: 'view',
              parent: form.companies,
            },

            {
              ...row,
              label: 'roles_permission.companies.watch_company',
              refer: 'create',
              parent: form.companies,
            },

            {
              ...row,
              label: 'roles_permission.companies.edit_companies',
              refer: 'edit',
              parent: form.companies,
            },

            {
              ...row,
              label: 'roles_permission.companies.delete_company',
              refer: 'delete',
              parent: form.companies,
            }
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.payment_account',
          active: false,
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: form.payment_account,
            },
            {
              ...row,
              label: 'roles_permission.payment_account.access_payments_list',
              refer: 'view',
              parent: form.payment_account,
            },

            {
              ...row,
              label: 'roles_permission.payment_account.add_payment',
              refer: 'create',
              parent: form.payment_account,
            },

            {
              ...row,
              label: 'roles_permission.payment_account.edit_payment',
              refer: 'edit',
              parent: form.payment_account,
            },

            {
              ...row,
              label: 'roles_permission.payment_account.delete_payment',
              refer: 'delete',
              parent: form.payment_account,
            }
          ],
        },
        {
          id: uuid(),
          title: 'roles_permission.titles.branches',
          active: false,
          rows: [
            {
              ...row,
              label: 'roles_permission.activate_all',
              refer: 'all',
              parent: form.branches,
            },
            {
              ...row,
              label: 'roles_permission.branches.watch_branches',
              refer: 'view',
              parent: form.branches,
            },

            {
              ...row,
              label: 'roles_permission.branches.edit_branch',
              refer: 'create',
              parent: form.branches,
            },

            {
              ...row,
              label: 'roles_permission.branches.delete_branch',
              refer: 'edit',
              parent: form.branches,
            },

            {
              ...row,
              label: 'roles_permission.branches.delete_branch',
              refer: 'delete',
              parent: form.branches,
            },

            {
              ...row,
              label: 'roles_permission.branches.watch_contract_template',
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

