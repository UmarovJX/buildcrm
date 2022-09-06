<template>
  <main>
    <base-button class="mb-4" @click="openReleaseModal" text="add release note"/>
    <base-button @click="openReleaseNote" text="about release note"/>

    <base-modal ref="release-note-modal" design="release-note">
      <template #header>
      <span class="release-note-header">
        <p>{{ $t("release_note.add_release_note") }}</p>
        <p @click="closeReleaseModal" class="cursor-pointer">
          <BaseCloseIcon/>
        </p>
      </span>
      </template>
      <template #main>
      <span class="release-note-main">
        <span class="release-note-main-block">
          <p>{{ $t("main") }}</p>
          <base-select
              :label="true"
              :value="form.release"
              :no-placeholder="false"
              @change="setFormProperty('release', $event)"
              :placeholder="$t('release_note.version_number')"
              :options="releaseNotes"
          />
        </span>
        <span class="release-note-main-block">
          <p>{{ $t("release_note.texts") }}</p>
          <span class="release-note-main-block-block">
            <p>{{ $t("release_note.new") }}</p>
            <base-input
                v-model="form.new_text"
                :placeholder="`${ $t('text') }`"/>
          </span>
          <span class="release-note-main-block-block">
            <p>{{ $t("edited") }}</p>
            <base-input
                v-model="form.edited_text"
                :placeholder="`${ $t('text') }`"/>
          </span>
        </span>
      </span>
      </template>
      <template #footer>
      <span class="release-note-footer">
        <base-button @click="closeReleaseModal" :text="`${ $t('cancel') }`"/>
        <base-button @click="recheckRelease" :text="`${ $t('recheck') }`"/>
        <base-button @click="addRelease" :text="`${ $t('add') }`"/>
      </span>
      </template>
    </base-modal>

    <base-modal ref="release-note" design="release-info">
      <template #header>
        <span class="release-note-header">
          <p>{{ $t("release_note.release_note") }}</p>
          <p @click="closeReleaseNote" class="cursor-pointer">
            <BaseCloseIcon/>
          </p>
        </span>
      </template>
      <template #main>
        <span class="release-info-main">
          <span class="release-info-main-block">
            <p class="release-info-main-block-release">{{form.release}}</p>
            <p class="release-info-main-block-date">22 June, 2022</p>
          </span>
          <span class="release-info-main-block">
            <span class="release-info-main-block-tag release-info-main-block-tag-new">{{ $t('release_note.new') }}</span>
            <p class="release-new">{{ form.new_text }}</p>
          </span>
          <span class="release-info-main-block">
            <span class="release-info-main-block-tag release-info-main-block-tag-edited">{{ $t('edited') }}</span>
            <p class="release-edited">{{ form.edited_text }}</p>
          </span>
        </span>
      </template>
      <template #footer>
        <span class="release-info-footer">
          <BaseQuestionsIcon :height="20" :width="20"/>
          <p>{{ $t('release_note.comment') }}</p>
        </span>
      </template>
    </base-modal>
  </main>
</template>

<script>
import BaseButton from "@/components/Reusable/BaseButton";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import BaseSelect from "@/components/Reusable/BaseSelect";
import BaseInput from "@/components/Reusable/BaseInput";
import BaseQuestionsIcon from "@/components/icons/BaseQuestionsIcon";

export default {
  name: "ReleaseNote",
  components: {BaseQuestionsIcon, BaseInput, BaseCloseIcon, BaseSelect, BaseButton, BaseModal},
  data() {
    const releaseNotes = [
      {
        text: "Xonsaroy CRM 2.4",
        value: "Xonsaroy CRM 2.4",
      },
      {
        text: "Xonsaroy CRM 1.4",
        value: "Xonsaroy CRM 1.4",
      },
      {
        text: "Xonsaroy CRM 0.4",
        value: "Xonsaroy CRM 0.4",
      },
    ]

    return {
      releaseNotes,
      form: {
        release: null,
        new_text: null,
        edited_text: null
      },
    }
  },
  methods: {
    openReleaseModal() {
      this.$refs["release-note-modal"].openModal()
    },
    closeReleaseModal() {
      this.$refs["release-note-modal"].closeModal()
    },
    openReleaseNote() {
      this.$refs["release-note"].openModal()
    },
    closeReleaseNote() {
      this.$refs["release-note"].closeModal()
    },
    recheckRelease() {
      this.$refs["release-note"].openModal()
    },
    addRelease() {
      this.$emit('add-release-note', this.form)
      this.$refs["release-note-modal"].closeModal()
    },
    setFormProperty(property, value) {
      this.form[property] = value
    },
  }
}
</script>

<style scoped lang="scss">
p {
  margin-bottom: 0 !important;
}

.release-note {
  font-family: 'CraftworkSans', serif;

  &-header {
    display: flex;
    align-items: center;
    gap: 65px;
    justify-content: space-between;

    p {
      font-weight: 900;
      font-size: 36px;
      line-height: 42px;
      color: #4B5563;
    }
  }

  &-main {
    p {
      font-size: 24px;
      line-height: 28px;
      color: #9CA3AF;
    }

    display: flex;
    flex-direction: column;
    gap: 56px;

    &-block {
      display: flex;
      flex-direction: column;
      gap: 32px;

      .select-container {
        width: 50%;
      }

      &-block {
        display: flex;
        flex-direction: column;
        gap: 16px;
        font-family: 'Inter', serif;

        p {
          font-weight: 600;
          font-size: 16px;
          line-height: 22px;
          color: #4B5563;
          text-transform: capitalize;
        }

        .base-input {
          width: 100%;
          background: white;
          height: 52px;
          border: 2px solid #E5E7EB;

          ::v-deep input {
            background-color: white !important;
          }
        }
      }
    }
  }

  &-footer {
    display: flex;
    gap: 16px;

    .base__button {
      width: 170px;
      font-family: 'Inter', serif;
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      color: #4B5563;
    }

    .base__button:last-child {
      color: white;
      background: linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%);;
    }
  }
}
.release-info {
  &-main {
    display: flex;
    flex-direction: column;
    gap: 56px;
    &-block {
      display: flex;
      flex-direction: column;
      gap: 24px;
      &-date {
        font-family: 'Inter', serif;
        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
        color: #9CA3AF;
      }
      &-release {
        font-family: 'CraftworkSans', serif;
        font-weight: 900;
        font-size: 24px;
        line-height: 28px;
        color: #4B5563;
      }
      &-tag {
        text-transform: capitalize;
        width: max-content;
        padding: 13px 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100px;
        font-family: 'CraftworkSans', serif;
        font-weight: 900;
        font-size: 18px;
        line-height: 22px;
        &-new {
          color: #16A34A;
          background: #DCFCE7;
        }
        &-edited {
          color: #0284C7;
          background: #E0F2FE;
        }
      }
    }
  }
  &-footer {
    display: flex;
    gap: 18px;
    p {
      font-family: 'Inter', serif;
      font-weight: 600;
      font-size: 18px;
      line-height: 24px;
      color: #9CA3AF;
    }
  }
}
</style>