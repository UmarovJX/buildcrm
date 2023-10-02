<script>
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox.css";
import { mapGetters, mapMutations } from "vuex";
import api from "@/services/api";
import CreateModal from "@/components/Dashboard/TypeParking/Components/CreateModal";
import BaseSearchInput from "@/components/Reusable/BaseSearchInput";
import BaseEditIcon from "@/components/icons/BaseEditIcon";
import PlansPermission from "@/permission/plans";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import BaseLoadingContent from "@/components/BaseLoadingContent";
import AppHeader from "@/components/Header/AppHeader";
import { XButton } from "@/components/ui-components/button";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import { XFormSelect } from "@/components/ui-components/form-select";

export default {
  name: "TypeParkingList",
  components: {
    XFormSelect,
    BaseArrowRightIcon,
    BaseArrowLeftIcon,
    BaseLoadingContent,
    BaseDeleteIcon,
    CreateModal,
    BaseSearchInput,
    BaseButton,
    BaseEditIcon,
    AppHeader,
    XButton,
  },
  data() {
    return {
      page: +this.$route.query.page || 1,
      limit: +this.$route.query.limit || 10,
      totalPage: 0,
      showByValue: +this.$route.query.limit || 10,
      showByOptions: [5, 10, 20, 30].map((el) => ({ value: el, text: el })),
      parkings: [],
      parking: {
        uuid: null,
        floor: null,
        number: null,
        upload_id: null,
        price: null,
        img: null,
        building_id: null,
      },
      editPermission: PlansPermission.getPlansEditPermission(),
      deletePermission: PlansPermission.getPlansDeletePermission(),
      showLoading: false,
      manager: {},
      manager_id: null,
      header: {
        modalProperties: {
          position: "create",
          title: this.$t("add"),
        },
      },
      fields: [
        {
          key: "image",
          label: this.$t("type_plan.image"),
        },
        {
          key: "number",
          label: this.$t("parking_number"),
        },
        {
          key: "floor",
          label: this.$t("floor"),
        },
        {
          key: "building.name",
          label: this.$t("object.building"),
        },

        {
          key: "price",
          label: this.$t("contracts.price"),
        },
        {
          key: "actions",
          label: "",
        },
      ],
      deletePlan: {
        plans: [],
        message: "",
        removePlan: {},
      },

      loading: false,
    };
  },
  computed: {
    ...mapGetters(["getLoading", "getPermission"]),
    query() {
      return Object.assign({}, this.$route.query);
    },
  },
  watch: {
    "$route.query": {
      handler(value) {
        if (value) {
          this.fetchParkings();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.$router.push({
      query: { ...this.query, page: this.page, limit: this.limit },
    });
    this.fetchParkings();
    Fancybox.bind("[data-fancybox]");
  },
  methods: {
    changeFetchLimit() {
      const query = {
        ...this.query,
        page: this.query.page || 1,
      };
      const limit = this.showByValue;
      this.$router.push({ query: { ...query, limit } });
    },
    changeCurrentPage(page) {
      const currentPage = this.query.page;
      if (+page === +currentPage) return;
      this.page = page;
      const query = {
        ...this.query,
        page: this.query.page || 1,
      };
      const limit = this.query.limit || 10;
      this.$router.replace({ query: { ...query, page, limit } });
    },
    ...mapMutations(["updateLoading"]),
    async fetchParkings() {
      this.updateLoading(true, { root: true });
      this.showLoading = true;
      try {
        const response = await api.parkingsV3.getObjectParkings({
          page: this.page,
          limit: this.showByValue,
          object_id: this.$route.params.id,
        });
        this.parkings = response.data.result;
        this.totalPage = response.data.pagination.totalPage;

        this.updateLoading(false, { root: true });
        this.showLoading = false;
      } catch (error) {
        this.updateLoading(false, { root: true });
        this.showLoading = false;
        if (!error.response) {
          this.toasted("Error: Network Error", "error");
        } else {
          if (error.response.status === 403) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 401) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 500) {
            this.toasted(error.response.data.message, "error");
          } else {
            this.toasted(error.response.data.message, "error");
          }
        }
      }
    },
    imagePath(item) {
      if (item && item.upload_id) return item.upload_id.path;
      return null;
    },
    clearModal() {
      this.parking = {
        uuid: null,
        floor: null,
        number: null,
        upload_id: null,
        price: null,
        img: null,
        building_id: null,
      };
    },
    async deleteTypeParking(item) {
      try {
        const d = new FormData();
        d.append("id", item.id);
        const res = await api.parkingsV3.removeParking(d);
        console.log(res.data);
        if (res.data.message) {
          throw new Error(res.data.message);
        }
        const message = `${this.$t("sweetAlert.deleted")}`;
        this.$swal(message, "", "success");
        this.fetchParkings();
      } catch (e) {
        const message = `${this.$t("sweetAlert.error")}:${e.message}`;
        this.$swal(message, "", "error");
      }
    },
    async updateList() {
      this.loading = true;
      await this.fetchParkings();
      this.loading = false;
    },
    showAddModal() {
      this.parking = {
        uuid: null,
        floor: null,
        number: null,
        upload_id: null,
        price: null,
        img: null,
        building_id: null,
      };
      this.$refs["create-update"].openPlanModal();
    },

    closeDeletePlanModal() {
      this.$bvModal.hide("delete-plan-modal");
    },
    edit(item) {
      this.parking = {
        uuid: item.id,
        floor: item.floor,
        number: item.number,
        upload_id: item.upload_id?.id,
        price: item.price,
        img: item.upload_id?.path,
        building_id: item.building.id,
      };
      console.log("prop", this.parking);
      this.$refs["create-update"].openPlanModal();
    },
  },
};
</script>

<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t("parking") }}
      </template>
    </app-header>

    <div class="search__content">
      <!--  Search Content  -->
      <base-search-input
        class="base-search-input w-50 mr-2"
        :placeholder="`${$t('objects.create.plan.search')}`"
      />

      <div class="d-flex x-gap-1">
        <x-button
          @click="showAddModal"
          :text="$t('objects.create.parking.add')"
          variant="secondary"
          left-icon="add"
          color-icon="var(--violet-600)"
        />
      </div>
    </div>

    <div>
      <div class="mt-4">
        <b-table
          thead-tr-class="row__head__bottom-border"
          tbody-tr-class="row__body__bottom-border"
          class="table__list"
          sticky-header
          show-empty
          borderless
          responsive
          :items="parkings"
          :empty-text="$t('no_data')"
          :fields="fields"
          :busy="showLoading"
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

          <template #cell(plan)="data">
            {{ data.item.name }}
          </template>

          <template #cell(image)="data">
            <img
              style="cursor: pointer; object-fit: contain"
              :data-fancybox="imagePath(data.item)"
              :src="imagePath(data.item)"
              width="80"
              height="80"
              alt="plan_image"
              fluid
            />
          </template>

          <template #cell(balcony_area)="data">
            {{ data.item.balcony ? data.item.balcony_area + " м²" : $t("no") }}
          </template>

          <template #cell(actions)="data">
            <div v-if="editPermission || deletePermission" class="actions">
              <BaseButton
                v-if="editPermission"
                class="button rounded-circle"
                text=""
                @click="edit(data.item)"
              >
                <template #right-icon>
                  <BaseEditIcon fill="#ffff" />
                </template>
              </BaseButton>
              <BaseButton
                v-if="deletePermission"
                class="bg-danger button rounded-circle"
                text=""
                @click="deleteTypeParking(data.item)"
              >
                <template #right-icon>
                  <BaseDeleteIcon fill="#ffff" />
                </template>
              </BaseButton>
            </div>
          </template>
        </b-table>
        <div class="pagination__vue" v-if="!showLoading && totalPage">
          <!--   Pagination   -->
          <vue-paginate
            :page-count="totalPage"
            :value="page"
            :container-class="'container'"
            :page-class="'page-item'"
            :page-link-class="'page-link'"
            :next-class="'page-item'"
            :prev-class="'page-item'"
            :prev-link-class="'page-link'"
            :next-link-class="'page-link'"
            @change-page="changeCurrentPage"
          >
            <template #next-content>
              <span class="d-flex align-items-center justify-content-center">
                <base-arrow-right-icon />
              </span>
            </template>

            <template #prev-content>
              <span class="d-flex align-items-center justify-content-center">
                <base-arrow-left-icon />
              </span>
            </template>
          </vue-paginate>

          <!--  Show By Select    -->
          <div class="show__by">
            <x-form-select
              :label="false"
              :options="showByOptions"
              v-model="showByValue"
              @change="changeFetchLimit"
            >
              <template #output-prefix>
                <span class="show-by-description">
                  {{ $t("contracts.show_by") }}:
                </span>
              </template>
            </x-form-select>
          </div>
        </div>
      </div>

      <create-modal
        ref="create-update"
        @update-list="updateList"
        @clear-field="clearModal"
        :parking="parking"
      />
    </div>

    <base-loading-content :loading="loading" />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/utils/pagination.scss";

.label {
  color: #7c3aed;
  margin-right: 3px;
  font-weight: 500;
}

.fal {
  font-weight: 500;
}

.text {
  font-weight: 600;
}

.button {
  height: auto;
  background-color: #7c3aed;
  width: auto;
  padding: 8px;

  ::v-deep span {
    margin-left: 0 !important;
  }
}

.actions {
  display: flex;
  gap: 16px;
}

.search__content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}

::v-deep .row__head__bottom-border {
  border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .row__body__bottom-border:not(:last-child) {
  border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .table__list {
  min-height: 250px;
  max-height: none;

  table {
    color: var(--gray-600);

    thead tr th {
      font-family: CraftworkSans, serif;
      font-weight: 900;
      font-size: 14px;
      line-height: 14px;
      letter-spacing: 1px;
      color: var(--gray-400) !important;
      padding: 1.125rem 1rem;
      vertical-align: middle;

      //&.b-table-sort-icon-left {
      //display: flex;
      //align-items: center;
      //}
    }

    td {
      font-family: Inter, sans-serif;
      font-size: 1rem;
      line-height: 22px;
      font-weight: 600;
      vertical-align: middle;
    }
  }

  .table.b-table[aria-busy="true"] {
    opacity: 1 !important;
  }
}

::v-deep .table.b-table > thead > tr > [aria-sort="none"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="none"] {
  background-position: right calc(2rem / 2) center !important;
  //background-position: right !important;
  padding-right: 20px;
}

::v-deep .table.b-table > thead > tr > [aria-sort="ascending"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="ascending"] {
  background-position: right calc(2rem / 2) center !important;
  background-size: 20px;
  background-image: url("../../../assets/icons/icon-arrow-down.svg") !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort="descending"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="descending"] {
  background-position: right calc(2rem / 2) center !important;
  background-size: 20px;
  background-image: url("../../../assets/icons/icon-arrow-up.svg") !important;
}
</style>
