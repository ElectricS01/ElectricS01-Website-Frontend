import { useDataStore } from "@/store"
import axios from "axios"

export const uploadFiles = async (files: FileList) => {
  const formData = new FormData()
  for (const file of files) {
    formData.append("attachment", file)
  }
  try {
    const res = await axios.post("/api/uploads/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    navigator.clipboard.writeText(
      `${window.location.origin}/api/i/${res.data.upload.filename}`
    )
    return res.data.upload
  } catch (e) {
    const store = useDataStore()

    store.handleAxiosError(e)
  }
}
