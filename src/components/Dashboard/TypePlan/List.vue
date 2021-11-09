<template>
  <main>
    <div class="my-container">
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
          class="
          d-flex
          w-100
          align-items-center
          flex-md-row flex-column
          mb-md-0 mb-3
        "
        >
          <h1 class="title__big my-0 order-md-0 order-1">
            {{ $t("type_plan.list") }}
          </h1>
          <ul class="breadcrumb ml-md-4 ml-md-3 mb-0 mb-md-0 align-self-start">
            <li class="breadcrumb-item">
              <router-link :to="{name: 'home'}">
                <i class="far fa-home"></i>
              </router-link>
            </li>

            <li class="breadcrumb-item">
              <router-link :to="{name: 'type_plan'}">
                {{ $t("type_plan.title") }}
              </router-link>
            </li>

            <li class="breadcrumb-item">
              <a href="#">
                {{ getPlan.name }}
              </a>
            </li>

            <li class="breadcrumb-item active">
              {{ $t("type_plan.list") }}
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-4">
        <b-table
          sticky-header
          borderless
          responsive
          :items="getPlan.plans"
          :fields="fields"
          :busy="getLoading"
          show-empty
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

          <template #cell(image)="data">
            <img
              style="cursor: pointer; object-fit: contain"
              :data-fancybox="data.value"
              v-lazy="data.value"
              width="150"
              height="100"
              fluid
            />
          </template>

          <template #cell(balcony_area)="data">
            {{ data.item.balcony ? data.item.balcony_area + " м²" : $t("no") }}
          </template>

          <template #cell(actions)="data">
            <div class="float-right">
              <div
                class="dropdown my-dropdown dropleft"
                v-if="getPermission.type_plan.update"
              >
                <button
                  type="button"
                  class="dropdown-toggle"
                  data-toggle="dropdown"
                >
                  <i class="far fa-ellipsis-h"></i>
                </button>

                <div class="dropdown-menu">
                  <button
                    class="dropdown-item dropdown-item--inside"
                    @click="edit(data.item.id)"
                  >
                    <i class="fas fa-pen"></i>
                    {{ $t("edit") }}
                  </button>
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
import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox.css";

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
      fields: [
        {
          key: "id",
          label: "#",
        },
        {
          key: "image",
          label: "ПЛАНИРОВОКА",
          image: true,
        },
        {
          key: "name",
          label: "НАЗВАНИЯ",
        },
        {
          key: "area",
          label: "Площадь",
        },
        {
          key: "balcony_area",
          label: "БАЛКОН",
        },
        {
          key: "actions",
          label: "",
        },
      ],
    };
  },

  computed: mapGetters(["getPlan", "getLoading", "getPermission"]),

  mounted() {
    this.fetchPlans(this);
    Fancybox.bind("[data-fancybox]");
  },

  methods: {
    ...mapActions(["fetchPlans"]),

    edit(id) {
      this.$router.push({
        name: "type-plan-edit",
        params: {object: this.getPlan.id, id: id},
      });
    },
  },
};
</script>

<style></style>
