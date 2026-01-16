import { useState } from "react";
import { cn } from "@/lib/utils";
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
  UserCheck,
  UserX,
  Radio,
  Lock,
  HeadphonesIcon,
  ShieldCheck,
  Cpu,
  HardDrive,
  Network,
  Image,
  FolderOpen,
  MessageCircle,
  Database,
  Zap,
  Clock,
} from "lucide-react";
import { useUserSummary } from "@/hooks/useUserSummary";
import { UserSummaryStatsResponse } from "@/api/apiTypes";
import CircularLoader from "../ui/CircularLoader";

type DashboardTab = "accounts" | "server" | "content" | "database";

const dashboardTabs = [
  { id: "accounts" as DashboardTab, label: "Accounts" },
  { id: "server" as DashboardTab, label: "Server Performance" },
  { id: "content" as DashboardTab, label: "Content" },
  { id: "database" as DashboardTab, label: "Database" },
];

export const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("accounts");
  const { data, isLoading } = useUserSummary();
  const userSummary: UserSummaryStatsResponse = data;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Mini Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {dashboardTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-0">
        {activeTab === "accounts" && (
          <AccountsTab data={userSummary} isLoading={isLoading} />
        )}
        {activeTab === "server" && <ServerTab />}
        {activeTab === "content" && <ContentTab />}
        {activeTab === "database" && <DatabaseTab />}
      </div>
    </div>
  );
};

const AccountsTab = (props: {
  data: UserSummaryStatsResponse;
  isLoading: boolean;
}) => {
  const accountStats = [
    {
      label: "Active Users",
      value: props?.data?.data?.active_users || 0,
      icon: UserCheck,
      color: "text-green-500",
    },
    {
      label: "Inactive Users",
      value: props?.data?.data?.inactive_users || 0,
      icon: UserX,
      color: "text-amber-500",
    },
    {
      label: "Guest Users",
      value: props?.data?.data?.guest_users || 0,
      icon: Radio,
      color: "text-emerald-500",
    },
    {
      label: "Locked Users",
      value: props?.data?.data?.locked_users || 0,
      icon: Lock,
      color: "text-red-500",
    },
    {
      label: "Support Users",
      value: props?.data?.data?.support_users || 0,
      icon: HeadphonesIcon,
      color: "text-blue-500",
    },
    {
      label: "Admin Users",
      value: props?.data?.data?.admin_users || 0,
      icon: ShieldCheck,
      color: "text-purple-500",
    },
  ];

  return (
    <div>
      {props.isLoading ? (
        <CircularLoader />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {accountStats.map((stat) => (
            <div
              key={stat.label}
              className="p-3 bg-card rounded-lg border border-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={cn("h-4 w-4", stat.color)} />
                <span className="text-xs text-muted-foreground truncate">
                  {stat.label}
                </span>
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ServerTab = () => {
  const serverStats = [
    {
      label: "CPU Usage",
      value: "34%",
      icon: Cpu,
      progress: 34,
      color: "bg-blue-500",
    },
    {
      label: "Memory Usage",
      value: "62%",
      icon: Activity,
      progress: 62,
      color: "bg-amber-500",
    },
    {
      label: "Disk Usage",
      value: "48%",
      icon: HardDrive,
      progress: 48,
      color: "bg-green-500",
    },
    {
      label: "Network I/O",
      value: "1.2 GB/s",
      icon: Network,
      progress: 28,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {serverStats.map((stat) => (
        <div
          key={stat.label}
          className="p-3 bg-card rounded-lg border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
          <p className="text-xl font-bold text-foreground mb-2">{stat.value}</p>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", stat.color)}
              style={{ width: `${stat.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const ContentTab = () => {
  const contentStats = [
    {
      label: "Total Species",
      value: "892",
      active: 845,
      inactive: 47,
      icon: Fish,
    },
    {
      label: "Media Files",
      value: "3,456",
      active: 3200,
      inactive: 256,
      icon: FolderOpen,
    },
    {
      label: "Images",
      value: "2,134",
      active: 2000,
      inactive: 134,
      icon: Image,
    },
    {
      label: "Forum Posts",
      value: "1,567",
      active: 1400,
      inactive: 167,
      icon: MessageCircle,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {contentStats.map((stat) => (
        <div
          key={stat.label}
          className="p-3 bg-card rounded-lg border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
          <p className="text-xl font-bold text-foreground">{stat.value}</p>
          <div className="flex gap-3 mt-2 text-xs">
            <span className="text-green-500">{stat.active} active</span>
            <span className="text-muted-foreground">
              {stat.inactive} inactive
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const DatabaseTab = () => {
  const dbStats = [
    { label: "Avg Query Time", value: "12ms", icon: Clock, status: "good" },
    { label: "Fast Queries", value: "98.2%", icon: Zap, status: "good" },
    { label: "Slow Queries", value: "1.8%", icon: Database, status: "warning" },
    {
      label: "Failed Queries",
      value: "0.02%",
      icon: Database,
      status: "error",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-500";
      case "warning":
        return "text-amber-500";
      case "error":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {dbStats.map((stat) => (
        <div
          key={stat.label}
          className="p-3 bg-card rounded-lg border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
          <p className={cn("text-xl font-bold", getStatusColor(stat.status))}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

const ManageForumContent = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Manage Forum Posts</h1>
    <p className="text-muted-foreground">
      Moderate and manage forum discussions.
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
