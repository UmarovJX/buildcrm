<template>
  <main>
    <base-button @click="openCommentsModal" class="mt-5">Comments</base-button>
    <base-modal ref="comments-add" id="comments-adder">
      <template #header>
        <p>hello header</p>
        <span @click="closeCommentsModal"><BaseCloseIcon/></span>
      </template>
      <template #main>
        <p>hello main</p>
      </template>
      <template #footer>
        <p>hello footer</p>
      </template>
    </base-modal>
  </main>
</template>


<script>
import BaseButton from "@/components/Reusable/BaseButton";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
export default {
  name: "ReleaseNote",
  components: {BaseCloseIcon, BaseButton, BaseModal},
  data() {
    return {
      modalProperties: {
        type: '',
        title: '',
      },
    }
  },
  methods: {
    openCommentsModal() {
      this.modalProperties = {
        type: 'comments',
        title: 'contracts.add_note',
        btnText: 'add',
      }
      this.$refs["comments-add"].openModal()
    },
    closeCommentsModal() {
      console.log("close");
      this.$refs["comments-add"].closeModal()
    }
  }
}
</script>

<style scoped>

</style>