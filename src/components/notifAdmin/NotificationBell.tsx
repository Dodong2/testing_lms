import { useState } from "react"
import { useNotifAdmin } from "@/hooks/notification/useNotifAdmin"
import { formatCreatedAt } from "@/util/formatCreatedAt"
import { useNotificationEvents } from "@/hooks/socket/useSocketNotification";
import { FaBell } from "react-icons/fa6";

const NotificationBell = () => {
    useNotificationEvents()
    const [open, setOpen] = useState(false)
    const [page, setPage] = useState(1)
    const { data, isFetching } = useNotifAdmin().useGetNotifications(page)
    const { mutate: markAllAsRead } = useNotifAdmin().useMarkAllAsRead()
    const notifications = data?.notifications ?? []
    const unreadCount = notifications.filter(n => !n.read).length

    const toggleDropdown = () => {
        if (!open && unreadCount > 0) {
            markAllAsRead()
        }
        setOpen(!open)
    }

    const hasNext = data && page < data.totalPages
    const hasPrev = page > 1

    return (
        <div className="relative">
            <button onClick={toggleDropdown} className="relative cursor-pointer active:scale-95 transition-transform duration-75">
                <FaBell className="text-3xl text-white" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-4 mt-2 w-64 bg-white border shadow-lg rounded-md p-2 z-50">
                    {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500">No notifications</p>
                    ) : (
                        <>
                            {notifications.map(n => (
                                <div key={n.id} className="p-2 border-b last:border-b-0">
                                    <p className="text-sm font-semibold">{n.message}</p>
                                    <p className="text-xs text-gray-400">{formatCreatedAt(n.createdAt)}</p>
                                </div>
                            ))}

                            <div className="flex justify-between items-center mt-2 text-sm">
                                <button
                                    onClick={() => setPage(p => p - 1)}
                                    disabled={!hasPrev || isFetching}
                                    className="px-2 py-1 border rounded disabled:opacity-50"
                                >
                                    Prev
                                </button>
                                <span>Page {data?.page} / {data?.totalPages}</span>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={!hasNext || isFetching}
                                    className="px-2 py-1 border rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default NotificationBell