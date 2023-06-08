<script>
import BaseButton from "@/components/Reusable/BaseButton";
import BaseModal from "@/components/Reusable/BaseModal";

export default {
  name: "WarningSuccess",
  components: {
    BaseModal,
    BaseButton,
  },
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  methods: {
    openModal() {
      this.$refs["base-modal"].openModal();
    },
    closeModal() {
      this.$refs["base-modal"].closeModal();
    },
  },
};
</script>

<template>
  <base-modal ref="base-modal" class="wcModal">
    <template #header>
      <div class="wcModal-header">
        <img
          v-if="status === 'success'"
          src="../../assets/icons/icon-tick-circle.svg"
          alt=""
        />
        <img v-else src="../../assets/icons/icon-warning-circle.svg" alt="" />
      </div>
      <span></span>
    </template>
    <template #main>
      <div class="wcModal-main" v-if="status === 'success'">
        <h5>Сделано!</h5>
        <p>Великолепный текст про то,что ты действительно все сделал!</p>
      </div>
      <div class="wcModal-main" v-else>
        <h5>Ошибка!</h5>
        <p>Великолепный текст про то,что ты действительно ошибся!</p>
      </div>
    </template>

    <template #footer>
      <div class="wcModal-footer">
        <b-row class="w-100">
          <b-col cols="6">
            <base-button
              v-if="status !== 'success'"
              :text="$t('cancel')"
              @click="closeModal"
            />
          </b-col>
          <b-col cols="6">
            <base-button design="violet" text="OK" @click="closeModal" />
          </b-col>
        </b-row>
      </div>
    </template>
  </base-modal>
</template>

<style lang="scss">
.wcModal {
  display: flex;
  justify-content: center;

  &-header {
    display: flex;
    justify-content: center;
    border: none;
  }

  &-main {
    display: flex;
    flex-direction: column;
    align-items: center;

    h5 {
      text-align: center;
      font-weight: 900;
      font-size: 36px;
      line-height: 42px;
      color: var(--gray-600);
      margin-bottom: 12px;
    }

    p {
      text-align: center;
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      color: var(--gray-600);
      width: 80%;
      margin-bottom: 0;
    }
  }

  &-footer {
    display: flex;
    //justify-content: space-between;
    //gap: 32px;

    .base__button {
      width: 100%;
    }
  }
}
</style>
