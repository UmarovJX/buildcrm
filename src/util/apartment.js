import api from "@/services/api";

export async function orderApartment(ids) {
    try {
        const {data} = await api.orders.holdOrder(ids)
        if (data) {
            const objectId = data.apartments[0].object.id
            await this.$router.push({
                name: 'confirm-apartment',
                params: {
                    id: data.uuid,
                    object: objectId
                }
            })
            // await this.$router.push({
            //     name: "checkout",
            //     params: {
            //         id: data.uuid
            //     }
            // })
        }
    } catch (e) {
        this.toastedWithErrorCode(e)
    }
}