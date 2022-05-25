<template>
  <div>
    <div class="d-flex align-items-center flex-wrap">
      <base-search-input class="base-search-input mr-2 mb-4" :placeholder="`${ $t('contract_number_or_full_name') }`"/>
      <base-filter-button class="mr-2 base-filter-button mb-4" @click="openFilterContent"/>
      <base-select class="base-select mb-4" :options="listOptions"/>
    </div>
    <base-right-modal ref="filter-modal">
      <div>
        komron
      </div>
    </base-right-modal>
  </div>
</template>

<script>
import BaseSearchInput from "@/components/Reusable/BaseSearchInput";
import BaseFilterButton from "@/components/Elements/BaseFilterButton";
import BaseSelect from "@/components/Reusable/BaseSelect";
import BaseRightModal from "@/components/Reusable/BaseRightModal";

export default {
  name: "FilterContent",
  components: {
    BaseSearchInput,
    BaseFilterButton,
    BaseSelect,
    BaseRightModal
  },
  data() {
    return {
      listOptions: [
        {
          text: 'Komron',
          value: 1,
        },
        {
          text: 'Jahongir',
          value: 2
        }
      ]
    }
  },
  methods: {
    openFilterContent() {
      this.$refs['filter-modal'].show()
    }
  }
}
</script>

<style lang="scss" scoped>
.base-select {
  max-width: 16rem;
}

.base-search-input {
  width: 60%;
  max-width: 85rem;
  min-width: 32rem;
}
</style>