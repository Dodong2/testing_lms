import { useState } from "react"
import { useNotifAdmin } from "@/hooks/notification/useNotifAdmin"
import { formatCreatedAt } from "@/util/formatCreatedAt"
import { useNotificationEvents } from "@/hooks/socket/useSocketNotification";
import { FaBell } from "react-icons/fa6";
import Link from "next/link";

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
            <button onClick={toggleDropdown} className="relative cursor-pointer active:scale-95 transition-transform duration-75" title="notifications">
                <FaBell className="text-2xl text-amber-300 hover:text-white" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-3 mt-1/3 w-64 bg-white shadow-2xl rounded-md z-50">
                    {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500">No notifications</p>
                    ) : (
                        <>
                        <div className="p-1 text-center bg-amber-300 rounded-tr-md rounded-tl-md shadow-md">
                            <h1 className="text-gray-700 font-medium">Notifications</h1>
                        </div>
                            {notifications.map(n => (
                                <Link key={n.id} href='/home/admin/feedbackManage'>
                                <div  className="p-2 transition-colors duration-200 ease-in-out hover:bg-amber-100">
                                    <p className="text-sm font-semibold text-gray-700">{n.message}</p>
                                    <p className="text-xs text-gray-400">{formatCreatedAt(n.createdAt)}</p>
                                    <div className="w-1/1 mx-auto border-b border-gray-400 mt-1"></div>
                                </div>
                                </Link>
                            ))}

                            {/* paginations */}
                            <div className="flex justify-between items-center p-2 text-sm bg-amber-400 rounded-bl-md rounded-br-md">
                                <button
                                    onClick={() => setPage(p => p - 1)}
                                    disabled={!hasPrev || isFetching}
                                    className="px-2 py-1 border rounded disabled:opacity-50 font-medium text-gray-700 bg-yellow-100 border-transparent hover:border-b-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95 transition-transform"
                                >
                                    Prev
                                </button>
                                <span className="font-medium text-gray-700">Page {data?.page} / {data?.totalPages}</span>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={!hasNext || isFetching}
                                    className="px-2 py-1 border rounded disabled:opacity-50 font-medium text-gray-700 bg-yellow-100 border-transparent hover:border-b-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer active:scale-95 transition-transform"
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