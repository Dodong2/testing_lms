import { useState } from "react"
import { useNotifAdmin } from "@/hooks/notification/useNotifAdmin"
import { formatCreatedAt } from "@/util/formatCreatedAt"
import { useNotificationEvents } from "@/hooks/socket/useSocketNotification";
import { FaBell } from "react-icons/fa6";

const NotificationBell = () => {
    useNotificationEvents()
    const [open, setOpen] = useState(false)
    const { useGetNotifications } = useNotifAdmin()
    const { data } = useGetNotifications(1)
    const notifications = data?.notifications ?? []
    const unreadCount = notifications.filter(n => !n.read).length 

    return (
        <div className="relative">
            <button onClick={() => setOpen(!open)} className="relative cursor-pointer active:scale-95 transition-transform duration-75">
                <FaBell/>
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
                        notifications.map(n => (
                            <div key={n.id} className="p-2 border-b last:border-b-0">
                                <p className="text-sm font-semibold">{n.message}</p>
                                <p className="text-xs text-gray-400">{formatCreatedAt(n.createdAt)}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default NotificationBell