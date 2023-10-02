<template>
  <div>
    <span
      v-for="(part, index) in messageParts"
      :key="index"
      @click="handleClick(part)"
    >
      <span v-if="check(index)" v-html="part"></span>
      <span v-markdown v-if="!check(index)">{{ part }}</span>
    </span>
    <b class="message-text-small" v-if="message.edited">(edited)</b>
    <embeds
      v-for="(embed, index) in message.embeds"
      :key="index"
      :embed="embed"
      :scroll="scroll"
    ></embeds>
  </div>
</template>

<script setup>
import Embeds from "@/components/Embeds.vue"
import { computed } from "vue"

const props = defineProps(["message", "handleClick", "scroll", "findUser"])

const check = (index) => {
  const parts = props.message.messageContents
    .split(/(<@\d+>)/g)
    .filter((part) => part !== "")
  if (parts[index].startsWith("<@")) {
    return true
  }
}
const messageParts = computed(() => {
  const parts = props.message.messageContents
    .split(/(<@\d+>)/g)
    .filter((part) => part !== "")
  return parts.map((part) => {
    if (part.startsWith("<@")) {
      const userId = part.match(/\d+/)[0]
      return `<span @click="handleUserMentionClick(${userId})" class="mention">@${
        props.findUser(userId).username
      }</span>`
    }
    return part
  })
})
</script>
