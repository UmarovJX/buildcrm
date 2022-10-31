<template>
    <div>
        <div class="comments">
            <div class="comments-header">
                <h4 v-if="expressView" class="comments-header__title express-title">
                    Последние примечание
                </h4>
                <h4 v-else-if="hasComment" class="comments-header__title">
                    {{ $t('contracts.note') }} ( {{ pagination.totalItems }} {{ $t('contracts.notes') }} )
                </h4>
                <h4 v-else class="comments-header__title">
                    {{ $t('contracts.note') }} ({{ $t('contracts.no_notes') }})
                </h4>
                <template v-if="expressView">
                    <base-button @click="viewAllComments"
                                 :text="`${ $t('filter_names.all') }`">
                        <template #right-icon>
                            <BaseArrowRightIcon/>
                        </template>
                    </base-button>
                </template>
                <template v-else>
                    <base-button v-if="permissions && permissions.create" @click="openCreateModal"
                                 :text="`${ $t('contracts.add_note') }`">
                        <template #left-icon>
                            <BasePlusIcon fill="var(--violet-600)"/>
                        </template>
                    </base-button>
                </template>

            </div>

            <div v-if="hasComment && !commentLoading" class="comments-body">
                <div v-for="comment in comments" class="comment" :key="comment.id">
                    <div class="comment-content">
                        <div class="comment-text">
                            <p>{{ comment.comment }}</p>
                        </div>
                        <div class="comment-action">

                            <app-dropdown
                                :collapse-arrow="true"
                                :position-right="true"
                                v-if="permissions && (permissions.delete || permissions.edit)">
                                <template #header>
                                    <BaseDotsIcon/>
                                </template>
                                <template #list>
                                    <b-dropdown-item v-if="permissions && permissions.edit" href="#"
                                                     @click="openEditModal(comment)">
                                        <BaseEditIcon fill="var(--violet-600)" :width="20" :height="20"/>
                                        {{ $t('edit') }}
                                    </b-dropdown-item>
                                    <b-dropdown-item v-if="permissions && permissions.delete" href="#"
                                                     @click="warnBeforeDelete(comment.id)">
                                        <BaseDeleteIcon fill="var(--violet-600)" :width="20" :height="20"/>
                                        {{ $t('delete') }}
                                    </b-dropdown-item>
                                </template>
                            </app-dropdown>
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
                <div v-if="expressView && permissions && permissions.create" class="d-flex justify-content-end">
                    <base-button @click="openCreateModal"
                                 :text="`${ $t('contracts.add_note') }`">
                        <template #left-icon>
                            <BasePlusIcon fill="var(--violet-600)"/>
                        </template>
                    </base-button>
                </div>


                <div v-if="!expressView && countOfPaymentItems" class="pagination__vue">
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
                        <k-form-select
                            :label="false"
                            :options="showByOptions"
                            v-model="showByValue"
                            @change="changeCommentsShowingLimit"
                        >
                            <template #output-prefix>
                                <span class="show-by-description">{{ $t('contracts.show_by') }}:</span>
                            </template>
                        </k-form-select>
                    </div>
                </div>
            </div>

            <div v-else class="comments-body">
                <p class="comment-empty">
                    {{ $t('contracts.no_note') }}.
                </p>
                <div v-if="expressView  && permissions && permissions.create" class="d-flex justify-content-end">
                    <base-button @click="openCreateModal"
                                 :text="`${ $t('contracts.add_note') }`">
                        <template #left-icon>
                            <BasePlusIcon fill="var(--violet-600)"/>
                        </template>
                    </base-button>
                </div>
            </div>

            <div v-if="commentLoading">
                <b-overlay :show="commentLoading" no-wrap opacity="0.5" style="z-index: 2222">
                    <template #overlay>
                        <div class="d-flex justify-content-center w-100">
                            <div class="lds-ellipsis">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </template>
                </b-overlay>
            </div>

        </div>

        <!--    CREATE COMMENT MODAL-->
        <base-modal ref="create" id="create-comment" design="auto-height">
            <template #header>

        <span class="d-flex align-items-center justify-content-between">

          <!--    TITLE      -->
          <span class="title">
            {{ $t(modalProperties.title) }}
          </span>


            <!--   CLOSE    -->
          <span class="go__back" @click="closeCreateModal">
            <BaseCloseIcon :width="56" :height="56"/>
          </span>
        </span>
            </template>

            <template #main>
                <div class="create">
                    <h5 class="comment-create__title">
                        {{ $t('contracts.note_text') }}
                    </h5>
                    <ValidationProvider
                        :name="$t('objects.create.tariff.type_name')"
                        ref="comment-area"
                        rules="required|min:2"
                        v-slot="{ errors }"
                        class="w-100"
                        tag="div"
                    >
                        <b-form-textarea
                            v-model="comment"
                            class="comment-textarea"
                            :placeholder="`${ $t('contracts.comment') }`"
                        />
                        <span class="error__provider" v-if="errors[0]">
              {{ errors[0] }}
            </span>
                    </ValidationProvider>

                </div>


            </template>

            <template #footer>
                <div>
                    <base-button
                        :disabled="loading"
                        @click="saveComment"
                        :fixed="true"
                        design="violet-gradient"
                        :text="$t(`${modalProperties.btnText}`)"/>
                </div>
            </template>
        </base-modal>

        <!--  WARNING BEFORE DELETE COMMENT  -->
        <base-modal ref="warning-before-delete">
            <template #header>
          <span class="warning__before__delete-head">
            <span>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.4"
                      d="M51.3346 27.9996C51.3346 40.8889 40.8883 51.3329 28.0013 51.3329C15.1143 51.3329 4.66797 40.8889 4.66797 27.9996C4.66797 15.1149 15.1143 4.66626 28.0013 4.66626C40.8883 4.66626 51.3346 15.1149 51.3346 27.9996"
                      fill="#EF4444"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M30.3081 29.5574C30.3081 30.7612 29.2661 31.7427 27.988 31.7427C26.71 31.7427 25.668 30.7612 25.668 29.5574V18.5185C25.668 17.3148 26.71 16.3333 27.988 16.3333C29.2661 16.3333 30.3081 17.3148 30.3081 18.5185V29.5574ZM25.6811 37.4814C25.6811 36.2776 26.7178 35.2961 27.9879 35.2961C29.2951 35.2961 30.3345 36.2776 30.3345 37.4814C30.3345 38.6852 29.2951 39.6667 28.0144 39.6667C26.7284 39.6667 25.6811 38.6852 25.6811 37.4814Z"
                      fill="#EF4444"/>
              </svg>
            </span>
            <span class="title">
              {{ $t('contracts.delete_note') }}
                <!--              {{ $t('remove_payment') }}-->
            </span>
          </span>
            </template>

            <template #main>
          <span class="warning__before__delete-main">
            {{ $t('contracts.note_delete_confirmation') }}
              <!--            {{ $t('contracts.warn_before_delete_payment') }}-->
          </span>
            </template>

            <template #footer>
                <div class="warning__before__delete-footer">
                    <base-button
                        @click="cancelDelete"
                        :fixed="true"
                        :text="`${ $t('no_cancel') }`"
                    />
                    <base-button
                        @click="deleteComment"
                        :fixed="true"
                        :text="`${ $t('yes_delete') }`"
                        design="violet-gradient"
                    >
                    </base-button>
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
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import api from "@/services/api";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import {KFormSelect} from "@/components/ui-components/form-select";
import {sortInFirstRelationship, sortObjectValues} from "@/util/reusable";
import AppDropdown from "@/components/Reusable/Dropdown/AppDropdown";

export default {
    name: "ApartmentComments",
    components: {
        KFormSelect,
        AppDropdown,
        BaseDeleteIcon,
        BaseButton,
        BasePlusIcon,
        BaseDotsIcon,
        BaseEditIcon,
        BaseArrowRightIcon,
        BaseArrowLeftIcon,
        BaseCloseIcon,
        BaseModal,
    },
    props: {
        expressView: {
            type: Boolean,
            default: false
        },
        apartmentUuid: {
            type: String,
            required: '',
        },
        commentsData: {
            type: Object,
            required: true,
        },
        commentLoading: {
            type: Boolean,
            default: false
        },
        permissions: {
            type: Object,
            required: true,
        }
    },

    data() {
        const showByOptions = []

        for (let number = 10; number <= 50; number += 10) {
            showByOptions.push({
                value: number,
                text: number
            })
        }

        let {limit: showByValue} = this.$route.query

        if (!showByValue) {
            showByValue = 20
        }

        const objectId = this.$route.params.object
        return {
            showByValue,
            showByOptions,
            objectId,
            pagination: {},
            params: {
                limit: 20,
                page: 1
            },
            comment: '',
            commentId: null,
            comments: [],
            modalProperties: {
                type: '',
                title: '',
            },
            loading: false,

        }
    },
    watch: {
        commentsData: {
            deep: true,
            immediate: true,
            handler() {
                this.setComments()
            }
        },
    },
    computed: {
        countOfPaymentItems() {
            const {pagination, comments} = this
            return comments.length && pagination['totalItems'] > 9
        },
        hasComment() {
            return this.comments && this.comments.length > 0
        },
        query() {
            return Object.assign({}, this.$route.query)
        },
    },
    created() {
        this.setComments()
    },
    methods: {
        changeRoute() {
            const sortingQuery = Object.assign({}, this.query)
            this.$router.push({
                query: {
                    ...this.query,
                    ...sortInFirstRelationship(sortingQuery)
                }
            })
        },
        setComments() {
            if (this.expressView && this.commentsData && this.commentsData.items) {
                this.comments = this.commentsData.items.slice(0, 2)
            } else {
                this.comments = this.commentsData.items
            }
            this.pagination = this.commentsData.pagination

            if (this.pagination && (this.pagination.current > this.pagination.total)) {
                this.swipeCommentsPage(this.pagination.total)
            }
        },
        viewAllComments() {
            this.$router.push({
                    name: 'apartment-view-comment',
                    params: {
                        object: this.$route.params.object,
                        id: this.apartmentUuid
                    }
                }
            )
        },
        swipeCommentsPage(page) {
            const currentPage = this.query.page
            if (page === currentPage) return
            this.replaceRouter({...this.query, page})
            this.$emit('update-comments', this.query)
        },
        replaceRouter(query) {
            const sortQuery = sortObjectValues(query)
            this.$router.replace({query: sortQuery})
        },
        changeCommentsShowingLimit() {
            if (this.query.limit !== this.showByValue.toString()) {
                const query = {
                    ...this.query, page: 1
                }
                const limit = this.showByValue
                this.replaceRouter({...query, limit})
                this.$emit('update-comments', this.query)
            }
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
                return this.$t('edited') + ' ' + hours + ':' + minutes + ', ' + day + ' ' + month
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
                title: 'contracts.add_note',
                btnText: 'add',
            }
            this.$refs["create"].openModal()
        },
        openEditModal(item) {
            this.modalProperties = {
                type: 'edit',
                title: 'contracts.edit_note',
                btnText: 'edit',
            }
            this.comment = item.comment
            this.commentId = item.id
            this.$refs["create"].openModal()
        },
        warnBeforeDelete(id) {
            this.commentId = id
            this.$refs['warning-before-delete'].openModal()
        },
        cancelDelete() {
            this.commentId = null
            this.$refs['warning-before-delete'].closeModal()
        },
        deleteComment() {
            api.apartmentsV2.deleteApartmentComment(this.objectId, this.apartmentUuid, this.commentId)
                .then(() => {
                    this.toasted(`${this.$t('sweetAlert.deleted')}`, "success");
                })
                .catch((err) => {
                    this.toasted(err.message, "error");
                })
                .finally(() => {
                    this.$refs['warning-before-delete'].closeModal()
                    // this.getComments()
                    this.$emit('update-comments', this.params)
                })
        },
        async saveComment() {
            await this.$refs['comment-area'].validate().then(async (res) => {
                this.errors = res.errors
                if (res.valid) {
                    const data = {
                        comment: this.comment
                    }
                    this.loading = true
                    if (this.modalProperties.type === 'create') {
                        await api.apartmentsV2.createApartmentComment(this.objectId, this.apartmentUuid, data)
                            .then(() => {
                                this.toasted(`${this.$t('sweetAlert.success_create_comment')}`, "success");
                                this.closeCreateModal()
                            })
                            .catch((err) => {
                                this.toasted(err.message, "error");
                            })
                    } else {
                        await api.apartmentsV2.editApartmentComment(this.objectId, this.apartmentUuid, this.commentId, data)
                            .then(() => {
                                this.toasted(`${this.$t('sweetAlert.successfully_edited')}`, "success");
                                this.closeCreateModal()
                            })
                            .catch((err) => {
                                this.toasted(err.message, "error");
                            })
                    }
                    this.loading = false
                    await this.$emit('update-comments', this.params)
                    // await this.getComments()
                }
            })

        },
    }

}
</script>

<style lang="scss" scoped>

@import "../../../../assets/scss/utils/pagination";

.comments {
    padding-top: 2rem;
    padding-bottom: 2rem;

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

            &.express-title {
                color: var(--gray-400);
            }
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

    &-empty {
        font-family: Inter, sans-serif;
        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
        color: var(--gray-400);
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

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
            border-radius: 50%;

            img {
                border-radius: 50%;
                height: 100%;
                object-fit: contain;
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

.warning__before__delete {
    &-head {
        display: flex;
        align-items: center;

        .title {
            font-size: 2.25rem;
            line-height: 42px;
            margin-left: 1rem;
        }
    }

    &-main {
        display: block;
        max-width: 60%;
        font-family: Inter, sans-serif;
        color: var(--gray-600);
        margin-left: 0.5rem;
    }

    &-footer {
        gap: 2rem;
        display: flex;
        align-items: center;
    }
}


</style>