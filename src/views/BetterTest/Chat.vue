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
        alt="Profile banner"
        class="profile-banner"
      />
      <div class="profile-page">
        <div class="profile-grid">
          <div class="profile-picture-large">
            <profile-picture
              size="80"
              :avatar="showUser.avatar"
            ></profile-picture>
            <svg class="online-indicator" width="20" height="20">
              <status-indicator
                size="8"
                :status="showUser.status"
              ></status-indicator>
            </svg>
          </div>
          <div
            style="
              flex: 1 1 auto;
              word-wrap: break-word;
              overflow: hidden;
              text-overflow: ellipsis;
            "
            class="message-item"
          >
            <h4 style="word-wrap: break-word">{{ showUser.username }}</h4>
            <div v-if="editing !== 'status'">
              <p class="message-text-large" style="word-wrap: break-word">
                {{ showUser.statusMessage }}
                <icons
                  v-if="showUser.id === $store.userData.id"
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
              v-model="editStatus"
              style="margin: 1px; width: calc(100% - 2px)"
              id="status"
              autocomplete="off"
            />
          </div>
          <div style="flex: 0 1 auto; white-space: nowrap">
            <button
              v-if="
                (showUser.id !== $store.userData.id &&
                  showUser.directMessages !== 'no one') ||
                (showUser.directMessages !== 'no one' &&
                  showUser.friend?.status)
              "
              class="profile-button-message"
              @click="sendDm(showUser.id)"
            >
              <icons
                style="padding-right: 4px"
                color="#1e90ff"
                size="16"
                icon="message"
              />
              Send Message
            </button>
            <button
              v-if="
                showUser.friendRequests &&
                showUser.id !== $store.userData.id &&
                !showUser.friend?.status
              "
              class="profile-button-add"
              style="color: #47bf4c"
              @click="addFriend(showUser.id)"
            >
              <icons
                style="padding-right: 4px"
                color="#47bf4c"
                size="16"
                icon="add-user"
              />
              Add Friend
            </button>
            <button
              v-if="
                showUser.id !== $store.userData.id &&
                showUser.friend?.status === 'accepted'
              "
              class="profile-button-remove"
              style="color: #ff2f2f"
              @click="addFriend(showUser.id)"
            >
              <icons
                style="padding-right: 4px"
                color="#FF2F2F"
                size="16"
                icon="remove-user"
              />
              Remove Friend
            </button>
            <button
              v-if="
                showUser.friendRequests && showUser.friend?.status === 'pending'
              "
              class="profile-button-pending"
              style="color: #808080"
              @click="addFriend(showUser.id)"
            >
              <icons
                style="padding-right: 4px"
                color="#808080"
                size="16"
                icon="remove-user"
              />
              Pending
            </button>
            <button
              v-if="
                showUser.id !== $store.userData.id &&
                showUser.friend?.status === 'incoming'
              "
              class="profile-button-pending"
              style="color: #47bf4c"
              @click="addFriend(showUser.id)"
            >
              <icons
                style="padding-right: 4px"
                color="#47bf4c"
                size="16"
                icon="add-user"
              />
              Accept Friend
            </button>
          </div>
        </div>
        <div class="profile-spacer"></div>
        <div style="height: 332px; overflow-y: auto" class="scroll-bar">
          <div v-if="showUser.createdAt">
            <p>Date Created</p>
            <p class="message-text-large">
              {{ dayjsDate(showUser.createdAt) }}
            </p>
            <div class="profile-spacer"></div>
          </div>
          <div>
            <p>Description</p>
            <p class="message-text-large" style="word-wrap: break-word">
              {{ showUser.description || `Hi, I'm ${showUser.username}!` }}
            </p>
          </div>
          <div v-if="showUser.tetris">
            <div class="profile-spacer"></div>
            <p>Tetris Scores</p>
            <p>Easy mode: {{ showUser.tetris[0].highscore_easy }} lines</p>
            <p>Medium mode: {{ showUser.tetris[1].highscore_medium }} lines</p>
            <p>Hard mode: {{ showUser.tetris[2].highscore_hard }} lines</p>
            <p>God mode: {{ showUser.tetris[3].highscore_god }} lines</p>
          </div>
        </div>
      </div>
    </modal>
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
        <div v-if="$store.userData.emailVerified">
          <div class="text-small">
            <label for="requireVerification">Require verification</label>
          </div>
          <div class="switch" @click="toggle()">
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
        <div v-if="$store.userData.emailVerified">
          <div class="text-small">
            <label for="requireVerification">Require verification</label>
          </div>
          <div class="switch" @click="toggle()">
            <input
              type="checkbox"
              :checked="requireVerification"
              id="requireVerification"
            />
            <span class="slider"></span>
          </div>
        </div>
        <button @click="saveChat">Save</button>
        <button
          v-if="chatEdit !== 1"
          class="red-button"
          @click="deleteChat(chatEdit)"
        >
          Delete
        </button>
      </div>
    </modal>
  </transition>
  <div class="chat-container">
    <sidebar-left v-if="$store.chatBarOpen === 'true'">
      <div v-if="!loadingChats">
        <div class="filter-button" @click="createChatShown = true">
          Create chat
        </div>
        <div
          v-for="chat in chats"
          :key="chat"
          style="display: flex; margin: 0 0 4px; align-items: center"
        >
          <div
            style="cursor: pointer"
            class="message-grid"
            @click="openChat(chat.id)"
            :style="{
              backgroundColor: currentChat.id === chat.id ? '#212425' : '',
              width:
                chat.owner === $store.userData.id && chat.type !== 1
                  ? 'calc(100% - 36px)'
                  : '100%'
            }"
          >
            <div class="profile-picture">
              <profile-picture
                style="margin: 4px"
                size="32"
                :avatar="
                  chat.type === 1 && chat.ownerDetails.id !== $store.userData.id
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
                  chat.type === 1 && chat.ownerDetails.id !== $store.userData.id
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
                  chat.type === 1 && chat.ownerDetails.id === $store.userData.id
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
            v-if="chat.owner === $store.userData.id && chat.type !== 1"
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
            <h1 v-else-if="currentChat.owner !== $store.userData.id">
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
            v-for="(message, index) in messages"
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
                    {{ " " + $store.dayjs(message.createdAt) }}
                  </b>
                </div>
                <input
                  v-if="editing === message.id"
                  placeholder="Edit your message"
                  @keydown.enter="editMessage(message.id)"
                  class="responder"
                  v-model="editText"
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
                  <embeds
                    v-for="(embed, index) in message.embeds"
                    :key="index"
                    :embed="embed"
                    :scroll="scroll"
                  ></embeds>
                </div>
              </div>
              <div class="message-icons" v-show="editing !== message.id">
                <icons
                  v-show="message.user?.id === $store.userData?.id"
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
                    $store.userData?.admin ||
                    message.user?.id === $store.userData?.id
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
                    $store.sidebarOpen === 'true' && !$store.search
                      ? '250px'
                      : $store.search
                      ? '350px'
                      : '',
                  marginLeft: $store.chatBarOpen === 'true' ? '250px' : ''
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
            class="responder"
            v-model="inputText"
            id="input"
            autocomplete="off"
          />
          <button @click="submit" style="cursor: pointer">Send</button>
        </div>
      </div>
    </div>
    <sidebar
      v-if="$store.sidebarOpen === 'true' || $store.search"
      :style="{ width: $store.search ? '342px' : '' }"
    >
      <div v-if="!loadingUsers && !$store.search">
        <div class="filter-button" @click="userSortPress()">
          <p v-if="sortUsers === 'id'">Sort: Id</p>
          <p v-else-if="sortUsers === 'username'">Sort: Username</p>
          <p v-else-if="sortUsers === 'status'">Sort: Status</p>
          <p v-else-if="sortUsers === 'statusMessage'">Sort: Status Message</p>
        </div>
        <div
          v-if="currentChat.users?.some((user) => user.status !== 'offline')"
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
        <div v-for="user in currentChat.users" :key="user">
          <div
            v-if="user.status !== 'offline'"
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
        </div>
        <div
          v-if="currentChat.users?.some((user) => user.status === 'offline')"
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
        <div v-for="user in currentChat.users" :key="user">
          <div
            v-if="user.status === 'offline'"
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
        </div>
      </div>
      <div v-else-if="$store.search">
        <input
          style="margin: 0"
          placeholder="Search this chat"
          @keydown.enter="searchChat"
          v-model="searchText"
          id="status"
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
                  {{ " " + $store.dayjs(message.createdAt) }}
                </b>
              </div>
              <div>
                <div v-markdown>
                  {{ message.messageContents }}
                  <b class="message-text-small" v-if="message.edited">
                    (edited)
                  </b>
                </div>
                <embeds
                  v-for="(embed, index) in message.embeds"
                  :key="index"
                  :embed="embed"
                ></embeds>
              </div>
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

<script>
import dayjs from "dayjs"
import Embeds from "@/components/Embeds.vue"
import StatusIndicator from "@/components/StatusIndicator.vue"
import Icons from "@/components/Icons.vue"
import Modal from "@/components/Modal.vue"
import Sidebar from "@/components/Sidebar.vue"
import ProfilePicture from "@/components/ProfilePicture.vue"
import SidebarLeft from "@/components/Sidebarleft.vue"

export default {
  components: {
    SidebarLeft,
    ProfilePicture,
    Sidebar,
    Icons,
    Embeds,
    Modal,
    StatusIndicator
  },
  data() {
    return {
      messages: [],
      searchMessages: [],
      chats: [],
      currentChat: {},
      inputText: "",
      replyTo: null,
      editText: "",
      editStatus: "",
      editing: false,
      searchText: "",
      profileShown: false,
      createChatShown: false,
      loadingMessages: true,
      loadingUsers: true,
      loadingChats: true,
      scrolledUp: false,
      showUser: false,
      sortUsers: "id",
      chatDescriptionInput: "",
      chatNameInput: "",
      chatIconInput: "",
      requireVerification: true,
      chatEdit: false
    }
  },
  methods: {
    async getChats() {
      await this.axios
        .get("/api/chats")
        .then((res) => {
          this.chats = res.data
          this.loadingChats = false
          this.chatSort()
        })
        .catch((e) => {
          if (e.message === "Request failed with status code 401") {
            this.$store.error = "Error 401, You are not logged in"
            this.$router.push("/login")
          } else {
            this.$store.error = "Error 503, Cannot Connect to Server " + e
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
        this.currentChat.users.sort(function (a, b) {
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
        this.currentChat.users.sort(function (a, b) {
          return a.id - b.id
        })
      }
    },
    chatSort() {
      this.chats.sort((a, b) => {
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
      if (this.inputText.trim()) {
        this.axios
          .post("/api/message", {
            messageContents: this.inputText.trim(),
            reply: this.replyTo,
            chatId: this.currentChat.id
          })
          .then((res) => {
            this.chats = res.data.chats
            this.chatSort()
            this.currentChat = res.data.chat
            this.inputText = ""
            this.replyTo = null
            this.messages = res.data.chat.messages
            this.messages.focus = false
            this.loadingMessages = false
            this.scroll()
          })
          .catch((e) => {
            this.$store.error = e.response.data.message
            setTimeout(this.$store.errorFalse, 5000)
          })
      }
    },
    deleteMessage(messageId) {
      this.axios
        .delete(`/api/delete/${messageId}`)
        .then((res) => {
          this.messages = res.data
          this.messages.focus = false
          this.loadingMessages = false
          this.scroll()
        })
        .catch((e) => {
          this.$store.error = e.response.data.message
          setTimeout(this.$store.errorFalse, 5000)
        })
    },
    editChat(chat) {
      this.chatEdit = chat.id
      this.chatNameInput = chat.name
      this.chatDescriptionInput = chat.description
      this.chatIconInput = chat.icon
      this.requireVerification = chat.requireVerification
    },
    deleteChat(chatId) {
      this.axios
        .delete(`/api/delete-chat/${chatId}`)
        .then((res) => {
          this.chatEdit = false
          this.chatNameInput = ""
          this.chatDescriptionInput = ""
          this.chatIconInput = ""
          this.requireVerification = true
          this.chats = res.data.chats
          this.chatSort()
          this.currentChat = res.data.chat
          this.replyTo = null
          this.loadingMessages = false
          this.messages = res.data.chat.messages
          if (this.messages) {
            this.messages.focus = false
            this.scroll()
          }
        })
        .catch((e) => {
          this.$store.error = e.response.data.message
          setTimeout(this.$store.errorFalse, 5000)
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
        .then((res) => {
          this.editing = false
          this.messages = res.data
          this.messages.focus = false
          this.loadingMessages = false
          this.scroll()
        })
        .catch((e) => {
          this.$store.error = e.response.data.message
          setTimeout(this.$store.errorFalse, 5000)
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
        .patch("/api/edit-status-message", {
          statusMessage: this.editStatus.trim()
        })
        .then((res) => {
          this.showUser.statusMessage = res.data.statusMessage
          this.editing = false
          this.currentChat.users = res.data.users
          this.userSort(this.sortUsers)
        })
        .catch((e) => {
          this.$store.error = e.response.data.message
          setTimeout(this.$store.errorFalse, 5000)
        })
    },
    searchChat() {
      if (this.searchText) {
        const keywords = this.searchText.toLowerCase().split(" ")

        this.searchMessages = this.messages.filter((message) => {
          return keywords.some((keyword) => {
            return message.messageContents.toLowerCase().includes(keyword)
          })
        })
      }
    },
    replyToMessage(messsageId) {
      this.replyTo = messsageId
      const input = document.getElementById("input")
      input?.focus()
    },
    async getChat(id) {
      await this.axios
        .get(`/api/chat/${id || 1}`)
        .then((res) => {
          this.currentChat = res.data
          this.loadingUsers = false
          this.replyTo = null
          this.loadingMessages = false
          this.messages = res.data.messages
          this.messages.focus = false
          this.scroll()
        })
        .catch((e) => {
          this.$store.error = e.response.data.message
          setTimeout(this.$store.errorFalse, 5000)
        })
    },
    createChat() {
      if (this.$store.userData.emailVerified === false) {
        this.requireVerification = false
      }
      if (
        this.chatNameInput &&
        this.chatDescriptionInput &&
        typeof requireVerification !== "boolean"
      )
        this.axios
          .post("/api/create-chat", {
            name: this.chatNameInput,
            description: this.chatDescriptionInput,
            icon: this.chatIconInput,
            requireVerification: this.requireVerification
          })
          .then((res) => {
            this.createChatShown = false
            this.chatNameInput = ""
            this.chatDescriptionInput = ""
            this.chatIconInput = ""
            this.requireVerification = true
            this.chats = res.data.chats
            this.chatSort()
            this.currentChat = res.data.chat
            this.replyTo = null
            this.loadingMessages = false
            this.messages = res.data.chat.messages
            if (this.messages) {
              this.messages.focus = false
              this.scroll()
            }
          })
          .catch((e) => {
            this.$store.error = e.response.data.message
            setTimeout(this.$store.errorFalse, 5000)
          })
    },
    saveChat() {
      if (this.$store.userData.emailVerified === false) {
        this.requireVerification = false
      }
      if (
        this.chatNameInput &&
        this.chatDescriptionInput &&
        typeof requireVerification !== "boolean"
      )
        this.axios
          .patch(`/api/edit-chat/${this.chatEdit}`, {
            name: this.chatNameInput,
            description: this.chatDescriptionInput,
            icon: this.chatIconInput,
            requireVerification: this.requireVerification
          })
          .then((res) => {
            this.chatEdit = false
            this.chatNameInput = ""
            this.chatDescriptionInput = ""
            this.chatIconInput = ""
            this.requireVerification = true
            this.chats = res.data.chats
            this.chatSort()
            this.currentChat = res.data.chat
            this.replyTo = null
            this.loadingMessages = false
            this.messages = res.data.chat.messages
            if (this.messages) {
              this.messages.focus = false
              this.scroll()
            }
          })
          .catch((e) => {
            this.$store.error = e.response.data.message
            setTimeout(this.$store.errorFalse, 5000)
          })
    },
    toggle() {
      this.requireVerification = !this.requireVerification
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
    openUser(userId, user) {
      if (user !== null) {
        this.axios
          .get("/api/user/" + userId)
          .then((res) => {
            this.showUser = res.data
            this.profileShown = true
            if (this.showUser.tetris) {
              this.showUser.tetris = this.formatINI(this.showUser.tetris)
            }
          })
          .catch((e) => {
            this.$store.error = e.response
            console.log(e)
            setTimeout(this.$store.errorFalse, 5000)
          })
      }
    },
    openChat(chatId) {
      this.getChat(chatId)
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
    scroll(override) {
      this.$nextTick(() => {
        try {
          if ((!this.scrolledUp || override) && this.messages) {
            const lastIndex = this.messages.length - 1
            const lastMessage = document.querySelector(`#message-${lastIndex}`)
            if (this.editing) {
              this.scrolledUp = false
              lastMessage.scrollIntoView()
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
        (message) => Number(message.userName) === this.$store.userData.id
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
          this.$store.error = e.response.data.message
          setTimeout(this.$store.errorFalse, 5000)
        })
    },
    sendDm(id) {
      this.axios
        .post(`/api/direct-message/${id}`)
        .then((res) => {
          this.profileShown = false
          this.editing = false
          this.chats = res.data.chats
          this.chatSort()
          this.currentChat = res.data.chat
          this.inputText = ""
          this.replyTo = null
          this.loadingMessages = false
          this.messages = res.data.chat.messages
          this.messages.focus = false
          this.scroll()
        })
        .catch((e) => {
          this.$store.error = e.response
          setTimeout(this.$store.errorFalse, 5000)
        })
    },
    escPressed(event) {
      if (event.key === "Escape") {
        if (this.editing === "status") {
          this.editing = false
        } else if (this.profileShown) {
          this.profileShown = false
        } else if (this.editing) {
          this.editing = false
        } else if (this.replyTo) {
          this.replyTo = null
        } else if (!this.profileShown) {
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
  async mounted() {
    const favicon = document.getElementById("favicon")
    favicon.href = "/icons/favicon.ico"

    document.addEventListener("keydown", this.escPressed)
    const div = document.getElementById("div")
    div.addEventListener("scroll", this.scrollEvent)

    await this.getChats()
    await this.getChat()
    this.scroll(true)
  },
  created() {
    this.sortUsers = this.$store.sortUsers
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
      this.editFocus()
    }
  }
}
</script>
