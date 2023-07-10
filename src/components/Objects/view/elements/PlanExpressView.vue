<script>
import PlanInformation from "@/components/Objects/view/elements/PlanInformation";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
// import BaseButton from "@/components/Reusable/BaseButton";
// import BaseLoading from "@/components/Reusable/BaseLoading";
import VueHtml2pdf from "vue-html2pdf";
import { mapGetters } from "vuex";
import ApartmentExpressView from "@/components/Objects/view/elements/ApartmentExpressView";
import api from "@/services/api";

export default {
  name: "PlanExpressView",

  /* COMPONENTS */
  components: {
    // BaseLoading,
    BaseArrowLeftIcon,
    PlanInformation,
    VueHtml2pdf,
    ApartmentExpressView,
  },

  /* PROPS */
  props: {
    planId: {
      type: Number,
      default: () => null,
    },
    isHidePrice: {
      type: Boolean,
      required: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },

  /* EMITS */
  emits: ["hide-plan-sidebar-view", "update-content"],

  /* DATA */
  data() {
    return {
      htmlToPdfOptions: {
        margin: 6,
        filename: "",
      },
      sidebarApartment: {},
      // appLoading: true,
      variant: "none",
      // visibleModal: true,
      showReservationModal: false,
      expressView: {
        toggle: false,
        item: {},
      },
      plan: {},
    };
  },

  /* COMPUTED */
  computed: {
    ...mapGetters({
      me: "getMe",
      userPermission: "getPermission",
      reserveClient: "getReserveClient",
    }),
    visibleComp: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("hide-plan-sidebar-view");
          // return value
          // } else {
          //   this.$emit('hide-plan-sidebar-view')
        }
      },
    },
    hasApartment() {
      return Object.keys(this.plan).length > 0;
    },
  },
  watch: {
    planId(value) {
      if (value) {
        this.getPlan();
      }
    },
  },

  /* METHODS */
  methods: {
    async getPlan() {
      const { object } = this.$route.params;
      await api.objectsV2
        .getPlanItem(object, this.planId)
        .then((response) => {
          this.plan = response.data;
        })
        .catch((err) => {
          return err;
        });
    },
    hideApartmentSidebarView() {
      this.expressView.toggle = false;
    },
    apartmentExpressReview(item) {
      this.expressView.item = item;
      this.expressView.toggle = true;
    },
    hidePlanSidebar() {
      this.$emit("hide-plan-sidebar-view");
    },
    printApartmentInformation() {
      const { object, block, entrance, number } = this.sidebarApartment;
      this.htmlToPdfOptions.filename =
        object.name + " , " + block.name + " , " + entrance + "/" + number;
      this.$refs.html2Pdf.generatePdf();
    },
    updateContent() {
      this.$emit("update-content");
    },
  },
};
</script>
<template>
  <div>
    <b-sidebar
      v-model="visibleComp"
      sidebar-class="sidebar__apartment"
      body-class="sidebar__apartment-body"
      aria-labelledby="sidebar-no-header-title"
      id="apartment-express-view"
      :backdrop-variant="variant"
      backdrop
      right
      no-header
      shadow
    >
      <template #default="{ hide }">
        <vue-html2pdf
          v-if="hasApartment"
          :show-layout="false"
          :float-layout="true"
          :enable-download="true"
          :preview-modal="true"
          :pdf-quality="2"
          :manual-pagination="false"
          pdf-format="a5"
          :paginate-elements-by-height="3000"
          pdf-orientation="portrait"
          pdf-content-width="560px"
          :html-to-pdf-options="htmlToPdfOptions"
          ref="html2Pdf"
        >
          <section slot="pdf-content">
            <!--  HEAD    -->
            <div
              v-if="visible"
              class="head d-flex justify-content-between pdf-item"
            >
              <div class="d-flex justify-content-center align-items-center">
                <div
                  @click="hidePlanSidebar"
                  class="close__button d-flex justify-content-center align-items-center"
                >
                  <base-arrow-left-icon :width="32" :height="32" />
                </div>
                <span class="section__title">
                  {{ plan.name }}
                </span>
              </div>
            </div>

            <!--  MAIN    -->
            <plan-information
              v-if="visible"
              class="pdf-item"
              :is-hide-price="isHidePrice"
              :plan="plan"
              @open-express="apartmentExpressReview"
            />

            <!--   ACTIONS     -->
          </section>
        </vue-html2pdf>

        <!--  LOADING    -->
        <!--      <base-loading class="h-100" v-if="appLoading"/>-->
      </template>
    </b-sidebar>

    <apartment-express-view
      :visible="expressView.toggle"
      :apartment="expressView.item"
      :apartmentUuid="expressView.item.uuid"
      @update-content="updateContent"
      @hide-apartment-sidebar-view="hideApartmentSidebarView"
    />
  </div>
</template>

<style lang="sass" scoped>

::v-deep .b-sidebar
    filter: drop-shadow(-16px 0px 64px rgba(0, 0, 0, 0.16)) drop-shadow(-16px 0px 24px rgba(0, 0, 0, 0.06))

    &.b-sidebar-right
        border-radius: 56px 0 0 56px

    & > .b-sidebar-body
        border-radius: 1rem


::v-deep .sidebar__apartment
    width: 42rem
    font-family: CraftworkSans, serif

    &-body
        //margin: 0 3.5rem
        //padding: 3.5rem 0
        padding: 3.5rem
        -ms-overflow-style: none
        scrollbar-width: none

        &::-webkit-scrollbar
            display: none


        .head
            line-height: 1.75rem

            .close__button
                width: 3.5rem
                height: 3.5rem
                cursor: pointer
                border-radius: 50%
                margin-right: 0.5rem
                background-color: var(--gray-100)
                transition: background-color 100ms ease-in-out

                &:hover
                    background-color: var(--gray-200)

            .section__title
                color: var(--gray-600)
                font-size: 1.5rem


            .apartment__status
                font-family: Inter, sans-serif
                background-color: var(--gray-100)
                border-radius: 2rem
                min-width: max-content
                padding: 0.5rem 2rem


        .vue-html2pdf
            .layout-container
                position: relative
                width: auto
                height: auto
                left: 0
                z-index: 0
                background: #FFFFFF
                display: block

.checkout__button
    padding: 1rem 3rem

.action-block
    display: flex
    flex-wrap: wrap
    margin-top: 1rem
    margin-bottom: .5rem
    gap: .5rem


.print__button,
.cancel__button,
.view__button
    outline: none
    border: none
    width: 3.5rem
    height: 3.5rem
    border-radius: 50%

.status
    &-waiting
        background-color: var(--yellow-100) !important
        color: var(--yellow-600) !important

    &-contract
        background-color: var(--blue-100) !important
        color: var(--blue-600) !important

    &-booked
        background-color: var(--yellow-100) !important
        color: var(--yellow-600) !important

    &-cancelled
        background-color: var(--pink-100) !important
        color: var(--pink-600) !important

    &-available
        background-color: var(--teal-100) !important
        color: var(--teal-600) !important

    &-sold
        background-color: var(--gray-100) !important
        color: var(--gray-600) !important

::v-deep .b-tooltip
    .tooltip-text
        color: #fff !important
        margin-bottom: 0
</style>
