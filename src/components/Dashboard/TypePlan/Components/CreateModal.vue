<template>
  <div>
    <b-modal
        id="modal-create"
        ref="creation-modal"
        size="lg"
        :title="`${ $t('objects.create.plan.add') }`"
        hide-footer
        @show="resetModal"
    >
      <form ref="form" class="create-layout" @submit.prevent="handleSubmit">
        <span class="uploader-container">
          <span class="row-item row-item-1">
            <span class="uploader">
              <span class="active-uploader">
                <BaseCameraIcon fill="#A78BFA"/>
                <p>{{ $t('objects.create.plan.add_image') }}</p>
              </span>
            </span>
            <span class="uploader">
              <BaseCameraIcon/>
            </span>
          </span>
          <span class="row-item row-item-2">
            <span class="uploader">
              <BaseCameraIcon/>
            </span>
            <span class="uploader">
              <BaseCameraIcon/>
            </span>
            <span class="uploader">
              <BaseCameraIcon/>
            </span>
          </span>
        </span>
        <ValidationProvider v-for="{label,labelFor,bind,mask,rules, type} in providerSchema"
                            :key="label + labelFor"
                            :name="label"
                            :rules="rules"
                            v-slot="{ errors }">
          <BaseInput :type="type" :id="labelFor" :label="true" :placeholder="label"
                     :mask="mask" v-model="layout[bind]"/>
        </ValidationProvider>
      </form>
      <div class="btns">
        <BaseButton @click="cancel" text="Cancel" class="btn btn-cancel"/>
        <BaseButton @click="add" text="Add" class="btn btn-add"/>
      </div>
    </b-modal>
  </div>
</template>

<script>
import BaseInput from "@/components/Reusable/BaseInput";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseCameraIcon from "@/components/icons/BaseCameraIcon";

export default {
  name: 'CreationCompanyModal',
  components: {BaseCameraIcon, BaseButton, BaseInput},
  emits: ['layout-data'],
  data() {
    return {
      maskText: '',
      loading: false,
      layout: {
        name: null,
        rooming: null,
        area: null
      },
      providerSchema: [
        {
          mask: '',
          type: 'text',
          bind: 'name',
          labelFor: 'name',
          rules: 'required|min:2',
          label: this.$t('objects.create.plan.search')
        },
        {
          mask: '',
          type: 'number',
          bind: 'rooming',
          labelFor: 'rooming',
          rules: 'required|min:2',
          label: this.$t('type_plan.rooming')
        },
        {
          mask: '',
          type: 'number',
          bind: 'area',
          labelFor: 'area',
          rules: 'required|min:2',
          label: this.$t('type_plan.area')
        },
      ]
    }
  },
  methods: {
    resetModal() {
      this.$bvModal.hide("modal-create")
    },
    handleSubmit() {
      console.log("post to the backend")
      this.resetModal()
    },
    add() {
      this.$bvModal.hide("modal-create")
      this.$swal({
        title: this.$t('successfully'),
        text: this.$t('sweetAlert.payment_list_add'),
        icon: "success"
      })
    },
    cancel() {
      this.$bvModal.hide("modal-create")
    }
  }
}
</script>

<style lang="scss" scoped>
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
::v-deep .modal-dialog {
  max-width: 500px!important;
}
::v-deep .modal-content {
  border-radius: 56px;
  border: none;
  padding: 55px 40px;
  header {
    padding: 0;
    border: none;
    align-items: center;
    h5 {
      font-size: 36px;
      line-height: 42px;
      font-weight: 900;
      color: #4B5563;
      font-family: Craftwork Sans, serif;
    }
    .close {
      background-color: #F3F4F6;
      border-radius: 50%;
      padding: 10px 18px 12px;
      color: #9CA3AF;
      font-size: 28px;
      font-weight: 400;
    }
  }
  .modal-body {
    padding: 50px 0 0;
    .base__button {
      width: 100%;
    }
    .base-input {
      padding: 17px 20px;
      border: none;
      height: 56px;
      width: 100%;
      input::placeholder {
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        font-family: Inter, serif;
      }
      .input-label span{
        top: -3px!important;
        font-family: Craftwork Sans, serif;
        color: #9CA3AF;
        font-size: 6px;
        font-weight: 900;
        letter-spacing: 1px;
        line-height: 10px;
      }
    }
    .btns {
      margin-top: 3em;
      display: flex;
      gap: 20px;
      .btn {
        border: none!important;
        color: #4B5563;
        font-size: 16px;
        font-family: Inter, serif;
        margin: 0;
        &-add {
          background: linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%);
          color: white;
        }
      }
    }
  }
}
.uploader-container {
  display: flex;
  width: 100%;
  gap: 6px;
  height: 300px;
  flex-direction: column;
  .row-item {
    display: flex;
    gap: 8px;
    height: 100%;
    flex-direction: row;
    justify-content: space-between;
    &-2{
      height: 75%;
    }
    .uploader{
      border-radius: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      border: 2px solid #F3F4F6;
    }
  }
  .active-uploader {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    p {
      color: #4B5563;
      font-weight: 600;
      font-family: Inter, serif;
      line-height: 22px;
    }
  }
}
</style>
