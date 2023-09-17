<script>
import { mapActions, mapGetters } from "vuex";
import api from "@/services/api";
import BaseButton from "@/components/Reusable/BaseButton.vue";
import RolesPermission from "@/permission/roles";
import BasePlusIcon from "@/components/icons/BasePlusIcon.vue";
// import BaseSearchInput from "@/components/Reusable/BaseSearchInput";
import AppHeader from "@/components/Header/AppHeader.vue";
import { XIcon } from "@/components/ui-components/material-icons";

export default {
  name: "Roles",
  components: {
    BasePlusIcon,
    BaseButton,
    AppHeader,
    XIcon,
    // BaseSearchInput
  },
  data() {
    return {
      editPermission: RolesPermission.getRolesEditPermission(),
      deletePermission: RolesPermission.getRolesDeletePermission(),
      createPermission: RolesPermission.getRolesCreatePermission(),
      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },
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
          key: "users_count",
          label: this.$t("roles.users"),
        },
        {
          key: "actions",
          label: "",
        },
        {
          key: "users_page",
          label: "",
        },
      ],
    };
  },

  computed: mapGetters(["getRoles", "getPermission", "getLoading", "getMe"]),

  mounted() {
    this.fetchRoles(this);
  },

  methods: {
    ...mapActions(["fetchRoles"]),

    getName(name) {
      let locale = localStorage.locale;
      let value = "";

      if (locale) {
        switch (locale) {
          case "ru":
            value = name.ru;
            break;
          case "uz":
            value = name.uz;
            break;
        }
      } else {
        value = name.ru;
      }

      return value;
    },

    deleteRole(id) {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.are_you_sure_delete_role"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yes"),
      }).then((result) => {
        if (result.value) {
          api.roles
            .deleteRole(id)
            .then((response) => {
              this.toasted(response.data.message, "success");

              this.fetchRoles(this);

              this.$swal(this.$t("sweetAlert.deleted"), "", "success");
            })
            .catch((error) => {
              this.toastedWithErrorCode(error);
            });
        }
      });
    },
  },
};
</script>

<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t("roles.title") }}
      </template>
      <template #header-actions>
        <base-button
          v-if="createPermission"
          design="violet-gradient"
          @click="$router.push({ name: 'roles-store' })"
          :text="$t('add')"
          class="ml-4"
        >
          <template #left-icon>
            <BasePlusIcon fill="var(--white)" />
          </template>
        </base-button>
      </template>
    </app-header>

    <div>
      <b-table
        sticky-header
        borderless
        responsive
        :items="getRoles"
        :fields="fields"
        :busy="getLoading"
        show-empty
        v-model:sort-by="sortBy"
        v-model:sort-desc="sortDesc"
        sort-icon-left
        class="custom-table"
        :empty-text="$t('no_data')"
      >
        <template #empty="scope">
          <span class="d-flex justify-content-center align-items-center">
            {{ scope.emptyText }}</span
          >
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
          {{ getName(data.item.name) }}
        </template>

        <template #cell(users_page)="data"> </template>

        <template #cell(actions)="data">
          <div class="float-right">
            <div class="d-flex align-items-center">
              <div
                class="dropdown my-dropdown dropleft"
                v-if="
                  data.item.id !== 1 && (editPermission || deletePermission)
                "
              >
                <button
                  type="button"
                  class="dropdown-toggle"
                  data-toggle="dropdown"
                >
                  <i class="far fa-ellipsis-h"></i>
                </button>

                <div
                  class="dropdown-menu"
                  v-if="editPermission || deletePermission"
                >
                  <router-link
                    :to="{ name: 'roles-update', params: { id: data.item.id } }"
                    v-if="data.item.id !== 1 && editPermission"
                    :class="'dropdown-item dropdown-item--inside'"
                  >
                    <i class="fas fa-pen"></i>
                    {{ $t("edit") }}
                  </router-link>

                  <a
                    class="dropdown-item dropdown-item--inside"
                    v-if="data.item.id !== 1 && deletePermission"
                    @click="deleteRole(data.item.id)"
                    href="#"
                  >
                    <i class="far fa-trash"></i> {{ $t("delete") }}
                  </a>
                </div>
              </div>

              <base-button
                @click="
                  $router.push({
                    name: 'users',
                    query: {
                      role_id: data.item.id,
                    },
                  })
                "
                class="d-flex align-items-center ml-4 violet-600"
              >
                <span class="mr-1">{{ $t("roles.users") }}</span>
                <span class="d-flex align-items-center">
                  <x-icon
                    name="visibility"
                    size="18"
                    color="var(--violet-600)"
                  />
                </span>
              </base-button>
            </div>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<style scoped></style>
