<template>
  <div class="user-row">
    <div class="profile-picture">
      <profile-picture style="margin: 4px" size="32" :avatar="user.avatar" />
      <svg class="online-indicator" width="15" height="15">
        <status-indicator size="5" :status="user.status" />
      </svg>
    </div>
    <div class="user-row-text">
      <b
        :class="isOnline ? 'username-text' : 'username-text-offline'"
        :title="user.username"
      >
        {{ user.username }}
      </b>
      <p v-if="isOnline" class="message-text-medium-gray" :title="statusText">
        {{ statusText }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import ProfilePicture from "./ProfilePicture.vue"
import StatusIndicator from "./StatusIndicator.vue"
import { User } from "@/types/user"

const props = defineProps<{ user: User }>()

const isOnline = computed(() => props.user.status === "online")

const statusText = computed(() => {
  return props.user.gameName
    ? "Playing " + props.user.gameName
    : props.user.statusMessage
})
</script>
