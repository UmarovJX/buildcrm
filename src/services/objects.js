import { axiosV1CRM, axiosV2 } from "@/services/core/base";
import Core from "@/services/core/index";
import { v3ServiceApi } from "@/services/v3/v3.service.js";

class ObjectsV3 extends Core {
  constructor(axios = v3ServiceApi) {
    super(axios);
  }

  getObjects() {
    return this.get("objects");
  }
  getArchivedObjects() {
    return this.get("objects/archiveList");
  }
  setArchive(body) {
    return this.post("objects/isArchive", body);
  }
}

class ObjectsV1Crm extends Core {
  constructor(axios = axiosV1CRM) {
    super(axios);
  }

  oldObjectCreation(body) {
    return this.post("objects", body);
  }

  fetchByFilterObject(object) {
    return this.get(`objects/${object}/filter`);
  }

  fetchObjectWithPagination(object, page, body) {
    return this.post(`objects/${object}/filter?page=${page}`, body);
  }

  fetchOldObjects() {
    return this.get(`objects`);
  }

  updateObject(objectId, body) {
    return this.put(`v2/objects/${objectId}`, body);
  }

  updateLogo(objectId, body) {
    return this.post(`objects/${objectId}`, body);
  }

  deleteObject(objectId) {
    return this.delete(`objects/${objectId}`);
  }

  getDealTemplateList(objectId) {
    return this.get(`objects/${objectId}/contract/`);
  }

  addNewContract({ id, form }) {
    return this.post(`objects/${id}/contract/`, form);
  }

  makeContractPrimary({ objectId, contractId }) {
    return this.put(`objects/${objectId}/contract/${contractId}/primary`);
  }

  deleteContract({ objectId, contractId }) {
    return this.delete(`objects/${objectId}/contract/${contractId}`);
  }

  deleteObjectPromo({ objectId, uuId }) {
    return this.delete(`objects/${objectId}/promo/${uuId}`);
  }

  fetchObjectBlockByType({ objectId, blockId, type }) {
    return this.get(`objects/${objectId}/blocks/${blockId}/${type}s`);
  }

  updateObjectPromo({ id, promoId, form }) {
    return this.put(`objects/${id}/promo/${promoId}`, form);
  }

  changeObjectPromoActivation({ objectId, promoId, type }) {
    return this.put(`objects/${objectId}/promo/${promoId}/${type}`);
  }

  fetchOldObjectPlans(objectId) {
    return this.post(`objects/${objectId}/plans`);
  }

  fetchObjectPlan(objectId, planId) {
    return this.get(`objects/${objectId}/plans/${planId}`);
  }

  updateObjectPlan(objectId, planId, body) {
    return this.post(`objects/${objectId}/plans/${planId}`, body);
  }

  fetchObjectApartments(object, params) {
    return this.get(`objects/${object}/apartments`, { params });
  }

  fetchObjectsApartment(object, apartmentId) {
    return this.get(`objects/${object}/apartments/${apartmentId}`);
  }

  fetchObject(objectId) {
    return this.get(`v2/objects/${objectId}`);
  }

  createObject(body) {
    return this.post("v2/objects", body);
  }

  updateApartment(apartmentId, body) {
    return this.put(`v2/objects/apartment/${apartmentId}`, body);
  }

  deleteApartment(apartmentId) {
    return this.delete(`v2/objects/apartment/${apartmentId}`);
  }

  addBlockPrice(blockId, body) {
    return this.post(`v2/objects/block/${blockId}/prices`, body);
  }

  createBlockPrice(blockId, body) {
    return this.put(`v2/objects/block/${blockId}/prices`, body);
  }

  updateBlockPrice(blockId, priceId, body) {
    return this.put(`v2/objects/block/${blockId}/prices/${priceId}`, body);
  }

  deleteBlockPrice(blockId, priceId) {
    return this.delete(`v2/objects/block/${blockId}/prices/${priceId}`);
  }

  updateBlock(blockId, body) {
    return this.put(`v2/objects/block/${blockId}`, body);
  }

  deleteBlock(blockId) {
    return this.delete(`v2/objects/block/${blockId}`);
  }

  getBlockApartments(blockId) {
    return this.get(`v2/objects/block/${blockId}/apartments`);
  }

  cloneFloors(blockId, body) {
    return this.post(`v2/objects/apartments/${blockId}/clone`, body);
  }

  apartmentAddition(blockId, body) {
    return this.post(`v2/objects/block/${blockId}/apartment`, body);
  }

  updateApartments(body) {
    return this.put(`v2/objects/apartments/update`, body);
  }

  createDiscount(objectId, body) {
    return this.post(`v2/objects/${objectId}/discounts`, body);
  }

  updateDiscount(objectId, discountId, body) {
    return this.put(`v2/objects/${objectId}/discounts/${discountId}`, body);
  }

  deleteDiscount(objectId, discountId) {
    return this.delete(`v2/objects/${objectId}/discounts/${discountId}`);
  }

  fetchObjectDiscount(objectId) {
    return this.get(`v2/objects/${objectId}/discounts`);
  }

  fetchBuildings(objectId) {
    return this.get(`v2/objects/${objectId}/buildings`);
  }

  createBuilding(objectId, body) {
    return this.post(`v2/objects/${objectId}/buildings`, body);
  }

  updateBuilding(objectId, buildingId, body) {
    return this.put(`v2/objects/${objectId}/buildings/${buildingId}`, body);
  }

  createBuildingBlock(buildingId, body) {
    return this.post(`v2/objects/buildings/${buildingId}/block`, body);
  }

  deleteBuilding(objectId, buildingId) {
    return this.delete(`v2/objects/${objectId}/buildings/${buildingId}`);
  }

  createObjectPlan(objectId, body) {
    return this.post(`v2/objects/${objectId}/plans`, body);
  }

  fetchObjectPlans(objectId) {
    return this.get(`v2/objects/${objectId}/plans`);
  }

  getObjectPlans(objectId) {
    return this.get(`objects/${objectId}/plans`);
  }
}

class ObjectsV2 extends Core {
  constructor(axios = axiosV2) {
    super(axios);
  }

  updateObject(objectId, body) {
    return this.put(`objects/${objectId}`, body);
  }

  fetchObjectPlans(objectId) {
    return this.get(`objects/${objectId}/plans`);
  }

  getApartments(objectId, body) {
    return this.get(`apartments/objects/${objectId}/grid`, { params: body });
  }

  getObjectPlans(objectId) {
    return this.get(`/apartments/objects/${objectId}/plans`);
  }

  getDealTemplateList(objectId) {
    return this.get(`templates/branch/${objectId}`);
  }

  addNewContract({ id, form }) {
    return this.post(`templates/branch/${id}`, form);
  }

  makeContractPrimary({ objectId, contractId }) {
    return this.put(
      `templates/branch/${objectId}/contract/${contractId}/primary`
    );
  }

  deleteContract({ objectId, contractId }) {
    return this.delete(`templates/branch/${objectId}/contract/${contractId}`);
  }

  fetchObjectFields(objectId) {
    return this.get(`apartments/objects/${objectId}/filter-fields`);
  }

  fetchObjectPrice(objectId) {
    return this.get(`apartments/objects/${objectId}/prices-fields`);
  }

  fetchObjectApartments(object, params) {
    return this.get(`apartments/objects/${object}`, { params });
  }

  fetchObjectParkings(object, params) {
    return this.get(`apartments/objects/${object}/parkings`, { params });
  }
  fetchObjectParkingsStatusList(object) {
    return this.get(`apartments/objects/${object}/parkings/statuses`);
  }

  fetchParkingView(object, id) {
    return this.get(`apartments/objects/${object}/parkings/${id}`);
  }
  fetchParkingFilterFields(object) {
    return this.get(`apartments/objects/${object}/parkings/filter-fields`);
  }
  reContract(id) {
    return this.post(`/v2/contracts/${id}/reorder`);
  }

  getPlanItem(objectId, planId) {
    return this.get(`apartments/objects/${objectId}/plans/${planId}`);
  }

  getObjectName(objectId) {
    return this.get(`apartments/objects/${objectId}/information`);
  }

  getOptimizeApartments(object, block) {
    return this.get(`apartments/objects/${object}/grid/${block}`);
  }
}

export default {
  ObjectsV1Crm,
  ObjectsV2,
  ObjectsV3,
};
