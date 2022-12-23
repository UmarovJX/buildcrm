import {axiosV1CRM, axiosV2} from '@/services/core/base'
import Core from '@/services/core/index'

class Settings extends Core {
    constructor(axios = axiosV1CRM) {
        super(axios);
    }

    fetchSettings() {
        return this.get('settings')
    }

    fetchCurrency() {
        return this.get('currency')
    }

    fetchVersionList() {
        return this.get('versions')
    }

    getVersionList(params) {
        return this.get('versions', {params})
    }

    createVersion(body) {
        return this.post('versions', body)
    }

    getVersion(id) {
        return this.get(`versions/${id}`)
    }

    updateVersion(id, body) {
        return this.put(`versions/${id}`, body)
    }

    deleteVersion(id) {
        return this.delete(`versions/${id}`)
    }

    getLastVersion() {
        return this.get('versions/latest')
    }

    confirmLastVersion() {
        return this.get('versions/confirm')
    }

}

class SettingsV2 extends Core {
    constructor(axios = axiosV2) {
        super(axios);
    }

    fetchSettings() {
        return this.get('settings')
    }

    fetchCurrency() {
        return this.get('currency')
    }

    getClientTypes() {
        return this.get('clients/types')
    }

    createClientType(body) {
        return this.post('clients/types', body)
    }

    deleteClientType(typeId) {
        return this.delete(`clients/types/${typeId}`)
    }

    getClientTypeById(typeId) {
        return this.get(`clients/types/${typeId}`)
    }

    updateClientType(typeId, body) {
        return this.put(`clients/types/${typeId}`, body)
    }
}

export default {Settings, SettingsV2}