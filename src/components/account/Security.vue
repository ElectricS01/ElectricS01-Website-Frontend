<template>
  <modal :is-active="deleteSessionOpen" @close="deleteSessionOpen = false">
    <div class="settings-modal">
      <p class="settings-text">
        Delete {{ sessionToDelete.name ?? "Session" }}
      </p>
      <div class="text-small">
        <label for="password">Password</label>
      </div>
      <input
        id="password"
        v-model="password"
        placeholder="Password"
        class="modal-input"
        autocomplete="off"
        type="password"
        @keydown.enter="deleteSession"
      />
      <div class="settings-button-container">
        <button @click="deleteSessionOpen = false">Cancel</button>
        <button class="button-red" @click="deleteSession">Delete</button>
      </div>
    </div>
  </modal>
  <modal :is-active="saveKeyOpen" @close="saveKeyOpen = false">
    <div class="settings-modal">
      <p class="settings-text">Save your Private Key</p>
      <div class="text-small">
        <label for="password">Password</label>
      </div>
      <input
        id="password"
        v-model="password"
        placeholder="Password"
        class="modal-input"
        autocomplete="off"
        type="password"
        @keydown.enter="saveKey"
      />
      <template v-if="store.userData.otpVerified">
        <div class="text-small">
          <label for="totp">2FA Code</label>
        </div>
        <input
          id="totp"
          v-model="totp"
          placeholder="2FA Code"
          class="modal-input"
          type="token"
          inputmode="numeric"
          pattern="[0-9]*"
          autocomplete="one-time-code"
          @keydown.enter="saveKey"
        />
      </template>
      <div class="settings-button-container">
        <button @click="saveKeyOpen = false">Cancel</button>
        <button @click="saveKey">Save</button>
      </div>
    </div>
  </modal>
  <modal :is-active="exportKeyOpen" @close="exportKeyOpen = false">
    <div class="settings-modal">
      <p class="settings-text">Export your Private Key</p>
      <div class="settings-button-container">
        <button @click="exportKeyOpen = false">Cancel</button>
        <button @click="exportKeyPair">Export</button>
      </div>
    </div>
  </modal>
  <modal :is-active="generateKeyOpen" @close="generateKeyOpen = false">
    <div class="settings-modal">
      <p class="settings-text">Generate a new Key Pair</p>
      <div class="text-small">
        <label for="password">Password</label>
      </div>
      <input
        id="password"
        v-model="password"
        placeholder="Password"
        class="modal-input"
        autocomplete="off"
        type="password"
        @keydown.enter="generateNewKeyPair"
      />
      <template v-if="store.userData.otpVerified">
        <div class="text-small">
          <label for="totp">2FA Code</label>
        </div>
        <input
          id="totp"
          v-model="totp"
          placeholder="2FA Code"
          class="modal-input"
          type="token"
          inputmode="numeric"
          pattern="[0-9]*"
          autocomplete="one-time-code"
          @keydown.enter="generateNewKeyPair"
        />
      </template>
      <div class="settings-button-container">
        <button @click="generateKeyOpen = false">Cancel</button>
        <button @click="generateNewKeyPair">Generate</button>
      </div>
    </div>
  </modal>
  <modal :is-active="importKeyOpen" @close="importKeyOpen = false">
    <div class="settings-modal">
      <p class="settings-text">Import your Key Pair</p>
      <div class="text-small">
        <label for="publicKey">Public Key</label>
      </div>
      <input
        id="publicKey"
        v-model="newPublicKey"
        placeholder="Public Key"
        class="modal-input"
        autocomplete="off"
        @keydown.enter="importKeyPair"
      />
      <div class="text-small">
        <label for="privateKey">Private Key</label>
      </div>
      <input
        id="privateKey"
        v-model="newPrivateKey"
        placeholder="Private Key"
        class="modal-input"
        autocomplete="off"
        @keydown.enter="importKeyPair"
      />
      <div class="text-small">
        <label for="password">Password</label>
      </div>
      <input
        id="password"
        v-model="password"
        placeholder="Password"
        class="modal-input"
        autocomplete="off"
        type="password"
        @keydown.enter="importKeyPair"
      />
      <template v-if="store.userData.otpVerified">
        <div class="text-small">
          <label for="totp">2FA Code</label>
        </div>
        <input
          id="totp"
          v-model="totp"
          placeholder="2FA Code"
          class="modal-input"
          type="token"
          inputmode="numeric"
          pattern="[0-9]*"
          autocomplete="one-time-code"
          @keydown.enter="importKeyPair"
        />
      </template>
      <div class="settings-button-container">
        <button @click="importKeyOpen = false">Cancel</button>
        <button @click="importKeyPair">Import</button>
      </div>
    </div>
  </modal>

  <modal :is-active="renamePasskeyOpen" @close="renamePasskeyOpen = false">
    <div class="settings-modal">
      <p class="settings-text">
        Rename {{ selectedPasskey?.name ?? "Passkey" }}
      </p>
      <input
        v-model="passkeyName"
        placeholder="Passkey Name"
        class="modal-input"
        autocomplete="off"
        @keydown.enter="updatePasskeyName"
      />
      <div class="settings-button-container">
        <button @click="renamePasskeyOpen = false">Cancel</button>
        <button @click="updatePasskeyName">Save</button>
      </div>
    </div>
  </modal>
  <modal :is-active="deletePasskeyOpen" @close="deletePasskeyOpen = false">
    <div class="settings-modal">
      <p class="settings-text">
        Delete {{ passkeyToDelete?.name ?? "Passkey" }}
      </p>
      <p class="message-text-medium-gray" style="margin-bottom: 10px">
        This will remove the passkey from your account, but it will remain on
        your device
      </p>
      <div class="settings-button-container">
        <button @click="deletePasskeyOpen = false">Cancel</button>
        <button class="button-red" @click="confirmDeletePasskeyOpen = true">
          Delete
        </button>
      </div>
    </div>
  </modal>
  <modal :is-active="logoutAllOpen" @close="logoutAllOpen = false">
    <div class="settings-modal">
      <p class="settings-text">Logout everywhere</p>
      <input
        v-model="password"
        placeholder="Password"
        class="settings-input"
        autocomplete="off"
        type="password"
        @keydown.enter="logoutAllSubmit"
      />
      <div class="settings-button-container">
        <button @click="logoutAllOpen = false">Cancel</button>
        <button class="button-red" @click="logoutAllSubmit">
          Logout everywhere
        </button>
      </div>
    </div>
  </modal>
  <modal
    :is-active="confirmDeletePasskeyOpen"
    @close="confirmDeletePasskeyOpen = false"
  >
    <div class="settings-modal">
      <p class="settings-text">
        Delete
        {{ passkeyToDelete.name ?? "Passkey" }}
      </p>
      <p class="message-text-medium-gray">This action cannot be undone</p>
      <input
        v-model="password"
        placeholder="Password"
        class="settings-input"
        autocomplete="off"
        type="password"
        @keydown.enter="confirmDeletePasskey"
      />
      <div class="settings-button-container">
        <button @click="confirmDeletePasskeyOpen = false">Cancel</button>
        <button class="button-red" @click="confirmDeletePasskey">Delete</button>
      </div>
    </div>
  </modal>
  <modal :is-active="enableOtpOpen" @close="enableOtpOpen = false">
    <div class="settings-modal">
      <p class="settings-text">Enable 2FA</p>
      <img :src="qrCodeURL" alt="QR Code" />
      <p>or</p>
      <div>
        <a :href="qrURI">Click to add to 2FA app</a>
      </div>
      <p>or</p>
      <button @click="copyToken">Copy Token</button>
      <input
        id="totp"
        v-model="totp"
        placeholder="2FA Code"
        class="modal-input"
        type="token"
        inputmode="numeric"
        pattern="[0-9]*"
        autocomplete="one-time-code"
        @keydown.enter="verify2FA()"
      />
      <div class="settings-button-container">
        <button @click="verify2FA()">Enable</button>
      </div>
    </div>
  </modal>
  <modal :is-active="disableOtpOpen" @close="disableOtpOpen = false">
    <div class="settings-modal">
      <p class="settings-text">Disable 2FA</p>
      <input
        id="totp"
        v-model="totp"
        placeholder="2FA Code"
        class="modal-input"
        type="token"
        inputmode="numeric"
        pattern="[0-9]*"
        autocomplete="one-time-code"
        @keydown.enter="disable2FA()"
      />
      <div class="settings-button-container">
        <button @click="disable2FA()">Disable</button>
      </div>
    </div>
  </modal>
  <h2 class="settings-text">Security</h2>
  Change your security settings
  <div class="settings-spacer" />
  Log you out on every device
  <div class="settings-button-red" @click="logoutAll">Logout everywhere</div>
  <div class="settings-spacer" />
  Allow Encrypted direct messages
  <div>
    <div class="dropdown">
      <div class="dropdown-toggle" @click="encryptionOpen = !encryptionOpen">
        {{ store.userData.encryption }}
      </div>
      <ul v-if="encryptionOpen" class="dropdown-menu">
        <li
          v-for="option in encryptionOptions"
          :key="option"
          @click="selectEncryption(option)"
        >
          {{ option }}
        </li>
      </ul>
    </div>
  </div>
  <div class="message-text-small">
    <b>Never</b>
    - Messages sent to you will ever be encrypted so you cannot message those
    using "Always"
  </div>
  <div class="message-text-small">
    <b>Off</b>
    - Only messages sent to you by someone using "Always" will be encrypted
  </div>
  <div class="message-text-small">
    <b>On</b>
    - Any messages you send will be encrypted unless the other user has selected
    "Never" or "Off"
  </div>
  <div class="message-text-small">
    <b>Always</b>
    - You won't be able to send messages to those who have selected "Never"
  </div>
  <div class="settings-spacer" />
  Save your Encryption Private Key:
  <span v-if="store.userData.privateKeySaved">Saved</span>
  <span v-else-if="store.userData.privateKey">Saved locally</span>
  <span v-else style="color: var(--red)">Not saved</span>
  <div class="button-container">
    <toggle
      :value="store.userData.savePrivateKey"
      :disabled="store.userData.encryption === 'never'"
      @switch="togglePrivateKey"
    />
    <div
      v-if="store.userData.savePrivateKey && !store.userData.privateKeySaved"
      class="settings-button"
      @click="showSaveKey"
    >
      Save Key
    </div>
  </div>
  <div class="message-text-small">
    If enabled, your private key will be encrypted using your password and saved
    to the server
  </div>
  <div class="message-text-small">
    Disabling this option will delete your private key from the server so please
    back it up
  </div>

  <div class="settings-spacer" />
  Encryption Key Status:
  <span v-if="store.userData.publicKey && store.userData.privateKey">
    Valid
  </span>
  <span v-else style="color: var(--red)">Invalid</span>
  <div class="button-container">
    <div
      v-if="store.userData.privateKey"
      class="settings-button"
      @click="showExportKey"
    >
      Export Key Pair
    </div>
    <div class="settings-button" @click="showGenerateKey">
      Generate New Key Pair
    </div>
    <div class="settings-button" @click="showImportKey">Import Key Pair</div>
  </div>

  <div class="settings-spacer" />
  2FA
  <div
    v-if="!store.userData.otpVerified"
    class="settings-button"
    @click="enable2FA"
  >
    Enable 2FA
  </div>
  <div v-else class="settings-button" @click="disableOtpOpen = true">
    Disable 2FA
  </div>
  <div class="message-text-small">
    Two-factor authentication (2FA) prevents unauthorised access by requiring a
    code from your authenticator app
  </div>
  <div class="settings-spacer" />
  Passkeys
  <div class="settings-button" @click="registerPasskey">Add Passkey</div>
  <div class="message-text-small">
    Passkeys allow you to log in securely without a password using Touch ID,
    Face ID, Windows Hello, or security keys
  </div>
  <div v-if="passkeys.length > 0" class="settings-spacer" />
  <div class="grid-sessions">
    <div
      v-for="passkey in passkeys"
      :key="passkey.id"
      class="grid-sessions-item"
    >
      <div>
        <p class="message-text">
          {{ passkey.name }}
        </p>
        <p class="message-text-small">
          Added: {{ dayjsLong(passkey.createdAt) }} -
          {{ dayjsSince(passkey.createdAt) }}
        </p>
        <p class="message-text-small" :title="passkey.credentialDeviceType">
          {{ passkey.credentialBackedUp ? "Synced" : "Device only" }}
        </p>
      </div>
      <div class="button-container">
        <button class="settings-button" @click="renamePasskey(passkey)">
          Rename
        </button>
        <button class="settings-button-red" @click="deletePasskey(passkey)">
          Delete
        </button>
      </div>
    </div>
  </div>
  <div class="settings-spacer" />
  Sessions
  <div class="grid-sessions">
    <div
      v-for="session in sessions"
      :key="session.id"
      class="grid-sessions-item"
    >
      {{ platform(session.userAgent) }}
      <b v-if="store.userData.sessionId === session.id" class="current-session">
        Current
      </b>
      <p class="message-text-small">
        Added: {{ dayjsLong(session.createdAt) }} -
        {{ dayjsSince(session.createdAt) }}
      </p>
      <p class="message-text-small">
        Expires: {{ dayjsLong(session.expiresAt) }} -
        {{ dayjsSince(session.expiresAt) }}
      </p>
      <p class="bottom-text-small">Id: {{ session.id }}</p>
      <div class="settings-button-red" @click="showDeleteSession(session)">
        Delete
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Modal from "@/components/core/Modal.vue"
import { dayjsLong, dayjsSince } from "@/helpers/dates"
import { download } from "@/helpers/downloads"
import {
  encryptPrivateKey,
  exportPrivateKey,
  exportPublicKey,
  generateKeyPair,
  importPrivateKeyFromFile,
  importPublicKeyFromFile,
  stringifyPrivateKey,
  stringifyPublicKey
} from "@/helpers/encryption"
import { savePrivateKey } from "@/helpers/indexedDb"
import { changeProperty, onLogout, toggleProp } from "@/helpers/settings"
import { useDataStore } from "@/store"
import { Passkey } from "@/types/passkey"
import { Session } from "@/types/session"
import { Encryption } from "@/types/user"
import { startRegistration } from "@simplewebauthn/browser"
import axios from "axios"
import { ref } from "vue"
import Toggle from "../core/Toggle.vue"

const store = useDataStore()

const encryptionOptions = Object.values(Encryption)

const sessions = ref<Session[]>([])
const passkeys = ref<Passkey[]>([])

const saveKeyOpen = ref(false)
const renamePasskeyOpen = ref(false)
const deletePasskeyOpen = ref(false)
const deleteSessionOpen = ref(false)
const exportKeyOpen = ref(false)
const generateKeyOpen = ref(false)
const importKeyOpen = ref(false)
const logoutAllOpen = ref(false)
const confirmDeletePasskeyOpen = ref(false)
const enableOtpOpen = ref(false)
const disableOtpOpen = ref(false)
const encryptionOpen = ref(false)

const password = ref("")
const qrCodeURL = ref("")
const qrURI = ref("")
const totp = ref("")
const passkeyName = ref("")
const selectedPasskey = ref()
const passkeyToDelete = ref()
const sessionToDelete = ref()
const newPublicKey = ref("")
const newPrivateKey = ref("")

let token = ""

const selectEncryption = async (option: Encryption) => {
  await changeProperty("encryption", option)
  encryptionOpen.value = false
}

const logoutAll = () => {
  logoutAllOpen.value = true
}
const logoutAllSubmit = () => {
  if (password.value) {
    axios
      .post("/api/logout-all", {
        password: password.value
      })
      .then(() => {
        onLogout()
      })
      .catch((e) => {
        store.handleAxiosError(e)
      })
  }
}

const togglePrivateKey = async () => {
  await toggleProp("savePrivateKey")
  store.userData.privateKeySaved = false
}

const showSaveKey = () => {
  saveKeyOpen.value = true
  password.value = ""
  totp.value = ""
}

const showExportKey = () => {
  exportKeyOpen.value = true
}

const showGenerateKey = () => {
  generateKeyOpen.value = true
  password.value = ""
  totp.value = ""
}

const showImportKey = () => {
  importKeyOpen.value = true
  password.value = ""
  totp.value = ""
}

const saveKey = async () => {
  if (!store.userData.privateKey || !store.userData.publicKey) {
    store.handleError("No key pair available on this device")
    return
  }

  if (!password.value || !password.value.trim()) {
    store.handleError("Password is required")
    return
  }

  if (store.userData.otpVerified && (!totp.value || !totp.value.trim())) {
    store.handleError("2FA Code is required")
    return
  }

  try {
    const publicKeyString = await stringifyPublicKey(store.userData.publicKey)
    const privateKeyString = await stringifyPrivateKey(
      store.userData.privateKey
    )

    const encryptedPrivateKey = await encryptPrivateKey(
      privateKeyString,
      password.value.trim()
    )

    await axios.patch("/api/edit-key-pair", {
      password: password.value.trim(),
      privateKey: encryptedPrivateKey,
      publicKey: publicKeyString,
      token: totp.value.trim()
    })

    store.userData.privateKeySaved = true
    saveKeyOpen.value = false
    password.value = ""
    totp.value = ""
  } catch (e) {
    store.handleAxiosError(e)
  }
}

const exportKeyPair = async () => {
  if (!store.userData.privateKey || !store.userData.publicKey) {
    store.handleError("No key pair available on this device")
    return
  }
  download("public.pub", await exportPublicKey(store.userData.publicKey))
  download("private.pem", await exportPrivateKey(store.userData.privateKey))

  exportKeyOpen.value = false
}

const handleNewKeys = async (privateKey: CryptoKey, publicKey: CryptoKey) => {
  if (!store.userData.id) return

  const publicKeyString = await stringifyPublicKey(publicKey)

  if (!store.userData.savePrivateKey) {
    await axios.patch("/api/edit-key-pair", {
      password: password.value,
      publicKey: publicKeyString,
      token: totp.value.trim()
    })
  } else {
    const privateKeyString = await stringifyPrivateKey(privateKey)

    const encryptedPrivateKey = await encryptPrivateKey(
      privateKeyString,
      password.value.trim()
    )

    await axios.patch("/api/edit-key-pair", {
      password: password.value.trim(),
      privateKey: encryptedPrivateKey,
      publicKey: publicKeyString,
      token: totp.value.trim()
    })
  }

  store.userData.publicKey = publicKey
  store.userData.privateKey = privateKey

  await savePrivateKey(privateKey, store.userData.id)

  password.value = ""
  totp.value = ""
}

const generateNewKeyPair = async () => {
  if (!store.userData.id) return
  if (!password.value || !password.value.trim()) {
    store.handleError("Password is required")
    return
  }

  if (store.userData.otpVerified && (!totp.value || !totp.value.trim())) {
    store.handleError("2FA Code is required")
    return
  }

  try {
    const { privateKey, publicKey } = await generateKeyPair()

    await handleNewKeys(privateKey, publicKey)

    generateKeyOpen.value = false
  } catch (e) {
    store.handleAxiosError(e)
  }
}

const importKeyPair = async () => {
  if (!newPublicKey.value || !newPublicKey.value.trim()) {
    store.handleError("Public key is required")
    return
  }
  if (!newPrivateKey.value || !newPrivateKey.value.trim()) {
    store.handleError("Private key is required")
    return
  }
  if (!password.value || !password.value.trim()) {
    store.handleError("Password is required")
    return
  }

  if (store.userData.otpVerified && (!totp.value || !totp.value.trim())) {
    store.handleError("2FA Code is required")
    return
  }

  try {
    const publicKey = await importPublicKeyFromFile(newPublicKey.value.trim())
    const privateKey = await importPrivateKeyFromFile(
      newPrivateKey.value.trim()
    )

    await handleNewKeys(privateKey, publicKey)

    importKeyOpen.value = false
    newPublicKey.value = ""
    newPrivateKey.value = ""
  } catch (e) {
    if (axios.isAxiosError(e)) {
      store.handleAxiosError(e)
    } else {
      store.handleError("Failed to import key pair")
    }
  }
}

const showDeleteSession = (session: Session) => {
  deleteSessionOpen.value = true
  sessionToDelete.value = session
  password.value = ""
}

const deleteSession = async () => {
  try {
    await axios.delete(`/api/delete-session/${sessionToDelete.value.id}`, {
      data: {
        password: password.value
      }
    })
    deleteSessionOpen.value = false
    password.value = ""
    sessions.value = sessions.value.filter(
      (s) => s.id !== sessionToDelete.value.id
    )
    sessionToDelete.value = null
  } catch (e) {
    store.handleAxiosError(e)
  }
}

const enable2FA = () => {
  axios
    .post("/api/enable-2fa")
    .then((res) => {
      token = res.data.secret
      qrCodeURL.value = res.data.qrCodeDataURL
      qrURI.value = res.data.otpUri
      enableOtpOpen.value = true
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}
const verify2FA = () => {
  axios
    .post("/api/verify-2fa", {
      token: totp.value
    })
    .then(() => {
      enableOtpOpen.value = false
      totp.value = ""
      store.userData.otpVerified = true
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}
const disable2FA = () => {
  axios
    .post("/api/disable-2fa", {
      token: totp.value
    })
    .then(() => {
      disableOtpOpen.value = false
      totp.value = ""
      store.userData.otpVerified = false
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}
const copyToken = () => {
  navigator.clipboard.writeText(token)
}

const registerPasskey = async () => {
  try {
    const optionsResponse = await axios.post("/api/add-passkey")

    const registrationResponse = await startRegistration({
      optionsJSON: optionsResponse.data.options
    })

    await axios.post("/api/confirm-passkey", {
      ...registrationResponse,
      challengeId: optionsResponse.data.challengeId,
      passkeyName: platform(navigator.userAgent)
    })

    getPasskeys()
    store.errorFalse()
  } catch (error) {
    if (error instanceof Error && error.name === "NotAllowedError") {
      store.handleError("Passkey registration was cancelled")
    } else {
      store.handleAxiosError(error)
    }
  }
}

const renamePasskey = (passkey: Passkey) => {
  selectedPasskey.value = passkey
  passkeyName.value = passkey.name
  renamePasskeyOpen.value = true
}

const updatePasskeyName = () => {
  if (!passkeyName.value) return

  axios
    .patch(`/api/edit-passkey/${selectedPasskey.value.id}`, {
      passkeyName: passkeyName.value
    })
    .then(() => {
      getPasskeys()
      renamePasskeyOpen.value = false
      passkeyName.value = ""
      selectedPasskey.value = null
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const deletePasskey = (passkey: Passkey) => {
  passkeyToDelete.value = passkey
  deletePasskeyOpen.value = true
}

const confirmDeletePasskey = () => {
  if (!password.value) return

  axios
    .post(`/api/delete-passkey/${passkeyToDelete.value.id}`, {
      password: password.value
    })
    .then(() => {
      password.value = ""
      getPasskeys()
      deletePasskeyOpen.value = false
      confirmDeletePasskeyOpen.value = false
      passkeyToDelete.value = null
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const platform = (userAgent: string) => {
  if (userAgent) {
    let total = ""
    if (userAgent.toLowerCase().includes("windows")) {
      total += "Windows"
    } else if (userAgent.toLowerCase().includes("mac")) {
      total += "macOS"
    } else if (userAgent.toLowerCase().includes("iphone")) {
      total += "iOS"
    } else if (userAgent.toLowerCase().includes("android")) {
      total += "Android"
    } else if (userAgent.toLowerCase().includes("linux")) {
      total += "Linux"
    } else {
      total += "Unknown OS"
    }
    if (userAgent.toLowerCase().includes("chrome")) {
      total += " Chrome"
    } else if (userAgent.toLowerCase().includes("firefox")) {
      total += " Firefox"
    } else if (userAgent.toLowerCase().includes("safari")) {
      total += " Safari"
    } else if (userAgent.toLowerCase().includes("chromium")) {
      total += " Chromium"
    } else {
      total += " Unknown Browser"
    }
    return total
  }
  return "Unknown OS Unknown Browser"
}

const getSessions = () => {
  if (!localStorage.getItem("token")) return

  axios
    .get("/api/sessions")
    .then((res) => {
      sessions.value = res.data
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

const getPasskeys = () => {
  if (!localStorage.getItem("token")) return

  axios
    .get("/api/passkeys")
    .then((res) => {
      passkeys.value = res.data
    })
    .catch((e) => {
      store.handleAxiosError(e)
    })
}

getSessions()
getPasskeys()
</script>
