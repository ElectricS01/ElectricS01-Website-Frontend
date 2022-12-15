<template>
  <div style="text-align: center">
    <p>Better Test</p>
    <div v-for="message in messages" :key="message.id">
      <p>
        {{ message.userName }} {{ message.createdAt }}
        <br />
        {{ message.messageContents }}
      </p>
    </div>
    <div>
      <input v-model="imputUser" />
      <br />
      <input v-model="imputText" />
      <br />
      <button @click="submit">Submit</button>
      <br />
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      imputUser: "",
      imputText: "",
      error: ""
    }
  },
  methods: {
    getMessages() {
      this.axios.get("/api/messages").then((res) => {
        this.messages = res.data
      })
    },
    submit() {
      this.error = ""
      this.axios
        .post("/api/message", {
          userName: this.imputUser,
          messageContents: this.imputText
        })
        .then(() => {
          this.getMessages()
          this.imputUser = ""
          this.imputText = ""
        })
        .catch((e) => {
          this.error = e.response.data.message
        })
    }
  },
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/mainicon.ico"

    this.getMessages()
  }
}
</script>
