<script>
import { XIcon } from '@/components/ui-components/material-icons'
import { XCircularBackground } from '@/components/ui-components/circular-background'

export default {
  name: 'HomeBaseCard',
  components: {
    XIcon,
    XCircularBackground,
  },
  props: {
    icon: {
      type: String,
      default: 'location_city',
    },
    title: {
      type: [String, Object],
      default: 'Title',
    },
    bottom: {
      type: [String, Number],
      default: 'bottom',
    },
    bottomLeft: {
      type: Object,
      default: () => ({
        title: 'bottom_left_title',
        value: 'bottom_left_value',
      }),
    },
    bottomRight: {
      type: Object,
      default: () => ({
        title: 'bottom_right_title',
        value: 'bottom_right_value',
      }),
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<template>
  <b-card
    no-body
    class="base__card"
  >
    <b-card-body class="bg-gray-100 base__card__body">
      <b-card-text class="base__card__body__top">
        <x-circular-background
          size="40px"
          bg-color="white"
        >
          <slot name="icon">
            <x-icon
              :name="icon"
              class="violet-400"
            />
          </slot>
        </x-circular-background>
        <span class="base__card__title">
          <slot name="title">
            {{ title }}
          </slot>
        </span>
      </b-card-text>

      <template v-if="multiple">
        <div class="base__card__bottom">
          <b-card-text class="">
            <slot name="bottom-left">
              <span class="base__card__bottom__title">
                <slot name="bottom-left-title">
                  {{ bottomLeft.title }}:
                </slot>
              </span>
              <span class="base__card__bottom__value">
                <slot name="bottom-left-value">
                  {{ bottomLeft.value }}
                </slot>
              </span>
            </slot>
          </b-card-text>

          <b-card-text>
            <slot name="bottom-right">
              <span class="base__card__bottom__title">
                <slot name="bottom-right-title">
                  {{ bottomRight.title }}:
                </slot>
              </span>
              <span class="base__card__bottom__value active__value">
                <slot name="bottom-right-value">
                  {{ bottomRight.value }}
                </slot>
              </span>
            </slot>
          </b-card-text>
        </div>
      </template>

      <b-card-text
        v-else
        class=""
      >
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
