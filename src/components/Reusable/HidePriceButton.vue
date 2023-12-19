<script>
import { computed } from 'vue'
import { useShowPrice } from '@/composables/useShowPrice'
import { XIcon } from '@/components/ui-components/material-icons'
import { XCircularBackground } from '@/components/ui-components/circular-background'
import ApartmentsPermission from '@/permission/apartments'

export default {
  name: 'HidePriceButton',

  components: {
    XIcon,
    XCircularBackground,
  },
  data() {
    return {
      hidePricePermission:
        ApartmentsPermission.getApartmentHidePricePermission(),
    }
  },
  setup() {
    const { showPrice, changeHide } = useShowPrice()
    const iconName = computed(() => (showPrice.value ? 'visibility' : 'visibility_off'))
    return { iconName, changeHide }
  },
}
</script>
<template>
  <div>
    <x-circular-background
      v-if="hidePricePermission"
      class="bg-violet-500"
      :padding="0.5"
      style="user-select: none; cursor: pointer"
      @click="changeHide"
    >
      <x-icon
        :name="iconName"
        :size="24"
        class=""
        color="white"
        style="user-select: none"
      />
    </x-circular-background>
  </div>
</template>

<style lang="scss" scoped></style>
