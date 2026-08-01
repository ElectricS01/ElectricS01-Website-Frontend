<template>
  <div>
    <div class="filter-button" @click="emit('userSortPressed')">
      <p v-if="sortUsers === 'id'">Sort: Id</p>
      <p v-else-if="sortUsers === 'username'">Sort: Username</p>
      <p v-else-if="sortUsers === 'status'">Sort: Status</p>
      <p v-else-if="sortUsers === 'statusMessage'">Sort: Status Message</p>
    </div>
    <div
      v-if="users?.some((user) => user?.status !== 'offline')"
      class="sidebar-spacer"
    >
      <p class="message-text-small">Online</p>
      <div />
    </div>
    <user-row
      v-for="user in onlineUsers"
      :key="user.id"
      :user="user"
      @contextmenu.prevent="showContextMenu($event, user.id)"
      @click="openUser(user.id)"
    />
    <div
      v-if="users?.some((user) => user?.status === 'offline')"
      class="sidebar-spacer"
    >
      <p class="message-text-small">Offline</p>
      <div />
    </div>
    <user-row
      v-for="user in offlineUsers"
      :key="user.id"
      :user="user"
      @contextmenu.prevent="showContextMenu($event, user.id)"
      @click="openUser(user.id)"
    />
    <context-menu
      v-if="contextMenuVisible && contextMenuItemUser"
      :position="contextMenuPosition"
      @close="contextMenuVisible = false"
    >
      <div @click="openUser(contextMenuItemUser.id)">Profile</div>
      <div
        v-if="contextMenuItemUser.id !== store.userData.id"
        @click="contextMenuSendDm(contextMenuItemUser.id)"
      >
        Message {{ contextMenuItemUser.username }}
      </div>
      <div
        v-if="
          contextMenuItemUser.id !== store.userData.id &&
          contextMenuItemUser.friendRequests &&
          !contextMenuItemUser.friend?.status
        "
        @click="addFriend(contextMenuItemUser.id, true)"
      >
        Friend {{ contextMenuItemUser.username }}
      </div>
      <div
        v-else-if="
          contextMenuItemUser.id !== store.userData.id &&
          contextMenuItemUser.friend?.status === 'accepted'
        "
        @click="addFriend(contextMenuItemUser.id, true)"
      >
        Unfriend {{ contextMenuItemUser.username }}
      </div>
      <div
        v-else-if="
          contextMenuItemUser.id !== store.userData.id &&
          contextMenuItemUser.friend?.status === 'pending'
        "
        @click="addFriend(contextMenuItemUser.id, true)"
      >
        Cancel {{ contextMenuItemUser.username }}
      </div>
      <div
        v-else-if="
          contextMenuItemUser.id !== store.userData.id &&
          contextMenuItemUser.friend?.status === 'incoming'
        "
        @click="addFriend(contextMenuItemUser.id, true)"
      >
        Accept {{ contextMenuItemUser.username }}
      </div>
      <div
        v-if="canRemove && contextMenuItemUser.id !== store.userData.id"
        class="button-red"
        @click="emit('removeUser', contextMenuItemUser.id)"
      >
        Remove {{ contextMenuItemUser.username }}
      </div>
      <div @click="copyText(contextMenuItemUserId)">Copy User ID</div>
    </context-menu>
  </div>
</template>

<script setup lang="ts">
import { sendDm } from "@/helpers/chatUsers"
import UserRow from "../UserRow.vue"
import ContextMenu from "../core/ContextMenu.vue"

import { Position } from "@/types/position"
import { User } from "@/types/user"
import { computed, ref } from "vue"
import { useDataStore } from "@/store"

const store = useDataStore()

const props = defineProps<{
  sortUsers: string
  users: User[]
  canRemove: boolean
  openUser: (userId: number) => void
  addFriend: (userId: number, notOpen: boolean) => void
}>()

const emit = defineEmits(["dmCreated", "userSortPressed", "removeUser"])

const contextMenuVisible = defineModel<boolean>("contextMenu", {
  required: true
})

const contextMenuItemUserId = ref<number | null>(null)
const contextMenuPosition = ref<Position>({ x: 0, y: 0 })

const contextMenuItemUser = computed(() =>
  props.users.find((u) => u.id === contextMenuItemUserId.value)
)
const onlineUsers = computed(() =>
  props.users.filter((user) => user?.status === "online")
)
const offlineUsers = computed(() =>
  props.users.filter((user) => user?.status === "offline")
)

const copyText = (text: number | null) => {
  contextMenuVisible.value = false
  navigator.clipboard.writeText(String(text))
}

const showContextMenu = (event: MouseEvent, userId: number) => {
  event.preventDefault()
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true
  contextMenuItemUserId.value = userId
}

const contextMenuSendDm = async (id: number) => {
  try {
    contextMenuVisible.value = false
    const data = await sendDm(id)
    emit("dmCreated", data)
  } catch (e) {
    store.handleAxiosError(e)
  }
}
</script>
