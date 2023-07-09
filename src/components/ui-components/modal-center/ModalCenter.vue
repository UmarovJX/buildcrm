<script>
import { makeProp } from "@/util/props";
import {
  PROP_TYPE_ARRAY_OBJECT_STRING,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_STRING,
} from "@/constants/props";
import { XIcon } from "@/components/ui-components/material-icons";
import { XButton } from "@/components/ui-components/button";
import { XCircularBackground } from "@/components/ui-components/circular-background";

export default {
  name: "XModalCenter",
  components: {
    XIcon,
    XButton,
    XCircularBackground,
  },
  props: {
    headerTitle: makeProp(PROP_TYPE_STRING, "header_default_title_prop"),
    body: makeProp(PROP_TYPE_STRING, "body_default_content_prop"),
    applyButtonText: makeProp(PROP_TYPE_STRING, "apply_button_text"),
    applyButtonTheme: makeProp(PROP_TYPE_STRING, "primary"),
    applyButtonLoading: makeProp(PROP_TYPE_BOOLEAN, false),
    cancelButtonText: makeProp(PROP_TYPE_STRING, "cancel_button_text"),
    cancelButtonTheme: makeProp(PROP_TYPE_STRING, "secondary"),
    cancelButtonLoading: makeProp(PROP_TYPE_BOOLEAN, false),
    bilingual: makeProp(PROP_TYPE_BOOLEAN, false),
    showCloseButton: makeProp(PROP_TYPE_BOOLEAN, true),
    footerClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING, ""),
    applyButtonClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING, ""),
    modalContainerClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING, ""),
    modalContainerStyle: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING, ""),
    modalBodyStyle: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING, ""),
    modalBodyClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING, ""),
    cancelButtonClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING, ""),
    showExitButton: makeProp(PROP_TYPE_BOOLEAN, true),
  },
  emits: ["apply", "cancel", "close"],
  computed: {
    hasSlot() {
      return {
        header: this.$slots.hasOwnProperty("header"),
        headerRight: this.$slots.hasOwnProperty("header-right"),
        body: this.$slots.hasOwnProperty("body"),
        footer: this.$slots.hasOwnProperty("footer"),
        buttonCancel: this.$slots.hasOwnProperty("button-cancel"),
        buttonApply: this.$slots.hasOwnProperty("button-apply"),
      };
    },
    bd() {
      if (this.bilingual) {
        return {
          headerTitle: this.$t(`${this.headerTitle}`),
          body: this.$t(`${this.body}`),
          applyButtonText: this.$t(`${this.applyButtonText}`),
          cancelButtonText: this.$t(`${this.cancelButtonText}`),
        };
      }

      return {
        headerTitle: this.headerTitle,
        body: this.body,
        applyButtonText: this.applyButtonText,
        cancelButtonText: this.cancelButtonText,
      };
    },
  },
};
</script>

<template>
  <transition name="x-modal">
    <div class="x-modal-mask">
      <div class="x-modal-wrapper">
        <div
          class="x-modal-container"
          :class="modalContainerClass"
          :style="modalContainerStyle"
        >
          <div class="x-modal-header">
            <!--?      HEADER LEFT SLOT        -->
            <slot name="header-left" />

            <!--?      HEADER SLOT        -->
            <slot name="header" />

            <template v-if="!hasSlot.header">
              <h3>{{ bd.headerTitle }}</h3>
            </template>

            <!--?      HEADER RIGHT SLOT        -->
            <slot name="header-right" />

            <x-circular-background
              v-if="showExitButton"
              class="cursor-pointer"
              bg-color="var(--gray-100)"
              @click="$emit('close')"
            >
              <x-icon name="close" size="32" class="gray-400" />
            </x-circular-background>
          </div>

          <div
            class="x-modal-body"
            :style="modalBodyStyle"
            :class="modalBodyClass"
          >
            <!--?      BODY SLOT        -->
            <slot name="body"></slot>

            <p v-if="!hasSlot.body">{{ bd.body }}</p>
          </div>

          <div class="x-modal-footer" :class="footerClass">
            <!--?      FOOTER SLOT        -->
            <slot name="footer" />

            <!--?      BUTTON CANCEL SLOT        -->
            <slot name="button-cancel" />

            <x-button
              v-if="!(hasSlot.footer && hasSlot.buttonCancel)"
              :variant="cancelButtonTheme"
              :text="bd.cancelButtonText"
              :loading="cancelButtonLoading"
              :class="cancelButtonClass"
              @click="$emit('cancel')"
            />

            <!--?      BUTTON APPLY SLOT        -->
            <slot name="button-apply" />

            <x-button
              v-if="!(hasSlot.footer && hasSlot.buttonApply)"
              :variant="applyButtonTheme"
              :text="bd.applyButtonText"
              :loading="applyButtonLoading"
              :class="applyButtonClass"
              @click="$emit('apply')"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style src="./modal-center.scss" lang="scss" scoped />
