<template>

  <div>

    <div class="comments">
      <div class="comments-header">
        <h4 class="comments-header__title">Примечания</h4>
        <base-button @click="openCreateModal" text="Добавить примечание">
          <template #left-icon>
            <BasePlusIcon fill="var(--violet-600)"/>
          </template>
        </base-button>
      </div>

      <div class="comments-body">
        <div v-for="comment in comments" class="comment" :key="comment.id">
          <div class="comment-content">
            <div class="comment-text">
              <p>{{ comment.comment }}</p>
            </div>
            <div class="comment-action">

              <b-dropdown right>
                <template #button-content>
                  <BaseDotsIcon/>
                </template>
                <b-dropdown-item href="#" @click="openEditModal(comment)">
                  <span class="d-flex mr-2">
                   <BaseEditIcon fill="var(--violet-600)" :width="20" :height="20"/>
                  </span>
                  Редактировать
                  <!--                  {{ $t('contracts.view.cancel_contract') }}-->
                </b-dropdown-item>
                <b-dropdown-item href="#" @click="deleteComment(comment.id)">
                  <span class="d-flex mr-2">
                    <BaseDeleteIcon fill="var(--violet-600)" :width="20" :height="20"/>
                  </span>
                  Удалить
                  <!--                  {{ $t('contracts.view.cancel_contract')   }}-->
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
          <div class="comment-footer">
            <div class="comment-info">
              <div class="avatar">
                <img v-if="comment.user.avatar" :src="comment.user.avatar" alt="">
                <img v-else :src="require('@/assets/img/no_avatar.png')" alt="">
              </div>
              <h5 class="name">
                {{ fullName(comment.user) }}
                <span class="name-dot">
                ·
              </span>
                <span class="name-rank">
                {{ checkLocales(comment.user.role.name) }}
              </span>
              </h5>
            </div>
            <div class="comment-date">
              <p class="date">{{ dateFormat(comment) }}</p>
            </div>
          </div>
        </div>

        <div v-if="countOfPaymentItems" class="pagination__vue">
          <!--   Pagination   -->
          <vue-paginate
              :page-count="pagination.total"
              :value="pagination.current"
              :container-class="'container'"
              :page-class="'page-item'"
              :page-link-class="'page-link'"
              :next-class="'page-item'"
              :prev-class="'page-item'"
              :prev-link-class="'page-link'"
              :next-link-class="'page-link'"
              @change-page="swipeCommentsPage"
          >
            <template #next-content>
              <span class="d-flex align-items-center justify-content-center">
                <base-arrow-right-icon/>
              </span>
            </template>

            <template #prev-content>
              <span class="d-flex align-items-center justify-content-center">
                <base-arrow-left-icon/>
              </span>
            </template>
          </vue-paginate>

          <!--  Show By Select    -->
          <div class="show__by">
        <span class="show__by__content">
          <span class="description">{{ $t('contracts.show_by') }}:</span>
          <b-form-select
              @input="changeCommentsShowingLimit"
              v-model="params.limit"
              :options="showByOptions"
          ></b-form-select>
          <span class="arrow__down">
            <base-down-icon/>
          </span>
        </span>
          </div>
        </div>

      </div>

    </div>

    <base-modal ref="create" id="create-comment" design="auto-height">
      <template #header>

        <span class="d-flex align-items-center justify-content-between">

          <!--    TITLE      -->
          <span class="title">
            {{ modalProperties.title }}
          </span>


          <!--   CLOSE    -->
          <span class="go__back" @click="closeCreateModal">
            <BaseClose :width="56" :height="56"/>
          </span>
        </span>
      </template>

      <template #main>
        <div class="create">
          <h5 class="comment-create__title">
            Текст примечание
          </h5>
          <ValidationProvider
              :name="$t('objects.create.tariff.type_name')"
              ref="comment-area"
              rules="required|min:2"
              v-slot="{ errors }"
              class="w-100"
              tag="div"
          >
            <b-form-textarea v-model="comment" class="comment-textarea" placeholder="Текст"></b-form-textarea>
            <span class="error__provider" v-if="errors[0]">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

        </div>


      </template>

      <template #footer>
        <div>
          <base-button @click="saveComment" class="w-100 violet-gradient" :text="$t(`${modalProperties.btnText}`)"/>
        </div>
      </template>
    </base-modal>

  </div>

</template>

<script>
import BaseButton from "@/components/Reusable/BaseButton";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BaseDotsIcon from "@/components/icons/BaseDotsIcon";
import BaseEditIcon from "@/components/icons/BaseEditIcon";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseClose from "@/components/icons/BaseClose";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseDownIcon from "@/components/icons/BaseDownIcon";
import api from "@/services/api";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";

export default {
  name: "ContractComments",
  components: {
    BaseDeleteIcon,
    BaseButton,
    BasePlusIcon,
    BaseDotsIcon,
    BaseEditIcon,
    BaseArrowRightIcon,
    BaseArrowLeftIcon,
    BaseDownIcon,
    BaseModal,
    BaseClose,
  },

  data() {
    const showByOptions = []

    for (let number = 10; number <= 50; number += 10) {
      showByOptions.push({
        value: number,
        text: number
      })
    }

    return {
      showByOptions,
      pagination: {},
      params: {
        limit: 20,
        page: 1
      },
      comment: '',
      commentId: '',
      comments: [],
      modalProperties: {
        type: '',
        title: '',
      },
      contractId: this.$route.params.id
    }
  },
  computed: {
    countOfPaymentItems() {
      const {pagination, comments} = this
      return comments.length && pagination['totalItems'] > 9
    },
  },
  async created() {
    await this.getComments()
  },
  methods: {
    async getComments() {
      await api.contractV2.getCommentList(this.contractId, this.params).then((res) => {
        this.comments = res.data.items
        this.pagination = res.data.pagination
      }).catch((err) => {
        this.toasted(err.message, "error");
      })
    },
    swipeCommentsPage(page) {
      this.params.page = page
      this.getComments()
    },
    changeCommentsShowingLimit() {
      this.params.page = 1
      this.getComments()
    },
    fullName(value) {
      if (value.first_name && value.last_name)
        return value.first_name + ' ' + value.last_name
      return value
    },
    dateFormat(value) {
      const monthNames = ["january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december"
      ];
      let date = ''
      if (!value.edited) {
        date = new Date(value.created_at);
      } else {
        date = new Date(value.updated_at);
      }
      const day = date.getDate()
      const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
      const month = this.$t(monthNames[date.getMonth()]).toLocaleLowerCase()

      if (value.edited)
        return 'изменено ' + hours + ':' + minutes + ', ' + day + ' ' + month
      return hours + ':' + minutes + ', ' + day + ' ' + month

    },
    checkLocales(name) {
      if (localStorage.locale)
        return name[localStorage.locale]
      else
        return name['ru']
    },
    closeCreateModal() {
      this.$refs["create"].closeModal()
      this.comment = ''
      this.commentId = ''
    },
    openCreateModal() {
      this.modalProperties = {
        type: 'create',
        title: 'Добавить примечание',
        btnText: 'add',
      }
      this.$refs["create"].openModal()
    },
    openEditModal(item) {
      this.modalProperties = {
        type: 'edit',
        title: 'Редактировать примечание',
        btnText: 'edit',
      }
      this.comment = item.comment
      this.commentId = item.id
      this.$refs["create"].openModal()
    },
    deleteComment(id) {
      api.contractV2.deleteComment(this.contractId, id)
          .then(() => {
            this.toasted('deleted', "success");
          })
          .catch((err) => {
            this.toasted(err.message, "error");
          })
          .finally(() => {
            this.getComments()
          })
    },
    async saveComment() {
      await this.$refs['comment-area'].validate().then(async (res) => {
        this.errors = res.errors
        if (res.valid) {
          const data = {
            comment: this.comment
          }
          if (this.modalProperties.type === 'create') {
            await api.contractV2.addComment(this.contractId, data)
                .then(() => {
                  this.toasted('created', "success");
                })
                .catch((err) => {
                  this.toasted(err.message, "error");
                })
          } else {
            await api.contractV2.editComment(this.contractId, this.commentId, data)
                .then(() => {
                  this.toasted('edited', "success");
                })
                .catch((err) => {
                  this.toasted(err.message, "error");
                })
          }
          this.closeCreateModal()
          await this.getComments()
        }
      })

    },

  }
}
</script>

<style lang="scss" scoped>

@import "../../../assets/scss/utils/pagination";

.comments {
  margin-top: 2rem;
  border-top: 6px solid var(--gray-100);
  padding-top: 2rem;

  p {
    margin-bottom: 0;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    &__title {
      font-family: CraftworkSans, serif;
      font-weight: 900;
      font-size: 24px;
      line-height: 28px;
      color: var(--gray-600);
      margin-bottom: 0;
    }
  }

  &-body {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
  }
}

.comment {
  border: 2px solid var(--gray-200);
  border-radius: 2rem;
  padding: 1.5rem;


  &-content {
    display: flex;
    justify-content: space-between;
    column-gap: 1rem;
    margin-bottom: 1rem;
  }

  &-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

  }

  &-text {
    p {
      font-family: Inter, sans-serif;
      font-weight: 600;
      font-size: 18px;
      line-height: 24px;
      color: var(--gray-600);
    }
  }

  &-textarea {
    border: 2px solid var(--gray-200);
    border-radius: 2rem;
    padding: 16px 20px;
    min-height: 52px;

    &::placeholder {
      color: var(--gray-600);
    }
  }

  &-create__title {
    font-family: Inter, sans-serif;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 1rem;
    color: var(--gray-600)
  }

  &-action {
    display: flex;
    height: 100%;

    ::v-deep {
      .b-dropdown .btn:not(.dropdown-item), .btn-secondary:not(.dropdown-item) {
        height: auto;
        width: auto;
        border: none !important;
        outline: none;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background-color: transparent !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .dropdown-item {
        height: 56px;
        display: flex;
        align-items: center;
      }

      .dropdown-toggle::after {
        display: none;
      }

      .btn svg {
        margin: 0;
      }

    }
  }

  &-info {
    display: flex;
    align-items: center;
    column-gap: .5rem;
    font-family: Inter, sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;

    .avatar {
      width: 24px;
      height: 24px;

      img {
        width: 100%;
      }
    }

    .name {
      font-family: Inter, sans-serif;
      font-weight: 600;
      font-size: 14px !important;
      line-height: 20px !important;
      margin-bottom: 0;
      color: var(--violet-600);

      &-dot {
        color: var(--gray-400);
      }

      &-rank {
        color: var(--gray-600)
      }
    }
  }

  &-date {
    .date {
      font-family: Inter, sans-serif;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      color: var(--gray-400);
    }
  }
}

</style>