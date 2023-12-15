import {ref} from "vue";
import {v3ServiceApi} from "@/services/v3/v3.service";
import {useToastError} from "@/composables/useToastError";

export function usePermissionUpsert(){
    const {toastError} = useToastError()
    const showModal = ref(false)
    const editItem = ref(null)
    const upsertType = ref('create')

    function openModal(){
        showModal.value = true
    }

    function closeModal(){
        showModal.value = false
    }

    function create(){
        setUpsertType("create");
        openModal()
    }

    async function edit(item){
        try {
            const {
                data: {result},
            } = await v3ServiceApi.permission.show({id: item.id});
            editItem.value = result;
            setUpsertType("edit");
            openModal()
        } catch (e) {
            toastError(e)
        }
    }

    async function deleteItem(item){
        try {
            await v3ServiceApi.permission.remove({id: item.id});
        } catch (e){
            toastError(e)
        }
    }

    function setUpsertType(eType) {
        if (["create", "edit"].includes(eType)) {
            upsertType.value = eType;
        }
    }

    return {
        showModal,
        editItem,
        upsertType,
        openModal,
        closeModal,
        setUpsertType,
        create,
        edit,
        deleteItem,
    }
}
