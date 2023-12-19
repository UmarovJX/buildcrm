<script>
import AppHeader from '@/components/Header/AppHeader'
import BaseArrowLeft from '@/components/icons/BaseArrowLeftIcon'
import api from '@/services/api'
import { v3ServiceApi } from '@/services/v3/v3.service'

import { yandexMap, ymapMarker } from 'vue-yandex-maps'
import { XFormSelect } from '@/components/ui-components/form-select'
import BaseButton from '@/components/Reusable/BaseButton'
import { XIcon } from '@/components/ui-components/material-icons'
import { XCircularBackground } from '@/components/ui-components/circular-background'

export default {
  name: 'Facilities',
  components: {
    BaseButton,
    XFormSelect,
    yandexMap,
    ymapMarker,
    BaseArrowLeft,
    AppHeader,
    XIcon,
    XCircularBackground,
  },
  data() {
    return {
      map: {},
      name: '',
      object: {},
      objectFacilities: [],
      coords: [0, 0],
      isLoading: false,

      settings: {
        // eslint-disable-next-line no-undef
        apiKey: process.env.VUE_APP_YKEY,
        lang: 'ru_RU',
        coordorder: 'latlong',
        enterprise: false,
        version: '2.1',
      },

      sortBy: 'id',
      sortDesc: false,
      fields: [
        {
          key: 'index',
          label: '',
          thStyle: { width: '10%' },
        },
        {
          key: 'text',
          label: 'TYPE',
        },

        {
          key: 'actions',
          label: '',
          thStyle: { width: '20%' },
        },
      ],
      objSelectOptions: [],
      selectedObject: null,
      facilityList: [],
      facility: null,

      loading: false,
    }
  },

  computed: {
    facilityOptions() {
      return this.facilityList.map(el => ({
        value: el.id,
        text: el.name[this.$i18n.locale],
      }))
    },
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
    this.fetchFacilities()
  },

  methods: {
    showMarker(item) {
      this.coords = [item.latitude, item.longitude]
    },
    removeFacility(index) {
      this.objectFacilities = this.objectFacilities.filter(
        (_, i) => i !== index,
      )
    },
    saveFacilities() {
      if (this.isLoading) return
      this.isLoading = true
      api.objectsV3
        .attachFacilities({
          id: this.$route.params.object,
          facilities: this.objectFacilities,
        })
        .then(() => {
          this.$toasted.show('Object facilities Succesfully updated', {
            type: 'success',
          })
          this.fetchObject()
        })
        .catch(e => this.toastedWithErrorCode(e))
        .finally(() => (this.isLoading = false))
    },
    addFacility() {
      const f = this.facilityList.find(el => el.id === this.facility)
      this.objectFacilities.push({
        id: this.facility,
        latitude: this.selectedObject.split(',')[0],
        longitude: this.selectedObject.split(',')[1],
        text: f.name[this.$i18n.locale],
        url: f.upload.path,
      })
      this.facility = null
      this.selectedObject = null
      this.map.balloon.close()
    },
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
    fetchFacilities() {
      v3ServiceApi.facility
        .fetch({
          page: 1,
          limit: 100,
        })
        .then(res => {
          this.facilityList = res.data.result
        })
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
      this.map.geoObjects.events.add('balloonopen', e => {
        alert('balloonopen')
        const target = e.get('target')
        console.log(target.geometry.get('coords'))
      })
    },
    planView(id) {
      this.$router.push({ name: 'type-plan-view', params: { id } })
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
      <div class="col-6">
        <yandex-map
          :coords="coords"
          ymap-class="map-box"
          :settings="settings"
          :zoom="17"
          @map-was-initialized="mapHandler"
          @click="handleClick"
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
        <div class="row mt-3 align-items-center">
          <div class="col-6">
            <x-form-select
              ref="select"
              v-model="selectedObject"
              placeholder="Object"
              :options="objSelectOptions"
            />
          </div>
          <div class="col-6">
            <x-form-select
              v-model="facility"
              placeholder="Facility"
              :options="facilityOptions"
            />
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-12">
            <base-button
              :disabled="!(selectedObject && facility)"
              class="float-right"
              design="violet-gradient px-5"
              :text="$t('Add facility')"
              @click="addFacility"
            />
          </div>
        </div>
      </div>
      <div class="col-6">
        <b-table
          v-model:sort-by="sortBy"
          v-model:sort-desc="sortDesc"
          sticky-header
          borderless
          responsive
          :items="objectFacilities"
          :fields="fields"
          show-empty
          sort-icon-left
          class="custom-table"
          style="min-height: unset"
          :empty-text="$t('No Facility')"
          thead-class="d-none"
        >
          <template #empty="scope">
            <div class="text-center">
              <span class="d-flex justify-content-center align-items-center">
                {{ scope.emptyText }}
              </span>
            </div>
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

          <template #cell(index)="{ index }">
            {{ index + 1 }}
          </template>
          <template #cell(actions)="{ item, index }">
            <div class="float-right d-flex x-gap-1 cursor-pointer">
              <div title="save">
                <x-circular-background
                  class="bg-violet-400"
                  @click="showMarker(item)"
                >
                  <x-icon
                    name="visibility"
                    class="color-white"
                  />
                </x-circular-background>
              </div>
              <div title="save">
                <x-circular-background
                  class="bg-red-600"
                  @click="removeFacility(index)"
                >
                  <x-icon
                    name="delete"
                    class="color-white"
                  />
                </x-circular-background>
              </div>
            </div>
          </template>
        </b-table>
        <div class="row mt-3">
          <div class="col-12">
            <base-button
              class="float-right d-flex justify-content-center align-items-cente"
              design="violet-gradient px-5"
              :text="$t('Save')"
              :loading="isLoading"
              @click="saveFacilities"
            />
          </div>
        </div>
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

.map-box {
  width: 100%;
  height: 600px;
}
</style>
