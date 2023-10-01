import api from "@/services/api";

export async function orderApartment(ids, type) {
  try {
    const { data } = await api.orders.holdOrder(ids, type);
    if (data) {
      // const objectId = data.orders[0].apartment.object.id
      // await this.$router.push({
      //     name: 'confirm-apartment',
      //     params: {
      //         id: data.uuid,
      //         object: objectId
      //     }
      // })
      await this.$router.push({
        name: "checkout-v2",
        params: {
          id: data.uuid,
          object: data.orders[0][type].object.id,
        },
      });
      // await this.$router.push({
      //     name: "checkout",
      //     params: {
      //         id: data.uuid
      //     }
      // })
    }
  } catch (e) {
    this.toastedWithErrorCode(e);
  }
}
