<script>
import { computed, getCurrentInstance } from "vue";
import BaseCard from "@/views/home/elements/BaseCard.vue";
import { formatToPrice } from "@/util/reusable";
import useWidgets from "@/views/home/useWidgets";

export default {
  name: "HomeInitialPaymentReports",
  components: {
    BaseCard,
  },
  props: {
    busy: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const { shortSum } = useWidgets();
    const iconCollection = {
      today: "today",
      this_week: "view_week",
      last_week: "early_on",
      this_month: "calendar_month",
      last_month: "event_upcoming",
    };

    const vm = getCurrentInstance().proxy;

    function showPlan(type) {
      return ["this_month", "last_month"].includes(type);
    }

    function showPrepaid(type) {
      return ["this_month", "last_month"].includes(type);
    }

    const emptyProp = {
      title: "",
      value: "",
    };

    const reportItems = computed(() =>
      props.items.map(({ type, plan, amount, prepaid }) => {
        const left = showPlan(type)
          ? {
              title: vm.$t("plan.title"),
              value: `${shortSum(plan.amount)} (${formatToPrice(
                plan.percentage,
                2
              )}%)`,
            }
          : emptyProp;

        const leftTooltip = plan?.amount;

        const center = showPrepaid(type)
          ? {
              title: vm.$t("statistics.prepaid"),
              value: `${formatToPrice(prepaid)}`,
            }
          : emptyProp;

        const right = {
          title: "",
          value: `${shortSum(amount)}`,
        };

        return {
          type,
          title: vm.$t(`common.${type}`),
          left,
          center,
          rightTooltip: amount,

          right,
          leftTooltip,
          icon: iconCollection[type],
        };
      })
    );

    return {
      reportItems,
    };
  },
};
</script>

<template>
  <div>
    <div class="d-flex justify-content-between">
      <h3 class="gray-600 font-craftworksans">
        {{ $t("statistics.debtor_reports_title") }}
        <b-spinner v-if="busy" class="loading__spinner" small />
      </h3>
    </div>

    <div class="section__wrapper">
      <base-card
        v-for="(reportItem, index) in reportItems"
        :key="index"
        bottom-flex-column
        :icon="reportItem.icon"
        :bottom-left="reportItem.left"
        :bottom-right="reportItem.right"
        :bottom-center="reportItem.center"
        :bottom-right-tooltip="reportItem.rightTooltip"
        :bottom-left-tooltip="reportItem.leftTooltip"
        class="w-100"
      >
        <template #title>
          <span class="font-weight-bold">{{ reportItem.title }}</span>
        </template>
      </base-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section__wrapper {
  display: flex;
  //flex-wrap: wrap;
  gap: 2rem 1rem;
  //min-height: 250px;
  margin-top: 1rem;
  //border-bottom: 6px solid var(--gray-100);
}

.loading__spinner {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--violet-600);
}
</style>
