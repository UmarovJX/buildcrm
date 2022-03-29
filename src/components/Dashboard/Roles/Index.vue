<template>
  <main>
    <div class="app-content">
      <div
          class="
          d-flex
          justify-content-between
          align-items-center
          flex-md-row flex-column
        "
      >
        <div
            class="d-flex w-100 align-items-center flex-md-row flex-column mb-0"
        >
          <h1 class="title__big my-0">
            {{ $t("roles.title") }}
          </h1>
          <ul class="breadcrumb ml-md-4 ml-md-3 mb-0 mb-md-0">
            <li class="breadcrumb-item">
              <router-link :to="{name: 'home'}">
                <i class="far fa-home"></i>
              </router-link>
            </li>

            <li class="breadcrumb-item">
              <a href="#">
                {{ $t("roles.title") }}
              </a>
            </li>
            <li class="breadcrumb-item active">
              {{ $t("list") }}
            </li>
          </ul>
        </div>

        <router-link
            :to="{name: 'roles-store'}"
            v-if="getPermission.roles.create"
            :class="'btn btn-primary mr-0 mt-md-0'"
        >
          <i class="fal fa-plus mr-2"></i>
          {{ $t("add") }}
        </router-link>
      </div>

      <div class="">
        <b-table
            sticky-header
            borderless
            responsive
            :items="getRoles"
            :fields="fields"
            :busy="getLoading"
            show-empty
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            sort-icon-left
            class="custom-table"
            :empty-text="$t('no_data')"
        >
          <template #empty="scope" class="text-center">
            <span class="d-flex justify-content-center align-items-center">{{
                scope.emptyText
              }}</span>
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

          <template #cell(actions)="data">
            <div class="float-right">
              <div
                  class="dropdown my-dropdown dropleft"
                  v-if="
                  (getPermission.roles.update && data.item.id != 1) ||
                  (getPermission.roles.delete && data.item.id != 1)
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
                    v-if="
                    getPermission.roles.update || getPermission.roles.delete
                  "
                >
                  <router-link
                      :to="{name: 'roles-update', params: {id: data.item.id}}"
                      v-if="getPermission.roles.update && data.item.id != 1"
                      :class="'dropdown-item dropdown-item--inside'"
                  >
                    <i class="fas fa-pen"></i>
                    {{ $t("edit") }}
                  </router-link>

                  <a
                      class="dropdown-item dropdown-item--inside"
                      v-if="getPermission.roles.delete && data.item.id != 1"
                      @click="Delete(data.item.id)"
                      href="#"
                  >
                    <i class="far fa-trash"></i> {{ $t("delete") }}
                  </a>
                </div>
              </div>
            </div>
          </template>
        </b-table>
      </div>
    </div>
  </main>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import api from "@/services/api";

export default {
  name: 'Roles',
  data() {
    return {
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

    Delete(id) {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.are_you_sure_delete_role"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes"),
      }).then((result) => {
        if (result.value) {
          api.roles.deleteRole(id)
              .then((response) => {
                this.toasted(response.data.message, "success");

                this.fetchRoles(this);

                this.$swal(this.$t("sweetAlert.deleted"), "", "success");
              })
              .catch((error) => {
                if (!error.response) {
                  this.toasted("Error: Network Error", "error");
                } else {
                  if (error.response.status === 403) {
                    this.toasted(error.response.data.message, "error");
                  } else if (error.response.status === 401) {
                    this.toasted(error.response.data.message, "error");
                  } else if (error.response.status === 500) {
                    this.toasted(error.response.data.message, "error");
                  } else if (error.response.status === 404) {
                    this.toasted(error.response.data.exception, "error");
                  } else {
                    this.error = true;
                    this.errors = error.response.data.errors;
                  }
                }
              });
        }
      });
    },
  },
};
</script>

<style scoped></style>
