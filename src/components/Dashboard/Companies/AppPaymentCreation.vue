<template>

</template>

<script>
export default {
  name: "AppPaymentCreation",
  data() {
    return {
      payment:{
        inn: null,
        mfo: null,
        payment_account: null,
        bank_name_ru: null,
        bank_name_uz: null
      },
      validationProvider:[
        {
          mask: '',
          type: 'text',
          bind: 'payment_account',
          labelFor: 'payment_account',
          rules: 'required|min:2',
          label: this.$t('companies.payment_account')
        },
        {
          mask: '',
          type: 'text',
          bind: 'inn',
          labelFor: 'inn',
          rules: 'required|min:2',
          label: this.$t('companies.inn')
        },
        {
          mask: '',
          type: 'text',
          bind: 'mfo',
          labelFor: 'mfo',
          rules: 'required|min:2',
          label: this.$t('companies.mfo')
        },
        {
          mask: '',
          type: 'text',
          bind: 'bank_name_ru',
          labelFor: 'bank_name_ru',
          rules: 'required|min:2',
          label: this.$t('companies.bank_name') + ' Ru'
        },
        {
          mask: '',
          type: 'text',
          bind: 'bank_name_uz',
          labelFor: 'bank_name_uz',
          rules: 'required|min:2',
          label: this.$t('companies.bank_name') + ' Uz'
        }
      ]
    }
  },
}
</script>

<style scoped>

</style>