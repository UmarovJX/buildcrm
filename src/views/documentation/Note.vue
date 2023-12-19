<script>
import DocHeader from '@/views/documentation/DocHeader'
import BaseNote from '@/components/Reusable/BaseNote'

export default {
  name: 'Note',
  components: { BaseNote, DocHeader },
  data() {
    return {
      detail: {
        text: 'Text',
        date: '2020-05-12T23:50:21.817Z',
        author: 'Темурбек Якубов',
        role: 'Менеджер продаж',
        image: 'avatar.svg',
      },
    }
  },
  methods: {
    editNote() {
      console.log('edit')
    },
    deleteNote() {
      console.log('delete')
    },
  },
}
</script>

<template>
  <main class="note">
    <DocHeader title="note" />
    <div class="note-content">
      <BaseNote
        :detail="detail"
        :actions="true"
      >
        <template #delete>
          <p @click="deleteNote">
            delete
          </p>
        </template>
        <template #edit>
          <p @click="editNote">
            edit
          </p>
        </template>
      </BaseNote>
    </div>
  </main>
</template>

<style scoped></style>
