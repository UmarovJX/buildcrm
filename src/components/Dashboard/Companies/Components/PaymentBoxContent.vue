<template>
  <div
      class="payment__content-detail"
  >
    <span>
      <span>
        <span>
          <base-contracts-icon fill="#A78BFA"/>
          <p>{{ getName(detail.bank_name) }}</p>
        </span>
        <div
            v-if="editPermission||deletePermission"
            class="float-right dropdown my-dropdown dropleft"
        >
            <button
                type="button"
                class="dropdown-toggle"
                data-toggle="dropdown"
            >
              <i class="far fa-ellipsis-h"></i>
            </button>

            <div class="dropdown-menu">
              <b-button
                  v-if="editPermission"
                  @click="makePrimaryPayment"
                  v-model="isPrimary"
                  name="check-button"
                  switch
                  class="dropdown-item dropdown-item--inside">
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
                  class="dropdown-item  dropdown-item--inside"
                  @click="deleteCompany()"
              >
                {{ $t('delete') }}
              </b-button>
            </div>
        </div>
      </span>
      <span :class="[detail.is_primary ? 'stamp active__payment__content' : 'stamp']"
      >
        {{ $t("companies.active_payment") }}
      </span>
    </span>
    <hr/>
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

<script>
import api from "@/services/api";
import BaseContractsIcon from "@/components/icons/BaseContractsIcon";
import PaymentAccount from "@/permission/payment_account";

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
  emits: ['edit-selected-payment', 'delete-payment', 'update-company'],
  components: {
    BaseContractsIcon
  },
  data() {
    return {
      isPrimary: this.checker(this.detail.is_primary),
      editPermission: PaymentAccount.getPaymentAccountEditPermission(),
      deletePermission: PaymentAccount.getPaymentAccountDeletePermission()
    }
  },
  watch: {
    isPrimary() {
      this.makePrimaryPayment()
    }
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
        console.log("sorry")
      }
    },
    checker(data) {
      if (data === 1) {
        return 0
      } else {
        return 1
      }
    },
    makePrimaryPayment() {
      const data = {
        is_primary: this.isPrimary
      }
      api.companies.changeStatusCompany(this.company, this.detail.id, data)
          .then((response) => {
            const {message} = response.data
            this.$emit("update-company", {message})
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
            console.log("hello error", this.company, this.detail.id, data);
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

<style lang="scss" scoped>
hr {
  margin: 26px 0;
  border: 0.8px solid #E5E7EB;
  background: #E5E7EB;
}

.stamp {
  background: #fff;
  width: max-content;
  padding: 5px 12px;
  color: #9CA3AF;
  border: none;
  border-radius: 32px;
}

.payment__content-detail {
  border: none !important;
  border-radius: 30px;
  padding: 1.5rem;
  font-size: 14px;
  width: auto;
  margin-bottom: 4em;
  background: #F3F4F6;
  color: #9CA3AF;
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
    color: #9CA3AF;
    font-family: 'Inter';
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
        font-family: 'Craftwork Sans';
        font-style: normal;
        font-weight: 900;
        font-size: 16px;
        margin-bottom: 0;
        color: #7C3AED;
      }

      .float-right {
        .dropdown {
          button {
            background: transparent;
            box-shadow: none;

            i {
              color: #4B5563;
            }
          }
        }
      }
    }
  }
}

.active__payment__content {
  background-color: #7C3AED;
  color: white;
}

.make__primary {
  display: flex;
  justify-content: flex-end;
}
</style>