<template>
  <div>
    <transition>
      <div
        v-if="replyMessage || scrolledUp"
        style="position: relative; margin-right: 6px"
      >
        <transition>
          <div
            v-if="scrolledUp"
            :style="{
              height: replyMessage ? '36px' : ''
            }"
            style="position: absolute; z-index: 1; bottom: 0; cursor: pointer"
            class="scroll-button"
            @click="scrollDown()"
          >
            <icons size="12" icon="down-arrow" />
            <p class="message-text-medium">Scroll to bottom</p>
          </div>
        </transition>
        <div
          v-if="replyMessage"
          class="scroll-button"
          style="overflow-wrap: break-word; z-index: 2; position: relative"
        >
          <icons size="12" icon="right" style="margin-right: 4px" />
          <profile-picture
            size="12"
            :avatar="replyMessage.user?.avatar"
            :small="true"
            @click="openUser(replyMessage.user.id)"
          />
          <b
            class="message-text-medium"
            style="margin: 0 4px 0 4px"
            @click="openUser(replyMessage.user.id)"
          >
            {{
              replyMessage.user?.username
                ? "@" + replyMessage.user?.username
                : "@Deleted user"
            }}
          </b>
          <p
            class="message-text-medium-gray"
            style="margin: 0"
            @click="goToMessage(replyMessage.id)"
          >
            {{ replyMessage.messageContents }}
          </p>
        </div>
      </div>
    </transition>
    <div class="message-send">
      <emoji-input
        id="input"
        v-model="inputText"
        v-model:show-emoji="showEmojiSelector"
        :disabled="inputDisabled"
        :placeholder="
          inputDisabled
            ? requiresEncryption
              ? encryptionRequirement
              : 'This chat requires email address verification'
            : 'Send a message'
        "
        :on-up-before="onUpBefore"
        :on-up-after="onUpAfter"
        @save="sendMessage()"
      />
      <button
        :disabled="inputDisabled"
        style="width: 40px"
        @click="showEmojiPicker"
      >
        <icons
          icon="emoji"
          size="24"
          :colour="inputDisabled ? 'grey' : undefined"
        />
      </button>
      <button
        :disabled="inputDisabled"
        style="width: 40px"
        @click="sendMessage"
      >
        <icons
          icon="send"
          size="24"
          :colour="inputDisabled ? 'grey' : undefined"
        />
      </button>
      <emoji-picker
        v-if="emojiPickerVisible"
        @emoji-selected="handleEmojiSelected"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Icons from "./core/Icons.vue"
import EmojiPicker from "./EmojiPicker.vue"
import ProfilePicture from "./ProfilePicture.vue"
import EmojiInput from "./EmojiInput.vue"

import { Message } from "@/types/message"

defineProps<{
  inputDisabled: boolean
  requiresEncryption: boolean
  encryptionRequirement: string
  emojiPickerVisible: boolean
  scrolledUp: boolean
  replyMessage: Message | undefined
  sendMessage: () => void
  onUpBefore?: (event: KeyboardEvent) => boolean
  onUpAfter?: (event: KeyboardEvent) => void
  showEmojiPicker: () => void
  handleEmojiSelected: (emoji: string) => void
  scrollDown: (override?: boolean) => void
  openUser: (userId: number) => void
  goToMessage: (messageId: number) => void
}>()

const inputText = defineModel<string>()
const showEmojiSelector = defineModel<boolean>("showEmojiSelector")
</script>
