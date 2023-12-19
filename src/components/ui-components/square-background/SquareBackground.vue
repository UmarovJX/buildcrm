<script>
import { makeProp as p } from '@/util/props'
import { PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from '@/constants/props'

export default {
  name: 'SquareBackground',
  emits: ['click'],
  props: {
    padding: p(PROP_TYPE_NUMBER_STRING, 'auto'),
    unit: p(PROP_TYPE_STRING, 'rem'),
    bgColor: p(PROP_TYPE_STRING, undefined),
  },
  computed: {
    squareBgStyle() {
      return {
        padding: `${this.padding}${this.unit}`,
        backgroundColor: this.bgColor,
      }
    },
  },
}
</script>

<template>
  <div
    class="square-wrapper"
    :style="squareBgStyle"
    @click="$emit('click', $event)"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.square-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  padding: 24px;
}
</style>
