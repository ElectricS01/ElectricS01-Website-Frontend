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
        style="object-fit: cover; width: min(500px, 100%)"
        alt="Profile banner"
      />
      <div class="profile-grid" style="padding: 24px">
        <div class="profile-picture" style="margin-right: 16px; height: 80px">
          <img
            style="border-radius: 40px; object-fit: cover"
            width="80"
            height="80"
            v-if="showUser.avatar"
            :src="showUser.avatar"
            alt="Profile icon"
          />
          <Icons v-else size="80" icon="account" />
          <svg class="online-indicator" width="20" height="20">
            <status-indicator
              size="8"
              :status="showUser.status"
            ></status-indicator>
          </svg>
        </div>
        <div style="flex-grow: 1; flex-basis: 0" class="message-item">
          <h4 style="word-wrap: break-word">{{ showUser.username }}</h4>
          <div v-if="editing !== 'status'" style="display: flex">
            <p class="message-text-large" style="word-wrap: break-word">
              {{ showUser.statusMessage }}
              <Icons
                v-if="showUser.id === $user.loggedIn.id"
                style="cursor: pointer"
                size="16"
                icon="edit"
                @click="
                  ;(editing = 'status'),
                    (editStatus = showUser.statusMessage),
                    editFocus()
                "
              />
            </p>
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
            autocomplete="off"
          />
        </div>
        <div>
          <button
            v-if="showUser.directMessages && showUser.id !== $user.loggedIn.id"
            class="profile-button-message"
          >
            <Icons
              style="top: 0; padding-right: 4px"
              color="#1e90ff"
              size="16"
              icon="message"
            />
            Send Message
          </button>
          <button
            v-if="
              showUser.friendRequests &&
              showUser.id !== $user.loggedIn.id &&
              !showUser.friendStatus
            "
            class="profile-button-add"
            style="color: #47bf4c"
            @click="addFriend(showUser.id)"
          >
            <Icons
              style="top: 0; padding-right: 4px"
              color="#47bf4c"
              size="16"
              icon="add-user"
            />
            Add Friend
          </button>
          <button
            v-if="
              showUser.id !== $user.loggedIn.id &&
              showUser.friendStatus === 'accepted'
            "
            class="profile-button-remove"
            style="color: #ff2f2f"
            @click="addFriend(showUser.id)"
          >
            <Icons
              style="top: 0; padding-right: 4px"
              color="#FF2F2F"
              size="16"
              icon="remove-user"
            />
            Remove Friend
          </button>
          <button
            v-if="
              showUser.friendRequests && showUser.friendStatus === 'pending'
            "
            class="profile-button-pending"
            style="color: #808080"
            @click="addFriend(showUser.id)"
          >
            <Icons
              style="top: 0; padding-right: 4px"
              color="#808080"
              size="16"
              icon="remove-user"
            />
            Pending
          </button>
          <button
            v-if="
              showUser.id !== $user.loggedIn.id &&
              showUser.friendStatus === 'incoming'
            "
            class="profile-button-pending"
            style="color: #47bf4c"
            @click="addFriend(showUser.id)"
          >
            <Icons
              style="top: 0; padding-right: 4px"
              color="#47bf4c"
              size="16"
              icon="add-user"
            />
            Accept Friend
          </button>
        </div>
      </div>
      <div style="padding: 24px">
        <p>Description</p>
        <p class="message-text-large">
          {{ showUser.description || `Hi, I'm ${showUser.username}!` }}
        </p>
      </div>
    </modal>
  </transition>
  <div class="chat-navbar">
    <router-link to="/test">Better Test</router-link>
    <router-link v-if="$user.loggedIn" class="right" to="/account">
      Account
    </router-link>
    <router-link v-else class="right" to="/login">Login</router-link>
    <router-link class="right" to="/">Home</router-link>
    <div
      @click="toggleSidebar"
      class="right"
      style="width: 28px; height: 28px; padding: 10px"
    >
      <Icons size="28" icon="account" />
    </div>
  </div>
  <transition>
    <p v-if="error" class="error-banner">
      {{ error }}
    </p>
  </transition>
  <div
    style="
      position: fixed;
      top: 48px;
      display: flex;
      width: 100%;
      height: calc(100% - 48px);
    "
  >
    <div
      style="
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        width: calc(100% - 250px);
      "
    >
      <div style="overflow-y: auto; flex-grow: 1" id="div" class="scroll-bar">
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
          <div style="margin-bottom: 8px">
            <div
              v-for="(message, index) in messages"
              :key="message.id"
              :id="'message-' + index"
              style="padding: 4px"
            >
              <div
                style="
                  padding-bottom: 8px;
                  height: 16px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
                v-if="
                  dayjsDate(message.createdAt) !==
                  dayjsDate(messages[index - 1]?.createdAt)
                "
              >
                <div style="border-bottom: 1px solid #212425; width: 50%"></div>
                <p
                  style="padding: 0 4px; white-space: nowrap"
                  class="message-text-small"
                >
                  {{ dayjsDate(message.createdAt) }}
                </p>
                <div style="border-bottom: 1px solid #212425; width: 50%"></div>
              </div>
              <div
                v-if="message.reply && findMessage(message.reply)?.user"
                style="
                  display: flex;
                  overflow-wrap: break-word;
                  margin: 0 0 8px 28px;
                "
              >
                <Icons size="16" icon="reply" style="margin-right: 4px" />
                <img
                  style="
                    border-radius: 16px;
                    object-fit: cover;
                    cursor: pointer;
                    margin-top: 2px;
                  "
                  @click="openUser(findMessage(message.reply).user.id)"
                  width="16"
                  height="16"
                  v-if="findMessage(message.reply).user.avatar"
                  :src="findMessage(message.reply).user.avatar"
                  alt="Profile icon"
                />
                <Icons
                  style="cursor: pointer"
                  v-else
                  @click="openUser(findMessage(message.reply).user.id)"
                  size="16"
                  icon="account"
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
                v-else-if="message.reply"
                style="
                  overflow-wrap: break-word;
                  margin: 0 0 8px 28px;
                  display: flex;
                "
              >
                <Icons
                  color="darkgrey"
                  size="16"
                  icon="reply"
                  style="margin-right: 4px"
                />
                <Icons color="darkgrey" size="16" icon="account" />
                <b
                  class="message-text-medium-gray"
                  style="margin: 4px 4px 0 4px"
                >
                  Message has been deleted
                </b>
              </div>
              <div
                class="message-grid"
                style="position: relative; width: 100%"
                :style="{
                  backgroundColor: editing === message.id ? '#212425' : ''
                }"
              >
                <div
                  v-if="!merge(message, index)"
                  @click="openUser(message.user?.id)"
                  style="
                    margin: 0 12px 0 4px;
                    cursor: pointer;
                    border-radius: 16px;
                  "
                  class="message-item"
                >
                  <img
                    style="border-radius: 16px; object-fit: cover"
                    width="32"
                    height="32"
                    v-if="message.user.avatar"
                    :src="message.user.avatar"
                    alt="Profile icon"
                  />
                  <Icons v-else size="32" icon="account" />
                </div>
                <div v-else class="message-time">
                  <b class="message-text-small">
                    {{ dayjsShort(message.createdAt) }}
                  </b>
                </div>
                <div
                  class="message-item"
                  style="width: calc(100% - 96px); overflow-wrap: break-word"
                >
                  <div
                    style="line-height: 11.5px"
                    v-if="!merge(message, index)"
                  >
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
                  <input
                    v-if="editing === message.id"
                    placeholder="Edit your message"
                    @keydown.enter="editMessage(message.id)"
                    class="responder"
                    v-model="editText"
                    type="text"
                    style="width: 100%; margin-left: 0"
                    id="edit"
                    autocomplete="off"
                  />
                  <div>
                    <div v-show="editing !== message.id" v-markdown>
                      {{ message.messageContents }}
                      <b class="message-text-small" v-if="message.edited">
                        (edited)
                      </b>
                    </div>
                    <Embeds
                      v-for="(embed, index) in message.embeds"
                      :key="index"
                      :embed="embed"
                    ></Embeds>
                  </div>
                </div>
                <div class="message-icons" v-show="editing !== message.id">
                  <Icons
                    v-show="message.user.id === $user.loggedIn?.id"
                    style="cursor: pointer"
                    size="20"
                    icon="edit"
                    @click="
                      ;(editing = message.id),
                        (editText = message.messageContents),
                        scroll(message)
                    "
                  />
                  <Icons
                    style="cursor: pointer"
                    size="20"
                    icon="reply"
                    @click="replyToMessage(message.id)"
                  />
                  <Icons
                    v-show="
                      $user.loggedIn?.admin ||
                      message.user.id === $user.loggedIn?.id
                    "
                    style="cursor: pointer"
                    size="20"
                    icon="delete"
                    @click="deleteMessage(message.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <transition>
          <div v-if="replyTo || scrolledUp">
            <transition>
              <div
                :style="{
                  height: replyTo ? '36px' : '',
                  marginRight: sidebarOpen === 'true' ? '250px' : ''
                }"
                v-if="scrolledUp"
                style="
                  position: fixed;
                  z-index: 1;
                  bottom: 48px;
                  cursor: pointer;
                "
                class="scroll-button"
                @click="scroll"
              >
                <Icons size="12" icon="down-arrow" />
                <p class="message-text-medium">Scroll to bottom</p>
              </div>
            </transition>
            <div
              v-if="replyTo"
              class="scroll-button"
              @click="scroll"
              style="
                display: flex;
                overflow-wrap: break-word;
                z-index: 2;
                position: relative;
              "
            >
              <Icons size="12" icon="reply" style="margin-right: 4px" />
              <img
                style="
                  border-radius: 12px;
                  object-fit: cover;
                  cursor: pointer;
                  margin-top: 2px;
                "
                @click="openUser(findMessage(replyTo).user.id)"
                width="12"
                height="12"
                v-if="findMessage(replyTo).user.avatar"
                :src="findMessage(replyTo).user.avatar"
                alt="Profile icon"
              />
              <Icons
                style="cursor: pointer"
                v-else
                @click="openUser(findMessage(replyTo).user.id)"
                size="12"
                icon="account"
              />
              <b
                class="message-text-medium"
                @click="openUser(findMessage(replyTo).user.id)"
                style="margin: 0 4px 0 4px"
              >
                {{ "@" + findMessage(replyTo).user.username }}
              </b>
              <p
                class="message-text-medium-gray"
                @click="goToMessage(findMessage(replyTo))"
                style="margin: 0"
              >
                {{ findMessage(replyTo).messageContents }}
              </p>
            </div>
          </div>
        </transition>
        <div class="message-send">
          <input
            placeholder="Send a message"
            autofocus
            @keydown.enter="submit"
            @keydown.up.prevent="editLast(), scroll(true)"
            class="responder"
            v-model="inputText"
            type="text"
            id="input"
            autocomplete="off"
          />
          <button @click="submit" style="cursor: pointer">Send</button>
        </div>
      </div>
    </div>
    <Sidebar v-if="sidebarOpen === 'true'">
      <div v-if="!loadingUsers" style="padding: 0 4px 4px 8px">
        <div class="filter-button" @click="userSortPress()">
          <p v-if="sortUsers === 'id'">Sort: Id</p>
          <p v-else-if="sortUsers === 'username'">Sort: Username</p>
          <p v-else-if="sortUsers === 'status'">Sort: Status</p>
          <p v-else-if="sortUsers === 'statusMessage'">Sort: Status Message</p>
        </div>
        <div
          style="
            padding: 0 4px;
            display: flex;
            height: 20px;
            align-items: center;
          "
        >
          <p style="padding-right: 4px" class="message-text-small">Online</p>
          <div style="border-bottom: 1px solid #212425; width: 100%"></div>
        </div>
        <div v-for="user in users">
          <div
            v-if="user.status !== 'offline'"
            style="cursor: pointer; margin: 0 0 4px"
            class="message-grid"
            @click="openUser(user.id)"
          >
            <div
              class="profile-picture"
              style="margin-right: 8px; height: 40px"
            >
              <img
                style="border-radius: 16px; object-fit: cover; margin: 4px"
                width="32"
                height="32"
                v-if="user.avatar"
                :src="user.avatar"
                alt="Profile icon"
              />
              <Icons style="margin: 4px" v-else size="32" icon="account" />
              <svg class="online-indicator" width="15" height="15">
                <status-indicator
                  size="5"
                  :status="user.status"
                ></status-indicator>
              </svg>
            </div>
            <div style="flex-grow: 1; width: 178px" class="message-item">
              <b
                class="message-text-large"
                style="
                  margin: 4px 0 2px 0;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
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
                "
              >
                {{ user.statusMessage }}
              </p>
            </div>
          </div>
        </div>
        <div
          style="
            padding: 0 4px;
            display: flex;
            height: 20px;
            align-items: center;
          "
        >
          <p style="padding-right: 4px" class="message-text-small">Offline</p>
          <div style="border-bottom: 1px solid #212425; width: 100%"></div>
        </div>
        <div v-for="user in users">
          <div
            v-if="user.status === 'offline'"
            style="cursor: pointer; margin: 0 0 4px"
            class="message-grid"
            @click="openUser(user.id)"
          >
            <div
              class="profile-picture"
              style="margin-right: 8px; height: 40px"
            >
              <img
                style="border-radius: 16px; object-fit: cover; margin: 4px"
                width="32"
                height="32"
                v-if="user.avatar"
                :src="user.avatar"
                alt="Profile icon"
              />
              <Icons style="margin: 4px" v-else size="32" icon="account" />
              <svg class="online-indicator" width="15" height="15">
                <status-indicator
                  size="5"
                  :status="user.status"
                ></status-indicator>
              </svg>
            </div>
            <div class="message-item">
              <b
                class="message-text-large"
                style="
                  margin: 4px 0 2px 0;
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
      </div>
      <div class="center" v-else>
        <div style="text-align: center" class="loader"></div>
      </div>
    </Sidebar>
  </div>
</template>

<script>
import dayjs from "dayjs"
import Embeds from "@/components/Embeds.vue"
import StatusIndicator from "@/components/StatusIndicator.vue"
import Icons from "@/components/Icons.vue"
import Modal from "@/components/Modal.vue"
import Sidebar from "@/components/Sidebar.vue"
import sidebar from "@/components/Sidebar.vue"

export default {
  computed: {
    sidebar() {
      return sidebar
    }
  },
  components: { Sidebar, Icons, Embeds, Modal, StatusIndicator },
  data() {
    return {
      messages: [],
      users: [],
      inputText: "",
      replyTo: null,
      editText: "",
      editStatus: "",
      sidebarOpen: "false",
      editing: false,
      error: "",
      profileShown: false,
      loadingMessages: true,
      loadingUsers: true,
      scrolledUp: false,
      showUser: false,
      sortUsers: "id"
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
        .catch((e) => {
          if (e.message === "Request failed with status code 401") {
            this.error = "Error 401, You are not logged in"
            this.$router.push("/login")
          } else {
            this.error = "Error 503, Cannot Connect to Server" + e
          }
        })
    },
    async getUsers() {
      await this.axios
        .get("/api/users")
        .then((res) => {
          this.users = res.data
          this.loadingUsers = false
          this.userSort(this.sortUsers)
        })
        .catch((e) => {
          if (e.message === "Request failed with status code 401") {
            this.error = "Error 401, You are not logged in"
            this.$router.push("/login")
          } else {
            this.error = "Error 503, Cannot Connect to Server" + e
          }
        })
    },
    userSortPress() {
      if (this.sortUsers === "id") {
        localStorage.setItem("sortUsers", "username")
      } else if (this.sortUsers === "username") {
        localStorage.setItem("sortUsers", "status")
      } else if (this.sortUsers === "status") {
        localStorage.setItem("sortUsers", "statusMessage")
      } else {
        localStorage.setItem("sortUsers", "id")
      }
      if (localStorage.getItem("sortUsers")) {
        this.sortUsers = localStorage.getItem("sortUsers")
      }
      this.userSort(this.sortUsers)
    },
    userSort(property) {
      if (property !== "id") {
        this.users.sort(function (a, b) {
          if (a[property] === null && b[property] === null) {
            return 0
          } else if (a[property] === null) {
            return 1
          } else if (b[property] === null) {
            return -1
          } else {
            return a[property].localeCompare(b[property])
          }
        })
      } else {
        this.users.sort(function (a, b) {
          return a.id - b.id
        })
      }
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
          this.getUsers()
        })
        .catch((e) => {
          this.error = e.response.data.message
          setTimeout(this.errorFalse, 5000)
        })
    },
    replyToMessage(messsageId) {
      this.replyTo = messsageId
      const input = document.getElementById("input")
      input?.focus()
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
    openUser(userId) {
      this.axios
        .get("/api/user/" + userId)
        .then((res) => {
          this.showUser = res.data
          this.profileShown = true
        })
        .catch((e) => {
          this.error = e.response.data.message
          setTimeout(this.errorFalse, 5000)
        })
    },
    scroll(override) {
      this.$nextTick(() => {
        try {
          if (!this.scrolledUp || override) {
            const lastIndex = this.messages.length - 1
            const lastMessage = document.querySelector(`#message-${lastIndex}`)
            if (this.editing) {
              const lastMessage = document.querySelector(
                `#message-${this.messages.indexOf(override)}`
              )
              lastMessage.scrollIntoView({ block: "nearest" })
            } else if (lastMessage) {
              lastMessage.scrollIntoView()
              this.scrolledUp = false
              this.editFocus()
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
      const div = document.getElementById("div")
      const element = document.getElementById(
        "message-" + this.messages.indexOf(messageId)
      )
      const elementRect = element.getBoundingClientRect()
      const absoluteElementTop = elementRect.top + div.scrollTop
      const middleOfScreen = div.clientHeight / 2
      const scrollTo = absoluteElementTop - middleOfScreen

      div.scrollTo({
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
        (message) => Number(message.userName) === this.$user.loggedIn.id
      )
      if (this.messageEdit.length > 0) {
        this.editText = this.messageEdit.slice(-1)[0].messageContents
        this.editing = this.messageEdit.slice(-1)[0].id
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
      } else if (event.key === "Escape" && this.replyTo) {
        this.replyTo = null
      } else if (event.key === "Escape" && !this.profileShown) {
        this.scroll(true)
      }
    },
    scrollEvent() {
      const div = document.getElementById("div")
      const scrollHeight = div.scrollHeight
      const scrollTop = div.scrollTop
      const clientHeight = div.clientHeight

      this.scrolledUp =
        scrollTop + clientHeight <=
        scrollHeight - (clientHeight / 2 > 200 ? 200 : clientHeight / 2)
    },
    toggleSidebar() {
      if (localStorage.getItem("sidebarOpen") === "true") {
        localStorage.setItem("sidebarOpen", "false")
      } else {
        localStorage.setItem("sidebarOpen", "true")
      }
      this.sidebarOpen = localStorage.getItem("sidebarOpen")
    }
  },
  async mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/favicon.ico"

    document.addEventListener("keydown", this.escPressed)
    const div = document.getElementById("div")
    div.addEventListener("scroll", this.scrollEvent)

    await this.getMessages()
    await this.getUsers()
    this.scroll(true)
  },
  created() {
    this.sidebarOpen = localStorage.getItem("sidebarOpen")
    if (localStorage.getItem("sortUsers")) {
      this.sortUsers = localStorage.getItem("sortUsers")
    }
  },
  beforeRouteLeave(to, from, next) {
    document.removeEventListener("keydown", this.escPressed)
    const div = document.getElementById("div")
    div.removeEventListener("scroll", this.scrollEvent)
    next()
  },
  unmounted() {
    document.removeEventListener("keydown", this.escPressed)
  },
  watch: {
    editing() {
      this.editFocus()
    }
  }
}
</script>
