<template>
  <main class="doc-container">
    <router-link :to="{name: 'icons'}">Icons</router-link>
    <router-link :to="{name: 'sidebar'}">Sidebar</router-link>
    <router-link :to="{name: 'actions'}">Actions</router-link>
    <router-link :to="{name: 'topbar'}">Topbar</router-link>
    <router-link :to="{name: 'tabs'}">Tabs</router-link>
    <router-link :to="{name: 'search'}">Search</router-link>
    <router-link :to="{name: 'buttons'}">Buttons</router-link>
    <router-link :to="{name: 'checkbox'}">Checkbox</router-link>
    <router-link :to="{name: 'loader'}">Loader</router-link>
    <router-link :to="{name: 'notification'}">Notification</router-link>
    <router-link :to="{name: 'calendar'}">Calendar</router-link>
    <router-link :to="{name: 'note'}">Note</router-link>
    <router-link :to="{name: 'checkmate'}">Checkmate</router-link>
    <router-link :to="{name: 'text-fields'}">Text Fields</router-link>
  </main>
</template>
<script>

export default {
  name: "documentation",
}
</script>

<style scoped lang="scss">
.doc-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>