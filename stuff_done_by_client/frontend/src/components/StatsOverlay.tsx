import { useEffect, useState } from "react";
import { Users, Video, BookOpen, Fish, Sprout } from "lucide-react";
import { socket } from "@/lib/socket";
import axios from "axios";

interface StatsData {
  users: number;
  videoGuides: number;
  textGuides: number;
  species: number;
  plants: number;
}

export const StatsOverlay = ({ className }: { className?: string }) => {
  const [stats, setStats] = useState<StatsData>({
    users: 0,
    videoGuides: 0,
    textGuides: 0,
    species: 0,
    plants: 0,
  });

  useEffect(() => {
    const fetchCurrentStats = async () => {
      try {
        const res = await axios.get("https://theaquaguide.com/api/stats");
        // ONLY update if we actually got data
        if (res.data && typeof res.data.users === 'number') {
           setStats({
            ...res.data,
            plants: res.data.plants || 0
          });
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchCurrentStats();

    const handleStatsUpdate = (newStats: StatsData) => {
      // Safety check: ensure the incoming socket data isn't empty
      if (newStats && typeof newStats.users === 'number') {
        setStats({
          ...newStats,
          plants: newStats.plants || 0
        });
      }
    };

    socket.on("statsUpdate", handleStatsUpdate);
    socket.on("reconnect", fetchCurrentStats);

    return () => {
      socket.off("statsUpdate", handleStatsUpdate);
      socket.off("reconnect", fetchCurrentStats);
    };
  }, []);

  // 3D Embossed Style
  const cardStyle = "bg-secondary/80 backdrop-blur-md border border-white/10 shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.1)] rounded-xl hover:scale-105 transition-transform duration-300";
  const circleStyle = "bg-secondary/80 backdrop-blur-md border border-white/10 shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_8px_rgba(255,255,255,0.1)] rounded-full";

  const StatCard = ({ icon: Icon, value, label, className, reverse }: any) => (
    <div className={`flex flex-col justify-center items-center p-6 min-w-[140px] aspect-square ${cardStyle} ${className}`}>
      {reverse ? (
        <>
          <span className="text-xs md:text-sm text-muted-foreground font-medium leading-tight mb-2 whitespace-nowrap">
            {label}
          </span>
          <span className="text-xl md:text-2xl font-bold text-foreground leading-none mb-3">
            {value}
          </span>
          <Icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
        </>
      ) : (
        <>
          <Icon className="h-6 w-6 md:h-8 md:w-8 text-primary mb-3" />
          <span className="text-xl md:text-2xl font-bold text-foreground leading-none mb-2">
            {value}
          </span>
          <span className="text-xs md:text-sm text-muted-foreground font-medium leading-tight whitespace-nowrap">
            {label}
          </span>
        </>
      )}
    </div>
  );

  return (
    <div className={`bg-card/90 backdrop-blur-sm p-4 md:rounded-2xl border border-border shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 ${className || ''}`}>
      <h3 className="hidden md:block text-xs font-semibold mb-4 text-foreground/80 border-b border-border/50 pb-2 uppercase tracking-wider text-center">
        Live Community Stats
      </h3>
      
      {/* Mobile View: 5 columns side by side */}
      <div className="grid grid-cols-5 gap-2 md:hidden">
        <div className={`flex flex-col items-center justify-center p-2 rounded-lg ${cardStyle}`}>
          <Users className="h-4 w-4 text-primary mb-1" />
          <span className="text-sm font-bold text-foreground leading-none">{stats.users}</span>
          <span className="text-[10px] text-muted-foreground font-medium text-center mt-1">Users</span>
        </div>
        <div className={`flex flex-col items-center justify-center p-2 rounded-lg ${cardStyle}`}>
          <Video className="h-4 w-4 text-primary mb-1" />
          <span className="text-sm font-bold text-foreground leading-none">{stats.videoGuides}</span>
          <span className="text-[10px] text-muted-foreground font-medium text-center mt-1">Videos</span>
        </div>
        <div className={`flex flex-col items-center justify-center p-2 rounded-lg ${cardStyle}`}>
          <Fish className="h-4 w-4 text-primary mb-1" />
          <span className="text-sm font-bold text-foreground leading-none">{stats.species}</span>
          <span className="text-[10px] text-muted-foreground font-medium text-center mt-1">Species</span>
        </div>
        <div className={`flex flex-col items-center justify-center p-2 rounded-lg ${cardStyle}`}>
          <BookOpen className="h-4 w-4 text-primary mb-1" />
          <span className="text-sm font-bold text-foreground leading-none">{stats.textGuides}</span>
          <span className="text-[10px] text-muted-foreground font-medium text-center mt-1">Guides</span>
        </div>
        <div className={`flex flex-col items-center justify-center p-2 rounded-lg ${cardStyle}`}>
          <Sprout className="h-4 w-4 text-primary mb-1" />
          <span className="text-sm font-bold text-foreground leading-none">{stats.plants}</span>
          <span className="text-[10px] text-muted-foreground font-medium text-center mt-1">Plants</span>
        </div>
      </div>

      {/* Desktop View: Grid with Center Overlay */}
      <div className="hidden md:block relative">
        <div className="grid grid-cols-2 gap-4 [mask-image:radial-gradient(circle_at_center,transparent_55px,black_56px)] [-webkit-mask-image:radial-gradient(circle_at_center,transparent_55px,black_56px)]">
          <StatCard icon={Users} value={stats.users} label="Users" className="items-center" reverse={true} />
          <StatCard icon={Video} value={stats.videoGuides} label="Video Guides" className="items-center" reverse={true} />
          <StatCard icon={BookOpen} value={stats.textGuides} label="Text Guides" className="items-center" />
          <StatCard icon={Sprout} value={stats.plants} label="Aquatic Plants" className="items-center" />
        </div>

        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
           <div className={`flex flex-col items-center justify-center w-24 h-24 ${circleStyle} z-10 animate-in zoom-in duration-300`}>
              <Fish className="h-6 w-6 text-primary mb-1" />
              <span className="text-xl font-bold text-foreground leading-none">
                {stats.species}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight mt-1 uppercase tracking-wide">
                Species
              </span>
           </div>
        </div>
      </div>
    </div>
  );
};
