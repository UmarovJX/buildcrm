<script>
import api from "@/services/api";
// import BranchesBreadCrumbs from "@/components/branches/BranchesBreadCrumbs";
import BranchesPermission from "@/permission/branches";
import { mapGetters } from "vuex";
import TemplatesPermission from "@/permission/templates";
import AppHeader from "@/components/Header/AppHeader";
import BaseButton from "@/components/Reusable/BaseButton";
import BasePlusIcon from "@/components/icons/BasePlusIcon";

export default {
  name: "BranchesPage",
  components: {
    AppHeader,
    BaseButton,
    BasePlusIcon,
    // BranchesBreadCrumbs
  },
  data() {
    return {
      createPermission: BranchesPermission.getBranchesCreatePermission(),
      editPermission: BranchesPermission.getBranchesEditPermission(),
      deletePermission: BranchesPermission.getBranchesDeletePermission(),
      viewTemplatesPermission: TemplatesPermission.getTemplatesViewPermission(),
      loading: false,
      sortBy: "id",
      sortDesc: false,
      fields: [
        {
          key: "id",
          label: "#",
        },
        {
          key: "name",
          label: this.$t("roles.name"),
        },
        {
          key: "address",
          label: this.$t("address"),
        },
        {
          key: "manager",
          label: this.$t("roles.manager"),
        },
        {
          key: "phone",
          label: this.$t("clients.phone"),
        },
        {
          key: "users_count",
          label: this.$t("roles.users"),
        },
        {
          key: "actions",
          label: "",
        },
      ],
      branches: [],
    };
  },

  computed: {
    ...mapGetters({
      permission: "getPermission",
    }),
  },

  async created() {
    await this.getBranchesList();
  },
  methods: {
    createBranch() {
      this.$router.push({ name: "create-branch" });
    },
    async getBranchesList() {
      this.loading = true;
      await api.branches
        .getBranchesList()
        .then((response) => {
          this.branches = response.data;
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    deleteBranch(id) {
      this.loading = true;
      api.branches
        .deleteBranch(id)
        .then(() => {
          const findIndex = this.branches.findIndex(
            (branch) => branch.id === id
          );
          this.branches.splice(findIndex, 1);
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getFullName(item) {
      const { last_name, first_name } = item.manager;
      return last_name + " " + first_name;
    },
  },
};
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
            <BasePlusIcon fill="var(--white)"></BasePlusIcon>
          </template>
        </base-button>
      </template>
    </app-header>

    <div>
      <!--            <branches-bread-crumbs/>-->

      <div class="pt-2">
        <b-table
          sticky-header
          borderless
          responsive
          :items="branches"
          :fields="fields"
          show-empty
          v-model:sort-by="sortBy"
          v-model:sort-desc="sortDesc"
          sort-icon-left
          class="custom-table"
          :empty-text="$t('no_data')"
        >
          <template #empty="scope" class="text-center">
            <div class="d-flex justify-content-center align-items-center">
              {{ scope.emptyText }}
            </div>
          </template>

          <template #table-busy>
            <div class="d-flex justify-content-center w-100">
              <div class="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
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
              <div
                v-if="
                  deletePermission || viewTemplatesPermission || editPermission
                "
                class="dropdown my-dropdown dropleft"
              >
                <button
                  type="button"
                  class="dropdown-toggle"
                  data-toggle="dropdown"
                >
                  <i class="far fa-ellipsis-h"></i>
                </button>

                <div class="dropdown-menu">
                  <router-link
                    v-if="editPermission"
                    :to="{
                      name: 'edit-branch',
                      params: { id: data.item.id, historyForm: data.item },
                    }"
                    :class="'dropdown-item dropdown-item--inside'"
                  >
                    <i class="fas fa-pen"></i>
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
                    <i class="far fa-file-alt"></i>
                    {{ $t("objects.deal_template.name") }}
                  </router-link>

                  <button
                    v-if="deletePermission"
                    class="dropdown-item dropdown-item--inside"
                    @click="deleteBranch(data.item.id)"
                  >
                    <span>
                      <i class="far fa-trash"></i>
                    </span>
                    <span class="ml-2">
                      {{ $t("delete") }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </b-table>
      </div>
    </div>

    <b-overlay :show="loading" no-wrap opacity="0.5" style="z-index: 2222">
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
  </div>
</template>
