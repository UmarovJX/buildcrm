<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t('settings.title') }}
      </template>
    </app-header>

    <settings-client-types/>


  </div>
</template>

<script>
import AppHeader from '@/components/Header/AppHeader.vue';
import SettingsClientTypes from "@/views/Settings/components/SettingsClientTypes.vue";
export default {
  name: 'SettingsPage',
  components: {
    AppHeader,
    SettingsClientTypes
  },

};
</script>

<style lang="scss" scoped></style>
