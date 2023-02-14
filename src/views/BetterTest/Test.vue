<template>
  <div class="topnav" id="mobile-topnav">
    <router-link to="/test">Better Test</router-link>
    <router-link v-if="loggedIn" class="right" to="/account"
      >Account</router-link
    >
    <router-link v-else class="right" to="/login">Login</router-link>
    <router-link class="right" to="/">Home</router-link>
  </div>
  <div style="text-align: left; padding-left: 16px; padding-top: 16px">
    <div class="center">
      <div
        style="text-align: center"
        v-if="loadingMessages"
        class="loader"
      ></div>
    </div>
    <div
      v-for="(message, index) in messages"
      :key="message.id"
      :id="'message-' + index"
    >
      <b class="message-text-large">
        {{ message.messageContents }}
      </b>
      <Embed
        v-for="(embed, index) in message.embeds"
        :key="index"
        :embed="embed"
      ></Embed>
      <br />
      <b class="message-text-small">
        {{ message.user?.username }} {{ dayjs(message.createdAt) }}
      </b>
    </div>
  </div>
  <div class="message-send" style="text-align: center">
    <div>
      <input
        autofocus
        @keydown.enter="submit"
        class="responder"
        v-model="inputText"
        type="text"
      />
      <br />
      <button @click="submit">Send</button>
      <br />
      <div class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs"
import Embed from "@/components/Embed.vue"
export default {
  components: { Embed },
  data() {
    return {
      messages: [],
      inputText: "",
      error: "",
      loggedIn: false,
      loadingMessages: true
    }
  },
  methods: {
    async getMessages() {
      await this.axios
        .get("/api/messages")
        .then((res) => {
          this.messages = res.data
          this.loadingMessages = false
        })
        .catch(() => {
          this.error = "Error 503 Cannot Connect to Server"
        })
    },
    submit() {
      this.error = ""
      this.axios
        .post("/api/message", {
          messageContents: this.inputText
        })
        .then(() => {
          this.getMessages()
          this.inputText = ""
        })
        .catch((e) => {
          this.error = e.response.data.message
        })
    },
    dayjs(date) {
      return dayjs(date).format("HH:mm:ss DD/MM/YYYY")
    },
    user() {
      this.axios.get("/api/user").then((res) => {
        this.loggedIn = res.data
      })
    },
    async scroll() {
      try {
        const lastIndex = this.messages.length - 1
        const lastMessage = document.querySelector(`#message-${lastIndex}`)
        lastMessage.scrollIntoView()
        this.autoScrollRetry = 0
      } catch (e) {
        console.log(e)
      }
    }
  },
  async mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/mainicon.ico"

    await this.getMessages()
    this.user()
    await this.scroll()
  }
}
</script>
