import { axiosV1CRM, axiosV2 } from "@/services/core/base";
import Core from "@/services/core/index";

class Clients extends Core {
  constructor(axios = axiosV1CRM) {
    super(axios);
  }

  fetchClientData(contextField) {
    return this.get(`clients/search?field=${contextField}`);
  }

  fetchClients(page) {
    return this.get(`api/clients?page=${page}`);
  }

  searchClient(search, page) {
    return this.get(`api/clients/search?page=${page}&search=${search}`);
  }

  fetchReserveClient(orderId) {
    return this.get(`clients/${orderId}`);
  }

  createClient(body) {
    return this.post("clients", body);
  }

  cancelContract(clientId, body) {
    return this.post(`api/clients/terminate/${clientId}`, body);
  }

  deleteClientFromDB(client) {
    return this.get(`api/clients/destroy/${client}`);
  }
}

class ClientsV2 extends Core {
  constructor(axios = axiosV2) {
    super(axios);
  }

  fetchClientData(contextField) {
    return this.get(`clients?field=${contextField}`);
  }

  getClientBySearch({ params } = { params: {} }) {
    return this.get(`clients`, {
      params,
    });
  }

  fetchClients(page) {
    return this.get(`api/clients?page=${page}`);
  }

  searchClient(search, page) {
    return this.get(`api/clients/search?page=${page}&search=${search}`);
  }

  fetchReserveClient(orderId) {
    return this.get(`clients/${orderId}`);
  }

  createClient(body) {
    return this.post("clients", body);
  }

  cancelContract(clientId, body) {
    return this.post(`api/clients/terminate/${clientId}`, body);
  }

  deleteClientFromDB(client) {
    return this.get(`api/clients/destroy/${client}`);
  }
}

export default { Clients, ClientsV2 };
