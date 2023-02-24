<template>
  <div v-if="embed.type === 'image'">
    <img
      :src="embed.mediaProxyLink"
      style="max-width: 400px; max-height: 300px"
    />
  </div>
</template>

<script>
export default {
  name: "Embeds",
  props: ["embed"]
}
</script>
