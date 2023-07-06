<script>
import BaseInput from "@/components/Reusable/BaseInput";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseCameraIcon from "@/components/icons/BaseCameraIcon";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import ImageUploader from "@/components/Reusable/ImageUploader";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import api from "@/services/api";
import draggable from "vuedraggable";
import BaseDragIcon from "@/components/icons/BaseDragIcon";

export default {
  name: "CreationCompanyModal",
  components: {
    BaseDragIcon,
    BaseDeleteIcon,
    BaseCameraIcon,
    BaseButton,
    BaseInput,
    BaseModal,
    BaseCloseIcon,
    ImageUploader,
    draggable,
  },
  emits: ["layout-data"],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    plan: {
      type: Object,
      default: () => {
        return {
          name: null,
          area: null,
          balcony_area: null,
          images: [],
          plan_id: null,
        };
      },
    },
  },
  data() {
    return {
      maskText: "",
      loading: false,
      planData: {
        name: null,
        area: null,
        balcony_area: null,
        images: [],
        plan_id: null,
      },
      providerSchema: [
        {
          mask: "",
          type: "text",
          bind: "name",
          labelFor: "name",
          rules: "required",
          label: this.$t("objects.create.plan.search"),
        },
        {
          mask: "",
          type: "text",
          bind: "area",
          labelFor: "area",
          rules: "required",
          label: this.$t("type_plan.area"),
        },
        {
          mask: "",
          type: "text",
          bind: "balcony_area",
          labelFor: "balcony_area",
          rules: "",
          label: this.$t("type_plan.balcony"),
        },
      ],
    };
  },
  watch: {
    plan: {
      deep: true,
      handler(value) {
        this.setPlanData(value);
      },
    },
  },
  methods: {
    setPlanData(value) {
      this.planData = {
        name: value.name,
        area: value.area,
        balcony_area: value.balcony_area,
        images: value.images,
        plan_id: value.id,
      };
    },
    createImage(event) {
      if (event.path instanceof File) {
        let img = URL.createObjectURL(event.path);
        return img || null;
      } else {
        return event.path;
      }
    },
    deleteImg(img, index) {
      if (!(img.path instanceof File)) {
        const objectId = this.$route.params.id;
        const planId = this.plan?.id;
        api.plans
          .deletePlanImage(objectId, planId, img.id)
          .then(() => {
            this.planData.images.splice(index, 1);
          })
          .catch((err) => {
            return err;
          });
      } else {
        this.planData.images.splice(index, 1);
      }
    },
    setImage(img) {
      for (let i = 0; i < img.length; i++) {
        const lastId = this.planData.images.length;
        if (this.planData.images.length < 12) {
          this.planData.images.push({
            path: img[i],
            position: lastId + 1,
          });
        }
      }
    },
    closePlanModal() {
      this.$refs["plan-modal"].closeModal();
    },
    openPlanModal() {
      this.$refs["plan-modal"].openModal();
    },
    renderPositionImage() {
      let images = this.planData.images;
      const objectId = this.$route.params.id;
      const planId = this.plan.id;
      let oldImages = [];
      let newImages = [];

      if (images.length) {
        images.forEach((item, index) => {
          item.position = index + 1;
        });
      }

      images.forEach((image) => {
        if (!(image.path instanceof File)) {
          oldImages.push({
            id: image.id,
            position: image.position,
          });
        } else {
          newImages.push({
            file: image.path,
            position: image.position,
          });
        }
      });

      if (oldImages && oldImages.length) {
        const body = {
          images: oldImages,
        };
        api.plans.updatePositionImage(objectId, planId, body).then(() => {});
      }

      if (newImages && newImages.length) {
        this.planData.images = newImages;
      } else {
        this.planData.images = [];
      }
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
      const objectId = this.$route.params.id;
      const planId = this.plan.id;
      if (valid && this.planData.images.length) {
        this.renderPositionImage();

        if (!planId) {
          const b = Object.assign({}, this.planData);
          delete b.plan_id;
          const form = this.renderFormData(b);
          await api.plans.createPlan(objectId, form).then(() => {
            this.closePlanModal();
            this.$emit("update-list");
          });
        } else {
          const form = this.renderFormData(this.planData);
          await api.plans.updatePlan(objectId, planId, form).then(() => {
            this.closePlanModal();
            this.$emit("update-list");
          });
        }
      } else {
        this.$swal({
          title: this.$t("error"),
          text: this.$t("sweetAlert.payment_list_add"),
          icon: "error",
        });
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
      this.planData.images = [];
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
            {{ $t("objects.create.plan.add_image") }}
          </p>
          <!--   CLOSE    -->
          <div class="go__back" @click="cancel">
            <BaseCloseIcon :width="56" :height="56" />
          </div>
        </div>
      </template>
      <template #main>
        <div class="uploader-container flex-column">
          <draggable
            :list="planData.images"
            class="row uploader-row ml-0"
            handle=".handle"
          >
            <div
              v-for="(img, index) in planData.images"
              :key="index"
              class="col-3"
            >
              <div class="uploader">
                <div class="action-list">
                  <div class="drag-plan handle">
                    <base-drag-icon
                      :width="20"
                      :height="20"
                      fill="var(--white)"
                    />
                  </div>
                  <div @click="deleteImg(img, index)" class="delete-plan">
                    <base-delete-icon
                      :width="18"
                      :height="18"
                      fill="var(--white)"
                    />
                  </div>
                </div>

                <img :src="createImage(img)" alt="img" />
              </div>
            </div>
            <div
              v-if="planData.images && planData.images.length < 12"
              class="col-3"
            >
              <div class="uploader">
                <image-uploader :multiple="true" @upload-image="setImage" />
              </div>
            </div>
          </draggable>
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
              :id="labelFor"
              :label="true"
              class="w-100"
              :error="!!errors.length"
              :placeholder="label"
              :mask="mask"
              v-model="planData[bind]"
            />
          </ValidationProvider>
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
            :text="$t('add')"
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
