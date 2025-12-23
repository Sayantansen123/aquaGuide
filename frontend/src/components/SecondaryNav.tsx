import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Video Guides", path: "/video-guides" },
  { name: "Text Guides", path: "/text-guides" },
  { name: "Species Dictionary", path: "/species-dictionary" },
  { name: "Community Forum", path: "/community-forum" },
  { name: "Community Chat", path: "/community-chat" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "FAQ", path: "/faq" },
];

const SecondaryNav = () => {
  const location = useLocation();

  const currentPage =
    navItems.find((item) => item.path === location.pathname) || navItems[0];

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        {/* Mobile & Tablet Dropdown */}
        <div className="lg:hidden py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>{currentPage.name}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[calc(100vw-2rem)] max-w-md bg-popover"
              align="start"
            >
              {navItems.map((item) => (
                <DropdownMenuItem key={item.path} asChild>
                  <Link
                    to={item.path}
                    className={cn(
                      "w-full cursor-pointer",
                      location.pathname === item.path &&
                        "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop Horizontal Nav */}
        <div className="hidden lg:flex  justify-center gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2",
                location.pathname === item.path
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SecondaryNav;
