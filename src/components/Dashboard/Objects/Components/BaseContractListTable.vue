<script>
import api from '@/services/api'
import { mapGetters } from 'vuex'
import TemplatesPermission from '@/permission/templates'
import XDropdown from '@/components/ui-components/dropdown/XDropdown.vue'

export default {
  name: 'ContractListTable',
  components: { XDropdown },
  props: {
    contracts: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  emits: ['update-content', 'update-loading'],
  data() {
    return {
      deletePermission: TemplatesPermission.getTemplatesDeletePermission(),
      downloadPermission: TemplatesPermission.getTemplatesDownloadPermission(),
      primaryPermission: TemplatesPermission.getTemplatesPrimaryPermission(),
      sortBy: 'main',
      sortDesc: true,
      showLoading: false,
    }
  },
  computed: {
    ...mapGetters({
      permission: 'getPermission',
    }),
    fields() {
      const list = [
        {
          key: 'index',
          label: '#',
        },
        {
          key: 'type',
          label: this.$t('objects.deal_template.type'),
        },
        {
          key: 'language',
          label: this.$t('clients.language'),
        },
        {
          key: 'document_type',
          label: this.$t('document_type'),
          formatter: type => {
            if (type === 'legal') {
              return this.$t('legal_entity')
            }

            return this.$t('physical_person')
          },
        },
        {
          key: 'created',
          label: this.$t('created_at'),
        },
        {
          key: 'main',
          label: '',
        },
        {
          key: 'actions',
          label: '',
        },
      ]

      if (this.type === 'reissue') {
        return list.filter(fl => fl.key !== 'type')
      }

      return list
    },
    showUnselectWarning() {
      const count = this.contracts.filter(contract => contract.main)
      if (this.type === 'sale') {
        return count.length < 3
      }

      if (this.type === 'reservation') {
        return count.length < 1
      }

      return 0
    },
  },
  watch: {
    showLoading(value) {
      this.$emit('update-loading', value)
    },
  },
  methods: {
    getCategoryName(type) {
      return this.$t(`${type}`)
    },
    downloadDocumentURl(url) {
      return url
    },
    timeFormatter(timeSetter) {
      const time = new Date(timeSetter)
      const minutes = this.formatSmallTime(time.getMinutes())
      const hours = this.formatSmallTime(time.getHours())
      return `${minutes}:${hours}`
    },
    dayFormatter(timeSetter) {
      const time = new Date(timeSetter)
      const date = this.formatSmallTime(time.getDate())
      const month = this.formatSmallTime(time.getMonth() + 1)
      const year = time.getFullYear()
      return `${date}.${month}.${year}`
    },
    formatSmallTime(time) {
      if (time < 10) {
        return `0${time}`
      }
      return time
    },
    makeItMain(contractId) {
      const { id: objectId } = this.$route.params
      this.showLoading = true
      api.objectsV2
        .makeContractPrimary({ objectId, contractId })
        .then(() => {
          this.$emit('update-content')
        })
        .catch(error => {
          this.toastedWithErrorCode(error)
        })
        .finally(() => {
          this.showLoading = false
        })
    },
    async deleteContract(contractId) {
      this.showLoading = false
      const objectId = this.$route.params.id
      await api.objectsV2
        .deleteContract({ objectId, contractId })
        .then(() => {
          const findIndex = this.contracts.findIndex(
            contract => contract.id === contractId,
          )
          this.contracts.splice(findIndex, 1)
          this.$emit('update-content')
        })
        .catch(error => {
          this.toastedWithErrorCode(error)
        })
        .finally(() => {
          this.showLoading = false
        })
    },
  },
}
</script>

<template>
  <div>
    <b-alert
      v-if="showUnselectWarning"
      variant="danger"
      class="py-2 mb-0"
      show
    >
      <div
        class="alert-body py-0 d-flex w-100 align-items-center justify-content-center"
      >
        <span>
          {{ $t("objects.deal_template.warning_message") }}
        </span>
      </div>
    </b-alert>
    <b-table
      v-model:sort-by="sortBy"
      v-model:sort-desc="sortDesc"
      sticky-header
      borderless
      responsive
      :items="contracts"
      :fields="fields"
      show-empty
      sort-icon-left
      class="custom-table"
      :empty-text="$t('no_data')"
    >
      <template
        #empty="scope"
        class="text-center"
      >
        <span class="d-flex justify-content-center align-items-center">
          {{ scope.emptyText }}
        </span>
      </template>

      <template #cell(index)="data">
        {{ data.index + 1 }}
      </template>

      <template #table-busy>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </template>

      <template #cell(type)="data">
        <span>
          {{ getCategoryName(data.item.type) }}
        </span>
      </template>

      <template #cell(category)="data">
        {{ data.item.category }}
      </template>

      <template #cell(language)="data">
        {{ data.item.language }}
      </template>

      <template #cell(created)="data">
        {{ dayFormatter(data.item.created_at) }}
      </template>

      <template #cell(main)="data">
        <span
          v-if="data.item.main"
          class="star__icon"
        >
          <i class="fas fa-check-double" />
        </span>
      </template>

      <template #cell(actions)="data">
        <div class="float-right">
          <x-dropdown v-if="primaryPermission || downloadPermission || deletePermission">
            <a
              v-if="!data.item.main && primaryPermission"
              href="#"
              class="dropdown-item dropdown-item--inside"
              @click="makeItMain(data.item.id)"
            >
              <span>
                <i class="fas fa-pen" />
              </span>
              <span class="ml-2">
                {{ $t("objects.make_it_main_contract") }}
              </span>
            </a>

            <a
              v-if="downloadPermission"
              class="dropdown-item dropdown-item--inside"
              :href="downloadDocumentURl(data.item.path)"
            >
              <span class="download__icon">
                <i class="fas fa-download" />
              </span>
              <span class="ml-2">{{ $t("contracts.download") }}</span>
            </a>

            <a
              v-if="deletePermission"
              href="#"
              class="dropdown-item dropdown-item--inside"
              @click="deleteContract(data.item.id)"
            >
              <span>
                <i class="far fa-trash" />
              </span>
              <span class="ml-3">
                {{ $t("delete") }}
              </span>
            </a>
          </x-dropdown>
        </div>
      </template>
    </b-table>
  </div>
</template>

<style scoped lang="scss">
.download__icon {
  cursor: pointer;
}

.star__icon {
  color: var(--plus-icon);
}
</style>
