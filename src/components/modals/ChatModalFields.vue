<template>
  <div>
    <div class="text-small">
      <label class="text-small" for="chat-name">Chat name</label>
    </div>
    <input
      id="chat-name"
      v-model="chatName"
      placeholder="Chat name"
      class="modal-input"
      @keydown.enter="$emit('submit')"
    />
    <div class="text-small">
      <label for="chat-description">Chat description</label>
    </div>
    <input
      id="chat-description"
      v-model="chatDescription"
      placeholder="Chat description"
      class="modal-input"
      @keydown.enter="$emit('submit')"
    />
    <div class="text-small">
      <label for="chat-icon">Chat icon</label>
    </div>
    <input
      id="chat-icon"
      v-model="chatIcon"
      placeholder="Chat icon"
      class="modal-input"
      @keydown.enter="$emit('submit')"
    />
    <div v-if="store.userData.emailVerified">
      <div class="text-small">
        <label for="requireVerification">Require email verification</label>
      </div>
      <div class="switch" @click="requireVerification = !requireVerification">
        <input
          id="requireVerification"
          type="checkbox"
          :checked="requireVerification"
        />
        <span class="slider" />
      </div>
    </div>
    <div class="spacer" />
    <div class="text-main">Users</div>
    <div class="text-small">
      <label for="add-user">Add a user</label>
    </div>
    <input
      id="add-user"
      v-model="chatUsername"
      placeholder="Add a user"
      class="modal-input"
      @keydown.enter="addChatUser"
    />
    <div v-for="user in chatUsers" :key="user.id" class="create-chat-row">
      {{ user.username }}
      <button
        v-if="user.id !== store.userData.id"
        class="dark-button-red"
        @click="chatUsers = chatUsers.filter((u) => u.id !== user.id)"
      >
        Remove
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserByName } from "@/helpers/chatUsers"
import { useDataStore } from "@/store"
import { ref } from "vue"
import { ChatUser } from "@/types/user"

const store = useDataStore()

defineEmits<{ submit: [] }>()

const chatName = defineModel<string>("chatName", { required: true })
const chatDescription = defineModel<string>("chatDescription", {
  required: true
})
const chatIcon = defineModel<string>("chatIcon", { required: true })
const requireVerification = defineModel<boolean>("requireVerification", {
  required: true
})
const chatUsers = defineModel<ChatUser[]>("chatUsers", { required: true })

const chatUsername = ref("")

const addChatUser = async () => {
  const userId = await getUserByName(chatUsername.value)
  if (userId === -1) {
    store.handleError("User not found", 2500)
  } else if (chatUsers.value.findIndex((user) => user.id === userId) === -1) {
    chatUsers.value.push({ id: userId, username: chatUsername.value })
  } else {
    store.handleError("This user is already apart of this group", 2500)
  }
  chatUsername.value = ""
}
</script>
