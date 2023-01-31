<template>
  <div class="topnav" id="mobile-topnav">
    <router-link to="/test">Better Test</router-link>
    <router-link class="right" to="/">Home</router-link>
  </div>
  <div style="text-align: left; padding-left: 16px; padding-top: 16px ">
    <div v-for="message in messages" :key="message.id">
      <b class="message_text_large">
        {{message.messageContents }}
      </b>
      <br/>
      <b class="message_text_small">
        {{message.userName }} {{ dayjs(message.createdAt) }}
      </b>
    </div>
  </div>
  <div class="messagesend" style="text-align: center">
    <div>
      <input @keydown.enter="submit" id="nameField" class="responder" v-model="imputUser" type="text"/>
      <br/>
      <input @keydown.enter="submit" id="nameField" class="responder" v-model="imputText" type="text"/>
      <br />
      <button @click="submit">Submit</button>
      <br />
      {{ error }}
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
