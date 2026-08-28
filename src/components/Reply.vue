<template>
  <div v-if="message" class="reply-preview">
    <icons size="16" icon="right" />
    <profile-picture
      size="16"
      :avatar="message.user?.avatar"
      :small="true"
      @click="openUser(message.user?.id)"
    />
    <b class="message-text-medium" @click="openUser(message.user?.id)">
      {{
        message.user?.username ? "@" + message.user?.username : "@Deleted user"
      }}
    </b>
    <p class="message-text-medium-gray-hover" @click="goToMessage(message.id)">
      {{ message.messageContents }}
    </p>
  </div>
  <div v-else class="reply-preview">
    <icons colour="darkgrey" size="16" icon="right" />
    <icons colour="darkgrey" size="16" icon="user" />
    <b class="message-text-medium-gray">Message has been deleted</b>
  </div>
</template>

<script setup lang="ts">
import ProfilePicture from "./ProfilePicture.vue"
import Icons from "./core/Icons.vue"

import { Message } from "@/types/message"

defineProps<{
  message: Message
  openUser: (userId: number) => void
  goToMessage: (messageId: number) => void
}>()
</script>
