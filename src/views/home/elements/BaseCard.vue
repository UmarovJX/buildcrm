<script>
import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import { computed } from "vue";
import { formatToPrice } from "../../../util/reusable";

export default {
  name: "HomeBaseCard",
  components: {
    XIcon,
    XCircularBackground,
  },
  props: {
    icon: {
      type: String,
      default: "location_city",
    },
    title: {
      type: [String, Object],
      default: "Title",
    },
    bottom: {
      type: [String, Number],
      default: "bottom",
    },
    bottomLeft: {
      type: Object,
      default: () => ({
        title: "bottom_left_title",
        value: "bottom_left_value",
      }),
    },
    bottomLeftTooltip: {
      type: Number,
    },
    bottomRightTooltip: {
      type: Number,
    },
    bottomRight: {
      type: Object,
      default: () => ({
        title: "bottom_right_title",
        value: "bottom_right_value",
      }),
    },
    bottomCenter: {
      type: Object,
      default: () => ({
        title: "bottom_center_title",
        value: "bottom_center_value",
      }),
    },
    bottomExtra: {
      type: Object,
      default: () => ({
        title: "bottom_extra_title",
        value: "bottom_extra",
      }),
    },
    bottomExtraTooltip: {
      type: Number,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    bottomFlexColumn: {
      type: Boolean,
      default: false,
    },
    hasIcon: {
      type: Boolean,
      default: true,
    },
  },
  methods: { formatToPrice },
  setup(props) {
    const hasBottomCenter = computed(
      () => props.bottomCenter.title !== "bottom_center_title"
    );

    const id = ~~(Math.random() * 999_999_999);

    return {
      hasBottomCenter,
      id,
    };
  },
};
</script>

<template>
  <b-card no-body class="base__card">
    <b-card-body class="bg-gray-100 base__card__body">
      <b-card-text class="base__card__body__top mb-0">
        <x-circular-background v-if="hasIcon" size="40px" bg-color="white">
          <slot name="icon">
            <x-icon :name="icon" class="violet-400" />
          </slot>
        </x-circular-background>
        <span class="base__card__title">
          <slot name="title">
            {{ title }}
          </slot>
        </span>
      </b-card-text>

      <template v-if="multiple">
        <slot name="bottom">
          <div
            class="base__card__bottom"
            :class="{ bottom__flex__column: bottomFlexColumn }"
          >
            <b-card-text class="mb-0">
              <slot name="bottom-left">
                <span v-if="bottomLeft.title" class="base__card__bottom__title">
                  <slot name="bottom-left-title">
                    <span v-if="bottomLeft.title">
                      {{ bottomLeft.title }}:
                    </span>
                  </slot>
                </span>
                <span class="base__card__bottom__value">
                  <slot name="bottom-left-value">
                    <span v-if="bottomLeft.value" :id="'left' + id">
                      {{ bottomLeft.value }}
                    </span>
                    <b-tooltip
                      v-if="bottomLeftTooltip"
                      :target="'left' + id"
                      triggers="hover"
                      variant="secondary"
                    >
                      {{ formatToPrice(bottomLeftTooltip) }}
                    </b-tooltip>
                  </slot>
                </span>
              </slot>
            </b-card-text>

            <b-card-text
              v-if="bottomExtra.value !== 'bottom_extra'"
              class="mb-0"
            >
              <slot name="bottom-left">
                <span
                  v-if="bottomExtra.title"
                  class="base__card__bottom__title"
                >
                  <slot name="bottom-left-title">
                    <span v-if="bottomExtra.title">
                      {{ bottomExtra.title }}:
                    </span>
                  </slot>
                </span>
                <span class="base__card__bottom__value">
                  <slot name="bottom-left-value">
                    <span v-if="bottomExtra.value" :id="'extra' + id">
                      {{ bottomExtra.value }}
                    </span>
                    <b-tooltip
                      v-if="bottomExtraTooltip"
                      :target="'extra' + id"
                      triggers="hover"
                      variant="secondary"
                    >
                      {{ formatToPrice(bottomExtraTooltip) }}
                    </b-tooltip>
                  </slot>
                </span>
              </slot>
            </b-card-text>

            <b-card-text v-if="hasBottomCenter" class="mb-0">
              <slot name="bottom-center">
                <span class="base__card__bottom__title">
                  <slot name="bottom-left-title">
                    <span v-if="bottomCenter.title">
                      {{ bottomCenter.title }}:
                    </span>
                  </slot>
                </span>
                <span class="base__card__bottom__value">
                  <slot name="bottom-left-value">
                    <span v-if="bottomCenter.value">
                      {{ bottomCenter.value }} {{ bottomRightTooltip }}
                    </span>
                  </slot>
                </span>
              </slot>
            </b-card-text>

            <b-card-text class="mb-0">
              <slot name="bottom-right">
                <span class="base__card__bottom__title">
                  <slot name="bottom-right-title">
                    <span v-if="bottomRight.title"
                      >{{ bottomRight.title }}:</span
                    >
                  </slot>
                </span>
                <span class="base__card__bottom__value active__value">
                  <slot name="bottom-right-value">
                    <span v-if="bottomRight.value" :id="'bottom' + id">
                      {{ bottomRight.value }}
                    </span>
                    <b-tooltip
                      v-if="bottomRightTooltip"
                      :target="'bottom' + id"
                      triggers="hover"
                      variant="secondary"
                    >
                      {{ formatToPrice(bottomRightTooltip) }}
                    </b-tooltip>
                  </slot>
                </span>
              </slot>
            </b-card-text>
          </div>
        </slot>
      </template>

      <b-card-text v-else class="">
        <span class="base__card__bottom">
          <span class="base__card__bottom__primary__value">
            <slot name="bottom">
              {{ bottom }}
            </slot>
          </span>
        </span>
      </b-card-text>
    </b-card-body>
  </b-card>
</template>

<style lang="scss" scoped>
.base__card {
  border: none;
  font-style: normal;
  font-family: Inter, sans-serif;
  max-width: 20rem;
  min-width: 10rem;

  &__body {
    border: 2px solid var(--gray-200);
    border-radius: 2rem;
    padding: 1.5rem;
  }

  &__body__top {
    display: flex;
    align-items: center;
    column-gap: 0.75rem;
  }

  &__title {
    color: var(--gray-600);
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.25rem;

    &.bottom__flex__column {
      flex-direction: column;
    }

    &__title {
      color: var(--gray-400);
      font-weight: 600;
      line-height: 22px;
    }

    &__value {
      color: var(--gray-600);
      font-weight: 700;
      line-height: 28px;
    }

    &__primary__value {
      color: var(--violet-600);
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 28px;
    }
  }
}

.active__value {
  color: var(--violet-600);
  font-weight: 700;
  line-height: 28px;
}
</style>
