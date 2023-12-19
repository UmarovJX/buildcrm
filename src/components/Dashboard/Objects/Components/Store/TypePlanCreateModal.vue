<script>
import api from '@/services/api'

export default {
  props: {
    object: {},
  },

  data: () => ({
    plan: {
      id: null,
      object_id: null,
      name: null,
      area: null,
      balcony: false,
      balcony_area: null,
      deleted: false,
    },

    header: {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    },
  }),

  methods: {
    resetModal() {
      this.$bvModal.hide('modal-create-type-plan')
      this.$emit('RemovePlan')
      this.clearDiscount()
    },

    clearDiscount() {
      this.plan = {
        name: null,
        area: null,
        balcony: false,
        balcony_area: null,
        deleted: false,
      }
    },

    async SaveDiscount() {
      try {
        const { data, status } = await api.objects.createObjectPlan(
          this.object.id,
          this.plan,
        )
        if (status === 201) {
          this.$emit('savePlan', data)
          this.$bvModal.hide('modal-create-type-plan')
          this.clearDiscount()
        }
      } catch (error) {
        this.toastedWithErrorCode(error)

        if (error.response.status === 422) {
          this.error = true
          this.errors = error.response.data
        }
      }
    },
  },
}
</script>

<template>
  <div>
    <b-modal
      id="modal-create-type-plan"
      ref="modal"
      class="py-4"
      :title="$t('objects.create.new_type_plan')"
      hide-footer
      no-close-on-backdrop
    >
      <form
        class="my-form"
        @submit.prevent="SaveDiscount"
      >
        <div class="col-12">
          <div class="mb-3">
            <label
              class="d-block"
              for="name"
            >{{
              $t("objects.create.plan.name")
            }}</label>
            <div class="flex-grow-1">
              <input
                id="name"
                v-model="plan.name"
                class="my-form__input"
                type="text"
                required
              >
            </div>
          </div>

          <div class="mb-3">
            <label
              class="d-block"
              for="area"
            >{{
              $t("objects.create.plan.area")
            }}</label>
            <div class="flex-grow-1">
              <input
                id="area"
                v-model="plan.area"
                class="my-form__input"
                type="number"
                min="1"
                step="0.1"
                required
              >
            </div>
          </div>

          <div class="mb-3">
            <label
              class="d-block"
              for="area"
            >{{
              $t("objects.create.plan.balcony")
            }}</label>
            <div class="flex-grow-1">
              <b-form-checkbox
                v-model="plan.balcony"
                switch
                size="lg"
              />
            </div>
          </div>

          <div
            v-if="plan.balcony"
            class="mb-3"
          >
            <label
              class="d-block"
              for="balcony_area"
            >{{
              $t("objects.create.plan.balcony_area")
            }}</label>
            <div class="flex-grow-1">
              <input
                id="balcony_area"
                v-model="plan.balcony_area"
                class="my-form__input"
                step="0.1"
                type="number"
                min="1"
                required
              >
            </div>
          </div>
        </div>

        <div
          class="mt-4 d-flex justify-content-md-start justify-content-center float-right"
        >
          <button
            type="button"
            class="btn btn-default mr-2"
            @click="resetModal"
          >
            {{ $t("cancel") }}
          </button>

          <button
            type="submit"
            class="btn btn-primary"
          >
            {{ $t("save") }}
          </button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<style scoped></style>
