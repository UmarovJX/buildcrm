import api from "@/services/api";

export async function orderApartment(ids) {
    try {
        const {data} = await api.orders.holdOrder(ids)
        if (data) {
            await this.$router.push({
                name: "checkout",
                params: {
                    id: data.uuid
                }
            })
        }
    } catch (e) {
        this.toastedWithErrorCode(e)
    }
}