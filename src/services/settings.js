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
}

export default {Settings, SettingsV2}