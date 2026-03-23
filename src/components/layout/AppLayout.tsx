import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { store, type RootState } from "@/store";
import { axiosClient, startAutoRefreshEvery12Minutes } from "@/api/axiosClient";
import { fetchSession, logout } from "@/store/authSlice";
import { BookOpen, ChevronDown, LogOut, Menu } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

store.dispatch(fetchSession());
startAutoRefreshEvery12Minutes();

export const AppLayout = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      dispatch(logout());
      navigate("/auth/login");
    }
  };

  const desktopNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-primary hover:bg-accent",
    ].join(" ");

  const displayName =
    (user as { name?: string } | null)?.name ??
    (user as { email?: string } | null)?.email ??
    "User";

  const userInitials = displayName
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const goTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center">
            {/* Mobile menu button - left */}
            <div className="flex items-center md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-border bg-background p-2 text-foreground transition hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  sideOffset={10}
                  className="w-56 border-border bg-popover text-popover-foreground shadow-xl"
                >
                  <DropdownMenuLabel className="px-4 py-2 text-sm font-normal text-muted-foreground">
                    Navigation
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-border" />

                  <DropdownMenuItem
                    className="cursor-pointer px-4 py-2 text-sm focus:bg-accent focus:text-accent-foreground"
                    onClick={() => goTo("/")}
                  >
                    Books
                  </DropdownMenuItem>

                  {user?.role === "ADMIN" && (
                    <>
                      <DropdownMenuItem
                        className="cursor-pointer px-4 py-2 text-sm focus:bg-accent focus:text-accent-foreground"
                        onClick={() => goTo("/admin")}
                      >
                        Admin Dashboard
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer px-4 py-2 text-sm focus:bg-accent focus:text-accent-foreground"
                        onClick={() => goTo("/admin/logs")}
                      >
                        Logs
                      </DropdownMenuItem>
                    </>
                  )}

                  {user && (
                    <DropdownMenuItem
                      className="cursor-pointer px-4 py-2 text-sm focus:bg-accent focus:text-accent-foreground"
                      onClick={() => goTo("/loans")}
                    >
                      My Loans
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop left block */}
            <div className="hidden md:flex items-center gap-10">
              <div className="flex shrink-0 items-center gap-2 font-bold text-xl text-primary">
                <BookOpen className="h-6 w-6" />
                <span>LibraryFlow</span>
              </div>

              <div className="flex space-x-2">
                <NavLink to="/" className={desktopNavLinkClass}>
                  Books
                </NavLink>

                {user?.role === "ADMIN" && (
                  <>
                    <NavLink to="/admin" className={desktopNavLinkClass}>
                      Admin Dashboard
                    </NavLink>
                    <NavLink to="/admin/logs" className={desktopNavLinkClass}>
                      Logs
                    </NavLink>
                  </>
                )}

                {user && (
                  <NavLink to="/loans" className={desktopNavLinkClass}>
                    My Loans
                  </NavLink>
                )}
              </div>
            </div>

            {/* Center logo on mobile */}
            <div className="absolute left-1/2 flex -translate-x-1/2 items-center md:hidden">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>

            {/* Right side */}
            <div className="ml-auto flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full outline-none transition focus:ring-2 focus:ring-ring"
                    aria-label="Open user menu"
                  >
                    <Avatar className="h-9 w-9 ring-1 ring-border shadow-sm">
                      <AvatarImage src="" alt={displayName} />
                      <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="w-56 border-border bg-popover text-popover-foreground shadow-xl"
                >
                  <DropdownMenuLabel className="px-4 py-2 text-sm font-normal text-muted-foreground">
                    {displayName}
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-border" />

                  <DropdownMenuItem
                    className="cursor-pointer px-4 py-2 text-sm focus:bg-accent focus:text-accent-foreground"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4 text-destructive" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2 font-bold text-lg text-primary/80">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              © {new Date().getFullYear()} LibraryFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
