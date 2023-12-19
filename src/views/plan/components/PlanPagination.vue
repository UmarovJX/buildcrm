<script>
import { computed, onMounted, ref } from 'vue'
import { XFormSelect } from '@/components/ui-components/form-select'
import BaseArrowLeftIcon from '@/components/icons/BaseArrowLeftIcon.vue'
import BaseArrowRightIcon from '@/components/icons/BaseArrowRightIcon.vue'

export default {
  name: 'PlanPagination',
  components: {
    XFormSelect,
    BaseArrowRightIcon,
    BaseArrowLeftIcon,
  },
  props: {
    total: {
      type: Number,
      default: 0,
    },
    current: {
      type: Number,
      default: 1,
    },
    perPage: {
      type: Number,
      default: 20,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const perPageOptions = ref([])

    const perPageInner = computed({
      get() {
        return props.perPage
      },
      set(perPage) {
        change({ perPage })
      },
    })

    function setPerPageOptions() {
      for (let number = 10; number <= 50; number += 10) {
        perPageOptions.value.push({
          value: number,
          text: number,
        })
      }
    }

    function changePage(page) {
      change({ page })
    }

    function change({ page = props.current, perPage = props.perPage }) {
      const isPageDiffs = props.current !== page
      const isPerPageDiffs = props.perPage !== perPage
      if (isPageDiffs || isPerPageDiffs) {
        if (isPerPageDiffs) {
          page = 1
        }

        emit('change', {
          page: page ?? props.current,
          perPage: perPage ?? props.perPage,
        })
      }
    }

    onMounted(() => {
      setPerPageOptions()
    })

    return {
      perPageInner,
      perPageOptions,
      changePage,
    }
  },
}
</script>

<template>
  <div>
    <div class="pagination__vue">
      <vue-paginate
        :page-count="total"
        :value="current"
        :container-class="'container'"
        :page-class="'page-item'"
        :page-link-class="'page-link'"
        :next-class="'page-item'"
        :prev-class="'page-item'"
        :prev-link-class="'page-link'"
        :next-link-class="'page-link'"
        @change-page="changePage"
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
          v-model="perPageInner"
          :label="false"
          :options="perPageOptions"
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
</template>

<style lang="scss" scoped>
@import "@/assets/scss/utils/pagination";
</style>
