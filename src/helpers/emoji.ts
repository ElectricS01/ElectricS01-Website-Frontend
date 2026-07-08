import Emojilib from "emojilib"

export const normalizedEmojis = Object.entries(Emojilib).map(
  ([key, descriptions]): [string, string[]] => [
    key,
    descriptions.map((d) => d.toLowerCase())
  ]
)
