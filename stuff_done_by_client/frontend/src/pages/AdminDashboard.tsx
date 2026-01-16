import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  Video,
  Fish,
  MessagesSquare,
  Activity,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ManageTextGuides from "@/components/admin/ManageTextGuides";
import ManageVideoGuides from "@/components/admin/ManageVideoGuides";
import ManageUsers from "@/components/admin/ManageUsers";
import ManageSpecies from "@/components/admin/ManageSpecies";
import { DashboardContent } from "@/components/admin/DashboardContent";
import ManageCommunityForum from "@/components/admin/ManageCommunityForum";

// Map Imports
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import httpClient from "@/api/axiosSetup";
import { socket } from "@/lib/socket";

// Fix Leaflet marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// --- Constants & Icons ---
const adminPin = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png";
const userPin = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png";
const guestPin = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png";

const mapMarkerIcons = {
  Staff: new L.Icon({
    iconUrl: adminPin,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  Registered: new L.Icon({
    iconUrl: userPin,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  Guest: new L.Icon({
    iconUrl: guestPin,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
};

type TabType =
  | "dashboard"
  | "manage-users"
  | "manage-forum"
  | "manage-text-guides"
  | "manage-video-guides"
  | "manage-species"
  | "manage-chat"
  | "live-users";

const sidebarItems = [
  { id: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
  { id: "manage-users" as TabType, label: "Manage Users", icon: Users },
  { id: "manage-forum" as TabType, label: "Manage Forum Posts", icon: MessageSquare },
  { id: "manage-text-guides" as TabType, label: "Manage Text Guides", icon: FileText },
  { id: "manage-video-guides" as TabType, label: "Manage Video Guides", icon: Video },
  { id: "manage-species" as TabType, label: "Manage Species", icon: Fish },
  { id: "manage-chat" as TabType, label: "Manage Chat Sessions", icon: MessagesSquare },
  { id: "live-users" as TabType, label: "Live Users Data", icon: Activity },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
              activeTab === item.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardContent />;
      case "manage-users": return <ManageUsers />;
      case "manage-forum": return <ManageCommunityForum placeholder={"Start typing"} />;
      case "manage-text-guides": return <ManageTextGuides placeholder={"Start typing"} />;
      case "manage-video-guides": return <ManageVideoGuides />;
      case "manage-species": return <ManageSpecies />;
      case "manage-chat": return <ManageChatContent />;
      case "live-users": return <LiveUsersContent />;
      default: return <DashboardContent />;
    }
  };

  return (
    <div className=" bg-background">
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <h2 className="text-lg font-bold text-primary">Admin Panel</h2>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="sr-only"> 
              <SheetHeader>
                <SheetTitle>Admin Navigation Menu</SheetTitle>
              </SheetHeader>
            </div>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex">
        <aside className="hidden lg:block w-72 min-h-[calc(100vh-64px)] bg-card border-r border-border">
          <SidebarContent />
        </aside>
        <main className="flex-1 p-6 max-sm:p-0">{renderContent()}</main>
      </div>
    </div>
  );
};

// --- LIVE USERS CONTENT COMPONENT ---
console.log("Base URL:", httpClient.defaults.baseURL);
const LiveUsersContent = () => {
  const [liveUsers, setLiveUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await httpClient.get("/manage_users/live-users", {
        headers: { useAuth: true }
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setLiveUsers(res.data.data);
      }
    } catch (err) {
      console.error("Map fetch error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    socket.on("live-tracking-update", (data) => {
      if (Array.isArray(data)) setLiveUsers(data);
    });
    const interval = setInterval(fetchUsers, 30000);
    return () => {
      socket.off("live-tracking-update");
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white">AquaGuide Live Monitor</h1>
          <p className="text-xs text-cyan-500/80 font-mono uppercase tracking-widest mt-1">System Online</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-cyan-400 leading-none">{liveUsers.length}</div>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Active Pointers</p>
        </div>
      </div>

      <div className="h-[650px] w-full rounded-2xl border-4 border-slate-900 overflow-hidden relative bg-[#0f172a]">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          {liveUsers.map((user, idx) => {
            const lat = Number(user.coords?.[0] || user.latitude);
            const lng = Number(user.coords?.[1] || user.longitude);

            if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return null;

            const userIcon = mapMarkerIcons[user.type as keyof typeof mapMarkerIcons] || mapMarkerIcons.Guest;

            return (
              <Marker key={user.socketId || idx} position={[lat, lng]} icon={userIcon}>
                <Popup>
                  <div className="p-2 text-slate-900">
                    <p className="font-bold border-b pb-1 mb-1">{user.name}</p>
                    <p className={cn(
                      "text-[10px] font-bold uppercase",
                      user.type === 'Staff' ? "text-red-600" : 
                      user.type === 'Registered' ? "text-green-600" : "text-blue-600"
                    )}>{user.type}</p>
                    <p className="text-xs text-slate-500">{user.city || "Tracking..."}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        <div className="absolute bottom-6 left-6 z-[1000] bg-slate-900/90 p-3 rounded-lg border border-slate-700 text-[10px] text-white space-y-2 backdrop-blur-sm">
           <div className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full"/> Staff (Admin)</div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"/> Registered User</div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"/> Guest</div>
        </div>
      </div>
    </div>
  );
};

const ManageChatContent = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Manage Chat Sessions</h1>
    <p className="text-muted-foreground">Monitor and moderate community chat sessions.</p>
  </div>
);

export default AdminDashboard;