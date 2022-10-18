<template>
  <span class="material-symbols-rounded">
    <slot name="default"/>
    <template v-if="notHaveSlot">
      {{ name }}
    </template>
  </span>
</template>

<script>
import {makeProp as p} from "@/util/props";
import {PROP_TYPE_STRING} from "@/constants/props"

export default {
  name: "IconsGetter",
  props: {
    name: p(PROP_TYPE_STRING)
  },
  computed: {
    notHaveSlot() {
      return !this.$slots.hasOwnProperty('default')
    }
  }
}
</script>

