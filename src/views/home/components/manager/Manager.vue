<script>
import ManagerWidgets from '@/views/home/components/manager/ManagerWidgets.vue'

export default {
  components: {
    ManagerWidgets,
  },
  props: {
    managerWidgets: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {}
  },
}
</script>

<template>
  <div>
    <manager-widgets
      :busy="false"
      :data="managerWidgets"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
