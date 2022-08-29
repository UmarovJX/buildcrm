<template>
  <div>
    <div
        class="d-flex align-items-center justify-content-between flex-wrap"
        style="row-gap: 0.5rem"
    >
      <base-button
          v-if="showTodayButtonLink"
          :text="`${ $t('today') }`"
          @click="showTodayEvent"
      />
      <base-search-input
          v-if="showSearchContent"
          class="base-search-input mr-2"
          :placeholder="`${ $t('activity_type_full_name') }`"
          @trigger-input="filterBySearchContent"
      />
      <div class="d-flex align-items-center">
        <base-filter-button
            class="mr-2 base-filter-button"
            @click="openFilterContent"
        />
        <bootstrap-select
            ref="client-type-select"
            class="client-type"
            :default-value="defaultTypeOfView"
            :options="viewTypes"
            @select="changeTypeOfView"
        />
      </div>
    </div>

    <!--  FILTER MODAL  -->
    <base-right-modal
        ref="filter-modal"
        @reset-fields="resetFilterFields"
        @start-filtering="filterItems"
        @show="setFilterProperties"
    >
      <div class="filter-modal-content">
        <bootstrap-select
            :class="{ 'client-type-selection' : !filter.client_type }"
            :options="clientTypes"
            :default-value="filter.client_type"
            @select="(newValue) => filter.client_type = newValue"
        />
        <bootstrap-select
            :class="{ 'client-type-selection' : !filter.executor }"
            :options="executor"
            :default-value="filter.executor"
            @select="(newValue) => filter.executor = newValue"
        />
        <base-date-picker
            ref="filter-date-picker"
            v-show="showDatePicker"
            icon-fill="#7C3AED"
            :default-value="filter.date"
            :placeholder="`${ $t('date') }`"
            @input="filter.date = $event"
            class="mb-4"
        />
      </div>
    </base-right-modal>
  </div>
</template>

<script>
import BaseSearchInput from "@/components/Reusable/BaseSearchInput";
import BaseFilterButton from "@/components/Elements/BaseFilterButton";
import BaseRightModal from "@/components/Reusable/BaseRightModal";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import BootstrapSelect from "@/components/Elements/Selects/BootstrapSelect";
import BaseButton from "@/components/Reusable/BaseButton";
import api from "@/services/api";

export default {
  name: "FilterContent",
  components: {
    BaseSearchInput,
    BaseFilterButton,
    BaseRightModal,
    BaseDatePicker,
    BootstrapSelect,
    BaseButton,
  },
  props: {
    defaultTypeOfView: {
      type: String,
      default: 'list'
    },
    query: {
      type: Object,
      default: () => ({
        date: null,
        price_from: null,
        price_to: null,
        client_type: null
      })
    }
  },
  emits: [
    'reset-filter-fields',
    'change-view-type',
    'sort-by-search',
    'change-date',
    'sort-items',
    'go-to-today'
  ],
  data() {
    return {
      filter: {
        date: null,
        client_type: null,
        object_id: null
      },
      typeOfView: null,
      objectOptions: [],
    }
  },
  computed: {
    clientTypes() {
      return [
        {
          value: null,
          text: this.$t('contracts.activity_log.activity_type')
        },
        {
          value: 'created',
          text: this.$t('contracts.activity_log.actions.created')
        },
        {
          value: 'reissue',
          text: this.$t('contracts.activity_log.actions.reissue')
        },
        {
          value: 'deleted',
          text: this.$t('contracts.activity_log.actions.deleted')
        },
        {
          value: 'edited',
          text: this.$t('contracts.activity_log.actions.edited')
        },
      ]
    },
    executor() {
      return [
        {
          value: null,
          text: this.$t('roles.executor')
        },
        {
          value: 'admin',
          text: this.$t('roles.admin')
        },
        {
          value: 'manager',
          text: this.$t('roles.manager')
        },
        {
          value: 'security_manager',
          text: this.$t('roles.security_manager')
        },
        {
          value: 'sales_department',
          text: this.$t('roles.sales_department')
        },
        {
          value: 'accountant',
          text: this.$t('roles.accountant')
        }
      ]
    },
    showTodayButtonLink() {
      const allowedToShow = ['month', 'week', 'day']
      return allowedToShow.includes(this.typeOfView)
    },
    showSearchContent() {
      return this.typeOfView === 'list'
    },
    showCalendarNavigation() {
      return !this.showSearchContent
    },
    showDatePicker() {
      return this.typeOfView === 'list'
    },
    viewTypes() {
      return [
        {
          id: 0,
          value: 'list',
          text: this.$t('list'),
        },
        {
          id: 1,
          value: 'month',
          text: this.$t('month'),
        },
        {
          id: 2,
          value: 'week',
          text: this.$t('week')
        },
        {
          id: 3,
          value: 'day',
          text: this.$t('day')
        }
      ]
    },
  },
  created() {
    this.initTypeOfView()
    this.fetchObjectsOption()
  },
  methods: {
    inputFilterObject(selectOption) {
      if (selectOption.length) {
        this.filter.object_id = selectOption.map(option => parseInt(option.value))
      }
    },
    async fetchObjectsOption() {
      await api.contractV2.fetchObjectsOption()
          .then((response) => {
            const {objects} = response.data
            this.objectOptions = objects.map(({id, name}) => ({value: id, text: name}))
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
    },
    initTypeOfView() {
      this.typeOfView = this.defaultTypeOfView
    },
    openFilterContent() {
      this.$refs['filter-modal'].show()
    },
    changeTypeOfView(type) {
      this.typeOfView = type
      this.$emit('change-view-type', type)
    },
    showTodayEvent() {
      this.$refs['calendar-navigation'].setMomentToCurrent()
      this.$emit('go-to-today')
    },
    changeCalendarDate(currentDate) {
      this.$emit('change-date', currentDate)
    },
    filterItems() {
      this.$emit('sort-items', this.filter)
    },
    resetFilterFields() {
      this.filter.client_type = null
      this.filter.executor = null
      this.filter.object_id = null
      if (this.typeOfView === 'list') {
        this.filter.date = null
      }
      this.$emit('reset-filter-fields')
    },
    setFilterProperties() {
      this.filter.date = this.query.date
      this.filter.client_type = this.query.client_type
      if (this.query.object_id) {
        if (typeof this.query.object_id === 'string') {
          this.filter.object_id = [parseInt(this.query.object_id)]
        } else {
          this.filter.object_id = this.query.object_id.map(objectId => parseInt(objectId))
        }
      }
    },
    filterBySearchContent(searchingValue) {
      this.$emit('sort-by-search', searchingValue)
    },
    setViewType(viewType) {
      this.typeOfView = viewType
      this.$refs['client-type-select'].setValue(viewType)
    },
    setCalendarDate(moment) {
      this.$refs['calendar-navigation'].setCalendarMoment(moment)
    }
  }
}
</script>

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