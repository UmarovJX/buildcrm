<template>
  <div>
    <edit-role
        come-from="update"
        :updating-name="name"
        :permissions="permissions"
        :app-loading="appLoading"
        @submit="editRole"
    />
    <b-overlay :show="getLoading" no-wrap opacity="0.5">
      <template #overlay>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<script>
import EditRole from "@/components/Dashboard/Roles/Store";
import api from "@/services/api";

export default {
  name: 'UpdateRole',
  components: {
    EditRole
  },
  data() {
    return {
      roleBase: {},
      permissions: null,
      name: {
        uz: '',
        ru: ''
      },
      appLoading: 'default',
      getLoading: false
    }
  },
  async created() {
    await this.fetchRolePermissions()
  },
  methods: {
    async fetchRolePermissions() {
      this.appLoading = 'started'
      await api.roles.fetchRole(this.$route.params.id)
          .then(({data}) => {
            this.roleBase = data
            this.permissions = data.permissions
            this.name = data.name ?? {
              uz: '',
              ru: ''
            }
          })
          .finally(() => {
            this.appLoading = 'finished'
          })
    },
    editRole(form) {
      this.getLoading = true
      api.roles.updateRole(this.$route.params.id, form)
          .then((response) => {
            this.toasted(response.data.message, "success");

            this.$router.push({name: "roles"});

            this.$swal(`${this.$t("sweetAlert.success_update_role")}`, "", "success");
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.getLoading = false
          })
    },
  }
}
</script>