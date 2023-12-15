<script>
import AppHeader from "@/components/Header/AppHeader.vue";
import BaseArrowRight from "@/components/icons/BaseArrowRightIcon.vue";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon.vue";
import {computed, getCurrentInstance} from "vue";

export default {
  components: {
    AppHeader,
    BaseArrowRight,
    BaseArrowLeft,
  },
  setup() {
    const vm = getCurrentInstance().proxy

    const isUpdatePage = computed(() => {
      return vm.$route.name === 'role-v2-edit'
    })

    function goBack() {
      vm.$router.push({
        name: "roles"
      })
    }

    return {
      isUpdatePage,
      goBack
    }
  }
}
</script>

<template>
  <app-header>
    <template #header-breadcrumb>
      <div class="d-flex navigation__content">
        <div class="go__back" @click="goBack">
          <BaseArrowLeft :width="32" :height="32"></BaseArrowLeft>
        </div>
        <div class="breadcrumb__content">
          <div>
            {{ $t("roles.title") }}
            <BaseArrowRight :width="18" :height="18"/>
            <span>{{ isUpdatePage ? $t('edit') : $t('create') }}</span>
          </div>
          <span class="head">
                {{ isUpdatePage ? $t("common.update_role") : $t("common.create_role") }}
            </span>
        </div>
      </div>
    </template>
  </app-header>
</template>

<style lang="scss" scoped>
.go__back {
  width: 56px;
  height: 56px;
  border-radius: 100%;
  background-color: var(--gray-100);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}


.navigation__content {
  display: flex;
  align-items: center;
  //margin-bottom: 52px;

  .breadcrumb__content {
    display: inline-flex;
    flex-direction: column;
    margin-left: 1rem;
    font-weight: 600;
    font-size: 14px;
    color: #9ca3af;
  }

  .head {
    font-size: 24px;
    line-height: 28px;
    color: #4b5563;

    .contract__number {
      color: var(--violet-600);
    }
  }
}
</style>

