import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  HeadsetIcon,
  UserX,
  Trash2,
  ShieldOff,
  Crown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { authApi } from "@/api/modules/auth";
import { User } from "@/api/apiTypes";

// Mock data - replace with actual data from Supabase
const mockUsers = [
  {
    id: "1",
    username: "aqua_master",
    email: "admin@aquaguide.com",
    role: "admin",
    isLive: true,
    joinedAt: "2024-01-15",
  },
  {
    id: "2",
    username: "reef_keeper",
    email: "support@aquaguide.com",
    role: "support",
    isLive: true,
    joinedAt: "2024-02-20",
  },
  {
    id: "3",
    username: "coral_lover",
    email: "coral@example.com",
    role: "user",
    isLive: false,
    joinedAt: "2024-03-10",
  },
  {
    id: "4",
    username: "fish_whisperer",
    email: "fish@example.com",
    role: "user",
    isLive: true,
    joinedAt: "2024-04-05",
  },
  {
    id: "5",
    username: "tank_builder",
    email: "tank@example.com",
    role: "user",
    isLive: false,
    joinedAt: "2024-05-12",
  },
];

// Mock current user ID - replace with actual auth
const currentUserId = "1";

const ManageUsers = () => {
  const userid = localStorage.getItem("userid");
  const [users] = useState(mockUsers);
  const [userArray, setUserArray] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await authApi.getUsersData();
        setUserArray(res?.data?.users || []);
      } catch (error) {}
    };

    getUsers();
  }, []);

  const getRoleBadge = (role: string) => {
    if (role === "admin") {
      return (
        <Badge variant="destructive" className="ml-2 text-xs">
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      );
    }
    if (role === "support") {
      return (
        <Badge
          variant="secondary"
          className="ml-2 text-xs bg-primary/20 text-primary"
        >
          <HeadsetIcon className="h-3 w-3 mr-1" />
          Support
        </Badge>
      );
    }
    return null;
  };

  const LiveIndicator = ({ isLive }: { isLive: boolean }) => (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "h-3 w-3 rounded-full",
          isLive ? "bg-green-500 animate-pulse " : "bg-muted-foreground/40"
        )}
      />
    </div>
  );

  const ActionButtons = ({ user }: { user: User }) => {
    if (user.userid === userid) {
      return (
        <span className="text-muted-foreground italic text-sm">
          Self account
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="text-xs h-7 px-2">
          <UserX className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Deactivate</span>
        </Button>
        {user.role !== "support" && user.role !== "admin" && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 border-primary/50 text-primary hover:bg-primary/10"
            >
              <HeadsetIcon className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Make Support</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 border-primary/50 text-primary hover:bg-primary/10"
            >
              <Crown className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Make Admin</span>
            </Button>
          </>
        )}
        {user.role === "admin" && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2 border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <ShieldOff className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Remove Admin</span>
          </Button>
        )}

        {user.role === "support" && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2 border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <ShieldOff className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Remove Support</span>
          </Button>
        )}
        <Button variant="destructive" size="sm" className="text-xs h-7 px-2">
          <Trash2 className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>
    );
  };

  // Mobile card view
  const MobileUserCard = ({ user }: { user: User }) => (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LiveIndicator isLive={true} />
          <span className="font-medium">{user.userid}</span>
          {getRoleBadge(user.role)}
        </div>
      </div>
      <div className="text-sm text-muted-foreground space-y-1">
        <p>
          <span className="font-medium">ID:</span> {user.id}
        </p>
        <p>
          <span className="font-medium">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-medium">Joined:</span>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="pt-2 border-t border-border">
        <ActionButtons user={user} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
        <p className="text-muted-foreground mt-1">
          View and manage user accounts.
        </p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-16">ID</TableHead>
              <TableHead className="w-20 text-center">Status</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-28">Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userArray.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-sm">{index + 1}</TableCell>
                <TableCell>
                  <LiveIndicator isLive={false} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="font-medium">{user.userid}</span>
                    {getRoleBadge(user.role)}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <ActionButtons user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {userArray.map((user) => (
          <MobileUserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
