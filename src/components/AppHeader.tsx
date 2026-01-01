import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/AuthContext";
import { Bell, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

type AppHeaderProps = {
  title: string;
  className?: string;
  notificationsCount?: number;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
};

export function AppHeader({
  title,
  className,
  notificationsCount = 0,
  onNotificationsClick,
  onSettingsClick,
}: AppHeaderProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const showBadge = notificationsCount > 0;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className={cn("flex items-center justify-between", className)}>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            onClick={onNotificationsClick}
          >
            <Bell />
          </Button>
          {showBadge ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground">
              {notificationsCount > 99 ? "99+" : notificationsCount}
            </span>
          ) : null}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Settings"
          onClick={onSettingsClick}
        >
          <Settings />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Log out"
          onClick={handleLogout}
        >
          <LogOut />
        </Button>
      </div>
    </header>
  );
}
