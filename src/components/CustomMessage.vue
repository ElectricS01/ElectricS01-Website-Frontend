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
    <b class="message-text-small" v-if="edited">(edited)</b>
    <embeds
      v-for="(embed, index) in embeds"
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
  props: ["message", "edited", "handleClick", "embeds", "scroll"],
  computed: {
    messageParts() {
      const parts = this.message
        .split(/(<@\d+>)/g)
        .filter((part) => part !== "")
      console.log(parts)
      return parts.map((part) => {
        if (part.startsWith("<@")) {
          const userId = part.match(/\d+/)[0]
          return `<span @click="handleUserMentionClick(${userId})" class="mention">@${userId}</span>`
        }
        return part
      })
    }
  },
  methods: {
    check(index) {
      const parts = this.message
        .split(/(<@\d+>)/g)
        .filter((part) => part !== "")
      if (parts[index].startsWith("<@")) {
        console.log("4321" + parts[index])
        return true
      }
    }
  }
}
</script>
