<template>
  <main>
    <base-bread-crumb
        :bread-crumbs="breadCrumbs"
        :active-content="activeContent"
    >
      <template #extra-content>
        <button
            class="btn btn-primary mr-0 mt-md-0"
            @click="addNewPromo"
        >
          <i class="fal fa-plus mr-2"></i>
          {{ $t("add") }}
        </button>
      </template>
    </base-bread-crumb>

    <!--  List Of Promos  -->
    <list-content
        :promos="promos"
        @update-content="fetchPromoData(false)"
        @edit-promo-item="editPromoItem"
    />

    <!--  Modal Main Content    -->
    <creation-content
        @successfully-created="successfullyCreated"
        @successfully-edited="successfullyEdited"
        @error-on-creation="errorOnCreation"
    />

    <!--  Loading Content  -->
    <base-loading-content :loading="loading"/>
  </main>
</template>

<script>
import api from '@/services/api'
import {mapMutations} from "vuex"
import BaseBreadCrumb from "@/components/BaseBreadCrumb"
import BaseLoadingContent from "@/components/BaseLoadingContent"
import CreationContent from "@/components/Dashboard/Objects/Promo/components/CreationContent";
import ListContent from "@/components/Dashboard/Objects/Promo/components/ListContent";

export default {
  name: "Promo",
  components: {
    ListContent,
    CreationContent,
    BaseBreadCrumb,
    BaseLoadingContent,
  },
  data() {
    return {
      promos: [],
      loading: false,
      promoUsage: []
    }
  },
  computed: {
    activeContent() {
      return this.$t('list')
    },
    breadCrumbs() {
      return [
        {
          routeName: 'objects-promo',
          textContent: this.$t('promo.promos')
        }
      ]
    }
  },
  async created() {
    await this.fetchPromoData()
  },
  methods: {
    ...mapMutations({
      changeEditHistory: 'changeEditHistory'
    }),
    async fetchPromoData(showLoading = true) {
      const {id} = this.$route.params

      if (showLoading) {
        this.startLoading()
      }

      await api.promo.fetchPromoList(id)
          .then(response => {
            this.promos = response.data
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            if (showLoading) {
              this.finishLoading()
            }
          })
    },
    startLoading() {
      this.loading = true
    },
    finishLoading() {
      this.loading = false
    },
    addNewPromo() {
      this.changeEditHistory({})
      this.$bvModal.show('promoCreationModal')
    },
    async editPromoItem(item) {
      const objectId = this.$route.params.id
      await api.promoV2.promoEditContext(objectId, item.uuid)
          .then(response => {
            this.changeEditHistory(response.data)
            this.$bvModal.show('promoCreationModal')
          })
          .catch(error => {
            this.toastedWithErrorCode(error)
          })
    },
    async successfullyCreated() {
      const title = this.$t('promo.successfully_created')
      this.showSuccessResponse(title)
      await this.fetchPromoData(false)
    },
    async successfullyEdited() {
      const title = this.$t('promo.successfully_edited')
      this.showSuccessResponse(title)
      await this.fetchPromoData(false)
    },
    showSuccessResponse(title) {
      this.$swal({
        text: '',
        icon: "success",
        showCancelButton: false,
        title
      })
    },
    errorOnCreation(error) {
      this.toastedWithErrorCode(error)
    }
  }
}
</script>
