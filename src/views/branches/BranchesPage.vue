<script>
import api from '@/services/api'
// import BranchesBreadCrumbs from "@/components/branches/BranchesBreadCrumbs";
import BranchesPermission from '@/permission/branches'
import { mapGetters } from 'vuex'
import TemplatesPermission from '@/permission/templates'
import AppHeader from '@/components/Header/AppHeader'
import BaseButton from '@/components/Reusable/BaseButton'
import BasePlusIcon from '@/components/icons/BasePlusIcon'
import BaseTabPicker from '@/components/Reusable/BaseTabPicker'
import XDropdown from "@/components/ui-components/dropdown/XDropdown.vue";

export default {
  name: 'BranchesPage',
  components: {
    XDropdown,
    BaseTabPicker,
    AppHeader,
    BaseButton,
    BasePlusIcon,
    // BranchesBreadCrumbs
  },
  data() {
    return {
      tabOptions: ['active', 'deleted'],
      currentTab: 'active',
      createPermission: BranchesPermission.getBranchesCreatePermission(),
      editPermission: BranchesPermission.getBranchesEditPermission(),
      deletePermission: BranchesPermission.getBranchesDeletePermission(),
      viewTemplatesPermission: TemplatesPermission.getTemplatesViewPermission(),
      loading: false,
      sortBy: 'id',
      sortDesc: false,
      fields: [
        {
          key: 'id',
          label: '#',
        },
        {
          key: 'name',
          label: this.$t('roles.name'),
        },
        {
          key: 'address',
          label: this.$t('address'),
        },
        {
          key: 'manager',
          label: this.$t('roles.manager'),
        },
        {
          key: 'phone',
          label: this.$t('clients.phone'),
        },
        {
          key: 'users_count',
          label: this.$t('roles.users'),
        },
        {
          key: 'actions',
          label: '',
        },
      ],
      branches: [],
    }
  },

  computed: {
    ...mapGetters({
      permission: 'getPermission',
    }),
  },
  watch: {
    currentTab() {
      this.getBranchesList()
    },
  },

  async created() {
    await this.getBranchesList()
  },
  methods: {
    changeTab(e) {
      this.currentTab = e
    },
    createBranch() {
      this.$router.push({ name: 'create-branch' })
    },
    async getBranchesList() {
      this.loading = true
      await api.branches[
        this.currentTab === 'active'
          ? 'getBranchesList'
          : 'getDeletedBranchesList'
      ]()
        .then(response => {
          this.branches = response.data
        })
        .catch(error => {
          this.toastedWithErrorCode(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    deleteBranch(id) {
      this.$swal({
        title: this.$t('sweetAlert.title'),
        text: this.$t(
          this.currentTab === 'active'
            ? 'sweetAlert.want_delete'
            : 'sweetAlert.want_undelete',
        ),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: this.$t('cancel'),
        confirmButtonText: this.$t('sweetAlert.yesPure'),
      }).then(result => {
        if (result.value) {
          this.loading = true
          api.branches
            .deleteBranch(id)
            .then(() => {
              this.getBranchesList()
            })
            .catch(error => {
              this.toastedWithErrorCode(error)
              this.loading = false
            })
        }
      })
    },
    getFullName(item) {
      const { last_name, first_name } = item.manager
      return `${last_name} ${first_name}`
    },
  },
}
</script>

<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t("branches.title") }}
      </template>
      <template #header-actions>
        <base-button
          v-if="createPermission"
          :text="$t('add')"
          design="violet-gradient"
          @click="createBranch"
        >
          <template #left-icon>
            <BasePlusIcon fill="var(--white)" />
          </template>
        </base-button>
      </template>
    </app-header>

    <base-tab-picker
      :options="tabOptions"
      :current="currentTab"
      no-all
      @tab-selected="changeTab"
    />
    <div>
      <!--            <branches-bread-crumbs/>-->

      <div class="pt-2">
        <b-table
          v-model:sort-by="sortBy"
          v-model:sort-desc="sortDesc"
          sticky-header
          borderless
          responsive
          :items="branches"
          :fields="fields"
          show-empty
          sort-icon-left
          class="custom-table"
          :empty-text="$t('no_data')"
        >
          <template
            #empty="scope"
            class="text-center"
          >
            <div class="d-flex justify-content-center align-items-center">
              {{ scope.emptyText }}
            </div>
          </template>

          <template #table-busy>
            <div class="d-flex justify-content-center w-100">
              <div class="lds-ellipsis">
                <div />
                <div />
                <div />
                <div />
              </div>
            </div>
          </template>

          <template #cell(name)="data">
            {{ data.item.name }}
          </template>

          <template #cell(manager)="data">
            {{ getFullName(data.item) }}
          </template>

          <template #cell(address)="data">
            {{ data.item.address }}
          </template>

          <template #cell(phone)="data">
            {{ data.item.phone }}
          </template>

          <template #cell(actions)="data">
            <div class="float-right">
              <x-dropdown
                v-if="
                  deletePermission || viewTemplatesPermission || editPermission
                "
              >
                  <router-link
                    v-if="editPermission"
                    :to="{
                      name: 'edit-branch',
                      params: { id: data.item.id, historyForm: data.item },
                    }"
                    :class="'dropdown-item dropdown-item--inside'"
                  >
                    <i class="fas fa-pen" />
                    {{ $t("edit") }}
                  </router-link>

                  <router-link
                    v-if="viewTemplatesPermission"
                    :to="{
                      name: 'object-deal-template',
                      params: { id: data.item.id },
                    }"
                    :class="'dropdown-item dropdown-item--inside'"
                  >
                    <i class="far fa-file-alt" />
                    {{ $t("objects.deal_template.name") }}
                  </router-link>

                  <button
                    v-if="deletePermission"
                    class="dropdown-item dropdown-item--inside"
                    @click="deleteBranch(data.item.id)"
                  >
                    <span>
                      <i class="far fa-trash" />
                    </span>
                    <span
                      v-if="currentTab === 'active'"
                      class="ml-2"
                    >
                      {{ $t("delete") }}
                    </span>
                    <span
                      v-else
                      class="ml-2"
                    >
                      {{ $t("undelete") }}
                    </span>
                  </button>
              </x-dropdown>
            </div>
          </template>
        </b-table>
      </div>
    </div>

    <b-overlay
      :show="loading"
      no-wrap
      opacity="0.5"
      style="z-index: 2222"
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
