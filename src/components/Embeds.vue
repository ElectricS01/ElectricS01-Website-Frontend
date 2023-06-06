<template>
  <div v-if="embed.type === 'image'">
    <img
      :src="embed.mediaProxyLink"
      class="embed"
      alt="embedded image"
      @load="scroll()"
    />
  </div>
</template>

<script>
export default {
  name: "Embeds",
  props: ["embed", "scroll"]
}
</script>

<style>
embed {
  border-radius: 8px;
}
</style>
