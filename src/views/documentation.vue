<template>

  <!--  BASE ACTION LIST-->
  <BaseActionList :position-right="true">
    <template #header>
      {{ $t('contracts.view.actions') }}
    </template>
    <template #list>
      <b-dropdown-item @click="consoleText">
        <BasePlusIcon fill="var(--violet-600)"/>
        {{ $t('contracts.view.update_contract') }}
      </b-dropdown-item>
      <b-dropdown-item @click="consoleData">
        <BaseDeleteIcon fill="var(--violet-600)"/>
        {{ $t('contracts.view.download_contract') }}
      </b-dropdown-item>
    </template>
  </BaseActionList>






</template>

<script>
import BaseActionList from "@/components/Reusable/BaseActionList";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";

export default {
  name: "documentation",
  components: {
    BaseActionList,
    BasePlusIcon,
    BaseDeleteIcon
  },
  methods: {
    consoleText() {
      console.log('consoleText');
    },
    consoleData() {
      console.log('consoleData');
    }
  },
}
</script>

<style scoped>

</style>