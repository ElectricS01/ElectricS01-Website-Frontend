<template>
  <div v-if="showEmoji && matchingEmoji.length" class="emoji-picker">
    <div class="emoji-picker-inner scroll-bar">
      <div
        v-for="(emoji, index) in matchingEmoji"
        :id="'picker-emoji-' + index"
        :key="emoji[0]"
        :class="{ selected: index === emojiPickerIndex }"
        @click="handleEmojiClick(emoji[0])"
      >
        {{ emoji[0] }}
        {{ emoji[1][0] }}
      </div>
    </div>
  </div>
  <textarea
    :id="id"
    v-model="inputText"
    autocomplete="off"
    autofocus
    class="message-input"
    :disabled="disabled"
    :placeholder="placeholder"
    @keydown.enter.exact.prevent="
      matchingEmoji.length > 0 && showEmoji
        ? selectCurrentEmoji($event)
        : emit('save')
    "
    @keydown.up="handleUpKey"
    @keydown.down="handleDownKey"
    @keydown.tab="selectCurrentEmoji"
  />
</template>

<script setup lang="ts">
import { normalizedEmoji } from "@/helpers/emoji"
import { ref, watch } from "vue"

const inputText = defineModel<string>({
  default: ""
})
const showEmoji = defineModel<boolean>("showEmoji")

const props = defineProps<{
  id: string
  placeholder: string
  disabled?: boolean
  onUpBefore?: (event: KeyboardEvent) => boolean
  onUpAfter?: (event: KeyboardEvent) => void
}>()

const emit = defineEmits<{
  save: []
}>()

const emojiPickerIndex = ref(0)
const matchingEmoji = ref<[string, string[]][]>([])

watch(inputText, () => {
  showEmoji.value = true
  emojiPickerIndex.value = 0
  scrollToSelected()

  const text = getEmojiText()
  if (text === null) {
    matchingEmoji.value = []
    showEmoji.value = false
    return
  }

  matchingEmoji.value = normalizedEmoji
    .filter(([, descriptions]) => descriptions.some((e) => e.includes(text)))
    .slice(0, 30)
  if (matchingEmoji.value.length === 0) showEmoji.value = false
})

const getEmojiText = () => {
  const lastColon = inputText.value.lastIndexOf(":")
  if (
    lastColon === -1 ||
    (lastColon !== 0 && inputText.value[lastColon - 1] !== " ")
  )
    return null

  return inputText.value.substring(lastColon + 1).toLowerCase()
}

const handleEmojiClick = (emoji: string) => {
  const lastColon = inputText.value.lastIndexOf(":")
  if (lastColon !== -1) {
    inputText.value = `${inputText.value.substring(0, lastColon) + emoji} `
  }
  emojiPickerIndex.value = 0
}

const selectCurrentEmoji = (event: KeyboardEvent) => {
  if (showEmoji.value && matchingEmoji.value.length > emojiPickerIndex.value) {
    event.preventDefault()
    handleEmojiClick(matchingEmoji.value[emojiPickerIndex.value][0])
  }
}

const scrollToSelected = () => {
  const selected = document.getElementById(
    `picker-emoji-${emojiPickerIndex.value}`
  )
  selected?.scrollIntoView({
    block: "nearest",
    inline: "nearest"
  })
}

const handleUpKey = (event: KeyboardEvent) => {
  if (props.onUpBefore?.(event)) return

  if (showEmoji.value && matchingEmoji.value.length > 0) {
    event.preventDefault()
    emojiPickerIndex.value = Math.max(0, emojiPickerIndex.value - 1)
    scrollToSelected()
    return
  }

  props.onUpAfter?.(event)
}

const handleDownKey = (event: KeyboardEvent) => {
  if (showEmoji.value && matchingEmoji.value.length > 0) {
    event.preventDefault()
    emojiPickerIndex.value = Math.min(
      matchingEmoji.value.length - 1,
      emojiPickerIndex.value + 1
    )
    scrollToSelected()
  }
}
</script>
