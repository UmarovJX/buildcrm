<script>
import api from "@/services/api";
import { mapGetters, mapMutations } from "vuex";
import BaseLoadingContent from "@/components/BaseLoadingContent";
import CreationContent from "@/components/Dashboard/Objects/Promo/components/CreationContent";
import ListContent from "@/components/Dashboard/Objects/Promo/components/ListContent";
import PromosPermission from "@/permission/promos";
import BaseButton from "@/components/Reusable/BaseButton";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import AppHeader from "@/components/Header/AppHeader";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import { hasOwnProperty } from "@/util/object";

export default {
  name: "Promo",
  components: {
    AppBreadcrumb,
    AppHeader,
    BasePlusIcon,
    BaseButton,
    ListContent,
    CreationContent,
    BaseLoadingContent,
  },
  data() {
    return {
      promos: [],
      loading: false,
      promoUsage: [],
      page: "",
      createPromoPermission: PromosPermission.getPromosCreatePermission(),
    };
  },
  computed: {
    ...mapGetters(["getPermission"]),
    activeContent() {
      return this.$t("list");
    },
    breadCrumbs() {
      return [
        {
          route: {
            name: "objects",
          },
          content: {
            type: "i18n",
            path: "objects.title",
          },
        },
      ];
    },
  },
  async created() {
    await this.fetchPromoData();
  },
  methods: {
    ...mapMutations({
      changeEditHistory: "changeEditHistory",
    }),
    async fetchPromoData(showLoading = true) {
      const { id } = this.$route.params;

      if (showLoading) {
        this.startLoading();
      }

      await api.promo
        .fetchPromoList(id)
        .then((response) => {
          this.promos = response.data;
          if (
            this.promos.length &&
            hasOwnProperty(this.promos[0], "object_name")
          ) {
            this.page = this.promos[0]["object_name"];
          }
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        })
        .finally(() => {
          if (showLoading) {
            this.finishLoading();
          }
        });
    },
    startLoading() {
      this.loading = true;
    },
    finishLoading() {
      this.loading = false;
    },
    addNewPromo() {
      this.changeEditHistory({});
      this.$bvModal.show("promoCreationModal");
    },
    async editPromoItem(item) {
      const objectId = this.$route.params.id;
      await api.promoV2
        .promoEditContext(objectId, item.uuid)
        .then((response) => {
          this.changeEditHistory(response.data);
          this.$bvModal.show("promoCreationModal");
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        });
    },
    async successfullyCreated() {
      const title = this.$t("promo.successfully_created");
      this.showSuccessResponse(title);
      await this.fetchPromoData(false);
    },
    async successfullyEdited() {
      const title = this.$t("promo.successfully_edited");
      this.showSuccessResponse(title);
      await this.fetchPromoData(false);
    },
    showSuccessResponse(title) {
      this.$swal({
        text: "",
        icon: "success",
        showCancelButton: false,
        title,
      });
    },
    errorOnCreation(error) {
      this.toastedWithErrorCode(error);
    },
  },
};
</script>

<template>
  <div>
    <app-header>
      <template #header-breadcrumb>
        <app-breadcrumb
          :page="page"
          :breadcrumbs="breadCrumbs"
          page-info="promo.promos"
        />
      </template>

      <template #header-actions>
        <base-button
          v-if="createPromoPermission"
          :text="`${$t('add')}`"
          design="violet-gradient"
          @click="addNewPromo"
        >
          <template #left-icon>
            <base-plus-icon fill="var(--white)" />
          </template>
        </base-button>
      </template>
    </app-header>
    <!--    <base-bread-crumb-->
    <!--        :bread-crumbs="breadCrumbs"-->
    <!--        :active-content="activeContent"-->
    <!--    >-->
    <!--      <template #extra-content>-->
    <!--        <base-button v-if="createPromoPermission" design="violet-gradient" @click="addNewPromo"-->
    <!--                     :text="$t('add')">-->
    <!--          <template #left-icon>-->
    <!--            <base-plus-icon fill="var(&#45;&#45;white)"/>-->
    <!--          </template>-->
    <!--        </base-button>-->
    <!--      </template>-->
    <!--    </base-bread-crumb>-->

    <!--  List Of Promos  -->
    <list-content
      :promos="promos"
      @update-content="fetchPromoData(false)"
      @edit-promo-item="editPromoItem"
    />

    <!--  Modal Main Content    -->
    <creation-content
      @successfully-created="successfullyCreated"
      @successfully-edited="successfullyEdited"
      @error-on-creation="errorOnCreation"
    />

    <!--  XLoadingWrapper Content  -->
    <base-loading-content :loading="loading" />
  </div>
</template>
