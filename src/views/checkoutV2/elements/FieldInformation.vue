<script>
import { makeProp as p } from '@/util/props'
import {
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_NUMBER_STRING,
  PROP_TYPE_OBJECT,
  PROP_TYPE_STRING,
} from '@/constants/props'

import { XIcon } from '@/components/ui-components/material-icons'

export default {
  name: 'FieldInformation',
  components: {
    XIcon,
  },
  props: {
    iconBg: p(PROP_TYPE_STRING, 'var(--violet-100)'),
    iconColor: p(PROP_TYPE_STRING, undefined),
    iconWrapperStyle: p(PROP_TYPE_OBJECT, {}),
    iconName: p(PROP_TYPE_STRING, undefined),
    title: p(PROP_TYPE_NUMBER_STRING, undefined),
    content: p(PROP_TYPE_NUMBER_STRING, undefined),
    bilingual: p(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    iconLeftWrapperElStyle() {
      return {
        backgroundColor: this.iconBg,
        ...this.iconWrapperStyle,
      }
    },
    hasIconLeftSlot() {
      return this.$slots.hasOwnProperty('icon-left')
    },
    hasTitle() {
      return this.$slots.hasOwnProperty('title')
    },
    hasContent() {
      return this.$slots.hasOwnProperty('content')
    },
  },
}
</script>

<template>
  <div class="field-information">
    <span
      class="fdn-icon-left-wrapper"
      :style="iconLeftWrapperElStyle"
    >
      <slot name="icon-left" />
      <template v-if="!hasIconLeftSlot">
        <x-icon
          :name="iconName"
          :style="{ color: iconColor }"
          class="violet-600"
        />
      </template>
    </span>
    <span class="fdn-info-wrapper">
      <span class="fdn-title-wrapper">
        <slot name="title" />
        <template v-if="!hasTitle">
          {{ bilingual ? $t(title) : title }}
        </template>
      </span>
      <span class="fdn-content-wrapper">
        <slot name="content" />
        <template v-if="!hasContent">
          {{ bilingual ? $t(content) : content }}
        </template>
      </span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.field-information {
  display: flex;
  gap: 1rem;
  font-style: normal;
  align-items: center;

  .fdn-icon-left-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.525rem;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: var(--violet-100);
  }

  .fdn-info-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 2px;
  }

  .fdn-title-wrapper {
    font-family: CraftworkSans, serif;
    font-weight: 900;
    font-size: 8px;
    line-height: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--gray-400);
  }

  .fdn-content-wrapper {
    font-family: Inter, sans-serif;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    color: var(--gray-600);
  }
}
</style>
