import Core from '@/services/core/index'
import {axiosV1CRM, axiosV2} from '@/services/core/base'

class ApartmentsV1 extends Core {
    constructor(axios = axiosV1CRM) {
        super(axios);
    }

    // isAvailableToSold(id, apartment_uuid) {
    //     return this.put(`objects/${id}/apartments/${apartment_uuid}/is-sold`)
    // }

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
        return this.get(`apartments/objects/${object}/${id}`)
    }

    isAvailableToSold(id, apartment_uuid, body) {
        return this.put(`apartments/objects/${id}/${apartment_uuid}/is-sold`, body)
    }

    getApartmentComments(id, apartment_uuid, params) {
        return this.get(`apartments/objects/${id}/${apartment_uuid}/comments`, {params})
    }

    createApartmentComment(id, apartment_uuid, body) {
        return this.post(`apartments/objects/${id}/${apartment_uuid}/comments`, body)
    }

    editApartmentComment(id, apartment_uuid, commentId, body) {
        return this.put(`apartments/objects/${id}/${apartment_uuid}/comments/${commentId}`, body)
    }

    deleteApartmentComment(id, apartment_uuid, commentId) {
        return this.delete(`apartments/objects/${id}/${apartment_uuid}/comments/${commentId}`)
    }
}

export default {
    ApartmentsV2,
    ApartmentsV1
}