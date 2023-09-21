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

<script>
import Embeds from "@/components/Embeds.vue"

export default {
  name: "CustomMessage",
  components: { Embeds },
  props: ["message", "handleClick", "scroll", "findUser"],
  computed: {
    messageParts() {
      const parts = this.message.messageContents
        .split(/(<@\d+>)/g)
        .filter((part) => part !== "")
      return parts.map((part) => {
        if (part.startsWith("<@")) {
          const userId = part.match(/\d+/)[0]
          return `<span @click="handleUserMentionClick(${userId})" class="mention">@${
            this.findUser(userId).username
          }</span>`
        }
        return part
      })
    }
  },
  methods: {
    check(index) {
      const parts = this.message.messageContents
        .split(/(<@\d+>)/g)
        .filter((part) => part !== "")
      if (parts[index].startsWith("<@")) {
        return true
      }
    }
  }
}
</script>
