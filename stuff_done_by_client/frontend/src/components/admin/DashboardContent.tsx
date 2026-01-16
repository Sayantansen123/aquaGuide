import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  UserCheck, UserX, Radio, Lock, HeadphonesIcon, ShieldCheck, 
  Cpu, HardDrive, Network, Activity, Fish, FolderOpen, 
  Image, MessageCircle, Clock, Zap, Database
} from "lucide-react";
import { useUserSummary } from "@/hooks/useUserSummary";
import { UserSummaryStatsResponse } from "@/api/apiTypes";
import CircularLoader from "../ui/CircularLoader";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import httpClient from "@/api/axiosSetup";
import { socket } from "@/lib/socket";

// Fix Leaflet marker icons for Vite/React environment
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
const adminPin = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png";;
const userPin = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png";;
const guestPin = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

type DashboardTab = "accounts" | "server" | "content" | "database" | "live_map";

const dashboardTabs = [
  { id: "accounts" as DashboardTab, label: "Accounts" },
  { id: "server" as DashboardTab, label: "Server Performance" },
  { id: "content" as DashboardTab, label: "Content" },
  { id: "database" as DashboardTab, label: "Database" },
  { id: "live_map" as DashboardTab, label: "Live Users Map" },
];

// --- MAIN COMPONENT ---
export const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("accounts");
  const { data, isLoading } = useUserSummary();
  const userSummary: UserSummaryStatsResponse = data;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit flex-wrap">
        {dashboardTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-0">
        {activeTab === "accounts" && <AccountsTab data={userSummary} isLoading={isLoading} />}
        {activeTab === "server" && <ServerTab />}
        {activeTab === "content" && <ContentTab />}
        {activeTab === "database" && <DatabaseTab />}
        {activeTab === "live_map" && <LiveMapTab />}
      </div>
    </div>
  );
};

// --- ACCOUNTS TAB ---
const AccountsTab = (props: { data: UserSummaryStatsResponse; isLoading: boolean; }) => {
  const accountStats = [
    { label: "Active Users", value: props?.data?.data?.active_users || 0, icon: UserCheck, color: "text-green-500" },
    { label: "Inactive Users", value: props?.data?.data?.inactive_users || 0, icon: UserX, color: "text-amber-500" },
    { label: "Guest Users", value: props?.data?.data?.guest_users || 0, icon: Radio, color: "text-emerald-500" },
    { label: "Locked Users", value: props?.data?.data?.locked_users || 0, icon: Lock, color: "text-red-500" },
    { label: "Support Users", value: props?.data?.data?.support_users || 0, icon: HeadphonesIcon, color: "text-blue-500" },
    { label: "Admin Users", value: props?.data?.data?.admin_users || 0, icon: ShieldCheck, color: "text-purple-500" },
  ];
  return props.isLoading ? <div className="py-10"><CircularLoader /></div> : (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {accountStats.map((stat) => (
        <div key={stat.label} className="p-3 bg-card rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className={cn("h-4 w-4", stat.color)} />
            <span className="text-xs text-muted-foreground truncate">{stat.label}</span>
          </div>
          <p className="text-xl font-bold text-foreground">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

// --- SERVER TAB ---
const ServerTab = () => {
  const serverStats = [
    { label: "CPU Usage", value: "34%", icon: Cpu, progress: 34, color: "bg-blue-500" },
    { label: "Memory Usage", value: "62%", icon: Activity, progress: 62, color: "bg-amber-500" },
    { label: "Disk Usage", value: "48%", icon: HardDrive, progress: 48, color: "bg-green-500" },
    { label: "Network I/O", value: "1.2 GB/s", icon: Network, progress: 28, color: "bg-purple-500" },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {serverStats.map((stat) => (
        <div key={stat.label} className="p-3 bg-card rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
          <p className="text-xl font-bold text-foreground mb-2">{stat.value}</p>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", stat.color)} style={{ width: `${stat.progress}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};

// --- CONTENT TAB ---
const ContentTab = () => {
  const contentStats = [
    { label: "Total Species", value: "892", active: 845, inactive: 47, icon: Fish },
    { label: "Media Files", value: "3,456", active: 3200, inactive: 256, icon: FolderOpen },
    { label: "Images", value: "2,134", active: 2000, inactive: 134, icon: Image },
    { label: "Forum Posts", value: "1,567", active: 1400, inactive: 167, icon: MessageCircle },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {contentStats.map((stat) => (
        <div key={stat.label} className="p-3 bg-card rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
          <p className="text-xl font-bold text-foreground">{stat.value}</p>
          <div className="flex gap-3 mt-2 text-xs">
            <span className="text-green-500">{stat.active} active</span>
            <span className="text-muted-foreground">{stat.inactive} inactive</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- DATABASE TAB ---
const DatabaseTab = () => {
  const dbStats = [
    { label: "Avg Query Time", value: "12ms", icon: Clock, status: "good" },
    { label: "Fast Queries", value: "98.2%", icon: Zap, status: "good" },
    { label: "Slow Queries", value: "1.8%", icon: Database, status: "warning" },
    { label: "Failed Queries", value: "0.02%", icon: Database, status: "error" },
  ];
  const getStatusColor = (status: string) => {
    if (status === "good") return "text-green-500";
    if (status === "warning") return "text-amber-500";
    return "text-red-500";
  };
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {dbStats.map((stat) => (
        <div key={stat.label} className="p-3 bg-card rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
          <p className={cn("text-xl font-bold", getStatusColor(stat.status))}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

// --- LIVE MAP TAB ---
interface LiveUser {
  id: string | number;
  name: string;
  type: string;
  coords: [number, number];
  city: string;
}
const icons = {
  Admin: new L.Icon({
    iconUrl: adminPin,
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
  }),
  User: new L.Icon({
    iconUrl: userPin,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  Guest: new L.Icon({
    iconUrl: guestPin,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  }),
};
const LiveMapTab = () => {
  const [liveUsers, setLiveUsers] = useState<LiveUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Strict world bounds for single-view map
  const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));

  useEffect(() => {
    // 1. Remove fetchLiveUsers() and the setInterval entirely.
    // We rely solely on the real-time socket broadcast.

    const handleSocketUpdate = (users: any[]) => {
      console.log("Real-time Socket Data Received:", users);
      
      if (!Array.isArray(users)) return;

      const mappedUsers = users.map((u) => ({
        id: u.socketId || u.id || Math.random(),
        name: u.name || "User",
        // Normalize the type for the icons (Staff/Registered -> Admin/User)
        type: u.type === "Staff" ? "Admin" : (u.type === "Registered" ? "User" : "Guest"),
        coords: [
          Number(u.coords?.[0] || 0), 
          Number(u.coords?.[1] || 0)
        ] as [number, number],
        city: u.city || "Unknown"
      }));

      setLiveUsers(mappedUsers);
      setLoading(false); // Stop loader once first broadcast is received
    };

    // Listen for the broadcast from server.js
    socket.on("live-tracking-update", handleSocketUpdate);

    // Request an immediate update if the server supports a 'get-live-users' event, 
    // otherwise, the loader will disappear as soon as anyone (including you) moves/connects.
    setLoading(liveUsers.length === 0);

    return () => {
      socket.off("live-tracking-update", handleSocketUpdate);
    };
  }, []);

  return (
    <div style={{ height: "600px", width: "100%", position: "relative", background: "white" }} 
         className="rounded-lg border border-border overflow-hidden">
      
      {/* Show loader only if we have no users yet */}
      {loading && liveUsers.length === 0 && (
        <div className="absolute inset-0 bg-white/80 z-[1001] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <CircularLoader />
            <span className="text-xs text-muted-foreground animate-pulse">Waiting for live data...</span>
          </div>
        </div>
      )}

      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        minZoom={2}
        maxBounds={worldBounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", zIndex: 1, background: "white" }}
      >
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          noWrap={true}
          bounds={worldBounds}
          className="map-tiles-black-and-white"
        />

        {liveUsers.map((user, idx) => {
          const lat = user.coords[0];
          const lng = user.coords[1];
          
          // Skip invalid coordinates
          if (!lat || !lng || (lat === 20 && lng === 0)) return null;
          
          const userIcon = icons[user.type as keyof typeof icons] || icons.Guest;

          return (
            <Marker key={`${user.id}-${idx}`} position={[lat, lng]} icon={userIcon}>
              <Popup>
                <div className="text-slate-900 p-1">
                  <p className="font-bold border-b mb-1">{user.name}</p>
                  <p className={cn(
                    "text-xs uppercase font-bold",
                    user.type === 'Admin' ? "text-red-500" : 
                    user.type === 'User' ? "text-green-600" : "text-[#209CEE]"
                  )}>
                    {user.type}
                  </p>
                  <p className="text-xs">{user.city}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend / Key */}
      <div className="absolute bottom-4 left-4 z-[1002] bg-white/90 backdrop-blur-sm p-2 rounded border border-slate-200 shadow-sm text-[10px] uppercase font-bold">
         <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 bg-red-500 rounded-full"/> Admin</div>
         <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 bg-green-600 rounded-full"/> User</div>
         <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#209CEE] rounded-full"/> Guest</div>
      </div>

      <style>{`
        .map-tiles-black-and-white {
          filter: grayscale(100%) invert(100%) brightness(90%) contrast(150%);
        }
        .leaflet-container {
          background-color: white !important;
        }
      `}</style>
    </div>
  );
};