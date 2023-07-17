<script>
import { makeProp } from "@/util/props";
import { isEmptyObject } from "@/util/inspect";
import { v3ServiceApi } from "@/services/v3/v3.service";
import { PROP_TYPE_OBJECT } from "@/constants/props";
import { XModalCenter } from "@/components/ui-components/modal-center";
import { XFormSelect } from "@/components/ui-components/form-select";
export default {
  name: "StatusUpsert",
  components: {
    XModalCenter,
    XFormSelect,
  },
  props: {
    editItem: makeProp(PROP_TYPE_OBJECT, {
      item: {},
      options: [],
    }),
  },
  emits: ["finished", "close-creating-modal"],
  data() {
    const clientForm = {
      status_id: null,
      error: {
        active: false,
        message: undefined,
      },
    };
    return {
      applyButtonLoading: false,
      clientForm,
      client: {
        ...clientForm,
      },
    };
  },
  computed: {
    optionList() {
      const l = this.editItem.options.map((h) => {
        return {
          value: h.id,
          text: h.title[this.$i18n.locale],
        };
      });

      l.unshift({
        text: this.$t("deselect"),
        value: null,
      });

      return l;
    },
  },
  created() {
    this.setEditData();
  },
  methods: {
    setEditData() {
      if (isEmptyObject(this.editItem)) {
        return;
      }

      this.clientForm.status_id = this.editItem.status?.id ?? null;
    },
    closeCreatingModal() {
      this.clearForm();
      this.$emit("close-creating-modal");
    },
    startLoading() {
      this.applyButtonLoading = true;
    },
    finishLoading() {
      this.applyButtonLoading = false;
    },
    async submitClientType() {
      const isSatisfied = await this.$refs["creating-type-observer"].validate();
      if (isSatisfied) {
        this.startLoading();
        try {
          await v3ServiceApi.apartments().setStatus({
            apartment_id: this.editItem.id,
            status_id: this.clientForm.status_id,
          });
          this.clearForm();
          await this.$emit("finished");
        } catch (e) {
          this.toastedWithErrorCode(e);
        } finally {
          this.finishLoading();
        }
      }
    },
    clearForm() {
      this.client = { ...this.clientForm };
    },
  },
};
</script>

<template>
  <x-modal-center
    :bilingual="true"
    apply-button-text="save"
    cancel-button-text="cancel"
    footer-class="d-flex justify-content-between x-gap-1"
    apply-button-class="w-100"
    cancel-button-class="w-100"
    :apply-button-loading="applyButtonLoading"
    :modal-container-style="{
      'max-width': '720px',
      'max-height': '420px',
      width: '75%',
      height: '100%',
      overflowY: 'scroll',
    }"
    @close="closeCreatingModal"
    @cancel="closeCreatingModal"
    @apply="submitClientType"
  >
    <template #header>
      <h3 class="x-font-size-36px font-craftworksans color-gray-600">
        {{ $t("statuses.select") }}
      </h3>
    </template>

    <template #body>
      <validation-observer
        ref="creating-type-observer"
        class="client-type-creating-body"
      >
        <!--   ? SET APARTMENT HOLDER    -->

        <validation-provider
          ref="vProvider01"
          name="vProvider01"
          rules=""
          v-slot="{ errors }"
          class="name-provider"
        >
          <label class="holder-label mb-4" for="select-managers">
            {{ $t("statuses.singular") }}
          </label>

          <x-form-select
            id="select-managers"
            :label="false"
            :options="optionList"
            v-model="clientForm.status_id"
          />
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("vProvider01", $t("statuses.singular")) }}
          </span>
        </validation-provider>
      </validation-observer>
    </template>
  </x-modal-center>
</template>

<style lang="scss" scoped>
.client-type-creating-body {
  margin-top: 3rem;
  margin-bottom: 3rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  font-family: Inter, sans-serif;
  color: var(--gray-600);
  //grid-template-areas:
  //  "lastNameProvider middleNameProvider"
  //  "nameProvider nameProvider";
  //
  //.last-name-provider {
  //  grid-area: lastNameProvider;
  //}
  //
  //.name-provider {
  //  grid-area: nameProvider;
  //}
  //
  //.middle-name-provider {
  //  grid-area: middleNameProvider;
  //}
}

.icons-collection-wrapper {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

.holder-label {
  font-size: 18px;
  color: var(--gray-400);
  font-weight: 500;
  font-family: Inter, serif;
}

.error__provider {
  color: red;
  font-size: 12px;
}
</style>
