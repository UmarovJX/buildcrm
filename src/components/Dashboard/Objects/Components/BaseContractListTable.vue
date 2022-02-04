<template>
  <b-table
      sticky-header
      borderless
      responsive
      :items="contracts"
      :fields="fields"
      :busy="loading"
      show-empty
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      sort-icon-left
      class="custom-table"
      :empty-text="$t('no_data')"
  >
    <template #empty="scope" class="text-center">
      <span class="d-flex justify-content-center align-items-center">
        {{ scope.emptyText }}
      </span>
    </template>

    <template #table-busy>
      <div class="d-flex justify-content-center w-100">
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
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
      <span class="star__icon" v-if="data.item.main">
        <i class="fas fa-check-double"></i>
      </span>
    </template>

    <template #cell(actions)="data">
      <div class="float-right">
        <div
            class="dropdown my-dropdown dropleft"
        >
          <button
              type="button"
              class="dropdown-toggle"
              data-toggle="dropdown"
          >
            <i class="far fa-ellipsis-h"></i>
          </button>

          <div
              class="dropdown-menu"
          >
            <a
                href="#"
                class="dropdown-item dropdown-item--inside"
                v-if="!data.item.main"
                @click="makeItMain(data.item.id)"
            >
              <span>
                <i class="fas fa-pen"></i>
              </span>
              <span class="ml-2">
                      {{ $t("objects.make_it_main_contract") }}
              </span>
            </a>

            <a
                class="dropdown-item dropdown-item--inside"
                :href="downloadDocumentURl(data.item.path)"
            >
              <span class="download__icon">
                <i class="fas fa-download"></i>
              </span>
              <span class="ml-2">{{ $t('contracts.download') }}</span>
            </a>

            <a href="#"
               class="dropdown-item dropdown-item--inside"
               @click="deleteContract(data.item.id)"
            >
              <span>
                <i class="far fa-trash"></i>
              </span>
              <span class="ml-3">
                {{ $t("delete") }}
              </span>
            </a>
          </div>
        </div>
      </div>
    </template>
  </b-table>
</template>

<script>
import api from "@/services/api";

export default {
  name: "ContractListTable",
  props: {
    contracts: {
      type: Array,
      required: true
    }
  },
  emits: ['update-content'],
  data() {
    return {
      sortBy: "main",
      sortDesc: true,
      loading: false,
      fields: [
        {
          key: "id",
          label: "#",
        },
        {
          key: "type",
          label: this.$t("objects.deal_template.type"),
        },
        {
          key: "language",
          label: this.$t("clients.language"),
        },
        {
          key: 'created',
          label: this.$t('created_at')
        },
        {
          key: 'main',
          label: ''
        },
        {
          key: "actions",
          label: '',
        }
        /*
            {
              key: "category",
              label: this.$t("category"),
            }
        */
      ]
    }
  },
  methods: {
    getCategoryName(type) {
      return this.$t(`${type}`)
    },
    downloadDocumentURl(url) {
      return process.env.VUE_APP_URL + '/' + url
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
      const {id: objectId} = this.$route.params
      api.objects.makeContractPrimary({objectId, contractId})
          .then(() => {
            this.$emit('update-content')
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
    },
    async deleteContract(contractId) {
      this.loading = true
      const objectId = this.$route.params.id
      await api.objects.deleteContract({objectId, contractId})
          .then(() => {
            const findIndex = this.contracts.findIndex(contract => contract.id === contractId)
            this.contracts.splice(findIndex, 1)
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.loading = false
          })
    }
  }
}
</script>


<style scoped lang="scss">
.download__icon {
  cursor: pointer;
}

.star__icon {
  color: var(--plus-icon);
}
</style>