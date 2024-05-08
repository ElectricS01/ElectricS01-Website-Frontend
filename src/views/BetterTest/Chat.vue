<template>
  <user-preview
    :show-user="showUser"
    :editing="editing"
    :send-dm="sendDm"
    :add-friend="addFriend"
    @show-user="showUser = false"
    @editing="editing = $event"
    @status-message="showUser.statusMessage = $event"
  />
  <transition>
    <modal-simple
      v-if="embed && !store.quickSwitcherShown"
      :is-active="embed && !store.quickSwitcherShown"
      @close="embed = false"
    >
      <img :src="embed" class="message-embed" alt="Embedded image" />
    </modal-simple>
  </transition>
  <transition>
    <modal
      v-if="createChatShown && !store.quickSwitcherShown"
      :is-active="createChatShown && !store.quickSwitcherShown"
      @close="
        ;(createChatShown = false),
          (chatNameInput = ''),
          (chatDescriptionInput = ''),
          (chatIconInput = ''),
          (requireVerification = true)
      "
    >
      <div class="chanel-menu">
        <div class="selector">
          <p
            class="message-text-large"
            :class="{ active: createChatType }"
            @click="createChatType = true"
          >
            Create New Chat
          </p>
          <p
            class="message-text-large"
            :class="{ active: !createChatType }"
            @click="createChatType = false"
          >
            Create Direct Message
          </p>
        </div>
        <div v-if="createChatType">
          <div class="text-small">
            <label class="text-small" for="chat-name">Chat name</label>
          </div>
          <input
            id="chat-name"
            v-model="chatNameInput"
            placeholder="Chat name"
            class="modal-input"
            @keydown.enter="createChat"
          />
          <div class="text-small">
            <label for="chat-description">Chat description</label>
          </div>
          <input
            id="chat-description"
            v-model="chatDescriptionInput"
            placeholder="Chat description"
            class="modal-input"
            @keydown.enter="createChat"
          />
          <div class="text-small">
            <label for="chat-icon">Chat icon</label>
          </div>
          <input
            id="chat-icon"
            v-model="chatIconInput"
            placeholder="Chat icon"
            class="modal-input"
            @keydown.enter="createChat"
          />
          <div v-if="store.userData.emailVerified">
            <div class="text-small">
              <label for="requireVerification">Require verification</label>
            </div>
            <div
              class="switch"
              @click="requireVerification = !requireVerification"
            >
              <input
                id="requireVerification"
                type="checkbox"
                :checked="requireVerification"
              />
              <span class="slider" />
            </div>
          </div>
        </div>
        <div v-else>
          <div class="text-small">
            <label for="username">Username</label>
          </div>
          <input
            id="username"
            v-model="chatUsernameInput"
            placeholder="Username"
            class="modal-input"
            @keydown.enter="chatUsernameEnter"
          />
        </div>
        <button @click="createChat">Create</button>
      </div>
    </modal>
  </transition>
  <transition>
    <modal
      v-if="chatEdit !== -1 && !store.quickSwitcherShown"
      :is-active="chatEdit !== -1 && !store.quickSwitcherShown"
      @close="
        ;(chatEdit = -1),
          (chatNameInput = ''),
          (chatDescriptionInput = ''),
          (chatIconInput = ''),
          (chatUserInput = ''),
          (requireVerification = true)
      "
    >
      <div class="chanel-menu">
        <p class="message-text-large">Edit Chat</p>
        <div class="text-small">
          <label class="text-small" for="chat-name">Chat name</label>
        </div>
        <input
          id="chat-name"
          v-model="chatNameInput"
          placeholder="Chat name"
          class="modal-input"
          @keydown.enter="saveChat"
        />
        <div class="text-small">
          <label for="chat-description">Chat description</label>
        </div>
        <input
          id="chat-description"
          v-model="chatDescriptionInput"
          placeholder="Chat description"
          class="modal-input"
          @keydown.enter="saveChat"
        />
        <div class="text-small">
          <label for="chat-icon">Chat icon</label>
        </div>
        <input
          id="chat-icon"
          v-model="chatIconInput"
          placeholder="Chat icon"
          class="modal-input"
          @keydown.enter="saveChat"
        />
        <div v-if="store.userData.emailVerified">
          <div class="text-small">
            <label for="requireVerification">Require verification</label>
          </div>
          <div
            class="switch"
            @click="requireVerification = !requireVerification"
          >
            <input
              id="requireVerification"
              type="checkbox"
              :checked="requireVerification"
            />
            <span class="slider" />
          </div>
        </div>
        <div class="text-small">
          <label for="add-user">Add a user</label>
        </div>
        <input
          id="add-user"
          v-model="chatUserInput"
          placeholder="Add a user"
          class="modal-input"
          @keydown.enter="chatUserEnter"
        />
        <button @click="saveChat">Save</button>
        <button
          v-if="chatEdit !== 1"
          class="button-red"
          @click="deleteChat(chatEdit)"
        >
          Delete
        </button>
      </div>
    </modal>
  </transition>
  <div class="chat-container">
    <sidebar-left v-if="store.chatBarOpen === 'true'">
      <div v-if="!store.loadingChats">
        <div class="filter-button" @click="createChatShown = true">
          Create Chat
        </div>
        <div
          v-for="chat in store.userData.chatsList"
          :key="chat.id"
          style="display: flex; margin: 0 0 4px; align-items: center"
        >
          <div
            style="cursor: pointer"
            class="message-grid"
            :style="{
              backgroundColor: currentChat.id === chat.id ? '#212425' : '',
              width:
                chat.owner === store.userData.id && chat.type !== 1
                  ? 'calc(100% - 36px)'
                  : '100%'
            }"
            @click="getChat(chat.id)"
          >
            <profile-picture
              style="margin: 4px 12px 4px 4px"
              size="32"
              :avatar="
                chat.type === 1 && chat.ownerDetails.id !== store.userData.id
                  ? chat.ownerDetails.avatar
                  : chat.icon
              "
              :small="true"
            />
            <div
              style="flex-grow: 1; width: calc(100% - 88px)"
              class="message-item"
            >
              <b
                v-if="chat.type === 0 || chat.type === 2"
                class="message-text-large"
                style="
                  margin: 4px 0 2px 0;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                {{ chat.name }}
              </b>
              <b
                v-else-if="
                  chat.type === 1 && chat.ownerDetails.id !== store.userData.id
                "
                class="message-text-large"
                style="
                  margin: 4px 0 2px 0;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                {{ chat.ownerDetails.username }}
              </b>
              <b
                v-else-if="
                  chat.type === 1 && chat.ownerDetails.id === store.userData.id
                "
                class="message-text-large"
                style="
                  margin: 4px 0 2px 0;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                {{ chat.name }}
              </b>
              <p
                class="message-text-medium-gray"
                style="
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                {{ chat.description }}
              </p>
            </div>
            <div
              v-if="chat.type !== 2 && chat.associations[0].notifications"
              class="chat-notifications"
            >
              {{ chat.associations[0].notifications }}
            </div>
          </div>
          <div
            v-if="chat.owner === store.userData.id && chat.type !== 1"
            class="chat-settings"
            @click="editChat(chat)"
          >
            <icons size="20" icon="settings" />
          </div>
        </div>
      </div>
      <div v-else class="center">
        <div style="text-align: center" class="loader" />
      </div>
    </sidebar-left>
    <div
      style="
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        width: calc(100% - 700px);
      "
    >
      <div
        id="messages-div"
        style="overflow-y: auto; flex-grow: 1; padding: 8px 4px 8px 4px"
        class="scroll-bar"
      >
        <div v-if="loadingMessages" class="center">
          <div class="loader" />
        </div>
        <div v-else>
          <div style="padding: 12px 16px">
            <h1 v-if="currentChat.type !== 1">
              Welcome to {{ currentChat.name }}
            </h1>
            <h1 v-else-if="currentChat.owner !== store.userData.id">
              Welcome to your Direct Message with
              {{ currentChat?.ownerDetails.username }}
            </h1>
            <h1 v-else>
              Welcome to your Direct Message with {{ currentChat.name }}
            </h1>
            <b style="display: block; overflow-wrap: break-word">
              {{ currentChat.description }}
            </b>
            <b
              v-if="!currentChat.requireVerification && currentChat.type !== 1"
              class="message-text-medium-gray"
            >
              This chat does not require verification
            </b>
            <b
              v-else-if="currentChat.type !== 1"
              class="message-text-medium-gray"
            >
              This chat requires verification
            </b>
          </div>
          <div
            v-for="(message, index) in currentChat.messages"
            :id="'message-' + index"
            :key="message.id"
          >
            <div
              v-if="currentChat.lastRead === index"
              style="
                padding: 0 4px;
                height: 12px;
                display: flex;
                align-items: center;
              "
            >
              <div style="border-bottom: 1px solid #ff2f2f; width: 50%" />
              <p
                style="padding: 0 4px; white-space: nowrap; color: #ff2f2f"
                class="message-text-small"
              >
                New messages
              </p>
              <div style="border-bottom: 1px solid #ff2f2f; width: 50%" />
            </div>
            <div
              v-if="
                store.dayjsDate(message.createdAt) !==
                store.dayjsDate(currentChat.messages[index - 1]?.createdAt)
              "
              style="
                padding-bottom: 8px;
                height: 16px;
                display: flex;
                align-items: center;
              "
            >
              <div style="border-bottom: 1px solid #212425; width: 50%" />
              <p
                style="padding: 0 4px; white-space: nowrap"
                class="message-text-small"
              >
                {{ store.dayjsDate(message.createdAt) }}
              </p>
              <div style="border-bottom: 1px solid #212425; width: 50%" />
            </div>
            <div
              v-if="message.reply && findMessage(message.reply)"
              style="
                display: flex;
                overflow-wrap: break-word;
                margin: 0 0 8px 28px;
              "
            >
              <icons size="16" icon="reply" style="margin-right: 4px" />
              <profile-picture
                size="16"
                :avatar="findMessage(message.reply)?.user?.avatar"
                :small="true"
                @click="
                  openUser(
                    findMessage(message.reply)?.user?.id,
                    findMessage(message.reply)?.user
                  )
                "
              />
              <b
                class="message-text-medium"
                style="margin: 4px 4px 0 4px"
                @click="
                  openUser(
                    findMessage(message.reply)?.user?.id,
                    findMessage(message.reply)?.user
                  )
                "
              >
                {{
                  findMessage(message.reply)?.user?.username
                    ? "@" + findMessage(message.reply)?.user?.username
                    : "@Deleted user"
                }}
              </b>
              <p
                class="message-text-medium-gray-hover"
                style="margin-top: 4px; margin-bottom: 0"
                @click="goToMessage(findMessage(message.reply))"
              >
                {{ findMessage(message.reply)?.messageContents }}
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
              <icons
                colour="darkgrey"
                size="16"
                icon="reply"
                style="margin-right: 4px"
              />
              <icons colour="darkgrey" size="16" icon="user" />
              <b class="message-text-medium-gray" style="margin: 4px 4px 0 4px">
                Message has been deleted
              </b>
            </div>
            <div
              class="message-grid"
              style="position: relative; width: 100%; margin: 8px 4px 4px"
              :style="{
                backgroundColor: editing === message.id ? '#212425' : ''
              }"
            >
              <div
                v-if="!merge(message, currentChat.messages[index - 1])"
                style="margin: 0 4px; cursor: pointer; border-radius: 16px"
                class="message-item"
                @click="openUser(message.user.id, message.user)"
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
                    @click="openUser(message.user.id, message.user)"
                  >
                    {{
                      message.user?.username
                        ? message.user.username
                        : "Deleted user"
                    }}
                  </b>
                  <b class="message-text-small">
                    {{ " " + store.dayjsLong(message.createdAt) }}
                  </b>
                </div>
                <input
                  v-if="editing === message.id"
                  id="edit"
                  v-model="editText"
                  placeholder="Edit your message"
                  autocomplete="off"
                  @keydown.enter="editMessage(message.id)"
                />
                <custom-message
                  v-show="editing !== message.id"
                  :message="message"
                  :handle-click="handleClick"
                  :scroll="scrollDown"
                  :find-user="findUser"
                  @embed="embed = $event"
                />
              </div>
              <div v-show="editing !== message.id" class="message-icons">
                <icons
                  v-show="
                    store.userData?.admin ||
                    message.user?.id === store.userData?.id
                  "
                  style="cursor: pointer"
                  size="20"
                  :icon="message.pinned ? 'unpin' : 'pin'"
                  @click="pinMessage(message.id, message.pinned)"
                />
                <icons
                  v-show="message.user?.id === store.userData?.id"
                  style="cursor: pointer"
                  size="20"
                  icon="edit"
                  @click="
                    ;(editing = message.id),
                      (editText = message.messageContents),
                      scrollDown(true)
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
                    store.userData?.admin ||
                    message.user?.id === store.userData?.id
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
      <div>
        <transition>
          <div v-if="replyTo || scrolledUp">
            <transition>
              <div
                v-if="scrolledUp"
                :style="{
                  height: replyTo ? '36px' : '',
                  marginRight:
                    store.sidebarOpen === 'true' &&
                    !(store.search || store.pins)
                      ? '250px'
                      : store.search || store.pins
                        ? '350px'
                        : '',
                  marginLeft: store.chatBarOpen === 'true' ? '250px' : ''
                }"
                style="
                  position: fixed;
                  z-index: 1;
                  bottom: 48px;
                  cursor: pointer;
                "
                class="scroll-button"
                @click="scroll"
              >
                <icons size="12" icon="down-arrow" />
                <p class="message-text-medium">Scroll to bottom</p>
              </div>
            </transition>
            <div
              v-if="replyTo"
              class="scroll-button"
              style="
                display: flex;
                overflow-wrap: break-word;
                z-index: 2;
                position: relative;
              "
              @click="scroll"
            >
              <icons size="12" icon="reply" style="margin-right: 4px" />
              <profile-picture
                size="12"
                :avatar="findMessage(replyTo).user?.avatar"
                :small="true"
                @click="
                  openUser(
                    findMessage(replyTo).user.id,
                    findMessage(replyTo).user
                  )
                "
              />
              <b
                class="message-text-medium"
                style="margin: 0 4px 0 4px"
                @click="
                  openUser(
                    findMessage(replyTo).user.id,
                    findMessage(replyTo).user
                  )
                "
              >
                {{
                  findMessage(replyTo).user?.username
                    ? "@" + findMessage(replyTo).user?.username
                    : "@Deleted user"
                }}
              </b>
              <p
                class="message-text-medium-gray"
                style="margin: 0"
                @click="goToMessage(findMessage(replyTo))"
              >
                {{ findMessage(replyTo).messageContents }}
              </p>
            </div>
          </div>
        </transition>
        <div class="message-send">
          <input
            id="input"
            v-model="inputText"
            placeholder="Send a message"
            autofocus
            class="message-input"
            autocomplete="off"
            @keydown.enter="sendMessage"
            @keydown.up.prevent="editLast(), scrollDown(true)"
          />
          <button style="cursor: pointer" @click="sendMessage">Send</button>
        </div>
      </div>
    </div>
    <sidebar
      v-if="store.sidebarOpen === 'true' || store.search || store.pins"
      :style="{ width: store.search || store.pins ? '342px' : '' }"
    >
      <div v-if="!loadingMessages && !store.search && !store.pins">
        <div class="filter-button" @click="userSortPress()">
          <p v-if="store.sortUsers === 'id'">Sort: Id</p>
          <p v-else-if="store.sortUsers === 'username'">Sort: Username</p>
          <p v-else-if="store.sortUsers === 'status'">Sort: Status</p>
          <p v-else-if="store.sortUsers === 'statusMessage'">
            Sort: Status Message
          </p>
        </div>
        <div
          v-if="
            currentChat.users?.some(
              (someUser) => someUser?.status !== 'offline'
            )
          "
          style="
            padding: 0 4px;
            display: flex;
            height: 20px;
            align-items: center;
          "
        >
          <p style="padding-right: 4px" class="message-text-small">Online</p>
          <div style="border-bottom: 1px solid #212425; width: 100%" />
        </div>
        <div
          v-for="user in onlineUsers"
          :key="user.id"
          style="cursor: pointer; margin: 0 0 4px"
          class="message-grid"
          @contextmenu.prevent="showContextMenu($event, user)"
          @click="openUser(user.id, user)"
        >
          <div class="profile-picture">
            <profile-picture
              style="margin: 4px"
              size="32"
              :avatar="user.avatar"
              :small="true"
            />
            <svg class="online-indicator" width="15" height="15">
              <status-indicator size="5" :status="user.status" />
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
        <div
          v-if="
            currentChat.users?.some(
              (someUser) => someUser?.status === 'offline'
            )
          "
          style="
            padding: 0 4px;
            display: flex;
            height: 20px;
            align-items: center;
          "
        >
          <p style="padding-right: 4px" class="message-text-small">Offline</p>
          <div style="border-bottom: 1px solid #212425; width: 100%" />
        </div>
        <div
          v-for="user in offlineUsers"
          :key="user.id"
          style="cursor: pointer; margin: 0 0 4px"
          class="message-grid"
          @contextmenu.prevent="showContextMenu($event, user)"
          @click="openUser(user.id, user)"
        >
          <div class="profile-picture">
            <profile-picture
              style="margin: 4px"
              size="32"
              :avatar="user.avatar"
            />
            <svg class="online-indicator" width="15" height="15">
              <status-indicator size="5" :status="user.status" />
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
        <context-menu
          v-if="contextMenuVisible"
          :position="contextMenuPosition"
          @close="contextMenuVisible = false"
        >
          <div
            class="context-menu-item"
            @click="openUser(contextMenuItemUser.id, true)"
          >
            Profile
          </div>
          <div
            v-if="contextMenuItemUser.id !== store.userData.id"
            class="context-menu-item"
            @click="sendDm(contextMenuItemUser.id)"
          >
            Message {{ contextMenuItemUser.username }}
          </div>
          <div
            v-if="
              contextMenuItemUser.id !== store.userData.id &&
              contextMenuItemUser.friendRequests &&
              !contextMenuItemUser.friend[0]?.status
            "
            class="context-menu-item"
            @click="addFriend(contextMenuItemUser.id, true)"
          >
            Friend {{ contextMenuItemUser.username }}
          </div>
          <div
            v-else-if="
              contextMenuItemUser.id !== store.userData.id &&
              contextMenuItemUser.friend[0]?.status === 'accepted'
            "
            class="context-menu-item"
            @click="addFriend(contextMenuItemUser.id, true)"
          >
            Unfriend {{ contextMenuItemUser.username }}
          </div>
          <div
            v-else-if="
              contextMenuItemUser.id !== store.userData.id &&
              contextMenuItemUser.friend[0]?.status === 'pending'
            "
            class="context-menu-item"
            @click="addFriend(contextMenuItemUser.id, true)"
          >
            Cancel {{ contextMenuItemUser.username }}
          </div>
          <div
            v-else-if="
              contextMenuItemUser.id !== store.userData.id &&
              contextMenuItemUser.friend[0]?.status === 'incoming'
            "
            class="context-menu-item"
            @click="addFriend(contextMenuItemUser.id, true)"
          >
            Accept {{ contextMenuItemUser.username }}
          </div>
          <div
            v-if="
              currentChat.owner === store.userData.id &&
              contextMenuItemUser.id !== store.userData.id &&
              currentChat.type === 0
            "
            class="context-menu-item"
            @click="removeUser(contextMenuItemUser.id)"
          >
            Remove {{ contextMenuItemUser.username }}
          </div>
        </context-menu>
      </div>
      <div v-else-if="store.search">
        <input
          v-model="searchText"
          style="margin: 0"
          placeholder="Search this chat"
          autocomplete="off"
          @keydown.enter="searchChat"
        />
        <div
          v-for="(message, index) in searchMessages"
          :id="'message-' + index"
          :key="message.id"
          style="padding: 4px"
        >
          <div
            v-if="
              store.dayjsDate(message.createdAt) !==
              store.dayjsDate(searchMessages[index - 1]?.createdAt)
            "
            style="
              padding-bottom: 8px;
              height: 16px;
              display: flex;
              align-items: center;
            "
          >
            <div style="border-bottom: 1px solid #212425; width: 50%" />
            <p
              style="padding: 0 4px; white-space: nowrap"
              class="message-text-small"
            >
              {{ store.dayjsDate(message.createdAt) }}
            </p>
            <div style="border-bottom: 1px solid #212425; width: 50%" />
          </div>
          <div
            v-if="message.reply && findMessage(message.reply)"
            style="
              display: flex;
              overflow-wrap: break-word;
              margin: 0 0 8px 28px;
            "
          >
            <icons size="16" icon="reply" style="margin-right: 4px" />
            <profile-picture
              size="16"
              :avatar="findMessage(message.reply)?.user?.avatar"
              :small="true"
              @click="
                openUser(
                  findMessage(message.reply)?.user?.id,
                  findMessage(message.reply)?.user
                )
              "
            />
            <b
              class="message-text-medium"
              style="margin: 4px 4px 0 4px"
              @click="
                openUser(
                  findMessage(message.reply)?.user?.id,
                  findMessage(message.reply)?.user
                )
              "
            >
              {{
                findMessage(message.reply)?.user?.username
                  ? "@" + findMessage(message.reply)?.user?.username
                  : "@Deleted user"
              }}
            </b>
            <p
              class="message-text-medium-gray-hover"
              style="margin-top: 4px; margin-bottom: 0"
              @click="goToMessage(findMessage(message.reply))"
            >
              {{ findMessage(message.reply)?.messageContents }}
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
            <icons
              colour="darkgrey"
              size="16"
              icon="reply"
              style="margin-right: 4px"
            />
            <icons colour="darkgrey" size="16" icon="user" />
            <b class="message-text-medium-gray" style="margin: 4px 4px 0 4px">
              Message has been deleted
            </b>
          </div>
          <div
            class="message-grid"
            style="position: relative; width: 100%"
            @click="goToMessage(findMessage(message.id))"
          >
            <div
              v-if="!merge(message, searchMessages[index - 1])"
              style="margin: 0 12px 0 4px; cursor: pointer; border-radius: 16px"
              class="message-item"
              @click="openUser(message.user?.id, message.user)"
            >
              <profile-picture size="32" :avatar="message.user?.avatar" />
            </div>
            <div v-else class="message-time">
              <b class="message-text-small">
                {{ dayjsShort(message.createdAt) }}
              </b>
            </div>
            <div
              class="message-item"
              style="width: calc(100% - 48px); overflow-wrap: break-word"
            >
              <div
                v-if="!merge(message, searchMessages[index - 1])"
                class="message-header"
              >
                <b
                  class="message-text-medium"
                  @click="openUser(message.user.id, message.user)"
                >
                  {{ message.user?.username }}
                </b>
                <b class="message-text-small">
                  {{ " " + store.dayjsLong(message.createdAt) }}
                </b>
              </div>
              <custom-message
                :message="message"
                :handle-click="handleClick"
                :find-user="findUser"
                :scroll="scrollDown"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="store.pins">
        <div
          v-for="(message, index) in currentChat.pins"
          :id="'message-' + index"
          :key="message.id"
          style="padding: 4px"
        >
          <div
            v-if="
              store.dayjsDate(message.createdAt) !==
              store.dayjsDate(currentChat.pins[index - 1]?.createdAt)
            "
            style="
              padding-bottom: 8px;
              height: 16px;
              display: flex;
              align-items: center;
            "
          >
            <div style="border-bottom: 1px solid #212425; width: 50%" />
            <p
              style="padding: 0 4px; white-space: nowrap"
              class="message-text-small"
            >
              {{ store.dayjsDate(message.createdAt) }}
            </p>
            <div style="border-bottom: 1px solid #212425; width: 50%" />
          </div>
          <div
            v-if="message.reply && findMessage(message.reply)"
            style="
              display: flex;
              overflow-wrap: break-word;
              margin: 0 0 8px 28px;
            "
          >
            <icons size="16" icon="reply" style="margin-right: 4px" />
            <profile-picture
              size="16"
              :avatar="findMessage(message.reply)?.user?.avatar"
              :small="true"
              @click="
                openUser(
                  findMessage(message.reply)?.user?.id,
                  findMessage(message.reply)?.user
                )
              "
            />
            <b
              class="message-text-medium"
              style="margin: 4px 4px 0 4px"
              @click="
                openUser(
                  findMessage(message.reply)?.user?.id,
                  findMessage(message.reply)?.user
                )
              "
            >
              {{
                findMessage(message.reply)?.user?.username
                  ? "@" + findMessage(message.reply)?.user?.username
                  : "@Deleted user"
              }}
            </b>
            <p
              class="message-text-medium-gray-hover"
              style="margin-top: 4px; margin-bottom: 0"
              @click="goToMessage(findMessage(message.reply))"
            >
              {{ findMessage(message.reply)?.messageContents }}
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
            <icons
              colour="darkgrey"
              size="16"
              icon="reply"
              style="margin-right: 4px"
            />
            <icons colour="darkgrey" size="16" icon="user" />
            <b class="message-text-medium-gray" style="margin: 4px 4px 0 4px">
              Message has been deleted
            </b>
          </div>
          <div
            class="message-grid"
            style="position: relative; width: 100%"
            @click="goToMessage(findMessage(message.id))"
          >
            <div
              v-if="!merge(message, currentChat.pins[index - 1])"
              style="margin: 0 12px 0 4px; cursor: pointer; border-radius: 16px"
              class="message-item"
              @click="openUser(message.user?.id, message.user)"
            >
              <profile-picture size="32" :avatar="message.user?.avatar" />
            </div>
            <div v-else class="message-time">
              <b class="message-text-small">
                {{ dayjsShort(message.createdAt) }}
              </b>
            </div>
            <div
              class="message-item"
              style="width: calc(100% - 48px); overflow-wrap: break-word"
            >
              <div
                v-if="!merge(message, currentChat.pins[index - 1])"
                class="message-header"
              >
                <b
                  class="message-text-medium"
                  @click="openUser(message.user.id, message.user)"
                >
                  {{ message.user?.username }}
                </b>
                <b class="message-text-small">
                  {{ " " + store.dayjsLong(message.createdAt) }}
                </b>
              </div>
              <custom-message
                :message="message"
                :handle-click="handleClick"
                :find-user="findUser"
                :scroll="scrollDown"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="center">
        <div style="text-align: center" class="loader" />
      </div>
    </sidebar>
  </div>
</template>

<script setup>
import CustomMessage from "@/components/CustomMessage.vue"
import Icons from "@/components/core/Icons.vue"
import Modal from "@/components/core/Modal.vue"
import ProfilePicture from "@/components/ProfilePicture.vue"
import Sidebar from "@/components/core/Sidebar.vue"
import SidebarLeft from "@/components/core/SidebarLeft.vue"
import StatusIndicator from "@/components/StatusIndicator.vue"
import ContextMenu from "@/components/core/ContextMenu.vue"
import UserPreview from "@/components/UserPreview.vue"
import ModalSimple from "@/components/core/ModalSimple.vue"

import dayjs from "dayjs"
import { useDataStore } from "@/stores/main"
import axios from "axios"
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const store = useDataStore()
const route = useRoute()
const router = useRouter()

const searchMessages = ref([])
const embed = ref()
const currentChat = ref({})
const replyTo = ref()
const editing = ref("")
const requireVerification = ref(true)
const createChatShown = ref(false)
const createChatType = ref(true)
const loadingMessages = ref(true)
const scrolledUp = ref(false)
const showUser = ref(false)
const chatEdit = ref(-1)
const contextMenuVisible = ref(false)
const contextMenuItemUser = ref({})
const contextMenuPosition = ref({ x: 0, y: 0 })
const inputText = ref("")
const chatUserInput = ref("")

let editText
let searchText = ""
let chatNameInput
let chatDescriptionInput
let chatIconInput
let chatUsernameInput
let chatUsers

let ws

document.getElementById("favicon").href = "/icons/favicon.ico"
if (!localStorage.getItem("token")) {
  router.push("/login")
} else {
  ws = new WebSocket(
    process.env.NODE_ENV === "production"
      ? "wss://electrics01.com/ws"
      : "ws://localhost:24554/ws"
  )

  ws.onopen = () => {
    ws.send(JSON.stringify({ token: localStorage.getItem("token") }))
    console.log("Socket connected")
  }

  ws.onmessage = (event) => {
    console.log(event)
    const socketMessage = JSON.parse(event.data)
    if (socketMessage.authFail) {
      store.error = `Error 401, ${socketMessage.authFail}`
      router.push("/login")
    } else if (socketMessage.newMessage) {
      if (socketMessage.newMessage.chatId === currentChat.value.id) {
        socketMessage.newMessage.focus = false
        currentChat.value.messages.push(socketMessage.newMessage)
        scrollDown()
      }
    } else if (socketMessage.changeUser) {
      const userToUpdate = currentChat.value.users.findIndex(
        (user) => user.id === socketMessage.changeUser.id
      )
      if (userToUpdate != -1) {
        currentChat.value.users[userToUpdate] = socketMessage.changeUser
        // } else {
        // currentChat.value.users.push(socketMessage.changeUser)
      }
    }
    console.log("Data received from websocket")
  }
}

const userSort = (property) => {
  if (property !== "id") {
    currentChat.value.users
      .sort((a, b) => {
        if (a && b) {
          if (a.username === null && b.username === null) {
            return 0
          } else if (a.username === null) {
            return 1
          } else if (b.username === null) {
            return -1
          }
          return a.username.localeCompare(b.username)
        }
      })
      .sort((a, b) => {
        if (a && b) {
          if (a[property] === null && b[property] === null) {
            return 0
          } else if (a[property] === null) {
            return 1
          } else if (b[property] === null) {
            return -1
          }
          return a[property].localeCompare(b[property])
        }
      })
  } else {
    currentChat.value.users.sort((a, b) => a?.id - b?.id)
  }
}
const userSortPress = () => {
  if (store.sortUsers === "id") {
    localStorage.setItem("sortUsers", "username")
  } else if (store.sortUsers === "username") {
    localStorage.setItem("sortUsers", "status")
  } else if (store.sortUsers === "status") {
    localStorage.setItem("sortUsers", "statusMessage")
  } else {
    localStorage.setItem("sortUsers", "id")
  }
  if (localStorage.getItem("sortUsers")) {
    store.sortUsers = localStorage.getItem("sortUsers")
  }
  userSort(store.sortUsers)
}
const sendMessage = () => {
  if (inputText.value?.trim()) {
    axios
      .post("/api/message", {
        chatId: currentChat.value.id,
        messageContents: inputText.value.trim(),
        reply: replyTo.value
      })
      .then((res) => {
        store.userData.chatsList = res.data.chats
        store.chatSort()
        inputText.value = ""
        replyTo.value = null
        res.data.lastMessage.focus = false
        currentChat.value.messages.push(res.data.lastMessage)
        currentChat.value.lastRead = currentChat.value.messages.length
        scrollDown()
      })
      .catch((e) => {
        store.error = e
        setTimeout(store.errorFalse, 5000)
      })
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
      store.error = e.response.data.message
      setTimeout(store.errorFalse, 5000)
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
        } else {
          return message
        }
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
      store.error = e.response.data.message
      setTimeout(store.errorFalse, 5000)
    })
}
const editChat = (chat) => {
  chatEdit.value = chat.id
  chatNameInput = chat.name
  chatDescriptionInput = chat.description
  chatIconInput = chat.icon
  requireVerification.value = chat.requireVerification
  chatUsers = currentChat.value.users.map((user) => user.id)
}
const deleteChat = (chatId) => {
  axios
    .delete(`/api/delete-chat/${chatId}`)
    .then((res) => {
      chatEdit.value = -1
      chatNameInput = ""
      chatDescriptionInput = ""
      chatIconInput = ""
      requireVerification.value = true
      store.userData.chatsList = res.data.chats
      store.chatSort()
      currentChat.value = res.data.chat
      replyTo.value = null
      if (currentChat.value.messages) {
        currentChat.value.messages.focus = false
        scrollDown()
      }
    })
    .catch((e) => {
      store.error = e.response.data.message
      setTimeout(store.errorFalse, 5000)
    })
}
const editMessage = (messageId) => {
  if (editText.trim() === findMessage(messageId).messageContents) {
    editing.value = ""
  }
  axios
    .patch(`/api/edit/${messageId}`, {
      messageContents: editText.trim()
    })
    .then((res) => {
      editing.value = ""
      currentChat.value.messages[
        currentChat.value.messages.findIndex((e) => e.id === messageId)
      ] = res.data
    })
    .catch((e) => {
      store.error = e.response.data.message
      setTimeout(store.errorFalse, 5000)
    })
}
const searchChat = () => {
  if (searchText) {
    const keywords = searchText.toLowerCase().split(" ")
    searchMessages.value = currentChat.value.messages.filter((message) =>
      keywords.some((keyword) =>
        message.messageContents.toLowerCase().includes(keyword)
      )
    )
  }
}
const replyToMessage = (messageId) => {
  replyTo.value = messageId
  const input = document.getElementById("input")
  input?.focus()
}
const createChat = () => {
  if (!store.userData.emailVerified) {
    requireVerification.value = false
  }
  if (
    chatNameInput &&
    chatDescriptionInput &&
    typeof requireVerification.value === "boolean"
  )
    axios
      .post("/api/create-chat", {
        description: chatDescriptionInput,
        icon: chatIconInput,
        name: chatNameInput,
        requireVerification: requireVerification.value
      })
      .then((res) => {
        createChatShown.value = false
        chatNameInput = ""
        chatDescriptionInput = ""
        chatIconInput = ""
        requireVerification.value = true
        store.userData.chatsList = res.data.chats
        store.chatSort()
        currentChat.value = res.data.chat
        router.push(`/chat/${currentChat.value.id}`)
        replyTo.value = null
        if (currentChat.value.messages) {
          currentChat.value.messages.focus = false
          scrollDown()
        }
      })
      .catch((e) => {
        store.error = e.response.data.message
        setTimeout(store.errorFalse, 5000)
      })
}
const saveChat = () => {
  if (!store.userData.emailVerified) {
    requireVerification.value = false
  }
  if (
    chatNameInput &&
    chatDescriptionInput &&
    typeof requireVerification.value === "boolean"
  )
    axios
      .patch(`/api/edit-chat/${chatEdit.value}`, {
        description: chatDescriptionInput,
        icon: chatIconInput,
        name: chatNameInput,
        requireVerification: requireVerification.value,
        users: chatUsers.filter(
          (user) =>
            !currentChat.value.users.map((user) => user.id).includes(user)
        )
      })
      .then((res) => {
        chatEdit.value = -1
        chatNameInput = ""
        chatDescriptionInput = ""
        chatIconInput = ""
        requireVerification.value = true
        store.userData.chatsList = res.data.chats
        store.chatSort()
        currentChat.value = res.data.chat
        replyTo.value = null
        if (currentChat.value.messages) {
          currentChat.value.messages.focus = false
          scrollDown()
        }
      })
      .catch((e) => {
        store.error = e.response.data.message
        setTimeout(store.errorFalse, 5000)
      })
}
const chatUserEnter = async () => {
  const userId = await getUserByName(chatUserInput.value)
  chatUserInput.value = ""
  if (chatUsers.indexOf(userId.id) === -1) {
    chatUsers.push(userId.id)
  } else {
    store.error = "This user is already apart of this group"
    setTimeout(store.errorFalse, 2500)
  }
}
const dayjsShort = (date) => dayjs(date).format("HH:mm:ss")
const openUser = (userId, user) => {
  if (user !== null) {
    contextMenuVisible.value = false
    axios
      .post("/api/get-user", {
        userId
      })
      .then((res) => {
        showUser.value = res.data
        if (showUser.value.tetris) {
          showUser.value.tetris = formatINI(showUser.value.tetris)
        }
      })
      .catch((e) => {
        store.error = e.response.data.message
        setTimeout(store.errorFalse, 5000)
      })
  }
}
const getUserByName = async (username) => {
  try {
    const response = await axios.post("/api/get-user", {
      username
    })
    return response.data
  } catch (error) {
    store.error = error.response.data.message
    setTimeout(store.errorFalse, 5000)
  }
}
const chatUsernameEnter = async () => {
  createChatType.value = false
  createChatShown.value = false
  const userData = await getUserByName(chatUsernameInput)
  sendDm(userData.id)
}
const formatINI = (ini) => {
  const lines = ini.split("\r\n")

  const nonEmptyLines = lines.filter(
    (line) => line.trim() !== "" && line.includes("=")
  )

  const keyValuePairs = nonEmptyLines.map((line) => {
    const separatorIndex = line.indexOf("=")
    const key = line.slice(0, separatorIndex).trim()
    let value = line.slice(separatorIndex + 1).trim()

    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }

    return { key, value }
  })

  return keyValuePairs.map((pair) => ({
    [pair.key]: pair.value
  }))
}
const handleClick = (part) => {
  if (part.startsWith('<span @click="handleUserMentionClick(')) {
    openUser(part.match(/\d+/)[0])
  }
}
const findUser = (userId) => {
  const user = currentChat.value.users.find(
    (user) => user.id === parseInt(userId)
  )
  if (user) {
    return user
  }
  return { username: userId }
}
const removeUser = (userId) => {
  contextMenuVisible.value = false
  axios
    .post(`/api/remove/${currentChat.value.id}/${userId}`)
    .then((res) => {
      store.userData.chatsList = res.data.chats
      store.chatSort()
      currentChat.value = res.data.chat
      if (currentChat.value.messages) {
        currentChat.value.messages.focus = false
        scrollDown()
      }
    })
    .catch((e) => {
      store.error = e.response.data.message
      setTimeout(store.errorFalse, 5000)
    })
}
const scrollDown = (override) => {
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
const merge = (message, previousMessage) => {
  if (previousMessage) {
    return (
      previousMessage.userId === message.userId &&
      !message.reply &&
      !dayjs(previousMessage.createdAt).isBefore(
        dayjs(message.createdAt).subtract(15, "minutes")
      )
    )
  }
}
const findMessage = (messageId) =>
  currentChat.value.messages.findLast((message) => message.id === messageId)
const goToMessage = (messageId) => {
  const div = document.getElementById("messages-div")
  const element = document.getElementById(
    `message-${currentChat.value.messages.indexOf(messageId)}`
  )
  const elementRect = element.getBoundingClientRect()
  const absoluteElementTop = elementRect.top + div.scrollTop
  const middleOfScreen = div.clientHeight / 2
  const scrollTo = absoluteElementTop - middleOfScreen

  div.scrollTo({
    behavior: "smooth",
    top: scrollTo
  })
  element.classList.add("highlight")
  setTimeout(() => {
    element.classList.remove("highlight")
  }, 1000)
}
const editLast = () => {
  const messageEdit = currentChat.value.messages.filter(
    (message) => message.userId === store.userData.id
  )
  if (messageEdit.length > 0) {
    editText = messageEdit.slice(-1)[0].messageContents
    editing.value = messageEdit.slice(-1)[0].id
  }
}
const addFriend = (userId, notOpen) => {
  axios
    .post(`/api/friend/${userId}`)
    .then(async () => {
      if (!notOpen) {
        openUser(userId)
      } else {
        await getChat(currentChat.value.id)
        contextMenuItemUser.value = await findUser(contextMenuItemUser.value.id)
      }
    })
    .catch((e) => {
      store.error = e.response.data.message
      setTimeout(store.errorFalse, 5000)
    })
}
const sendDm = (id) => {
  contextMenuVisible.value = false
  axios
    .post(`/api/direct-message/${id}`)
    .then((res) => {
      showUser.value = false
      editing.value = ""
      store.userData.chatsList = res.data.chats
      store.chatSort()
      inputText.value = ""
      currentChat.value = res.data.chat
      currentChat.value.messages.focus = false
      router.push(`/chat/${currentChat.value.id}`)
      scrollDown()
    })
    .catch((e) => {
      store.error = e.response.data.message
      setTimeout(store.errorFalse, 5000)
    })
}
const showContextMenu = (event, user) => {
  event.preventDefault()
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true
  contextMenuItemUser.value = user
}
const escPressed = ({ key }) => {
  if (key === "Escape") {
    if (contextMenuVisible.value) {
      contextMenuVisible.value = false
    } else if (editing.value === "status") {
      editing.value = ""
    } else if (showUser.value) {
      showUser.value = false
    } else if (embed.value) {
      embed.value = false
    } else if (chatEdit.value !== -1) {
      chatEdit.value = -1
    } else if (editing.value) {
      editing.value = ""
    } else if (replyTo.value) {
      replyTo.value = null
    } else if (
      !showUser.value &&
      currentChat.value.lastRead === currentChat.value.messages.length
    ) {
      scrollDown(true)
    } else if (
      currentChat.value.lastRead !== currentChat.value.messages.length
    ) {
      currentChat.value.lastRead = currentChat.value.messages.length
      axios.post(`/api/read-new/${currentChat.value.id}`)
      store.userData.chatsList[
        store.userData.chatsList.findIndex(
          (chat) => chat.id === parseInt(route.params.chatId)
        )
      ].associations[0].notifications = 0
    }
  }
}
const scrollEvent = () => {
  const div = document.getElementById("messages-div")
  const { scrollHeight } = div
  const { scrollTop } = div
  const { clientHeight } = div
  scrolledUp.value =
    scrollTop + clientHeight <=
    scrollHeight - (clientHeight / 2 > 200 ? 200 : clientHeight / 2)
}
const onlineUsers = computed(() =>
  currentChat.value.users.filter((user) => user?.status === "online")
)
const offlineUsers = computed(() =>
  currentChat.value.users.filter((user) => user?.status === "offline")
)
async function getChat(id) {
  if (!id) {
    id = store.userData.chatsList[0].id
  }
  if (id !== currentChat.value.id) {
    loadingMessages.value = true
  }
  await axios
    .get(`/api/chat/${id}`)
    .then((res) => {
      currentChat.value = res.data
      currentChat.value.messages.focus = false
      router.push(`/chat/${currentChat.value.id}`)
      userSort(store.sortUsers)
      replyTo.value = null
      loadingMessages.value = false
      scrollDown(true)
    })
    .catch((e) => {
      if (e.response.status === 400) {
        router.push("/chat/" + store.userData.chatsList[0].id)
      } else {
        store.error = `Error 503, Cannot Connect to Server ${e}`
        setTimeout(store.errorFalse, 5000)
      }
    })
}

onMounted(async () => {
  document.addEventListener("keydown", escPressed)
  const messagesDiv = document.getElementById("messages-div")
  if (messagesDiv) messagesDiv.addEventListener("scroll", scrollEvent)
  if (route.path.startsWith("/user")) {
    openUser(route.params.id)
  }
  await getChat(route.params.chatId)
})
onUnmounted(() => {
  if (ws) ws.close()
  document.removeEventListener("keydown", escPressed)
  const messagesDiv = document.getElementById("messages-div")
  if (messagesDiv) messagesDiv.removeEventListener("scroll", scrollEvent)
})
watch(editing, () => {
  store.editFocus()
})
watch(
  () => route.params.chatId,
  async () => {
    await getChat(route.params.chatId)
  }
)
</script>
