<template>
  <div class="app-tab-title d-flex align-items-center">
    <span :class="flexCenter" class="app-tab-title-number">{{ step }}</span>
    <p v-if="notHaveSlot" class="app-tab-title-content">{{ content }}</p>
    <!--  ?WHEN WANTED TO USE CUSTOM CONTENT  -->
    <slot name="default"/>
    <!--  ?BASE RIGHT ICON  -->
    <span v-if="showRightIcon" :class="flexCenter" class="app-tab-title-right-icon">
      <x-icon name="chevron_right" class="gray-400"/>
    </span>
  </div>
</template>

<script>
import {XIcon} from "@/components/ui-components/material-icons";
import {makeProp as p} from "@/util/props";
import {PROP_TYPE_BOOLEAN, PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING} from "@/constants/props";

export default {
  name: "TabTitle",
  components: {
    XIcon
  },
  props: {
    step: p(PROP_TYPE_NUMBER_STRING, 1),
    content: p(PROP_TYPE_STRING, ''),
    showRightIcon: p(PROP_TYPE_BOOLEAN, true)
  },
  data() {
    return {
      flexCenter: 'd-flex justify-content-center align-items-center'
    }
  },
  computed: {
    notHaveSlot() {
      return !this.$slots.hasOwnProperty('default')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-tab-title {
  display: flex;
  justify-content: center;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;


  &-number {
    width: 2rem;
    height: 2rem;
    font-size: 14px;
    line-height: 20px;
    border-radius: 50%;
    margin-right: .5rem;
    color: var(--gray-400);
    background-color: var(--gray-100);
  }

  &-content {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 0;
    color: var(--gray-400);
  }


  &-right-icon {
    display: flex;
    align-items: center;
    margin-left: 12px;
  }
}
</style>