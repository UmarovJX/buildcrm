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
      oldUploadIdToDelete: null,
      providerSchema: [
        {
          mask: "",
          type: "text",
          bind: "number",
          labelFor: "number",
          rules: "required",
          label: this.$t("parking_number"),
        },
        {
          mask: "",
          type: "text",
          bind: "floor",
          labelFor: "floor",
          rules: "required",
          label: this.$t("floor"),
        },
        {
          mask: "",
          type: "text",
          bind: "price",
          labelFor: "area",
          rules: "required",
          label: this.$t("contracts.price"),
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
      this.planData = {
        uuid: value.uuid,
        floor: value.floor,
        number: value.number,
        upload_id: value.upload_id,
        price: value.price,
        img: value.img,
        building_id: value.building_id,
      };
    },
    createImage() {
      if (this.planData.img.path instanceof File) {
        let img = URL.createObjectURL(this.planData.img.path);
        return img || null;
      } else {
        return this.planData.img;
      }
    },
    deleteImg(img) {
      if (!(img.path instanceof File)) {
        this.oldUploadIdToDelete = this.planData.upload_id;
        // const objectId = this.$route.params.id;
        // const planId = this.plan?.id;
        // api.plans
        //   .deletePlanImage(objectId, planId, img.id)
        //   .then(() => {})
        //   .catch((err) => {
        //     return err;
        //   });
      }
      this.planData.img = null;
    },
    setImage(img) {
      this.planData.img = {
        path: img[0],
      };
    },
    closePlanModal() {
      this.building = null;
      this.$refs["plan-modal"].closeModal();
    },
    openPlanModal() {
      this.$refs["plan-modal"].openModal();
    },

    renderFormData(data) {
      const form = new FormData();
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            for (const [childKey, childValue] of Object.entries(value[i])) {
              form.append(`${key}[${i}][${childKey}]`, childValue);
            }
          }
        } else if (key === "balcony_area") {
          if (value) {
            form.append(key, value);
            form.append("balcony", 1);
          } else {
            form.append("balcony", 0);
          }
        } else {
          form.append(key, value);
        }
      }
      return form;
    },
    async handleSubmit() {
      const valid = await this.$refs["form"].validate();
      // const objectId = this.$route.params.id;
      if (valid) {
        if (!this.planData.uuid && !this.building) {
          return this.$swal({
            title: this.$t("error"),
            text: this.$t("sweetAlert.payment_list_add"),
            icon: "error",
          });
        }
        if (this.oldUploadIdToDelete) {
          const d = new FormData();
          d.append("id", this.oldUploadIdToDelete);
          await api.uploadsV3.removeUpload(d);
        }
        if (this.planData.img && this.planData.img.path instanceof File) {
          const d = new FormData();
          d.append("type", "parking");
          d.append("attachment", this.planData.img.path);
          const res = await api.uploadsV3.createUpload(d);
          this.planData.upload_id = res.data.result.id;
        }

        const d = {
          price: this.planData.price,
          floor: this.planData.floor,
          number: this.planData.number,
        };
        d.upload_id = this.planData.upload_id;
        if (!this.planData.building_id) {
          d.building_id = this.building;
        }
        if (this.planData.uuid) {
          d.uuid = this.planData.uuid;
          await api.parkingsV3.updateParking(d);
        } else {
          await api.parkingsV3.createParking(d);
        }

        this.closePlanModal();
        this.$emit("update-list");
      }
    },
    add() {
      // this.$bvModal.hide("modal-create")
      // this.$swal({
      //     title: this.$t('successfully'),
      //     text: this.$t('sweetAlert.payment_list_add'),
      //     icon: "success"
      // })
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
          <ValidationProvider
            v-for="{
              label,
              labelFor,
              bind,
              mask,
              rules,
              type,
            } in providerSchema"
            :type="type"
            :key="label + labelFor"
            :name="label"
            :rules="rules"
            v-slot="{ errors }"
          >
            <base-input
              :type="type"
              :id="labelFor"
              :label="true"
              class="w-100"
              :error="!!errors.length"
              :placeholder="label"
              :mask="mask"
              v-model="planData[bind]"
            />
          </ValidationProvider>

          <x-form-select
            v-if="!planData.building_id"
            id="select-building"
            :label="false"
            :options="buildingOps"
            v-model="building"
          />
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
