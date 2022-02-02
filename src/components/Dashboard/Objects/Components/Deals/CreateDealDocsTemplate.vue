<template>
  <b-modal
      ref="creation-content"
      id="creation-content"
      :title="$t('add')"
      size="lg"
  >
    <ValidationObserver ref="validation-observer" v-slot="{ handleSubmit }">
      <form
          class="form__password"
          @submit.prevent="handleSubmit(submitNewDocs)"
      >
        <!--  FILE UPLOAD  -->
        <ValidationProvider
            rules="required"
            :name="$t('objects.deal_file')"
            v-slot="{errors}"
        >
          <b-form-group
              label-cols="6"
              label-cols-lg="3"
              :label="$t('objects.deal_file')"
              label-for="form_file"
          >
            <b-form-file
                id="form_file"
                v-model="form.file"
                value="File"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
            ></b-form-file>
          </b-form-group>
          <span class="error__provider">{{ errors[0] }}</span>
        </ValidationProvider>

        <!--  SELECT CATEGORY  -->
        <ValidationProvider
            rules="required"
            :name="$t('objects.select_category')"
            v-slot="{errors}"
        >
          <b-form-group
              label-cols="6"
              label-cols-lg="3"
              :label="$t('objects.select_category')"
              label-for="form_selection_category"
          >
            <b-form-select
                v-model="form.category"
                :options="categoryOptions"
                id="form_selection_category"
            >
              <template #first>
                <b-form-select-option :value="null" disabled>
                  {{ $t('objects.select_category') }}
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
          <span class="error__provider">{{ errors[0] }}</span>
        </ValidationProvider>

        <!--  SELECT TYPE  -->
        <b-form-group
            v-if="showPaymentType"
            label-cols="6"
            label-cols-lg="3"
            :label="$t('payment_type')"
            label-for="form_selection_type"
        >
          <b-form-select
              v-model="form.type"
              :options="typeOptions"
              id="form_selection_type"
          >
            <template #first>
              <b-form-select-option :value="null" disabled>
                {{ $t('payment_type') }}
              </b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>

        <!-- MAKE IT THE MAIN CONTRACT  -->
        <b-form-checkbox
            class="d-flex justify-content-end"
            name="checkbox-for-contract"
            v-model="form.main"
            :value="1"
            :unchecked-value="0"
        >
          {{ $t('objects.make_it_main_contract') }}
        </b-form-checkbox>

        <!--  CHOOSE LANGUAGE  -->
        <div class="d-flex justify-content-end mt-4">
          <b-form-group
              v-slot="{ ariaDescribedby }"
          >
            <b-form-radio-group
                size="lg"
                id="radio-group-1"
                v-model="selected"
                :options="options"
                :aria-describedby="ariaDescribedby"
                name="radio-options"
            ></b-form-radio-group>
          </b-form-group>
        </div>
      </form>
    </ValidationObserver>
    <!--  MODAL FOOTER    -->
    <template #modal-footer="{ ok, cancel, hide }">
      <div class="d-flex justify-content-end">
        <b-button class="cancel__button" variant="light" @click="cancel()">
          {{ $t("cancel") }}
        </b-button>

        <b-overlay
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
        >
          <b-button
              type="submit"
              @click="submitNewDocs"
              class="submit__button"
              variant="success"
          >
            <i class="fas fa-save" v-if="!loading"></i>
            <span class="save__button">{{ $t("save") }}</span>
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          </b-button>
        </b-overlay>
      </div>
    </template>
  </b-modal>
</template>

<script>
import api from "@/services/api";

export default {
  name: "CreateDealDocsTemplate",
  emits: ['update-content'],
  data() {
    return {
      loading: false,
      selected: 'uz',
      form: {
        file: null,
        type: null,
        language: 'uz',
        category: null,
        main: 0
      },
      categoryOptions: [
        {value: 'sale', text: this.$t('objects.sale')},
        {value: 'reserve', text: this.$t('objects.booking')},
        // {value: 'not_initial', text: this.$t('free_of_charge')}
      ],
      typeOptions: [
        {value: 'full', text: this.$t('full')},
        {value: 'monthly', text: this.$t('monthly')}
      ],
      options: [
        {text: 'uz', value: 'uz'},
        {text: 'ru', value: 'ru'}
      ]
    }
  },
  computed: {
    showPaymentType() {
      return this.form.category !== 'not_initial'
    }
  },
  methods: {
    async submitNewDocs() {
      if (!this.loading) {
        const validation = await this.$refs['validation-observer'].validate()
        if (validation) {
          const data = Object.assign({}, this.form)
          const form = new FormData()
          for (let [key, value] of Object.entries(data)) {
            if (data[key] === null && key !== 'main') {
              delete data[key]
            } else {
              form.append(key, value)
            }
          }

          this.loading = true
          const {id} = this.$route.params
          await api.objects.addNewContract({id, form})
              .then(() => {
                this.$refs["creation-content"].hide()
                this.$emit('update-content', {category: this.form.category})
                this.setInitialPropertyForm()
              })
              .catch((error) => {
                this.toastedWithErrorCode(error)
              })
              .finally(() => {
                this.loading = false
              })
        }
      }
    },
    setInitialPropertyForm() {
      for (let key of Object.keys(this.form)) {
        const property = this.form[key]
        const makeNullProperties = ['type,category']
        const findIndex = makeNullProperties.findIndex(nullProperty => nullProperty === property)
        if (findIndex !== -1)
          this.form[key] = null
        else if (key === 'language')
          this.form[key] = 'uz'
        if (key === 'main')
          this.form[key] = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.submit__button {
  margin: 0 !important;
}

.cancel__button {
  margin: 0 1rem 0 0 !important;
}

.save__button {
  color: white;
}

.error__provider {
  color: red;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}
</style>