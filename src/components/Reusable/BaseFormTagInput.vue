<script>
export default {
  name: "BaseFormTagInput",
  inheritAttrs: false,
  emits: ["set-tags"],
  props: {
    placeholder: {
      type: String,
      default: () => "Enter a Tag",
    },
    type: {
      type: String,
      default: () => "text",
    },
    defaultTags: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      tagInput: "",
      tags: [],
    };
  },
  mounted() {
    if (this.defaultTags.length) {
      this.tags = this.defaultTags;
    }
  },
  methods: {
    addTag(event) {
      event.preventDefault();
      const val = event.target.value.trim();
      if (val.length > 0) {
        const hasInPackage = this.tags.findIndex((tag) => tag === val);
        if (hasInPackage === -1) {
          const splitTags = this.tagInput.split(" ");
          splitTags.forEach((tag) => {
            this.tags.push(tag);
          });
          event.target.value = "";
          this.tagInput = "";
          this.$emit("set-tags", this.tags);
        }
      }
    },
    addTagByButton() {
      if (this.tagInput.length > 0) {
        const hasInPackage = this.tags.findIndex(
          (tag) => tag === this.tagInput
        );
        if (hasInPackage === -1) {
          this.tags.push(this.tagInput);
          this.tagInput = "";
          this.$emit("set-tags", this.tags);
        }
      }
    },
    removeTag(index) {
      this.tags.splice(index, 1);
      this.$emit("set-tags", this.tags);
    },
    removeLastTag(event) {
      if (event.target.value.length === 0) {
        this.removeTag(this.tags.length - 1);
        this.$emit("set-tags", this.tags);
      }
    },
    clear() {
      this.tagInput = "";
      this.tags = [];
    },
  },
};
</script>
<template>
  <div class="tag-input">
    <div v-for="(tag, index) in tags" :key="tag" class="tag-input__tag">
      <span class="tag">{{ tag }}</span>
      <span @click="removeTag(index)" class="remove__icon">
        <slot name="delete-content" />
      </span>
    </div>
    <input
      :type="type"
      :placeholder="placeholder"
      v-bind="$attrs"
      v-model="tagInput"
      class="tag-input__text"
      @keydown.enter="addTag"
      @keydown.188="addTag"
      @keydown.delete="removeLastTag"
      :class="{ 'tag-input-active': this.tagInput.length > 0 }"
    />
    <span
      class="addition__button"
      @click="addTagByButton"
      v-if="this.tagInput.length"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.6409 9.41667H9.49904V14.514C9.49904 15.3347 8.8279 16 8 16C7.1721 16 6.50096 15.3347 6.50096 14.514V9.41667H1.35909C0.586845 9.3374 0 8.69228 0 7.92264C0 7.153 0.586845 6.50789 1.35909 6.42861H6.48484V1.34731C6.56481 0.581757 7.21557 0 7.99194 0C8.76832 0 9.41907 0.581757 9.49904 1.34731V6.42861H14.6409C15.4132 6.50789 16 7.153 16 7.92264C16 8.69228 15.4132 9.3374 14.6409 9.41667Z"
          fill="#9CA3AF"
        />
      </svg>
    </span>
  </div>
</template>
<style lang="scss" scoped>
.tag-input {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  font-family: CraftworkSans, serif;
  color: var(--gray-600);
}

.tag-input__tag {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 2rem;
  padding: 0.5rem 0.75rem;
  margin-right: 0.5rem;
  //margin-top: 0.5rem;
  //margin-bottom: 0.5rem;
}

.tag-input__tag .tag {
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  margin-right: 0.5rem;
  min-width: max-content;
}

.tag-input__tag > span {
  cursor: pointer;
}

.tag-input__text {
  width: 100%;
  min-width: 10rem;
  border: none;
  outline: none;
  background-color: transparent;
  //padding-left: 1rem;
}

.addition__button {
  //width: 4rem;
  //height: 2rem;
  //border-radius: 0.5rem;
  //background-color: var(--gray-300);
  //border: 2px solid var(--gray-500);
  background-color: #ffffff;
  border-radius: 2rem;
  //padding: 0.5rem 2rem;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 150ms ease-in-out;
  margin-left: 0.5rem;
  margin-right: 0.5rem;

  &:hover {
    transform: scale(1.1);
  }
}

.tag-input-active {
  min-width: 2rem !important;
  width: auto;
}
</style>
