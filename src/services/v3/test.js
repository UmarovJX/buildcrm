import Core from '@/services/core/index'
import { axiosBase } from '@/services/core/base'

class Service extends Core {
  constructor(
    axios = axiosBase({
      endpoint: '/api',
    }),
  ) {
    super(axios, {
      headers: {
        'Accept-Language': '',
      },
    })
  }

  objects = {
    fetchAll: () => this.get('objects'),
    fetchArchived: () => this.get('objects/archiveList'),
    view: b => this.post('objects/show', b),
    create: b => this.post('objects', b),
    update: (id, body) => this.post('objects/' + id, body),
    getObjectBuildings: (objectId, params) => this.get(`objects/${objectId}/buildings`, { params }),
    createBuilding: (objectId, data) => this.post(`objects/${objectId}/buildings`, data)
  };
  buildings = {
    view: (object, building) => this.get(`objects/${object}/buildings/${building}`),
    getBlocks: (object, building, params) => this.get(`objects/${object}/buildings/${building}/blocks`, { params }),
    createBlock: (object, building, data) => this.post(`objects/${object}/buildings/${building}/blocks`, data)
  }
  blocks = {
    view: (object, building, block) => this.get(`objects/${object}/buildings/${building}/blocks/${block}`),
    getFloors: (object, building, block) => this.get(`objects/${object}/buildings/${building}/blocks/${block}/floors`),
    getApartments: (object, building, block, floor, params) => this.get(`objects/${object}/buildings/${building}/blocks/${block}/floors/${floor}/apartments`, { params }),
    getCurrencyTypes: () => this.get('currency-types')
  }
  apartments = {
    get: (object, building, block, floor, params) => this.get(`objects/${object}/buildings/${building}/blocks/${block}/floors/${floor}/apartments`, { params }),
    view: (object, building, block, apartment) => this.get(`objects/${object}/buildings/${building}/blocks/${block}/apartments/${apartment}`),
    create: (object, building, block, data) => this.post(`objects/${object}/buildings/${building}/blocks/${block}/apartments`, data),
    update: (object, building, block, apartment, data) => this.put(`objects/${object}/buildings/${building}/blocks/${block}/apartments/${apartment}`, data),
    delete: (object, building, block, apartment) => this.delete(`objects/${object}/buildings/${building}/blocks/${block}/apartments/${apartment}`),
  }


  floors = {
    get: (params) => this.get('floors', { params }),
    getAll: () => this.get('floors'),
    view: b => this.get('floors/' + b,),
    create: b => this.post('floors', b),
    update: b => this.put('floors', b),
    delete: b => this.delete('floors', b)
  }
  apartmentTypes = {
    get: (params) => this.get('apartment-types', { params }),
    getAll: () => this.get('apartment-types'),
    view: b => this.get('apartment-types/' + b,),
    create: b => this.post('apartment-types', b),
    update: b => this.put('apartment-types', b),
    delete: b => this.delete('apartment-types', b)
  }
  tariffs = {
    get: (object, params) => this.get(`objects/${object}/tariffs`, { params }),
    getAll: (object) => this.get(`objects/${object}/tariffs`),
    view: (object, tariff) => this.get(`objects/${object}/tariffs/${tariff}`),
    create: (object, data) => this.post(`objects/${object}/tariffs`, data),
    update: (object, tariff, data) => this.put(`objects/${object}/tariffs/${tariff}`, data),
    delete: (object, tariff) => this.delete(`objects/${object}/tariffs/${tariff}`),
  }
  plans = {
    get: (object, params) => this.get(`objects/${object}/plans`, { params }),
    getAll: (object) => this.get(`objects/${object}/plans`),
    view: (object, plan) => this.get(`objects/${object}/plans/${plan}`),
    create: (object, data) => this.post(`objects/${object}/plans`, data),
    update: (object, plan, data) => this.post(`objects/${object}/plans/${plan}/update`, data),
    delete: (object, plan) => this.delete(`objects/${object}/plans/${plan}`),
    deleteImage: (object, plan, data) => this.delete(`objects/${object}/plans/${plan}/delete-image`, data),
  }





}

// eslint-disable-next-line import/prefer-default-export
export const testApi = new Service()
