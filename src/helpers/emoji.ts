import Emojilib from "emojilib"

export const normalizedEmoji = Object.entries(Emojilib).map(
  ([key, descriptions]): [string, string[]] => [
    key,
    descriptions.map((d) => d.toLowerCase())
  ]
)
