<script>
import { makeProp as p } from '@/util/props'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '@/constants/props'

export default {
  name: 'SectionTitle',
  props: {
    title: p(PROP_TYPE_STRING, ''),
    bilingual: p(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    notHaveSlot() {
      return !this.$slots.hasOwnProperty('default')
    },
  },
}
</script>

<template>
  <h3 class="section-title gray-400">
    <slot name="default" />
    <template v-if="notHaveSlot">
      {{ bilingual ? $t(title) : title }}
    </template>
  </h3>
</template>

<style lang="scss" scoped>
.section-title {
  font-family: CraftworkSans, serif;
  font-style: normal;
  font-size: 24px;
  line-height: 28px;
  margin: 0;
  padding: 0;
}
</style>
