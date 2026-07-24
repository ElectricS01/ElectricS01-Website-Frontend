<template>
  <modal
    :is-active="createChatShown && !store.quickSwitcherShown"
    @close="emits('hideCreateChat')"
  >
    <div class="channel-menu">
      <div class="selector">
        <p
          class="message-text-large"
          :class="{ active: createChatType }"
          @click="createChatType = true"
        >
          Create New Chat
        </p>
        <p
          class="message-text-large"
          :class="{ active: !createChatType }"
          @click="createChatType = false"
        >
          Create Direct Message
        </p>
      </div>
      <div v-if="createChatType">
        <chat-modal-fields
          v-model:chat-name="chatNameInput"
          v-model:chat-description="chatDescriptionInput"
          v-model:chat-icon="chatIconInput"
          v-model:require-verification="requireVerification"
          v-model:chat-users="chatUsers"
          @submit="createChat"
        />
        <button class="dark-button" @click="createChat">Create</button>
      </div>
      <div v-else>
        <div class="text-small">
          <label for="username">Username</label>
        </div>
        <input
          id="username"
          v-model="chatUsernameInput"
          placeholder="Username"
          class="modal-input"
          @keydown.enter="createDirectMessage"
        />
        <button @click="createDirectMessage">Create</button>
      </div>
    </div>
  </modal>
</template>
<script setup>
import Modal from "@/components/core/Modal.vue"
import ChatModalFields from "./ChatModalFields.vue"

import { useDataStore } from "@/store"
import axios from "axios"
import { ref } from "vue"
import { getUserByName, sendDm } from "@/helpers/chatUsers"

const store = useDataStore()
defineProps({
  createChatShown: Boolean
})
const emits = defineEmits(["hideCreateChat", "chatCreated", "dmCreated"])

const createChatType = ref(true)
const chatNameInput = ref("")
const chatDescriptionInput = ref("")
const chatIconInput = ref("")
const requireVerification = ref(true)
const chatUsernameInput = ref("")
const chatUsers = ref([])

let creating = false

const setDefaultValues = () => {
  createChatType.value = true
  chatNameInput.value = ""
  chatDescriptionInput.value = ""
  chatIconInput.value = ""
  requireVerification.value = true
  chatUsernameInput.value = ""
  chatUsers.value = []
  creating = false
}

const createChat = () => {
  if (!store.userData.emailVerified) {
    requireVerification.value = false
  }

  if (
    chatNameInput.value === "" ||
    chatDescriptionInput.value === "" ||
    typeof requireVerification.value !== "boolean" ||
    creating === true
  ) {
    if (chatNameInput.value === "")
      store.handleError("Chat name cannot be empty", 2500)
    else if (chatDescriptionInput.value === "")
      store.handleError("Chat description cannot be empty", 2500)
    return
  }

  creating = true
  axios
    .post("/api/create-chat", {
      description: chatDescriptionInput.value,
      icon: chatIconInput.value,
      name: chatNameInput.value,
      requireVerification: requireVerification.value,
      users: chatUsers.value.map((user) => user.id)
    })
    .then((res) => {
      store.userData.chatsList = res.data.chats
      store.chatSort()
      emits("chatCreated", res.data.chat)
    })
    .catch((e) => {
      creating = false
      store.handleAxiosError(e)
    })
}

const createDirectMessage = async () => {
  if (creating) return
  if (!chatUsernameInput.value) return
  creating = true

  const userId = await getUserByName(chatUsernameInput.value)

  if (userId === -1) {
    chatUsernameInput.value = ""
    creating = false
    store.handleError("User not found", 2500)
    return
  }

  try {
    const data = await sendDm(userId)
    emits("dmCreated", data)
  } catch (e) {
    creating = false
    store.handleAxiosError(e)
  }
}

defineExpose({
  clearInputs: setDefaultValues
})
</script>
