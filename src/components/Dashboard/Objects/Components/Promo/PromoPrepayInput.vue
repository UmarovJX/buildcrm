<template>
  <ValidationProvider
      :name="`${$t('promo.promo_rate')}`"
      :rules="rules"
      v-slot="{ errors }"
      class="mt-3"
      tag="div"
      ref="prepay-input"
  >
    <label class="mb-2" for="prepay-input-percent"> {{ $t('promo.promo_rate') }} </label>
    <div class="pl-0">
      <div class="pl-0 w-100 prepay__input__content">
        <b-input-group class="col-6 pr-2 pl-0 mb-3">
          <template #append>
            <b-input-group-text class="percent__icon">
                <span class="px-1">
                  <i class="fas fa-percent"></i>
                </span>
            </b-input-group-text>
          </template>
          <b-form-input
              v-model="prepayPercent"
              type="number"
              id="prepay-input-percent"
              :placeholder="$t('promo.promo_rate')"
              :max="100"
              :min="0"
              @keyup.enter="submitPrepay"
          >
          </b-form-input>
        </b-input-group>
      </div>
      <div
          class="prepay__addition__button col-6 pr-2 d-flex justify-content-end align-items-center"
          :class="{ 'justify-content-between pl-0' : (outdoorErrors || errors[0]) }"
      >
        <span class="error__provider" v-if="errors[0]">
          {{ errors[0] }}
        </span>
        <span
            v-else-if="error.empty.show"
            class="error__provider"
        >
          {{ error.empty.message }}
        </span>
        <span
            v-else-if="error.sameContent.show"
            class="error__provider"
        >
          {{ error.sameContent.message }}
        </span>
        <button
            class="btn btn-green-bg mr-0 mt-md-0"
            @click="submitPrepay"
        >
          Добавить
        </button>
      </div>
    </div>
  </ValidationProvider>
</template>

<script>
export default {
  name: "PromoPrepayInput",
  emit: ['add-prepay-content'],
  props: {
    prepaysListLength: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      prepayPercent: '',
      focused: false,
      rules: 'required|max_value:100|min_value:0',
      error: {
        sameContent: {
          show: false,
          message: "Kiritilgan tarif yuqorida qo'shilgan"
        },
        empty: {
          show: false,
          message: "Tarif qo'shishingiz kerak"
        }
      }
    }
  },
  watch: {
    prepaysListLength: {
      handler(length) {
        if (length) {
          this.rules = ''
          this.error.empty.show = false
        } else {
          this.rules = 'required|max_value:100|min_value:0'
          this.error.empty.show = true
        }
      }
    },
    prepayPercent(prepay) {
      if (prepay.length) {
        this.rules = 'required|max_value:100|min_value:0'
      } else {
        this.rules = ''
      }

      this.error.sameContent.show = false
      this.error.empty.show = false
    }
  },
  computed: {
    outdoorErrors() {
      const {sameContent, empty} = this.error
      return empty.show || sameContent.show
    }
  },
  methods: {
    submitPrepay() {
      this.addNewPrepayContent()
    },
    async addNewPrepayContent() {
      const {valid} = await this.$refs['prepay-input'].validate()
      if (valid) {
        this.$emit('add-prepay-content', this.prepayPercent)
      }
    },
    showWarningForSameValue() {
      this.error.sameContent.show = true
    },
    resetContent() {
      this.$refs['prepay-input'].reset()
      this.prepayPercent = ''
      this.focused = false
    },
    activateEmptyError() {
      this.error.empty.show = !this.prepaysListLength;
    }
  }
}
</script>

<style lang="scss" scoped>
.prepay__input__content {
  input {
    height: 40px !important;
  }

  .percent__icon {
    height: 40px;

    i {
      color: #000000;
    }
  }

}

.prepay__addition__button .btn {
  padding: 4px;
  font-size: 12px;
  height: 40px !important;
}

</style>