<script>
import {XIcon} from "@/components/ui-components/material-icons";
import {XButton} from "@/components/ui-components/button";
import {hasOwnProperty} from "@/util/object";
import {computed, getCurrentInstance, ref} from "vue";
import {XFormInput} from "@/components/ui-components/form-input";
import GroupParentSelect from "@/views/settings/views/permission-group/components/GroupParentSelect.vue";
import {useToastError} from "@/composables/useToastError";
import {v3ServiceApi} from "@/services/v3/v3.service";
import {useLoading} from "@/composables/useLoading";

export default {
  name: 'RoleForm',
  methods: {hasOwnProperty},
  components: {
    GroupParentSelect, XFormInput,
    XIcon,
    XButton,
  },
  setup() {
    const {toastError} = useToastError()
    const vm = getCurrentInstance().proxy
    const {
      isFetching,
      startFetching,
      finishFetching
    } = useLoading()
    const formObserverRef = ref(null)
    /** {
     *   id:number,
     *   name:object,
     *   slug:string,
     *   permissions:array
     *   children:array,
     * }
     * */
    const groups = ref([])
    const tabIndex = ref(0)
    const isMounting = ref(false)
    const skeletonLength = 15
    const form = ref({
      uz: null,
      ru: null,
      en: null
    })
    const checkedIds = ref([])

    const isUpdatePage = computed(() => {
      return vm.$route.name === 'role-v2-edit'
    })

    function isSelectedItem(id) {
      return checkedIds.value.findIndex(chId => chId === id) !== -1
    }

    function joinChildPermission(list) {
      const newList = []
      for (let i = 0; i < list.length; i++) {
        const element = list[i]
        if (element.children.length) {
          newList.push({
            id: element.id,
            slug: element.slug,
            name: element.name,
            permissions: [
              ...element.permissions,
              ...joinChildPermission(element.children).map(e => e.permissions)
            ]
          })
        } else {
          newList.push({
            id: element.id,
            slug: element.slug,
            name: element.name,
            permissions: element.permissions.map((p) => ({
              ...p,
              selected: isUpdatePage.value
                  ? isSelectedItem(p.id)
                  : false
            }))
          })
        }
      }

      return newList
    }

    function makeBody() {
      return {
        permissions: checkedIds.value,
        name: form.value,
      }
    }

    async function create() {
      return await v3ServiceApi.role.create(
          makeBody()
      )
    }

    async function update() {
      return await v3ServiceApi.role.update({
        id: vm.$route.params.id,
        ...makeBody()
      })
    }

    async function send() {
      const valid = await formObserverRef.value.validate()
      if (valid) {
        try {
          startFetching()
          if (isUpdatePage.value) {
            await update()
          } else {
            await create()
          }
          await vm.$store.dispatch('notify/openNotify', {
            type: "success",
            message: "successfully",
            duration: 4000,
          })
          await vm.$router.push({
            name: 'roles'
          })
        } catch (e) {
          toastError(e)
        } finally {
          finishFetching()
        }
      } else {
        tabIndex.value = 0
      }
    }

    function cancel() {
      vm.$router.push({
        name: "roles"
      })
    }

    async function fetchGroups() {
      try {
        startFetching()
        isMounting.value = true

        if (isUpdatePage.value) {
          await fetchEditItem()
        }

        const {data: {result}} = await v3ServiceApi.permission.group.index({
          page: 1,
          limit: 200
        })

        groups.value = joinChildPermission(result)
      } catch (e) {
        toastError(e)
      } finally {
        finishFetching()
        isMounting.value = false
      }
    }

    function hasId(id) {
      return checkedIds.value.find(chId => chId === id)
    }

    function addId(id) {
      checkedIds.value.push(id)
    }

    function removeId(id) {
      checkedIds.value = checkedIds.value.filter(chId => chId !== id)
    }

    function toggleCheckbox(id, state) {
      if (state) {
        if (!hasId(id)) {
          addId(id)
        }
      } else {
        if (hasId(id)) {
          removeId(id)
        }
      }
    }

    async function fetchEditItem() {
      const {data: {result}} = await v3ServiceApi.role.show({
        id: vm.$route.params.id
      })

      form.value.uz = result.name.uz
      form.value.ru = result.name.ru
      form.value.en = result.name.en
      checkedIds.value = result.permissions.map(p => p.id)
    }

    fetchGroups()

    return {
      form,
      groups,
      tabIndex,
      formObserverRef,
      isFetching,
      isMounting,
      skeletonLength,
      send,
      cancel,
      toggleCheckbox
    }
  }
}
</script>

<template>
  <b-card no-body>
    <b-tabs v-model="tabIndex" pills card content-class="role__tab__content">
      <b-tab>
        <template #title>
          {{ $t('general') }}
        </template>

        <validation-observer
            ref="formObserverRef"
            class="role__observer"
        >
          <!--   ? NAME UZ     -->
          <validation-provider
              ref="clientTypeNameVProvider"
              name="name-uz-provider"
              rules="required|min:3"
              v-slot="{ errors }"
              class="name-provider"
          >
            <x-form-input
                type="text"
                :placeholder="`${$t('name')} (${$t('placeholder_uz')})`"
                class="w-75 "
                v-model="form.uz"
            />
            <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("name-uz-provider", $t("name")) }}
          </span>
          </validation-provider>

          <!--   ? NAME RU     -->
          <validation-provider
              ref="clientTypeNameVProvider"
              name="name-ru-provider"
              rules="required|min:3"
              v-slot="{ errors }"
              class="name-provider"
          >
            <x-form-input
                type="text"
                :placeholder="`${$t('name')} (${$t('placeholder_ru')})`"
                class="w-75"
                v-model="form.ru"
            />
            <span class="error__provider " v-if="errors[0]">
            {{ errors[0].replace("name-ru-provider", $t("name")) }}
          </span>
          </validation-provider>

          <!--   ? NAME EN     -->
          <validation-provider
              ref="clientTypeNameVProvider"
              name="name-en-provider"
              rules="required|min:3"
              v-slot="{ errors }"
              class="name-provider"
          >
            <x-form-input
                type="text"
                :placeholder="`${$t('name')} (${$t('placeholder_eng')})`"
                class="w-75"
                v-model="form.en"
            />
            <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("name-en-provider", $t("name")) }}
          </span>
          </validation-provider>
        </validation-observer>
      </b-tab>


      <template v-if="isMounting">
        <b-tab
            v-for="skeletonItem in skeletonLength"
            :key="skeletonItem"
        >
          <template #title>
            <div style="width: 100px;margin-top:-0.45rem">
              <b-skeleton type="input"/>
            </div>
          </template>
        </b-tab>
      </template>


      <b-tab v-for="groupItem in groups" :key="groupItem.id">
        <template #title>
          {{ groupItem.name[$i18n.locale] }}
        </template>

        <b-card-text>
          <b-list-group class="role__list">
            <!--            <b-list-group-item-->
            <!--                class="role__list__item d-flex justify-content-between"-->
            <!--            >-->
            <!--              <div>{{ $t('roles_permission.activate_all') }}</div>-->
            <!--              <div>-->
            <!--                <b-form-checkbox size="lg"/>-->
            <!--              </div>-->
            <!--            </b-list-group-item>-->

            <template v-for="(permission) in groupItem.permissions">
              <b-list-group-item
                  v-if="permission.name"
                  class="role__list__item d-flex justify-content-between"
              >
                <div>{{ permission.name[$i18n.locale] }}</div>
                <div>
                  <b-form-checkbox
                      :checked="permission.selected"
                      size="lg"
                      @change="toggleCheckbox(permission.id,$event)"
                  />
                </div>
              </b-list-group-item>
            </template>
          </b-list-group>
        </b-card-text>
      </b-tab>
    </b-tabs>

    <template #footer>
      <div class="d-flex justify-content-end x-gap-1">
        <x-button
            variant="secondary"
            text="cancel"
            :bilingual="true"
            class="bg-gray-300"
            style="border-radius: 0.25rem;padding: 0.75rem 1rem"
            @click="cancel"
        >
          <template #left-icon>
            <x-icon name="tab_close_right" class="red-600"/>
          </template>
        </x-button>

        <x-button
            variant="primary"
            text="save"
            :bilingual="true"
            class="bg-gray-300"
            :loading="isFetching"
            style="border-radius: 0.25rem;padding: 0.75rem 1rem"
            @click="send"
        >
          <template #left-icon>
            <x-icon name="save" class="text-white"/>
          </template>
        </x-button>
      </div>
    </template>
  </b-card>
</template>

<style lang="scss" scoped>
.role__tab__content {
  .card-body {
    padding: 0;
  }
}

.role__list {
  &__item {
    border-radius: 0;
  }
}

.role__observer {
  margin: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
