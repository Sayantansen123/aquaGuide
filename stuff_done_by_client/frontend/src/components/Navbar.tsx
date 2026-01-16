import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Moon, Sun, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { logout, setIsLoggedIn, setRole, setAuthModalOpen, setAuthModalView } from "@/store/userSlice";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import ChangePasswordModal from "./ChangePasswordModal";
import AuthModal from "./AuthModal";
import { authApi } from "@/api/modules/auth";
import { navItems } from "@/lib/nav-config";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  
  // Auth Modal State from Redux
  const authModalOpen = useSelector((state: RootState) => state.user.authModalOpen);
  const authModalView = useSelector((state: RootState) => state.user.authModalView);
  
  const role = useSelector((state: RootState) => state.user.role);
  const navigate = useNavigate();
  const location = useLocation();

  const userid = localStorage.getItem("userid");

  useEffect(() => {
    const getRoles = async () => {
      try {
        const res = await authApi.getRole(userid);
        console.log(res?.data?.role || "user");
        dispatch(setRole(res?.data?.role || "user"));
      } catch (error) {
        return "user";
      }
    };
    if (userid) {
      getRoles();
    }
  }, [userid]);

  const { isLoggedIn } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== null) {
      dispatch(setIsLoggedIn(localStorage.getItem("isLoggedIn")));
    }
  }, [isLoggedIn]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const openAuthModal = (view: "login" | "register") => {
    dispatch(setAuthModalView(view));
    dispatch(setAuthModalOpen(true));
    setIsOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="mr-4"
            >
              <img 
                src={resolvedTheme === "dark" ? "/dark_theme_logo.webp" : "/light_theme_logo.webp"}
                alt="Aqua Guide" 
                className="h-10 w-auto" 
              />
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex mr-4">
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    {item.children ? (
                      <>
                        <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50 h-9 px-4">
                          {item.icon && <FontAwesomeIcon icon={item.icon} className="mr-2 h-4 w-4" />}
                          {item.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {item.children.map((child) => (
                              <li key={child.name}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    to={child.path}
                                    className={cn(
                                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    )}
                                  >
                                    <div className="flex items-center gap-2 text-sm font-medium leading-none">
                                      {child.icon && <FontAwesomeIcon icon={child.icon} className="h-4 w-4" />}
                                      {child.name}
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.path}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "bg-transparent hover:bg-accent/50 h-9 px-4"
                          )}
                        >
                          {item.icon && <FontAwesomeIcon icon={item.icon} className="mr-2 h-4 w-4" />}
                          {item.name}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-sm mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search species, guides, or topics..."
                  className="w-full pl-10 bg-background/50 border-border/50 focus:bg-background transition-colors"
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
              {isLoggedIn ? (
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
                      dispatch(logout());
                      navigate("/");
                      toast.success("Logged out successfully");
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="outline" onClick={() => openAuthModal("login")}>
                    Dive In
                  </Button>
                  <Button variant="ocean" onClick={() => openAuthModal("register")}>
                    Join Reef
                  </Button>
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

                    <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
                      {navItems.map((item) => (
                        <div key={item.name} className="space-y-1">
                          {item.children ? (
                            <div className="space-y-1">
                              <h4 className="font-medium text-sm text-muted-foreground px-2 py-1">
                                {item.name}
                              </h4>
                              {item.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.path}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors",
                                location.pathname === child.path && "bg-accent"
                              )}
                            >
                              {child.icon && (
                                <FontAwesomeIcon
                                  icon={child.icon}
                                  className="h-4 w-4"
                                />
                              )}
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors",
                            location.pathname === item.path && "bg-accent"
                          )}
                        >
                          {item.icon && (
                            <FontAwesomeIcon
                              icon={item.icon}
                              className="h-4 w-4"
                            />
                          )}
                          {item.name}
                        </Link>
                      )}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3">
                      {isLoggedIn === "true" ? (
                        <>
                          <Link to="/profile" onClick={() => setIsOpen(false)}>
                            <Button variant="ocean" className="w-full">
                              Profile
                            </Button>
                          </Link>
                          {role === "admin" || role === "support" ? (
                            location.pathname.startsWith("/admin") ? (
                              <Link to="/" onClick={() => setIsOpen(false)}>
                                <Button variant="ocean" className="w-full">
                                  Go to Main Website
                                </Button>
                              </Link>
                            ) : (
                              <Link to="/admin" onClick={() => setIsOpen(false)}>
                                <Button variant="ocean" className="w-full">
                                  Admin Dashboard
                                </Button>
                              </Link>
                            )
                          ) : (
                            <></>
                          )}

                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              dispatch(logout());
                              navigate("/");
                              toast.success("Logged out successfully");
                            }}
                          >
                            Logout
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => openAuthModal("login")}
                          >
                            Dive In
                          </Button>
                          <Button 
                            variant="ocean" 
                            className="w-full"
                            onClick={() => openAuthModal("register")}
                          >
                            Join Reef
                          </Button>
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
      <AuthModal
        isOpen={authModalOpen}
        onOpenChange={(open) => dispatch(setAuthModalOpen(open))}
        defaultView={authModalView}
      />
    </>
  );
};

export default Navbar;
