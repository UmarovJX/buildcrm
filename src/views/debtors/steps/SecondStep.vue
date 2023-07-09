<script>
// import BaseInput from "@/components/Reusable/BaseInput";
// import XFormSelect from "@/components/ui-components/form-select/FormSelect";
import api from "@/services/api";
import { mapGetters, mapMutations } from "vuex";
import "vue-select/dist/vue-select.css";
import FoundContracts from "@/views/debtors/elements/FoundContracts.vue";
import NotFoundContracts from "@/views/debtors/elements/NotFoundContracts.vue";
export default {
  name: "SecondStep",
  components: {
    // BaseInput,
    // XFormSelect,
    FoundContracts,
    NotFoundContracts,
  },
  emits: ["validate"],
  data() {
    return {
      foundItems: [],
      notFoundItems: [],
      foundFields: [
        {
          key: "key",
          label: "debtors.contract_system",
          thClass: "theadKey",
          tdClass: "tbodyKey",
        },
        {
          key: "value",
          label: "debtors.alias_system",
          thClass: "theadValue",
          tdClass: "tbodyValue",
        },
      ],
      notFoundFields: [
        {
          key: "key",
          label: "debtors.contract_file",
          thClass: "theadKey",
          tdClass: "tbodyKey",
        },
        // {
        //   key: "value",
        //   label: "debtors.contract_system",
        //   thClass: "theadValue",
        //   tdClass: "tbodyValue",
        // },
      ],
      options: [],
      tabIndex: 0,
      openListId: null,
      selected: null,
      listForCreate: [],
      allList: [],
    };
  },
  computed: {
    ...mapGetters([
      "getDebtorsSheets",
      "getNotFoundContracts",
      "getFoundContracts",
    ]),
    debtorsSheet() {
      if (this.getDebtorsSheets.rows) {
        return this.getDebtorsSheets.rows.slice(1);
      }
      return [];
    },
  },
  methods: {
    ...mapMutations(["updateNotFoundOption", "updateNotFoundAlias"]),
    selectOptionSystem(itemKey, option) {
      this.notFoundItems.forEach((item, index) => {
        if (item.key === itemKey) {
          this.notFoundItems[index] = {
            key: item.key,
            option: [],
            value: {
              alias: item.key,
              uuid: option.uuid,
              contract: option.contract,
            },
          };
        }
      });
      this.openListId = null;
    },
    getContractNumbers() {
      const contractFieldName = this.foundItems[0].type;
      let contractsList = [];
      if (this.debtorsSheet.length) {
        this.debtorsSheet.rows.map((item) => {
          for (const [key, value] of Object.entries(item)) {
            if (key === contractFieldName) {
              contractsList = [...contractsList, value];
            }
          }
        });
      }
      return contractsList;
    },
    async validateSecondStep() {
      await this.$emit("validate");
    },
    iTranslate(text) {
      return this.$t(`${text}`);
    },
  },
};
</script>

<template>
  <div>
    <ValidationObserver ref="contract-validation" class="main__row">
      <b-tabs v-model="tabIndex" card class="custom-tab">
        <template #tabs-start>
          <div class="bottom__line"></div>
        </template>

        <b-tab>
          <template #title>
            <div class="custom-title">
              {{ $t("found") }}
              <span>{{ getFoundContracts.length }}</span>
            </div>
          </template>

          <found-contracts :items="getFoundContracts" />
        </b-tab>

        <b-tab>
          <template #title>
            <div class="custom-title">
              {{ $t("not_found") }}
              <span>{{ getNotFoundContracts.length }}</span>
            </div>
          </template>

          <not-found-contracts
            :items="getNotFoundContracts"
            @update-alias="updateNotFoundAlias"
            @update-option="updateNotFoundOption"
          />
        </b-tab>
      </b-tabs>
    </ValidationObserver>
  </div>
</template>

<style lang="sass" scoped>

.error__provider
    color: red
    font-size: 12px


::v-deep
    .vs__selected
        margin: 0
        padding: 0

    .vs__dropdown-menu
        background-color: var(--gray-100) !important
        border: 1px solid #E5E7EB
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.08)
        width: 100%
        border-radius: 24px
        padding: .5rem


    .vs__dropdown-option--selected,
    .vs__dropdown-option--highlight
        background-color: var(--violet-100)
        color: var(--violet-600) !important

    .vs__dropdown-option
        padding: 1rem
        border-radius: 1rem
        color: var(--gray-600)

        &:active
            background-color: var(--violet-100)
            color: var(--violet-600)

        &:hover
            background-color: var(--violet-100)
            color: var(--violet-600)

    .vs__dropdown-toggle
        height: 3.5rem
        padding: 13px 20px 13px 1.25rem
        border: 0.25rem solid transparent
        border-radius: 2rem
        background-color: var(--gray-100)


.select-list
    position: absolute
    display: flex
    flex-direction: column
    align-items: center
    height: 500px
    background-color: #fff
    overflow-y: auto
    z-index: 3


    &__item
        display: flex
        padding: 4px 8px
        height: 40px


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
        position: relative
        padding: 0
        background-color: transparent
        margin: 0
        border-bottom: none
        margin-bottom: 2rem


    .tab-content
        position: relative
    //padding-top: 12px

    .card-body
        padding: 0

    .card-header-tabs
        margin: 0

    .custom-title
        display: flex
        align-items: center
        justify-content: center
        column-gap: .5rem
        font-weight: 600
        font-size: 16px
        line-height: 22px
        color: var(--gray-600)

        span
            display: flex
            justify-content: center
            align-items: center
            height: 30px
            padding: .25rem .5rem
            border-radius: 2rem
            background-color: var(--gray-100)
            color: var(--gray-400)

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
            background-color: var(--gray-100)

        .nav-item
            z-index: 2

            .active
                .custom-title
                    color: var(--violet-600)

                    span
                        background-color: var(--violet-100)
                        color: var(--violet-600)


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
