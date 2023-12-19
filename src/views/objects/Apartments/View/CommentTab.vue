<script>
import ApartmentComments from '@/components/Objects/view/elements/ApartmentComments'
import ApartmentsPermission from '@/permission/apartments'

export default {
  name: 'CommentTab',
  components: {
    ApartmentComments,
  },
  props: {
    apartment: {
      type: Object,
      required: true,
    },
    commentLoading: {
      type: Boolean,
      required: true,
    },
    commentsData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      apartmentCommentsPermission: {
        view: ApartmentsPermission.getApartmentCommentsViewPermission(),
        create: ApartmentsPermission.getApartmentCommentsCreatePermission(),
        edit: ApartmentsPermission.getApartmentCommentsEditPermission(),
        delete: ApartmentsPermission.getApartmentCommentsDeletePermission(),
      },
    }
  },
  methods: {
    updateComments(data) {
      this.$emit('update-comments', data)
    },
  },
}
</script>

<template>
  <div>
    <ApartmentComments
      v-if="apartmentCommentsPermission && apartmentCommentsPermission.view"
      :permissions="apartmentCommentsPermission"
      :express-view="false"
      :comments-data="commentsData"
      :comment-loading="commentLoading"
      :apartment-uuid="apartment.uuid"
      @update-comments="updateComments"
    />
  </div>
</template>
