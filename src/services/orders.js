import {axiosV1CRM} from '@/services/core/base'
import Core from '@/services/core/index'

class Orders extends Core {
    constructor(axios = axiosV1CRM) {
        super(axios);
    }

    holdOrder(apartments) {
        return this.post('orders/hold', {apartments})
    }

    deactivateOrderHold(id) {
        return this.delete(`orders/${id}/hold`)
    }

    fetchUnfinishedOrders() {
        return this.get('orders/hold')
    }

    fetchOrder(orderId) {
        return this.get(`orders/${orderId}`)
    }

    reserveApartment(apartmentId, body) {
        return this.post(`orders/${apartmentId}`, body)
    }

    orderMultipleApartment(body) {
        return this.post('orders/multiple', body)
    }

    deactivateReserveOrders(id) {
        return this.delete(`orders/${id}/reserve`)
    }

    ordersComment(orderId, comment) {
        return this.post(`orders/${orderId}/comment`, {comment})
    }

    changeClientType(id, body) {
        return this.put(`orders/${id}/client`, body)
    }

    fetchOrderClient(orderId) {
        return this.get(`orders/${orderId}/client`)
    }

    fetchHoldOrder(orderId) {
        return this.get(`orders/${orderId}/hold`)
    }
}

export default Orders