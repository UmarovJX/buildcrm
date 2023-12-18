<script>
import {computed, getCurrentInstance, onMounted, ref} from "vue";
import {XIcon} from "@/components/ui-components/material-icons";
import el from "vue2-datepicker/locale/es/el";

export default {
  name: 'GroupTree',
  components: {
    XIcon
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          name: '',
          children: []
        }
      }
    }
  },
  emits: ['show'],
  setup(props, {emit}) {
    const vm = getCurrentInstance().proxy
    const visible = ref(false)
    const iconName = computed(() => {
      return visible.value ? 'expand_more' : 'chevron_right'
    })
    const hasChildren = computed(() => {
      return props.item.children.length
    })
    const isActiveItem = computed(() => {
      return vm.$route.query.tree.toString() === props.item.id.toString()
    })

    function isChildActive(arr, target) {
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.id.toString() === target) {
          return true
        } else if (element.children.length) {
          const result = isChildActive(element.children, target);
          if (result) return result;
        }
      }
      return false;
    }

    function toggleTree() {
      if (hasChildren.value) {
        visible.value = !visible.value
      }

      emit('show', props.item)

      vm.$router.push({
        query: {
          tree: props.item.id
        }
      })
    }

    onMounted(() => {
      const hasActiveChild = isChildActive(props.item.children,vm.$route.query.tree)
      if(hasActiveChild){
        visible.value = true
      }
    })

    return {
      visible,
      iconName,
      hasChildren,
      isActiveItem,
      toggleTree,
    }
  }
}
</script>


<template>
  <div class="">
    <div
        class="group__tree d-flex align-center cursor-pointer"
        :class="{active:isActiveItem}"
        @click="toggleTree"
    >
      <x-icon
          v-if="hasChildren"
          class="gray-400 chevron__icon"
          size="28"
          :name="iconName"
      >
      </x-icon>
      <div class="ml-1 mt-1 d-flex align-center">
        <x-icon size="20" v-if="hasChildren" name="folder" class="gray-600"></x-icon>
        <div class="ml-1">
          {{ item.name[$i18n.locale] }}
        </div>
      </div>
    </div>
    <b-collapse
        style="margin-left: 0.75rem"
        v-if="hasChildren"
        v-model="visible"
        :class="{'collapse__border__left':visible}"
    >
      <group-tree
          v-for="childItem in item.children"
          :key="childItem.id"
          :item="childItem"
          class="ml-1 p-1"
          @show="$emit('show',$event)"
      />
    </b-collapse>
  </div>
</template>


<style lang="scss" scoped>
.group__tree {
  &.active {
    background-color: var(--gray-400);
    border-radius: 0.5rem;

    .chevron__icon {
      color: var(--gray-600);
    }
  }
}

.collapse__border__left {
  border-left: 2px solid var(--gray-300);
}
</style>
