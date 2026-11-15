<template>
  <modal-simple
    :is-active="selected !== undefined && !store.quickSwitcherShown"
    @close="selected = undefined"
  >
    <img :src="selected" class="message-embed" alt="Embedded image" />
  </modal-simple>
  <div class="container">
    <h1>Uploads</h1>
    <input
      ref="fileInput"
      type="file"
      multiple
      hidden
      @change="handleFileUpload"
    />
    <button
      style="width: fit-content"
      :disabled="isUploading"
      @click="triggerFilePicker"
    >
      <icons size="28" icon="upload" />
    </button>
    <p v-if="uploads.length === 0">No uploads yet</p>
    <div class="grid-home">
      <div v-for="upload in uploads" :key="upload.id" class="upload">
        <div
          class="upload-thumbnail"
          @click="selected = `/api/i/${upload.fileName}`"
        >
          <img :src="`/api/i/${upload.fileName}`" />
        </div>
        <div style="padding: 4px" class="ellipse" :title="upload.name">
          Filename: {{ upload.name }}
        </div>
        <div style="padding: 4px" :title="`${upload.size} B`">
          Size: {{ formatFileSize(upload.size) }}
        </div>
        <div style="padding: 4px">
          Created: {{ dayjsLong(upload.createdAt) }}
        </div>
        <div style="padding: 4px">{{ dayjsSince(upload.createdAt) }}</div>
        <div class="button-container">
          <button
            class="profile-button-remove"
            style="width: fit-content"
            @click="deleteUpload(upload.id)"
          >
            Delete
          </button>
          <button
            class="profile-button-message"
            style="width: fit-content"
            @click="copyUpload(upload.fileName)"
          >
            Copy
          </button>
          <button
            class="profile-button-message"
            style="width: fit-content"
            @click="openUpload(upload.fileName)"
          >
            Open
          </button>
          <button
            class="profile-button-message"
            style="width: fit-content"
            @click="downloadUpload(upload.fileName, upload.name)"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ModalSimple from "@/components/core/ModalSimple.vue"
import icons from "@/components/core/Icons.vue"

import { onMounted, onUnmounted, ref, useTemplateRef } from "vue"
import { useDataStore } from "@/store"
import axios from "axios"
import { dayjsLong, dayjsSince } from "@/helpers/dates"
import { Upload } from "@/types/upload"
import { downloadUrl } from "@/helpers/downloads"
import { uploadFiles } from "@/helpers/upload"
import { formatFileSize } from "@/helpers/fileSize"

const store = useDataStore()

const inputRef = useTemplateRef("fileInput")

const uploads = ref<Upload[]>([])
const selected = ref<string | undefined>(undefined)
const isUploading = ref(false)

axios
  .get<Upload[]>("/api/uploads")
  .then((res) => {
    uploads.value = res.data
  })
  .catch((e) => {
    store.handleAxiosError(e)
  })

const triggerFilePicker = () => {
  inputRef.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files) return
  const files: File[] = Array.from(target.files)
  if (!files.length) return

  isUploading.value = true
  const upload = await uploadFiles(target.files)

  isUploading.value = false
  uploads.value.push(upload)
}

const deleteUpload = async (id: number) => {
  try {
    await axios.delete(`/api/uploads/${id}`)
    uploads.value = uploads.value.filter((upload) => upload.id !== id)
  } catch (e) {
    store.handleAxiosError(e)
  }
}

const copyUpload = (fileName: string) => {
  navigator.clipboard.writeText(`${window.location.origin}/api/i/${fileName}`)
}

const openUpload = (fileName: string) => {
  window.open(`${window.location.origin}/api/i/${fileName}`, "_blank")
}

const downloadUpload = (fileName: string, name: string) => {
  downloadUrl(`${window.location.origin}/api/i/${fileName}`, name)
}

const keyPressed = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    selected.value = undefined
  }
}

onMounted(() => {
  document.addEventListener("keydown", keyPressed)
})

onUnmounted(() => {
  document.removeEventListener("keydown", keyPressed)
})
</script>

<style>
.upload {
  background-color: #282a2b;
  height: 346px;
  width: 320px;
  padding: 8px;
  border-radius: 15px;
  margin: 16px;
  text-align: left;
}

.upload-thumbnail {
  background-color: #000;
  width: 320px;
  height: 200px;
  align-content: center;
  text-align: center;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
