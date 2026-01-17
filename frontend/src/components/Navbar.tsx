import { Link, useNavigate } from "react-router-dom";
import { Search, Moon, Sun, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { logout, setIsLoggedIn, setRole } from "@/store/userSlice";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChangePasswordModal from "./ChangePasswordModal";
import { authApi } from "@/api/modules/auth";

const Navbar = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isOpen, setIsOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const role = useSelector((state: RootState) => state.user.role);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userid") || null;

  useEffect(() => {
    const getRoles = async () => {
      try {
        const res = await authApi.getRole(userId);
        // console.log(res?.data?.role || "user");
        dispatch(setRole(res?.data?.role || "user"));
      } catch (error) {
        return "user";
      }
    };
    if (userId) {
      getRoles();
    }
  }, [userId]);

  const dispatch = useDispatch();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="text-xl md:text-2xl font-bold ocean-gradient bg-clip-text text-transparent"
            >
              Aqua Guide
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search guides, species..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
              {userId ? (
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="w-full cursor-pointer">
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="w-full cursor-pointer"
                        onClick={() => setIsChangePasswordOpen(true)}
                      >
                        Change Password
                      </DropdownMenuItem>
                      {role === "admin" || role === "support" ? (
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="w-full cursor-pointer">
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <></>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="outline"
                    onClick={() => {
                      dispatch(logout()),
                        navigate("/"),
                        toast.success("Logged out successfully");
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline">Dive In</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="ocean">Join Reef</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <div className="flex flex-col gap-6 mt-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-10"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      {userId ? (
                        <>
                          <Link to="/profile" onClick={() => setIsOpen(false)}>
                            <Button variant="ocean" className="w-full">
                              Profile
                            </Button>
                          </Link>
                          {role === "admin" || role === "support" ? (
                            <Link to="/admin" onClick={() => setIsOpen(false)}>
                              <Button variant="ocean" className="w-full">
                                Admin Dashboard
                              </Button>
                            </Link>
                          ) : (
                            <></>
                          )}

                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              dispatch(logout()),
                                navigate("/"),
                                toast.success("Logged out successfully");
                            }}
                          >
                            Logout
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full">
                              Dive In
                            </Button>
                          </Link>
                          <Link to="/register" onClick={() => setIsOpen(false)}>
                            <Button variant="ocean" className="w-full">
                              Join Reef
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
      <ChangePasswordModal
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />
    </>
  );
};

export default Navbar;
