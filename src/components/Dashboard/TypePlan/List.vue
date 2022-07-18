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
            show-empty
            borderless
            responsive
            :items="getPlan.plans"
            :empty-text="$t('no_data')"
            :fields="fields"
            :busy="showLoading"
            class="custom-table"
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

          <template #cell(image)="data">
            <img
                style="cursor: pointer; object-fit: contain"
                :data-fancybox="data.value[0]"
                :src="data.value[0]"
                width="150"
                height="100"
                alt="plan_image"
                fluid
            />
          </template>

          <template #cell(balcony_area)="data">
            {{ data.item.balcony ? data.item.balcony_area + " м²" : $t("no") }}
          </template>

          <template #cell(actions)="data">
            <div class="float-right">
              <div
                  v-if="editPermission || deletePermission"
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
                  <button
                      v-if="editPermission"
                      class="dropdown-item dropdown-item--inside"
                      @click="edit(data.item.id)"
                  >
                    <i class="fas fa-pen"></i>
                    <span class="ml-3">
                      {{ $t("edit") }}
                    </span>
                  </button>

                  <button
                      v-if="deletePermission"
                      class="dropdown-item dropdown-item--inside"
                      @click="deleteTypePlan(data.item)"
                  >
                    <span>
                      <i class="far fa-trash"></i>
                    </span>
                    <span class="ml-3">
                      {{ $t("delete") }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </b-table>
      </div>

      <delete-has-apartment
          ref="delete-plan-modal"
          :plan-list="deletePlan.plans"
          :remove-plan="deletePlan.removePlan"
          @successfully-updated="successfullyDeletePlan"
          @close-delete-modal="closeDeletePlanModal"
      />
    </div>
  </main>
</template>

<script>
import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox.css";
import {mapGetters, mapActions} from "vuex";
import api from "@/services/api";
import DeleteHasApartment from "@/components/Dashboard/TypePlan/DeleteHasApartment";

export default {
  name: 'TypePlanList',
  components: {
    DeleteHasApartment
  },
  data() {
    return {
      showLoading: false,
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
          label: this.$t('type_plan.title'),
          // image: false,
        },
        {
          key: "name",
          label: this.$t('type_plan.name'),
        },
        {
          key: "area",
          label: this.$t('type_plan.area'),
        },
        {
          key: "balcony_area",
          label: this.$t('type_plan.balcony'),
        },
        {
          key: "apartments_count",
          label: this.$t("apartments_count")
        },
        {
          key: "actions",
          label: "",
        },
      ],
      deletePlan: {
        plans: [],
        message: '',
        removePlan: {}
      }
    }
  },
  computed: {
    ...mapGetters(["getPlan", "getLoading", "getPermission"]),
    editPermission() {
      return this.getPermission.plans && this.getPermission.plans.edit
    },
    deletePermission() {
      return this.getPermission.plans && this.getPermission.plans.delete
    }
  },
  mounted() {
    this.fetchPlans(this);
    Fancybox.bind("[data-fancybox]");
  },
  methods: {
    ...mapActions(["fetchPlans"]),
    async deleteTypePlan(item) {
      const objectId = this.$route.params.id
      const {apartments_count, id: planId} = item
      if (apartments_count) {
        this.showLoading = true
        const response = await api.plans.deletePlanWhenHasApartment(objectId, planId)
            .then(() => ({}))
            .catch((error) => error.response)
            .finally(() => {
              this.showLoading = false
            })

        const hadResponse = Object.keys(response).length
        if (hadResponse) {
          const {plans, message} = response.data
          this.deletePlan.plans = plans
          this.deletePlan.message = message
          this.deletePlan.removePlan = item
          this.$bvModal.show('delete-plan-modal')
        }
      } else {
        this.showLoading = true
        api.plans.deletePlan(objectId, planId)
            .then(() => {
              this.successfullyDeletePlan()
            })
            .catch((error) => {
              this.toastedWithErrorCode(error)
            })
            .finally(() => {
              this.showLoading = false
            })
      }
    },
    successfullyDeletePlan() {
      this.closeDeletePlanModal()
      const message = `${this.$t("sweetAlert.deleted")}`
      this.$swal(message, "", "success")
      this.fetchPlans(this)
    },
    closeDeletePlanModal() {
      this.$bvModal.hide('delete-plan-modal')
    },
    edit(id) {
      this.$router.push({
        name: "type-plan-edit",
        params: {object: this.getPlan.id, id: id},
      })
    },
  },
}
</script>

<style></style>
