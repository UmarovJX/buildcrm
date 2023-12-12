<script>
import {XCircularBackground} from "@/components/ui-components/circular-background";
import {XIcon} from "@/components/ui-components/material-icons";
import {XSquareBackground} from "@/components/ui-components/square-background";

export default {
  name: "CurrencyChart",
  components: {
    XSquareBackground,
    XIcon,
    XCircularBackground
  },
  props: {
    context: {
      type: Object,
      required: true,
    },
  },
  computed: {
    firstChartLineClass() {
      return {
        first__chart: this.context.index === 0,
      };
    },
  },
};
</script>

<template>
  <div class="currency__chart">
    <span class="title">{{ context.title }}</span>
    <span class="price">
      <span>{{ context.price }}</span>
      <span v-if="!context.reissue.show">
        {{ $t("payments.course_name") }}
      </span>
    </span>
    <span class="d-flex" v-if="context.index < 1 && context.reissue.show">
      <span>
         +{{ context.reissue.price }} {{ $t("payments.course_name") }}
      </span>
      <x-square-background
          :id="`reissue_${context.index}`"
          class="bg-violet-100 cursor-pointer ml-2"
          padding="0.2"
      >
        <x-icon
            name="help"
            color="var(--violet-600)"
            size="20"
        />
      </x-square-background>
      <b-tooltip :target="`reissue_${context.index}`">
        {{ $t('reissue.for_reissue_fees') }}
      </b-tooltip>
    </span>


    <span class="bottom__info">{{ context.bottom }}</span>
    <span class="chart__list" :class="firstChartLineClass">
      <span class="d-flex align-items-center">
        <b-progress
            class="progress"
            :value="context.progress"
            :max="100"
        ></b-progress>
        <span class="percent__value" v-show="context.index > 0">
          {{ context.progress }} %
        </span>
      </span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.title {
  font-family: CraftworkSans, serif;
  font-size: 1.25rem;
  font-weight: 900;
  line-height: 14px;
  color: var(--violet-600);
  display: block;
  margin-bottom: 1rem;
  letter-spacing: 1px;
}

.price {
  font-size: 1.5rem;
  line-height: 28px;
  //margin-bottom: 0.5rem;
  display: block;
  color: var(--gray-600);
}

.bottom__info {
  display: block;
  color: var(--gray-400);
  margin-top: 4px;
}

.chart__list {
  display: block;
  margin-top: 1rem;

  & > span {
    height: 22px;
  }

  .progress {
    width: 75%;
    height: 6px;
    border-radius: 1rem;
    background-color: var(--gray-200);
  }

  ::v-deep .progress-bar {
    border-radius: 1rem;
    background: linear-gradient(88.25deg, #7c3aed 0%, #818cf8 100%) !important;
  }

  .percent__value {
    display: block;
    margin-left: 8px;
    color: var(--gray-600);
    font-size: 1rem;
    line-height: 22px;
  }
}

.first__chart {
  .progress {
    width: 100%;
    height: 6px;
    border-radius: 1rem;
    background-color: var(--gray-200);
  }
}

@media screen and (max-width: 1300px) {
  .title {
    font-size: 1rem;
  }

  .price {
    font-size: 1.25rem;
  }

  .bottom__info {
    font-size: 0.8rem;
  }
}
</style>
