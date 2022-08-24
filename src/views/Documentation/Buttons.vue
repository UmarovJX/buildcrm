<template>
  <div class="button">
    <DocHeader title="button"/>
    <div class="button-content">
      <div class="button-content-part1">
        <div class="button-content-part1-row">
          <BaseButton text="Текст кнопки">
            <template #left-icon>
              <BaseFilterIcon fill="#7C3AED"/>
            </template>
          </BaseButton>
          <BaseButton text="Текст кнопки">
            <template #left-icon>
              <BaseFilterIcon fill="#7C3AED"/>
            </template>
          </BaseButton>
          <BaseButton text="Текст кнопки">
            <template #left-icon>
              <BaseFilterIcon />
            </template>
          </BaseButton>
          <BaseButton text="">
            <template #left-icon>
              <BaseLoading :width="24" :height="24"/>
            </template>
          </BaseButton>
        </div>
        <div class="button-content-part1-row">
          <BaseMultiselect track-by="value" label="text" :options="options"/>
          <BaseMultiselect track-by="value" label="text" :options="options"/>
          <BaseMultiselect track-by="value" label="text" :options="options"/>
          <BaseButton text="">
            <template #left-icon>
              <BaseLoading :width="24" :height="24"/>
            </template>
          </BaseButton>
        </div>
        <div class="button-content-part1-row">
          <BaseButton text="Текст кнопки"/>
          <BaseButton text="Текст кнопки"/>
          <BaseButton text="Текст кнопки"/>
          <BaseButton text="">
            <template #left-icon>
              <BaseLoading :width="24" :height="24"/>
            </template>
          </BaseButton>
        </div>
      </div>
      <div class="button-content-part2">
        <div class="button-content-part2-row">
          <BaseButton text="Текст кнопки">
            <template #left-icon>
              <BaseFilterIcon fill="#7C3AED"/>
            </template>
          </BaseButton>
          <BaseButton text="Текст кнопки">
            <template #left-icon>
              <BaseFilterIcon fill="#7C3AED"/>
            </template>
          </BaseButton>
          <BaseButton text="Текст кнопки">
            <template #left-icon>
              <BaseFilterIcon />
            </template>
          </BaseButton>
          <BaseButton text="">
            <template #right-icon>
              <BaseLoading :width="24" :height="24"/>
            </template>
          </BaseButton>
        </div>
        <div class="button-content-part2-row">
          <BaseMultiselect track-by="value" label="text" :options="options"/>
          <BaseMultiselect track-by="value" label="text" :options="options"/>
          <BaseMultiselect track-by="value" label="text" :options="options"/>
          <BaseButton text="">
            <template #right-icon>
              <BaseLoading :width="24" :height="24"/>
            </template>
          </BaseButton>
        </div>
        <div class="button-content-part2-row">
          <BaseButton text="Текст кнопки"/>
          <BaseButton text="Текст кнопки"/>
          <BaseButton text="Текст кнопки"/>
          <BaseButton text="">
            <template #right-icon>
              <BaseLoading :width="24" :height="24"/>
            </template>
          </BaseButton>
        </div>
      </div>
      <div class="button-content-navigation">
        <div class="navigation">
          <BaseLeftIcon/>
        </div>
        <div class="navigation">
          <BaseLeftIcon disabled="true"/>
        </div>
      </div>
      <div class="button-content-pure-button">
        <BaseButton text="Текст кнопки"/>
        <BaseButton text="Текст кнопки"/>
        <BaseButton text="Текст кнопки"/>
        <BaseButton text="">
          <template #left-icon>
            <BaseLoading :width="24" :height="24"/>
          </template>
        </BaseButton>
      </div>
    </div>
  </div>
</template>
<script>

import BaseButton from "@/components/Reusable/BaseButton";
import BaseFilterIcon from "@/components/icons/BaseFilterIcon";
import BaseLoading from "@/components/Reusable/BaseLoading";
import BaseMultiselect from "@/components/Reusable/BaseMultiselect";
import BaseLeftIcon from "@/components/icons/BaseLeftIcon";
import DocHeader from "@/views/Documentation/DocHeader";
export default {
  name: "Buttons",
  components: {DocHeader, BaseLeftIcon, BaseMultiselect, BaseLoading, BaseFilterIcon, BaseButton},
  data() {
    return {
      options: [
          {
            value: 1,
            text: "item1"
          },
        {
            value: 2,
            text: "item2"
          },
      ],
      options2: ["asf", "asfd"]
    }
  }
}
</script>

<style scoped lang="scss">
.button{
  ::v-deep .text {
    font-family: "Inter", serif;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: #4B5563;
  }
  &-content {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    padding: 0 64px 64px;
    &-item {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      gap: 32px;
      .search__content {
        min-width: 380px;
      }
    }
    &-navigation {
      display: flex;
      margin-bottom: 7rem;
      gap: 64px;
      .navigation {
        padding: 12px;
        background: #F3F4F6;
        border-radius: 50%;
        svg {
          width: 32px;
          height: 32px;
        }
        &:last-child {
          background-color: #E5E7EB;
        }
      }
    }
    &-pure-button {
      display: flex;
      width: 100%;
      justify-content: space-between;
      .base__button:nth-child(2n+1) {
        background-color: transparent;
      }
      .base__button:nth-child(2) {
        background: #E5E7EB;
      }
      ::v-deep.base__button:nth-child(3) {
        .text {
          color: #9CA3AF;
        }
      }
      ::v-deep.base__button:last-child {
        padding: 16px 65px;
        .left__icon {
            margin-right: 0;
        }
      }
    }
  }
  .search-content-item:nth-child(2){
    ::v-deep .search__content-input {
      background-color: #E5E7EB;
    }
  }
  .search-content-item:nth-child(3){
    ::v-deep .search__content-input {
      border: 4px solid #E5E7EB;
    }
  }
  &-content {
    padding: 0 64px 64px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    &-part1 {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      gap: 30px;
      margin-bottom: 7rem;
      &-row {
        display: flex;
        gap: 64px;
        ::v-deep.base__button {
          padding: 17px 24px;
        }
        ::v-deep .base__multiselect:nth-child(2) {
          .multiselect__tags {
            background-color: #E5E7EB;
            padding: 17px 24px;
          }
        }
        ::v-deep .base__multiselect:nth-child(3) {
          .multiselect__placeholder {
            color: #9CA3AF;
          }
        }
        .base__button:nth-child(2) {
          background-color: #E5E7EB;
        }
        ::v-deep .base__button:nth-child(3) {
          .text {
            color: #9CA3AF;
          }
        }
        .base__button:last-child {
          padding: 16px 71px;
          ::v-deep .left__icon {
            margin-right: 0;
          }
        }
      }
      &-row:last-child {
        ::v-deep.base__button:nth-child(4) {
          padding: 16px 70px 16px 60px!important;
          .left__icon {
            width: 10px;
          }
        }
      }
    }
    &-part2 {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      gap: 30px;
      margin-bottom: 7rem;

      ::v-deep .base__multiselect {
        .multiselect__select {
          filter: brightness(0) invert(1);
        }
        .multiselect__tags {
          background: linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%);
          padding: 17px 24px;
        }
        .multiselect__placeholder {
          color: white;
        }
      }
      ::v-deep .base__multiselect:nth-child(2) {
        .multiselect__tags {
          background: #6D28D9;
        }
      }
      ::v-deep .base__multiselect:nth-child(3) {
        .multiselect__select {
          filter: brightness(1) invert(0);
        }
        .multiselect__tags {
          background: #F3F4F6;
        }
        .multiselect__placeholder {
          color: #9CA3AF;
        }
      }
      &-row {
        display: flex;
        gap: 64px;
        ::v-deep .multiselect__input {
          background-color: #6D28D9;
        }
        ::v-deep.base__button {
          background: linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%);
          padding: 17px 24px;
          .left__icon {
            svg {
              path {
                fill: white;
              }
            }
          }
          .text{
            color: white;
          }
        }
        ::v-deep.base__button:nth-child(2) {
          background: #6D28D9;
        }
        ::v-deep.base__button:nth-child(3) {
          background: #F3F4F6;
          .text {
            color: #9CA3AF;
          }
          .left__icon {
            svg {
              path {
                fill: #9CA3AF;
              }
            }
          }
        }
        ::v-deep.base__button:nth-child(4) {
          .right__icon {
            svg {
              path:first-child {
                fill: #6D28D9;
              }
              path:last-child {
                fill: #FFFFFF;
              }
            }
          }
        }
      }
      &-row:last-child {
        ::v-deep.base__button:last-child {
          padding: 16px 61px 16px 51px;
        }
      }
      .base__button:last-child {
        padding: 16px 85px 16px 65px;
        ::v-deep .right__icon {
          margin-right: 0;
        }
      }
    }
    }
  }

</style>