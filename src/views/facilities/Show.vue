<script>
import AppHeader from '@/components/Header/AppHeader'
import BaseArrowLeft from '@/components/icons/BaseArrowLeftIcon'
import api from '@/services/api'

import { yandexMap, ymapMarker } from 'vue-yandex-maps'

export default {
  name: 'Facilities',
  components: {
    yandexMap,
    ymapMarker,
    BaseArrowLeft,
    AppHeader,
  },
  data() {
    return {
      map: {},
      name: '',
      object: {},
      objectFacilities: [],
      coords: [0, 0],
      controls: ['zoomControl', 'fullscreenControl'],
      settings: {
        // eslint-disable-next-line no-undef
        apiKey: process.env.VUE_APP_YKEY,
        lang: 'ru_RU',
        coordorder: 'latlong',
        enterprise: false,
        version: '2.1',
      },

      objSelectOptions: [],
      selectedObject: null,
      facilityList: [],
      facility: null,

      loading: false,
    }
  },

  computed: {
    mapMarkers() {
      const l = this.object.location
      const fM = this.objectFacilities.map((el, i) => ({
        id: `${el.latitude},${el.longitude},${i}`,
        coords: [el.latitude, el.longitude],
        text: el.text,
        url: el.url,
        properties: {
          iconCaption: `${i + 1}. ${el.text}`,
        },
        options: { preset: 'islands#blueDotIcon' },
        icon: {
          preset: 'default#imageWithContent',
          imageHref: el.url,
          imageSize: [43, 55], // размер иконки в px
          imageOffset: [-22, -55],
        },
      }))
      if (l) {
        const mainM = {
          id: `${l.latitude},${l.longitude}`,
          coords: [l.latitude, l.longitude],
          text: this.object.name,
          properties: {
            iconContent: this.object.name,
          },
          options: { preset: 'islands#redStretchyIcon' },

          icon: {
            color: 'red',
          },
        }
        return [mainM, ...fM]
      }

      return [...fM]
    },
  },

  mounted() {
    this.fetchObject()
  },

  methods: {
    handleClick(e) {
      this.objSelectOptions = [
        { value: e.get('coords').join(','), text: 'Custom Location' },
      ]
    },
    backNavigation() {
      this.$router.go(-1)
    },
    fetchObject() {
      this.loading = true
      api.objectsV3
        .getFacilities({ id: this.$route.params.object })
        .then(res => {
          this.object = res.data.result
          this.objectFacilities = res.data.result.facilities.map(el => ({
            id: el.id,
            latitude: el.latitude,
            longitude: el.longitude,
            text: el.name[this.$i18n.locale],
            url: el.upload.path,
          }))
          this.coords = [
            res.data.result.location.latitude,
            res.data.result.location.longitude,
          ]
        })
        .finally(() => (this.loading = false))
    },

    mapHandler(e) {
      this.map = e
      this.map.events.add('balloonopen', e => {
        this.selectedObject = null
        const target = e.get('target')
        this.objects = target._objects
        // const obj = target._objects[target._objects.length - 1];
        this.objSelectOptions = target._objects.map(el => ({
          value: console.log(el) || el._geometry.coordinates.join(','),
          text: el._properties.name,
        }))
      })
    },
  },
}
</script>

<template>
  <div>
    <app-header>
      <template #header-title>
        <div
          class="go__back"
          @click="backNavigation"
        >
          <BaseArrowLeft
            :width="32"
            :height="32"
          />
        </div>
        <div>
          {{ $t("Facilities") }}
        </div>
      </template>
    </app-header>

    <div class="row">
      <div class="col-12">
        <yandex-map
          :coords="coords"
          ymap-class="map-box-show"
          :settings="settings"
          :zoom="17"
          :controls="controls"
          @map-was-initialized="mapHandler"
        >
          <ymap-marker
            v-for="m of mapMarkers"
            :key="m.id"
            :marker-id="m.id"
            :coords="m.coords"
            :icon="m.icon"
            :properties="m.properties"
            :options="m.options"
          />
        </yandex-map>
      </div>
    </div>

    <b-overlay
      :show="loading"
      no-wrap
      opacity="0.5"
      style="z-index: 2222"
    >
      <template #overlay>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<style lang="scss">
.go__back {
  margin-right: 10px;
  width: 56px;
  height: 56px;
  border-radius: 100%;
  background-color: var(--gray-100);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: var(--gray-200);
  }
}

.map-box-show {
  width: 100%;
  height: 90%;
  min-height: 700px;
}
</style>
