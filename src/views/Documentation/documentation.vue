<template>
  <div class="doc-container">
    <router-link :to="{name: 'icons'}">Icons</router-link>
    <router-link :to="{name: 'sidebar'}">Sidebar</router-link>
    <router-link :to="{name: 'actions'}">Actions</router-link>
    <router-link :to="{name: 'topbar'}">Topbar</router-link>
    <router-link :to="{name: 'tabs'}">Tabs</router-link>
  </div>
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