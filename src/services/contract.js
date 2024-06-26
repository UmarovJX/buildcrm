import { axiosV1CRM, axiosV2 } from "@/services/core/base";
import Core from "@/services/core/index";

class Contract extends Core {
  constructor(axios = axiosV1CRM) {
    super(axios);
  }

  fetchDeals(params) {
    return this.get("deals", params);
  }

  cancelContract(id, body) {
    return this.post(`deals/${id}`, body);
  }

  downloadContract(id) {
    return this.get("orders/" + id + "/contract", {
      responseType: "blob",
    });
  }
}

class ContractV2 extends Core {
  constructor(axios = axiosV2) {
    super(axios);
  }

  fetchContractsList(params) {
    return this.get(`contracts`, { params });
  }

  fetchObjectsOption() {
    return this.get(`contracts/filter-fields`);
  }

  fetchContractView(id) {
    return this.get(`contracts/${id}`);
  }

  fetchActivityLog(id, params) {
    return this.get("contracts/" + id + "/logs", { params });
  }

  fetchActivityLogFilterFields(id) {
    return this.get("contracts/" + id + "/logs/filter-fields");
  }

  getUpdateContractView(id) {
    return this.get(`contracts/${id}/update`);
  }

  orderUpdate(id, body) {
    return this.put(`contracts/${id}`, body);
  }

  fetchClientInfo(id) {
    return this.get("contracts/" + id + "/client");
  }

  fetchContractDetails(id) {
    return this.get("contracts/" + id + "/details");
  }

  fetchCompareDetails(id) {
    return this.get("contracts/" + id + "/price-details");
  }

  getContractObjectDetails(id, type) {
    return this.get(`contracts/${id}/${type}`);
  }

  fetchPaymentSchedule(id, params) {
    return this.get("contracts/" + id + "/payment-schedule", { params });
  }

  fetchPayments(id, params) {
    return this.get("contracts/" + id + "/payments", { params });
  }

  toggleClientType(contractId, clientTypeId) {
    return this.put("contracts/" + contractId + "/client", {
      client_type_id: clientTypeId,
    });
  }

  appendPayment(id, body) {
    return this.post(`contracts/${id}/payments`, body);
  }

  importPaymentTransaction(id, payments) {
    return this.post(`contracts/${id}/payments/import`, { payments });
  }

  removePaymentTransaction(contractId, transactionId) {
    return this.delete(`contracts/${contractId}/payments/${transactionId}`);
  }

  editPaymentTransaction({ contractId, transactionId, params }) {
    return this.put(
      `contracts/${contractId}/payments/${transactionId}`,
      params
    );
  }

  downloadContractTemplate() {
    return this.get("contracts/template", {
      responseType: "blob",
    });
  }

  downloadReContract(id) {
    return this.get("contracts/" + id + "/reissue/contract", {
      responseType: "blob",
    });
  }

  deleteContract(contractId, body) {
    return this.post(`contracts/${contractId}`, body);
  }

  reOrderDetails(id) {
    return this.get("contracts/" + id + "/reorder");
  }

  reOrderConfirm(id, body) {
    return this.put("contracts/" + id + "/reorder", body);
  }

  getReissue(id) {
    return this.get("contracts/" + id + "/reissue");
  }

  contractOrderUpdate(contractId, body) {
    return this.put(`contracts/${contractId}`, body);
  }

  getCommentList(contractId, params) {
    return this.get("contracts/" + contractId + "/comments", { params });
  }

  addComment(contractId, body) {
    return this.post("contracts/" + contractId + "/comments", body);
  }

  editComment(contractId, commentId, body) {
    return this.put("contracts/" + contractId + "/comments/" + commentId, body);
  }

  deleteComment(contractId, commentId) {
    return this.delete("contracts/" + contractId + "/comments/" + commentId);
  }

  getCounts(params) {
    return this.get("contracts/counts", { params });
  }

  archive({ endpoint = "contracts" } = { endpoint: "contracts" }) {
    return {
      findAll: (params) =>
        this.get(endpoint + "/archived", {
          params,
        }),
      putArchive: ({ contractId, body }) =>
        this.put(`${endpoint}/${contractId}/archive`, body),
    };
  }

  recover({ contractId }, b = {}) {
    return this.post(`contracts/${contractId}/recovery`, b);
  }
}

export default {
  Contract,
  ContractV2,
};
