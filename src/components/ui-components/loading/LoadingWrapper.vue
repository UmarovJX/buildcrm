<template>
  <div>
    <animation-frame v-show="loading"/>
    <div v-show="!loading">
      <slot name="default"/>
    </div>
  </div>
</template>

<script>
import {makeProp as p} from "@/util/props";
import {PROP_TYPE_BOOLEAN} from "@/constants/props"
import AnimationFrame from "@/components/ui-components/loading/AnimationFrame";

export default {
  name: 'LoadingWrapper',
  components: {
    AnimationFrame
  },
  props: {
    loading: p(PROP_TYPE_BOOLEAN, false)
  }
}
</script>
