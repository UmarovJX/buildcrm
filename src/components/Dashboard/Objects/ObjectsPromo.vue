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
    <promo-list-content :promos="promos"/>
    <b-modal
        size="xl"
        id="promoCreationModal"
        :title="$t('promo.creation_title')"
    >
      <!--  Modal Main Content    -->
      <promo-creation-content/>

      <template #modal-footer="{ cancel, hide }">
        <div class="d-flex justify-content-end">
          <b-button variant="danger" @click="cancel()">
            {{ $t('close') }}
          </b-button>
          <b-button class="ml-2" variant="primary" @click="hide('forget')">
            {{ $t('save') }}
          </b-button>
        </div>
      </template>
    </b-modal>
  </main>
</template>

<script>
import BaseBreadCrumb from "@/components/BaseBreadCrumb";
import PromoListContent from "@/components/Dashboard/Objects/Components/Promo/PromoListContent";
import PromoCreationContent from "@/components/Dashboard/Objects/Components/Promo/PromoCreationContent";

export default {
  name: "ObjectsPromo",
  components: {
    BaseBreadCrumb,
    PromoListContent,
    PromoCreationContent
  },
  data() {
    return {
      promos: []
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
    fetchPromoData() {
      this.promos = [
        {
          id: 1,
          name: 'Bahorgi Aksiya',
          blocks: 'Blok:A,B,D',
          floors: '16 qavat, 18 qavat'
        },
        {
          id: 2,
          name: 'Yozgi Aksiya',
          blocks: 'Blok:C,G,B',
          floors: '8 qavat, 20 qavat'
        },
        {
          id: 3,
          name: 'Tungi Aksiya',
          blocks: 'Blok:C,G,B',
          floors: '8 qavat, 20 qavat'
        }
      ]
    },
    addNewPromo() {
      this.$bvModal.show('promoCreationModal')
    }
  }
}
</script>
