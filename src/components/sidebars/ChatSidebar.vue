<template>
  <sidebar
    v-if="
      ((store.sidebarOpen === true || store.search || store.pins) &&
        !store.showFriends) ||
      store.notifications
    "
    :style="{
      width: store.search || store.pins || store.notifications ? '342px' : ''
    }"
  >
    <users-sidebar
      v-if="
        !loadingMessages && !store.search && !store.pins && !store.notifications
      "
      v-model:context-menu="usersSidebarContext"
      :users="currentChat.users"
      :can-remove="
        currentChat.owner === store.userData.id && currentChat.type === 0
      "
      :open-user="openUser"
      :add-friend="addFriend"
      @remove-user="emit('removeUser', $event)"
      @dm-created="emit('dmCreated', $event)"
    />
    <search-sidebar
      v-else-if="store.search"
      :chat-messages="currentChat.messages"
      :find-message="findMessage"
      :find-username="findUsername"
      :go-to-message="goToMessage"
      :open-user="openUser"
      @scroll="emit('scroll')"
    />
    <pins-sidebar
      v-else-if="store.pins"
      :pins="currentChat.pins"
      :find-message="findMessage"
      :find-username="findUsername"
      :go-to-message="goToMessage"
      :open-user="openUser"
      @scroll="emit('scroll')"
    />
    <notifications-sidebar
      v-else-if="store.notifications"
      :notifications="store.userData.notifications ?? []"
      :open-user="openUser"
      :open-chat="openChat"
    />
    <div v-else class="center">
      <div style="text-align: center" class="loader" />
    </div>
  </sidebar>
</template>

<script setup lang="ts">
import UsersSidebar from "./UsersSidebar.vue"
import SearchSidebar from "./SearchSidebar.vue"
import PinsSidebar from "./PinsSidebar.vue"
import NotificationsSidebar from "./NotificationsSidebar.vue"
import { useDataStore } from "@/store"
import { Chat, ChatData } from "@/types/chat"
import { Message } from "@/types/message"
import Sidebar from "../core/Sidebar.vue"

const store = useDataStore()

defineProps<{
  currentChat: Chat
  loadingMessages: boolean
  findMessage: (messageId: number) => Message | undefined
  findUsername: (userId: number) => string
  goToMessage: (messageId: number) => void
  openUser: (userId: number) => void
  openChat: (chatId: number) => void
  addFriend: (userId: number, notOpen: boolean) => void
}>()

const emit = defineEmits<{
  dmCreated: [ChatData]
  removeUser: [number]
  scroll: []
}>()

const usersSidebarContext = defineModel<boolean>("usersSidebarContext", {
  required: true
})
</script>
