<template>
  <transition>
    <modal
      v-if="createChatShown && !store.quickSwitcherShown"
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
          <div class="text-small">
            <label class="text-small" for="chat-name">Chat name</label>
          </div>
          <input
            id="chat-name"
            v-model="chatNameInput"
            placeholder="Chat name"
            class="modal-input"
            @keydown.enter="createChat"
          />
          <div class="text-small">
            <label for="chat-description">Chat description</label>
          </div>
          <input
            id="chat-description"
            v-model="chatDescriptionInput"
            placeholder="Chat description"
            class="modal-input"
            @keydown.enter="createChat"
          />
          <div class="text-small">
            <label for="chat-icon">Chat icon</label>
          </div>
          <input
            id="chat-icon"
            v-model="chatIconInput"
            placeholder="Chat icon"
            class="modal-input"
            @keydown.enter="createChat"
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
          <input
            id="add-user"
            v-model="chatUsernameInput"
            placeholder="Add a user"
            class="modal-input"
            @keydown.enter="addChatUser(chatUsernameInput, chatUsers)"
          />
          <button @click="createChat">Create</button>
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
  </transition>
</template>
<script setup>
import Modal from "@/components/core/Modal.vue"
import { useDataStore } from "@/store"
import axios from "axios"
import duration from "dayjs/plugin/duration"
import dayjs from "dayjs"
import { ref } from "vue"
import { getUserByName, sendDm } from "@/helpers/chatUsers"

dayjs.extend(duration)

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

const createChat = () => {
  if (!store.userData.emailVerified) {
    requireVerification.value = false
  }

  if (
    chatNameInput.value === "" ||
    chatDescriptionInput.value === "" ||
    typeof requireVerification.value !== "boolean" ||
    creating === true
  )
    return

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
