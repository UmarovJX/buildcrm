<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t('settings.title') }}
      </template>
    </app-header>

    <settings-client-types class="x-horizontal-divider"/>

    <settings-countries/>
  </div>
</template>

<script>
import AppHeader from '@/components/Header/AppHeader.vue';
import SettingsClientTypes from "@/views/Settings/components/SettingsClientTypes.vue";
import SettingsCountries from "@/views/Settings/components/SettingsCountries.vue";

export default {
  name: 'SettingsPage',
  components: {
    AppHeader,
    SettingsClientTypes,
    SettingsCountries
  },
};
</script>

<style lang="scss" scoped>
.x-horizontal-divider {
  position: relative;
  padding-bottom: 2rem;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: calc(100% + 6rem);
    margin-left: -3rem;
    height: 6px;
    background-color: var(--gray-100);
  }
}
</style>
