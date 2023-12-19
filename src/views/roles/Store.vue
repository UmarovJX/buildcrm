<script>
import api from '@/services/api'
import { isObject } from '@/util/inspect'
import AppHeader from '@/components/Header/AppHeader.vue'
import { joinRolesRows } from '@/views/roles/data/_index.data'

export default {
  name: 'Roles',
  components: {
    AppHeader,
  },
  props: {
    comeFrom: {
      type: String,
      default: 'create',
    },
    updatingName: {
      type: Object,
      default: () => ({
        uz: '',
        ru: '',
      }),
    },
    permissions: {
      type: Object,
      default: () => ({}),
    },
    appLoading: {
      type: String,
      default: 'default',
    },
  },
  emits: ['submit'],
  data() {
    const name = this.updatingName
    const { form, permissionTabs } = joinRolesRows({ name })
    return {
      name,
      form,
      permissionTabs,
      getLoading: false,
    }
  },
  watch: {
    appLoading(loadingState) {
      if (loadingState === 'finished' && this.comeFrom === 'update') {
        this.initPermissions()
      }
    },
  },
  methods: {
    initPermissions() {
      const pms = {
        ...this.form,
        ...this.permissions,
      }

      // this.form = Object.assign({}, this.permissions, this.form)
      //
      // this.form = {
      //     ...this.form,
      //     ...this.permissions
      // }

      Object.entries(this.form).forEach(([parentKey, parentValue]) => {
        Object.entries(parentValue).forEach(([key, value]) => {
          if (isObject(value)) {
            Object.entries(value).forEach(([childKey, childValue]) => {
              if (isObject(childValue)) {
                Object.entries(childValue).forEach(
                  ([subChildKey, subChildValue]) => {
                    if (isObject(subChildValue)) {
                      Object.entries(subChildValue).forEach(
                        ([lastChildKey, lastChildValue]) => {
                          if (isObject(lastChildValue)) {
                            this.form[parentKey][key][childKey][subChildKey][
                              lastChildKey
                            ] = pms[parentKey][key][childKey][subChildKey][
                              lastChildKey
                            ]
                          } else {
                            return pms[parentKey][key][childKey][subChildKey][
                              lastChildKey
                            ]
                              ? (this.form[parentKey][key][childKey][
                                subChildKey
                              ][lastChildKey] = true)
                              : (this.form[parentKey][key][childKey][
                                subChildKey
                              ][lastChildKey] = false)
                          }
                        },
                      )
                    } else {
                      return pms[parentKey][key][childKey]
                        && pms[parentKey][key][childKey][subChildKey]
                        ? (this.form[parentKey][key][childKey][
                          subChildKey
                        ] = true)
                        : (this.form[parentKey][key][childKey][
                          subChildKey
                        ] = false)
                    }
                  },
                )
              } else {
                return pms[parentKey][key] && pms[parentKey][key][childKey]
                  ? (this.form[parentKey][key][childKey] = true)
                  : (this.form[parentKey][key][childKey] = false)
              }
            })
          } else {
            return pms[parentKey] && pms[parentKey][key]
              ? (this.form[parentKey][key] = true)
              : (this.form[parentKey][key] = false)
          }
        })
      })

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
            case 1: {
              row.vBind = !!pmTabParent[one]
              break
            }
            case 2: {
              // eslint-disable-next-line no-prototype-builtins
              const hasChild = pmTabParent.hasOwnProperty(one)

              if (hasChild) {
                row.vBind = !!pmTabParent[one][two]
              } else {
                row.vBind = false
              }
              break
            }
            case 3: {
              // eslint-disable-next-line no-prototype-builtins
              const hasOne = pmTabParent.hasOwnProperty(one)

              if (hasOne) {
                // eslint-disable-next-line no-prototype-builtins
                const hasTwo = pmTabParent[one].hasOwnProperty(two)
                if (hasTwo) {
                  row.vBind = !!pmTabParent[one][two][three]
                } else {
                  row.vBind = false
                }
              } else {
                row.vBind = false
              }
              break
            }
            case 4: {
              row.vBind = pmTabParent[one][two][three][four]
              break
            }
            case 5: {
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
          rows,
        }
      })
    },
    activeAllTabPermission(refer, pmIndex, index, value) {
      if (refer === 'all') {
        this.permissionTabs[pmIndex].rows = this.permissionTabs[pmIndex].rows.map(row => ({
          ...row,
          vBind: value,
        }))
      }
    },
    generateRole() {
      this.permissionTabs.forEach(pmTab => {
        pmTab.rows
          .filter(row => {
            const overlookList = ['all', 'ru', 'uz']
            return !overlookList.includes(row.refer)
          })
          .forEach(row => {
            const pmTabParent = this[pmTab.parent][row.parent]
            const hierarchyList = row.refer.split('.')
            const [one, two, three, four, five] = hierarchyList
            switch (hierarchyList.length) {
              case 1: {
                pmTabParent[one] = row.vBind
                break
              }
              case 2: {
                // eslint-disable-next-line no-prototype-builtins
                const hasChild = pmTabParent.hasOwnProperty(one)
                if (hasChild) {
                  pmTabParent[one][two] = row.vBind
                } else {
                  pmTabParent[one][two] = false
                }
                break
              }
              case 3: {
                // eslint-disable-next-line no-prototype-builtins
                const hasOne = pmTabParent.hasOwnProperty(one)
                if (hasOne) {
                  // eslint-disable-next-line no-prototype-builtins
                  const hasTwo = pmTabParent[one].hasOwnProperty(two)
                  if (hasTwo) {
                    pmTabParent[one][two][three] = row.vBind
                  } else {
                    pmTabParent[one][two][three] = false
                  }
                } else {
                  pmTabParent[one][two][three] = false
                }
                break
              }
              case 4: {
                pmTabParent[one][two][three][four] = row.vBind
                break
              }
              case 5: {
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
          permissions: this.form,
        })
      } else {
        this.getLoading = true
        const data = {
          name: this.name,
          permissions: this.form,
        }

        api.roles
          .createRole(data)
          .then(response => {
            this.getLoading = false
            this.toasted(response.data.message, 'success')

            this.$router.push({ name: 'roles' })

            this.$swal(
              `${this.$t('sweetAlert.success_create_role')}`,
              '',
              'success',
            )
          })
          .catch(error => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.getLoading = false
          })
      }
    },
  },
}
</script>

<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t("roles.title") }}
      </template>
    </app-header>

    <div
      class="d-flex justify-content-between align-items-center flex-md-row flex-column pb-3 pt-0 px-0 py-lg-3"
    >
      <div class="d-flex w-100 align-items-center flex-md-row flex-column mb-0">
        <h1 class="title__big my-0">
          {{ $t("roles.title") }}
        </h1>
        <ul class="breadcrumb ml-md-4 ml-md-3 mb-0 mb-md-0">
          <li class="breadcrumb-item">
            <router-link :to="{ name: 'home' }">
              <i class="far fa-home" />
            </router-link>
          </li>

          <li class="breadcrumb-item">
            <router-link :to="{ name: 'roles' }">
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
            v-for="({ title, active, rows, id }, pmIndex) in permissionTabs"
            :key="id"
            :title="$t(title)"
            :active="active"
          >
            <table class="table">
              <tbody>
                <tr
                  v-for="(
                    {
                      label,
                      width,
                      refer,
                      checkboxSwitch,
                      checkboxActive,
                      checkboxSize,
                      inputActive,
                      inputClass,
                      inputPlaceholder,
                      inputType,
                    },
                    index
                  ) in rows"
                  :key="index + label + id"
                >
                  <td :width="width">
                    {{ $t(label) }}
                  </td>
                  <td v-if="checkboxActive">
                    <b-form-checkbox
                      v-model="permissionTabs[pmIndex]['rows'][index].vBind"
                      :switch="checkboxSwitch"
                      :size="checkboxSize"
                      @input="
                        activeAllTabPermission(refer, pmIndex, index, $event)
                      "
                    />
                  </td>
                  <td v-if="inputActive">
                    <input
                      v-model="name[refer]"
                      :type="inputType"
                      :class="inputClass"
                      :placeholder="$t(inputPlaceholder)"
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </b-tab>
        </b-tabs>
      </div>

      <div class="card-footer d-flex">
        <button
          class="btn btn-primary"
          @click="createNewRole"
        >
          <i class="fas fa-save" /> {{ $t("save") }}
        </button>

        <button
          class="btn btn-default"
          @click="$router.go(-1)"
        >
          {{ $t("cancel") }}
        </button>
      </div>
    </div>

    <b-overlay
      :show="getLoading"
      no-wrap
      opacity="0.5"
    >
      <template #overlay>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </template>
    </b-overlay>
  </div>
</template>
