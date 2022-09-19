<template>
    <div>
        <base-button class="mb-4" @click="openReleaseModal" text="add release note"/>
        <base-button class="mb-4" @click="getUpdateRelease" text="update release note"/>
        <base-button @click="openReleaseNote" text="about release note"/>

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
                            <b-tabs card class="custom-tab">
                                <div class="bottom__line"></div>
                                <b-tab title="На русском" active>
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
                                <b-tab title="O’zbekchada">
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
                    <base-button @click="recheckRelease" :text="`${ $t('recheck') }`"/>
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
                        <p class="release-info-main-block-date">22 June, 2022</p>
                    </div>
                    <div class="release-info-main-block">
                        <div class="release-info-main-block-tag release-info-main-block-tag-new">
                            {{ $t('release_note.new') }}
                        </div>
                        <div>
                            <p class="release-new" v-html="version.fixed['uz']"/>
                        </div>
                        <div>
                            <p class="release-new" v-html="version.fixed['ru']"/>
                        </div>
                    </div>
                    <div class="release-info-main-block">
                        <span class="release-info-main-block-tag release-info-main-block-tag-edited">{{
                                $t('edited')
                            }}</span>
                        <div>
                            <p class="release-edited" v-html="version.latest['uz']"/>
                        </div>
                        <div>
                            <p class="release-edited" v-html="version.latest['ru']"/>
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
    </div>
</template>

<script>
import BaseButton from "@/components/Reusable/BaseButton";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import BaseInput from "@/components/Reusable/BaseInput";
import BaseQuestionsIcon from "@/components/icons/BaseQuestionsIcon";
import {VueEditor} from 'vue2-editor'
import api from "@/services/api";

export default {
    name: "ReleaseNote",
    components: {
        BaseQuestionsIcon,
        BaseInput,
        BaseCloseIcon,
        BaseButton,
        BaseModal,
        VueEditor
    },
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
            modalPosition: 'create'
        }
    },
    async mounted() {
        await this.getReleaseModal()
    },
    methods: {
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
                    api.settings.createVersion(body).then((res) => {
                        console.log(res, 'res');
                    }).catch((err) => {
                        return this.toastedWithErrorCode(err)
                    }).finally(() => {
                        this.$refs['create-modal'].closeModal()
                    })
                } else {
                    api.settings.updateVersion(28, body).then((res) => {
                        console.log(res, 'res');
                    }).catch((err) => {
                        return this.toastedWithErrorCode(err)
                    }).finally(() => {
                        this.$refs['create-modal'].closeModal()
                    })
                }
            }
        },
        async getReleaseModal() {
            await api.settings.getLastVersion().then((res) => {
                this.version = res.data
            }).catch((err) => {
                return this.toastedWithErrorCode(err)
            })
        },
        async getUpdateRelease() {
            this.modalPosition = 'update'
            await api.settings.getVersion(28).then((res) => {
                this.form = res.data
            }).catch((err) => {
                return this.toastedWithErrorCode(err)
            }).finally(() => {
                this.$refs["create-modal"].openModal()
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
        recheckRelease() {
            this.$refs["view-modal"].openModal()
        },
        addRelease() {
            this.$emit('add-release-note', this.form)
            this.$refs["create-modal"].closeModal()
        },
        setFormProperty(property, value) {
            this.form[property] = value
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


</style>

