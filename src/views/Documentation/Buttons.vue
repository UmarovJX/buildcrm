<template>
  <div class="button">
    <header>
      <p>Xon Saroy Design System • Component</p>
      <h1>button</h1>
    </header>
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
            <template #left-icon>
              <BaseLoading :width="24" :height="24"/>
            </template>
          </BaseButton>
        </div>
        <div class="button-content-part2-row">
          <BaseMultiselect track-by="value" label="text" :options="options"/>
          <BaseMultiselect track-by="value" label="text" :options="options"/>
          <BaseMultiselect track-by="value" label="text" :options="options"/>
          <BaseButton text="">
            <template #left-icon>
              <BaseLoading :width="24" :height="24"/>
            </template>
          </BaseButton>
        </div>
        <div class="button-content-part2-row">
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
  </div>
</template>
<script>

import BaseButton from "@/components/Reusable/BaseButton";
import BaseFilterIcon from "@/components/icons/BaseFilterIcon";
import BaseLoading from "@/components/Reusable/BaseLoading";
import BaseMultiselect from "@/components/Reusable/BaseMultiselect";
export default {
  name: "Buttons",
  components: {BaseMultiselect, BaseLoading, BaseFilterIcon, BaseButton},
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
  header {
    display: flex;
    background: #F3F4F6;
    padding: 64px;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 60px;
    p {
      letter-spacing: 1px;
      text-transform: uppercase;
      font-family: 'CraftworkSans', serif;
      font-weight: 900;
      color: #9CA3AF;
      font-size: 16px;
      line-height: 19px;
      margin: 0;
    }
    h1 {
      text-transform: uppercase;
      font-family: 'CraftworkSans', serif;
      margin: 0;
      font-weight: 900;
      font-size: 64px;
      line-height: 77px;
      color: #4B5563;
    }
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
      margin-bottom: 5rem;
      &-row {
        display: flex;
        gap: 64px;
        ::v-deep .base__multiselect:nth-child(2) {
          .multiselect__tags {
            background-color: #E5E7EB;
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
    }
    &-part2 {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      gap: 30px;
      ::v-deep .base__multiselect {
        .multiselect__tags {
          background: linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%);
        }
        .multiselect__placeholder {
          color: white;
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
          .text{
            color: white;
          }
        }
        ::v-deep.base__button:nth-child(2) {
          background-color: #6D28D9;
          .text{
            color: white;
          }
        }
      }
    }
    }
}
</style>