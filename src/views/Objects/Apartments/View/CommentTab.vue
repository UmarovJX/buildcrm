<template>
    <div>
        <ApartmentComments
            :express-view="false"
            :comments-data="commentsData"
            :comment-loading="commentLoading"
            :apartment-uuid="apartment.uuid"
            @update-comments="updateComments"
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
    methods: {
        updateComments(data) {
            this.$emit('update-comments', data)
        }
    }
}
</script>
