<script>
import { mapGetters } from 'vuex'
import api from '@/services/api'
import BaseCheckbox from '@/components/Reusable/BaseCheckbox2'
import Apartments from './Apartments'

export default {
  name: 'EditBlock',
  components: {
    BaseCheckbox,
    apartments: Apartments,
  },
  props: {
    typePlans: {},
    building: {},
    block: {},
  },
  data: () => ({
    settings: {
      available_floors: [],
      disabled_floors: [],
      apartments: [],
      clone_floor: null,
      clone_floor_select: null,
      btn_save: true,
    },

    disabled: {
      create: true,
      apartments: true,
      block_create: true,
      settings: true,
      btn_save: false,
      price_update: true,
    },

    header: {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    },
  }),
  computed: mapGetters(['getCurrency']),
  watch: {
    'block.name': function () {
      if (this.block.id !== null) {
        this.disabled.create = true
        this.setFloors()
        this.updateBlock()
        if (this.block.name.length > 0 && this.block.floor > 0) {
          this.settings.btn_save = true
        }
      }
    },
    'block.is_sold': function () {
      if (this.block.id !== null) {
        this.disabled.create = true
        this.block.is_sold = +this.block.is_sold
        this.updateBlock()
        if (this.block.name.length > 0 && this.block.floor > 0) {
          this.settings.btn_save = true
        }
      }
    },
    'block.apartments': function () {
      if (this.block.id != null) {
        this.setGroupApartments()
      }
    },

    'block.floor': function (newVal, oldVal) {
      const old = parseInt(oldVal)

      if (newVal === old) {
        return
      }

      if (this.block.floor == null) {
        return
      }

      if (this.block.floor > 0) {
        this.disabled.btn_save = true
      }
      if (
        this.block.name
        && this.block.name.length > 0
        && this.block.floor > 0
      ) {
        this.settings.btn_save = true
      }
    },
  },
  methods: {
    saveBlock() {
      this.$emit('save-edit-block', this.block)
      this.clearPreviewBlock()
    },

    async updatePrice(price) {
      try {
        await api.objects.updateBlockPrice(this.block.id, price.id, price)
        this.setFloors()
      } catch (error) {
        this.toastedWithErrorCode(error)
        if (error.response.status === 422) {
          this.error = true
          this.errors = error.response.data
        }
      }
    },

    async RemoveApartment() {
      try {
        const { data, status } = await api.objects.getBlockApartments(
          this.block.id,
        )
        if (status === 200) {
          this.block.apartments = []
          this.block.apartments = data
          this.setGroupApartments()
        }
      } catch (error) {
        this.toastedWithErrorCode(error)

        if (error.response.status === 422) {
          this.error = true
          this.errors = error.response.data
        }
      }
    },

    removeBlock() {
      this.$bvModal.hide('modal-edit-block')
      this.$emit('save-edit-block')
      this.clearPreviewBlock()
    },

    CopyFloor() {
      this.$swal({
        title: this.$t('sweetAlert.title'),
        text: this.$t('sweetAlert.text_copy_block'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: this.$t('cancel'),
        confirmButtonText: this.$t('sweetAlert.yes_clone'),
      }).then(result => {
        if (result.value) {
          const data = {
            apartments:
              this.settings.apartments[this.settings.clone_floor_select],
            floor: this.block.floors[this.settings.clone_floor],
          }

          api.objects
            .cloneFloors(this.block.id, data)
            .then(response => {
              if (response.status === 201) {
                this.block.apartments = []
                this.block.apartments = response.data
                this.setGroupApartments()

                this.settings.clone_floor = null
                this.settings.clone_floor_select = null

                // this.this.setFloors();
              }
            })
            .catch(error => {
              this.toastedWithErrorCode(error)

              if (error.response.status === 422) {
                this.error = true
                this.errors = error.response.data
              }
            })
        }
      })
    },

    cloneSelectFloor(event) {
      this.settings.clone_floor = event
    },

    clearPreviewBlock() {
      this.settings = {
        available_floors: [],
        disabled_floors: [],

        apartments: [],

        clone_floor: null,
        clone_floor_select: null,

        btn_save: true,
      }

      this.disabled = {
        create: true,
        apartments: true,
        block_create: true,
        settings: true,
        btn_save: false,
        price_update: true,
      }
    },

    async AddApartment(floor) {
      try {
        const { data, status } = await api.objects.apartmentAddition(
          this.block.id,
          { floor },
        )

        if (status === 201) {
          this.block.apartments.push(data)
        }
      } catch (error) {
        this.toastedWithErrorCode(error)

        if (error.response.status === 422) {
          this.error = true
          this.errors = error.response.data
        }
      }
    },

    async UpdateApartments() {
      try {
        const body = { apartments: this.block.apartments }
        await api.objects.updateApartments(body)
      } catch (error) {
        this.toastedWithErrorCode(error)

        if (error.response.status === 422) {
          this.error = true
          this.errors = error.response.data
        }
      }
    },

    createFloor() {
      this.block.floors = []
      this.settings.available_floors = []

      for (let i = 1; i <= this.block.floor; i++) {
        this.block.floors.push(i)
        // this.settings.available_floors.push(i);
      }

      this.disabled.settings = true
      this.disabled.btn_save = false

      this.setFloors()
      this.updateBlock()
      this.setGroupApartments()
    },

    selectFloor(price) {
      this.updatePrice(price)
    },

    removeFloor(price) {
      this.updatePrice(price)
    },

    sortDisabledFloors() {
      this.settings.disabled_floors.sort((a, b) => a - b)
    },

    sortAvailableFloors() {
      this.settings.available_floors.sort((a, b) => a - b)
    },

    setFloors() {
      if (this.block.prices && !this.block.prices.length) {
        for (let i = 1; i <= this.block.floor; i++) {
          this.settings.available_floors.push(i)
        }
      } else {
        const floors = this.block.prices.map(price => {
          if (price.floors === null) {
            return []
          }
          return price.floors
        })

        if (floors.flat().length) {
          this.settings.disabled_floors = floors.flat()

          let available = this.rr_diff(floors.flat(), this.block.floors)

          available = available.map(key => parseInt(key))

          this.settings.available_floors = available
        } else {
          let available = this.rr_diff(floors.flat(), this.block.floors)

          available = available.map(key => parseInt(key))

          this.settings.available_floors = available
        }
      }
    },

    setGroupApartments() {
      const { apartments } = this.block

      if (this.block.floors === null) {
        this.block.floors = []
      }

      this.settings.apartments = this.block.floors
        .map(floor => {
          const group = []
          let apartment
          if (apartments.length > 0) {
            apartment = apartments
              .map(apartment => {
                if (apartment.floor === floor) {
                  if (!apartment.installment_month) {
                    return {
                      ...apartment,
                      check_installment_month: false,
                    }
                  }
                  return {
                    ...apartment,
                    check_installment_month: true,
                  }
                }
                return null
              })
              .filter(e => e != null)
          } else {
            apartment = []
          }

          group[floor] = apartment

          return group
        })
        .flat()
    },

    rr_diff(a1, a2) {
      const a = []
      const diff = []

      for (let c = 0; c < a1.length; c++) {
        a[a1[c]] = true
      }

      for (let i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
          delete a[a2[i]]
        } else {
          a[a2[i]] = true
        }
      }

      for (const k in a) {
        diff.push(k)
      }

      return diff
    },

    async updateBlock() {
      try {
        await api.objects.updateBlock(this.block.id, this.block)
      } catch (error) {
        this.toastedWithErrorCode(error)

        if (error.response.status === 422) {
          this.error = true
          this.errors = error.response.data
        }
      }
    },

    async addPrice() {
      try {
        const { data, status } = await api.objects.addBlockPrice(
          this.block.id,
          {},
        )
        if (status === 201) {
          this.block.prices.push(data)
          this.disabled.apartments = true
          this.setFloors()
        }
      } catch (error) {
        this.toastedWithErrorCode(error)

        if (error.response.status === 422) {
          this.error = true
          this.errors = error.response.data
        }
      }
    },

    async removePrice(price, index) {
      try {
        const { status } = await api.objects.deleteBlockPrice(
          this.block.id,
          price.id,
        )
        if (status === 204) {
          this.block.prices.splice(index, 1)
          this.setFloors()
        }
      } catch (error) {
        this.toastedWithErrorCode(error)

        if (error.response.status === 422) {
          this.error = true
          this.errors = error.response.data
        }
      }
    },
  },
}
</script>

<template>
  <div>
    <b-modal
      id="modal-edit-block"
      ref="modal"
      class="py-4"
      :title="$t('objects.create.edit_block')"
      size="xl"
      hide-footer
      hide-header-close
      no-close-on-backdrop
    >
      <form class="my-form">
        <div class="container px-0 mx-0">
          <div class="row">
            <div class="col-12">
              <div class="mb-3">
                <label
                  class="d-block"
                  for="new_block_title"
                >
                  {{ $t("objects.create.name") }}
                </label>
                <input
                  id="new_block_title"
                  v-model="block.name"
                  :placeholder="$t('objects.placeholder.block_name')"
                  class="my-form__input"
                  type="text"
                >
              </div>
            </div>
            <!-- BLOCK SOLD -->
            <div class="col-12">
              <div class="mb-3">
                <base-checkbox
                  v-model="block.is_sold"
                  :label="$t('objects.placeholder.is_sold')"
                />
              </div>
            </div>
            <div class="col-lg-9">
              <div class="row">
                <div class="col-lg-6">
                  <div class="mb-3">
                    <label
                      class="d-block"
                      for="new_block_floor-count"
                    >
                      {{ $t("objects.create.count_floors") }}
                    </label>
                    <input
                      id="new_block_floor-count"
                      v-model="block.floor"
                      class="my-form__input"
                      type="number"
                      value="15"
                      min="1"
                      max="100"
                    >
                  </div>
                </div>
                <div
                  class="col-lg-3 ml-2 d-flex flex-column justify-content-end align-items-end"
                >
                  <div
                    v-if="disabled.btn_save"
                    class="mb-3"
                  >
                    <button
                      type="button"
                      :disabled="!block.floor ? true : false"
                      class="btn btn-primary"
                      @click="createFloor"
                    >
                      {{ $t("create") }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="disabled.settings">
            <div
              v-for="(price, index) in block.prices"
              :key="index"
              class="row"
            >
              <div class="col-lg-4">
                <div class="mb-3">
                  <label
                    class="d-block"
                    for="new_block_price"
                  >
                    {{ $t("objects.create.price_area") }}
                  </label>
                  <input
                    id="new_block_price"
                    v-model="price.price"
                    class="my-form__input"
                    type="number"
                    min="1"
                    @change="updatePrice(price)"
                  >
                </div>
              </div>
              <div class="col-lg-8">
                <div class="mb-3">
                  <div>
                    <label class="d-block">
                      {{ $t("objects.create.floors") }}
                    </label>
                  </div>
                  <div class="d-flex align-items-center">
                    <div class="flex-grow-1">
                      <multiselect
                        v-model="price.floors"
                        :multiple="true"
                        :options="settings.available_floors"
                        @select="selectFloor(price, index)"
                        @remove="removeFloor(price, index)"
                      />
                    </div>
                    <div>
                      <button
                        v-if="block.prices.length != 1"
                        type="button"
                        class="btn btn-danger ml-2 mt-0"
                        @click="removePrice(price, index)"
                      >
                        <i class="far fa-trash" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="
              disabled.settings && block.prices && block.prices.length === 0
            "
            class="alert alert-info"
          >
            <i class="fa fa-info-circle" />
            {{ $t("objects.create.alert_price") }}
          </div>

          <div
            v-if="
              disabled.settings && block.prices && block.prices.length === 0
            "
            class="object__item object__item--inside object__item-last"
          >
            <b-link
              class="object__link"
              @click="addPrice"
            >
              <div class="object__add object__add--inside">
                <i class="fal fa-plus" />
              </div>
              <div class="object__name object__name--inside">
                {{ $t("objects.create.create_price") }}
              </div>
            </b-link>
          </div>

          <div
            v-if="disabled.settings && block.prices && block.prices.length > 0"
            class="mt-4 d-flex justify-content-md-start justify-content-center"
          >
            <button
              type="button"
              class="btn btn-primary"
              @click="addPrice"
            >
              <i class="fal fa-plus mr-2" />
              {{ $t("objects.create.new_price") }}
            </button>
          </div>
        </div>

        <div
          v-if="disabled.apartments"
          id="floors"
          class="accordion mt-3"
        >
          <div
            v-for="(floor, index) in block.floors"
            :key="index"
            class="card"
          >
            <div
              :id="'headingOne' + index"
              class="card-header"
            >
              <!--              {{ settings.apartments[index].length + 'lalalal' }}-->
              <h2 class="mb-0">
                <button
                  class="btn btn-link btn-block text-left apartment__list"
                  type="button"
                  data-toggle="collapse"
                  :data-target="'#collapseOne' + index"
                  aria-expanded="true"
                  :aria-controls="'collapseOne' + index"
                >
                  {{ floor }}-{{ $t("objects.create.floor") }} -
                  {{ $t("objects.create.apartments") }} (
                  {{ settings.apartments[index].length }}
                  )
                </button>
              </h2>
            </div>

            <div
              :id="'collapseOne' + index"
              :class="index === 0 ? 'collapse' : 'collapse'"
              :aria-labelledby="'headingOne' + index"
              data-parent="#floors"
            >
              <div class="card-body">
                <div class="row">
                  <apartments
                    :building="building"
                    :apartments="settings.apartments[index]"
                    :block="block"
                    :type-plans="typePlans"
                    @RemoveApartment="RemoveApartment"
                    @UpdateApartments="UpdateApartments"
                  />

                  <div class="col-lg-4 my-2">
                    <div class="apartment apartment-last">
                      <a
                        href="#"
                        class="object__link position-relative top-0 left-0"
                        @click="AddApartment(floor)"
                      >
                        <div class="object__add object__add--inside">
                          <i class="fal fa-plus" />
                        </div>
                        <div class="object__name object__name--inside">
                          {{ $t("objects.create.apartment") }}
                        </div>
                      </a>
                    </div>
                  </div>

                  <div class="col-lg-4 my-2">
                    <div
                      v-if="
                        block.apartments.length > 0 &&
                          settings.apartments[index] &&
                          !settings.apartments[index].length
                      "
                      class="apartment apartment-last"
                    >
                      <a
                        data-toggle="collapse"
                        :href="'#collapseCopy' + index"
                        role="button"
                        aria-expanded="false"
                        :aria-controls="'collapseCopy' + index"
                        class="object__link position-relative top-0 left-0"
                      >
                        <div class="object__add object__add--inside">
                          <i class="fal fa-copy" />
                        </div>
                        <div class="object__name object__name--inside">
                          {{ $t("objects.create.clone_apartments") }}
                        </div>
                      </a>
                    </div>
                  </div>

                  <div
                    v-if="
                      block.apartments.length > 0 &&
                        settings.apartments[index] &&
                        !settings.apartments[index].length
                    "
                    class="col-md-12"
                  >
                    <div
                      :id="'collapseCopy' + index"
                      class="collapse"
                    >
                      <div class="card">
                        <div class="card-body">
                          <div class="form-group">
                            <label :for="'clone' + index">
                              {{ $t("objects.create.choose_clone") }}
                            </label>
                            <select
                              v-model="settings.clone_floor_select"
                              class="form-control"
                              @change="cloneSelectFloor(index)"
                            >
                              <option
                                v-for="(
                                  floor, index_clone
                                ) in settings.apartments"
                                :key="index_clone"
                                :disabled="index_clone === index"
                                :value="index_clone"
                              >
                                {{ index_clone + 1 }} -
                                {{ $t("objects.create.floor") }}
                              </option>
                            </select>
                          </div>
                        </div>

                        <div class="card-footer">
                          <button
                            type="button"
                            class="btn btn-primary"
                            @click="CopyFloor"
                          >
                            <i class="fa fa-copy" />
                            {{ $t("objects.create.clone") }}
                          </button>

                          <button
                            type="button"
                            class="btn btn-secondary"
                            data-toggle="collapse"
                            :data-target="'#collapseCopy' + index"
                            aria-expanded="false"
                            :aria-controls="'collapseCopy' + index"
                          >
                            {{ $t("close") }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-4 d-flex justify-content-md-start justify-content-center float-right"
        >
          <button
            type="button"
            class="btn btn-default mr-2"
            @click="removeBlock"
          >
            {{ $t("cancel") }}
          </button>

          <button
            v-if="settings.btn_save"
            type="submit"
            class="btn btn-success"
            @click="saveBlock"
          >
            <i class="fa fa-save" /> {{ $t("save") }}
          </button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<style scoped>
.apartment__list {
  color: var(--object-color) !important;
}
</style>
