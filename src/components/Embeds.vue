<template>
  <div v-if="embed.type === 'image'">
    <img :src="embed.mediaProxyLink" class="embed" />
  </div>
</template>

<script>
export default {
  name: "Embeds",
  props: ["embed"]
}
</script>

<style>
img {
  border-radius: 8px;
}
</style>
