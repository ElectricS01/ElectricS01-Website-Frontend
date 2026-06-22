import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export const dayjsShort = (date) => dayjs(date).format("HH:mm:ss")
export const dayjsLong = (date) => dayjs(date).format("DD/MM/YYYY HH:mm:ss")
export const dayjsDate = (date) => dayjs(date).format("D MMMM YYYY")
export const dayjsSince = (date) => dayjs(date).fromNow()
