<template>
  <div>
    <k-form-select
        :options="options"
        :multiple="false"
        placeholder="sultonov komron"
    >
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
          }">

      </k-form-select-option>
    </k-form-select>
  </div>
</template>

<script>
import KFormSelect from '@/components/ui/form-select/KFormSelect'
import KFormSelectOption from '@/components/ui/form-select/KFormSelectOption'

export default {
  name: 'experience',
  components: {
    KFormSelect,
    KFormSelectOption
  },
  data() {
    return {
      handle: null,
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