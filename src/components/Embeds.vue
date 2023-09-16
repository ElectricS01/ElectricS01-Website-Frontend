<template>
  <div v-if="embed.type === 'image'">
    <img
      :src="embed.mediaProxyLink"
      class="embed"
      alt="Embedded image"
      @load="scroll ? scroll() : ''"
    />
  </div>
</template>

<script>
export default {
  name: "Embeds",
  props: ["embed", "scroll"]
}
</script>

<style scoped>
.embed {
  border-radius: 2px;
}
</style>
