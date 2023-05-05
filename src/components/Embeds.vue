<template>
  <div v-if="embed.type === 'image'">
    <img :src="embed.mediaProxyLink" class="embed" alt="embedded image" />
  </div>
</template>

<script>
export default {
  name: "Embeds",
  props: ["embed"]
}
</script>

<style>
embed {
  border-radius: 8px;
}
</style>
