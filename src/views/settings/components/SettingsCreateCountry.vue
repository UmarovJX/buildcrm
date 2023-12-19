<script>
import { XModalCenter } from '@/components/ui-components/modal-center'
import { XFormSelect } from '@/components/ui-components/form-select'
import { XFormInput } from '@/components/ui-components/form-input'
import api from '@/services/api'
import { makeProp } from '@/util/props'
import {
  PROP_TYPE_ARRAY,
  PROP_TYPE_OBJECT,
  PROP_TYPE_STRING,
} from '@/constants/props'

export default {
  name: 'SettingsCreateCountry',
  components: {
    XModalCenter,
    XFormSelect,
    XFormInput,
  },
  props: {
    countries: makeProp(PROP_TYPE_ARRAY, []),
    engagementType: makeProp(PROP_TYPE_STRING, 'create', type => ['create', 'edit'].includes(type)),
    editItem: makeProp(PROP_TYPE_OBJECT, {}),
  },
  emits: ['close-creating-country', 'added-new-country'],
  data() {
    const countryFormSchema = {
      country: null,
      comment: '',
    }

    return {
      applyButtonLoading: false,
      countryFormSchema,
      countryForm: { ...countryFormSchema },
      countriesList: [],
    }
  },
  async created() {
    await this.fetchCountriesList().then(() => {
      if (this.engagementType === 'edit') {
        this.setupField()
      }
    })
  },
  methods: {
    setupField() {
      this.countryForm.country = this.editItem.code
    },
    async fetchCountriesList() {
      if (this.countriesList.length) {
        return
      }

      try {
        const { data } = await api.settingsV2.getAllCountries({
          params: {
            fields: 'name,cca3',
          },
        })

        this.countriesList = data
          .sort((a, b) => {
            if (a.name.common > b.name.common) {
              return 1
            }
            return -1
          })
          .map(({ name, cca3 }) => ({
            text: name.common,
            value: cca3,
          }))
      } catch (e) {
        this.toastedWithErrorCode(e)
      }
    },
    clearForm() {
      this.countryForm = { ...this.countryFormSchema }
    },
    closeCreatingModal() {
      this.clearForm()
      this.$emit('close-creating-country')
    },
    startLoading() {
      this.applyButtonLoading = true
    },
    finishLoading() {
      this.applyButtonLoading = false
    },
    async submitForm() {
      const { country } = this.countryForm
      const isSatisfied = await this.$refs.creatingCountryObserver.validate()
      const findCtyInDb = this.countries.find(cty => cty.code === country)

      if (findCtyInDb) {
        this.$emit('close-creating-country')
        this.clearForm()
        return
      }

      if (this.engagementType === 'edit') {
        isSatisfied && (await this.updateCountry(isSatisfied))
      } else {
        isSatisfied && (await this.createNewCountry(isSatisfied))
      }
    },
    async updateCountry() {
      try {
        this.startLoading()
        const { country } = this.countryForm
        const { text: countryName, value: code } = this.countriesList.find(
          cty => cty.value === country,
        )
        const response = await api.settingsV2.updateCountryData(
          this.editItem.id,
          {
            name: {
              uz: countryName,
              ru: countryName,
            },
            code,
            is_default: false,
          },
        )
        this.clearForm()
        response && this.$emit('added-new-country')
      } catch (e) {
        this.toastedWithErrorCode(e)
      } finally {
        this.finishLoading()
      }
    },
    async createNewCountry() {
      try {
        const { country } = this.countryForm
        this.startLoading()
        const { text: countryName, value: code } = this.countriesList.find(
          cty => cty.value === country,
        )

        const data = await api.settingsV2.createNewCountry({
          name: {
            uz: countryName,
            ru: countryName,
          },
          code,
          is_default: false,
        })

        if (data) {
          this.clearForm()
          this.$emit('added-new-country')
        }
      } catch (e) {
        this.toastedWithErrorCode(e)
      } finally {
        this.finishLoading()
      }
    },
  },
}
</script>

<template>
  <x-modal-center
    :bilingual="true"
    apply-button-text="save"
    cancel-button-text="cancel"
    footer-class="d-flex justify-content-between x-gap-1"
    apply-button-class="w-100"
    cancel-button-class="w-100"
    :apply-button-loading="applyButtonLoading"
    @close="closeCreatingModal"
    @cancel="closeCreatingModal"
    @apply="submitForm"
  >
    <template #header>
      <h3 class="x-font-size-36px font-craftworksans color-gray-600">
        {{ $t("add_country") }}
      </h3>
    </template>

    <template #body>
      <validation-observer
        ref="creatingCountryObserver"
        class="country-creating-body"
      >
        <validation-provider
          ref="countrySelectVProvider"
          v-slot="{ errors }"
          name="country-select-provider"
          rules="required"
        >
          <x-form-select
            v-model="countryForm.country"
            :options="countriesList"
          />
          <span
            v-if="errors[0]"
            class="error__provider"
          >
            {{ errors[0].replace("country-select-provider", $t("country")) }}
          </span>
        </validation-provider>

        <x-form-input
          v-model="countryForm.comment"
          type="text"
          :placeholder="`${$t('comment')}`"
          class="w-100 mt-2"
        />
      </validation-observer>
    </template>
  </x-modal-center>
</template>

<style lang="scss" scoped>
.country-creating-body {
  margin-top: 3rem;
  margin-bottom: 3rem;
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 1rem;
  font-family: Inter, sans-serif;
  color: var(--gray-600);
}
</style>
