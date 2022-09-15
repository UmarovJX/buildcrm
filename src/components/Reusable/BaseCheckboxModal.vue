<template>
  <div :class="chosen ? 'basket' : 'd-none'">
    <div class="basket-block">
      <base-checkbox disabled checked/>
      <p>
        {{ $t("chosen") }}: {{ chosen }}
      </p>
    </div>
    <base-button
        @click="makeContract"
        design="violet400"
        :text="`${$t('create_agree_apartments')}`"
    />
  </div>
</template>

<script>
import BaseButton from "@/components/Reusable/BaseButton";
import BaseCheckbox from "@/components/Reusable/BaseCheckbox";

export default {
  name: "BaseCheckboxModal",
  components: {
    BaseCheckbox,
    BaseButton
  },
  props: {
    chosen: {
      type: Number,
      default: 0
    }
  },
  emits: ['go-to-contract'],
  methods: {
    makeContract() {
      this.$emit('go-to-contract')
    }
  }
}
</script>

<style lang="scss" scoped>
.basket {
  position: sticky;
  left: 0;
  right: 0;
  bottom: 0;
  width: calc(100% - 92px);
  margin: 0 auto -2rem;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 2rem 2rem 0 0;
  padding: 12px 32px;
  z-index: 999;
  animation: fade-top .5s linear;
  background-color: var(--violet-600);

  &-block {
    display: flex;
    gap: 16px;
    justify-content: center;
    align-items: center;

    ::v-deep .base-checkbox > input {
      background-color: white !important;

      &::before {
        background: #7C3AED;
        height: 8px;
      }
    }
  }

  .violet400 {
    background-color: var(--violet-400);
    color: var(--white);
  }

  p {
    margin: 0;
    padding: 0;
    color: var(--white);
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .base__button {
    padding: 13px 24px;
    font-family: 'Inter', serif;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
  }

  @keyframes fade-top {
    0% {
      opacity: 0;
      transform: rotateX(90deg);
      bottom: -10px;
    }
    100% {
      opacity: 1;
      transform: rotateX(0);
      bottom: 0;
    }
  }
}


</style>