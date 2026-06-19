<template>
  <transition>
    <modal
      v-if="editingChat !== null && !store.quickSwitcherShown"
      :is-active="editingChat !== null && !store.quickSwitcherShown"
      @close="emits('hideEditingChat')"
    >
      <div class="channel-menu">
        <p class="message-text-large">Edit Chat</p>
        <div class="text-small">
          <label class="text-small" for="chat-name">Chat name</label>
        </div>
        <input
          id="chat-name"
          v-model="chatNameInput"
          placeholder="Chat name"
          class="modal-input"
          @keydown.enter="saveChat"
        />
        <div class="text-small">
          <label for="chat-description">Chat description</label>
        </div>
        <input
          id="chat-description"
          v-model="chatDescriptionInput"
          placeholder="Chat description"
          class="modal-input"
          @keydown.enter="saveChat"
        />
        <div class="text-small">
          <label for="chat-icon">Chat icon</label>
        </div>
        <input
          id="chat-icon"
          v-model="chatIconInput"
          placeholder="Chat icon"
          class="modal-input"
          @keydown.enter="saveChat"
        />
        <div v-if="store.userData.emailVerified">
          <div class="text-small">
            <label for="requireVerification">Require verification</label>
          </div>
          <div
            class="switch"
            @click="requireVerification = !requireVerification"
          >
            <input
              id="requireVerification"
              type="checkbox"
              :checked="requireVerification"
            />
            <span class="slider" />
          </div>
        </div>
        <div class="text-main">Users</div>
        <div class="text-small">
          <label for="add-user">Add a user</label>
        </div>
        <input
          id="add-user"
          v-model="chatUsernameInput"
          placeholder="Add a user"
          class="modal-input"
          @keydown.enter="addChatUser(chatUsernameInput, chatUsers)"
        />
        <div v-for="user in chatUsers" :key="user.id" class="create-chat-row">
          {{ user.username }}
          <button
            v-if="user.id !== store.userData.id"
            class="button-red"
            @click="chatUsers = chatUsers.filter((u) => u.id !== user.id)"
          >
            Remove
          </button>
        </div>
        <button @click="saveChat">Save</button>
        <button
          v-if="editingChat?.type !== 2"
          class="button-red"
          @click="deleteChat(editingChat?.id)"
        >
          Delete
        </button>
      </div>
    </modal>
  </transition>
</template>
<script setup>
import Modal from "@/components/core/Modal.vue"
import { useDataStore } from "@/store"
import axios from "axios"
import duration from "dayjs/plugin/duration"
import dayjs from "dayjs"
import { ref } from "vue"
import { getChatUsers, getUserByName } from "@/helpers/chatUsers"

dayjs.extend(duration)

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

const addChatUser = async () => {
  const userId = await getUserByName(chatUsernameInput.value)
  if (userId === -1) {
    store.handleError("User not found", 2500)
  } else if (chatUsers.value.findIndex((user) => user.id === userId) === -1) {
    chatUsers.value.push({ id: userId, username: chatUsernameInput.value })
  } else {
    store.handleError("This user is already apart of this group", 2500)
  }
  chatUsernameInput.value = ""
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
