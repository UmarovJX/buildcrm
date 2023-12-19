<script>
import RoleHeader from '@/views/rolesV2/components/upsert/RoleHeader.vue'
import RoleForm from '@/views/rolesV2/components/upsert/RoleForm.vue'

export default {
  name: 'RoleUpsert',
  components: {
    RoleForm,
    RoleHeader,
  },
}
</script>

<template>
  <div>
    <role-header />
    <role-form />
  </div>
</template>
