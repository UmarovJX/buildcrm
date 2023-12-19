<script>
import api from '@/services/api'

export default {
  name: 'Confirm',

  props: {
    edit: {
      type: Boolean,
      default: false,
    },
    client: {},
    apartments: {},
    contract: {},
    discounts: {},
    buttons: {},
    order: {},
  },

  emits: ['redirect-to-contract'],

  data() {
    return {
      header: {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      },
    }
  },

  methods: {
    removeBlock() {
      this.$swal({
        title: this.$t('sweetAlert.title'),
        text: this.$t('sweetAlert.text_cancel_agree'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: this.$t('cancel'),
        confirmButtonText: this.$t('sweetAlert.yes_close'),
      }).then(result => {
        if (result.value) {
          this.$emit('redirect-to-contract')
        }
      })
    },

    async expiredConfirm() {
      try {
        this.loading = true
        await api.orders
          .deactivateOrderHold(this.order.uuid)
          .then(() => {
            this.loading = false
            this.$router.push({
              name: 'apartments',
            })
          })
          .catch()
      } catch (error) {
        this.loading = false
        if (!error.response) {
          this.toasted('Error: Network Error', 'error')
        } else if (error.response.status === 403) {
          this.toasted(error.response.data.message, 'error')
        } else if (error.response.status === 401) {
          this.toasted(error.response.data.message, 'error')
        } else if (error.response.status === 500) {
          this.toasted(error.response.data.message, 'error')
        } else {
          this.toasted(error.response.data.message, 'error')
        }
      }
    },
  },
}
</script>

<template>
  <div class="new-object p-3">
    <!-- Комментария -->
    <div class="">
      <label>{{ $t("userComment") }}</label>
      <textarea
        v-model="contract.comment"
        rows="3"
        cols="3"
        class="form-control"
      />
    </div>

    <!-- error msg -->
    <div
      v-if="error"
      class="alert alert-danger mt-3"
    >
      <ul>
        <li
          v-for="(error, index) in errors"
          :key="index"
        >
          <span
            v-for="msg in error"
            :key="msg"
          >
            {{ msg }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Btns -->
    <div class="sidebar-btns">
      <div class="row justify-content-center">
        <button
          type="button"
          class="btn text-dark mx-md-2"
          @click="removeBlock"
        >
          {{ $t("cancel") }}
        </button>

        <button
          type="button"
          class="btn btn-secondary ml-2"
          @click="
            [
              (contract.step = 1),
              (buttons.next = true),
              (buttons.confirm = false),
            ]
          "
        >
          <i class="fa fa-chevron-circle-left" />
          {{ $t("back") }}
        </button>

        <template v-if="!edit">
          <button
            v-if="!buttons.loading && buttons.confirm"
            type="submit"
            class="btn btn-success mr-0"
          >
            {{ $t("create_agree") }}
            <i class="fa fa-file-contract" />
          </button>
          <button
            v-if="buttons.loading && buttons.confirm"
            type="button"
            class="btn btn-success mr-0"
          >
            {{ $t("create_agree") }}
            <i class="fas fa-spinner fa-spin" />
          </button>
        </template>
        <template v-else>
          <button
            v-if="!buttons.loading && buttons.confirm"
            type="submit"
            class="btn btn-success mr-0"
          >
            {{ $t("save_changes") }}
            <i class="fa fa-file-contract" />
          </button>
          <button
            v-if="buttons.loading && buttons.confirm"
            type="button"
            class="btn btn-success mr-0"
          >
            {{ $t("save_changes") }}
            <i class="fas fa-spinner fa-spin" />
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
