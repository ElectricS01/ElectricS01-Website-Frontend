<template>
  <transition>
    <modal
      v-if="profileShown"
      :is-active="profileShown"
      @close=";(profileShown = false), (editing = false)"
    >
      <img
        :src="showUser.banner || 'https://i.troplo.com/i/d81dabf74c88.png'"
        width="500"
        height="100"
        style="object-fit: cover"
        alt="Profile banner"
      />
      <div class="profile-grid" style="padding: 24px; width: 452px">
        <div class="profile-picture" style="margin-right: 16px; height: 80px">
          <Icons
            v-if="!showUser.avatar"
            class="message-item"
            color="white"
            width="80"
            height="80"
            icon="account"
            style="margin: 0"
          />
          <img
            style="border-radius: 40px; object-fit: cover; margin: 0"
            class="message-item"
            width="80"
            height="80"
            v-else
            :src="showUser.avatar"
            alt="Profile icon"
          />
          <svg class="online-indicator" width="20" height="20">
            <circle cx="8" cy="8" r="8" fill="#47bf4c" />
          </svg>
        </div>
        <div
          style="flex-grow: 1; flex-basis: 0; margin: 0"
          class="message-item"
        >
          <h4>{{ showUser.username }}</h4>
          <div v-if="editing !== 'status'" style="display: flex">
            <p
              class="message-text-large"
              style="margin: 0; word-wrap: break-word"
            >
              {{ showUser.statusMessage }}
            </p>
            <Icons
              v-if="showUser.id === loggedIn.id"
              style="cursor: pointer"
              class="message-item"
              color="white"
              width="16"
              height="16"
              icon="edit"
              @click="
                ;(editing = 'status'),
                  (editStatus = showUser.statusMessage),
                  editFocus()
              "
            />
          </div>
          <input
            v-else
            placeholder="Edit your status"
            @keydown.enter="editStatusMessage()"
            class="responder"
            v-model="editStatus"
            type="text"
            style="width: 100%; margin: 0"
            id="status"
          />
        </div>
        <div>
          <button
            v-if="showUser.directMessages && showUser.id !== loggedIn.id"
            class="profile-button-message"
            style="width: 100%"
          >
            <Icons
              style="top: 0; padding-right: 4px"
              color="#1e90ff"
              width="16"
              height="16"
              icon="message"
            />
            Send Message
          </button>
          <button
            v-if="
              showUser.friendRequests &&
              showUser.id !== loggedIn.id &&
              !showUser.friendStatus
            "
            class="profile-button-add"
            style="color: #47bf4c; width: 100%"
            @click="addFriend(showUser.id)"
          >
            <Icons
              style="top: 0; padding-right: 4px"
              color="#47bf4c"
              width="16"
              height="16"
              icon="add-user"
            />
            Add Friend
          </button>
          <button
            v-if="
              showUser.id !== loggedIn.id &&
              showUser.friendStatus === 'accepted'
            "
            class="profile-button-remove"
            style="color: #ff2f2f; width: 100%"
            @click="addFriend(showUser.id)"
          >
            <Icons
              style="top: 0; padding-right: 4px"
              color="#FF2F2F"
              width="16"
              height="16"
              icon="remove-user"
            />
            Remove Friend
          </button>
          <button
            v-if="
              showUser.friendRequests && showUser.friendStatus === 'pending'
            "
            class="profile-button-pending"
            style="color: #808080; width: 100%"
            @click="addFriend(showUser.id)"
          >
            <Icons
              style="top: 0; padding-right: 4px"
              color="#808080"
              width="16"
              height="16"
              icon="remove-user"
            />
            Pending
          </button>
          <button
            v-if="
              showUser.id !== loggedIn.id &&
              showUser.friendStatus === 'incoming'
            "
            class="profile-button-pending"
            style="color: #47bf4c; width: 100%"
            @click="addFriend(showUser.id)"
          >
            <Icons
              style="top: 0; padding-right: 4px"
              color="#47bf4c"
              width="16"
              height="16"
              icon="add-user"
            />
            Accept Friend
          </button>
        </div>
      </div>
      <div style="padding: 24px">
        <p>Description</p>
        <p class="message-text-large" style="margin: 0">
          {{ showUser.description || `Hi, I'm ${showUser.username}!` }}
        </p>
      </div>
    </modal>
  </transition>
  <div class="chat-navbar">
    <router-link to="/test">Better Test</router-link>
    <router-link v-if="loggedIn" class="right" to="/account">
      Account
    </router-link>
    <router-link v-else class="right" to="/login">Login</router-link>
    <router-link class="right" to="/">Home</router-link>
    <a
      v-if="users.length > 2"
      @click="toggleSidebar"
      class="right"
      style="cursor: grab; width: 28px; height: 28px; padding: 10px"
    >
      <Icons color="white" width="28" height="28" icon="account" />
    </a>
  </div>
  <transition>
    <p v-if="error" class="error-button">
      {{ error }}
    </p>
  </transition>
  <Sidebar v-if="users.length > 2 && sidebarOpen">
    <div
      v-for="(user, index) in users"
      :key="user.id"
      :id="'user-' + index"
      style="padding: 4px 0 4px 8px; position: relative"
      @mouseover="user.focus = true"
      @mouseleave="user.focus = false"
    >
      <div style="cursor: grab" class="message-grid" @click="openUser(user.id)">
        <div class="profile-picture" style="margin-right: 8px">
          <Icons
            style="margin: 4px"
            v-if="!user.avatar"
            class="message-item"
            color="white"
            width="32"
            height="32"
            icon="account"
          />
          <img
            style="border-radius: 16px; object-fit: cover; margin: 4px"
            class="message-item"
            width="32"
            height="32"
            v-else
            :src="user.avatar"
            alt="Profile icon"
          />
          <svg class="online-indicator" width="15" height="15">
            <circle cx="5" cy="5" r="5" fill="#47bf4c" />
          </svg>
        </div>
        <div style="flex-grow: 1; margin: 0" class="message-item">
          <b
            class="message-text-large"
            style="
              margin-top: 4px;
              margin-bottom: 2px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              width: 178px;
            "
          >
            {{ user.username }}
          </b>
          <p
            class="message-text-medium-gray"
            style="
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              width: 178px;
            "
          >
            {{ user.statusMessage }}
          </p>
        </div>
      </div>
    </div>
  </Sidebar>
  <div :style="{ marginRight: users.length > 2 && sidebarOpen ? '250px' : '' }">
    <div
      style="
        text-align: left;
        padding-left: 4px;
        padding-top: 8px;
        padding-right: 4px;
      "
    >
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
        style="padding: 4px"
        @mouseover="message.focus = true"
        @mouseleave="message.focus = false"
      >
        <div
          style="
            text-align: center;
            position: relative;
            height: 27.5px;
            display: flex;
            justify-content: center;
          "
          v-if="
            dayjsDate(message.createdAt) !==
            dayjsDate(messages[index - 1]?.createdAt)
          "
        >
          <div
            style="
              border-bottom: 1px solid #212425;
              position: absolute;
              top: 0;
              width: 100%;
              height: calc(50% - 3px);
            "
          ></div>
          <p
            style="
              background-color: #181a1b;
              position: absolute;
              height: 20px;
              border-right: 4px solid #181a1b;
              border-left: 4px solid #181a1b;
              margin-top: 6px;
            "
            class="message-text-small"
          >
            {{ dayjsDate(message.createdAt) }}
          </p>
        </div>
        <div
          v-if="message.reply"
          style="
            display: flex;
            overflow-wrap: break-word;
            margin-bottom: 8px;
            margin-left: 28px;
          "
        >
          <Icons
            color="white"
            width="16"
            height="16"
            icon="reply"
            style="margin-right: 4px"
          />
          <Icons
            style="cursor: grab"
            v-if="!findMessage(message.reply).user.avatar"
            @click="openUser(findMessage(message.reply).user.id)"
            color="white"
            width="16"
            height="16"
            icon="account"
          />
          <img
            style="
              border-radius: 16px;
              object-fit: cover;
              cursor: grab;
              margin-top: 2px;
            "
            @click="openUser(findMessage(message.reply).user.id)"
            width="16"
            height="16"
            v-else
            :src="findMessage(message.reply).user.avatar"
            alt="Profile icon"
          />
          <b
            class="message-text-medium"
            @click="openUser(findMessage(message.reply).user.id)"
            style="margin: 4px 4px 0 4px"
          >
            {{ "@" + findMessage(message.reply).user.username }}
          </b>
          <p
            class="message-text-medium-gray-hover"
            @click="goToMessage(findMessage(message.reply))"
            style="margin-top: 4px; margin-bottom: 0"
          >
            {{ findMessage(message.reply).messageContents }}
          </p>
        </div>
        <div
          class="message-grid"
          style="position: relative"
          :style="{ backgroundColor: editing === message.id ? '#212425' : '' }"
        >
          <div v-if="!merge(message, index)">
            <Icons
              style="margin-right: 12px; cursor: grab; margin-left: 4px"
              v-if="!message.user.avatar"
              @click="openUser(message.user?.id)"
              class="message-item"
              color="white"
              width="32"
              height="32"
              icon="account"
            />
            <img
              style="
                border-radius: 16px;
                object-fit: cover;
                margin-right: 12px;
                margin-left: 4px;
                cursor: grab;
              "
              class="message-item"
              @click="openUser(message.user?.id)"
              width="32"
              height="32"
              v-else
              :src="message.user.avatar"
              alt="Profile icon"
            />
          </div>
          <div v-else style="width: 48px">
            <b
              class="message-text-small"
              v-show="message.focus"
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              {{ dayjsShort(message.createdAt) }}
            </b>
          </div>
          <div
            class="message-item"
            style="max-width: calc(100% - 96px); overflow-wrap: break-word"
            :style="{ width: editing === message.id ? '100%' : '' }"
          >
            <div style="line-height: 11.5px" v-if="!merge(message, index)">
              <b
                class="message-text-medium"
                @click="openUser(message.user?.id)"
              >
                {{ message.user?.username }}
              </b>
              <b class="message-text-small">
                {{ " " + dayjs(message.createdAt) }}
              </b>
            </div>
            <div v-if="editing !== message.id">
              <p class="message-text-large">
                {{ message.messageContents }}
                <b class="message-text-small" v-if="message.edited">(edited)</b>
              </p>
              <Embeds
                v-for="(embed, index) in message.embeds"
                :key="index"
                :embed="embed"
              ></Embeds>
            </div>
            <input
              v-else
              placeholder="Edit your message"
              @keydown.enter="editMessage(message.id)"
              class="responder"
              v-model="editText"
              type="text"
              style="width: 100%; margin-left: 0"
              id="edit"
            />
          </div>
          <div
            style="
              position: absolute;
              right: 8px;
              top: 0;
              display: flex;
              align-items: center;
              height: 100%;
            "
            v-show="editing !== message.id && message.focus"
          >
            <Icons
              v-show="message.user.id === loggedIn.id"
              style="cursor: pointer"
              class="message-item"
              color="white"
              width="20"
              height="20"
              icon="edit"
              @click="
                ;(editing = message.id),
                  (editText = message.messageContents),
                  scroll(false),
                  editFocus()
              "
            />
            <Icons
              style="cursor: pointer"
              class="message-item"
              color="white"
              width="20"
              height="20"
              icon="reply"
              @click="replyTo = message.id"
            />
            <Icons
              v-show="loggedIn.admin || message.user.id === loggedIn.id"
              style="cursor: pointer"
              class="message-item"
              color="white"
              width="20"
              height="20"
              icon="delete"
              @click="deleteMessage(message.id)"
            />
          </div>
        </div>
      </div>
    </div>
    <div>
      <transition
        :style="{ marginRight: users.length > 2 && sidebarOpen ? '250px' : '' }"
      >
        <button v-if="scrolledUp" class="scroll-button" @click="scroll">
          <Icons color="white" width="12" height="12" icon="down-arrow" />
          Scroll to bottom
        </button>
      </transition>
      <div
        class="message-send"
        style="text-align: center"
        :style="{ marginRight: users.length > 2 && sidebarOpen ? '250px' : '' }"
      >
        <input
          placeholder="Send a message"
          autofocus
          @keydown.enter="submit"
          @keydown.up.prevent=";(editing = editLast()), scroll(true)"
          class="responder"
          v-model="inputText"
          type="text"
          id="input"
        />
        <button @click="submit" style="cursor: grab">Send</button>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs"
import Embeds from "@/components/Embeds.vue"
import Icons from "@/components/Icons.vue"
import Modal from "@/components/Modal.vue"
import Sidebar from "@/components/Sidebar.vue"

export default {
  components: { Sidebar, Icons, Embeds, Modal },
  data() {
    return {
      messages: [],
      users: [],
      inputText: "",
      replyTo: null,
      editText: "",
      editStatus: "",
      sidebarOpen: false,
      editing: false,
      error: "",
      loggedIn: false,
      profileShown: false,
      loadingMessages: true,
      loadingUsers: true,
      scrolledUp: false,
      showUser: false
    }
  },
  methods: {
    async getMessages() {
      await this.axios
        .get("/api/messages")
        .then((res) => {
          this.messages = res.data
          this.messages.focus = false
          this.loadingMessages = false
          this.scroll()
        })
        .catch(() => {
          this.error = "Error 503 Cannot Connect to Server"
        })
    },
    async getUsers() {
      await this.axios
        .get("/api/users")
        .then((res) => {
          this.users = res.data
          this.loadingUsers = false
        })
        .catch(() => {
          this.error = "Error 503 Cannot Connect to Server"
        })
    },
    submit() {
      if (this.inputText.trim()) {
        this.axios
          .post("/api/message", {
            messageContents: this.inputText,
            reply: this.replyTo
          })
          .then(() => {
            this.inputText = ""
            this.replyTo = null
            this.getMessages()
          })
          .catch((e) => {
            this.error = e.response.data.message
            setTimeout(this.errorFalse, 5000)
          })
      }
    },
    deleteMessage(messageId) {
      this.axios.delete(`/api/delete/${messageId}`).then(() => {
        this.getMessages()
      })
    },
    editMessage(messageId) {
      if (
        this.editText.trim() === this.findMessage(messageId).messageContents
      ) {
        return (this.editing = false)
      }
      this.axios
        .patch(`/api/edit/${messageId}`, {
          messageContents: this.editText.trim()
        })
        .then(() => {
          this.getMessages()
          this.editing = false
        })
        .catch((e) => {
          this.error = e.response.data.message
          setTimeout(this.errorFalse, 5000)
        })
    },
    editStatusMessage() {
      if (
        this.editStatus.trim() === this.showUser.statusMessage ||
        this.editStatus.trim().length > 50
      ) {
        return (this.editing = false)
      }
      this.axios
        .patch("/api/editStatusMessage", {
          statusMessage: this.editStatus.trim()
        })
        .then((res) => {
          this.showUser.statusMessage = res.data
          this.editing = false
        })
        .catch((e) => {
          this.error = e.response.data.message
          setTimeout(this.errorFalse, 5000)
        })
    },
    errorFalse() {
      this.error = false
    },
    dayjs(date) {
      return dayjs(date).format("DD/MM/YYYY HH:mm:ss")
    },
    dayjsShort(date) {
      return dayjs(date).format("HH:mm:ss")
    },
    dayjsDate(date) {
      return dayjs(date).format("D MMMM YYYY")
    },
    user() {
      this.axios
        .get("/api/user")
        .then((res) => {
          this.loggedIn = res.data
        })
        .catch((e) => {
          this.error = "Error 503 Cannot Connect to Server " + e
        })
    },
    openUser(userId) {
      this.axios.get("/api/user/" + userId).then((res) => {
        this.showUser = res.data
        this.profileShown = true
      })
    },
    scroll(override) {
      this.$nextTick(() => {
        try {
          if (!this.scrolledUp || override) {
            const lastIndex = this.messages.length - 1
            const lastMessage = document.querySelector(`#message-${lastIndex}`)
            if (lastMessage) {
              lastMessage.scrollIntoView()
              this.scrolledUp = false
            }
          }
        } catch (e) {
          console.log(e)
        }
      })
    },
    merge(message, index) {
      if (this.messages[index - 1]) {
        const previousMessage = this.messages[index - 1]
        return (
          previousMessage.userName === message.userName &&
          !message.reply &&
          !dayjs(previousMessage.createdAt).isBefore(
            dayjs(message.createdAt).subtract(15, "minutes")
          )
        )
      }
    },
    findMessage(messageId) {
      return this.messages.find((message) => message.id === messageId)
    },
    goToMessage(messageId) {
      const element = document.getElementById("message-" + (messageId.id - 1))
      const elementRect = element.getBoundingClientRect()
      const absoluteElementTop = elementRect.top + window.pageYOffset
      const middleOfScreen = window.innerHeight / 2
      const scrollTo = absoluteElementTop - middleOfScreen

      window.scrollTo({
        top: scrollTo,
        behavior: "smooth"
      })
      element.classList.add("highlight")
      setTimeout(() => {
        element.classList.remove("highlight")
      }, 1000)
    },
    editFocus() {
      this.$nextTick(() => {
        const status = document.getElementById("status")
        const input = document.getElementById("edit")
        if (status) {
          status?.focus()
        } else if (input) {
          input?.focus()
        } else {
          const input = document.getElementById("input")
          input?.focus()
        }
      })
    },
    editLast() {
      this.messageEdit = this.messages.filter(
        (message) => Number(message.userName) === this.loggedIn.id
      )
      if (this.messageEdit.length > 0) {
        this.editText = this.messageEdit.slice(-1)[0].messageContents
        return this.messageEdit.slice(-1)[0].id
      }
    },
    addFriend(userId) {
      this.axios
        .post(`/api/friend/${userId}`)
        .then(() => {
          this.openUser(userId)
        })
        .catch((e) => {
          this.error = e.response.data.message
          setTimeout(this.errorFalse, 5000)
        })
    },
    escPressed(event) {
      if (event.key === "Escape" && this.editing === "status") {
        this.editing = false
      } else if (event.key === "Escape" && this.profileShown) {
        this.profileShown = false
      } else if (event.key === "Escape" && this.editing) {
        this.editing = false
      } else if (event.key === "Escape" && !this.profileShown) {
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
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    }
  },
  async mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/favicon.ico"

    document.addEventListener("keydown", this.escPressed)
    document.addEventListener("scroll", this.scrollEvent)

    this.user()
    await this.getMessages()
    await this.getUsers()
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
  },
  watch: {
    editing() {
      this.editFocus()
    }
  }
}
</script>
