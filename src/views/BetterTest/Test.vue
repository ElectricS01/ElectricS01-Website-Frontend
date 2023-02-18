<template>
  <modal :is-active="profileShown" @close="profileShown = false">
    <div class="message-grid">
      <Icons
        @click="openUser"
        class="message-item"
        color="white"
        width="64"
        height="64"
        icon="account"
      />
      <div class="message-item">
        <h4>Username</h4>
        <p>User description</p>
      </div>
    </div>
  </modal>
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
      class="message-grid"
    >
      <Icons
        @click="openUser"
        class="message-item"
        color="white"
        width="32"
        height="32"
        icon="account"
      />
      <div class="message-item">
        <b class="message-text-large">
          {{ message.messageContents }}
        </b>
        <Embed
          v-for="(embed, index) in message.embeds"
          :key="index"
          :embed="embed"
        ></Embed>
        <b class="message-text-small">
          {{ message.user?.username }} {{ dayjs(message.createdAt) }}
        </b>
      </div>
    </div>
  </div>
  <div>
    <transition>
      <button v-if="scrolledUp" class="scroll-button" @click="scroll">
        <Icons color="white" width="12" height="12" icon="down-arrow" />Scroll
        to bottom
      </button>
    </transition>
    <div class="message-send" style="text-align: center">
      <div>
        <input
          autofocus
          @keydown.enter="submit"
          class="responder"
          v-model="inputText"
          type="text"
        />
        <button @click="submit">Send</button>
        <br />
        <div class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs"
import Embed from "@/components/Embed.vue"
import Icons from "@/components/Icons.vue"
import Modal from "@/components/Modal.vue"
;``
export default {
  components: { Icons, Embed, Modal },
  data() {
    return {
      messages: [],
      inputText: "",
      error: "",
      loggedIn: false,
      profileShown: false,
      loadingMessages: true,
      scrolledUp: false
    }
  },
  methods: {
    async getMessages() {
      await this.axios
        .get("/api/messages")
        .then((res) => {
          this.messages = res.data
          this.loadingMessages = false
          this.scroll()
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
    scroll(override) {
      this.$nextTick(() => {
        try {
          if (!this.scrolledUp || override) {
            const lastIndex = this.messages.length - 1
            const lastMessage = document.querySelector(`#message-${lastIndex}`)
            lastMessage.scrollIntoView()
            this.scrolledUp = false
          }
        } catch (e) {
          console.log(e)
        }
      })
    },
    openUser() {
      this.profileShown = true
    },
    escPressed(event) {
      if (event.key === "Escape") {
        this.scroll(true)
      }
    },
    scrollEvent() {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight

      this.scrolledUp =
        scrollTop + clientHeight <= scrollHeight - clientHeight / 10
    }
  },
  async mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/mainicon.ico"

    document.addEventListener("keydown", this.escPressed)
    document.addEventListener("scroll", this.scrollEvent)

    await this.getMessages()
    this.user()
    this.scroll(true)
  },
  beforeRouteLeave(to, from, next) {
    document.removeEventListener("keydown", this.escPressed)
    document.removeEventListener("scroll", this.scrollEvent)
    next()
  },
  unmounted() {
    document.removeEventListener("keydown", this.escPressed)
    document.removeEventListener("scroll", this.scrollEvent)
  }
}
</script>
