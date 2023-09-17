import Core from "@/services/core/index";
import { axiosV1CRM } from "@/services/core/base";

class Roles extends Core {
  constructor(axios = axiosV1CRM) {
    super(axios);
  }

  fetchRoles() {
    return this.get("roles");
  }

  createRole(body) {
    return this.post(`roles`, body);
  }

  fetchRole(roleId) {
    return this.get(`roles/${roleId}`);
  }

  updateRole(roleId, body) {
    return this.put(`roles/${roleId}`, body);
  }

  deleteRole(roleId) {
    return this.delete(`roles/${roleId}`);
  }
}

export default Roles;
