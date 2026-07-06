import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { useLanguage } from "../../lib/language-context";
import { useUser } from "../../lib/user-context";
import { GtaViewModeProvider, useGtaViewMode } from "./GtaViewModeContext";
import { GtaEventsBell } from "./GtaEventsBell";
import {
  Gamepad2,
  LayoutDashboard,
  Server,
  Menu,
  X,
  LogOut,
  ArrowLeft,
  UserCog,
} from "lucide-react";

interface NavItem {
  path: string;
  labelEn: string;
  labelRu: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: "dashboard", labelEn: "Dashboard", labelRu: "Дашборд", icon: <LayoutDashboard className="h-5 w-5" /> },
  { path: "servers", labelEn: "Servers", labelRu: "Серверы", icon: <Server className="h-5 w-5" /> },
];

export function GtaRoleplay() {
  return (
    <GtaViewModeProvider>
      <GtaRoleplayLayout />
    </GtaViewModeProvider>
  );
}

function GtaRoleplayLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { logout } = useUser();
  const { viewMode, setViewMode } = useGtaViewMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const t = {
    title: "GTA RolePlay",
    subtitle: language === "en" ? "Server Management" : "Управление серверами",
    logout: language === "en" ? "Logout" : "Выйти",
    backToServices: language === "en" ? "All Services" : "Все сервисы",
    player: language === "en" ? "Player" : "Игрок",
    owner: language === "en" ? "Owner" : "Владелец",
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (itemPath: string) =>
    location.pathname === `/gta-rp/${itemPath}` ||
    (itemPath === "servers" && location.pathname.startsWith("/gta-rp/servers"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className={`
        sticky top-0 z-50 w-full border-b
        bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
        transition-all duration-700
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
      `}>
        <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(to right, #e0015b, #f43f5e, #f472b6)' }}>
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl bg-clip-text text-transparent font-bold" style={{ backgroundImage: 'linear-gradient(to right, #e0015b, #f43f5e, #f472b6)' }}>
                {t.title}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {t.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {viewMode === "owner" && <GtaEventsBell />}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-muted/50">
              <UserCog className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{t.player}</span>
              <Switch
                checked={viewMode === "owner"}
                onCheckedChange={(checked: boolean) => setViewMode(checked ? "owner" : "player")}
                className="data-[state=checked]:bg-[#e0015b]"
              />
              <span className="text-xs font-medium">{t.owner}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="hidden md:flex gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.backToServices}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex w-full">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)]
            bg-background border-r
            transition-all duration-500 md:translate-x-0
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            ${mounted ? "md:opacity-100" : "md:opacity-0 md:-translate-x-4"}
          `}
          style={{ transitionDelay: mounted ? "200ms" : "0ms" }}
        >
          <nav className="space-y-2 p-4">
            <div className="md:hidden mb-4 p-3 rounded-lg border bg-muted/50 flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                {viewMode === "owner" ? t.owner : t.player}
              </span>
              <Switch
                checked={viewMode === "owner"}
                onCheckedChange={(checked: boolean) => setViewMode(checked ? "owner" : "player")}
                className="data-[state=checked]:bg-[#e0015b]"
              />
            </div>
            {navItems.map((item, i) => {
              const active = isActive(item.path);
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={`
                    w-full justify-start transition-all duration-500
                    ${active ? "text-white hover:text-white" : ""}
                    ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}
                  `}
                  style={{
                    ...(active ? { background: 'linear-gradient(to right, #e0015b, #f43f5e, #f472b6)' } : {}),
                    transitionDelay: `${300 + i * 100}ms`,
                  }}
                  onClick={() => {
                    navigate(`/gta-rp/${item.path}`);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className={active ? "" : "text-[#e0015b]"}>{item.icon}</span>
                  <span className={`ml-3 ${active ? "" : "bg-clip-text text-transparent"}`}
                    style={!active ? { backgroundImage: 'linear-gradient(to right, #e0015b, #f43f5e, #f472b6)' } : undefined}>
                    {language === "en" ? item.labelEn : item.labelRu}
                  </span>
                </Button>
              );
            })}

            <div className="pt-4 border-t mt-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start md:hidden"
                onClick={() => {
                  navigate("/");
                  setIsMobileMenuOpen(false);
                }}
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="ml-3">{t.backToServices}</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">{t.logout}</span>
              </Button>
            </div>
          </nav>
        </aside>

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/70 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <main className={`
          flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8
          transition-all duration-700
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
          style={{ transitionDelay: "400ms" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
