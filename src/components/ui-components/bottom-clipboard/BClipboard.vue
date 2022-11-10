<template>
  <div :class="show ? 'bottom-clipboard' : 'd-none'">
    <slot/>
  </div>
</template>

<script>
import {makeProp} from "@/util/props";
import {PROP_TYPE_BOOLEAN} from "@/constants/props";

export default {
  name: "BottomClipboard",
  props: {
    show: makeProp(PROP_TYPE_BOOLEAN, true),
  }
}
</script>

<style lang="scss" src="./bottom-clipboard.scss" scoped/>
