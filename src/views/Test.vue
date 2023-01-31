<template>
  <div class="topnav" id="mobile-topnav">
    <router-link to="/test">Better Test</router-link>
    <router-link class="right" to="/">Home</router-link>
  </div>
  <div style="text-align: left; padding-left: 16px; padding-top: 16px ">
    <div v-for="message in messages" :key="message.id">
      <b class="message-text-large">
        {{message.messageContents }}
      </b>
      <br />
      <b class="message-text-small">
        {{message.userName }} {{ dayjs(message.createdAt) }}
      </b>
    </div>
  </div>
  <div class="message-send" style="text-align: center">
    <div>
      <input @keydown.enter="submit" id="nameField" class="responder" v-model="imputUser" type="text"/>
      <br />
      <input @keydown.enter="submit" id="nameField" class="responder" v-model="imputText" type="text"/>
      <br />
      <button @click="submit">Submit</button>
      <br />
      <div class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
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
      }).catch(() => {
        this.error = 'Error 503 Cannot Connect to Server'
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
    },
    dayjs(date) {
      return dayjs(date).format('HH:mm:ss DD/MM/YYYY')
    }
  },
  mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/mainicon.ico"

    this.getMessages()
  }
}
</script>
