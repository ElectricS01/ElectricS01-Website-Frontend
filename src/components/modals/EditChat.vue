<template>
  <modal
    :is-active="editingChat !== null && !store.quickSwitcherShown"
    @close="emits('hideEditingChat')"
  >
    <div class="channel-menu">
      <p class="message-text-large">Edit Chat</p>
      <chat-modal-fields
        v-model:chat-name="chatNameInput"
        v-model:chat-description="chatDescriptionInput"
        v-model:chat-icon="chatIconInput"
        v-model:require-verification="requireVerification"
        v-model:chat-users="chatUsers"
        @submit="saveChat"
      />
      <button class="dark-button" @click="saveChat">Save</button>
      <button
        v-if="editingChat?.type !== 2"
        class="dark-button-red"
        @click="deleteChat(editingChat?.id)"
      >
        Delete
      </button>
    </div>
  </modal>
</template>
<script setup>
import Modal from "@/components/core/Modal.vue"
import ChatModalFields from "./ChatModalFields.vue"

import { useDataStore } from "@/store"
import axios from "axios"
import { ref } from "vue"
import { getChatUsers } from "@/helpers/chatUsers"

const store = useDataStore()
const props = defineProps({
  editingChat: Object
})
const emits = defineEmits(["hideEditingChat", "chatEdited"])

const requireVerification = ref(true)
const chatNameInput = ref("")
const chatDescriptionInput = ref("")
const chatIconInput = ref("")
const chatUsernameInput = ref("")
const chatUsers = ref([])

let creating = false

const loadChat = async (chat) => {
  chatNameInput.value = chat.name
  chatDescriptionInput.value = chat.description
  chatIconInput.value = chat.icon
  requireVerification.value = chat.requireVerification
  chatUsernameInput.value = ""
  chatUsers.value = await getChatUsers(chat.id)
  if (chatUsers.value.length === 0) emits("hideEditingChat")
  creating = false
}

const saveChat = () => {
  if (!store.userData.emailVerified) {
    requireVerification.value = false
  }

  if (
    !chatNameInput.value ||
    !chatDescriptionInput.value ||
    typeof requireVerification.value !== "boolean" ||
    creating === true
  )
    return

  creating = true
  axios
    .patch(`/api/edit-chat/${props.editingChat?.id}`, {
      description: chatDescriptionInput.value,
      icon: chatIconInput.value,
      name: chatNameInput.value,
      requireVerification: requireVerification.value,
      users: chatUsers.value.map((user) => user.id)
    })
    .then((res) => {
      store.userData.chatsList = res.data.chats
      store.chatSort()
      emits("chatEdited", res.data.chat)
    })
    .catch((e) => {
      creating = false
      store.handleAxiosError(e)
    })
}

const deleteChat = (chatId) => {
  axios
    .delete(`/api/delete-chat/${chatId}`)
    .then((res) => {
      store.userData.chatsList = res.data.chats
      store.chatSort()
      emits("chatEdited", res.data.chat)
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

defineExpose({
  loadChat
})
</script>
