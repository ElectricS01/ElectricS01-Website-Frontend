<template>
  <user-preview
    :showUser="showUser"
    :editing="editing"
    :sendDm="sendDm"
    :addFriend="addFriend"
    @showUser="showUser = $event"
    @editing="editing = $event"
    @statusMessage="showUser.statusMessage = $event"
    @users="currentChat.user = $event"
    @userSort="userSort(store.sortUsers)"
  ></user-preview>
  <transition>
    <modal-simple v-if="embed" :is-active="embed" @close="embed = false">
      <img :src="embed" class="message-embed" alt="Embedded image" />
    </modal-simple>
  </transition>
  <transition>
    <modal
      v-if="createChatShown"
      :is-active="createChatShown"
      @close="
        ;(createChatShown = false),
          (chatNameInput = ''),
          (chatDescriptionInput = ''),
          (chatIconInput = ''),
          (requireVerification = true)
      "
    >
      <div class="chanel-menu">
        <p class="message-text-large">Create New Chat</p>
        <div class="text-small">
          <label class="text-small" for="chat-name">Chat name</label>
        </div>
        <input
          placeholder="Chat name"
          @keydown.enter="createChat"
          class="modal-input"
          v-model="chatNameInput"
          id="chat-name"
        />
        <div class="text-small">
          <label for="chat-description">Chat description</label>
        </div>
        <input
          placeholder="Chat description"
          @keydown.enter="createChat"
          class="modal-input"
          v-model="chatDescriptionInput"
          id="chat-description"
        />
        <div class="text-small">
          <label for="chat-icon">Chat icon</label>
        </div>
        <input
          placeholder="Chat icon"
          @keydown.enter="createChat"
          class="modal-input"
          v-model="chatIconInput"
          id="chat-icon"
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
              type="checkbox"
              :checked="requireVerification"
              id="requireVerification"
            />
            <span class="slider"></span>
          </div>
        </div>
        <button @click="createChat">Create</button>
      </div>
    </modal>
  </transition>
  <transition>
    <modal
      v-if="chatEdit"
      :is-active="chatEdit !== false"
      @close="
        ;(chatEdit = false),
          (chatNameInput = ''),
          (chatDescriptionInput = ''),
          (chatIconInput = ''),
          (requireVerification = true)
      "
    >
      <div class="chanel-menu">
        <p class="message-text-large">Edit Chat</p>
        <div class="text-small">
          <label class="text-small" for="chat-name">Chat name</label>
        </div>
        <input
          placeholder="Chat name"
          @keydown.enter="saveChat"
          class="modal-input"
          v-model="chatNameInput"
          id="chat-name"
        />
        <div class="text-small">
          <label for="chat-description">Chat description</label>
        </div>
        <input
          placeholder="Chat description"
          @keydown.enter="saveChat"
          class="modal-input"
          v-model="chatDescriptionInput"
          id="chat-description"
        />
        <div class="text-small">
          <label for="chat-icon">Chat icon</label>
        </div>
        <input
          placeholder="Chat icon"
          @keydown.enter="saveChat"
          class="modal-input"
          v-model="chatIconInput"
          id="chat-icon"
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
              type="checkbox"
              :checked="requireVerification"
              id="requireVerification"
            />
            <span class="slider"></span>
          </div>
        </div>
        <div class="text-small">
          <label for="add-user">Add a user</label>
        </div>
        <input
          placeholder="Add a user"
          @keydown.enter="chatUserEnter"
          class="modal-input"
          v-model="chatUserInput"
          id="add-user"
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
      <div v-if="!loadingChats">
        <div class="filter-button" @click="createChatShown = true">
          Create chat
        </div>
        <div
          v-for="chat in chatsList"
          :key="chat"
          style="display: flex; margin: 0 0 4px; align-items: center"
        >
          <div
            style="cursor: pointer"
            class="message-grid"
            @click="getChat(chat.id)"
            :style="{
              backgroundColor: currentChat.id === chat.id ? '#212425' : '',
              width:
                chat.owner === store.userData.id && chat.type !== 1
                  ? 'calc(100% - 36px)'
                  : '100%'
            }"
          >
            <div class="profile-picture">
              <profile-picture
                style="margin: 4px"
                size="32"
                :avatar="
                  chat.type === 1 && chat.ownerDetails.id !== store.userData.id
                    ? chat.ownerDetails?.avatar
                    : chat.icon
                "
                :small="true"
              ></profile-picture>
            </div>
            <div
              style="flex-grow: 1; width: calc(100% - 48px)"
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
          </div>
          <div
            v-if="chat.owner === store.userData.id && chat.type !== 1"
            @click="editChat(chat)"
            class="chats-settings"
          >
            <icons size="20" icon="settings"></icons>
          </div>
        </div>
      </div>
      <div class="center" v-else>
        <div style="text-align: center" class="loader"></div>
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
        style="overflow-y: auto; flex-grow: 1; padding: 8px 4px 8px 4px"
        id="div"
        class="scroll-bar"
      >
        <div v-if="loadingMessages" class="center">
          <div class="loader"></div>
        </div>
        <div v-else>
          <div style="padding: 16px">
            <h1 v-if="currentChat.type !== 1">
              Welcome to {{ currentChat.name }}
            </h1>
            <h1 v-else-if="currentChat.owner !== store.userData.id">
              Welcome to your Direct Message with
              {{ currentChat?.users[0].username }}
            </h1>
            <h1 v-else>
              Welcome to your Direct Message with {{ currentChat.name }}
            </h1>
            <b style="display: block; overflow-wrap: break-word">
              {{ currentChat.description }}
            </b>
            <b
              class="message-text-medium-gray"
              v-if="!currentChat.requireVerification && currentChat.type !== 1"
            >
              This chat does not require verification
            </b>
            <b
              class="message-text-medium-gray"
              v-else-if="currentChat.type !== 1"
            >
              This chat requires verification
            </b>
          </div>
          <div
            v-for="(message, index) in currentChat.messages"
            :key="message"
            :id="'message-' + index"
            style="padding: 4px"
          >
            <div
              v-if="latest === message.id - 1"
              style="
                padding-bottom: 8px;
                height: 16px;
                display: flex;
                align-items: center;
              "
            >
              <div style="border-bottom: 1px solid #ff2f2f; width: 50%"></div>
              <p
                style="padding: 0 4px; white-space: nowrap; color: #ff2f2f"
                class="message-text-small"
              >
                New messages
              </p>
              <div style="border-bottom: 1px solid #ff2f2f; width: 50%"></div>
            </div>
            <div
              style="
                padding-bottom: 8px;
                height: 16px;
                display: flex;
                align-items: center;
              "
              v-if="
                store.dayjsDate(message.createdAt) !==
                store.dayjsDate(currentChat.messages[index - 1]?.createdAt)
              "
            >
              <div style="border-bottom: 1px solid #212425; width: 50%"></div>
              <p
                style="padding: 0 4px; white-space: nowrap"
                class="message-text-small"
              >
                {{ store.dayjsDate(message.createdAt) }}
              </p>
              <div style="border-bottom: 1px solid #212425; width: 50%"></div>
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
              ></profile-picture>
              <b
                class="message-text-medium"
                @click="
                  openUser(
                    findMessage(message.reply)?.user?.id,
                    findMessage(message.reply)?.user
                  )
                "
                style="margin: 4px 4px 0 4px"
              >
                {{
                  findMessage(message.reply)?.user?.username
                    ? "@" + findMessage(message.reply)?.user?.username
                    : "@Deleted user"
                }}
              </b>
              <p
                class="message-text-medium-gray-hover"
                @click="goToMessage(findMessage(message.reply))"
                style="margin-top: 4px; margin-bottom: 0"
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
                color="darkgrey"
                size="16"
                icon="reply"
                style="margin-right: 4px"
              />
              <icons color="darkgrey" size="16" icon="account" />
              <b class="message-text-medium-gray" style="margin: 4px 4px 0 4px">
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
                @click="openUser(message.user?.id, message?.user)"
                style="margin: 0 4px; cursor: pointer; border-radius: 16px"
                class="message-item"
              >
                <profile-picture
                  style="margin: 4px"
                  size="32"
                  :avatar="message.user?.avatar"
                ></profile-picture>
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
                <div style="line-height: 11.5px" v-if="!merge(message, index)">
                  <b
                    class="message-text-medium"
                    @click="openUser(message.user?.id, message?.user)"
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
                  placeholder="Edit your message"
                  @keydown.enter="editMessage(message.id)"
                  v-model="editText"
                  id="edit"
                  autocomplete="off"
                />
                <custom-message
                  v-show="editing !== message.id"
                  :message="message"
                  :handleClick="handleClick"
                  :scroll="scroll"
                  :findUser="findUser"
                  @embed="embed = $event"
                ></custom-message>
              </div>
              <div class="message-icons" v-show="editing !== message.id">
                <icons
                  v-show="message.user?.id === store.userData?.id"
                  style="cursor: pointer"
                  size="20"
                  icon="edit"
                  @click="
                    ;(editing = message.id),
                      (editText = message.messageContents),
                      scroll(message)
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
                :style="{
                  height: replyTo ? '36px' : '',
                  marginRight:
                    store.sidebarOpen === 'true' && !store.search
                      ? '250px'
                      : store.search
                      ? '350px'
                      : '',
                  marginLeft: store.chatBarOpen === 'true' ? '250px' : ''
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
                <icons size="12" icon="down-arrow" />
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
              ></profile-picture>
              <b
                class="message-text-medium"
                @click="
                  openUser(
                    findMessage(replyTo).user.id,
                    findMessage(replyTo).user
                  )
                "
                style="margin: 0 4px 0 4px"
              >
                {{
                  findMessage(replyTo).user?.username
                    ? "@" + findMessage(replyTo).user?.username
                    : "@Deleted user"
                }}
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
            class="message-input"
            v-model="inputText"
            id="input"
            autocomplete="off"
          />
          <button @click="submit" style="cursor: pointer">Send</button>
        </div>
      </div>
    </div>
    <sidebar
      v-if="store.sidebarOpen === 'true' || store.search"
      :style="{ width: store.search ? '342px' : '' }"
    >
      <div v-if="!loadingUsers && !store.search">
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
            currentChat.users?.some((someUser) => someUser.status !== 'offline')
          "
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
        <div
          v-for="user in onlineUsers"
          :key="user"
          @contextmenu.prevent="showContextMenu($event, user)"
          style="cursor: pointer; margin: 0 0 4px"
          class="message-grid"
          @click="openUser(user.id, user)"
        >
          <div class="profile-picture">
            <profile-picture
              style="margin: 4px"
              size="32"
              :avatar="user.avatar"
              :small="true"
            ></profile-picture>
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
        <div
          v-if="
            currentChat.users?.some((someUser) => someUser.status === 'offline')
          "
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
        <div
          v-for="user in offlineUsers"
          :key="user"
          @contextmenu.prevent="showContextMenu($event, user)"
          style="cursor: pointer; margin: 0 0 4px"
          class="message-grid"
          @click="openUser(user.id, user)"
        >
          <div class="profile-picture">
            <profile-picture
              style="margin: 4px"
              size="32"
              :avatar="user.avatar"
            ></profile-picture>
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
        <context-menu
          v-if="contextMenuVisible"
          @close="contextMenuVisible = false"
          :position="contextMenuPosition"
        >
          <div
            class="context-menu-item"
            @click="openUser(contextMenuItemUser.id, true)"
          >
            Profile
          </div>
          <div
            class="context-menu-item"
            v-if="contextMenuItemUser.id !== store.userData.id"
            @click="sendDm(contextMenuItemUser.id)"
          >
            Message {{ contextMenuItemUser.username }}
          </div>
          <div
            class="context-menu-item"
            v-if="
              contextMenuItemUser.id !== store.userData.id &&
              contextMenuItemUser.friendRequests &&
              !contextMenuItemUser.friend[0]?.status
            "
            @click="addFriend(contextMenuItemUser.id, true)"
          >
            Friend {{ contextMenuItemUser.username }}
          </div>
          <div
            class="context-menu-item"
            v-else-if="
              contextMenuItemUser.id !== store.userData.id &&
              contextMenuItemUser.friend[0]?.status === 'accepted'
            "
            @click="addFriend(contextMenuItemUser.id, true)"
          >
            Unfriend {{ contextMenuItemUser.username }}
          </div>
          <div
            class="context-menu-item"
            v-else-if="
              contextMenuItemUser.id !== store.userData.id &&
              contextMenuItemUser.friend[0]?.status === 'pending'
            "
            @click="addFriend(contextMenuItemUser.id, true)"
          >
            Cancel {{ contextMenuItemUser.username }}
          </div>
          <div
            class="context-menu-item"
            v-else-if="
              contextMenuItemUser.id !== store.userData.id &&
              contextMenuItemUser.friend[0]?.status === 'incoming'
            "
            @click="addFriend(contextMenuItemUser.id, true)"
          >
            Accept {{ contextMenuItemUser.username }}
          </div>
          <div
            class="context-menu-item"
            v-if="
              currentChat.owner === store.userData.id &&
              contextMenuItemUser.id !== store.userData.id &&
              currentChat.type === 0
            "
            @click="removeUser(contextMenuItemUser.id)"
          >
            Remove {{ contextMenuItemUser.username }}
          </div>
        </context-menu>
      </div>
      <div v-else-if="store.search">
        <input
          style="margin: 0"
          placeholder="Search this chat"
          @keydown.enter="searchChat"
          v-model="searchText"
          autocomplete="off"
        />
        <div
          v-for="(message, index) in searchMessages"
          :key="message"
          :id="'message-' + index"
          style="padding: 4px"
        >
          <div
            style="
              padding-bottom: 8px;
              height: 16px;
              display: flex;
              align-items: center;
            "
            v-if="
              store.dayjsDate(message.createdAt) !==
              store.dayjsDate(currentChat.messages[index - 1]?.createdAt)
            "
          >
            <div style="border-bottom: 1px solid #212425; width: 50%"></div>
            <p
              style="padding: 0 4px; white-space: nowrap"
              class="message-text-small"
            >
              {{ store.dayjsDate(message.createdAt) }}
            </p>
            <div style="border-bottom: 1px solid #212425; width: 50%"></div>
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
            ></profile-picture>
            <b
              class="message-text-medium"
              @click="
                openUser(
                  findMessage(message.reply)?.user?.id,
                  findMessage(message.reply)?.user
                )
              "
              style="margin: 4px 4px 0 4px"
            >
              {{
                findMessage(message.reply)?.user?.username
                  ? "@" + findMessage(message.reply)?.user?.username
                  : "@Deleted user"
              }}
            </b>
            <p
              class="message-text-medium-gray-hover"
              @click="goToMessage(findMessage(message.reply))"
              style="margin-top: 4px; margin-bottom: 0"
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
              color="darkgrey"
              size="16"
              icon="reply"
              style="margin-right: 4px"
            />
            <icons color="darkgrey" size="16" icon="account" />
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
              v-if="!merge(message, index)"
              @click="openUser(message.user?.id, message?.user)"
              style="margin: 0 12px 0 4px; cursor: pointer; border-radius: 16px"
              class="message-item"
            >
              <profile-picture
                size="32"
                :avatar="message.user?.avatar"
              ></profile-picture>
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
              <div style="line-height: 11.5px" v-if="!merge(message, index)">
                <b
                  class="message-text-medium"
                  @click="openUser(message.user?.id, message?.user)"
                >
                  {{ message.user?.username }}
                </b>
                <b class="message-text-small">
                  {{ " " + store.dayjsLong(message.createdAt) }}
                </b>
              </div>
              <custom-message
                :message="message"
                :handleClick="handleClick"
                :findUser="findUser"
                :scroll="scroll"
              ></custom-message>
            </div>
          </div>
        </div>
      </div>
      <div class="center" v-else>
        <div style="text-align: center" class="loader"></div>
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

document.getElementById("favicon").href = "/icons/favicon.ico"
</script>

<script>
import dayjs from "dayjs"
import router from "@/router"
import { useDataStore } from "@/stores/main"
import axios from "axios"
import { nextTick, ref } from "vue"

const store = useDataStore()

const latest = ref(parseInt(localStorage.getItem("latest")))
const searchMessages = ref([])
const chatsList = ref([])
const embed = ref()
const currentChat = ref({})
const replyTo = ref()
const editing = ref()
const requireVerification = ref(true)

let inputText
let editText
let searchText
let chatNameInput
let chatDescriptionInput
let chatIconInput
let chatUserInput
export default {
  data() {
    return {
      createChatShown: false,
      loadingMessages: true,
      loadingUsers: true,
      loadingChats: true,
      scrolledUp: false,
      showUser: false,
      chatUsers: [],
      chatEdit: false,
      contextMenuVisible: false,
      contextMenuItemUser: {},
      contextMenuPosition: { x: 0, y: 0 }
    }
  },
  methods: {
    async getChats() {
      await axios
        .get("/api/chats")
        .then(async (res) => {
          chatsList.value = res.data
          this.loadingChats = false
          this.chatSort()
          if (
            chatsList.value.find(
              (chat) => chat.id === parseInt(this.$route.params.id)
            )
          ) {
            await this.getChat(this.$route.params.id)
          } else {
            await this.getChat()
            router.push("/chat/1")
          }
        })
        .catch((e) => {
          if (e.message === "Request failed with status code 401") {
            store.error = "Error 401, You are not logged in"
            router.push("/login")
          } else {
            store.error = "Error 503, Cannot Connect to Server " + e
          }
        })
    },
    userSortPress() {
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
      this.userSort(store.sortUsers)
    },
    userSort(property) {
      if (property !== "id") {
        currentChat.value.users
          .sort(function (a, b) {
            if (a.username === null && b.username === null) {
              return 0
            } else if (a.username === null) {
              return 1
            } else if (b.username === null) {
              return -1
            } else {
              return a.username.localeCompare(b.username)
            }
          })
          .sort(function (a, b) {
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
        currentChat.value.users.sort(function (a, b) {
          return a.id - b.id
        })
      }
    },
    chatSort() {
      chatsList.value.sort((a, b) => {
        if (a.latest && b.latest) {
          return new Date(b.latest) - new Date(a.latest)
        } else if (a.latest) {
          return -1
        } else if (b.latest) {
          return 1
        }
        return 0
      })
    },
    submit() {
      if (inputText.trim()) {
        axios
          .post("/api/message", {
            messageContents: inputText.trim(),
            reply: replyTo.value,
            chatId: currentChat.value.id
          })
          .then((res) => {
            chatsList.value = res.data.chats
            this.chatSort()
            currentChat.value = res.data.chat
            localStorage.setItem(
              "latest",
              currentChat.value.messages[currentChat.value.messages.length - 1]
                .id
            )
            inputText = ""
            replyTo.value = null
            currentChat.value.messages.focus = false
            this.scroll()
          })
          .catch((e) => {
            store.error = e.response.data.message
            setTimeout(store.errorFalse, 5000)
          })
      }
    },
    deleteMessage(messageId) {
      axios
        .delete(`/api/delete/${messageId}`)
        .then((res) => {
          currentChat.value.messages = res.data
          currentChat.value.messages.focus = false
          this.scroll()
        })
        .catch((e) => {
          store.error = e.response.data.message
          setTimeout(store.errorFalse, 5000)
        })
    },
    editChat(chat) {
      this.chatEdit = chat.id
      chatNameInput = chat.name
      chatDescriptionInput = chat.description
      chatIconInput = chat.icon
      requireVerification.value = chat.requireVerification
      this.chatUsers = currentChat.value.users.map((user) => user.id)
    },
    deleteChat(chatId) {
      axios
        .delete(`/api/delete-chat/${chatId}`)
        .then((res) => {
          this.chatEdit = false
          chatNameInput = ""
          chatDescriptionInput = ""
          chatIconInput = ""
          requireVerification.value = true
          chatsList.value = res.data.chats
          this.chatSort()
          currentChat.value = res.data.chat
          replyTo.value = null
          if (currentChat.value.messages) {
            currentChat.value.messages.focus = false
            this.scroll()
          }
        })
        .catch((e) => {
          store.error = e.response.data.message
          setTimeout(store.errorFalse, 5000)
        })
    },
    editMessage(messageId) {
      if (editText.trim() === this.findMessage(messageId).messageContents) {
        return (editing.value = false)
      }
      axios
        .patch(`/api/edit/${messageId}`, {
          messageContents: editText.trim()
        })
        .then((res) => {
          editing.value = false
          currentChat.value.messages = res.data
          currentChat.value.messages.focus = false
          this.scroll()
        })
        .catch((e) => {
          store.error = e.response.data.message
          setTimeout(store.errorFalse, 5000)
        })
    },
    searchChat() {
      if (searchText) {
        const keywords = searchText.toLowerCase().split(" ")

        searchMessages.value = currentChat.value.messages.filter((message) => {
          return keywords.some((keyword) => {
            return message.messageContents.toLowerCase().includes(keyword)
          })
        })
      }
    },
    replyToMessage(messageId) {
      replyTo.value = messageId
      const input = document.getElementById("input")
      input?.focus()
    },
    async getChat(id) {
      await axios
        .get(`/api/chat/${id || 1}`)
        .then((res) => {
          currentChat.value = res.data
          router.push(`/chat/${currentChat.value.id}`)
          this.userSort(store.sortUsers)
          this.loadingUsers = false
          replyTo.value = null
          this.loadingMessages = false
          currentChat.value.messages.focus = false
          this.scroll()
        })
        .catch((e) => {
          store.error = e.response.data.message
          setTimeout(store.errorFalse, 5000)
        })
    },
    createChat() {
      if (store.userData.emailVerified === false) {
        requireVerification.value = false
      }
      if (
        chatNameInput &&
        chatDescriptionInput &&
        typeof requireVerification.value === "boolean"
      )
        axios
          .post("/api/create-chat", {
            name: chatNameInput,
            description: chatDescriptionInput,
            icon: chatIconInput,
            requireVerification: requireVerification
          })
          .then((res) => {
            this.createChatShown = false
            chatNameInput = ""
            chatDescriptionInput = ""
            chatIconInput = ""
            requireVerification.value = true
            chatsList.value = res.data.chats
            this.chatSort()
            currentChat.value = res.data.chat
            replyTo.value = null
            if (currentChat.value.messages) {
              currentChat.value.messages.focus = false
              this.scroll()
            }
          })
          .catch((e) => {
            store.error = e.response.data.message
            setTimeout(store.errorFalse, 5000)
          })
    },
    saveChat() {
      if (store.userData.emailVerified === false) {
        requireVerification.value = false
      }
      if (
        chatNameInput &&
        chatDescriptionInput &&
        typeof requireVerification.value === "boolean"
      )
        axios
          .patch(`/api/edit-chat/${this.chatEdit}`, {
            name: chatNameInput,
            description: chatDescriptionInput,
            icon: chatIconInput,
            requireVerification: requireVerification,
            users: this.chatUsers.filter(
              (user) =>
                !currentChat.value.users.map((user) => user.id).includes(user)
            )
          })
          .then((res) => {
            this.chatEdit = false
            chatNameInput = ""
            chatDescriptionInput = ""
            chatIconInput = ""
            requireVerification.value = true
            chatsList.value = res.data.chats
            this.chatSort()
            currentChat.value = res.data.chat
            replyTo.value = null
            if (currentChat.value.messages) {
              currentChat.value.messages.focus = false
              this.scroll()
            }
          })
          .catch((e) => {
            store.error = e.response.data.message
            setTimeout(store.errorFalse, 5000)
          })
    },
    chatUserEnter() {
      const userId = parseInt(this.chatUserInput)
      this.chatUserInput = ""
      if (this.chatUsers.indexOf(userId) === -1 && Number.isInteger(userId)) {
        this.chatUsers.push(userId)
      } else {
        store.error = "This user is already apart of this group"
        setTimeout(store.errorFalse, 2500)
      }
    },
    dayjsShort(date) {
      return dayjs(date).format("HH:mm:ss")
    },
    openUser(userId, user) {
      if (user !== null) {
        this.contextMenuVisible = false
        axios
          .get("/api/user/" + userId)
          .then((res) => {
            this.showUser = res.data
            if (this.showUser.tetris) {
              this.showUser.tetris = this.formatINI(this.showUser.tetris)
            }
          })
          .catch((e) => {
            store.error = e.response.data.message
            console.log(e)
            setTimeout(store.errorFalse, 5000)
          })
      }
    },
    formatINI(ini) {
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
    },
    handleClick(part) {
      if (part.startsWith('<span @click="handleUserMentionClick(')) {
        this.openUser(part.match(/\d+/)[0])
      }
    },
    findUser(userId) {
      const user = currentChat.value.users.find(
        (user) => user.id === parseInt(userId)
      )
      if (user) {
        return user
      } else return { username: userId }
    },
    removeUser(userId) {
      this.contextMenuVisible = false
      axios
        .post(`/api/remove/${currentChat.value.id}/${userId}`)
        .then((res) => {
          chatsList.value = res.data.chats
          this.chatSort()
          currentChat.value = res.data.chat
          if (currentChat.value.messages) {
            currentChat.value.messages.focus = false
            this.scroll()
          }
        })
        .catch((e) => {
          store.error = e.response.data.message
          setTimeout(store.errorFalse, 5000)
        })
    },
    scroll(override) {
      nextTick(() => {
        try {
          if ((!this.scrolledUp || override) && currentChat.value.messages) {
            const lastIndex = currentChat.value.messages.length - 1
            const lastMessage = document.querySelector(`#message-${lastIndex}`)
            if (editing.value) {
              this.scrolledUp = false
              lastMessage.scrollIntoView()
            } else if (lastMessage) {
              lastMessage.scrollIntoView()
              this.scrolledUp = false
              store.editFocus()
            }
          }
        } catch (e) {
          console.log(e)
        }
      })
    },
    merge(message, index) {
      if (currentChat.value.messages[index - 1]) {
        const previousMessage = currentChat.value.messages[index - 1]
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
      return currentChat.value.messages.find(
        (message) => message.id === messageId
      )
    },
    goToMessage(messageId) {
      const div = document.getElementById("div")
      const element = document.getElementById(
        "message-" + currentChat.value.messages.indexOf(messageId)
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
    editLast() {
      this.messageEdit = currentChat.value.messages.filter(
        (message) => Number(message.userName) === store.userData.id
      )
      if (this.messageEdit.length > 0) {
        editText = this.messageEdit.slice(-1)[0].messageContents
        editing.value = this.messageEdit.slice(-1)[0].id
      }
    },
    addFriend(userId, notOpen) {
      axios
        .post(`/api/friend/${userId}`)
        .then(async () => {
          if (!notOpen) {
            this.openUser(userId)
          } else {
            await this.getChat(currentChat.value.id)
            this.contextMenuItemUser = await this.findUser(
              this.contextMenuItemUser.id
            )
          }
        })
        .catch((e) => {
          store.error = e.response.data.message
          setTimeout(store.errorFalse, 5000)
        })
    },
    sendDm(id) {
      this.contextMenuVisible = false
      axios
        .post(`/api/direct-message/${id}`)
        .then((res) => {
          this.showUser = false
          editing.value = false
          chatsList.value = res.data.chats
          this.chatSort()
          currentChat.value = res.data.chat
          inputText = ""
          replyTo.value = null
          currentChat.value.messages.focus = false
          this.scroll()
        })
        .catch((e) => {
          store.error = e.response
          setTimeout(store.errorFalse, 5000)
        })
    },
    showContextMenu(event, user) {
      event.preventDefault()
      this.contextMenuPosition = { x: event.clientX, y: event.clientY }
      this.contextMenuVisible = true
      this.contextMenuItemUser = user
    },
    escPressed({ key }) {
      if (key === "Escape") {
        if (this.contextMenuVisible) {
          this.contextMenuVisible = false
        } else if (editing.value === "status") {
          editing.value = false
        } else if (this.showUser) {
          this.showUser = false
        } else if (embed.value) {
          embed.value = false
        } else if (this.chatEdit) {
          this.chatEdit = false
        } else if (editing.value) {
          editing.value = false
        } else if (replyTo.value) {
          replyTo.value = null
        } else if (!this.showUser) {
          this.scroll(true)
        }
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
    }
  },
  computed: {
    onlineUsers() {
      return currentChat.value.users.filter((user) => user.status === "online")
    },
    offlineUsers() {
      return currentChat.value.users.filter((user) => user.status === "offline")
    }
  },
  async mounted() {
    document.addEventListener("keydown", this.escPressed)
    const div = document.getElementById("div")
    div.addEventListener("scroll", this.scrollEvent)

    if (this.$route.path.startsWith("/user")) {
      this.openUser(this.$route.params.id)
    }
    await this.getChats()
    this.scroll(true)
  },
  beforeRouteLeave() {
    document.removeEventListener("keydown", this.escPressed)
    const div = document.getElementById("div")
    div.removeEventListener("scroll", this.scrollEvent)
  },
  unmounted() {
    document.removeEventListener("keydown", this.escPressed)
  },
  watch: {
    editing() {
      store.editFocus()
    }
  }
}
</script>
