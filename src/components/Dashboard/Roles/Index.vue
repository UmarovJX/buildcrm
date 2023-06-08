<!--<template>-->
<!--  <main>-->
<!--    <div class="app-content">-->
<!--      <div class="d-flex align-items-center">-->
<!--        <base-search-input class="w-100" :placeholder="$t('users.placeholder')"/>-->
<!--        <base-button-->
<!--            v-if="getPermission.users && getPermission.users.create"-->
<!--            design="violet-gradient"-->
<!--            :text="$t('add')"-->
<!--            v-b-modal.modal-create-->
<!--            class="ml-4"-->
<!--        >-->
<!--          <template #left-icon>-->
<!--            <i class="fal fa-plus mr-2"></i>-->
<!--          </template>-->
<!--        </base-button>-->
<!--      </div>-->

<!--      <div class="">-->
<!--        <b-table-->
<!--            thead-tr-class="row__head__bottom-border"-->
<!--            tbody-tr-class="row__body__bottom-border"-->
<!--            class="table__list"-->
<!--            ref="contracts-table"-->
<!--            sticky-header-->
<!--            borderless-->
<!--            responsive-->
<!--            :items="getRoles"-->
<!--            :fields="fields"-->
<!--            :busy="getLoading"-->
<!--            show-empty-->
<!--            :sort-by.sync="sortBy"-->
<!--            :sort-desc.sync="sortDesc"-->
<!--            sort-icon-left-->
<!--            :empty-text="$t('no_data')"-->
<!--        >-->
<!--          <template #empty="scope" class="text-center">-->
<!--            <span class="d-flex justify-content-center align-items-center">{{-->
<!--                scope.emptyText-->
<!--              }}</span>-->
<!--          </template>-->

<!--          <template #table-busy>-->
<!--            <div class="d-flex justify-content-center w-100">-->
<!--              <div class="lds-ellipsis">-->
<!--                <div></div>-->
<!--                <div></div>-->
<!--                <div></div>-->
<!--                <div></div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </template>-->

<!--          <template #cell(name)="data">-->
<!--            {{ getName(data.item.name) }}-->
<!--          </template>-->

<!--          <template #cell(actions)="data">-->
<!--            <div class="float-right d-flex custom-actions" v-if="editPermission || deletePermission">-->
<!--                <BaseButton-->
<!--                    class="button purple rounded-circle"-->
<!--                    text=''-->
<!--                    @click="editSelectedCompany(data.item)"-->
<!--                >-->
<!--                  <template #right-icon>-->
<!--                    <BaseEditIcon fill="#ffff"/>-->
<!--                  </template>-->
<!--                </BaseButton>-->
<!--                <BaseButton-->
<!--                    class="bg-danger button rounded-circle"-->
<!--                    text=''-->
<!--                    @click="deleteRole(data.item.id)"-->
<!--                >-->
<!--                  <template #right-icon>-->
<!--                    <BaseDeleteIcon fill="#ffff"/>-->
<!--                  </template>-->
<!--                </BaseButton>-->
<!--              </div>-->
<!--          </template>-->
<!--        </b-table>-->
<!--      </div>-->
<!--    </div>-->
<!--  </main>-->
<!--</template>-->

<!--<script>-->
<!--import {mapActions, mapGetters} from "vuex";-->
<!--import api from "@/services/api";-->
<!--import BaseButton from "@/components/Reusable/BaseButton";-->
<!--import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";-->
<!--import BaseEditIcon from "@/components/icons/BaseEditIcon";-->
<!--import BaseSearchInput from "@/components/Reusable/BaseSearchInput";-->
<!--export default {-->
<!--  name: 'Roles',-->
<!--  components: {-->
<!--    BaseButton,-->
<!--    BaseSearchInput,-->
<!--    BaseEditIcon,-->
<!--    BaseDeleteIcon-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      header: {-->
<!--        headers: {-->
<!--          Authorization: "Bearer " + localStorage.token,-->
<!--        },-->
<!--      },-->
<!--      sortBy: "id",-->
<!--      sortDesc: false,-->
<!--      fields: [-->
<!--        {-->
<!--          key: "id",-->
<!--          label: "#",-->
<!--        },-->
<!--        {-->
<!--          key: "name",-->
<!--          label: this.$t("roles.name"),-->
<!--        },-->
<!--        {-->
<!--          key: "users_count",-->
<!--          label: this.$t("roles.users"),-->
<!--        },-->
<!--        {-->
<!--          key: "actions",-->
<!--          label: "",-->
<!--        },-->
<!--      ],-->
<!--    };-->
<!--  },-->

<!--  computed: mapGetters(["getRoles", "getPermission", "getLoading", "getMe"]),-->

<!--  mounted() {-->
<!--    this.fetchRoles(this);-->
<!--  },-->

<!--  methods: {-->
<!--    ...mapActions(["fetchRoles"]),-->

<!--    getName(name) {-->
<!--      let locale = localStorage.locale;-->
<!--      let value = "";-->

<!--      if (locale) {-->
<!--        switch (locale) {-->
<!--          case "ru":-->
<!--            value = name.ru;-->
<!--            break;-->
<!--          case "uz":-->
<!--            value = name.uz;-->
<!--            break;-->
<!--        }-->
<!--      } else {-->
<!--        value = name.ru;-->
<!--      }-->

<!--      return value;-->
<!--    },-->

<!--    Delete(id) {-->
<!--      this.$swal({-->
<!--        title: this.$t("sweetAlert.title"),-->
<!--        text: this.$t("sweetAlert.are_you_sure_delete_role"),-->
<!--        icon: "warning",-->
<!--        showCancelButton: true,-->
<!--        cancelButtonText: this.$t("cancel"),-->
<!--        confirmButtonText: this.$t("sweetAlert.yes"),-->
<!--      }).then((result) => {-->
<!--        if (result.value) {-->
<!--          api.roles.deleteRole(id)-->
<!--              .then((response) => {-->
<!--                this.toasted(response.data.message, "success");-->

<!--                this.fetchRoles(this);-->

<!--                this.$swal(this.$t("sweetAlert.deleted"), "", "success");-->
<!--              })-->
<!--              .catch((error) => {-->
<!--                if (!error.response) {-->
<!--                  this.toasted("Error: Network Error", "error");-->
<!--                } else {-->
<!--                  if (error.response.status === 403) {-->
<!--                    this.toasted(error.response.data.message, "error");-->
<!--                  } else if (error.response.status === 401) {-->
<!--                    this.toasted(error.response.data.message, "error");-->
<!--                  } else if (error.response.status === 500) {-->
<!--                    this.toasted(error.response.data.message, "error");-->
<!--                  } else if (error.response.status === 404) {-->
<!--                    this.toasted(error.response.data.exception, "error");-->
<!--                  } else {-->
<!--                    this.error = true;-->
<!--                    this.errors = error.response.data.errors;-->
<!--                  }-->
<!--                }-->
<!--              });-->
<!--        }-->
<!--      });-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style scoped lang="scss">-->
<!--::v-deep .row__head__bottom-border {-->
<!--  border-bottom: 2px solid var(&#45;&#45;gray-200) !important;-->
<!--}-->

<!--::v-deep .row__body__bottom-border:not(:last-child) {-->
<!--  border-bottom: 2px solid var(&#45;&#45;gray-200) !important;-->
<!--}-->

<!--::v-deep .table__list {-->
<!--  min-height: 250px;-->
<!--  max-height: none;-->

<!--  table {-->
<!--    color: var(&#45;&#45;gray-600);-->

<!--    thead tr th {-->
<!--      font-family: CraftworkSans, serif;-->
<!--      font-weight: 900;-->
<!--      font-size: 14px;-->
<!--      line-height: 14px;-->
<!--      letter-spacing: 1px;-->
<!--      color: var(&#45;&#45;gray-400) !important;-->
<!--      padding: 1.125rem 1rem;-->
<!--      vertical-align: middle;-->

<!--      //&.b-table-sort-icon-left {-->
<!--      //display: flex;-->
<!--      //align-items: center;-->
<!--      //}-->
<!--    }-->

<!--    td {-->
<!--      vertical-align: middle;-->
<!--    }-->
<!--  }-->

<!--  .table.b-table[aria-busy=true] {-->
<!--    opacity: 1 !important;-->
<!--  }-->
<!--}-->

<!--::v-deep .table.b-table > thead > tr > [aria-sort="none"],-->
<!--::v-deep .table.b-table > tfoot > tr > [aria-sort="none"] {-->
<!--  background-position: right calc(2rem / 2) center !important;-->
<!--  //background-position: right !important;-->
<!--  padding-right: 20px;-->
<!--}-->

<!--::v-deep .table.b-table > thead > tr > [aria-sort=ascending],-->
<!--::v-deep .table.b-table > tfoot > tr > [aria-sort=ascending] {-->
<!--  background-position: right calc(2rem / 2) center !important;-->
<!--  background-size: 20px;-->
<!--  background-image: url("../../../assets/icons/icon-arrow-down.svg") !important;-->
<!--}-->

<!--::v-deep .table.b-table > thead > tr > [aria-sort=descending],-->
<!--::v-deep .table.b-table > tfoot > tr > [aria-sort=descending] {-->
<!--  background-position: right calc(2rem / 2) center !important;-->
<!--  background-size: 20px;-->
<!--  background-image: url("../../../assets/icons/icon-arrow-up.svg") !important;-->
<!--}-->
<!--.search__content {-->
<!--  margin-top: 0;-->
<!--}-->

<!--.base-search-input {-->
<!--  margin-top: 2rem;-->
<!--  margin-bottom: 1rem;-->
<!--}-->
<!--.custom-actions{-->
<!--  gap: 12px;-->
<!--  ::v-deep .base__button {-->
<!--    padding: 8px !important;-->
<!--  }-->
<!--  ::v-deep .right__icon {-->
<!--    margin: 0!important;-->
<!--  }-->
<!--}-->
<!--.purple {-->
<!--  background: #7C3AED;-->
<!--}-->

<!--</style>-->
<script>
import { mapActions, mapGetters } from "vuex";
import api from "@/services/api";
import BaseButton from "@/components/Reusable/BaseButton";
import RolesPermission from "@/permission/roles";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
// import BaseSearchInput from "@/components/Reusable/BaseSearchInput";
import AppHeader from "@/components/Header/AppHeader";

export default {
  name: "Roles",
  components: {
    BasePlusIcon,
    BaseButton,
    AppHeader,
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

    <!--        <div-->
    <!--            class="-->
    <!--          d-flex-->
    <!--          justify-content-end-->
    <!--          align-items-center-->
    <!--          flex-md-row flex-column-->
    <!--        "-->
    <!--        >-->
    <!--            <base-button-->
    <!--                v-if="createPermission"-->
    <!--                design="violet-gradient"-->
    <!--                @click="$router.push({name: 'roles-store'})"-->
    <!--                :text="$t('add')"-->
    <!--                class="ml-4"-->
    <!--            >-->
    <!--                <template #left-icon>-->
    <!--                    <BasePlusIcon fill="var(&#45;&#45;white)"/>-->
    <!--                </template>-->
    <!--            </base-button>-->
    <!--        </div>-->

    <div class="">
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
        <template #empty="scope" class="text-center">
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

        <template #cell(actions)="data">
          <div class="float-right">
            <div
              class="dropdown my-dropdown dropleft"
              v-if="data.item.id !== 1 && (editPermission || deletePermission)"
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
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<style scoped></style>
