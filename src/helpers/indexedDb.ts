async function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("KeyDatabase", 1)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      if (!db.objectStoreNames.contains("keys")) {
        db.createObjectStore("keys", { keyPath: "id" })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function savePrivateKey(privateKey: CryptoKey, userId: number) {
  const exportedKey = await crypto.subtle.exportKey("pkcs8", privateKey)
  const db = await openDatabase()

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction("keys", "readwrite")
    const store = transaction.objectStore("keys")

    const request = store.put({
      id: userId,
      key: exportedKey
    })

    request.onsuccess = () => {
      console.log("Private key was saved")
      resolve()
    }
    request.onerror = () => {
      console.log("Private key could not be saved")
      console.error(request.error)
      reject(request.error)
    }

    transaction.oncomplete = () => db.close()
  })
}

export async function loadPrivateKey(userId: number) {
  const db = await openDatabase()

  return new Promise<CryptoKey | undefined>((resolve, reject) => {
    const transaction = db.transaction("keys", "readonly")
    const store = transaction.objectStore("keys")

    const request = store.get(userId)

    request.onsuccess = async () => {
      db.close()

      if (!request.result) {
        console.log("Private key could not be found")
        resolve(undefined)
        return
      }

      try {
        const privateKey = await crypto.subtle.importKey(
          "pkcs8",
          request.result.key,
          { name: "X25519" },
          true,
          ["deriveBits"]
        )

        console.log("Private key was loaded")
        resolve(privateKey)
      } catch (error) {
        console.log("Private key could not be loaded")
        console.error(error)
        resolve(undefined)
      }
    }

    request.onerror = () => {
      db.close()
      reject(request.error)
    }
  })
}
