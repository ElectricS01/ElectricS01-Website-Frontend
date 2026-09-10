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
      <div
        v-if="matchingEmoji.length && !emojiPickerVisible"
        class="emoji-picker"
      >
        <div class="emoji-picker-inner scroll-bar">
          <div
            v-for="(emoji, index) in matchingEmoji"
            :id="'picker-emoji-' + index"
            :key="emoji[0]"
            :class="{ selected: index == emojiPickerIndex }"
            @click="handleEmojiClick(emoji[0])"
          >
            {{ emoji[0] }}
            {{ emoji[1][0] }}
          </div>
        </div>
      </div>
      <textarea
        id="input"
        v-model="inputText"
        :disabled="inputDisabled"
        :placeholder="
          inputDisabled
            ? requiresEncryption
              ? encryptionRequirement
              : 'This chat requires email address verification'
            : 'Send a message'
        "
        autofocus
        class="message-input"
        autocomplete="off"
        @keydown.enter.exact.prevent="
          matchingEmoji.length > 0 ? selectCurrentEmoji() : sendMessage()
        "
        @keydown.up.prevent="handleUpKey"
        @keydown.down.prevent="handleDownKey"
        @keydown.tab.prevent="
          matchingEmoji.length > 0 ? selectCurrentEmoji() : null
        "
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
import { Message } from "@/types/message"
import ProfilePicture from "./ProfilePicture.vue"

const {
  inputDisabled,
  requiresEncryption,
  encryptionRequirement,
  emojiPickerVisible,
  emojiPickerIndex,
  matchingEmoji,
  selectCurrentEmoji,
  sendMessage,
  handleUpKey,
  handleDownKey,
  showEmojiPicker,
  handleEmojiSelected,
  handleEmojiClick
} = defineProps<{
  inputDisabled: boolean
  requiresEncryption: boolean
  encryptionRequirement: string
  emojiPickerVisible: boolean
  emojiPickerIndex: number
  scrolledUp: boolean
  replyMessage: Message | undefined
  matchingEmoji: [string, string[]][]
  selectCurrentEmoji: () => void
  sendMessage: () => void
  handleUpKey: (event: KeyboardEvent) => void
  handleDownKey: () => void
  showEmojiPicker: () => void
  handleEmojiSelected: (emoji: string) => void
  handleEmojiClick: (emoji: string) => void
  scrollDown: (override?: boolean) => void
  openUser: (userId: number) => void
  goToMessage: (messageId: number) => void
}>()

const inputText = defineModel<string>()
</script>
