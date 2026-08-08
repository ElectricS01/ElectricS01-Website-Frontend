import { useDataStore } from "@/store"

const store = useDataStore()

export function setStatus(status: string | null) {
  if (!localStorage.getItem("token")) return

  store.pageStatus = status

  if (store.ws?.readyState === WebSocket.OPEN) {
    store.ws.send(JSON.stringify({ page: status }))
  }
}
