<template>
  <sidebar-left>
    <div class="filter-button" @click="emit('showFriends')">Friends</div>
    <div class="filter-button" @click="emit('openCreateChat')">Create Chat</div>
    <div v-if="loading" class="center">
      <div class="loader" />
    </div>
    <div v-else>
      <div v-for="chat in chats" :key="chat.id" class="chat-row">
        <div
          class="chat-row-button"
          :class="{ active: currentId === chat.id }"
          @click="emit('openChat', chat.id)"
        >
          <profile-picture
            class="chat-row-picture"
            size="32"
            :avatar="
              chat.type === 1 && chat.owner !== userId
                ? chat.ownerDetails.avatar
                : chat.icon
            "
            :placeholder="chat.type !== 1 ? 'users' : undefined"
            :small="true"
          />
          <div class="chat-row-button-item">
            <p
              v-if="
                chat.type === 0 ||
                chat.type === 2 ||
                (chat.type === 1 && chat.owner === userId)
              "
              class="chat-title ellipse"
            >
              {{ chat.name }}
            </p>
            <p
              v-else-if="chat.type === 1 && chat.owner !== userId"
              class="chat-title ellipse"
            >
              {{ chat.ownerDetails.username }}
            </p>
            <p class="message-text-medium-gray ellipse">
              {{ chat.description }}
            </p>
          </div>
          <div
            v-if="chat.type !== 2 && chat.association.notifications"
            class="chat-notifications"
          >
            {{ chat.association.notifications }}
          </div>
        </div>
        <icons
          v-if="chat.owner === userId && chat.type !== 1"
          class="chat-settings"
          size="20"
          icon="settings"
          @click="emit('showEditChat', chat)"
        />
      </div>
    </div>
  </sidebar-left>
</template>

<script setup lang="ts">
import SidebarLeft from "../core/SidebarLeft.vue"
import ProfilePicture from "../ProfilePicture.vue"
import Icons from "../core/Icons.vue"

import { Chat } from "@/types/chat"

defineProps<{
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
}>()
</script>
