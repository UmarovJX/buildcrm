<script>
import api from '@/services/api'
import BaseContractsIcon from '@/components/icons/BaseContractsIcon'
import PaymentAccount from '@/permission/payment_account'

export default {
  name: 'PaymentBoxContent',
  components: {
    BaseContractsIcon,
  },
  props: {
    detail: {
      type: Object,
      required: true,
    },
    company: {
      type: [Number, String],
      required: true,
    },
  },
  emits: ['edit-selected-payment', 'delete-payment', 'update-company'],
  data() {
    return {
      isPrimary: this.checker(this.detail.is_primary),
      editPermission: PaymentAccount.getPaymentAccountEditPermission(),
      deletePermission: PaymentAccount.getPaymentAccountDeletePermission(),
    }
  },
  watch: {
    isPrimary() {
      this.makePrimaryPayment()
    },
  },
  methods: {
    deleteCompany() {
      const company_id = this.$route.params.companyId
      this.$emit('delete-payment', company_id, this.detail.id)
    },
    editSelectedPayment() {
      if (this.$props.detail) {
        this.$emit('edit-selected-payment', this.$props.detail)
      } else {
        console.log('sorry')
      }
    },
    checker(data) {
      if (data === 1) {
        return 0
      }
      return 1
    },
    makePrimaryPayment() {
      const data = {
        is_primary: this.isPrimary,
      }
      api.companies
        .changeStatusCompany(this.company, this.detail.id, data)
        .then(response => {
          const { message } = response.data
          this.$emit('update-company', { message })
        })
        .catch(error => {
          this.toastedWithErrorCode(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    getName(name) {
      if (localStorage.locale) return name[localStorage.locale]
      return name.ru
    },
  },
}
</script>

<template>
  <div class="payment__content-detail">
    <span>
      <span>
        <span>
          <base-contracts-icon fill="#A78BFA" />
          <p>{{ getName(detail.bank_name) }}</p>
        </span>
        <div
          v-if="editPermission || deletePermission"
          class="float-right dropdown my-dropdown dropleft"
        >
          <button
            type="button"
            class="dropdown-toggle"
            data-toggle="dropdown"
          >
            <i class="far fa-ellipsis-h" />
          </button>

          <div class="dropdown-menu">
            <b-button
              v-if="editPermission"
              v-model="isPrimary"
              name="check-button"
              switch
              class="dropdown-item dropdown-item--inside"
              @click="makePrimaryPayment"
            >
              <span v-if="!detail.is_primary">{{ $t("activate") }}</span>
              <span v-else>{{ $t("deactivate") }}</span>
            </b-button>
            <b-button
              v-if="editPermission"
              class="dropdown-item dropdown-item--inside"
              @click="editSelectedPayment()"
            >
              {{ $t("edit") }}
            </b-button>

            <b-button
              v-if="deletePermission"
              class="dropdown-item dropdown-item--inside"
              @click="deleteCompany()"
            >
              {{ $t("delete") }}
            </b-button>
          </div>
        </div>
      </span>
      <span
        v-if="detail.is_primary"
        class="stamp active__payment__content"
      >
        {{ $t("companies.active_payment") }}
      </span>
      <span
        v-else
        class="stamp"
      >
        {{ $t("companies.inactive_payment") }}
      </span>
    </span>
    <hr>
    <p>
      <span>{{ $t("companies.payment_account") }}:</span>
      <span>{{ detail.payment_account }}</span>
    </p>
    <p>
      <span>{{ $t("companies.mfo") }}:</span>
      <span>{{ detail.mfo }}</span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
hr {
  margin: 26px 0;
  border: 0.8px solid #e5e7eb;
  background: #e5e7eb;
}

.stamp {
  background: #fff;
  width: max-content;
  padding: 5px 12px;
  margin-top: 12px !important;
  color: #9ca3af;
  border: none;
  border-radius: 32px;
}

.payment__content-detail {
  border: none !important;
  border-radius: 30px;
  padding: 1.5rem;
  font-size: 14px;
  width: auto;
  background: #f3f4f6;
  color: #9ca3af;
  min-width: 28rem;

  .dropdown-menu {
    border: none;
    border-radius: 20px;
    padding: 20px 12px;
    min-width: 15rem;

    button {
      margin-bottom: 30px;
    }

    button:nth-child(3) {
      margin-bottom: 0;
    }
  }

  p {
    display: flex;
    gap: 5px;
    color: #9ca3af;
    font-family: Inter, serif;
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
  }

  span:nth-child(1) {
    span {
      margin: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;

      p {
        font-family: CraftworkSans, serif;
        font-style: normal;
        font-weight: 900;
        font-size: 16px;
        margin-bottom: 0;
        color: #7c3aed;
      }

      .float-right {
        .dropdown {
          button {
            background: transparent;
            box-shadow: none;

            i {
              color: #4b5563;
            }
          }
        }
      }
    }
  }
}

.active__payment__content {
  background-color: #7c3aed;
  color: white;
}

.make__primary {
  display: flex;
  justify-content: flex-end;
}
</style>
