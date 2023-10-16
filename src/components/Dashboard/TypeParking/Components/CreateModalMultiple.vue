<script>
import BaseInput from "@/components/Reusable/BaseInput";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseCameraIcon from "@/components/icons/BaseCameraIcon";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import ImageUploader from "@/components/Reusable/ImageUploader";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import api from "@/services/api";

import { XFormSelect } from "@/components/ui-components/form-select";

import {} from "@/components/ui-components/form-select";
export default {
  name: "CreationCompanyModal",

  components: {
    XFormSelect,
    BaseDeleteIcon,
    BaseCameraIcon,
    BaseButton,
    BaseInput,
    BaseModal,
    BaseCloseIcon,
    ImageUploader,
  },
  emits: ["layout-data"],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    parking: {
      type: Object,
      default: () => {
        return {
          uuid: null,
          floor: null,
          number: null,
          upload_id: null,
          price: null,
          img: null,
          building_id: null,
        };
      },
    },
  },
  data() {
    return {
      buildingOptions: [],
      building: null,
      maskText: "",
      loading: false,
      price: 0,
      planData: {
        uuid: null,
        floor: null,
        number: null,
        upload_id: null,
        price: null,
        building_id: null,
        img: null,
      },
      entries: [{ number: "", floor: "", price: "" }],
      oldUploadIdToDelete: null,
      providerSchema: [
        {
          mask: "",
          type: "text",
          bind: "number",
          labelFor: "number",
          rules: "required",
          label: this.$t("parking_number"),
          width: 40,
        },
        {
          mask: "",
          type: "text",
          bind: "floor",
          labelFor: "floor",
          rules: "required",
          label: this.$t("floor"),
          width: 30,
        },
        {
          mask: "",
          type: "text",
          bind: "price",
          labelFor: "area",
          rules: "required",
          label: this.$t("contracts.price"),
          width: 30,
        },
      ],
    };
  },
  watch: {
    parking: {
      deep: true,
      handler(value) {
        this.getBuildingOptions();
        this.setPlanData(value);
      },
    },
  },
  computed: {
    submitText() {
      return this.planData.uuid ? this.$t("save") : this.$t("add");
    },
    modalTitle() {
      return this.planData.uuid
        ? this.$t("edit")
        : this.$t("objects.create.parking.add");
    },
    buildingOps() {
      return this.buildingOptions.map((el) => ({
        value: el.id,
        text: el.name,
      }));
    },
  },
  methods: {
    addParking() {
      this.entries.push({ price: "", floor: "", number: "" });
    },
    async getBuildingOptions() {
      const obj = this.$route.params.id;
      await api.objectsV2
        .fetchParkingFilterFields(obj)
        .then((response) => {
          this.buildingOptions = response.data.buildings;
        })
        .catch((err) => {
          this.toastedWithErrorCode(err);
        });
    },
    setPlanData(value) {
      if (value) {
        this.planData = {
          uuid: value.uuid,
          floor: value.floor,
          number: value.number,
          upload_id: value.upload_id,
          price: value.price,
          img: value.img,
          building_id: value.building_id,
        };
      }
    },
    createImage() {
      if (this.planData.img instanceof File) {
        let img = URL.createObjectURL(this.planData.img);
        return img || null;
      } else {
        return this.planData.img;
      }
    },
    deleteImg() {
      this.planData.img = null;
    },
    setImage(img) {
      this.planData.img = img[0];
    },
    closePlanModal() {
      this.building = null;
      this.entries = [{ price: "", floor: "", number: "" }];
      this.planData = {
        uuid: null,
        floor: null,
        number: null,
        upload_id: null,
        price: null,
        building_id: null,
        img: null,
      };
      this.$refs["plan-modal"].closeModal();
    },
    openPlanModal() {
      this.$refs["plan-modal"].openModal();
    },

    async handleSubmit() {
      // if (!this.planData.img) {
      //   return this.$swal({
      //     title: this.$t("error"),
      //     text: this.$t("sweetAlert.add_image"),
      //     icon: "error",
      //   });
      // }
      if (!this.building) {
        return this.$swal({
          title: this.$t("error"),
          text: this.$t("sweetAlert.choose_building"),
          icon: "error",
        });
      }
      const valid = await this.$refs["form"].validate();
      if (valid) {
        try {
          if (this.planData.img) {
            const d = new FormData();
            d.append("type", "parking");
            d.append("attachment", this.planData.img);
            console.log(d);
            const res = await api.uploadsV3.createUpload(d);
            this.planData.upload_id = res.data.result.id;
          }

          const d = {};
          d.parkings = this.entries.map((el) => ({
            ...el,
            upload_id: this.planData.upload_id,
            building_id: this.building,
          }));

          await api.parkingsV3.createParkingMultiple(d);

          this.closePlanModal();
          this.$emit("update-list");
        } catch (error) {
          this.$swal({
            title: this.$t("error"),
            text: this.$t("sweetAlert.error") + "!!!!",
            icon: "error",
          });
        }
      }
    },
    add() {
      this.handleSubmit();
    },
    cancel() {
      this.closePlanModal();
      // setTimeout(() => {
      this.$emit("clear-field");
      // }, 1000)
    },
  },
};
</script>

<template>
  <div>
    <base-modal ref="plan-modal" design="auto-height">
      <template #header>
        <div class="modal-title">
          <!--    TITLE      -->
          <p class="title">
            {{ modalTitle }}
          </p>
          <!--   CLOSE    -->
          <div class="go__back" @click="cancel">
            <BaseCloseIcon :width="56" :height="56" />
          </div>
        </div>
      </template>
      <template #main>
        <div class="uploader-container flex-column">
          <div class="row uploader-row ml-0">
            <div class="col-3" v-if="planData.img">
              <div class="uploader">
                <div class="action-list">
                  <div @click="deleteImg" class="delete-plan">
                    <base-delete-icon
                      :width="18"
                      :height="18"
                      fill="var(--white)"
                    />
                  </div>
                </div>

                <img :src="createImage()" alt="img" />
              </div>
            </div>
            <div v-else class="col-3">
              <div class="uploader">
                <image-uploader :multiple="false" @upload-image="setImage" />
              </div>
            </div>
          </div>
        </div>

        <validation-observer
          tag="form"
          ref="form"
          class="create-layout"
          @submit.prevent="handleSubmit"
        >
          <x-form-select
            style="width: 100%"
            v-if="!planData.building_id"
            id="select-building"
            :label="false"
            :options="buildingOps"
            v-model="building"
          />
          <div
            style="display: flex; padding-bottom: 5px"
            v-for="(el, index) in entries"
            :key="index"
          >
            <ValidationProvider
              v-for="{
                label,
                labelFor,
                bind,
                mask,
                rules,
                type,
                width,
              } in providerSchema"
              :type="type"
              :key="label + labelFor + index"
              :name="label + index"
              :rules="rules"
              v-slot="{ errors }"
              :style="`width: ${width}%`"
            >
              <base-input
                :type="type"
                :id="labelFor + index"
                :label="true"
                class="w-100"
                :error="!!errors.length"
                :placeholder="label"
                :mask="mask"
                v-model="entries[index][bind]"
              />
            </ValidationProvider>
          </div>
          <div>
            <b-button variant="success" @click="addParking">
              <i class="fas fa-plus-circle"></i>
              <!-- {{ $t("objects.create.new_type_plan") }} -->
            </b-button>
          </div>
        </validation-observer>
      </template>
      <BaseCameraIcon :width="30" :height="27" fill="var(--gray-200)" />

      <template #footer>
        <div class="footer-btn">
          <BaseButton @click="cancel" :fixed="true" :text="$t('cancel')" />
          <BaseButton
            @click="add"
            :fixed="true"
            design="violet-gradient"
            :text="submitText"
          />
        </div>
      </template>
    </base-modal>
  </div>
</template>

<style lang="scss" scoped>
.modal-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 2rem;
}

.footer-btn {
  display: flex;
  align-items: center;
  column-gap: 2rem;
}

.error__provider {
  color: red;
  display: block;
  margin-bottom: 1rem;
}

.save__button {
  color: white;
}

.create-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.uploader {
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 176px;
  max-height: 132px;
  min-height: 200px;
  border: 2px solid #f3f4f6;
  padding: 0;
  overflow: hidden;
  position: relative;

  .action-list {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    display: flex;
    gap: 0.25rem;
    flex-direction: column;
  }

  .delete-plan {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--red-600);
    cursor: pointer;
  }

  .drag-plan {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--gray-400);
    cursor: pointer;
  }

  img {
    object-fit: cover;
    object-position: center;
    height: 100%;
    //width: 100%;
  }
}

.uploader-row {
  width: 100%;
  row-gap: 0.5rem;

  .col-3 {
    padding: 0 4px !important;

    .uploader {
      max-width: 176px;
      max-height: 132px;
      min-height: 132px;

      p {
        font-weight: 600;
        font-size: 12px;
        line-height: 16px;
        margin-bottom: 0;
      }
    }
  }
}

.uploader-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;

  .row-item {
    display: flex;
    gap: 8px;
    height: 100%;
    flex-direction: row;
    justify-content: space-between;

    &-2 {
      height: 75%;
    }
  }

  .active-uploader {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    p {
      color: #4b5563;
      font-weight: 600;
      font-family: Inter, serif;
      line-height: 22px;
    }
  }
}
</style>
