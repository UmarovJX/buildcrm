<script>
import api from "@/services/api";
import { v3ServiceApi } from "@/services/v3/v3.service";
import ImageUploader from "@/components/Reusable/ImageUploader";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import { XIcon } from "@/components/ui-components/material-icons";
import AnimationFrame from "@/components/ui-components/loading/AnimationFrame";

export default {
  name: "CheckoutClientDetails",
  components: {
    ImageUploader,
    XCircularBackground,
    AnimationFrame,
    XIcon,
  },
  props: {
    list: {
      type: Array,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Копии паспорта",
    },
    buttonLabel: {
      type: String,
    },
  },

  computed: {},

  async created() {},
  watch: {
    "personalData.id"() {
      this.openExistingScans();
    },
  },

  methods: {
    newImageURL(image) {
      if (image instanceof File) return URL.createObjectURL(image) || null;
      return image.upload.path;
    },
    downloadFile(item) {
      if (item.id) {
        const url = new URL(item.upload.path);
        url.protocol = "https";
        const link = document.createElement("a");
        link.setAttribute("download", item.upload.name);
        link.setAttribute("target", "_blank");
        link.href = url.href;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },

    async addScan(d) {
      if (this.loading) return;
      try {
        if (this.id) {
          this.$emit("start-loading");
          const uploads = await Promise.all(
            [...d].map((el) => {
              const body = new FormData();
              body.append("type", this.type);
              body.append("attachment", el);
              return api.uploadsV3
                .createUpload(body)
                .then((res) => res.data.result.id);
            })
          );
          await Promise.all(
            uploads.map(
              async (id) =>
                await v3ServiceApi.scannedContracts.create({
                  type: this.type,
                  model_id: this.id,
                  upload_id: id,
                })
            )
          );
          this.$emit("update-list");
          return;
        }
        this.$emit("add-item", d);
      } catch (error) {
        this.toastedWithErrorCode(error);
        this.$emit("stop-loading");
      }
    },
    async deleteScan(item, i) {
      if (this.loading) return;
      const result = await this.$swal({
        text: this.$t("sweetAlert.text"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yes"),
      });

      if (result.value) {
        if (item instanceof File) {
          return this.$emit("delete-item", i);
        }
        this.$emit("start-loading");

        try {
          await v3ServiceApi.scannedContracts.remove({
            id: item.id,
          });
          this.$emit("update-list");
        } catch (error) {
          this.$emit("stop-loading");
        }
      }
    },
  },
};
</script>

<template>
  <div class="test">
    <div class="passport-title">{{ title }}</div>
    <div v-if="list?.length" class="images">
      <div class="image" v-for="(item, i) in list" :key="item.id || i">
        <div class="pdf-placeholder" v-if="item.upload?.extension === 'pdf'">
          PDF
        </div>
        <img :src="newImageURL(item)" alt="" v-else />
        <div class="controls">
          <!-- <a
            :href="item.upload.path"
            :download="item.upload.name"
            target="_blank"
            v-if="item.upload"
          > -->
          <x-circular-background
            class="bg-violet-600 cursor-pointer"
            @click="downloadFile(item)"
          >
            <x-icon name="download" class="color-white" />
          </x-circular-background>
          <!-- </a> -->

          <x-circular-background
            class="bg-red-600 cursor-pointer"
            @click="deleteScan(item, i)"
          >
            <x-icon name="delete" class="color-white" />
          </x-circular-background>
        </div>
      </div>
    </div>
    <div>
      <image-uploader
        :multiple="true"
        @upload-image="addScan"
        accept="image/*,application/pdf"
        :label="buttonLabel"
      />
    </div>
    <animation-frame v-show="loading" class="loader" />
  </div>
</template>



<style scoped lang="scss">
.test {
  width: 100%;
  grid-column: 2/3;
  grid-row: 2;
  border: 2px solid var(--gray-100);
  padding: 10px;
  border-radius: 10px;
  align-self: start;
  position: relative;
  overflow: hidden;
}

.passport-title {
  color: var(--gray-400);
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.pdf-placeholder {
  font-size: 40px;
  font-weight: 600;
  color: var(--gray-400);
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
  width: 100%;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  min-height: unset;
  background-color: rgba(0, 0, 0, 0.2);
}
.images {
  display: grid;
  margin-bottom: 20px;
  gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
  & .image {
    position: relative;
    border: 1px solid var(--gray-100);
    border-radius: 4px;
    display: flex;
    align-content: center;
    justify-content: center;
    & img {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid var(--gray-100);
    }
  }

  & .controls {
    position: absolute;
    bottom: 5px;
    right: 5px;
    display: flex;
    gap: 12px;
  }
}
.no-image {
  padding: 20px;
  text-align: center;
  color: var(--gray-600);
  font-size: 24px;
  font-weight: 600;
}
</style>
