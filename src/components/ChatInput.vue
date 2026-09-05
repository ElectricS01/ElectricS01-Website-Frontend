<template>
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
      @keydown.escape.prevent="emit('override')"
    />
    <button
      :disabled="inputDisabled"
      style="cursor: pointer; width: 40px"
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
      style="cursor: pointer; width: 40px"
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
</template>

<script setup lang="ts">
import Icons from "./core/Icons.vue"
import EmojiPicker from "./EmojiPicker.vue"

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
  matchingEmoji: [string, string[]][]
  selectCurrentEmoji: () => void
  sendMessage: () => void
  handleUpKey: () => void
  handleDownKey: () => void
  showEmojiPicker: () => void
  handleEmojiSelected: (emoji: string) => void
  handleEmojiClick: (emoji: string) => void
}>()

const emit = defineEmits<{
  override: []
}>()

const inputText = defineModel<string>()
</script>
