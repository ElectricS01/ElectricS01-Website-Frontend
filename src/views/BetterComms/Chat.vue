<template>
  <user-preview
    :show-user="showUser"
    :editing="editing"
    :add-friend="addFriend"
    @show-user="showUser = null"
    @editing="editing = $event"
    @status-message="onUpdateStatus"
    @dm-created="onDmCreated"
  />
  <modal-simple
    :is-active="embed !== null && !store.quickSwitcherShown"
    @close="embed = null"
  >
    <img :src="embed" class="message-embed" alt="Embedded image" />
  </modal-simple>
  <create-chat
    ref="createChatRef"
    :create-chat-shown="createChatShown"
    @hide-create-chat="createChatShown = false"
    @chat-created="handleChatCreated"
    @dm-created="onDmCreated"
  />
  <edit-chat
    ref="editChatRef"
    :editing-chat="chatEdit"
    @hide-editing-chat="chatEdit = null"
    @chat-edited="handleChatEdited"
  />
  <div class="chat-container">
    <chats-list
      v-if="store.chatBarOpen === true"
      v-model:context-menu="chatsSidebarContext"
      :chats="store.userData.chatsList"
      :loading="store.loadingChats"
      :current-id="store.showFriends ? undefined : currentChat?.id"
      :user-id="store.userData.id"
      @open-chat="getChat"
      @open-create-chat="openCreateChat"
      @show-edit-chat="showEditChat"
      @show-friends="store.showFriends = true"
      @remove-user="removeUser($event, store.userData.id)"
      @read-chat="readChat"
    />
    <friends
      v-if="store.showFriends"
      :add-friend="addFriend"
      @dm-created="onDmCreated"
    />
    <div
      v-else
      style="
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        width: calc(100% - 700px);
      "
    >
      <div
        ref="messages-div"
        style="overflow-y: auto; flex-grow: 1; padding: 8px 4px 8px 4px"
        class="scroll-bar"
      >
        <div v-if="loadingMessages || !currentChat" class="center">
          <div class="loader" />
        </div>
        <div v-else>
          <div style="padding: 12px 16px">
            <h1 v-if="currentChat.type !== 1" class="chat-title wrap">
              Welcome to {{ currentChat.name }}
            </h1>
            <h1
              v-else-if="currentChat.owner !== store.userData.id"
              class="chat-title wrap"
            >
              Welcome to your Direct Message with
              {{ currentChat?.ownerDetails.username }}
            </h1>
            <h1 v-else class="chat-title wrap">
              Welcome to your Direct Message with {{ currentChat.name }}
            </h1>
            <b style="display: block; overflow-wrap: break-word">
              {{ currentChat.description }}
            </b>
            <b
              v-if="!currentChat.requireVerification && currentChat.type !== 1"
              class="message-text-medium-gray"
            >
              This chat does not require email verification
            </b>
            <b
              v-else-if="currentChat.type !== 1"
              class="message-text-medium-gray"
            >
              This chat requires email verification
            </b>
            <b v-if="currentChat.type === 1" class="message-text-medium-gray">
              {{ encryptionRequirement }}
            </b>
          </div>
          <div
            v-for="(message, index) in currentChat.messages"
            :id="'message-' + index"
            :key="message.id"
          >
            <chat-spacer
              :message="message"
              :previous-message="currentChat.messages[index - 1]"
            />
            <reply
              v-if="message.reply"
              :message="findMessage(message.reply)"
              :open-user="openUser"
              :go-to-message="goToMessage"
            />
            <div
              class="message-grid"
              style="position: relative; width: 100%; margin: 6px 4px 4px"
              :style="{
                backgroundColor: editing === message.id ? '#212425' : ''
              }"
            >
              <div
                v-if="!merge(message, currentChat.messages[index - 1])"
                style="margin: 0 4px; cursor: pointer; border-radius: 16px"
                class="message-item"
                @click="openUser(message.user.id)"
              >
                <profile-picture
                  style="margin: 4px"
                  size="32"
                  :avatar="message.user?.avatar"
                />
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
                  v-if="!merge(message, currentChat.messages[index - 1])"
                  class="message-header"
                >
                  <b
                    class="message-text-medium"
                    @click="openUser(message.user.id)"
                  >
                    {{
                      message.user?.username
                        ? message.user.username
                        : "Deleted user"
                    }}
                  </b>
                  <b class="message-text-small">
                    {{ " " + dayjsLong(message.createdAt) }}
                  </b>
                </div>
                <emoji-input
                  v-if="editing === message.id"
                  id="edit"
                  v-model="editText"
                  v-model:show-emoji="showEditEmoji"
                  placeholder="Edit your message"
                  @save="editMessage(message.id)"
                />
                <custom-message
                  v-show="editing !== message.id"
                  :message="message"
                  :find-username="findUsername"
                  :open-user="openUser"
                  @embed="embed = $event"
                  @scroll="scrollDown()"
                />
                <message-emoji
                  :reactions="message.reactions"
                  :user-id="store.userData.id"
                  @reaction-selected="addReaction(message.id, $event)"
                  @reaction-removed="removeReaction(message.id, $event)"
                />
              </div>
              <div
                v-show="editing !== message.id"
                class="message-icons"
                :style="{
                  display: reactingTo === message.id ? 'flex' : ''
                }"
              >
                <icons
                  style="cursor: pointer"
                  size="20"
                  icon="emoji"
                  @click="reactPressed(message.id)"
                />
                <emoji-picker
                  v-if="reactingTo === message.id"
                  @emoji-selected="addReaction(message.id, $event)"
                />
                <icons
                  v-show="
                    store.userData.admin ||
                    message.user?.id === store.userData.id ||
                    currentChat.type === 1
                  "
                  style="cursor: pointer"
                  size="20"
                  :icon="message.pinned ? 'unpin' : 'pin'"
                  @click="pinMessage(message.id, message.pinned)"
                />
                <icons
                  v-if="
                    message.user?.id === store.userData.id &&
                    !message.encrypted &&
                    !message.deleted &&
                    !message.ciphertext
                  "
                  style="cursor: pointer"
                  size="20"
                  icon="edit"
                  @click="
                    ;((editing = message.id),
                      (editText = message.messageContents),
                      scrollDown(true))
                  "
                />
                <icons
                  style="cursor: pointer"
                  size="20"
                  icon="reply"
                  @click="replyToMessage(message.id)"
                />
                <icons
                  v-show="
                    store.userData.admin ||
                    message.user?.id === store.userData.id
                  "
                  style="cursor: pointer"
                  size="20"
                  icon="delete"
                  @click="deleteMessage(message.id)"
                />
              </div>
            </div>
            <div
              v-if="
                currentChat.association.lastRead === message.id &&
                index !== currentChat.messages.length - 1
              "
              class="red-chat-spacer"
            >
              <div />
              <p>New messages</p>
              <div />
            </div>
          </div>
        </div>
      </div>
      <chat-input
        v-model="inputText"
        v-model:show-emoji-selector="showEmojiSelector"
        :input-disabled="inputDisabled"
        :requires-encryption="requiresEncryption"
        :encryption-requirement="encryptionRequirement"
        :emoji-picker-visible="emojiPickerVisible"
        :scrolled-up="scrolledUp"
        :reply-message="replyMessage"
        :send-message="sendMessage"
        :on-up-before="onUpBefore"
        :on-up-after="onUpAfter"
        :show-emoji-picker="showEmojiPicker"
        :handle-emoji-selected="handleEmojiSelected"
        :open-user="openUser"
        :go-to-message="goToMessage"
        :scroll-down="scrollDown"
      />
    </div>
    <chat-sidebar
      v-model:users-sidebar-context="usersSidebarContext"
      :loading-messages="loadingMessages"
      :current-chat="currentChat"
      :add-friend="addFriend"
      :find-message="findMessage"
      :find-username="findUsername"
      :go-to-message="goToMessage"
      :open-user="openUser"
      :open-chat="getChat"
      @remove-user="removeUser(currentChat?.id, $event)"
      @dm-created="onDmCreated"
      @scroll="scrollDown()"
    />
  </div>
</template>

<script setup>
import CustomMessage from "@/components/CustomMessage.vue"
import Icons from "@/components/core/Icons.vue"
import ProfilePicture from "@/components/ProfilePicture.vue"
import UserPreview from "@/components/modals/UserPreview.vue"
import CreateChat from "@/components/modals/CreateChat.vue"
import EditChat from "@/components/modals/EditChat.vue"
import ModalSimple from "@/components/core/ModalSimple.vue"
import Friends from "@/components/Friends.vue"
import ChatSpacer from "@/components/ChatSpacer.vue"
import EmojiPicker from "@/components/EmojiPicker.vue"
import MessageEmoji from "@/components/MessageEmoji.vue"
import ChatsList from "@/components/sidebars/ChatsList.vue"
import ChatSidebar from "@/components/sidebars/ChatSidebar.vue"
import Reply from "@/components/Reply.vue"
import ChatInput from "@/components/ChatInput.vue"
import EmojiInput from "@/components/EmojiInput.vue"

import { useDataStore } from "@/store"
import axios from "axios"
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useTemplateRef,
  watch
} from "vue"
import { useRoute, useRouter } from "vue-router"
import { dayjsLong, dayjsShort } from "@/helpers/dates"
import { merge } from "@/helpers/messages"
import {
  encryptMessage,
  decryptMessage,
  importPublicKey
} from "@/helpers/encryption"
import sodium from "libsodium-wrappers-sumo"

const regex = /https:\/\/electrics01\.com\/api\/i\/[^\s<>"']+/g

const store = useDataStore()
const route = useRoute()
const router = useRouter()

const messageDivRef = useTemplateRef("messages-div")

const embed = ref(null)
const currentChat = ref({})
const replyTo = ref()
const editing = ref("")
const createChatRef = useTemplateRef("createChatRef")
const editChatRef = useTemplateRef("editChatRef")
const createChatShown = ref(false)
const loadingMessages = ref(true)
const scrolledUp = ref(false)
const showUser = ref(null)
const chatEdit = ref(null)
const reactingTo = ref(-1)
const inputText = ref("")
const editText = ref("")

const usersSidebarContext = ref(false)
const chatsSidebarContext = ref(false)
const showEditEmoji = ref(false)
const emojiPickerVisible = ref(false)
const showEmojiSelector = ref(false)

if (!localStorage.getItem("token")) {
  router.push(`/login?redirect=${route.path}`)
} else {
  if (store.ws) {
    store.ws.onmessage = async (event) => {
      await handleSocketMessage(event)
    }
  }
  watch(
    () => store.ws,
    async () => {
      if (store.ws) {
        store.ws.onmessage = async (event) => {
          await handleSocketMessage(event)
        }
      }
    }
  )
}

const handleSocketMessage = async (event) => {
  console.log(event)
  const socketMessage = JSON.parse(event.data)
  if (socketMessage.authFail) {
    store.handleError(`Error 401, ${socketMessage.authFail}`)
    router.push(`/login?redirect=${route.path}`)
  } else if (socketMessage.newMessage) {
    const chatIndex = store.userData.chatsList.findIndex(
      (chat) => chat.id === socketMessage.newMessage.chatId
    )

    if (chatIndex !== -1) {
      store.userData.chatsList[chatIndex].latest =
        socketMessage.newMessage.createdAt
      store.userData.chatsList[chatIndex].association.notifications += 1
      updatePageTitle()
    }
    store.chatSort()
    if (socketMessage.newMessage.chatId === currentChat.value.id) {
      socketMessage.newMessage.reactions = []
      await decrypt(socketMessage.newMessage)
      if (socketMessage.newMessage.chatId === currentChat.value.id) {
        currentChat.value.messages.push(socketMessage.newMessage)
        scrollDown()
      }
    }
  } else if (socketMessage.deleteMessage) {
    const messageIndex = currentChat.value.messages.findIndex(
      (message) => message.id === socketMessage.deleteMessage.id
    )
    if (messageIndex !== -1) {
      currentChat.value.messages[messageIndex].deleted = true
    }
  } else if (socketMessage.changeUser) {
    if (showUser.value && socketMessage.changeUser.id === showUser.value.id) {
      showUser.value = socketMessage.changeUser
    }
    const userToUpdate = currentChat.value.users.findIndex(
      (user) => user.id === socketMessage.changeUser.id
    )
    if (userToUpdate !== -1) {
      currentChat.value.users[userToUpdate] = socketMessage.changeUser
    }
  } else if (socketMessage.newUser) {
    if (parseInt(socketMessage.newUser.chatId) === currentChat.value.id) {
      currentChat.value.users.push(socketMessage.newUser)
    }
  } else if (socketMessage.newChat) {
    socketMessage.newChat.association = { notifications: 0 }
    store.userData.chatsList.push(socketMessage.newChat)
    store.chatSort()
  } else if (socketMessage.editChat) {
    const chatIndex = store.userData.chatsList.findIndex(
      (chat) => chat.id === socketMessage.editChat.id
    )

    socketMessage.editChat.association = {
      notifications:
        store.userData.chatsList[chatIndex].association.notifications
    }

    if (chatIndex !== -1) {
      store.userData.chatsList[chatIndex] = socketMessage.editChat
    }
  } else if (socketMessage.newReaction) {
    const message = currentChat.value.messages.find(
      (msg) => msg.id === socketMessage.newReaction.messageId
    )
    if (message) {
      message.reactions.push(socketMessage.newReaction.reaction)
    }
  } else if (socketMessage.deleteReaction) {
    const message = currentChat.value.messages.find(
      (msg) => msg.id === socketMessage.deleteReaction.messageId
    )
    if (message) {
      message.reactions = message.reactions.filter(
        (reaction) => reaction.id !== socketMessage.deleteReaction.reactionId
      )
    }
  }
  console.log("Data received from websocket")
}

const focusInput = () => {
  const input = document.getElementById("input")
  input?.focus()
}

const showEmojiPicker = () => {
  reactingTo.value = -1
  emojiPickerVisible.value = !emojiPickerVisible.value
}

const handleEmojiSelected = (emoji) => {
  inputText.value += emoji
  emojiPickerVisible.value = false
  focusInput()
}

const reactPressed = (messageId) => {
  if (reactingTo.value === messageId) {
    reactingTo.value = -1
  } else {
    reactingTo.value = messageId
    emojiPickerVisible.value = false
  }
}

const addReaction = async (messageId, emoji) => {
  try {
    if (
      !currentChat.value.messages
        .find((m) => m.id === messageId)
        .reactions.some(
          (r) => r.emoji === emoji && r.userId === store.userData.id
        )
    ) {
      const res = await axios.post("/api/react", {
        emoji,
        messageId
      })
      findMessage(messageId)?.reactions.push({
        emoji,
        id: res.data.id,
        userId: store.userData.id ?? -1
      })
      scrollDown()
    }
    reactingTo.value = -1
  } catch (error) {
    store.handleAxiosError(error)
    return -1
  }
}

const removeReaction = async (messageId, emoji) => {
  try {
    await axios.post("/api/unreact", {
      emoji,
      messageId
    })
    reactingTo.value = -1
    currentChat.value.messages.find((m) => m.id === messageId).reactions =
      currentChat.value.messages
        .find((m) => m.id === messageId)
        .reactions.filter(
          (r) => r.emoji !== emoji || r.userId !== store.userData.id
        )
  } catch (error) {
    store.handleAxiosError(error)
    return -1
  }
}

const sendMessage = async () => {
  emojiPickerVisible.value = false
  const messageContents = inputText.value.trim()
  const chatId = currentChat.value.id
  if (!messageContents) return
  try {
    let res
    if (sendEncrypted.value) {
      if (otherUser.value.publicKey.length !== 44) {
        store.handleError("Receiving user has invalid public key")
        return
      }
      const publicKey = await importPublicKey(otherUser.value.publicKey)
      const encrypted = await encryptMessage(
        messageContents,
        store.userData.privateKey,
        publicKey,
        store.userData.publicKey,
        otherUser.value.id,
        store.userData.id
      )
      res = await axios.post("/api/message-encrypted", {
        chatId,
        ciphertext: sodium.to_base64(
          encrypted.ciphertext,
          sodium.base64_variants.ORIGINAL
        ),
        keys: encrypted.keys,
        nonce: sodium.to_base64(
          encrypted.nonce,
          sodium.base64_variants.ORIGINAL
        ),
        reply: replyTo.value
      })
    } else {
      res = await axios.post("/api/message", {
        chatId,
        messageContents,
        reply: replyTo.value
      })
    }
    store.userData.chatsList = res.data.chats
    store.chatSort()
    inputText.value = ""
    replyTo.value = null
    await decrypt(res.data.lastMessage)
    if (chatId === currentChat.value.id) {
      currentChat.value.messages.push(res.data.lastMessage)
      currentChat.value.association.lastRead =
        currentChat.value.messages.at(-1).id
      updatePageTitle()
      scrollDown()
    }
  } catch (e) {
    store.handleAxiosError(e)
  }
}
const deleteMessage = (messageId) => {
  axios
    .delete(`/api/delete/${messageId}`)
    .then(() => {
      currentChat.value.messages = currentChat.value.messages.filter(
        (message) => message.id !== messageId
      )
      scrollDown()
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}
const pinMessage = (messageId, pinned) => {
  axios
    .patch(`/api/pin/${messageId}`)
    .then(() => {
      currentChat.value.messages = currentChat.value.messages.map((message) => {
        if (message.id === messageId) {
          return {
            ...message,
            pinned: !message.pinned
          }
        }
        return message
      })
      if (!pinned) {
        currentChat.value.pins.push(
          currentChat.value.messages.findLast(
            (message) => message.id === messageId
          )
        )
        currentChat.value.pins.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )
      } else {
        currentChat.value.pins.splice(
          currentChat.value.pins.indexOf(
            currentChat.value.pins.findLast(
              (message) => message.id === messageId
            )
          ),
          1
        )
      }
      scrollDown()
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const showEditChat = (chat) => {
  chatsSidebarContext.value = false
  editChatRef.value?.loadChat?.(chat)
  chatEdit.value = chat
}

const openCreateChat = () => {
  createChatRef.value?.clearInputs?.()
  createChatShown.value = true
}

const editMessage = (messageId) => {
  if (editText.value.trim() === findMessage(messageId)?.messageContents) {
    editing.value = ""
  }
  axios
    .patch(`/api/edit/${messageId}`, {
      messageContents: editText.value.trim()
    })
    .then((res) => {
      editing.value = ""
      currentChat.value.messages[
        currentChat.value.messages.findIndex((e) => e.id === messageId)
      ] = res.data
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const replyToMessage = (messageId) => {
  replyTo.value = messageId
  focusInput()
}

const trimTrailingPunctuation = (url) => {
  const opens = [...url].filter((c) => c === "(").length
  let closes = [...url].filter((c) => c === ")").length

  while (url.length > 0) {
    const last = url.at(-1)

    if (".,!?;:]".includes(last)) {
      url = url.slice(0, -1)
    } else if (last === ")" && closes > opens) {
      url = url.slice(0, -1)
      closes -= 1
    } else {
      return new URL(url)
    }
  }

  return new URL(url)
}

const decrypt = async (message) => {
  try {
    if (message.messageContents) return message
    const publicKey =
      message.userId === store.userData.id
        ? store.userData.publicKey
        : await importPublicKey(otherUser.value.publicKey)

    message.messageContents = await decryptMessage(
      message,
      store.userData.privateKey,
      publicKey
    )

    let links = message.messageContents.match(regex)
    if (!links) return
    if (links.length > 3) links = links.slice(0, 3)
    message.embeds = []
    for (const embedLink of links) {
      const linkURL = trimTrailingPunctuation(embedLink).toString()
      message.embeds.push({
        embedLink: linkURL,
        mediaProxyLink: linkURL,
        type: "image"
      })
    }
  } catch (e) {
    console.log(e)
    message.encrypted = true
    message.messageContents = "Could not decrypt message"
  }
}

const handleChatChange = async (chat) => {
  const { association } = currentChat.value
  currentChat.value = chat
  currentChat.value.association = association
  router.push(`/chat/${currentChat.value.id}`)
  updatePageTitle()
  replyTo.value = null
  if (currentChat.value.messages) {
    await Promise.all([
      ...currentChat.value.messages.map((message) => decrypt(message)),
      ...currentChat.value.pins.map((pin) => decrypt(pin))
    ])
    scrollDown()
  }
}

const handleChatCreated = async (chat) => {
  createChatShown.value = false
  await handleChatChange(chat)
}

const handleChatEdited = async (chat) => {
  chatEdit.value = null
  await handleChatChange(chat)
}

const openUser = (userId) => {
  usersSidebarContext.value = false
  chatsSidebarContext.value = false

  axios
    .post("/api/get-user", {
      userId
    })
    .then((res) => {
      showUser.value = res.data
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const findUsername = (userId) => {
  const user = currentChat.value.users.find(
    (user) => user.id === parseInt(userId)
  )
  return user?.username ?? userId
}
const removeUser = async (chatId, userId) => {
  usersSidebarContext.value = false
  try {
    const res = await axios.post(`/api/remove/${chatId}/${userId}`)
    store.userData.chatsList = res.data.chats
    store.chatSort()
    await handleChatChange(res.data.chat)
  } catch (e) {
    store.handleAxiosError(e)
  }
}
const scrollDown = (override = false) => {
  nextTick(() => {
    try {
      if ((!scrolledUp.value || override) && currentChat.value.messages) {
        const lastMessage = document.querySelector(
          `#message-${currentChat.value.messages.length - 1}`
        )
        if (editing.value) {
          scrolledUp.value = false
          lastMessage.scrollIntoView()
        } else if (lastMessage) {
          lastMessage.scrollIntoView()
          scrolledUp.value = false
          store.editFocus()
        }
      }
    } catch (e) {
      console.log(e)
    }
  })
}

const findMessage = (messageId) =>
  currentChat.value.messages.findLast((message) => message.id === messageId)

const goToMessage = (messageId) => {
  const index = currentChat.value.messages.findIndex(
    (message) => message.id === messageId
  )
  const element = document.getElementById(`message-${index}`)

  if (!messageDivRef.value || !element) {
    return
  }

  const elementRect = element.getBoundingClientRect()
  const absoluteElementTop = elementRect.top + messageDivRef.value.scrollTop
  const middleOfScreen = messageDivRef.value.clientHeight / 2
  const scrollTo = absoluteElementTop - middleOfScreen

  messageDivRef.value.scrollTo({
    behavior: "smooth",
    top: scrollTo
  })
  element.classList.add("highlight")
  setTimeout(() => {
    element.classList.remove("highlight")
  }, 1500)
}
const editLast = () => {
  const messageEdit = currentChat.value.messages
    .filter((message) => message.userId === store.userData.id)
    ?.slice(-1)[0]
  if (messageEdit) {
    editText.value = messageEdit.messageContents
    editing.value = messageEdit.id
  }
}
const replyLast = () => {
  const messageReply = currentChat.value.messages
    .filter((message) => message.userId !== store.userData.id)
    ?.slice(-1)[0]
  if (messageReply) {
    replyTo.value = messageReply.id
  }
}
async function addFriend(userId, notOpen = false) {
  await axios
    .post(`/api/friend/${userId}`)
    .then(async (res) => {
      if (notOpen === false) {
        showUser.value.friend = {
          status: res.data.status
        }
      } else if (notOpen) {
        currentChat.value.users.find((user) => user.id === userId).friend = {
          status: res.data.status
        }
      }
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const onUpdateStatus = (statusMessage) => {
  const user = currentChat.value?.users?.find(
    (user) => user.id === store.userData.id
  )

  if (user) {
    user.statusMessage = statusMessage
  }
}

const onDmCreated = async (data) => {
  showUser.value = null
  createChatShown.value = false
  store.showFriends = false
  editing.value = ""
  store.userData.chatsList = data.chats
  store.chatSort()
  inputText.value = ""
  await handleChatChange(data.chat)
}

const readChat = async (chatId) => {
  try {
    chatsSidebarContext.value = false
    await axios.post(`/api/read-new/${chatId}`)
    if (currentChat.value.id === chatId) {
      currentChat.value.association.lastRead =
        currentChat.value.messages.at(-1).id
    }
    store.userData.chatsList[
      store.userData.chatsList.findIndex((chat) => chat.id === chatId)
    ].association.notifications = 0
    updatePageTitle()
  } catch (e) {
    store.handleAxiosError(e)
  }
}

const keyPressed = ({ key, altKey }) => {
  if (key === "Escape") {
    if (usersSidebarContext.value) {
      usersSidebarContext.value = false
    } else if (chatsSidebarContext.value) {
      chatsSidebarContext.value = false
    } else if (editing.value === "status") {
      editing.value = ""
    } else if (showUser.value) {
      showUser.value = null
    } else if (embed.value) {
      embed.value = null
    } else if (createChatShown.value) {
      createChatShown.value = false
    } else if (showEditEmoji.value) {
      showEditEmoji.value = false
    } else if (chatEdit.value !== null) {
      chatEdit.value = null
    } else if (showEmojiSelector.value) {
      showEmojiSelector.value = false
    } else if (reactingTo.value !== -1) {
      reactingTo.value = -1
      focusInput()
    } else if (emojiPickerVisible.value) {
      emojiPickerVisible.value = false
      focusInput()
    } else if (editing.value) {
      editing.value = ""
    } else if (replyTo.value) {
      replyTo.value = null
    } else if (
      !showUser.value &&
      currentChat.value.association.lastRead ===
        currentChat.value.messages.at(-1).id
    ) {
      scrollDown(true)
    } else if (
      currentChat.value.association.lastRead !==
      currentChat.value.messages.at(-1).id
    ) {
      readChat(currentChat.value.id)
    }
  } else if (altKey) {
    if (key === "ArrowDown") {
      const chatIndex = store.userData.chatsList.findIndex(
        (chat) => chat.id === currentChat.value.id
      )
      getChat(
        store.userData.chatsList[
          (chatIndex + 1) % store.userData.chatsList.length
        ].id
      )
    } else if (key === "ArrowUp") {
      const chatIndex = store.userData.chatsList.findIndex(
        (chat) => chat.id === currentChat.value.id
      )
      getChat(
        store.userData.chatsList[
          (chatIndex + store.userData.chatsList.length - 1) %
            store.userData.chatsList.length
        ].id
      )
    }
  }
}
const scrollEvent = () => {
  if (!messageDivRef.value) return
  const { scrollHeight, scrollTop, clientHeight } = messageDivRef.value
  scrolledUp.value =
    scrollTop + clientHeight <=
    scrollHeight - (clientHeight / 2 > 200 ? 200 : clientHeight / 2)
}

const replyMessage = computed(() =>
  replyTo.value ? findMessage(replyTo.value) : undefined
)

const otherUser = computed(() =>
  currentChat.value.users?.find((u) => u.id !== store.userData.id)
)

const sendEncrypted = computed(
  () =>
    currentChat.value?.type === 1 &&
    ((store.userData.encryption === "on" &&
      otherUser.value.encryption === "always") ||
      (store.userData.encryption === "always" &&
        otherUser.value.encryption === "on") ||
      (store.userData.encryption === "on" &&
        otherUser.value.encryption === "on") ||
      (store.userData.encryption === "off" &&
        otherUser.value.encryption === "always") ||
      (store.userData.encryption === "always" &&
        otherUser.value.encryption === "off") ||
      (store.userData.encryption === "always" &&
        otherUser.value.encryption === "always"))
)
const requiresEncryption = computed(
  () =>
    currentChat.value?.type === 1 &&
    ((store.userData.encryption === "always" &&
      otherUser.value.encryption === "never") ||
      (store.userData.encryption === "never" &&
        otherUser.value.encryption === "always"))
)
const inputDisabled = computed(
  () =>
    requiresEncryption.value ||
    (!store.userData.emailVerified && currentChat.value?.requireVerification) ||
    false
)
const encryptionRequirement = computed(() => {
  if (currentChat.value?.type !== 1) return ""
  const { encryption } = currentChat.value.users.find(
    (u) => u.id !== store.userData.id
  )
  switch (encryption) {
    case "never":
      return "This user does not allow encrypted direct messages"
    case "off":
      return "This user prefers unencrypted direct messages"
    case "on":
      return "This user prefers encrypted direct messages"
    case "always":
      return "This user requires encrypted direct messages"
    default:
      return ""
  }
})

const onUpBefore = (event) => {
  if (
    event.ctrlKey ||
    event.metaKey ||
    (sendEncrypted.value && showEmojiSelector.value)
  ) {
    event.preventDefault()
    showEmojiSelector.value = false
    replyLast()
    scrollDown(true)
    return true
  }

  return false
}

const onUpAfter = (event) => {
  if (
    inputText.value &&
    !(
      navigator.userAgentData?.platform === "macOS" ||
      navigator.platform === "MacIntel"
    )
  )
    return

  event.preventDefault()
  editLast()
  store.editFocus()
  scrollDown(true)
}

const updateFavicon = (notificationCount) => {
  const favicon = document.getElementById("favicon")
  if (!favicon) return

  if (notificationCount < 1) {
    favicon.href = "/icons/favicon.ico"
    return
  }

  const size = 64
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const img = new Image()
  img.src = favicon.href
  img.onload = () => {
    ctx.drawImage(img, 0, 0, size, size)

    const radius = 20
    ctx.fillStyle = "red"
    ctx.beginPath()
    ctx.arc(size - radius, size - radius, radius, 0, 2 * Math.PI)
    ctx.fill()

    ctx.fillStyle = "white"
    ctx.font = "bold 32px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(
      notificationCount > 9 ? "9+" : notificationCount,
      size - radius,
      size - radius
    )

    favicon.href = canvas.toDataURL("image/png")
  }
}

const updatePageTitle = () => {
  const notificationCount =
    store.userData.chatsList?.reduce(
      (sum, chat) => sum + (chat.association?.notifications || 0),
      0
    ) ?? 0

  const chatName =
    currentChat.value.type === 1 &&
    currentChat.value.owner !== store.userData.id
      ? currentChat.value.ownerDetails.username
      : currentChat.value.name

  document.title = `${notificationCount !== 0 ? `(${notificationCount}) ` : ""}BetterComms | ${chatName}`
  updateFavicon(notificationCount)
}

async function getChat(id) {
  if (!id) {
    if (!store.userData.chatsList) {
      watch(
        () => store.userData.chatsList,
        (newValue) => {
          if (newValue) {
            getChat(id)
          }
        },
        {
          once: true
        }
      )
      return
    }
    id = store.userData.chatsList[0].id
  }
  if (id !== currentChat.value?.id) {
    loadingMessages.value = true
  }
  store.showFriends = false
  await axios
    .get(`/api/chat/${id}`)
    .then(async (res) => {
      currentChat.value = res.data
      await Promise.all([
        ...currentChat.value.messages.map((message) => decrypt(message)),
        ...currentChat.value.pins.map((pin) => decrypt(pin))
      ])
      router.push(`/chat/${currentChat.value.id}`)
      replyTo.value = null
      loadingMessages.value = false
      scrollDown(true)
      updatePageTitle()
      if (!store.userData.chatsList) {
        watch(
          () => store.userData.chatsList,
          (newValue) => {
            if (newValue) {
              updatePageTitle()
            }
          },
          {
            once: true
          }
        )
        return
      }
    })
    .catch((e) => {
      if (e.response?.status === 403 && store.userData.chatsList[0].id !== id) {
        getChat(store.userData.chatsList[0].id)
      } else if (e.response?.status !== 403) {
        store.handleAxiosError(e)
      }
    })
}

onMounted(async () => {
  document.addEventListener("keydown", keyPressed)
  messageDivRef.value?.addEventListener("scroll", scrollEvent)
  if (route.path.startsWith("/user")) {
    openUser(route.params.id)
  }
  getChat(route.params.chatId)
})
onUnmounted(() => {
  document.removeEventListener("keydown", keyPressed)
  messageDivRef.value?.removeEventListener("scroll", scrollEvent)
})
watch(editing, () => {
  store.editFocus()
})
</script>
