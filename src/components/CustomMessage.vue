<template>
  <div :class="{ deleted: props.message.deleted }">
    <span
      v-for="(part, index) in messageParts"
      :key="part"
      @click="handleClick(part)"
    >
      <span v-if="check(index)" v-html="part" />
      <span v-if="!check(index)" v-markdown class="custom-message">
        {{ part }}
      </span>
    </span>
    <b
      v-if="message.edited"
      :id="'edit-' + message.id"
      class="message-text-small"
      @mouseover="showEdited()"
      @mouseleave=";((editShown = false), (editHover = false))"
    >
      (edited)
    </b>
    <transition>
      <text-context
        v-if="editShown"
        :position="editShownPosition"
        :text="dayjsLong(message.updatedAt)"
      />
    </transition>
    <embeds
      v-for="(embed, index) in message.embeds"
      :key="index"
      :embed="embed"
      :scroll="scroll"
      @embed="emit('embed', embed.mediaProxyLink)"
    />
  </div>
</template>

<script setup lang="ts">
import Embeds from "@/components/Embeds.vue"
import { computed, ref } from "vue"
import TextContext from "@/components/core/TextContext.vue"
import { dayjsLong } from "@/helpers/dates"
import { Message } from "@/types/message"
import { User } from "@/types/user"
import { Position } from "@/types/position"

const props = defineProps<{
  findUser: (userId: number) => User
  handleClick: (part: string) => void
  message: Message
  scroll: () => void
}>()

const emit = defineEmits<{
  embed: [string]
}>()

const editShown = ref(false)
let editHover = false
let editShownPosition: Position = { x: 0, y: 0 }

const check = (index: number) => {
  const parts = props.message.messageContents
    .split(/(\n|<@\d+>)/g)
    .filter((part) => part !== "")
  if (parts[index].startsWith("<@") || parts[index] === "\n") {
    return true
  }
}
const showEdited = () => {
  editHover = true
  setTimeout(() => {
    if (editHover) {
      const editMessage = document
        .getElementById(`edit-${props.message.id}`)
        ?.getBoundingClientRect()

      if (!editMessage) return

      editShownPosition = {
        x: editMessage.x + editMessage.width / 2,
        y: editMessage.y
      }
      editShown.value = true
    }
  }, 500)
}

const messageParts = computed(() => {
  const parts = props.message.messageContents
    .split(/(\n|<@\d+>)/g)
    .filter((part) => part !== "")
  return parts.map((part) => {
    if (part.startsWith("<@")) {
      const matches = part.match(/\d+/)
      if (
        !matches ||
        matches.length !== 1 ||
        Number.isNaN(Number(matches[0]))
      ) {
        return part
      }

      const user = props.findUser(Number(matches[0]))
      return `<span @click="handleUserMentionClick(${matches[0]})" class="mention">@${
        user?.username ?? "unknown"
      }</span>`
    } else if (part === "\n") {
      return "<br />"
    }
    return part
  })
})
</script>

<style>
.deleted {
  color: grey;
}

.custom-message {
  ul,
  ol {
    padding: 0;
    margin: 4px 0 4px 16px;
  }
}
</style>
