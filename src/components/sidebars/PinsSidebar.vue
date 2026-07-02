<template>
  <div v-if="pins?.length === 0" class="sidebar-text">No pinned messages</div>
  <div
    v-for="(message, index) in pins"
    :id="'message-' + index"
    :key="message.id"
    style="padding: 4px"
  >
    <chat-spacer :message="message" :previous-message="pins[index - 1]" />
    <div
      v-if="message.reply && findMessage(message.reply)"
      class="reply-preview"
    >
      <icons size="16" icon="reply" style="margin-right: 4px" />
      <profile-picture
        size="16"
        :avatar="findMessage(message.reply)?.user?.avatar"
        :small="true"
        @click="openUser(findMessage(message.reply)?.user?.id)"
      />
      <b
        class="message-text-medium"
        style="margin: 4px 4px 0 4px"
        @click="openUser(findMessage(message.reply)?.user?.id)"
      >
        {{
          findMessage(message.reply)?.user?.username
            ? "@" + findMessage(message.reply)?.user?.username
            : "@Deleted user"
        }}
      </b>
      <p
        class="message-text-medium-gray-hover"
        style="margin-top: 4px; margin-bottom: 0"
        @click="goToMessage(message.reply)"
      >
        {{ findMessage(message.reply)?.messageContents }}
      </p>
    </div>
    <div v-else-if="message.reply" class="reply-preview">
      <icons
        colour="darkgrey"
        size="16"
        icon="reply"
        style="margin-right: 4px"
      />
      <icons colour="darkgrey" size="16" icon="user" />
      <b class="message-text-medium-gray" style="margin: 4px 4px 0 4px">
        Message has been deleted
      </b>
    </div>
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
          :find-user="findUser"
          :scroll="scroll"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icons from "../core/Icons.vue"
import ProfilePicture from "../ProfilePicture.vue"
import CustomMessage from "../CustomMessage.vue"
import ChatSpacer from "../ChatSpacer.vue"

import { dayjsLong, dayjsShort } from "@/helpers/dates"
import { merge } from "@/helpers/messages"
import { User } from "@/types/user"
import { Message } from "@/types/message"

defineProps<{
  findMessage: (messageId: number) => Message
  findUser: (userId: number) => User
  goToMessage: (messageId: number) => void
  openUser: (userId: number) => void
  pins: Message[]
  scroll: () => void
}>()
</script>
