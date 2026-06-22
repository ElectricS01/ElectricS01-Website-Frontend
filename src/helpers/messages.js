import dayjs from "dayjs"

export const merge = (message, previousMessage) => {
  if (previousMessage) {
    return (
      previousMessage.userId === message.userId &&
      dayjs(previousMessage.createdAt).isSame(message.createdAt, "day") &&
      !message.reply &&
      !dayjs(previousMessage.createdAt).isBefore(
        dayjs(message.createdAt).subtract(15, "minutes")
      )
    )
  }
}
