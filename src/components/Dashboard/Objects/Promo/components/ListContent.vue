<template>
  <div class="mt-2">
    <b-table
        sticky-header
        responsive
        show-empty
        borderless
        sort-icon-left
        :items="promos"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
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
          <i class="fas fa-circle"></i>
        </span>

        <span>
          {{ data.index + 1 }}
        </span>
      </template>

      <!-- FLOORS COLUMN -->
      <!--      <template #cell(floors)="data">-->
      <!--        <span v-if="data.item.blocks.length">-->
      <!--          {{ sumFloorsCount(data.item.blocks) }}-->
      <!--        </span>-->
      <!--      </template>-->

      <!--   ACTION   -->
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

            <div class="dropdown-menu" v-if="hasPermission">

              <b-button
                  v-if="permission.objects.update && !data.item.status"
                  class="dropdown-item dropdown-item--inside"
                  @click="activatePromo(data.item)"
              >
                <i class="fas fa-check"></i>
                {{ $t("activate") }}
              </b-button>


              <b-button
                  v-if="permission.objects.update && data.item.status"
                  class="dropdown-item  dropdown-item--inside"
                  @click="deactivatePromo(data.item)"
              >
                <i class="fas fa-times"></i>
                {{ $t("deactivate") }}
              </b-button>


              <b-button
                  v-if="permission.objects.update"
                  @click="editPromoItem(data.item)"
                  class="dropdown-item dropdown-item--inside"
              >
                <i class="fas fa-edit"></i>
                {{ $t("edit") }}
              </b-button>


              <b-button
                  v-if="permission.objects.delete"
                  class="dropdown-item  dropdown-item--inside"
                  @click="deletePromoItem(data.item)"
              >
                <i class="fas fa-trash"></i>
                {{ $t("delete") }}
              </b-button>

            </div>
          </div>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import api from '@/services/api'

export default {
  name: 'ListContent',
  props: {
    promos: {
      type: Array,
      required: true
    }
  },
  emits: ['update-content', 'edit-promo-item'],
  data() {
    return {
      sortBy: "index",
      sortDesc: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      permission: 'getPermission'
    }),
    hasPermission() {
      return Object.keys(this.permission).length > 0
    },
    fields() {
      return [
        {
          key: "index",
          label: "#"
        },
        {
          key: "name",
          label: this.$t("promo.name"),
          formatter: (name) => {
            const locale = localStorage.locale ? localStorage.locale : 'ru'
            return name[locale]
          }
        },
        {
          key: "blocks",
          label: this.$t("promo.blocks"),
          formatter: (blocks) => {
            let names = ''
            blocks.forEach((current, index, arr) => {
              const arraysBeforeIndex = arr.slice(0, index)
              const hasBefore = arraysBeforeIndex.findIndex(arr => arr.block.id === current.block.id)
              if (hasBefore === -1) {
                names += current.block.name
                if (index < arr.length - 1) {
                  names += ' , '
                }
              }
            })
            return names
          }
        },
        /*{
          key: "floors",
          label: this.$t("promo.floors")
        },*/
        {
          key: "actions",
          label: "",
        }
      ]
    }
  },
  methods: {
    sumFloorsCount: (blocks) => blocks.reduce((acc, current) => acc + current.block.floors, 0),
    editPromoItem(item) {
      this.$emit('edit-promo-item', item)
    },
    async activatePromo(item) {
      this.toggleLoading()
      const promoId = item.uuid
      const {id: objectId} = this.$route.params
      await api.promoV2.promoActivate(objectId, promoId)
          .then(() => {
            this.$emit('update-content')
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.toggleLoading()
          })
    },
    async deactivatePromo(item) {
      this.toggleLoading()
      const promoId = item.uuid
      const {id: objectId} = this.$route.params
      await api.promoV2.promoDeactivate(objectId, promoId)
          .then(() => {
            this.$emit('update-content')
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.toggleLoading()
          })
    },
    async deletePromoItem(item) {
      const result = await this.showWarnBeforeDelete()
      if (result.isConfirmed) {
        const {id: objectId} = this.$route.params
        const uuId = item.uuid
        await api.promoV2.promoDelete(objectId, uuId)
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
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        title: this.$t('promo.warn_before_delete'),
        confirmButtonText: this.$t("sweetAlert.yes_agree")
      })
    },
    showSuccessResponse() {
      this.$swal({
        icon: "success",
        showCancelButton: false,
        title: this.$t('promo.successfully_deleted'),
      })
    },
    toggleLoading() {
      this.loading = !this.loading
    },
    getCircleClassByStatus(status) {
      if (status === 1)
        return 'active__dot-class'
      else
        return 'not__active__dot-class'
    }
  }
}
</script>

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
