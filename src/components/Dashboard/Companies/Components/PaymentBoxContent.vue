<template>
  <div
      class="payment__content-detail"
      :class="{'active__payment__content':detail.is_primary}"
  >
    <p>
      <span>{{ $t("companies.bank_name") }} : </span>
      <span>{{ getName(detail.bank_name) }}</span>
    </p>
    <p>
      <span>{{ $t("companies.payment_account") }} : </span>
      <span>{{ detail.payment_account }}</span>
    </p>
    <!--    <p>-->
    <!--      <span>{{ $t("companies.inn") }} : </span>-->
    <!--      <span>{{ detail.inn }}</span>-->
    <!--    </p>-->
    <p>
      <span>{{ $t("companies.mfo") }} : </span>
      <span>{{ detail.mfo }}</span>
    </p>
    <div class="make__primary">
      <span>
        <b-form-checkbox
            @click="makePrimaryPayment"
            v-model="isPrimary"
            name="check-button"
            switch
        >
        </b-form-checkbox>
      </span>
    </div>

  </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: "PaymentBoxContent",
  props: {
    detail: {
      type: Object,
      required: true
    },
    company: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      isPrimary: this.checker(this.detail.is_primary)
    }
  },
  watch: {
    isPrimary() {
      this.makePrimaryPayment()
    }
  },
  methods: {
    checker(data) {
      if (data === 1) {
        return true
      } else {
        return false
      }
    },
    makePrimaryPayment() {
      const data = {
        is_primary: this.isPrimary
      }
      api.companies.changeStatusCompany(this.company, this.detail.id, data)
          .then((response) => {
            const {message} = response.data
            this.$emit("updated-company", {message})
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.loading = false
          })
    },
    getName(name) {
      if (localStorage.locale)
        return name[localStorage.locale]
      else
        return name['ru']
    },
  }
}
</script>

<style scoped>
.payment__content-detail {
  border-radius: 4px;
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  font-size: 14px;
  width: 100%;
  max-width: 22rem;
}

.active__payment__content {
  background-color: rgba(88, 81, 216, 0.7);
  color: white;
}

.make__primary {
  display: flex;
  justify-content: flex-end;
}
</style>