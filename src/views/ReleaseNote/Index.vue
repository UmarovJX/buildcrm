<template>
    <div>
        <app-header>
            <template #header-title>
                Release Note
            </template>
            <template #header-actions>
                <base-button
                    v-if="true || createPermission"
                    design="violet-gradient"
                    :text="$t('add')"
                    @click="openReleaseModal"
                >
                    <template #left-icon>
                        <base-plus-icon fill="#fff"/>
                    </template>
                </base-button>
            </template>
        </app-header>


        <!--        <base-button class="mb-4" @click="openReleaseModal" text="add release note"/>-->
        <!--        <base-button @click="openReleaseNote" text="about release note"/>-->


        <div class="d-flex align-items-center justify-content-end">

        </div>


        <base-modal ref="create-modal" design="release-note">
            <template #header>
                <div class="release-note-header">
                    <p>{{ $t("release_note.add_release_note") }}</p>
                    <p @click="closeReleaseModal" class="cursor-pointer">
                        <BaseCloseIcon/>
                    </p>
                </div>
            </template>
            <template #main>
                <div class="release-note-main">
                    <div class="release-note__select">
                        <h3 class="block-title">{{ $t("main") }}</h3>
                        <ValidationProvider
                            rules="required"
                            :name="`${$t('release_note.version_number')}`"
                            v-slot="{errors}"
                        >
                            <base-input
                                v-model="form.version"
                                :label="true"
                                :placeholder="`${ $t('release_note.version_number') }`"
                            />
                            <span v-if="errors[0]" style="color: red">{{ errors[0] }}</span>
                        </ValidationProvider>
                    </div>
                    <div class="row release-note__block">
                        <div class="col-12">
                            <h3 class="block-title">{{ $t("release_note.texts") }}</h3>
                        </div>
                        <div class="col-12">
                            <b-tabs card class="custom-tab mt-0">
                                <template #tabs-start>
                                    <div class="bottom__line"></div>
                                </template>
                                <b-tab title="O’zbekchada" active>
                                    <div class="release-note__block-item">
                                        <p>{{ $t("release_note.new") }} (UZ)</p>
                                        <vue-editor v-model="form.latest['uz']"></vue-editor>
                                        <!--                            <base-input-->
                                        <!--                                v-model="form.latest['uz']"-->
                                        <!--                                :placeholder="`${ $t('text') }`"-->
                                        <!--                            />-->
                                    </div>
                                    <div class="release-note__block-item">
                                        <p>{{ $t("edited") }} (UZ)</p>
                                        <vue-editor v-model="form.fixed['uz']"></vue-editor>
                                        <!--                            <base-input
                                                                        v-model="form.fixed['uz']"
                                                                        :placeholder="`${ $t('text') }`"
                                                                    />-->
                                    </div>
                                </b-tab>
                                <b-tab title="На русском">
                                    <div class="release-note__block-item">
                                        <p>{{ $t("release_note.new") }} (RU)</p>
                                        <vue-editor v-model="form.latest['ru']"></vue-editor>
                                        <!--                            <base-input-->
                                        <!--                                v-model="form.latest['ru']"-->
                                        <!--                                :placeholder="`${ $t('text') }`"-->
                                        <!--                            />-->
                                    </div>
                                    <div class="release-note__block-item">
                                        <p>{{ $t("edited") }} (RU)</p>
                                        <vue-editor v-model="form.fixed['ru']"></vue-editor>
                                        <!--                            <base-input-->
                                        <!--                                v-model="form.fixed['ru']"-->
                                        <!--                                :placeholder="`${ $t('text') }`"-->
                                        <!--                            />-->
                                    </div>
                                </b-tab>
                            </b-tabs>
                        </div>
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="release-note-footer">
                    <base-button @click="closeReleaseModal" :text="`${ $t('cancel') }`"/>
                    <base-button @click="viewRelease(selectVersion)" :text="`${ $t('recheck') }`"/>
                    <base-button
                        type="submit"
                        @click="createReleaseNote"
                        design="violet-gradient"
                        :text="`${ $t('add') }`"
                    />
                </div>
            </template>
        </base-modal>


        <base-modal v-if="version && Object.keys(version).length" ref="view-modal" design="release-info">
            <template #header>
                <div class="release-note-header">
                    <p>{{ $t("release_note.release_note") }}</p>
                    <p @click="closeReleaseNote" class="cursor-pointer">
                        <BaseCloseIcon/>
                    </p>
                </div>
            </template>
            <template #main>
                <div class="release-info-main">
                    <div class="release-info-main-block">
                        <p class="release-info-main-block-release">{{ version.version }}</p>
                        <p class="release-info-main-block-date">{{ dateFormat(version.created_at) }}</p>
                    </div>
                    <div v-if="version && version.latest" class="release-info-main-block">
                        <div class="release-info-main-block-tag release-info-main-block-tag-new">
                            {{ $t('release_note.new') }}
                        </div>
                        <div>
                            <p class="release-edited" v-html="version.latest['uz']"/>
                        </div>
                        <div>
                            <p class="release-edited" v-html="version.latest['ru']"/>
                        </div>
                    </div>
                    <div v-if="version&& version.fixed" class="release-info-main-block">
                        <div class="release-info-main-block-tag release-info-main-block-tag-edited">
                            {{ $t('edited') }}
                        </div>
                        <div>
                            <p class="release-new" v-html="version.fixed['uz'] || ''"/>
                        </div>
                        <div>
                            <p class="release-new" v-html="version.fixed['ru'] || ''"/>
                        </div>

                    </div>
                </div>
            </template>
            <template #footer>
                <div class="release-info-footer">
                    <BaseQuestionsIcon :height="20" :width="20"/>
                    <p>{{ $t('release_note.comment') }}</p>
                </div>
            </template>
        </base-modal>


        <b-table
            thead-tr-class="row__head__bottom-border"
            tbody-tr-class="row__body__bottom-border"
            class="table__list mt-3"
            ref="contracts-table"
            id="users-table"
            borderless
            responsive
            show-empty
            sort-icon-left
            :busy="loading"
            :items="versions"
            :fields="fields"
            :empty-text="$t('no_data')"
        >

            <template #table-busy>
                <base-loading/>
            </template>


            <template #head()="data">
                <span>{{ $t(data.label) }}</span>
            </template>

            <!-- INDEX COLUMN -->
            <template #cell(id)="data">
            <span>
              {{ data.item.id }}
            </span>
            </template>


            <template #cell(created_at)="data">
            <span>
              {{ dateFormat(data.item.created_at) }}
            </span>

            </template>


            <template #cell(actions)="data">
                <div v-if="true || editPermission || deletePermission || viewPermission"
                     class="actions">
                     <span
                         v-if="true|| viewPermission"
                         class="icon eye__icon rounded-circle"
                         @click="viewRelease(data.item.id)"
                     >
                         <base-eye-icon :width="18" :height="18" fill="#ffff"/>
                    </span>
                    <span
                        v-if="true|| editPermission"
                        class="icon edit__icon rounded-circle"
                        @click="getUpdateRelease(data.item.id)"
                    >
                            <base-edit-icon :width="18" :height="18" fill="#ffff"/>
                    </span>
                    <span
                        v-if="true || deletePermission"
                        class="icon delete__icon rounded-circle"
                        @click="deleteRelease(data.item.id)"
                    >
                            <base-delete-icon :width="18" :height="18" fill="#ffff"/>
                    </span>
                </div>

            </template>
        </b-table>


        <div v-if="!loading && hasPagination && false" class="pagination__vue">
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
                @change-page="changeCurrentPage"
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

        </div>


    </div>
</template>

<script>
import BaseButton from "@/components/Reusable/BaseButton";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import BaseInput from "@/components/Reusable/BaseInput";
import BaseQuestionsIcon from "@/components/icons/BaseQuestionsIcon";
import AppHeader from "@/components/Header/AppHeader";
import {VueEditor} from 'vue2-editor'
import api from "@/services/api";
import BaseLoading from "@/components/Reusable/BaseLoading";
import BaseEditIcon from "@/components/icons/BaseEditIcon";
import {sortObjectValues} from "@/util/reusable";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseEyeIcon from "@/components/icons/BaseEyeIcon";


export default {
    name: "ReleaseNote",
    components: {
        BaseEyeIcon,
        BaseArrowLeftIcon,
        BaseArrowRightIcon,
        BasePlusIcon,
        BaseDeleteIcon,
        BaseEditIcon,
        BaseLoading,
        AppHeader,
        BaseQuestionsIcon,
        BaseInput,
        BaseCloseIcon,
        BaseButton,
        BaseModal,
        VueEditor
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
            showByValue = 10
        }

        return {
            showByOptions,
            showByValue,
            versions: [],
            loading: false,
            pagination: {},
            fields: [
                {
                    key: "id",
                    label: "id",
                },
                {
                    key: 'version',
                    label: 'release_note.version_number',
                },
                {
                    key: "created_at",
                    label: "created_at",
                    sortable: true,
                },
                {
                    key: 'published',
                    label: "release_note.published",
                    formatter: (item) => {
                        return item ? this.$t('yes') : this.$t('no')
                    }
                },
                {
                    key: "actions",
                    label: "",
                },
            ],
            form: {
                version: null,
                latest: {
                    uz: null,
                    ru: null
                },
                fixed: {
                    uz: null,
                    ru: null
                },
                published: true
            },
            version: {},
            modalPosition: 'create',
            selectVersion: null
        }
    },
    computed: {
        hasPagination() {
            return this.versions.length
        },
        query() {
            return Object.assign({}, this.$route.query)
        },
    },
    watch: {
        '$route.query': {
            handler: function () {
                this.fetchUsers()
            },
            deep: true
        },
    },
    async mounted() {
        await this.getReleaseModal()
        await this.getReleaseNotes()
    },
    methods: {
        dateFormat(rawDate) {
            const monthNames = ["january", "february", "march", "april", "may", "june",
                "july", "august", "september", "october", "november", "december"
            ];
            const date = new Date(rawDate)
            const day = date.getDate()
            const month = this.$t(monthNames[date.getMonth()]).toLocaleLowerCase()
            const year = date.getFullYear()
            return `${day} ${month}, ${year}`
        },
        async getReleaseNotes() {
            const query = sortObjectValues(this.query)
            this.loading = true
            await api.settings.getVersionList(query).then((res) => {
                this.versions = res.data
            }).catch((error) => {
                console.error(error, 'error');
            }).finally(() => {
                this.loading = false
            })
        },
        createReleaseNote() {
            let body = {...this.form}
            if (!(body.latest && body.latest.uz && body.latest.ru)) {
                delete body.latest
            }
            if (!(body.fixed && body.fixed.uz && body.fixed.ru)) {
                delete body.fixed
            }
            if (body.version) {
                if (this.modalPosition === 'create') {
                    api.settings.createVersion(body).then(() => {
                        this.toasted('created', 'success')
                    }).catch((err) => {
                        return this.toastedWithErrorCode(err)
                    }).finally(() => {
                        this.$refs['create-modal'].closeModal()
                    })
                } else {
                    api.settings.updateVersion(this.selectVersion, body).then(() => {
                        this.toasted('updated', 'success')
                    }).catch((err) => {
                        return this.toastedWithErrorCode(err)
                    }).finally(() => {
                        this.$refs['create-modal'].closeModal()
                    })
                }
                this.getReleaseNotes()
            }
        },
        async getReleaseModal() {
            await api.settings.getLastVersion().then((res) => {
                this.version = res.data
            }).catch((err) => {
                return this.toastedWithErrorCode(err)
            })
        },
        async getReleaseOne(id) {
            await api.settings.getVersion(id).then((res) => {
                this.version = res.data
                this.$refs["view-modal"].openModal()
            }).catch((err) => {
                return this.toastedWithErrorCode(err)
            })
        },
        async getUpdateRelease(id) {
            this.modalPosition = 'update'
            this.selectVersion = id
            await api.settings.getVersion(id).then((res) => {
                this.form = res.data
            }).catch((err) => {
                return this.toastedWithErrorCode(err)
            }).finally(() => {
                this.$refs["create-modal"].openModal()
            })
        },

        async deleteRelease(id) {
            this.loading = true
            await api.settings.deleteVersion(id).then((res) => {
                this.form = res.data
            }).catch((err) => {
                return this.toastedWithErrorCode(err)
            }).finally(() => {
                this.getReleaseNotes()
                this.loading = false
            })
        },

        openReleaseModal() {
            this.modalPosition = 'create'
            this.form = {
                version: null,
                latest: {
                    uz: null,
                    ru: null
                },
                fixed: {
                    uz: null,
                    ru: null
                },
                published: true
            }
            this.$refs["create-modal"].openModal()
        },
        closeReleaseModal() {
            this.$refs["create-modal"].closeModal()
        },
        async openReleaseNote() {
            await this.getReleaseModal()
            this.$refs["view-modal"].openModal()
        },
        closeReleaseNote() {
            this.$refs["view-modal"].closeModal()
        },
        async viewRelease(id) {
            await this.getReleaseOne(id);
        },

        changeCurrentPage(page) {
            const currentPage = this.query.page
            if (page === currentPage) return
            this.replaceRouter({...this.query, page})
        },
        changeFetchLimit() {
            const query = {
                ...this.query, page: 1
            }
            const limit = this.showByValue
            this.replaceRouter({...query, limit})
        },


        pushRouter(query) {
            const sortQuery = sortObjectValues(query)
            this.$router.push({query: sortQuery})
        },
    }
}
</script>


<style scoped lang="scss">

@import '../../assets/scss/utils/tab.sass';


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
        display: flex;
        row-gap: 56px;
        flex-direction: column;
    }

    .block-title {
        font-family: CraftworkSans, serif;
        font-weight: 900;
        font-size: 24px;
        line-height: 28px;
        color: #9CA3AF;
        margin-bottom: 0;
    }

    &__select {
        display: flex;
        flex-direction: column;
        row-gap: 2rem;
        width: 50%;
    }

    &__block {
        display: flex;
        row-gap: 2rem;

        &-item {
            display: flex;
            flex-direction: column;
            gap: 16px;
            font-family: 'Inter', serif;
            margin: 2rem 0;

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


    &-footer {
        display: flex;
        gap: 16px;

        .base__button {
            width: 170px;
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

.actions {
    display: flex;
    align-items: center;
    gap: .5rem;
    justify-content: flex-end;

    .icon {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .eye__icon {
        background-color: var(--teal-600);
    }

    .edit__icon {
        background-color: var(--violet-600);
    }

    .delete__icon {
        background-color: var(--red-600);
    }
}


@import "@/assets/scss/utils/pagination";

.search__content {
    margin-top: 0;
}


::v-deep .row__head__bottom-border {
    border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .row__body__bottom-border:not(:last-child) {
    border-bottom: 2px solid var(--gray-200) !important;
}


::v-deep .table__list {
    min-height: 250px;
    max-height: none;

    table {
        color: var(--gray-600);

        thead tr th {
            font-family: CraftworkSans, serif;
            font-weight: 900;
            font-size: 14px;
            line-height: 14px;
            letter-spacing: 1px;
            color: var(--gray-400) !important;
            padding: 1.125rem 1rem;
            vertical-align: middle;

            //&.b-table-sort-icon-left {
            //display: flex;
            //align-items: center;
            //}
        }

        td {
            vertical-align: middle;
        }
    }


    .table.b-table[aria-busy=true] {
        opacity: 1 !important;
    }
}


::v-deep .table.b-table > thead > tr > [aria-sort="none"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="none"] {
    background-position: right calc(2rem / 2) center !important;
    //background-position: right !important;
    padding-right: 20px;
}

::v-deep .table.b-table > thead > tr > [aria-sort=ascending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=ascending] {
    background-position: right calc(2rem / 2) center !important;
    background-size: 20px;
    background-image: url("../../assets/icons/icon-arrow-down.svg") !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort=descending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=descending] {
    background-position: right calc(2rem / 2) center !important;
    background-size: 20px;
    background-image: url("../../assets/icons/icon-arrow-up.svg") !important;
}


</style>

