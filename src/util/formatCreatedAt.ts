// utils/formatCreatedAt.ts
import {
  format,
  isToday,
  isYesterday,
  differenceInDays,
  differenceInMonths,
  differenceInHours,
  formatDistanceToNow
} from "date-fns"

export function formatCreatedAt(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date
  const now = new Date()

  // ✅ If today
  if (isToday(parsedDate)) {
    const hours = differenceInHours(now, parsedDate)

    if (hours < 1) {
      // less than an hour → use minutes (auto handled)
      return formatDistanceToNow(parsedDate, { addSuffix: true }) // e.g. "45 minutes ago"
    } else {
      // 1 hour or more → use hours (auto handled din)
      return formatDistanceToNow(parsedDate, { addSuffix: true }) // e.g. "2 hours ago"
    }
  }

  // ✅ If yesterday
  if (isYesterday(parsedDate)) {
    return "Yesterday"
  }

  // ✅ If within weeks
  const days = differenceInDays(now, parsedDate)
  if (days < 28) {
    if(days < 7) {
      return `${days} day${days > 1 ? "s" : ""} ago`
    }
  }

  // ✅ If within months
  const months = differenceInMonths(now, parsedDate)
  if (months < 12) {
    return format(parsedDate, "MM/dd/yy")
  }

  // ✅ Otherwise full date
  return format(parsedDate, "MMM d, yyyy")
}
