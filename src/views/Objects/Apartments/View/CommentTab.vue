<template>
    <div>
        <ApartmentComments
            :comments-data="commentsData"
            @update-comments="$emit('update-comments')"
            :express-view="false"
            :comment-loading="commentLoading"
            :apartment-uuid="apartment.uuid"
        />
    </div>
</template>

<script>
import ApartmentComments from "@/components/Objects/View/elements/ApartmentComments";

export default {
    name: "CommentTab",
    components: {
        ApartmentComments,
    },
    props: {
        apartment: {
            type: Object,
            required: true
        },
        commentLoading: {
            type: Boolean,
            required: true,
        },
        commentsData: {
            type: Object,
            required: true
        }
    },
}
</script>

<style scoped>

</style>