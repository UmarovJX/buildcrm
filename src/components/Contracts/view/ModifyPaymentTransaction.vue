<script>
import BaseModal from '@/components/Reusable/BaseModal'
import BaseButton from '@/components/Reusable/BaseButton'
import BaseArrowLeftIcon from '@/components/icons/BaseArrowLeftIcon'
import BaseNumericInput from '@/components/Reusable/BaseNumericInput'
import api from '@/services/api'

export default {
  name: 'ModifyPaymentTransaction',
  components: {
    BaseModal,
    BaseButton,
    BaseArrowLeftIcon,
    BaseNumericInput,
  },
  props: {
    paymentTypeOptions: {
      type: Array,
      required: true,
    },
    paymentMethodOptions: {
      type: Array,
      required: true,
    },
    toggleModal: {
      type: Boolean,
      default: false,
    },
    properties: {
      type: Object,
      required: true,
    },
  },
  emits: ['hide-modal', 'update-content'],
  data() {
    return {
      buttonLoading: false,
      form: {
        type: null,
        amount: null,
        date_paid: null,
        payment_type: null,
        comment: null,
      },
    }
  },
  watch: {
    toggleModal(last) {
      if (last) this.openModifyModal()
      else this.closeModifyModal()
    },
  },
  methods: {
    closeModifyModal() {
      this.$refs['modify-transaction-modal'].closeModal()
    },
    openModifyModal() {
      this.$refs['modify-transaction-modal'].openModal()
    },
    setFormProperties(property, value) {
      this.form[property] = value
    },
    showModal() {
      for (const key in this.form) {
        const hasProperty = this.properties.hasOwnProperty(key)
        if (hasProperty) {
          this.form[key] = this.properties[key]
        }
      }
    },
    hideModal() {
      this.$emit('hide-modal')
    },
    updateContent() {
      this.$emit('update-content')
    },
    async submitModifyTransaction() {
      const formCompleted = await this.$refs['modify-payment'].validate()
      if (formCompleted) {
        const body = { ...this.form }
        const { id: contractId } = this.$route.params
        const { id: transactionId } = this.properties
        this.buttonLoading = true
        body.amount *= 100
        const {
          amount, comment, date_paid, payment_type, type,
        } = body
        await api.contractV2
          .editPaymentTransaction({
            contractId,
            transactionId,
            params: {
              amount,
              comment,
              payment_type,
              type,
              payment_date: date_paid,
            },
          })
          .then(() => {
            this.hideModal()
            this.updateContent()
            this.$swal({
              title: this.$t('successfully'),
              text: this.$t('payment_change'),
              icon: 'success',
            })
          })
          .catch(error => {
            const { data } = error.response
            const index = Object.keys(data)[0]
            const text = data[index]
            this.$swal({
              text,
              icon: 'error',
              title: this.$t('error'),
            })
          })
          .finally(() => {
            this.buttonLoading = false
          })
      }
    },
  },
}
</script>

<template>
  <!--   PAYMENT ADDITION MODAL   -->
  <base-modal
    ref="modify-transaction-modal"
    @hide="hideModal"
    @show="showModal"
  >
    <template #header>
      <!--   GO BACK     -->
      <span class="d-flex align-items-center">
        <span
          class="go__back"
          @click="closeModifyModal"
        >
          <base-arrow-left-icon
            :width="32"
            :height="32"
          />
        </span>
        <!--    TITLE      -->
        <span class="title">{{ $t("contracts.edit_payment") }}</span>
      </span>
    </template>

    <template #main>
      <ValidationObserver ref="modify-payment">
        <div class="d-flex justify-content-between mb-3">
          <ValidationProvider
            name="payment_date"
            rules="required"
            class="w-50 mr-3"
          >
            <input
              v-model="form.date_paid"
              type="date"
              class="w-100"
            >
          </ValidationProvider>
          <ValidationProvider
            name="type"
            rules="required"
            class="content__form__select"
          >
            <b-form-select
              v-model="form.type"
              class="form__select"
              :options="paymentTypeOptions"
            >
              <template #first>
                <b-form-select-option
                  :value="null"
                  disabled
                >
                  <span class="disabled__option"> Тип </span>
                </b-form-select-option>
              </template>
            </b-form-select>
          </ValidationProvider>
        </div>
        <div class="d-flex justify-content-between mb-3">
          <ValidationProvider
            name="amount"
            rules="required"
            class="w-50 mr-3"
          >
            <base-numeric-input
              v-model.number="form.amount"
              :currency="`${$t('ye')}`"
              :minus="false"
              :value="null"
              currency-symbol-position="suffix"
              separator="space"
              placeholder="Сумма"
              class="w-100"
            />
          </ValidationProvider>
          <ValidationProvider
            name="payment_type"
            rules="required"
            class="content__form__select"
          >
            <b-form-select
              v-model="form.payment_type"
              class="form__select"
              :options="paymentMethodOptions"
            >
              <template #first>
                <b-form-select-option
                  :value="null"
                  disabled
                >
                  <span class="disabled__option"> Способ </span>
                </b-form-select-option>
              </template>
            </b-form-select>
          </ValidationProvider>
        </div>
        <input
          v-model="form.comment"
          type="text"
          placeholder="Комментарий"
          class="w-100"
        >
      </ValidationObserver>
    </template>

    <template #footer>
      <b-overlay
        :show="buttonLoading"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
        class="d-inline-block w-100"
      >
        <base-button
          text="Применить"
          :fixed="true"
          design="violet-gradient"
          @click="submitModifyTransaction"
        />
      </b-overlay>
    </template>
  </base-modal>
</template>

<style lang="sass" scoped>
.go__back
  width: 56px
  height: 56px
  border-radius: 100%
  background-color: var(--gray-100)
  display: flex
  justify-content: center
  align-items: center
  cursor: pointer

.content__form__select
  display: flex
  align-items: center
  justify-content: space-between
  background-color: var(--gray-100)
  border-radius: 2rem
  width: 50%
  border: none
  color: var(--gray-600)
  position: relative

  .form__select
    background-color: transparent
    border: none
    color: var(--gray-600)
    margin: 0 1rem
    width: 100%
</style>
