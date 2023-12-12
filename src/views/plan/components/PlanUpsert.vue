<script>
import {computed, getCurrentInstance, ref} from "vue";
import {makeProp} from "@/util/props";
import {isEmptyObject} from "@/util/inspect";
import {v3ServiceApi} from "@/services/v3/v3.service";
import {useToastError} from "@/composables/useToastError";
import {PROP_TYPE_OBJECT, PROP_TYPE_STRING} from "@/constants/props";
import {XFormInput} from "@/components/ui-components/form-input";
import {XModalCenter} from "@/components/ui-components/modal-center";
import {XFormSelect} from "@/components/ui-components/form-select";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker.vue";
import {addZero, dateProperties} from "@/util/date/calendar.util";

export default {
  name: "PlanUpsert",
  components: {
    BaseDatePicker,
    XFormInput,
    XModalCenter,
    XFormSelect,
  },
  props: {
    upsertType: makeProp(PROP_TYPE_STRING, "create", (type) => {
      return ["create", "edit"].includes(type);
    }),
    editItem: makeProp(PROP_TYPE_OBJECT, {
      date: [],
      amount: null,
      type: null
    }),
    planTypes: {
      type: Array,
      default: () => ([])
    }
  },
  emits: ["created", "close-creating-modal"],
  setup(props, {emit}) {
    const {toastError} = useToastError()
    const vm = getCurrentInstance().proxy
    const formObserverRef = ref(null)
    const applyButtonLoading = ref(false)
    const clientForm = ref({
      date: {
        from: null,
        to: null
      },
      amount: 0,
      type: null,
      error: {
        active: false,
        message: undefined,
      },
    })
    const formData = ref({...clientForm.value})

    const typeOptions = computed(() => {
      return props.planTypes.map(option => {
        return {
          value: option.value,
          text: option.text[vm.$i18n.locale]
        }
      })
    })

    function setEditData() {
      if (isEmptyObject(props.editItem)) {
        return;
      }

      formData.value.date.from = props.editItem.date_from;
      formData.value.date.to = props.editItem.date_to;
      formData.value.type = props.editItem.type.type;
      formData.value.amount = props.editItem.amount;
    }

    function closeCreatingModal() {
      clearForm();
      emit("close-creating-modal");
    }

    function startLoading() {
      applyButtonLoading.value = true;
    }

    function finishLoading() {
      applyButtonLoading.value = false;
    }

    function submitClientType() {
      if (props.upsertType === "edit") {
        editClientType();
      } else {
        applyNewClientType();
      }
    }

    function makeBody() {
      const {lastDateOfMonth, year, month} = dateProperties(formData.value.date.from)
      return {
        type: formData.value.type,
        date_from: formData.value.date.from,
        date_to: `${year}-${addZero(month + 1)}-${lastDateOfMonth}`,
        // date: [
        //   formData.value.date.from,
        //   `${year}-${addZero(month + 1)}-${lastDateOfMonth}`
        // formData.value.date.to,
        // ],
        amount: formData.value.amount,
      }
    }

    async function applyNewClientType() {
      const isSatisfied = await formObserverRef.value.validate();
      if (isSatisfied) {
        startLoading();
        try {
          await v3ServiceApi.plan.create(
              makeBody()
          );
          clearForm();
          await emit("created");
        } catch (e) {
          toastError(e)
        } finally {
          finishLoading();
        }
      }
    }

    async function editClientType() {
      const isSatisfied = await formObserverRef.value.validate();
      if (isSatisfied) {
        startLoading();
        try {
          const response = await v3ServiceApi.plan.update({
            id: props.editItem.id,
            ...makeBody(),
          });
          clearForm();
          response && emit("created");
        } catch (e) {
          toastError(e)
        } finally {
          finishLoading();
        }
      }
    }


    function clearForm() {
      formData.value.type = null
      formData.value.date = {
        from: null,
        to: null,
      }
      formData.value.amount = null
      formData.value.error = {
        active: false,
        message: undefined,
      }
    }

    if (props.upsertType === "edit") {
      setEditData();
    }

    return {
      formData,
      clientForm,
      formObserverRef,
      applyButtonLoading,
      typeOptions,

      closeCreatingModal,
      submitClientType
    }
  }
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
      'max-width': '960px',
      width: '75%',
      height: 'auto',
      overflowY: 'scroll',
    }"
      @close="closeCreatingModal"
      @cancel="closeCreatingModal"
      @apply="submitClientType"
  >
    <template #header>
      <h3 class="x-font-size-36px font-craftworksans color-gray-600">
        {{ upsertType === 'create' ? $t("plan.add") : $t("plan.edit") }}
      </h3>
    </template>

    <template #body>
      <validation-observer
          ref="formObserverRef"
          class="client-type-creating-body"
      >
        <!--   ? TYPE OF PLAN | SELECT     -->
        <validation-provider
            ref="typeProvider"
            name="typeProvider"
            rules="required"
            v-slot="{ errors }"
        >
          <x-form-select
              v-model="formData.type"
              :multiple="false"
              :options="typeOptions"
              :placeholder="$t('plan_type')"
          />
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("typeProvider", $t("plan_type")) }}
          </span>
        </validation-provider>

        <!--   ? DATE     -->
        <validation-provider
            ref="dateProvider"
            name="dateProvider"
            rules="required"
            v-slot="{ errors }"
        >
          <base-date-picker
              type="month"
              class="w-100"
              :range="false"
              :placeholder="`${$t('common.date')}`"
              v-model="formData.date.from"
          />
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("dateProvider", $t("common.date")) }}
          </span>
        </validation-provider>

        <!--   ? TO DATE     -->
        <!--
        <validation-provider
            ref="toDateProvider"
            name="toDateProvider"
            rules="required"
            v-slot="{ errors }"
        >
          <base-date-picker
              class="w-100"
              :range="false"
              :placeholder="`${$t('to_the_date_of')}`"
              v-model="formData.date.to"
          />
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("toDateProvider", $t("date")) }}
          </span>
        </validation-provider>
        -->


        <!--   ? AMOUNT     -->
        <validation-provider
            ref="amountProvider"
            name="amountProvider"
            rules="required"
            v-slot="{ errors }"
        >
          <x-form-input
              type="number"
              :label="true"
              :currency-symbol="true"
              :placeholder="`${ $t('plan_amount') }`"
              class="w-100"
              v-model="formData.amount"
          />
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("amountProvider", $t("plan_amount")) }}
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
}

.icons-collection-wrapper {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

.error__provider {
  color: red;
  font-size: 12px;
}
</style>
