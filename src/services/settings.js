import {axiosV1CRM} from '@/services/core/base'
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

export default Settings