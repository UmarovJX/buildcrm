<template>
  <span class="k-chip-input">
    <span class="k-chip-input-value">{{ output }}</span>
    <span @click="removeChipItem" class="k-chip-input-remove">
      <base-times-icon class="base-times-icon" :length="12" fill="#fff"/>
    </span>
  </span>
</template>

<script>
import {makeProp as p} from "@/util/props";
import {PROP_TYPE_NUMBER_STRING, PROP_TYPE_OBJECT_NUMBER_STRING_BOOLEAN} from "@/constants/props"
import BaseTimesIcon from "@/components/icons/BaseTimesIcon";
import {isObject} from "@/util/inspect";

export default {
  name: "ChipInput",
  components: {
    BaseTimesIcon
  },
  emits: ['remove'],
  props: {
    chip: p(PROP_TYPE_OBJECT_NUMBER_STRING_BOOLEAN, '_chip'),
    valueField: p(PROP_TYPE_NUMBER_STRING, 'value'),
    textField: p(PROP_TYPE_NUMBER_STRING, 'text')
  },
  computed: {
    output() {
      if (isObject(this.chip)) {
        return this.chip[this.textField]
      }
      return this.chip
    }
  },
  methods: {
    removeChipItem() {
      this.$emit('remove', this.chip)
    }
  }
}
</script>

<style lang="scss" src="./chip-input.scss" scoped/>
