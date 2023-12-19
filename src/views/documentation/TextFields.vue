<script>
import DocHeader from '@/views/documentation/DocHeader'
import BaseInput from '@/components/Reusable/BaseInput'
import BaseMultiselect from '@/components/Reusable/BaseMultiselect'
import BaseSearchCalendar from '@/components/Reusable/BaseCalendar'
import FromTillInput from '@/components/Reusable/FromTillInput'
import FileUploader from '@/components/Reusable/FileUploader'
import OutputInformation from '@/components/Elements/Outputs/OutputInformation'
import BaseStarIcon from '@/components/icons/BaseStarIcon'
import BaseEditIcon from '@/components/icons/BaseEditIcon'

export default {
  name: 'Sidebar',
  components: {
    BaseEditIcon,
    BaseStarIcon,
    'output-information': OutputInformation,
    FileUploader,
    FromTillInput,
    BaseSearchCalendar,
    BaseMultiselect,
    BaseInput,
    DocHeader,
  },
  data() {
    return {
      options: ['item1', 'item2', 'item3'],
    }
  },
}
</script>

<template>
  <main class="text-fields">
    <DocHeader title="text fields" />
    <div class="text-fields-content">
      <div class="text-fields-content-row">
        <BaseInput placeholder="Инпут" />
        <BaseMultiselect
          placeholder="Инпут"
          :options="options"
        />
        <BaseSearchCalendar search-input="Инпут" />
        <FromTillInput />
      </div>
      <div class="text-fields-content-row">
        <FileUploader />
      </div>
      <div class="output-info">
        <output-information
          :property="`${$t('date')}`"
          value="132 456 464"
        >
          <template #left-icon>
            <span class="text-fields-content-icon">
              <BaseStarIcon
                fill="#7C3AED"
                width="16"
                height="16"
              />
            </span>
          </template>
          <template #right-icon>
            <span class="text-fields-content-icon">
              <BaseEditIcon
                width="18"
                height="18"
                fill="white"
              />
            </span>
          </template>
        </output-information>
        <output-information
          property="Label"
          value="Text"
        />
        <output-information
          property="Label"
          value=""
        >
          <template #left-icon>
            <span class="text-fields-content-icon">
              <BaseStarIcon
                fill="#7C3AED"
                width="16"
                height="16"
              />
            </span>
          </template>
        </output-information>
        <output-information
          property="Label"
          value=""
        >
          <template #right-icon>
            <span class="text-fields-content-icon">
              <BaseEditIcon
                width="18"
                height="18"
                fill="white"
              />
            </span>
          </template>
        </output-information>
        <output-information
          property="Label"
          value=""
        >
          <template #right-icon>
            <span class="text-fields-content-icon">
              <BaseEditIcon
                width="18"
                height="18"
                fill="white"
              />
            </span>
          </template>
          <template #left-icon>
            <span class="text-fields-content-icon">
              <BaseStarIcon
                fill="#7C3AED"
                width="16"
                height="16"
              />
            </span>
          </template>
        </output-information>
        <output-information
          property="Label"
          value=""
        />
        <output-information
          property="Label"
          value="Text"
        >
          <template #right-icon>
            <span class="text-fields-content-icon">
              <BaseEditIcon
                width="18"
                height="18"
                fill="white"
              />
            </span>
          </template>
        </output-information>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.text-fields {
  &-content {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    gap: 5rem;

    &-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
    }

    .base-input {
      width: 320px;
    }

    ::v-deep.multiselect {
      width: 320px;
    }

    ::v-deep .search__content-input {
      width: 320px;
    }

    &-icon {
      background: #ede9fe;
      border-radius: 50%;
      padding: 0 5px 3px;
    }

    &-icon:nth-child(2) {
      background: #7c3aed;
      padding: 2px 5px 5px;
    }

    .output-info {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
  }

  .upload__content {
    width: 40%;
  }

  margin-bottom: 4rem;
}

.search__content {
  margin: 0;
  width: auto;
}

.output-information {
  width: 480px;
}
</style>
