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
  CircleAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { User } from "@/api/apiTypes";
import { useUsers } from "@/hooks/useUsers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/modules/auth";
import { toast } from "sonner";
import CircularLoader from "../ui/CircularLoader";
import { useDebounce } from "@/hooks/useDebounce";

const ManageUsers = () => {
  const userid = localStorage.getItem("userid");

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [region, setRegion] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [page, setPage] = useState(1);

  // const [users] = useState(mockUsers);
  const queryClient = useQueryClient();
  // Prepare filters object
  const filters: any = {};
  if (role) filters.role = role;
  if (status) filters.status = status;
  if (gender) filters.gender = gender;
  if (countryCode) filters.country_code = countryCode;
  if (region) filters.region = region;

  const { data, isLoading, isError } = useUsers(
    page,
    debouncedSearchQuery,
    filters
  );

  const userArray: User[] = data?.users || [];
  const totalPages: number = data?.pagination?.totalPages || 1;

  const deactivateUserMutation = useMutation({
    mutationFn: authApi.deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deactivated succesfully");
    },

    onError: () => {
      toast.error("Error deactivating support support");
    },
  });

  const activateUserMutation = useMutation({
    mutationFn: authApi.activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User activated succesfully");
    },

    onError: () => {
      toast.error("Error activating support support");
    },
  });

  const toggleSupportMutation = useMutation({
    mutationFn: authApi.toggleSupport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Support toggled successfully");
    },
    onError: () => {
      toast.error("Error toggling support");
    },
  });

  const deleteUser = useMutation({
    mutationFn: authApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Delete user successfully");
    },
    onError: () => {
      toast.error("Error deleting user");
    },
  });

  const toggleAdmin = useMutation({
    mutationFn: authApi.toggleAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Toggle admin successfully");
    },
    onError: () => {
      toast.error("Error toggling admin");
    },
  });

  if (isError) return <p>Failed to load users</p>;

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
    if (role === "inactive") {
      return (
        <Badge
          variant="secondary"
          className="ml-2 text-xs bg-gray-400 text-black"
        >
          <CircleAlert className="h-3 w-3 mr-1" />
          Inactive
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
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-7 px-2"
          onClick={() => {
            deactivateUserMutation.mutate(user.id);
          }}
        >
          <UserX className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Deactivate</span>
        </Button>
        {user.role !== "support" && user.role !== "admin" && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 border-primary/50 text-primary hover:bg-primary/10"
              onClick={() => {
                toggleSupportMutation.mutate(user.id);
              }}
            >
              <HeadsetIcon className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Make Support</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 border-primary/50 text-primary hover:bg-primary/10"
              onClick={() => {
                toggleAdmin.mutate(user.id);
              }}
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
            onClick={() => {
              toggleAdmin.mutate(user.id);
            }}
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
            onClick={() => {
              toggleSupportMutation.mutate(user.id);
            }}
          >
            <ShieldOff className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Remove Support</span>
          </Button>
        )}
        <Button
          variant="destructive"
          size="sm"
          className="text-xs h-7 px-2"
          onClick={() => {
            deleteUser.mutate(user.id);
          }}
        >
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
          {user.status === "inactive"
            ? getRoleBadge(user.status)
            : getRoleBadge(user.role)}
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
        {user.status === "inactive" ? (
          <>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2 border-primary/50 text-primary hover:bg-primary/10"
                onClick={() => {
                  activateUserMutation.mutate(user.id);
                }}
              >
                <Crown className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Make Active</span>
              </Button>

              <Button
                variant="destructive"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={() => {
                  deleteUser.mutate(user.id);
                }}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </>
        ) : (
          <ActionButtons user={user} />
        )}
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
        <div className="mt-4 max-w-2xl flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-primary text-black"
              placeholder="Search by username, email, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="button"
              variant={showFilters ? "secondary" : "outline"}
              className="h-10 px-4"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              Filters
            </Button>
          </div>
          {showFilters && (
            <div className="flex flex-wrap gap-2 mt-2">
              <select
                className="border rounded-md px-2 py-1"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Role</option>
                <option value="admin">Admin</option>
                <option value="support">Support</option>
                <option value="user">User</option>
              </select>
              <select
                className="border rounded-md px-2 py-1"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                className="border rounded-md px-2 py-1"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                className="border rounded-md px-2 py-1"
                placeholder="Country Code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              />
              <input
                type="text"
                className="border rounded-md px-2 py-1"
                placeholder="Region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                className="h-10 px-4"
                onClick={() => {
                  setRole("");
                  setStatus("");
                  setGender("");
                  setCountryCode("");
                  setRegion("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <CircularLoader />
        ) : (
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
                  <TableCell className="font-mono text-sm">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <LiveIndicator isLive={false} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-medium">{user.userid}</span>
                      {user.status === "inactive"
                        ? getRoleBadge(user.status)
                        : getRoleBadge(user.role)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.status === "inactive" ? (
                      <>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-7 px-2 border-primary/50 text-primary hover:bg-primary/10"
                            onClick={() => {
                              activateUserMutation.mutate(user.id);
                            }}
                          >
                            <Crown className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">
                              Make Active
                            </span>
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            className="text-xs h-7 px-2"
                            onClick={() => {
                              deleteUser.mutate(user.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </>
                    ) : (
                      <ActionButtons user={user} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {userArray.map((user) => (
          <MobileUserCard key={user.id} user={user} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="flex items-center gap-1 sm:gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-medium">
          <span className="px-2 py-1 bg-primary text-primary-foreground rounded-md min-w-[2rem] text-center">
            {page}
          </span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="flex items-center gap-1 sm:gap-2"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ManageUsers;
