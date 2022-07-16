<template>
<main>
  <div class="d-flex justify-content-between align-items-center">
    <!--  Search Content  -->
    <base-search-input
        class="w-50"
        :placeholder="`${ $t('building_layout.layout_name') }`"
        @trigger-input="getInputValue"
    />

    <BaseButton class="font-weight-500" @click="showAddModal" :text="$t('building_layout.add_layout')">
      <template #left-icon>
        <BasePlusIcon fill="#7C3AED"/>
      </template>
    </BaseButton>
  </div>
  <create-update-modal
      ref="create-modal"
      class="layout-modal"
      :history-edit-info="editedItem"
      :modal-properties="modalProperties"
  />
  <building-layouts-list/>
</main>
</template>

<script>

import BaseButton from "@/components/Reusable/BaseButton";
import BaseSearchInput from "@/components/Reusable/BaseSearchInput";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BuildingLayoutsList from "@/components/Dashboard/Objects/BuildingLayouts/components/BuildingLayoutsList";
import CreateUpdateModal from "@/components/Dashboard/Objects/BuildingLayouts/components/CreateUpdateModal";
export default {
  name: "BuildingLayouts",
  components: {
    BuildingLayoutsList,
    BasePlusIcon,
    BaseButton,
    CreateUpdateModal,
    BaseSearchInput
  },
  data() {
    return {
      editedItem: {},
      modalProperties: {
        position: 'create',
        title: this.$t('building_layout.add_title'),
      },
    }
  },
  methods: {
    getInputValue($event) {
      console.log($event)
    },
    showAddModal() {
      this.modalProperties = {
        title: this.$t('building_layout.add_layout'),
        position: 'create'
      }
      // this.$bvModal.show('modal-create')
      this.$refs['create-modal'].show()
    }
  }
}
</script>

<style scoped lang="scss">

</style>