<template>
  <sidebar-left>
    <div class="filter-button" @click="emit('showFriends')">Friends</div>
    <div class="filter-button" @click="emit('openCreateChat')">Create Chat</div>
    <div v-if="loading" class="center">
      <div class="loader" />
    </div>
    <div v-else>
      <div
        v-for="chat in chats"
        :key="chat.id"
        class="chat-row"
        @contextmenu.prevent="showContextMenu($event, chat.id)"
      >
        <div
          class="chat-row-button"
          :class="{ active: currentId === chat.id }"
          @click="emit('openChat', chat.id)"
        >
          <profile-picture
            class="chat-row-picture"
            size="32"
            :avatar="
              chat.type === ChatType.Direct && chat.owner !== userId
                ? chat.ownerDetails.avatar
                : chat.icon
            "
            :placeholder="chat.type !== ChatType.Direct ? 'users' : undefined"
          />
          <div class="chat-row-button-item">
            <p
              v-if="
                chat.type !== ChatType.Direct ||
                (chat.type === ChatType.Direct && chat.owner === userId)
              "
              class="chat-title ellipse"
            >
              {{ chat.name }}
            </p>
            <p
              v-else-if="chat.type === ChatType.Direct && chat.owner !== userId"
              class="chat-title ellipse"
            >
              {{ chat.ownerDetails.username }}
            </p>
            <p class="message-text-medium-gray ellipse">
              {{ chat.description }}
            </p>
          </div>
          <div v-if="chat.association.notifications" class="chat-notifications">
            {{ chat.association.notifications }}
          </div>
        </div>
        <icons
          v-if="chat.owner === userId && chat.type !== ChatType.Direct"
          class="chat-settings"
          size="20"
          icon="settings"
          @click="emit('showEditChat', chat)"
        />
      </div>
      <context-menu
        v-if="
          contextMenuVisible && contextMenuItemChatId && contextMenuItemChat
        "
        :position="contextMenuPosition"
        @close="contextMenuVisible = false"
      >
        <div
          v-if="contextMenuItemChat.association.notifications !== 0"
          @click="emit('readChat', contextMenuItemChatId)"
        >
          Mark as Read
        </div>
        <div
          v-if="
            contextMenuItemChat.owner === userId &&
            contextMenuItemChat.type !== ChatType.Direct
          "
          @click="emit('showEditChat', contextMenuItemChat)"
        >
          Edit Chat
        </div>
        <div
          v-if="
            contextMenuItemChat.owner !== userId &&
            contextMenuItemChat.type === ChatType.Group
          "
          class="button-red"
          @click="emit('removeUser', contextMenuItemChatId)"
        >
          Leave
        </div>
        <div @click="copyText(contextMenuItemChatId)">Copy Chat ID</div>
      </context-menu>
    </div>
  </sidebar-left>
</template>

<script setup lang="ts">
import SidebarLeft from "../core/SidebarLeft.vue"
import ProfilePicture from "../ProfilePicture.vue"
import Icons from "../core/Icons.vue"
import ContextMenu from "../core/ContextMenu.vue"

import { Chat, ChatType } from "@/types/chat"
import { computed, ref } from "vue"
import { Position } from "@/types/position"

const props = defineProps<{
  chats?: Chat[]
  loading: boolean
  currentId?: number
  userId?: number
}>()

const emit = defineEmits<{
  showFriends: []
  openChat: [number]
  openCreateChat: []
  showEditChat: [Chat]
  removeUser: [number]
  readChat: [number]
}>()

const contextMenuVisible = defineModel<boolean>("contextMenu", {
  required: true
})

const contextMenuItemChat = computed(() =>
  props.chats?.find((c) => c.id === contextMenuItemChatId.value)
)

const contextMenuItemChatId = ref<number | null>(null)
const contextMenuPosition = ref<Position>({ x: 0, y: 0 })

const copyText = (text: number | null) => {
  contextMenuVisible.value = false
  navigator.clipboard.writeText(String(text))
}

const showContextMenu = (event: MouseEvent, chatId: number) => {
  event.preventDefault()
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true
  contextMenuItemChatId.value = chatId
}
</script>
