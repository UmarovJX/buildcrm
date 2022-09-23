<template>
  <div>
    <form-select
        :value="'komron'"
        :options="options"
        v-model="handle"
    >
      <form-select-option value="first form select"/>
      <form-select-option value="second form select"/>
    </form-select>
  </div>
</template>

<script>
import {
  FormSelect
} from '@/components/ui/form-select/form-select'
import {
  FormSelectOption
} from '@/components/ui/form-select/form-select-option'

export default {
  name: 'experience',
  components: {
    FormSelect,
    FormSelectOption
  },
  data() {
    return {
      handle: null,
      options: [
        {
          label: 'komron',
          value: 'komron'
        },
        {
          label: 'miron',
          value: 'miron'
        },
        {
          label: 'aziz',
          value: 'aziz'
        }
      ]
    }
  },
  methods: {
    formSelectChange(value) {
      console.log(value)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>