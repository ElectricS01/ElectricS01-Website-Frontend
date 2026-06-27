<template>
  <div
    v-if="notifications?.length === 0"
    class="message-text-medium-gray"
    style="text-align: center; margin: 8px"
  >
    No notifications
  </div>
  <div
    v-for="(notification, index) in notifications"
    :id="'notification-' + index"
    :key="notification.id"
    style="padding: 4px; cursor: pointer"
  >
    <div v-if="notification.type === 0" @click="openUser(notification.otherId)">
      You were friended by {{ notification.otherId }}
    </div>
    <div
      v-else-if="notification.type === 1"
      @click="openChat(notification.otherId)"
    >
      You were added to {{ notification.otherId }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from "@/types/notification"

defineProps<{
  notifications: Notification[]
  openChat: (chatId: number) => void
  openUser: (userId: number) => void
}>()
</script>
