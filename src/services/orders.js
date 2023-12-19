import { axiosV1CRM, axiosV2 } from '@/services/core/base'
import Core from '@/services/core/index'

class OrdersV1 extends Core {
  constructor(axios = axiosV1CRM) {
    super(axios)
  }

  holdOrder(data, type) {
    return this.post('checkout', { [`${type}s`]: data, type })
  }

  deleteOrderHold(uuid) {
    return this.delete(`checkout/${uuid}`)
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
    return this.post(`orders/${orderId}/comment`, { comment })
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

  fetchCheckoutData(uuid) {
    return this.get(`checkout/${uuid}`)
  }
}

class OrdersV2 extends Core {
  constructor(axios = axiosV2) {
    super(axios)
  }

  fetchCheckoutData(uuid) {
    return this.get(`checkout/${uuid}`)
  }
}

export default {
  OrdersV1,
  OrdersV2,
}
