<template>
  <div>
    <b-modal
        id="modal-create"
        ref="creation-modal"
        size="lg"
        :title="`${ $t('objects.create.plan.add') }`"
        hide-footer
        @show="resetModal"
    >
      <form ref="form" @submit.prevent="handleSubmit">
        <BaseInput/>
        <BaseButton @click="handleSubmit"/>
      </form>
    </b-modal>
  </div>
</template>

<script>
import BaseInput from "@/components/Reusable/BaseInput";
import BaseButton from "@/components/Reusable/BaseButton";
export default {
  name: 'CreationCompanyModal',
  components: {BaseButton, BaseInput},
  emits: ['layout-data'],
  data() {
    return {
      maskText: '',
      loading: false,
      providerSchema: [
        {
          mask: '',
          type: 'text',
          bind: 'oked',
          labelFor: 'oked',
          rules: 'required|min:2',
          label: this.$t('companies.oked')
        },
        {
          mask: '############',
          type: 'tel',
          bind: 'phone',
          labelFor: 'phone',
          rules: 'required|min:2',
          label: this.$t('companies.phone')
        },
      ]
    }
  },
  methods: {
    resetModal() {
      this.$bvModal.hide("modal-create")
    },
    handleSubmit() {
      console.log("post to the backend")
      this.resetModal()
    }
  }
}
</script>

<style lang="scss" scoped>
.error__provider {
  color: red;
  display: block;
  margin-bottom: 1rem;
}

.save__button {
  color: white;
}
</style>
