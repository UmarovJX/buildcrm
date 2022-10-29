<template>
  <div>
    <animation-frame v-show="loading"/>
    <slot name="default" v-if="!loading"/>
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
