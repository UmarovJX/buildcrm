<script>
import TypePlanCreateModal from "./Components/Store/TypePlanCreateModal";
import TypePlanList from "./Components/Store/TypePlanList";
import BuildingStore from "./Components/Store/BuildingStore";
import BuildingList from "./Components/Store/BuildingsList";
import CreateDiscount from "./Components/Discount/Create";
import BaseBreadCrumb from "@/components/BaseBreadCrumb";
import AppHeader from "@/components/Header/AppHeader";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import { mapGetters, mapActions } from "vuex";
import api from "@/services/api";
import BaseTabPicker from "@/components/Reusable/BaseTabPicker";
import { XIcon } from "@/components/ui-components/material-icons";

export default {
  components: {
    XIcon,
    BaseTabPicker,
    "type-plan-create": TypePlanCreateModal,
    "building-store": BuildingStore,
    "buildings-list": BuildingList,
    "plans-table": TypePlanList,
    "create-discount": CreateDiscount,
    BaseBreadCrumb,
    AppHeader,
    AppBreadcrumb,
  },

  created() {
    if (this.$route.params.id) {
      this.object.id = this.$route.params.id;
    }
  },

  watch: {
    step() {
      this.getData();
    },
  },

  data: () => ({
    typesOptions: ["apartment", "parking"],
    currentType: "all",
    object: {
      id: null,
      name: null,
      address: null,
      full_address: null,

      slug: null,
      slug_parking: null,
      parking_build_date: null,
      build_date: null,
      company_id: 0,
      is_hide_m2_price: false,
      is_parking: false,
      credit_month: 18,
      draft: false,
    },
    plans: [],
    buildings: [],
    discounts: [],
    discount_data: {
      id: null,
      prepay_from: 0,
      prepay_to: 0,
      discount: 0,
    },
    disabled: {
      discount: {
        create: false,
      },

      building: {
        create: false,
      },
      plan: {
        create: false,
        edit: false,
      },
    },
    create: {
      building: {
        name: null,
        balcony_price: null,
        completion_date: "",
        installment_month: "",
      },
    },
    step: 1,
    loading: false,
    getLoading: false,
    error: false,
    errors: [],
    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },
    pageInfo: {
      title: {
        type: "i18n",
        content: "objects.title",
      },
    },
  }),

  computed: {
    filteredDiscounts() {
      if (this.currentType === "all") return this.discounts;
      else
        return this.discounts.filter((el) => el.type_sort === this.currentType);
    },
    ...mapGetters(["getCurrency", "getCompanies"]),
    breadCrumbs() {
      return [
        {
          routeName: "objects",
          textContent: this.$t("objects.title"),
        },
        {
          routeName: "apartments",
          textContent: this.object.name,
          params: {
            object: this.$route.params.id,
          },
        },
      ];
    },
    page() {
      const { name } = this.$route;

      if (name === "objectsEdit") {
        return {
          type: "i18n",
          path: "objects.create.edit_block",
        };
      }

      return {
        type: "i18n",
        path: "objects.create.new",
      };
    },
    activeContent() {
      const { name } = this.$route;

      if (name === "objectsEdit") {
        return this.$t("objects.create.edit_block");
      }

      return this.$t("objects.create.new");
    },
  },

  mounted() {
    this.getData();
    this.fetchCompanies(this);
  },

  methods: {
    ...mapActions(["fetchCompanies"]),

    async requestObject() {
      this.loading = true;
      this.getLoading = true;
      try {
        if (this.object.id === null) {
          const { data, status } = await api.objects.createObject(this.object);

          if (status === 201 || status === 202) {
            this.step = 2;
            this.loading = false;
            this.getLoading = false;
            this.object = data;
          }
        } else {
          const { data, status } = await api.objects.updateObject(
            this.object.id,
            this.object
          );

          if (status === 201 || status === 202) {
            this.step = 2;
            this.loading = false;
            this.getLoading = false;
            this.object = data;
          }
        }
      } catch (error) {
        this.loading = false;
        this.getLoading = false;

        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = false;
          this.errors = error.response.data;
        }
      }
    },

    SaveDiscount() {
      this.disabled.discount.create = false;
      this.getDiscounts();
    },

    editDiscount(discount) {
      this.discount_data = discount;
      this.disabled.discount.create = true;
      // this.$bvModal.show("modal-edit-discount");
    },

    CancelDiscount(event) {
      this.discount_data = {
        id: null,
        prepay_from: null,
        prepay_to: null,
        discount: null,
      };

      this.discounts = [];
      this.discounts = event;
    },

    RemoveDiscount(discount) {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yes"),
      }).then((result) => {
        if (result.value) {
          this.getLoading = true;
          api.objects
            .deleteDiscount(this.object.id, discount.id)
            .then((response) => {
              this.getLoading = false;
              if (response.status === 204) {
                this.getDiscounts();
              }
            })
            .catch((error) => {
              this.getLoading = false;
              this.toastedWithErrorCode(error);

              if (error.response.status === 422) {
                this.error = true;
                this.errors = error.response.data;
              }
            });
        }
      });
    },

    nextStep(step) {
      this.step = step;
    },

    DiscountCreate() {
      this.discount_data = {};
      this.disabled.discount.create = true;
    },

    saveBuilding(event) {
      this.disabled.building.create = false;
      this.buildings.push(event);
    },

    async savePlan(event) {
      this.plans.push(event);
    },

    getData() {
      if (this.object.id) {
        switch (this.step) {
          case 1: {
            this.getObject();
            break;
          }
          case 2: {
            this.getPlans();
            break;
          }
          case 3: {
            this.getBuildings();
            break;
          }
          case 4: {
            this.getDiscounts();
          }
        }
      }
    },

    async getObject() {
      this.getLoading = true;
      try {
        const { data, status } = await api.objects.fetchObject(this.object.id);

        if (status === 200) {
          this.object = {};
          this.object = { ...data, is_parking: !!data.is_parking };
        }

        this.getLoading = false;
      } catch (error) {
        this.getLoading = false;
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },

    async getPlans() {
      this.getLoading = true;
      try {
        const { data, status } = await api.objects.fetchObjectPlans(
          this.object.id
        );

        if (status === 200) {
          this.plans = [];
          this.plans = data;
        }

        this.getLoading = false;
      } catch (error) {
        this.getLoading = false;
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },

    async getBuildings() {
      this.getLoading = true;
      try {
        const { data, status } = await api.objects.fetchBuildings(
          this.object.id
        );

        if (status === 200) {
          this.buildings = [];
          this.buildings = data.map((item) => {
            return {
              ...item,
              edit: false,
            };
          });
        }

        this.getLoading = false;
      } catch (error) {
        this.getLoading = false;
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },

    async getDiscounts() {
      this.getLoading = true;
      try {
        const { data, status } = await api.objects.fetchObjectDiscount(
          this.object.id
        );

        if (status === 200) {
          this.discounts = [];
          this.discounts = data;
        }
        this.getLoading = false;
      } catch (error) {
        this.getLoading = false;
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },

    SaveObject() {
      this.$router.push({ name: "objects" });
    },
  },
};
</script>

<template>
  <div>
    <div>
      <app-header>
        <template #header-breadcrumb>
          <app-breadcrumb :page-info="pageInfo" breadcrumbs="" :page="page" />
        </template>
      </app-header>
      <base-bread-crumb
        :bread-crumbs="breadCrumbs"
        :active-content="activeContent"
        class="mb-4"
      >
      </base-bread-crumb>

      <div
        class="d-flex justify-content-between align-items-center flex-md-row flex-column pb-3"
      >
        <h1 class="title__big mb-md-0 mb-3">{{ $t("objects.create.new") }}</h1>
      </div>

      <div class="alert alert-danger mt-3" v-if="error">
        <ul>
          <li v-for="(error, index) in errors" :key="index">
            <span v-for="msg in error" :key="msg">
              {{ msg }}
            </span>
          </li>
        </ul>
      </div>

      <div class="card">
        <div class="card-content" v-if="step === 1">
          <!-- OBJECT FORM -->
          <form @submit.prevent="requestObject">
            <div class="card-body">
              <!-- NAME -->
              <div class="mb-3">
                <label for="name" class="form-label">
                  {{ $t("objects.create.name") }}
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="object.name"
                  required
                  :placeholder="$t('objects.placeholder.name')"
                />
              </div>
              <!-- ADDRESS -->
              <div class="mb-3">
                <label for="address" class="form-label">
                  {{ $t("objects.address") }}
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="address"
                  v-model="object.address"
                  required
                  :placeholder="$t('objects.placeholder.address')"
                />
              </div>
              <!-- FULLADDRESS -->
              <div class="mb-3">
                <label for="address_full" class="form-label">
                  {{ $t("objects.full_address") }}
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="address_full"
                  v-model="object.full_address"
                  required
                  :placeholder="$t('objects.placeholder.full_address')"
                />
              </div>
              <div class="mb-1">Location</div>
              <div class="row mb-3">
                <div class="col-4">
                  <label for="latitude" class="form-label">
                    {{ $t("Latitude") }}
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="latitude"
                    v-model="object.location.latitude"
                    required
                    :placeholder="$t('latitude')"
                  />
                </div>
                <div class="col-4">
                  <label for="longitude" class="form-label">
                    {{ $t("Longitude") }}
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="longitude"
                    v-model="object.location.longitude"
                    required
                    :placeholder="$t('longitude')"
                  />
                </div>
              </div>

              <!-- SLUG -->
              <div class="mb-3">
                <label for="slug" class="form-label">
                  {{ $t("slug") }}
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="slug"
                  v-model="object.slug"
                  required
                  :placeholder="$t('slug')"
                />
              </div>
              <!-- SLUG parking-->
              <div class="mb-3">
                <label for="slug_parking" class="form-label">
                  {{ $t("slug_parking") }}
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="slug_parking"
                  v-model="object.slug_parking"
                  required
                  :placeholder="$t('slug_parking')"
                />
              </div>

              <!-- parking Build Date -->
              <div class="mb-3">
                <label for="parking_build_date" class="form-label">
                  {{ $t("parking_build_date") }}
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="parking_build_date"
                  v-model="object.parking_build_date"
                  :placeholder="$t('objects.placeholder.parking_build_date')"
                />
              </div>
              <!-- Build Date -->
              <div class="mb-3">
                <label for="date_build" class="form-label">
                  {{ $t("objects.build_date") }}
                </label>
                <input
                  type="date"
                  class="form-control"
                  id="date_build"
                  v-model="object.build_date"
                  required
                  :placeholder="$t('objects.placeholder.build_date')"
                />
              </div>

              <!--              <div class="mb-3">-->
              <!--                <label for="date_build" class="form-label">-->
              <!--                  {{ $t("objects.credit_month") }}-->
              <!--                </label>-->
              <!--                <input-->
              <!--                    type="number"-->
              <!--                    min="0"-->
              <!--                    class="form-control"-->
              <!--                    id="credit_month"-->
              <!--                    v-model="object.credit_month"-->
              <!--                    required-->
              <!--                    :placeholder="$t('objects.placeholder.credit_month')"-->
              <!--                />-->
              <!--              </div>-->
              <!-- COMPANIES -->
              <div class="mb-3">
                <label class="form-label" for="companies">
                  {{ $t("companies.title") }}
                </label>
                <select
                  class="form-control"
                  id="companies"
                  v-model="object.company_id"
                >
                  <option value="0" selected>
                    {{ $t("companies.branch_enter") }}
                  </option>
                  <option
                    v-for="(company, index) in getCompanies"
                    :key="index"
                    :value="company.id"
                  >
                    {{ company.type[$i18n.locale] }} "{{ company.name }}"
                  </option>
                </select>
              </div>
              <!-- m2 price -->
              <div class="mb-3">
                <b-form-checkbox v-model="object.is_hide_m2_price" switch>
                  {{ $t("objects.showM2Price") }}
                </b-form-checkbox>
              </div>
              <div class="mb-3">
                <b-form-checkbox v-model="object.is_parking" switch>
                  {{ $t("objects.hasParking") }}
                </b-form-checkbox>
              </div>
              <div class="mb-3">
                <b-form-checkbox v-model="object.is_map" switch>
                  {{ $t("objects.isMap") }}
                </b-form-checkbox>
              </div>
            </div>
            <div class="card-footer">
              <button type="submit" v-if="!loading" class="btn btn-primary">
                {{ $t("next") }} <i class="fa fa-arrow-alt-circle-right"></i>
              </button>

              <button
                type="submit"
                disabled
                v-if="loading"
                class="btn btn-primary"
              >
                {{ $t("next") }} <i class="fas fa-spinner fa-spin"></i>
              </button>
            </div>
          </form>
        </div>

        <div class="card-content" v-if="step === 2">
          <div class="card-header">
            {{ $t("objects.create.type_plan") }}
          </div>

          <div class="card-body">
            <plans-table :plans="plans"></plans-table>

            <b-button
              variant="success"
              @click="disabled.plan.create = true"
              v-b-modal.modal-create-type-plan
            >
              <i class="fas fa-plus-circle"></i>
              {{ $t("objects.create.new_type_plan") }}
            </b-button>

            <div
              class="object__item object__item--inside object__item-last"
              v-if="plans.length === 0"
            >
              <b-link
                class="object__link"
                @click="disabled.plan.create = true"
                v-b-modal.modal-create-type-plan
              >
                <div class="object__add object__add--inside">
                  <i class="fal fa-plus"></i>
                </div>
                <div class="object__name object__name--inside">
                  {{ $t("objects.create.new_type_plan") }}
                </div>
              </b-link>
            </div>
          </div>
          <div class="card-footer d-flex">
            <b-button
              type="button"
              v-if="step === 2"
              @click="step = 1"
              class="btn mr-1"
              variant="danger"
            >
              <i class="fa fa-arrow-alt-circle-left"></i> {{ $t("back") }}
            </b-button>

            <button
              type="button"
              @click="nextStep(3)"
              :disabled="plans.length <= 0"
              v-if="!loading"
              class="btn btn-primary"
            >
              {{ $t("next") }} <i class="fa fa-arrow-alt-circle-right"></i>
            </button>

            <button
              type="button"
              disabled
              v-if="loading"
              class="btn btn-primary"
            >
              {{ $t("next") }} <i class="fas fa-spinner fa-spin"></i>
            </button>
          </div>
        </div>

        <div class="card-content" v-if="step === 3">
          <div class="card-header">
            {{ $t("objects.create.buildings") }}
          </div>

          <div class="card-body">
            <div
              class="object__item object__item--inside object__item-last"
              v-if="
                disabled.building.create === false && buildings.length === 0
              "
            >
              <b-link
                class="object__link"
                @click="disabled.building.create = true"
              >
                <div class="object__add object__add--inside">
                  <i class="fal fa-plus"></i>
                </div>
                <div class="object__name object__name--inside">
                  {{ $t("objects.create.create_build") }}
                </div>
              </b-link>
            </div>

            <buildings-list
              :plans="plans"
              :buildings="buildings"
              :object="object"
            ></buildings-list>

            <building-store
              v-if="disabled.building.create"
              :object="object"
              @saveBuilding="saveBuilding"
            ></building-store>

            <button
              class="btn btn-primary"
              type="button"
              @click="disabled.building.create = true"
              v-if="disabled.building.create === false && buildings.length > 0"
            >
              <i class="fa fa-plus-square"></i>
              {{ $t("objects.create.create_build") }}
            </button>
          </div>
          <div class="card-footer d-flex">
            <b-button
              variant="danger"
              type="button"
              @click="step = 2"
              class="btn mr-1"
            >
              <i class="fa fa-arrow-alt-circle-left"></i> {{ $t("back") }}
            </b-button>

            <button
              type="button"
              @click="step = 4"
              :disabled="buildings.length <= 0"
              v-if="!loading"
              class="btn btn-primary"
            >
              {{ $t("next") }} <i class="fa fa-arrow-alt-circle-right"></i>
            </button>

            <button
              type="button"
              disabled
              v-if="loading"
              class="btn btn-primary"
            >
              {{ $t("next") }} <i class="fas fa-spinner fa-spin"></i>
            </button>
          </div>
        </div>

        <div class="card-content" v-if="step === 4">
          <div class="card-header">
            {{ $t("objects.create.discounts") }}
          </div>

          <div class="card-body">
            <base-tab-picker
              :options="typesOptions"
              :current="currentType"
              @tab-selected="currentType = $event"
            ></base-tab-picker>
            <div
              class="discount mt-4 mb-4"
              v-for="(discount, index) in filteredDiscounts"
              :key="index"
            >
              <div class="container px-0 mx-0">
                <div class="row">
                  <div>
                    <div class="col-lg-5 float-left">
                      <div class="mb-3">
                        <label class="d-block" for="new_block_prepay">
                          {{ $t("objects.create.pre_pay") }}
                        </label>
                        <div
                          class="d-flex justify-content-between align-items-center"
                        >
                          <div class="">
                            <input
                              id="new_block_prepay"
                              class="my-form__input"
                              disabled
                              type="text"
                              :value="discount.prepay + '%'"
                            />
                          </div>
                          <!--                          <div class="mx-2 long-horizontal-line">-->
                          <!--                            &#8213;-->
                          <!--                          </div>-->
                          <!--                          <div class="">-->
                          <!--                            <input-->
                          <!--                                id="new_block_prepay_to"-->
                          <!--                                class="my-form__input"-->
                          <!--                                disabled-->
                          <!--                                type="text"-->
                          <!--                                :value="discount.prepay_to + '%'"-->
                          <!--                            />-->
                          <!--                          </div>-->
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-7 float-left">
                      <div class="mb-3">
                        <div>
                          <label class="d-block" for="new_block_discount">
                            {{ $t("objects.create.discount") }}
                          </label>
                        </div>
                        <div class="d-flex align-items-center">
                          <div class="flex-grow-1">
                            <input
                              id="new_block_discount"
                              class="my-form__input"
                              disabled
                              type="text"
                              :value="discount.amount + '%'"
                            />
                          </div>
                          <div>
                            <button
                              type="button"
                              @click="editDiscount(discount)"
                              class="btn btn-primary ml-4 mt-0"
                            >
                              <i class="far fa-pen"></i>
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              @click="RemoveDiscount(discount, index)"
                              class="btn btn-primary m-0"
                            >
                              <i class="far fa-trash"></i>
                            </button>
                          </div>
                          <span class="pl-3">
                            <span
                              v-if="
                                currentType === 'all' &&
                                discount.type_sort === 'parking'
                              "
                              >Parking</span
                            >
                            <span v-else style="opacity: 0">Parking</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-md-start justify-content-center">
              <button
                type="button"
                class="btn btn-primary"
                @click="DiscountCreate"
                v-if="!disabled.discount.create"
                v-b-modal.modal-create-discount
              >
                <i class="fal fa-plus mr-2"></i>
                {{ $t("objects.create.create_discount") }}
              </button>
            </div>

            <div
              class="object__item object__item--inside object__item-last"
              v-if="disabled.discount.create && discounts.length === 0"
            >
              <b-link class="object__link" @click="DiscountCreate">
                <div class="object__add object__add--inside">
                  <i class="fal fa-plus"></i>
                </div>
                <div class="object__name object__name--inside">
                  {{ $t("objects.create.create_discount") }}
                </div>
              </b-link>
            </div>
          </div>
          <div class="card-footer d-flex">
            <b-button
              variant="danger"
              type="button"
              @click="step = 3"
              class="btn mr-1"
            >
              <i class="fa fa-arrow-alt-circle-left"></i> {{ $t("back") }}
            </b-button>

            <button
              type="button"
              @click="SaveObject"
              :disabled="discounts.length <= 0"
              v-if="!loading"
              class="btn btn-success"
            >
              {{ $t("save") }} <i class="fa fa-save"></i>
            </button>

            <button
              type="button"
              disabled
              v-if="loading"
              class="btn btn-primary"
            >
              {{ $t("save") }} <i class="fas fa-spinner fa-spin"></i>
            </button>
          </div>
        </div>
      </div>
      <create-discount
        v-if="step === 4 && disabled.discount.create"
        ref="create-modal"
        :object="object"
        :visible="disabled.discount.create"
        :discount="discount_data"
        @RemoveDiscount="disabled.discount.create = false"
        @SaveDiscount="SaveDiscount"
      ></create-discount>
      <type-plan-create
        v-if="step === 2 && disabled.plan.create"
        :object="this.object"
        @RemovePlan="disabled.plan.create = false"
        @savePlan="savePlan"
      ></type-plan-create>
    </div>

    <b-overlay :show="getLoading" no-wrap opacity="0.5" style="z-index: 2222">
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

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
