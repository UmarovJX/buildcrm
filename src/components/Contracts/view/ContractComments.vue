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
                  <span class="mr-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                          d="M10 18C10.2652 18 10.5196 17.8946 10.7071 17.7071C10.8946 17.5196 11 17.2652 11 17V11C11 10.7348 10.8946 10.4804 10.7071 10.2929C10.5196 10.1054 10.2652 10 10 10C9.73478 10 9.48043 10.1054 9.29289 10.2929C9.10536 10.4804 9 10.7348 9 11V17C9 17.2652 9.10536 17.5196 9.29289 17.7071C9.48043 17.8946 9.73478 18 10 18ZM20 6H16V5C16 4.20435 15.6839 3.44129 15.1213 2.87868C14.5587 2.31607 13.7956 2 13 2H11C10.2044 2 9.44129 2.31607 8.87868 2.87868C8.31607 3.44129 8 4.20435 8 5V6H4C3.73478 6 3.48043 6.10536 3.29289 6.29289C3.10536 6.48043 3 6.73478 3 7C3 7.26522 3.10536 7.51957 3.29289 7.70711C3.48043 7.89464 3.73478 8 4 8H5V19C5 19.7956 5.31607 20.5587 5.87868 21.1213C6.44129 21.6839 7.20435 22 8 22H16C16.7956 22 17.5587 21.6839 18.1213 21.1213C18.6839 20.5587 19 19.7956 19 19V8H20C20.2652 8 20.5196 7.89464 20.7071 7.70711C20.8946 7.51957 21 7.26522 21 7C21 6.73478 20.8946 6.48043 20.7071 6.29289C20.5196 6.10536 20.2652 6 20 6ZM10 5C10 4.73478 10.1054 4.48043 10.2929 4.29289C10.4804 4.10536 10.7348 4 11 4H13C13.2652 4 13.5196 4.10536 13.7071 4.29289C13.8946 4.48043 14 4.73478 14 5V6H10V5ZM17 19C17 19.2652 16.8946 19.5196 16.7071 19.7071C16.5196 19.8946 16.2652 20 16 20H8C7.73478 20 7.48043 19.8946 7.29289 19.7071C7.10536 19.5196 7 19.2652 7 19V8H17V19ZM14 18C14.2652 18 14.5196 17.8946 14.7071 17.7071C14.8946 17.5196 15 17.2652 15 17V11C15 10.7348 14.8946 10.4804 14.7071 10.2929C14.5196 10.1054 14.2652 10 14 10C13.7348 10 13.4804 10.1054 13.2929 10.2929C13.1054 10.4804 13 10.7348 13 11V17C13 17.2652 13.1054 17.5196 13.2929 17.7071C13.4804 17.8946 13.7348 18 14 18Z"
                          fill="black"/>
                    </svg>
                  </span>
                  {{ $t('contracts.view.cancel_contract') }}
                </b-dropdown-item>
                <b-dropdown-item href="#" @click="deleteComment(comment.id)">
                  <span class="mr-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                          d="M10 18C10.2652 18 10.5196 17.8946 10.7071 17.7071C10.8946 17.5196 11 17.2652 11 17V11C11 10.7348 10.8946 10.4804 10.7071 10.2929C10.5196 10.1054 10.2652 10 10 10C9.73478 10 9.48043 10.1054 9.29289 10.2929C9.10536 10.4804 9 10.7348 9 11V17C9 17.2652 9.10536 17.5196 9.29289 17.7071C9.48043 17.8946 9.73478 18 10 18ZM20 6H16V5C16 4.20435 15.6839 3.44129 15.1213 2.87868C14.5587 2.31607 13.7956 2 13 2H11C10.2044 2 9.44129 2.31607 8.87868 2.87868C8.31607 3.44129 8 4.20435 8 5V6H4C3.73478 6 3.48043 6.10536 3.29289 6.29289C3.10536 6.48043 3 6.73478 3 7C3 7.26522 3.10536 7.51957 3.29289 7.70711C3.48043 7.89464 3.73478 8 4 8H5V19C5 19.7956 5.31607 20.5587 5.87868 21.1213C6.44129 21.6839 7.20435 22 8 22H16C16.7956 22 17.5587 21.6839 18.1213 21.1213C18.6839 20.5587 19 19.7956 19 19V8H20C20.2652 8 20.5196 7.89464 20.7071 7.70711C20.8946 7.51957 21 7.26522 21 7C21 6.73478 20.8946 6.48043 20.7071 6.29289C20.5196 6.10536 20.2652 6 20 6ZM10 5C10 4.73478 10.1054 4.48043 10.2929 4.29289C10.4804 4.10536 10.7348 4 11 4H13C13.2652 4 13.5196 4.10536 13.7071 4.29289C13.8946 4.48043 14 4.73478 14 5V6H10V5ZM17 19C17 19.2652 16.8946 19.5196 16.7071 19.7071C16.5196 19.8946 16.2652 20 16 20H8C7.73478 20 7.48043 19.8946 7.29289 19.7071C7.10536 19.5196 7 19.2652 7 19V8H17V19ZM14 18C14.2652 18 14.5196 17.8946 14.7071 17.7071C14.8946 17.5196 15 17.2652 15 17V11C15 10.7348 14.8946 10.4804 14.7071 10.2929C14.5196 10.1054 14.2652 10 14 10C13.7348 10 13.4804 10.1054 13.2929 10.2929C13.1054 10.4804 13 10.7348 13 11V17C13 17.2652 13.1054 17.5196 13.2929 17.7071C13.4804 17.8946 13.7348 18 14 18Z"
                          fill="black"/>
                    </svg>
                  </span>
                  {{ $t('contracts.view.cancel_contract') }}
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
            <!--            <base-input type="text" class="w-100" v-model="comment"-->
            <!--                        :placeholder="$t('objects.create.tariff.type_name')" required-->
            <!--                        :label="true"/>-->
            <span class="error__provider" v-if="errors[0]">
              {{ errors[0] }}
            </span>
          </ValidationProvider>

        </div>


      </template>

      <template #footer>
        <div>
          <base-button @click="saveComment" class="w-100 violet-gradient" :text="$t('add')"/>
        </div>
      </template>


    </base-modal>


  </div>


</template>

<script>
import BaseButton from "@/components/Reusable/BaseButton";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BaseDotsIcon from "@/components/icons/BaseDotsIcon";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseClose from "@/components/icons/BaseClose";
// import BaseInput from "@/components/Reusable/BaseInput";
import api from "@/services/api";

export default {
  name: "ContractComments",
  components: {
    BaseButton,
    BasePlusIcon,
    BaseDotsIcon,
    BaseModal,
    BaseClose,
    // BaseInput
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
  async created() {
    await this.getComments()
  },
  methods: {
    async getComments() {
      await api.contractV2.getCommentList(this.contractId, this.params).then((res) => {
        this.comments = res.data.items
        this.pagination = res.data.pagination
      }).catch((err) => {
        return err
      })
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
      let date = new Date(value.created_at);
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
    },
    openCreateModal() {
      this.modalProperties = {
        type: 'create',
        title: 'Добавить примечание'
      }
      this.$refs["create"].openModal()
    },
    openEditModal(item) {
      this.modalProperties = {
        type: 'edit',
        title: 'Редактировать примечание'
      }
      this.comment = item.comment
      this.commentId = item.id
      this.$refs["create"].openModal()
    },
    deleteComment(id) {
      api.contractV2.deleteComment(this.contractId, id)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            return err
          })
    },
    async saveComment() {
      await this.$refs['comment-area'].validate().then((res) => {
        this.errors = res.errors
        if (res.valid) {
          const data = {
            comment: this.comment
          }
          if (this.modalProperties.type === 'create') {
            api.contractV2.addComment(this.contractId, data)
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  return err
                })
          } else {
            api.contractV2.editComment(this.contractId, this.commentId, data)
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  return err
                })
          }
          this.getComments()
          this.closeCreateModal()
          this.comment = ''
          this.commentId = ''
        }
      })

    },

  }
}
</script>

<style lang="scss" scoped>

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