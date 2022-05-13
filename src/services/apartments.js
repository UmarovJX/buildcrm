import Core from '@/services/core/index'
import {axiosV1CRM, axiosV2} from '@/services/core/base'

class ApartmentsV1 extends Core {
    constructor(axios = axiosV1CRM) {
        super(axios);
    }

    isAvailableToSold(id, apartment_uuid) {
        return this.put(`objects/${id}/apartments/${apartment_uuid}/is-sold`)
    }

    getApartmentsList(id, status = 'all') {
        return this.get(`objects/${id}/apartments`, {
            query: {
                status
            }
        })
    }

    bookingApartments(body) {
        return this.post('booking/apartments', body)
    }

    fetchApartments(apartments) {
        return this.post('apartments', {apartments})
    }

    fetchApartmentInfo(apartment) {
        return this.get(`apartments/${apartment}/info`)
    }

    updateApartmentsInfo(id, info) {
        return this.put(`apartments/${id}`, info)
    }

    fetchFilteredApartments(body) {
        return this.post(`api/apartments/filter`, body)
    }
}

class ApartmentsV2 extends Core {
    constructor(axios = axiosV2) {
        super(axios)
    }

    getApartmentView(object, id) {
        return this.get(`apartments/objects/${object}/apartments/${id}`)
    }

}

export default {
    ApartmentsV2,
    ApartmentsV1
}