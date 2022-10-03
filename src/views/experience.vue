<template>
  <div>
    <k-form-select
        :options="options"
        :multiple="true"
        placeholder="sultonov komron"
        v-model="handle"
    >
      <template #placeholder>
        jahon gafurov
      </template>
      <k-form-select-option
          :option="{
            value:'Diyor',
            text:'Diyor'
          }">
      </k-form-select-option>
      <k-form-select-option
          :option="{
            value:'Hamid',
            text:'Hamid'
          }"
      >
      </k-form-select-option>
    </k-form-select>
  </div>
</template>

<script>
import {KFormSelectOption, KFormSelect} from '@/components/ui-components/form-select'

export default {
  name: 'experience',
  components: {
    KFormSelect,
    KFormSelectOption,
  },
  data() {
    return {
      handle: [
        {
          text: 'komron',
          value: 'komron'
        }
      ],
      options: [
        {
          text: 'komron',
          value: 'komron'
        },
        {
          text: 'miron',
          value: 'miron'
        },
        {
          text: 'aziz',
          value: 'aziz'
        }
      ]
    }
  },
  methods: {
    logJS() {
      console.log('lll')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>