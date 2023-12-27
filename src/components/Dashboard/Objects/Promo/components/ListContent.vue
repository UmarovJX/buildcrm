<script>
import { mapGetters } from 'vuex'
import api from '@/services/api'
import PromosPermission from '@/permission/promos'
import XDropdown from "@/components/ui-components/dropdown/XDropdown.vue";

export default {
  name: 'ListContent',
  components: {XDropdown},
  props: {
    promos: {
      type: Array,
      required: true,
    },
  },
  emits: ['update-content', 'edit-promo-item'],
  data() {
    return {
      sortBy: 'index',
      sortDesc: false,
      loading: false,
      editPromoPermission: PromosPermission.getPromosEditPermission(),
      deletePromoPermission: PromosPermission.getPromosDeletePermission(),
    }
  },
  computed: {
    ...mapGetters({
      permission: 'getPermission',
    }),
    hasPermission() {
      return this.editPromoPermission || this.deletePromoPermission
    },
    fields() {
      return [
        {
          key: 'index',
          label: '#',
        },
        {
          key: 'name',
          label: this.$t('promo.name'),
          formatter: name => {
            const locale = localStorage.locale ? localStorage.locale : 'ru'
            return name[locale]
          },
        },
        {
          key: 'blocks',
          label: this.$t('promo.blocks'),
          formatter: blocks => {
            let names = ''
            blocks.forEach((current, index, arr) => {
              const arraysBeforeIndex = arr.slice(0, index)
              const hasBefore = arraysBeforeIndex.findIndex(
                arr => arr.block.id === current.block.id,
              )
              if (hasBefore === -1) {
                names += current.block.name
                if (index < arr.length - 1) {
                  names += ' , '
                }
              }
            })
            return names
          },
        },
        /* {
          key: "floors",
          label: this.$t("promo.floors")
        }, */
        {
          key: 'actions',
          label: '',
        },
      ]
    },
  },
  methods: {
    sumFloorsCount: blocks => blocks.reduce((acc, current) => acc + current.block.floors, 0),
    editPromoItem(item) {
      this.$emit('edit-promo-item', item)
    },
    async activatePromo(item) {
      this.toggleLoading()
      const promoId = item.uuid
      const { id: objectId } = this.$route.params
      await api.promoV2
        .promoActivate(objectId, promoId)
        .then(() => {
          this.$emit('update-content')
        })
        .catch(error => {
          this.toastedWithErrorCode(error)
        })
        .finally(() => {
          this.toggleLoading()
        })
    },
    async deactivatePromo(item) {
      this.toggleLoading()
      const promoId = item.uuid
      const { id: objectId } = this.$route.params
      await api.promoV2
        .promoDeactivate(objectId, promoId)
        .then(() => {
          this.$emit('update-content')
        })
        .catch(error => {
          this.toastedWithErrorCode(error)
        })
        .finally(() => {
          this.toggleLoading()
        })
    },
    async deletePromoItem(item) {
      const result = await this.showWarnBeforeDelete()
      if (result.isConfirmed) {
        const { id: objectId } = this.$route.params
        const uuId = item.uuid
        await api.promoV2
          .promoDelete(objectId, uuId)
          .then(() => {
            this.showSuccessResponse()
            this.$emit('update-content')
          })
          .catch(error => {
            this.toastedWithErrorCode(error)
          })
      }
    },
    showWarnBeforeDelete() {
      return this.$swal({
        text: '',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: this.$t('cancel'),
        title: this.$t('promo.warn_before_delete'),
        confirmButtonText: this.$t('sweetAlert.yes_agree'),
      })
    },
    showSuccessResponse() {
      this.$swal({
        icon: 'success',
        showCancelButton: false,
        title: this.$t('promo.successfully_deleted'),
      })
    },
    toggleLoading() {
      this.loading = !this.loading
    },
    getCircleClassByStatus(status) {
      if (status === 1) return 'active__dot-class'
      return 'not__active__dot-class'
    },
  },
}
</script>

<template>
  <div class="mt-2">
    <b-table
      v-model:sort-by="sortBy"
      v-model:sort-desc="sortDesc"
      sticky-header
      responsive
      show-empty
      borderless
      sort-icon-left
      :items="promos"
      :fields="fields"
      :empty-text="$t('no_data')"
      :busy="loading"
      class="custom-table"
    >
      <!-- INDEX COLUMN -->
      <template #cell(index)="data">
        <span
          class="mr-2"
          :class="getCircleClassByStatus(data.item.status)"
        >
          <i class="fas fa-circle" />
        </span>

        <span>
          {{ data.index + 1 }}
        </span>
      </template>

      <!--   ACTION   -->
      <template #cell(actions)="data">
        <div class="float-right">
            <x-dropdown v-if="hasPermission">
              <b-button
                v-if="!data.item.status && editPromoPermission"
                class="dropdown-item dropdown-item--inside"
                @click="activatePromo(data.item)"
              >
                <i class="fas fa-check" />
                {{ $t("activate") }}
              </b-button>

              <b-button
                v-if="data.item.status && editPromoPermission"
                class="dropdown-item dropdown-item--inside"
                @click="deactivatePromo(data.item)"
              >
                <i class="fas fa-times" />
                {{ $t("deactivate") }}
              </b-button>

              <b-button
                v-if="editPromoPermission"
                class="dropdown-item dropdown-item--inside"
                @click="editPromoItem(data.item)"
              >
                <i class="fas fa-edit" />
                {{ $t("edit") }}
              </b-button>

              <b-button
                v-if="deletePromoPermission"
                class="dropdown-item dropdown-item--inside"
                @click="deletePromoItem(data.item)"
              >
                <i class="fas fa-trash" />
                {{ $t("delete") }}
              </b-button>
            </x-dropdown>
        </div>
      </template>
    </b-table>
  </div>
</template>

<style lang="scss" scoped>
.active__dot-class {
  color: #20c997;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.not__active__dot-class {
  color: #ffc107;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
</style>
