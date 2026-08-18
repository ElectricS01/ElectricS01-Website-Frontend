import sodium from "libsodium-wrappers-sumo"

export async function generateKeyPair() {
  return await crypto.subtle.generateKey(
    {
      name: "X25519"
    },
    true,
    ["deriveBits"]
  )
}

export async function stringifyPublicKey(publicKey: CryptoKey) {
  const exportedPublicKey = await crypto.subtle.exportKey("raw", publicKey)
  return btoa(String.fromCharCode(...new Uint8Array(exportedPublicKey)))
}

export async function stringifyPrivateKey(privateKey: CryptoKey) {
  const exportedPrivateKey = await crypto.subtle.exportKey("pkcs8", privateKey)
  return new Uint8Array(exportedPrivateKey)
}

export async function encryptPrivateKey(
  privateKey: Uint8Array<ArrayBuffer>,
  password: string
) {
  await sodium.ready

  const salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES)

  const key = sodium.crypto_pwhash(
    sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES,
    password,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_MODERATE,
    sodium.crypto_pwhash_MEMLIMIT_MODERATE,
    sodium.crypto_pwhash_ALG_ARGON2ID13
  )

  const nonce = sodium.randombytes_buf(
    sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES
  )

  const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
    privateKey,
    null,
    null,
    nonce,
    key
  )

  sodium.memzero(key)

  return JSON.stringify({
    ciphertext: sodium.to_base64(ciphertext, sodium.base64_variants.ORIGINAL),
    nonce: sodium.to_base64(nonce, sodium.base64_variants.ORIGINAL),
    salt: sodium.to_base64(salt, sodium.base64_variants.ORIGINAL),
    version: 1
  })
}

export async function decryptPrivateKey(
  encryptedPrivateKey: string,
  password: string
) {
  await sodium.ready

  const { salt, nonce, ciphertext, version } = JSON.parse(encryptedPrivateKey)

  if (version !== 1) {
    throw new Error("Unsupported private key version")
  }

  const key = sodium.crypto_pwhash(
    sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES,
    password,
    sodium.from_base64(salt, sodium.base64_variants.ORIGINAL),
    sodium.crypto_pwhash_OPSLIMIT_MODERATE,
    sodium.crypto_pwhash_MEMLIMIT_MODERATE,
    sodium.crypto_pwhash_ALG_ARGON2ID13
  )

  try {
    const plaintext = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
      null,
      sodium.from_base64(ciphertext, sodium.base64_variants.ORIGINAL),
      null,
      sodium.from_base64(nonce, sodium.base64_variants.ORIGINAL),
      key
    )

    const keyData = new Uint8Array(plaintext)

    return await crypto.subtle.importKey(
      "pkcs8",
      keyData,
      {
        name: "X25519"
      },
      false,
      ["deriveBits"]
    )
  } finally {
    sodium.memzero(key)
  }
}

export async function exportPublicKey(publicKey: CryptoKey) {
  const spki = await crypto.subtle.exportKey("spki", publicKey)

  const base64 = btoa(String.fromCharCode(...new Uint8Array(spki)))

  const body = base64.match(/.{1,64}/g)?.join("\n") ?? base64

  return ["-----BEGIN PUBLIC KEY-----", body, "-----END PUBLIC KEY-----"].join(
    "\n"
  )
}

export async function exportPrivateKey(privateKey: CryptoKey) {
  const pkcs8 = await crypto.subtle.exportKey("pkcs8", privateKey)

  const base64 = btoa(String.fromCharCode(...new Uint8Array(pkcs8)))

  const body = base64.match(/.{1,64}/g)?.join("\n") ?? base64

  return [
    "-----BEGIN PRIVATE KEY-----",
    body,
    "-----END PRIVATE KEY-----"
  ].join("\n")
}

export async function importPublicKey(publicKeyString: string) {
  try {
    const bytes = Uint8Array.from(atob(publicKeyString), (c) => c.charCodeAt(0))

    return await crypto.subtle.importKey(
      "raw",
      bytes,
      {
        name: "X25519"
      },
      true,
      []
    )
  } catch {
    console.error("Failed to import public key", publicKeyString)
    return undefined
  }
}

export async function encryptMessageKey(
  messageKey: Uint8Array,
  privateKey: CryptoKey,
  publicKey: CryptoKey
) {
  await sodium.ready

  const sharedSecret = await crypto.subtle.deriveBits(
    {
      name: "X25519",
      public: publicKey
    },
    privateKey,
    256
  )

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    sharedSecret,
    "HKDF",
    false,
    ["deriveBits"]
  )

  const wrappingKeyBuffer = await crypto.subtle.deriveBits(
    {
      hash: "SHA-256",
      info: new TextEncoder().encode("message-key-wrapping"),
      name: "HKDF",
      salt: new Uint8Array(32)
    },
    keyMaterial,
    256
  )

  const wrappingKey = new Uint8Array(wrappingKeyBuffer)

  const nonce = sodium.randombytes_buf(
    sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES
  )

  try {
    const encryptedMessageKey =
      sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        messageKey,
        null,
        null,
        nonce,
        wrappingKey
      )

    return {
      encryptedMessageKey,
      nonce
    }
  } finally {
    sodium.memzero(wrappingKey)
  }
}

export async function encryptMessage(
  message: string,
  privateKey: CryptoKey,
  recipientPublicKey: CryptoKey,
  myPublicKey: CryptoKey,
  recipientId: string,
  myUserId: string
) {
  await sodium.ready

  const messageKey = sodium.randombytes_buf(
    sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES
  )

  const nonce = sodium.randombytes_buf(
    sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES
  )

  try {
    const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
      sodium.from_string(message),
      null,
      null,
      nonce,
      messageKey
    )

    const recipientKey = await encryptMessageKey(
      messageKey,
      privateKey,
      recipientPublicKey
    )

    const senderKey = await encryptMessageKey(
      messageKey,
      privateKey,
      myPublicKey
    )

    return {
      ciphertext,
      keys: [
        {
          encryptedMessageKey: sodium.to_base64(
            recipientKey.encryptedMessageKey,
            sodium.base64_variants.ORIGINAL
          ),
          nonce: sodium.to_base64(
            recipientKey.nonce,
            sodium.base64_variants.ORIGINAL
          ),
          userId: recipientId
        },
        {
          encryptedMessageKey: sodium.to_base64(
            senderKey.encryptedMessageKey,
            sodium.base64_variants.ORIGINAL
          ),
          nonce: sodium.to_base64(
            senderKey.nonce,
            sodium.base64_variants.ORIGINAL
          ),
          userId: myUserId
        }
      ],
      nonce
    }
  } finally {
    sodium.memzero(messageKey)
  }
}
