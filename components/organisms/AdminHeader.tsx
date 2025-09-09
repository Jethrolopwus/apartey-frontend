"use client";
import { Search } from "lucide-react";
import io from "socket.io-client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Notification, useGetAllNotificationsQuery } from "@/Hooks/use-getAllNotifications.query";

interface AdminUser {
  name: string;
  email: string;
  profilePicture?: string;
  role: string;
}



const socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
  transports: ["websocket"],
});

export default function Header() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data } = useGetAllNotificationsQuery();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (data?.length) {
      setNotifications(data);
    }
  }, [data]);

  useEffect(() => {
    socket.on("notification", (newNotification: Notification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  useEffect(() => {
    const loadAdminUser = () => {
      try {
        // Get user data from localStorage
        const email = localStorage.getItem("email");
        const userRole = localStorage.getItem("userRole");

        // For now, we'll use the email as name if no name is stored
        // In a real app, you might want to fetch user details from an API
        const name =
          localStorage.getItem("adminName") || email?.split("@")[0] || "Admin";
        const profilePicture = localStorage.getItem("adminProfilePicture");

        setAdminUser({
          name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
          email: email || "",
          profilePicture: profilePicture || undefined,
          role: userRole || "Admin",
        });
      } catch (error) {
        console.error("Error loading admin user data:", error);
        // Fallback to default values
        setAdminUser({
          name: "Admin",
          email: "",
          role: "Admin",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminUser();
  }, []);

  // Listen for profile updates (when profile picture is updated)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "adminProfilePicture" || e.key === "adminName") {
        loadAdminUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const loadAdminUser = () => {
    try {
      const email = localStorage.getItem("email");
      const userRole = localStorage.getItem("userRole");
      const name =
        localStorage.getItem("adminName") || email?.split("@")[0] || "Admin";
      const profilePicture = localStorage.getItem("adminProfilePicture");

      setAdminUser({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email || "",
        profilePicture: profilePicture || undefined,
        role: userRole || "Admin",
      });
    } catch (error) {
      console.error("Error loading admin user data:", error);
      setAdminUser({
        name: "Admin",
        email: "",
        role: "Admin",
      });
    }
  };

  return (
    <header className="flex sticky top-0 items-center h-8 justify-between border border-l-0 border-t-0 border-r-0 border-[#e0e0e0] bg-white px-6 py-4 min-h-[60px] w-full">
      <h1 className="text-xl font-bold">DashBoard</h1>
      <div className="relative w-[320px]">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </span>
        <input
          type="text"
          placeholder="Search here..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none shadow-sm placeholder-gray-400 text-base font-medium bg-[#F8F9FB]"
        />
      </div>

      <div className="flex items-center gap-8">
        <button
          onClick={() => router.push("/admin/notifications")}
          className="bg-[#FFFAF1] cursor-pointer h-[48px] relative w-[48px] rounded-[8px] flex justify-center items-center"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.6732 18.5536C21.0303 17.9805 20.4675 17.3235 19.9999 16.6003C19.4894 15.602 19.1834 14.5117 19.0999 13.3936V10.1003C19.1043 8.344 18.4672 6.64658 17.3084 5.32691C16.1495 4.00724 14.5486 3.15617 12.8065 2.93359V2.07359C12.8065 1.83755 12.7128 1.61118 12.5459 1.44427C12.379 1.27736 12.1526 1.18359 11.9165 1.18359C11.6805 1.18359 11.4541 1.27736 11.2872 1.44427C11.1203 1.61118 11.0265 1.83755 11.0265 2.07359V2.94693C9.30004 3.18555 7.71852 4.04176 6.57489 5.357C5.43126 6.67223 4.80302 8.35736 4.80654 10.1003V13.3936C4.72304 14.5117 4.41705 15.602 3.90654 16.6003C3.44712 17.3218 2.89333 17.9788 2.25987 18.5536C2.18876 18.6161 2.13176 18.693 2.09268 18.7792C2.0536 18.8654 2.03332 18.9589 2.0332 19.0536V19.9603C2.0332 20.1371 2.10344 20.3066 2.22847 20.4317C2.35349 20.5567 2.52306 20.6269 2.69987 20.6269H21.2332C21.41 20.6269 21.5796 20.5567 21.7046 20.4317C21.8296 20.3066 21.8999 20.1371 21.8999 19.9603V19.0536C21.8997 18.9589 21.8795 18.8654 21.8404 18.7792C21.8013 18.693 21.7443 18.6161 21.6732 18.5536ZM3.41987 19.2936C4.04014 18.6944 4.58627 18.0229 5.04654 17.2936C5.68961 16.0879 6.06482 14.7576 6.14654 13.3936V10.1003C6.1201 9.31895 6.25115 8.54031 6.5319 7.81071C6.81265 7.0811 7.23734 6.41545 7.7807 5.85339C8.32406 5.29134 8.97496 4.84437 9.69466 4.53911C10.4144 4.23385 11.1881 4.07653 11.9699 4.07653C12.7516 4.07653 13.5254 4.23385 14.2451 4.53911C14.9648 4.84437 15.6157 5.29134 16.159 5.85339C16.7024 6.41545 17.1271 7.0811 17.4078 7.81071C17.6886 8.54031 17.8196 9.31895 17.7932 10.1003V13.3936C17.8749 14.7576 18.2501 16.0879 18.8932 17.2936C19.3535 18.0229 19.8996 18.6944 20.5199 19.2936H3.41987Z"
              fill="#FFA412"
            />
            <path
              d="M11.9996 22.852C12.4195 22.8424 12.8225 22.6845 13.1373 22.4063C13.4521 22.1281 13.6583 21.7476 13.7196 21.332H10.2129C10.2759 21.7589 10.4918 22.1484 10.8204 22.428C11.1491 22.7076 11.5681 22.8583 11.9996 22.852Z"
              fill="#FFA412"
            />
          </svg>
          {notifications.length > 0 && (
            <div className="absolute right-2 top-2 h-[6px] w-[6px] rounded-full bg-[#EB5757]"></div>
          )}
        </button>
        <span className="text-sm text-gray-500 font-medium">Eng (US)</span>
        <div className="flex items-center gap-3 bg-[#F8F9FB] px-3 py-1.5 rounded-xl">
          {isLoading ? (
            <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse"></div>
          ) : adminUser?.profilePicture ? (
            <Image
              src={adminUser.profilePicture}
              alt={adminUser.name}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full border-2 border-white shadow object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full border-2 border-white shadow bg-[#C85212] flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {adminUser?.name?.charAt(0) || "A"}
              </span>
            </div>
          )}
          <div className="flex flex-col items-start">
            <span className="font-semibold text-gray-900 text-base leading-tight">
              {isLoading ? "Loading..." : adminUser?.name || "Admin"}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {adminUser?.role || "Admin"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
