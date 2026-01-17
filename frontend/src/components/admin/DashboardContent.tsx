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
  Database,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  FileArchive,
  HelpCircle,
  Globe,
  LockKeyhole,
  Hourglass,
} from "lucide-react";
import { useUserSummary } from "@/hooks/useUserSummary";
import { UserSummaryStatsResponse } from "@/api/apiTypes";
import CircularLoader from "../ui/CircularLoader";
import { useHistory, useMetrices, useSummary } from "@/hooks/useMetrices";
import { useDashboardStats } from "@/hooks/useDashboardStats";

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
  const { data: dashboardStats, isLoading: dashboardLoading } =
    useDashboardStats();

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
        {activeTab === "content" && (
          <ContentTab content={dashboardStats} isLoading={dashboardLoading} />
        )}
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
  const { data: dataHistory } = useHistory();
  const { data: dataMetrices } = useMetrices();
  const { data: dataSumamry } = useSummary();
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

const ContentTab = ({
  content,
  isLoading,
}: {
  content: any;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return <CircularLoader />;
  }

  if (
    !content ||
    !content.species ||
    !content.video ||
    !content.textGuide ||
    !content.forum ||
    !content.community ||
    !content.faq
  ) {
    return (
      <div className="flex justify-center items-center h-40 text-muted-foreground">
        Data not available
      </div>
    );
  }

  const data = content;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Top Row - Main Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {/* Species Card */}
        <div className="p-3 sm:p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
                <Fish className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground">
                Species
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground">
              {data.species.totalSpecies}
            </span>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
                <span className="text-muted-foreground">Published</span>
              </div>
              <span className="font-medium text-green-500">
                {data.species.statusCount.published}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500" />
                <span className="text-muted-foreground">Draft</span>
              </div>
              <span className="font-medium text-amber-500">
                {data.species.statusCount.draft}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <FileArchive className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Archived</span>
              </div>
              <span className="font-medium text-muted-foreground">
                {data.species.statusCount.archived}
              </span>
            </div>
          </div>
          {/* Mini Progress Bar */}
          <div className="mt-2 sm:mt-3 h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden flex">
            <div
              className="bg-green-500 h-full"
              style={{
                width: `${(data.species.statusCount.published /
                    data.species.totalSpecies) *
                  100
                  }%`,
              }}
            />
            <div
              className="bg-amber-500 h-full"
              style={{
                width: `${(data.species.statusCount.draft / data.species.totalSpecies) *
                  100
                  }%`,
              }}
            />
            <div
              className="bg-muted-foreground/50 h-full"
              style={{
                width: `${(data.species.statusCount.archived /
                    data.species.totalSpecies) *
                  100
                  }%`,
              }}
            />
          </div>
        </div>

        {/* Video Guides Card */}
        <div className="p-3 sm:p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-purple-500/10 rounded-lg">
                <Video className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground">
                Video Guides
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground">
              {data.video.totalVideo}
            </span>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
                <span className="text-muted-foreground">Approved</span>
              </div>
              <span className="font-medium text-green-500">
                {data.video.typesOfVideo.approved}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Hourglass className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500" />
                <span className="text-muted-foreground">Pending</span>
              </div>
              <span className="font-medium text-amber-500">
                {data.video.typesOfVideo.pending}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <XCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-500" />
                <span className="text-muted-foreground">Rejected</span>
              </div>
              <span className="font-medium text-red-500">
                {data.video.typesOfVideo.rejected}
              </span>
            </div>
          </div>
          <div className="mt-2 sm:mt-3 h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden flex">
            {data.video.totalVideo > 0 && (
              <>
                <div
                  className="bg-green-500 h-full"
                  style={{
                    width: `${(data.video.typesOfVideo.approved /
                        data.video.totalVideo) *
                      100
                      }%`,
                  }}
                />
                <div
                  className="bg-amber-500 h-full"
                  style={{
                    width: `${(data.video.typesOfVideo.pending /
                        data.video.totalVideo) *
                      100
                      }%`,
                  }}
                />
                <div
                  className="bg-red-500 h-full"
                  style={{
                    width: `${(data.video.typesOfVideo.rejected /
                        data.video.totalVideo) *
                      100
                      }%`,
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* Text Guides Card */}
        <div className="p-3 sm:p-4 bg-card rounded-lg border border-border sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground">
                Text Guides
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground">
              {data.textGuide.totalText}
            </span>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
                <span className="text-muted-foreground">Approved</span>
              </div>
              <span className="font-medium text-green-500">
                {data.textGuide.typesOfText.approved}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Hourglass className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500" />
                <span className="text-muted-foreground">Pending</span>
              </div>
              <span className="font-medium text-amber-500">
                {data.textGuide.typesOfText.pending}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <XCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-500" />
                <span className="text-muted-foreground">Rejected</span>
              </div>
              <span className="font-medium text-red-500">
                {data.textGuide.typesOfText.rejected}
              </span>
            </div>
          </div>
          <div className="mt-2 sm:mt-3 h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden flex">
            {data.textGuide.totalText > 0 && (
              <>
                <div
                  className="bg-green-500 h-full"
                  style={{
                    width: `${(data.textGuide.typesOfText.approved /
                        data.textGuide.totalText) *
                      100
                      }%`,
                  }}
                />
                <div
                  className="bg-amber-500 h-full"
                  style={{
                    width: `${(data.textGuide.typesOfText.pending /
                        data.textGuide.totalText) *
                      100
                      }%`,
                  }}
                />
                <div
                  className="bg-red-500 h-full"
                  style={{
                    width: `${(data.textGuide.typesOfText.rejected /
                        data.textGuide.totalText) *
                      100
                      }%`,
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row - Secondary Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {/* Forum Card */}
        <div className="p-3 sm:p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-orange-500/10 rounded-lg">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground">
                Forum Posts
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground">
              {data.forum.totalForum}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-2">
            <div className="text-center p-1.5 sm:p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                <ShieldCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-purple-500" />
              </div>
              <span className="text-sm sm:text-lg font-bold text-foreground">
                {data.forum.createdByAdmin}
              </span>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                Admin
              </p>
            </div>
            <div className="text-center p-1.5 sm:p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                <HeadphonesIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-500" />
              </div>
              <span className="text-sm sm:text-lg font-bold text-foreground">
                {data.forum.createdBySupport}
              </span>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                Support
              </p>
            </div>
            <div className="text-center p-1.5 sm:p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-500" />
              </div>
              <span className="text-sm sm:text-lg font-bold text-foreground">
                {data.forum.createdByUser}
              </span>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                Users
              </p>
            </div>
          </div>
        </div>

        {/* Community Card */}
        <div className="p-3 sm:p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-cyan-500/10 rounded-lg">
                <MessagesSquare className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground">
                Communities
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground">
              {data.community.totalCommunity}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-2">
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-muted/50 rounded-lg">
              <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-sm sm:text-lg font-bold text-foreground">
                  {data.community.publicCount}
                </span>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                  Public
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-muted/50 rounded-lg">
              <LockKeyhole className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-sm sm:text-lg font-bold text-foreground">
                  {data.community.privateCount}
                </span>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                  Private
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Card */}
        <div className="p-3 sm:p-4 bg-card rounded-lg border border-border sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-pink-500/10 rounded-lg">
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-foreground">
                FAQs
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground">
              {data.faq.totalFaq}
            </span>
          </div>
          <div className="flex items-center justify-center h-12 sm:h-16">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <HelpCircle className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500/30" />
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                Questions & Answers
              </p>
            </div>
          </div>
        </div>
      </div>
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
