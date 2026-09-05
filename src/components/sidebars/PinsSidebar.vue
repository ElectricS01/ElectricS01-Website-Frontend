<template>
  <div v-if="pins?.length === 0" class="sidebar-text">No pinned messages</div>
  <div
    v-for="(message, index) in pins"
    :id="'message-' + index"
    :key="message.id"
    style="padding: 4px"
  >
    <chat-spacer :message="message" :previous-message="pins[index - 1]" />
    <reply
      v-if="message.reply"
      :message="findMessage(message.reply)"
      :open-user="openUser"
      :go-to-message="goToMessage"
    />
    <div
      class="message-grid"
      style="position: relative; width: 100%"
      @click="goToMessage(message.id)"
    >
      <div
        v-if="!merge(message, pins[index - 1])"
        style="margin: 0 12px 0 4px; cursor: pointer; border-radius: 16px"
        class="message-item"
        @click="openUser(message.user?.id)"
      >
        <profile-picture size="32" :avatar="message.user?.avatar" />
      </div>
      <div v-else class="message-time">
        <b class="message-text-small">
          {{ dayjsShort(message.createdAt) }}
        </b>
      </div>
      <div
        class="message-item"
        style="width: calc(100% - 48px); overflow-wrap: break-word"
      >
        <div class="message-header">
          <b class="message-text-medium" @click="openUser(message.user.id)">
            {{ message.user?.username }}
          </b>
          <b class="message-text-small">
            {{ " " + dayjsLong(message.createdAt) }}
          </b>
        </div>
        <custom-message
          :message="message"
          :open-user="openUser"
          :find-username="findUsername"
          @scroll="emit('scroll')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfilePicture from "../ProfilePicture.vue"
import CustomMessage from "../CustomMessage.vue"
import ChatSpacer from "../ChatSpacer.vue"
import Reply from "../Reply.vue"

import { dayjsLong, dayjsShort } from "@/helpers/dates"
import { merge } from "@/helpers/messages"
import { Message } from "@/types/message"

defineProps<{
  findMessage: (messageId: number) => Message | undefined
  findUsername: (userId: number) => string
  goToMessage: (messageId: number) => void
  openUser: (userId: number) => void
  pins: Message[]
}>()

const emit = defineEmits<{
  scroll: []
}>()
</script>
