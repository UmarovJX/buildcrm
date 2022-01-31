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
            {{ $t("users.title") }}
          </h1>
          <ul class="breadcrumb ml-md-4 ml-md-3 mb-0 mb-md-0">
            <li class="breadcrumb-item">
              <router-link :to="{name: 'home'}">
                <i class="far fa-home"></i>
              </router-link>
            </li>

            <li class="breadcrumb-item">
              <a href="#">
                {{ $t("users.title") }}
              </a>
            </li>
            <li class="breadcrumb-item active">
              {{ $t("list") }}
            </li>
          </ul>
        </div>

        <b-link
            v-if="getPermission.users.create"
            class="btn btn-primary mr-0 mt-md-0"
            v-b-modal.modal-create
        >
          <i class="fal fa-plus mr-2"></i>
          {{ $t("add") }}
        </b-link>
      </div>

      <div class="pt-2">
        <b-table
            sticky-header
            borderless
            responsive
            :items="getUsers"
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
            <span class="d-flex justify-content-center align-items-center">
              {{ scope.emptyText }}</span>
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

          <template #cell(userFullName)="data">
            {{ data.item.first_name }} {{ data.item.last_name }}
          </template>

          <template #cell(objects)="data">
            <span v-for="object in data.item.objects" :key="object.id">
              {{ object.name }},
            </span>
          </template>

          <template #cell(role)="data">
            {{ getName(data.item.role.name) }}
          </template>

          <template #cell(actions)="data">
            <div class="float-right">
              <div
                  class="dropdown my-dropdown dropleft"
                  v-if="data.item.id != getMe.user.id"
              >
                <!--user.role.id != 1 &&-->
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
                    getPermission.users.update || getPermission.users.delete
                  "
                >
                  <b-button
                      v-if="getPermission.users.update"
                      @click="clickManager(data)"
                      class="dropdown-item dropdown-item--inside"
                      v-b-modal.modal-edit
                  >
                    <i class="fas fa-pen"></i>
                    {{ $t("edit") }}
                  </b-button>

                  <b-button
                      class="dropdown-item dropdown-item--inside"
                      v-if="getPermission.users.delete"
                      @click="Delete(data.item.id)"
                  >
                    <i class="far fa-trash"></i> {{ $t("delete") }}
                  </b-button>
                </div>
              </div>
            </div>
          </template>
        </b-table>
      </div>

      <create-modal
          v-if="getPermission.users.create"
          @CreateManager="CreateManager"
      ></create-modal>
      <edit-modal
          v-if="getPermission.users.update"
          :manager-id="manager_id"
          :edit-history-context="editHistoryContext"
          @EditManager="EditManager(item)"
      ></edit-modal>
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
  </main>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Create from "./Modal/Create";
import Edit from "./Modal/Edit";

export default {
  name: 'Users',
  components: {
    "create-modal": Create,
    "edit-modal": Edit,
  },

  data() {
    return {
      manager: {},
      manager_id: 0,
      editHistoryContext: {
        id:0
      },
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
          key: "userFullName",
          label: this.$t("users.name"),
        },
        {
          key: "objects",
          label: this.$t("users.object"),
        },
        {
          key: "phone",
          label: this.$t("users.phone"),
        },
        {
          key: "role",
          label: this.$t("users.roles"),
          sortable: true,
        },
        {
          key: "email",
          label: this.$t("users.login"),
        },
        {
          key: "actions",
          label: "",
        },
      ],
      loading: false
    };
  },

  computed: mapGetters([
    "getUsers",
    "getUser",
    "getPermission",
    "getLoading",
    "getMe",
  ]),

  mounted() {
    this.fetchUsers(this);
  },

  methods: {
    ...mapActions(["fetchUsers", "fetchUser", "fetchMenu"]),

    CreateManager() {
      this.fetchUsers(this);
    },

    EditManager() {
      this.fetchUsers(this);
    },

    clickManager(data) {
      this.manager_id = data.item.id;
      this.editHistoryContext = data.item
      this.fetchUser(this);
    },

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

    Delete(user) {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes"),
      }).then((result) => {
        if (result.value) {
          this.loading = true
          this.axios
              .delete(process.env.VUE_APP_URL + "/users/" + user, this.header)
              .then((response) => {
                this.loading = false
                this.toasted(response.data.message, "success");
                this.fetchUsers(this);
                this.fetchMenu(this);

                this.$swal(this.$t("sweetAlert.deleted"), "", "success");
              })
              .catch((error) => {
                this.loading = false
                if (!error.response) {
                  this.toasted("Error: Network Error", "error");
                } else {
                  this.toasted(error.response.data.error, "error");
                }
              });
        }
      });
    },
  },
}
</script>

