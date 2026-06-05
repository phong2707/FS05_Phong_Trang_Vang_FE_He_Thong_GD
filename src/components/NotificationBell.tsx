import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { io, type Socket } from "socket.io-client";
import { toast } from "react-hot-toast";

interface CurrentUser {
  id: string;
}

interface NotificationPayload {
  id: string;
  userId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationBellProps {
  currentUser?: CurrentUser | null;
  socketUrl?: string;
}


export default function NotificationBell({
  currentUser,
  socketUrl = "http://localhost:8000",
}: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  const canConnect = useMemo(() => Boolean(currentUser?.id), [currentUser?.id]);

  useEffect(() => {
    if (!canConnect || !currentUser?.id) return;

    const socket: Socket = io(socketUrl, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      socket.emit("join_user_room", currentUser.id);
    });

    socket.on("new_notification", (payload: NotificationPayload) => {
      setUnreadCount((prev) => prev + 1);
      toast.success("Bạn có thông báo mới", {
        duration: 4000,
      });
      if (payload?.content) {
        toast(payload.content, {
          icon: "🔔",
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [canConnect, currentUser?.id, socketUrl]);

  return (
    <button
      type="button"
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition"
      aria-label="Notifications"
      title="Thông báo"
    >
      <Bell size={18} className="text-slate-700" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
