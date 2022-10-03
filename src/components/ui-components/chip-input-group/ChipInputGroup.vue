<template>
  <div class="k-chip-input-group">
    <k-chip-input
        v-for="(chip,index) in chips"
        :key="`${chip[valueField]}[index][${index}]`"
        :chip="chip"
        :value-field="valueField"
        :text-field="textField"
        @remove="removeChip(chip)"
    />
  </div>
</template>

<script>
import {KChipInput} from "@/components/ui-components/chip-input";
import {makeProp as p} from "@/util/props";
import {PROP_TYPE_ARRAY, PROP_TYPE_NUMBER_STRING} from "@/constants/props";

export default {
  name: "ChipInputGroup",
  components: {
    KChipInput
  },
  emits: ['delete'],
  props: {
    chips: p(PROP_TYPE_ARRAY),
    valueField: p(PROP_TYPE_NUMBER_STRING, 'value'),
    textField: p(PROP_TYPE_NUMBER_STRING, 'text')
  },
  methods: {
    removeChip(chip) {
      this.$emit('delete', chip)
    }
  }
}
</script>

<style scoped>
@import "chip-input-group.scss";
</style>