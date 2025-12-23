import { useState } from "react";
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
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ManageTextGuides from "@/components/admin/ManageTextGuides";
import ManageVideoGuides from "@/components/admin/ManageVideoGuides";
import ManageUsers from "@/components/admin/ManageUsers";
import ManageSpecies from "@/components/admin/ManageSpecies";
import { DashboardContent } from "@/components/admin/DashboardContent";

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
  {
    id: "manage-forum" as TabType,
    label: "Manage Forum Posts",
    icon: MessageSquare,
  },
  {
    id: "manage-text-guides" as TabType,
    label: "Manage Text Guides",
    icon: FileText,
  },
  {
    id: "manage-video-guides" as TabType,
    label: "Manage Video Guides",
    icon: Video,
  },
  { id: "manage-species" as TabType, label: "Manage Species", icon: Fish },
  {
    id: "manage-chat" as TabType,
    label: "Manage Chat Sessions",
    icon: MessagesSquare,
  },
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
      case "dashboard":
        return <DashboardContent />;
      case "manage-users":
        return <ManageUsers />;
      case "manage-forum":
        return <ManageForumContent />;
      case "manage-text-guides":
        return <ManageTextGuides placeholder={"Start typing"} />;
      case "manage-video-guides":
        return <ManageVideoGuides />;
      case "manage-species":
        return <ManageSpecies />;
      case "manage-chat":
        return <ManageChatContent />;
      case "live-users":
        return <LiveUsersContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className=" bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4  border-b border-border bg-card">
        <h2 className="text-lg font-bold text-primary">Admin Panel</h2>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 min-h-[calc(100vh-64px)] bg-card border-r border-border">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 max-sm:p-0">{renderContent()}</main>
      </div>
    </div>
  );
};

// Placeholder content components
// const DashboardContent = () => (
//   <div className="space-y-6">
//     <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
//     <p className="text-muted-foreground">
//       Welcome to the admin dashboard. Select a section from the sidebar to
//       manage your content.
//     </p>
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       {[
//         { label: "Total Users", value: "1,234" },
//         { label: "Forum Posts", value: "567" },
//         { label: "Species", value: "890" },
//         { label: "Active Sessions", value: "45" },
//       ].map((stat) => (
//         <div
//           key={stat.label}
//           className="p-6 bg-card rounded-xl border border-border"
//         >
//           <p className="text-sm text-muted-foreground">{stat.label}</p>
//           <p className="text-2xl font-bold text-foreground mt-2">
//             {stat.value}
//           </p>
//         </div>
//       ))}
//     </div>
//   </div>
// );

const ManageUsersContent = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
    <p className="text-muted-foreground">View and manage user accounts.</p>
  </div>
);

const ManageForumContent = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Manage Forum Posts</h1>
    <p className="text-muted-foreground">
      Moderate and manage forum discussions.
    </p>
  </div>
);

const ManageVideoGuidesContent = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Manage Video Guides</h1>
    <p className="text-muted-foreground">Upload and manage video tutorials.</p>
  </div>
);

const ManageSpeciesContent = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Manage Species</h1>
    <p className="text-muted-foreground">
      Add and edit species information in the dictionary.
    </p>
  </div>
);

const ManageChatContent = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Manage Chat Sessions</h1>
    <p className="text-muted-foreground">
      Monitor and moderate community chat sessions.
    </p>
  </div>
);

const LiveUsersContent = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Live Users Data</h1>
    <p className="text-muted-foreground">
      View real-time user activity and analytics.
    </p>
  </div>
);

export default AdminDashboard;
