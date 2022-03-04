<template>
  <b-modal
      size="lg"
      :no-close-on-backdrop="true"
      :hide-header-close="true"
      :no-close-on-esc="true"
      id="delete-plan-modal"
  >
    <b-overlay :show="showLoading" rounded="sm">
      <p>Bu xonadon rejasida {{ removePlan.apartments_count }} kvartira mavjud, boshqa rejaga o'tkazishingiz kerak</p>
      <b-form-group
          v-slot="{ ariaDescribedby }"
      >
        <label
            class="d-flex align-items-center form__radio my-2"
            v-for="plan in planList"
            :key="plan.id"
            :for="plan.id"
        >
          <b-form-radio
              :value="`${plan.id}`"
              v-model="bindingPlan"
              :aria-describedby="ariaDescribedby"
              name="some-radios"
              :id="`${plan.id}`"
          >
          </b-form-radio>
          <span class="d-flex align-items-center">
            <!--            <picture>-->
            <!--              <source :srcset="plan.image">-->
            <!--              <img-->
            <!--                  src="@/assets/img/no-image.jpg"-->
            <!--                  alt="plan image"-->
            <!--                  width="150"-->
            <!--                  height="100"-->
            <!--                  style="cursor: pointer; object-fit: contain"-->
            <!--              />-->
            <!--            </picture>-->
            <span class="mx-4">
              {{ $t('apartments.list.area') }} : {{ plan.area }}
            </span>
            <span v-if="plan.balcony_area">
              {{ $t('objects.create.plan.balcony_area') }} : {{ plan.balcony_area }}
            </span>
          </span>
        </label>
      </b-form-group>
      <span
          v-if="error.show"
          class="error__provider"
      >
        {{ error.message }}
      </span>
      <template #overlay>
        <div class="text-center">
          <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
          <p id="cancel-label">Please wait...</p>
        </div>
      </template>
    </b-overlay>

    <template #modal-footer>
      <div class="d-flex justify-content-end">
        <b-button
            variant="danger"
            class="mt-0 mr-4"
            :disabled="showLoading"
            @click="closeModal"
        >
          {{ $t('close') }}
        </b-button>
        <b-overlay
            :show="showLoading"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
        >
          <b-button
              class="mt-0 mr-0"
              variant="primary"
              :disabled="showLoading"
              @click="saveExportApartments"
          >
            {{ $t('save') }}
          </b-button>
        </b-overlay>
      </div>
    </template>
  </b-modal>
</template>

<script>
import api from "@/services/api";

export default {
  name: "DeleteHasApartment",
  props: {
    planList: {
      type: Array,
      required: true
    },
    removePlan: {
      type: Object,
      required: true
    }
  },
  emits: ['close-delete-modal', 'successfully-updated'],
  data() {
    return {
      showLoading: false,
      bindingPlan: null,
      error: {
        show: false,
        message: this.$t('type_plan.plan_required')
      }
    }
  },
  watch: {
    bindingPlan(last) {
      if (last) {
        this.error.show = false
      }
    }
  },
  methods: {
    async saveExportApartments() {
      if (this.bindingPlan) {
        this.showLoading = true
        const objectId = this.$route.params.id
        const planId = this.removePlan.id
        const body = {
          plan_id: this.bindingPlan
        }
        api.plans.changePlan(objectId, planId, body)
            .then(() => {
              this.$emit('successfully-updated')
            })
            .catch(() => {
              const message = 'Something went wrong .' +
                  'We are working on getting this fixed as soon as we can.' +
                  'You may be able to try again.'
              this.$toasted.show(message, {
                type: 'error'
              })
            })
            .finally(() => {
              this.showLoading = false
            })
      } else {
        this.error.show = true
      }
    },
    closeModal() {
      this.$emit('close-delete-modal')
    }
  }
}
</script>

<style lang="scss" scoped>
.form__radio {
  background-color: var(--background-color-dropdown);
  border-radius: 0.5rem;
  cursor: pointer;
  padding: 1rem;
}

.error__provider {
  color: red;
}
</style>