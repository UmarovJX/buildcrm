<script>
import BaseSearchInput from "@/components/Reusable/BaseSearchInput";
import BaseFilterButton from "@/components/Elements/BaseFilterButton";
import BaseRightModal from "@/components/Reusable/BaseRightModal";
import BootstrapSelect from "@/components/Elements/Selects/BootstrapSelect";
import { sortObjectValues } from "@/util/reusable";
import api from "@/services/api";

export default {
  name: "FilterContent",
  components: {
    BaseSearchInput,
    BaseFilterButton,
    BaseRightModal,
    BootstrapSelect,
  },
  computed: {
    typesOptions() {
      return this.filterFields.types.map((type) =>
        this.$t("contracts.activity_log.actions." + type)
      );
    },
    actionsTypes() {
      return this.filterFields.actions.map((type) =>
        this.$t("contracts.activity_log." + type)
      );
    },
    usersOptions() {
      return this.filterFields.users.map(
        (user) => `${user.first_name} ${user.last_name}`
      );
    },
  },
  emits: ["reset-filter-fields", "sort-by-search", "sort-items"],
  data() {
    return {
      filter: {
        action: null,
        type: null,
        user: null,
      },
      filterFields: null,
      filterItemsValues: {
        types: {
          deleted: "Удаление",
          reissue: "Переоформление",
          created: "Создание",
          updated: "Редактирование",
        },
        actions: {
          reissue: "в переоформление",
          comments: "в комментарие",
          payments_histories: "в историе оплаты",
          orders: "в договоре",
        },
      },
    };
  },
  created() {
    this.fetchFilterFieldsLog();
  },
  methods: {
    replaceRouter() {
      const sortQuery = sortObjectValues(this.filter);
      this.$router.replace({ query: sortQuery });
    },
    async fetchFilterFieldsLog() {
      const { id } = this.$route.params;
      await api.contractV2
        .fetchActivityLogFilterFields(id)
        .then((response) => {
          this.filterFields = response.data;
        })
        .catch((err) => {
          this.toastedWithErrorCode(err);
        })
        .finally(() => {
          this.finishLoading = true;
        });
    },
    openFilterContent() {
      this.$refs["filter-modal"].show();
    },
    filterItems() {
      this.replaceRouter();
      this.$emit("sort-items", this.filter);
    },
    resetFilterFields() {
      this.filter.type = null;
      this.filter.action = null;
      this.filter.user = null;
      this.query = this.filter;
      this.$emit("reset-filter-fields");
    },
    filterBySearchContent(searchingValue) {
      this.$emit("sort-by-search", searchingValue);
    },
  },
};
</script>

<template>
  <div>
    <div
      class="d-flex align-items-center justify-content-between flex-wrap"
      style="row-gap: 0.5rem"
    >
      <base-search-input
        class="base-search-input mr-2"
        :placeholder="`${$t('activity_type_full_name')}`"
        @trigger-input="filterBySearchContent"
      />
      <div class="d-flex align-items-center">
        <base-filter-button
          class="mr-2 base-filter-button"
          @click="openFilterContent"
        />
      </div>
    </div>

    <!--  FILTER MODAL  -->
    <base-right-modal
      ref="filter-modal"
      @reset-fields="resetFilterFields"
      @start-filtering="filterItems"
    >
      <div class="filter-modal-content">
        <bootstrap-select
          :class="{ 'client-type-selection': !filterFields.actions }"
          :options="actionsTypes"
          :default-value="
            $t('contracts.activity_log.' + filterFields.actions[0])
          "
          @select="
            (newValue) =>
              (this.filter.action = Object.entries(
                this.filterItemsValues.actions
              ).filter((item) => item[1] === newValue)[0][0])
          "
        />
        <bootstrap-select
          :class="{ 'client-type-selection': !filterFields.types }"
          :options="typesOptions"
          :default-value="
            $t('contracts.activity_log.actions.' + filterFields.types[0])
          "
          @select="
            (newValue) =>
              (this.filter.type = Object.entries(
                this.filterItemsValues.types
              ).filter((item) => item[1] === newValue)[0][0])
          "
        />
        <bootstrap-select
          v-if="
            filterFields.users[0] &&
            filterFields.users[0].first_name &&
            filterFields.users[0].last_name
          "
          :class="{ 'client-type-selection': !filterFields.users }"
          :options="usersOptions"
          :default-value="
            filterFields.users[0].first_name +
            ' ' +
            filterFields.users[0].last_name
          "
          @select="
            (newValue) =>
              (this.filter.users = this.filterFields.users.filter(
                (user) => user.first_name + ' ' + user.last_name === newValue
              )[0].id)
          "
        />
      </div>
    </base-right-modal>
  </div>
</template>

<style lang="scss" scoped>
.base-select {
  max-width: 16rem;
}

.base-search-input {
  width: 60%;
  max-width: 85rem;
  min-width: 32rem;
  row-gap: 0.5rem;
}

.filter-modal-content {
  padding-top: 2rem;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.client-type {
  max-width: 15rem;
  width: auto;
}

.client-type-selection {
  color: var(--gray-400) !important;
}
</style>
