<script>
import api from "@/services/api";
import "vue2-datepicker/index.css";
import BaseInput from "@/components/Reusable/BaseInput";
// import BaseSelect from "@/components/Reusable/BaseSelect";
import { XFormSelect } from "@/components/ui-components/form-select";

export default {
  name: "CreationCompanyModal",
  components: {
    // BaseMultiselect,
    BaseInput,
    // BaseSelect,
    XFormSelect: XFormSelect,
  },
  emits: ["updated-company", "created-new-company"],
  props: {
    historyEditInfo: {
      type: Object,
      default: () => ({}),
    },
    modalProperties: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      image: "@/assets/icons/icon-down.svg",
      maskText: "",
      loading: false,
      companyTypes: [],
      createPosition: true,
      company: {
        inn: null,
        first_name: null,
        last_name: null,
        second_name: null,
        name: null,
        phone: null,
        other_phone: null,
        type_id: null,
        address: null,
        code: null,
        oked: null,
      },
      providerSchema: [
        {
          mask: "",
          type: "text",
          bind: "name",
          labelFor: "name",
          rules: "required|min:2",
          label: this.$t("companies.name"),
          placeholder: this.$t("companies.search"),
        },
        {
          mask: "",
          type: "text",
          bind: "first_name",
          labelFor: "first_name",
          rules: "required|min:2",
          label: this.$t("companies.first_name"),
          placeholder: this.$t("companies.first_name"),
        },
        {
          mask: "",
          type: "text",
          bind: "last_name",
          labelFor: "last_name",
          rules: "required|min:2",
          label: this.$t("companies.last_name"),
          placeholder: this.$t("companies.last_name"),
        },
        {
          mask: "",
          type: "text",
          bind: "second_name",
          labelFor: "second_name",
          rules: "required|min:2",
          label: this.$t("companies.second_phone"),
          placeholder: this.$t("companies.second_name"),
        },
        {
          mask: "",
          type: "text",
          bind: "address",
          labelFor: "address",
          rules: "required|min:2",
          label: this.$t("companies.address"),
          placeholder: this.$t("companies.address"),
        },
        {
          mask: "############",
          type: "tel",
          bind: "phone",
          labelFor: "phone",
          rules: "required|min:2",
          label: this.$t("companies.fax_number"),
          placeholder: this.$t("companies.fax_number"),
        },
        {
          mask: "############",
          type: "tel",
          bind: "other_phone",
          labelFor: "other_phone",
          rules: "required|min:2",
          label: this.$t("companies.other_phone"),
          placeholder: this.$t("companies.other_phone"),
        },
        {
          mask: "",
          type: "text",
          bind: "oked",
          labelFor: "oked",
          rules: "required|min:2",
          label: this.$t("companies.oked"),
          placeholder: this.$t("companies.oked"),
        },
        {
          mask: "",
          type: "text",
          bind: "inn",
          labelFor: "inn",
          rules: "required|min:2",
          label: this.$t("companies.inn"),
          placeholder: this.$t("companies.inn"),
        },
        {
          mask: "############",
          type: "text",
          bind: "code",
          labelFor: "code",
          rules: "required|min:2",
          label: this.$t("companies.code"),
          placeholder: this.$t("companies.code"),
        },
      ],
    };
  },

  watch: {
    historyEditInfo(historyData) {
      const hasProperties = Object.keys(historyData).length > 0;
      if (hasProperties) {
        this.setFormProperties();
      }
    },
  },

  computed: {
    typeOptions() {
      return this.companyTypes.map(({ id: value, name }) => {
        let text = name.ru;
        if (localStorage.locale) {
          text = name[localStorage.locale];
        }
        return {
          value,
          text,
        };
      });
    },
  },

  async created() {
    await this.fetchCompanyType();
  },

  methods: {
    inputFilterObject(objects) {
      this.company.type_id = objects.map(({ value }) => value);
    },
    show() {
      this.$refs["creation-modal"].show();
    },
    fetchCompanyType() {
      api.companies
        .getCompanyType()
        .then((response) => {
          this.companyTypes = response.data;
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        });
    },
    resetModal() {
      this.company = {
        type_id: null,
        inn: null,
        name: null,
        phone: null,
        last_name: null,
        middle_name: null,
        other_phone: null,
        first_name: null,
        address: null,
        code: null,
        oked: null,
      };

      this.$bvModal.hide("modal-create");
    },

    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },

    async setFormProperties() {
      let companyData = {};
      await api.companies
        .getCompany(this.historyEditInfo.id)
        .then((res) => {
          companyData = res.data;
        })
        .catch(() => {
          companyData = {};
        });
      this.createPosition = false;
      this.company = {
        ...this.company,
        ...companyData,
      };
    },

    submitForm() {
      /*

          const {bank_name_ru, bank_name_uz} = this.company
          const bank_name = {
            uz: bank_name_uz,
            ru: bank_name_ru
          }

      */

      const form = Object.assign(
        {
          /*bank_name*/
        },
        this.company
      );

      /*

        delete form.bank_name_ru
        delete form.bank_name_uz

      */

      const { position } = this.modalProperties;

      if (position === "create") this.saveNewCompany(form);
      else this.updateCurrentCompany(form);
    },
    async saveNewCompany(form) {
      this.loading = true;
      await api.companies
        .createNewCompany(form)
        .then((response) => {
          const { message } = response.data;
          this.$bvModal.hide("modal-create");
          this.$emit("created-new-company", { message });
          this.resetModal();
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async updateCurrentCompany(form) {
      this.loading = true;
      await api.companies
        .updateCompany(form)
        .then((response) => {
          const { message } = response.data;
          this.$bvModal.hide("modal-create");
          this.$emit("updated-company", { message });
          this.resetModal();
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<template>
  <b-modal
    id="modal-create"
    ref="creation-modal"
    :title="modalProperties.title"
    hide-footer
    @show="resetModal"
  >
    <ValidationObserver ref="validation-observer" v-slot="{ handleSubmit }">
      <form ref="form" @submit.prevent="handleSubmit(submitForm)">
        <x-form-select
          id="select-managers"
          :label="true"
          :options="typeOptions"
          :placeholder="$t('companies.type')"
          v-model="company.type_id"
          class="mb-3"
        >
          <template #placeholder>
            <div>djskdjsk</div>
          </template>
        </x-form-select>

        <!--        <b-form-group-->
        <!--            class="mb-3 select_input select_custom"-->
        <!--        >-->
        <!--          <base-select-->
        <!--              id="type"-->
        <!--              :label="true"-->
        <!--              :label-for="$t('companies.type')"-->
        <!--              :no-placeholder="true"-->
        <!--              :placeholder="`${$t('companies.type')}`"-->
        <!--              :name="`${ $t('companies.type') }`"-->
        <!--              @change="company.type_id = $event"-->
        <!--              :options="typeOptions"-->
        <!--          />-->
        <!--        </b-form-group>-->

        <ValidationProvider
          v-for="{
            label,
            labelFor,
            bind,
            mask,
            rules,
            type,
            placeholder,
          } in providerSchema"
          :key="label + labelFor"
          :name="label"
          :rules="rules"
          v-slot="{ errors }"
        >
          <b-form-group class="select_input">
            <base-input
              :type="type"
              :id="labelFor"
              :label="true"
              :placeholder="placeholder"
              :mask="mask"
              v-model="company[bind]"
            />
          </b-form-group>
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0] }}
          </span>
        </ValidationProvider>

        <div class="d-flex footer-btn justify-content-between pb-4">
          <b-button variant="light" @click="resetModal">
            {{ $t("cancel") }}
          </b-button>

          <b-button type="submit" class="ml-1 mr-0" variant="success">
            <span class="save__button">{{ $t("save") }}</span>
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          </b-button>
        </div>
      </form>
    </ValidationObserver>
  </b-modal>
</template>

<style lang="scss" scoped>
.error__provider {
  color: red;
  display: block;
  margin-bottom: 1rem;
}

.save__button {
  color: white;
}

::v-deep #modal-create {
  background: rgba(173, 177, 186, 0.32);
  backdrop-filter: blur(2px);

  .modal-dialog {
    .modal-content {
      border-radius: 50px;
      padding: 20px;

      header {
        border-bottom: none;
        display: flex;
        align-items: center;

        h5 {
          font-size: 36px;
          color: #4b5563;
        }

        button {
          background: #f3f4f6;
          border-radius: 50%;
          padding: 12px 18px;
        }
      }

      .modal-body {
        fieldset {
          div {
            border-radius: 50px;
          }
        }
      }
    }
  }
}

.select_input {
  .base-input {
    width: 100%;

    ::v-deep .input-label span {
      top: -5px !important;
    }
  }
}

.footer-btn {
  .btn {
    width: 50%;
  }

  .btn:nth-child(2) {
    background: linear-gradient(88.25deg, #7c3aed 0%, #818cf8 100%) !important;
  }
}

.select_custom {
  ::v-deep span {
    color: #9ca3af;
  }
}
</style>
