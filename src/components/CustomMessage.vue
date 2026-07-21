<template>
  <div :class="{ deleted: props.message.deleted }">
    <template v-for="part in messageParts" :key="part.key">
      <span
        v-if="part.type === 'mention'"
        class="mention"
        @click.stop="openUser(part.userId)"
      >
        @{{ part.username }}
      </span>
      <br v-else-if="part.type === 'newline'" />
      <span v-else v-markdown class="custom-message">
        {{ part.value }}
      </span>
    </template>
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
  openUser: (userId: number) => void
  message: Message
  scroll: () => void
}>()

const emit = defineEmits<{
  embed: [string]
}>()

const editShown = ref(false)
let editHover = false
let editShownPosition: Position = { x: 0, y: 0 }

type MessagePart =
  | { key: string; type: "mention"; userId: number; username: string }
  | { key: string; type: "newline" }
  | { key: string; type: "text"; value: string }

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

const messageParts = computed<MessagePart[]>(() => {
  return props.message.messageContents
    .split(/(\n|<@\d+>)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("<@")) {
        const matches = part.match(/\d+/)
        if (
          !matches ||
          matches.length !== 1 ||
          Number.isNaN(Number(matches[0]))
        ) {
          return { key: `text-${index}-${part}`, type: "text", value: part }
        }
        const user = props.findUser(Number(matches[0]))

        return {
          key: `mention-${index}-${matches[0]}-${user?.username ?? "unknown"}`,
          type: "mention",
          userId: Number(matches[0]),
          username: user?.username ?? "unknown"
        }
      }

      if (part === "\n") {
        return { key: `newline-${index}`, type: "newline" }
      }

      return { key: `text-${index}-${part}`, type: "text", value: part }
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
