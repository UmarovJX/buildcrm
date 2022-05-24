<template>
  <div>
    <!--    <b-modal-->
    <!--        id="modal-create-discount"-->
    <!--        class="py-4"-->
    <!--        ref="modal"-->
    <!--        :title="$t('objects.create.new_rules_discount')"-->
    <!--        hide-footer-->
    <!--        no-close-on-backdrop-->
    <!--    >-->
    <!--      <div class="alert alert-danger mt-3" v-if="error">-->
    <!--        <ul>-->
    <!--          <li v-for="(error, index) in errors" :key="index">-->
    <!--            <span v-for="msg in error" :key="msg">-->
    <!--              {{ msg }}-->
    <!--            </span>-->
    <!--          </li>-->
    <!--        </ul>-->
    <!--      </div>-->

    <!--      <form class="my-form" @submit.prevent="SaveDiscount">-->
    <!--        <div class="container px-0 mx-0 mt-4">-->
    <!--          <div class="row">-->
    <!--            <div class="col-12">-->
    <!--              <div class="mb-3">-->
    <!--                <label class="d-block">{{-->
    <!--                    $t("objects.create.pre_pay")-->
    <!--                  }}</label>-->
    <!--                <div class="d-flex justify-content-between align-items-center">-->
    <!--                  <div class="">-->
    <!--                    <input-->
    <!--                        class="my-form__input"-->
    <!--                        type="number"-->
    <!--                        min="0"-->
    <!--                        step="0.1"-->
    <!--                        v-model="discount.prepay_from"-->
    <!--                    />-->
    <!--                  </div>-->
    <!--                  <div class="mx-2 long-horizontal-line">&#8213;</div>-->
    <!--                  <div class="">-->
    <!--                    <input-->
    <!--                        class="my-form__input"-->
    <!--                        type="number"-->
    <!--                        min="1"-->
    <!--                        step="0.1"-->
    <!--                        v-model="discount.prepay_to"-->
    <!--                    />-->
    <!--                  </div>-->
    <!--                </div>-->
    <!--              </div>-->
    <!--            </div>-->
    <!--            <div class="col-12">-->
    <!--              <div class="mb-3">-->
    <!--                <label class="d-block" for="new_block_discount">{{-->
    <!--                    $t("objects.create.discount")-->
    <!--                  }}</label>-->
    <!--                <div class="flex-grow-1">-->
    <!--                  <input-->
    <!--                      id="new_block_discount"-->
    <!--                      class="my-form__input"-->
    <!--                      step="0.1"-->
    <!--                      type="number"-->
    <!--                      min="0"-->
    <!--                      v-model="discount.discount"-->
    <!--                  />-->
    <!--                </div>-->
    <!--              </div>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--          <div class="row">-->
    <!--            .-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <div-->
    <!--            class="-->
    <!--            mt-4-->
    <!--            d-flex-->
    <!--            justify-content-md-start justify-content-center-->
    <!--            float-right-->
    <!--          "-->
    <!--        >-->
    <!--          <button-->
    <!--              type="button"-->
    <!--              class="btn btn-default mr-2"-->
    <!--              @click="discountTrash"-->
    <!--          >-->
    <!--            {{ $t("cancel") }}-->
    <!--          </button>-->

    <!--          <button type="submit" class="btn btn-primary">-->
    <!--            {{ $t("save") }}-->
    <!--          </button>-->
    <!--        </div>-->
    <!--      </form>-->
    <!--    </b-modal>-->

    
    <base-modal ref="create" design="large-modal">
      <template #header>

        <span class="d-flex align-items-center justify-content-between">

          <!--    TITLE      -->
          <span class="title">{{ $t('apartments.add_tariff') }}</span>

          <!--   CLOSE    -->
          <span class="go__back" @click="closeModal">
            <BaseCLose :width="56" :height="56"/>
          </span>
        </span>
      </template>

      <template #main>
        <div class="create">
          <h5 class="create-title">Основные</h5>
          <p class="create-tab__name">
            Тип тарифа
          </p>
          <div class="create-tab">
            <div class="create-tab__nav">
              <base-button text="Фиксированный"/>
              <base-button text="Процентный"/>
              <base-button text="Разделенный"/>
            </div>
            <base-input v-model="planName" placeholder="Название тарифа" :label="true"/>
          </div>

          <h5 class="create-title">Цены</h5>

          <div>
            <base-button text="Добавить цену">
              <template #left-icon>
                <base-plus-icon fill="var(--violet-600)"/>
              </template>
            </base-button>
          </div>
        </div>


      </template>

      <template #footer>
        <div class="footer-btn">
          <base-button text="Отменить"/>
          <base-button class="violet-gradient" text="Добавить"/>
        </div>
      </template>

    </base-modal>

  </div>
</template>

<script>
import api from "@/services/api";
import BaseModal from "@/components/Reusable/BaseModal";
// import BaseModal from "@/components/Reusable/BaseModal";
import BaseCLose from "@/components/icons/BaseClose";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseInput from "@/components/Reusable/BaseInput";
import BasePlusIcon from "@/components/icons/BasePlusIcon";

export default {
  components: {
    BaseCLose,
    "base-modal": BaseModal,
    BaseButton,
    BaseInput,
    BasePlusIcon
  },
  props: {
    object: {},
  },

  data: () => ({
    discount: {
      prepay_from: 0,
      prepay_to: 0,
      discount: 0,
    },

    error: false,
    errors: [],

    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },
    planName: ''
  }),
  mounted() {
    this.$refs["create"].openModal()
  },
  methods: {
    closeModal() {
      this.$refs["create"].closeModal()
    },
    discountTrash() {
      this.$emit("RemoveDiscount");
      this.$bvModal.hide("modal-create-discount");
      this.clearDiscount();
    },

    clearDiscount() {
      this.discount.prepay_from = 0;
      this.discount.prepay_to = 0;
      this.discount.discount = 0;
    },

    async SaveDiscount() {
      try {
        const {data, status} = await api.objects.createDiscount(this.object.id, this.discount)

        if (status === 201) {
          this.$emit("SaveDiscount", data);
          this.$bvModal.hide("modal-create-discount");
          this.clearDiscount();
        }
      } catch (error) {
        this.toastedWithErrorCode(error);

        if (error.response.status === 422) {
          this.error = true;
          this.errors = error.response.data;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.create {
  &-title {
    font-family: CraftworkSans, serif;
    font-weight: 900;
    font-size: 24px;
    line-height: 28px;
    color: var(--gray-400);
    margin-bottom: 2rem;
  }


  &-tab {
    display: flex;
    flex-direction: column;
    max-width: 41rem;
    font-family: Inter, sans-serif;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    row-gap: 1rem;
    margin-bottom: 3rem;

    .base-input {
      width: 100% !important;
      //padding: .5rem;
    }

    &__nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      column-gap: 8px;
    }

    .base__button {
      width: 100%;
    }


    &__name {
      margin-bottom: .5rem;
      color: var(--gray-600);
    }
  }

}

.footer-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 2rem;

  .base__button {
    width: 100%;
  }
}

</style>
