<template>
  <div class="comments">
    <div class="comments-header">
      <h4 class="comments-header__title">Примечания</h4>
      <base-button text="Добавить примечание">
        <template #left-icon>
          <BasePlusIcon fill="var(--violet-600)"/>
        </template>
      </base-button>
    </div>

    <div class="comments-body">
      <div class="comment">
        <div class="comment-content">
          <div class="comment-text">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Gravida ridiculus non at fusce dis ut aliquam.
              Massa nisl nunc nibh sed vulputate dui phasellus dui ultrices. Purus non luctus morbi tortor, imperdiet.
              Suspendisse neque, pretium tempus tortor placerat nulla enim fusce neque. Magna varius tincidunt proin sed
              pellentesque. Quis mi aenean cursus diam, nec quis volutpat vel. Condimentum risus fermentum gravida
              aenean massa. Felis ultrices tellus volutpat, a sapien, nibh viverra sit eget. Viverra ultricies
              suspendisse vitae scelerisque. Fringilla velit facilisis ut consectetur. Velit nullam dui at amet cursus
              purus volutpat elit.</p>
          </div>
          <div class="comment-action">
            <BaseDotsIcon/>
          </div>
        </div>
        <div class="comment-footer">
          <div class="comment-info">
            <div class="avatar">
              <img :src="require('@/assets/img/no_avatar.png')" alt="">
            </div>
            <h5 class="name">
              Темурбек Якубов
              <span class="name-dot">
                ·
              </span>
              <span class="name-rank">
                Менеджер продаж
              </span>
            </h5>
          </div>
          <div class="comment-date">
            <p class="date">10:53 27.06.2022</p>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import BaseButton from "@/components/Reusable/BaseButton";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BaseDotsIcon from "@/components/icons/BaseDotsIcon";

export default {
  name: "ContractComments",
  components: {
    BaseButton,
    BasePlusIcon,
    BaseDotsIcon
  },

  data() {
    return {}
  },
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
    column-gap: 1rem;
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

  &-action {
    display: flex;
    height: 100%;
  }

  &-info {
    display: flex;
    align-items: center;

    .avatar {
      width: 24px;
      height: 24px;
      img{
        width: 100%;
      }
    }

    .name {
      &-dot {

      }

      &-rank {

      }
    }
  }

  &-date {
    .date {

    }
  }
}

</style>