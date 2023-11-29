<script>
import api from "@/services/api";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRight from "@/components/icons/BaseArrowRightIcon";
import AppHeader from "@/components/Header/AppHeader";
import ApartmentsPermission from "@/permission/apartments";
import HidePriceButton from "@/components/Reusable/HidePriceButton.vue";

export default {
  name: "Index",
  components: {
    HidePriceButton,
    AppHeader,
    BaseArrowLeft,
    BaseArrowRight,
  },
  data() {
    const objectId = this.$route.params.object;

    return {
      objectId,
      apartment: {},
      apartmentName: "",
      appLoading: true,
      commentsData: {},
      commentLoading: false,
      commentsViewPermission:
        ApartmentsPermission.getApartmentCommentsViewPermission(),
    };
  },
  async created() {
    await this.fetchApartmentView();
  },
  mounted() {
    if (this.commentsViewPermission) {
      this.getComments();
    }
  },
  computed: {
    status() {
      if (!this.apartment["is_sold"]) {
        return "unavailable";
      }
      return this.apartment.order.status;
    },
    tabIndex: {
      get() {
        const { name } = this.$route;
        if (name === "apartment-view") {
          return 0;
        } else {
          return 1;
        }
      },
      set(value) {
        return value;
      },
    },
  },
  methods: {
    updateContent() {
      this.fetchApartmentView();
      if (this.commentsViewPermission) {
        this.getComments();
      }
    },
    async getComments() {
      const paramsData = this.$route.query;
      this.commentLoading = true;
      const apartmentUuid = this.$route.params.id;
      await api.apartmentsV2
        .getApartmentComments(this.objectId, apartmentUuid, paramsData)
        .then((res) => {
          this.commentsData = res.data;
        })
        .catch((err) => {
          this.toasted(err.message, "error");
        })
        .finally(() => {
          this.commentLoading = false;
        });
    },
    async fetchApartmentView() {
      this.appLoading = true;
      const { object, id } = this.$route.params;
      await api.apartmentsV2
        .getApartmentView(object, id)
        .then((response) => {
          this.apartment = response.data;
          this.apartmentName = response.data.object.name;
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        })
        .finally(() => {
          this.appLoading = false;
        });
    },
    tabChange(current, prev) {
      if (current && !prev) {
        this.$router.replace({ name: "apartment-view-comment" });
      } else {
        this.$router.replace({ name: "apartment-view" });
      }
    },
  },
};
</script>

<template>
  <div>
    <app-header>
      <template #header-breadcrumb>
        <div class="header-navigation d-flex align-items-center">
          <div class="go__back" @click="$router.go(-1)">
            <base-arrow-left :width="32" :height="32"></base-arrow-left>
          </div>
          <div class="breadcrumb__content">
            <div class="d-flex align-items-center">
              <span class="mr-2">{{ $t("objects.title") }}</span>
              <base-arrow-right :width="16" :height="16" />
              <span class="ml-2">{{ apartmentName }}</span>
              <base-arrow-right :width="16" :height="16" />
              <div class="ml-2">
                {{ $t("apartment") }} № {{ apartment.number }}
              </div>
            </div>
            <div class="head color-violet-600">
              {{ $t("apartment") }} № {{ apartment.number }}
            </div>
          </div>
        </div>
      </template>
      <template #header-actions>
        <hide-price-button></hide-price-button>
      </template>
      <template #header-status>
        <div
          class="apartment__status d-flex justify-content-center align-items-center"
          :class="`status-${status}`"
        >
          {{ $t(`apartments.status.${status}`) }}
        </div>
      </template>
    </app-header>

    <!--  HEADER NAVIGATION  -->

    <!--        <div class="header-navigation d-flex justify-content-between align-items-center">-->
    <!--            <div class="d-flex align-items-center">-->
    <!--                <div-->
    <!--                    class="go__back"-->
    <!--                    @click="$router.push(-->
    <!--                    {name:'apartments',-->
    <!--                    params:{object: $route.params.object}})">-->
    <!--                    <base-arrow-left :width="32" :height="32"></base-arrow-left>-->
    <!--                </div>-->
    <!--                <div class="breadcrumb__content">-->
    <!--                    <div class="d-flex align-items-center">-->
    <!--                        <span class="mr-2">{{ $t('objects.title') }}</span>-->
    <!--                        <base-arrow-right :width="16" :height="16"/>-->
    <!--                        <span class="ml-2">{{ apartmentName }}</span>-->
    <!--                        <base-arrow-right :width="16" :height="16"/>-->
    <!--                        <div class="ml-2">-->
    <!--                            {{ $t('apartment') }} № {{ apartment.number }}-->
    <!--                        </div>-->
    <!--                    </div>-->
    <!--                    <div class="head color-violet-600">-->
    <!--                        {{ $t('apartment') }} № {{ apartment.number }}-->
    <!--                    </div>-->
    <!--                </div>-->
    <!--            </div>-->

    <!--            <div>-->
    <!--                <div-->
    <!--                    class="apartment__status d-flex justify-content-center align-items-center"-->
    <!--                    :class="`status-${status}`"-->
    <!--                >-->
    <!--                    {{ $t(`apartments.status.${status}`) }}-->
    <!--                </div>-->
    <!--            </div>-->
    <!--        </div>-->

    <!--  END HEADER NAVIGATION  -->

    <b-tabs
      v-model="tabIndex"
      @activate-tab="tabChange"
      class="custom-tab"
      card
    >
      <template #tabs-start>
        <div class="bottom__line"></div>
      </template>
      <b-tab title="Оформление">
        <!--   PRICE CONTENT     -->
      </b-tab>

      <b-tab v-if="commentsViewPermission" title="Примечания">
        <!--   PRICE CONTENT     -->
      </b-tab>
    </b-tabs>

    <router-view
      :apartment="apartment"
      :app-loading="appLoading"
      :comments-data="commentsData"
      :comment-loading="commentLoading"
      @update-content="updateContent"
      @update-comments="getComments"
    />
  </div>
</template>

<style lang="sass" scoped>


.header-navigation
    margin-right: 4.25rem
    //max-width: 640px
    max-width: 720px


.apartment__status
    font-family: Inter, sans-serif
    background-color: var(--gray-100)
    border-radius: 2rem
    min-width: max-content
    padding: 0.5rem 2rem

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

    &-unavailable
        background-color: var(--gray-500) !important
        color: var(--white) !important


.breadcrumb__content
    display: inline-flex
    flex-direction: column
    margin-left: 1rem
    font-weight: 600
    font-size: 14px
    color: #9CA3AF


.go__back
    width: 56px
    height: 56px
    border-radius: 100%
    background-color: var(--gray-100)
    display: flex
    justify-content: center
    align-items: center
    cursor: pointer


.head
    font-size: 24px
    line-height: 28px
    color: #4B5563


::v-deep .custom-tab
    margin-top: 3rem

    .bottom__line
        display: flex
        height: 8px
        width: 100%
        position: absolute
        bottom: 0
        left: 0
        border-radius: 1rem 1rem 0 0
        background-color: var(--gray-100)

    .card-header
        padding: 0
        background-color: transparent
        margin: 0
        border-bottom: none

    .tab-content
        position: relative
    //padding-top: 12px

    .card-body
        padding: 0

    .card-header-tabs
        margin: 0

    .nav-tabs
        display: flex
        flex-wrap: nowrap
        column-gap: .5rem
        position: relative

        &:after
            //content: ''
            height: 8px
            width: 100%
            position: absolute
            bottom: 0
            left: 0
            border-radius: 1rem 1rem 0 0
            background-color: var(--gray-100)

        .nav-item
            z-index: 2

        .nav-link
            display: flex
            justify-content: center
            align-items: center
            border: none
            font-weight: 600
            font-size: 16px
            line-height: 22px
            padding: 0 .5rem 1.5rem
            color: var(--gray-600)

            &.active
                position: relative
                color: var(--violet-600)

                &:after
                    content: ''
                    height: 8px
                    width: 100%
                    position: absolute
                    bottom: 0
                    left: 0
                    border-radius: 1rem 1rem 0 0
                    background-color: var(--violet-600)
                    z-index: 3
</style>
