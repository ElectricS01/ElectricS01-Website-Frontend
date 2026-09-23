<template>
  <div v-if="showEmoji && matchingEmoji.length" class="emoji-picker">
    <div class="emoji-picker-inner scroll-bar">
      <div
        v-for="(emoji, index) in matchingEmoji"
        :id="'picker-' + index"
        :key="emoji[0]"
        :class="{ selected: index === emojiPickerIndex }"
        @click="handleEmojiClick(emoji[0])"
      >
        <span>
          {{ emoji[0] }}
          {{ emoji[1][0] }}
        </span>
      </div>
    </div>
  </div>
  <div v-else-if="showEmoji && matchingUsers.length" class="emoji-picker">
    <div class="emoji-picker-inner scroll-bar">
      <div
        v-for="(user, index) in matchingUsers"
        :id="'picker-' + index"
        :key="user.username"
        :class="{ selected: index === emojiPickerIndex }"
        @click="handleUserClick(user.id)"
      >
        <profile-picture :avatar="user.avatar" size="16" />
        <span>
          {{ user.username }}
        </span>
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
      (matchingEmoji.length > 0 || matchingUsers.length > 0) && showEmoji
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
import { User } from "@/types/user"
import { ref, watch } from "vue"
import ProfilePicture from "./ProfilePicture.vue"

const inputText = defineModel<string>({
  default: ""
})
const showEmoji = defineModel<boolean>("showEmoji")

const props = defineProps<{
  id: string
  placeholder: string
  disabled?: boolean
  users: User[]
  onUpBefore?: (event: KeyboardEvent) => boolean
  onUpAfter?: (event: KeyboardEvent) => void
}>()

const emit = defineEmits<{
  save: []
}>()

const emojiPickerIndex = ref(0)
const matchingEmoji = ref<[string, string[]][]>([])
const matchingUsers = ref<User[]>([])

watch(inputText, () => {
  showEmoji.value = true
  emojiPickerIndex.value = 0
  scrollToSelected()

  const emojiText = getEmojiText()
  if (emojiText === null) {
    matchingEmoji.value = []
    const mentionText = getMentionText()
    if (mentionText === null) {
      matchingUsers.value = []
      showEmoji.value = false
      return
    }

    matchingUsers.value =
      props.users
        ?.filter(({ username }) => username.toLowerCase().includes(mentionText))
        ?.slice(0, 30) ?? []

    return
  }

  matchingEmoji.value = normalizedEmoji
    .filter(([, descriptions]) =>
      descriptions.some((e) => e.includes(emojiText))
    )
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

const getMentionText = () => {
  const lastAt = inputText.value.lastIndexOf("@")
  if (lastAt === -1 || (lastAt !== 0 && inputText.value[lastAt - 1] !== " "))
    return null

  return inputText.value.substring(lastAt + 1).toLowerCase()
}

const handleEmojiClick = (emoji: string) => {
  const lastColon = inputText.value.lastIndexOf(":")
  if (lastColon !== -1) {
    inputText.value = `${inputText.value.substring(0, lastColon) + emoji} `
  }
  emojiPickerIndex.value = 0
}

const handleUserClick = (userId: number) => {
  const lastAt = inputText.value.lastIndexOf("@")
  if (lastAt !== -1) {
    inputText.value = `${inputText.value.substring(0, lastAt)}<@${userId}> `
  }
  emojiPickerIndex.value = 0
}

const selectCurrentEmoji = (event: KeyboardEvent) => {
  if (showEmoji.value && matchingEmoji.value.length > emojiPickerIndex.value) {
    event.preventDefault()
    handleEmojiClick(matchingEmoji.value[emojiPickerIndex.value][0])
  } else if (
    showEmoji.value &&
    matchingUsers.value.length > emojiPickerIndex.value
  ) {
    event.preventDefault()
    handleUserClick(matchingUsers.value[emojiPickerIndex.value].id)
  }
}

const scrollToSelected = () => {
  const selected = document.getElementById(`picker-${emojiPickerIndex.value}`)
  selected?.scrollIntoView({
    block: "nearest",
    inline: "nearest"
  })
}

const handleUpKey = (event: KeyboardEvent) => {
  if (props.onUpBefore?.(event)) return

  if (
    showEmoji.value &&
    (matchingEmoji.value.length > 0 || matchingUsers.value.length > 0)
  ) {
    event.preventDefault()
    emojiPickerIndex.value = Math.max(0, emojiPickerIndex.value - 1)
    scrollToSelected()
    return
  }

  props.onUpAfter?.(event)
}

const handleDownKey = (event: KeyboardEvent) => {
  const length = matchingEmoji.value.length || matchingUsers.value.length
  if (showEmoji.value && length > 0) {
    event.preventDefault()
    emojiPickerIndex.value = Math.min(length - 1, emojiPickerIndex.value + 1)
    scrollToSelected()
  }
}
</script>
