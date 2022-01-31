<template>
  <main>
    <div class="app-content">
      <div class="d-flex justify-content-end">
        <b-button
            v-b-modal.creation-content
            variant="primary"
        >
          <i class="fal fa-plus mr-2"></i>
          {{ $t("add") }}
        </b-button>
      </div>
      <div class="pt-2">
        <b-table
            sticky-header
            borderless
            responsive
            :items="deals"
            :fields="fields"
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
            {{ data.item.type }}
          </template>

          <template #cell(category)="data">
            {{ data.item.category }}
          </template>

          <template #cell(language)="data">
            {{ data.item.language }}
          </template>

          <template #cell(main)="data">
            <span v-if="data.item.main">
              {{ data.item.main }}
            </span>
            <span v-else>
              0
            </span>
          </template>

          <template #cell(created)="data">
            {{ dayFormatter(data.item.created_at) }}
          </template>

          <template #cell(download)="data">
            <a
                :href="downloadDocumentURl(data.item.path)"
                class="download__icon">
              <i class="fas fa-download"></i>
            </a>
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
                  <router-link
                      :to="{ name: 'edit-branch', params: { id: data.item.id, historyForm:data.item } }"
                      :class="'dropdown-item dropdown-item--inside'"
                  >
                    <span>
                      <i class="fas fa-pen"></i>
                    </span>
                    <span class="ml-2">
                      {{ $t("objects.make_it_main_contract") }}
                    </span>
                  </router-link>

                  <button
                      class="dropdown-item dropdown-item--inside"
                      @click="deleteBranch(data.item.id)"
                  >
                    <span>
                      <i class="far fa-trash"></i>
                    </span>
                    <span class="ml-2">
                      {{ $t("delete") }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </b-table>
      </div>
    </div>
    <create-deal-docs-template></create-deal-docs-template>
    <b-overlay :show="loading" no-wrap opacity="0.5" style="z-index: 2222">
      <template #overlay>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </template>
    </b-overlay>
  </main>
</template>

<script>
import api from "@/services/api";
import CreateDealDocsTemplate from "@/components/Dashboard/Objects/Components/Deals/CreateDealDocsTemplate";

export default {
  name: 'Branches',
  components: {
    CreateDealDocsTemplate
  },
  data() {
    return {
      loading: false,
      sortBy: "id",
      sortDesc: false,
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
          key: "category",
          label: this.$t("category"),
        },
        {
          key: "language",
          label: this.$t("clients.language"),
        },
        {
          key: "main",
          label: this.$t("objects.deal_template.main"),
        },
        {
          key: 'created',
          label: this.$t('created_at')
        },
        {
          key: 'download',
          label: ''
        },
        {
          key: "actions",
          label: '',
        }
      ],
      deals: []
    }
  },
  async created() {
    await this.getDealTemplateList()
  },
  methods: {
    async getDealTemplateList() {
      this.loading = true
      const {id} = this.$route.params
      await api.objects.getDealTemplateList(id)
          .then((response) => {
            console.log(response.data)
            this.deals = response.data
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.loading = false
          })
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
    downloadDocumentURl(url) {
      return process.env.VUE_APP_URL + '/' + url
    },
    deleteBranch(contractId) {
      this.loading = true
      const objectId = this.$route.params.id
      api.objects.deleteContract({objectId, contractId})
          .then(() => {
            const findIndex = this.deals.findIndex(deal => deal.id === contractId)
            this.deals.splice(findIndex, 1)
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
</style>

