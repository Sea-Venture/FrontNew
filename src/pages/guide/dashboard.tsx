import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Search, Home, BookOpen, Star, Filter, User, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { GuideSidebar } from "./sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";
import logo from "../../assets/logos/logo.png";

export default function GuidePage() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const guideCategories = [
    "Beginner Guides",
    "Advanced Tutorials",
    "Map Navigation",
    "Resource Collection",
    "Community Tips",
  ];

  return (
    <SidebarProvider>
      <GuideSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-100">
          <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-green-200/50 shadow-sm">
            <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center ghibli-breathe magic-portal">
                    <img
                      src={logo}
                      alt="Guide Logo"
                      className="w-4 h-4 sm:w-6 sm:h-6 object-cover rounded-full"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold ghibli-text-gradient">
                    SeaGuide
                  </h1>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-4 flex-1 max-w-2xl mx-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-green-100/50 transition-all duration-300"
                  >
                    <Home className="h-5 w-5 text-green-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-green-100/50 transition-all duration-300"
                  >
                    <BookOpen className="h-5 w-5 text-green-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-green-100/50 transition-all duration-300"
                  >
                    <Star className="h-5 w-5 text-green-700" />
                  </Button>
                </div>

                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
                    <Input
                      placeholder="Search guides and tutorials..."
                      className="pl-10 pr-4 py-2 border-green-200 focus:border-green-400 focus:ring-green-300 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="hidden md:flex lg:hidden items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-green-100/50 transition-all duration-300"
                >
                  <Home className="h-4 w-4 text-green-700" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-green-100/50 transition-all duration-300"
                >
                  <BookOpen className="h-4 w-4 text-green-700" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-green-100/50 transition-all duration-300"
                >
                  <Star className="h-4 w-4 text-green-700" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                  className="hover:bg-green-100/50 transition-all duration-300"
                >
                  <Search className="h-4 w-4 text-green-700" />
                </Button>
              </div>
              <div className="md:hidden flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-green-100/50 transition-all duration-300 h-8 w-8"
                >
                  <Home className="h-3 w-3 text-green-700" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-green-100/50 transition-all duration-300 h-8 w-8"
                >
                  <BookOpen className="h-3 w-3 text-green-700" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-green-100/50 transition-all duration-300 h-8 w-8"
                >
                  <Star className="h-3 w-3 text-green-700" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                  className="hover:bg-green-100/50 transition-all duration-300 h-8 w-8"
                >
                  <Search className="h-3 w-3 text-green-700" />
                </Button>
              </div>

              <div className="flex items-center gap-1 sm:gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-green-100/50 h-8 w-8 sm:h-10 sm:w-10"
                    >
                      <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-green-700" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/90 backdrop-blur-lg border-green-200">
                    {guideCategories.map((category) => (
                      <DropdownMenuItem key={category} className="hover:bg-green-50">
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="ring-2 ring-green-200 hover:ring-green-400 transition-all duration-300 h-7 w-7 sm:h-8 sm:w-8 cursor-pointer">
                      <AvatarImage src="/api/placeholder/32/32" alt="User" />
                      <AvatarFallback className="bg-linear-to-br from-green-400 to-emerald-500 text-white text-xs sm:text-sm">
                        G
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/90 backdrop-blur-lg border-green-200 w-48">
                    <DropdownMenuItem className="hover:bg-green-50 cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-green-50 cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="hover:bg-green-50 cursor-pointer text-red-600" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {mobileSearchOpen && (
              <div className="lg:hidden px-2 sm:px-4 pb-2 sm:pb-3 border-t border-green-200/30">
                <div className="relative mt-2 sm:mt-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
                  <Input
                    placeholder="Search guides and tutorials..."
                    className="pl-10 pr-4 py-2 border-green-200 focus:border-green-400 focus:ring-green-300 bg-white/80 backdrop-blur-sm w-full text-sm sm:text-base"
                    autoFocus
                  />
                </div>
              </div>
            )}
          </header>

          <main className="w-full">
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}