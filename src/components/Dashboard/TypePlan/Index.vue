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
            {{ $t("type_plan.title") }}
          </h1>
          <ul class="breadcrumb ml-md-4 ml-md-3 mb-0 mb-md-0">
            <li class="breadcrumb-item">
              <router-link :to="{name: 'home'}">
                <i class="far fa-home"></i>
              </router-link>
            </li>

            <li class="breadcrumb-item">
              <a href="#">
                {{ $t("type_plan.title") }}
              </a>
            </li>
            <li class="breadcrumb-item active">
              {{ $t("list") }}
            </li>
          </ul>
        </div>
      </div>

      <div class="">
        <b-table
          sticky-header
          borderless
          responsive
          :items="getObjects"
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

          <template #cell(actions)="data">
            <div class="float-right">
              <div class="dropdown my-dropdown dropleft">
                <button
                  type="button"
                  class="dropdown-toggle"
                  data-toggle="dropdown"
                >
                  <i class="far fa-ellipsis-h"></i>
                </button>

                <div class="dropdown-menu">
                  <b-button
                    class="dropdown-item dropdown-item--inside"
                    @click="PlanView(data.item.id)"
                  >
                    <i class="fas fa-eye"></i>
                    {{ $t("type_plan.plans") }}
                  </b-button>
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
import {mapGetters, mapActions} from "vuex";

export default {
  data() {
    return {
      manager: {},
      manager_id: null,

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
          key: "actions",
          label: "",
        },
      ],
    };
  },

  computed: mapGetters(["getPermission", "getObjects", "getLoading"]),

  mounted() {
    this.fetchObjects(this);

    // console.log(this.getLoading);
  },

  methods: {
    ...mapActions(["fetchObjects"]),

    PlanView(id) {
      this.$router.push({name: "type-plan-view", params: {id: id}});
    },
  },
};
</script>

<style scoped></style>
