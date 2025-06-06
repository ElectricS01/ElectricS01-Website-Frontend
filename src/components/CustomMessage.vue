<template>
  <div>
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
      @mouseleave=";(editShown = false), (editHover = false)"
    >
      (edited)
    </b>
    <transition>
      <text-context
        v-if="editShown"
        :position="editShownPosition"
        :text="store.dayjsLong(message.updatedAt)"
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

<script setup>
import Embeds from "@/components/Embeds.vue"
import { computed, ref } from "vue"
import { useDataStore } from "@/store"
import TextContext from "@/components/core/TextContext.vue"

const store = useDataStore()
const props = defineProps({
  findUser: Function,
  handleClick: Function,
  message: Object,
  scroll: Function
})
const emit = defineEmits(["embed"])
const editShown = ref(false)
let editHover = false
let editShownPosition = { x: 0, y: 0 }

const check = (index) => {
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
        .getBoundingClientRect()
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
      const userId = part.match(/\d+/)[0]
      return `<span @click="handleUserMentionClick(${userId})" class="mention">@${
        props.findUser(userId).username
      }</span>`
    } else if (part === "\n") {
      return "<br />"
    }
    return part
  })
})
</script>

<style>
.custom-message {
  ul,
  ol {
    padding: 0;
    margin: 4px 0 4px 16px;
  }
}
</style>
