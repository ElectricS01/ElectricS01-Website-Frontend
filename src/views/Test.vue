<template>
  <div class="topnav" id="mobile-topnav">
    <router-link to="/test">Better Test</router-link>
    <router-link class="right" to="/">Home</router-link>
  </div>
  <div style="text-align: left; padding-left: 16px; padding-top: 16px ">
    <div v-for="message in messages" :key="message.id">
      <b class="message_text_large">
        {{ message.userName }} {{ message.createdAt }}
        <br />
        {{ message.messageContents }}
      </b>
    </div>
  </div>
  <div class="messagesend" style="text-align: center">
    <div>
      <input id="nameField" class="responder" v-model="imputUser" type="text"/>
      <br/>
      <input id="nameField" class="responder" v-model="imputText" type="text"/>
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
