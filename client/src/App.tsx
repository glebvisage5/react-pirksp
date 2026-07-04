import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { ThemeProvider } from "./lib/theme-context";
import {
  LanguageProvider,
  useLanguage,
} from "./lib/language-context";
import { UserProvider, useUser } from "./lib/user-context";
import { CompanyHome } from "./components/company/CompanyHome";
import { DashboardHome } from "./components/dashboard/DashboardHome";
import { TaskProgress } from "./components/dashboard/TaskProgress";
import { Group } from "./components/dashboard/Group";
import { Team } from "./components/dashboard/Team";
import { Files } from "./components/dashboard/Files";
import { Profile } from "./components/dashboard/Profile";
import { Settings } from "./components/dashboard/Settings";
import { Courses } from "./components/dashboard/Courses";
import { NotificationsDropdown } from "./components/dashboard/Notifications";
import AdminCenter from "./components/admin/AdminCenter";
import { GtaRoleplay } from "./components/gta-roleplay/GtaRoleplay";
import { GtaDashboard } from "./components/gta-roleplay/GtaDashboard";
import { GtaServers } from "./components/gta-roleplay/GtaServers";
import { GtaServerDetail } from "./components/gta-roleplay/GtaServerDetail";
import { GtaOrgDetail } from "./components/gta-roleplay/GtaOrgDetail";
import { AdminModeDashboard } from "./components/educrm-admin/AdminModeDashboard";
import { AdminModeGroups } from "./components/educrm-admin/AdminModeGroups";
import { AdminModeStudents } from "./components/educrm-admin/AdminModeStudents";
import { AdminModeElders } from "./components/educrm-admin/AdminModeElders";
import { AdminModeCourses } from "./components/educrm-admin/AdminModeCourses";
import { AdminModeRoadmaps } from "./components/educrm-admin/AdminModeRoadmaps";
import { AdminModeTasks } from "./components/educrm-admin/AdminModeTasks";
import { AdminModeAchievements } from "./components/educrm-admin/AdminModeAchievements";
import { AdminModeFiles } from "./components/educrm-admin/AdminModeFiles";
import { AdminModeRoles } from "./components/educrm-admin/AdminModeRoles";
import { AdminModeSettings } from "./components/educrm-admin/AdminModeSettings";
import { TeamHub } from "./components/teamhub/TeamHub";
import { Button } from "./components/ui/button";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import {
  GraduationCap,
  LayoutDashboard,
  CheckCircle,
  Users,
  UsersRound,
  FolderOpen,
  User,
  Settings as SettingsIcon,
  Menu,
  X,
  LogOut,
  BookOpen,
  ArrowLeft,
  Shield,
  UserCog,
  UserCheck,
  MapPin,
  Award,
  File,
} from "lucide-react";
import { Toaster } from "./components/ui/sonner";

// ─── Nav item types ────────────────────────────────────────────

interface NavItem {
  path: string;
  labelEn: string;
  labelRu: string;
  icon: React.ReactNode;
}

const userNavItems: NavItem[] = [
  { path: "home", labelEn: "Dashboard", labelRu: "Дашборд", icon: <LayoutDashboard className="h-5 w-5" /> },
  { path: "tasks", labelEn: "Tasks", labelRu: "Задачи", icon: <CheckCircle className="h-5 w-5" /> },
  { path: "courses", labelEn: "Courses", labelRu: "Курсы", icon: <BookOpen className="h-5 w-5" /> },
  { path: "group", labelEn: "Group", labelRu: "Группа", icon: <Users className="h-5 w-5" /> },
  { path: "team", labelEn: "Team", labelRu: "Команда", icon: <UsersRound className="h-5 w-5" /> },
  { path: "files", labelEn: "Files", labelRu: "Файлы", icon: <FolderOpen className="h-5 w-5" /> },
  { path: "profile", labelEn: "Profile", labelRu: "Профиль", icon: <User className="h-5 w-5" /> },
  { path: "settings", labelEn: "Settings", labelRu: "Настройки", icon: <SettingsIcon className="h-5 w-5" /> },
];

const adminNavItems: NavItem[] = [
  { path: "admin/dashboard", labelEn: "Dashboard EduCRM", labelRu: "Dashboard EduCRM", icon: <LayoutDashboard className="h-5 w-5" /> },
  { path: "admin/groups", labelEn: "Groups", labelRu: "Группы", icon: <Users className="h-5 w-5" /> },
  { path: "admin/students", labelEn: "Students", labelRu: "Студенты", icon: <GraduationCap className="h-5 w-5" /> },
  { path: "admin/elders", labelEn: "Elders", labelRu: "Старосты", icon: <UserCheck className="h-5 w-5" /> },
  { path: "admin/courses", labelEn: "Courses", labelRu: "Курсы", icon: <BookOpen className="h-5 w-5" /> },
  { path: "admin/roadmaps", labelEn: "Roadmaps", labelRu: "Дорожные карты", icon: <MapPin className="h-5 w-5" /> },
  { path: "admin/tasks", labelEn: "Tasks", labelRu: "Задачи", icon: <CheckCircle className="h-5 w-5" /> },
  { path: "admin/achievements", labelEn: "Achievements", labelRu: "Достижения", icon: <Award className="h-5 w-5" /> },
  { path: "admin/files", labelEn: "Files", labelRu: "Файлы", icon: <File className="h-5 w-5" /> },
  { path: "admin/roles", labelEn: "Roles EduCRM", labelRu: "Роли EduCRM", icon: <Shield className="h-5 w-5" /> },
  { path: "admin/settings", labelEn: "Settings EduCRM", labelRu: "Настройки EduCRM", icon: <SettingsIcon className="h-5 w-5" /> },
];

// ─── Auth guard ────────────────────────────────────────────────

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  if (isLoading) return null;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function RequireOwner({ children }: { children: React.ReactNode }) {
  const { user, isOwner, isLoading } = useUser();
  if (isLoading) return null;
  if (!user || !isOwner) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// ─── Page wrappers ─────────────────────────────────────────────

function CompanyPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <CompanyHome
      onLogin={() => {}}
      onServiceSelect={(id) => {
        if (id === "educrm") navigate("/educrm");
        else if (id === "teamhub") navigate("/teamhub");
        else if (id === "admin-center") navigate("/admin-center");
        else if (id === "gta-rp") navigate("/gta-rp");
      }}
      isAuthenticated={!!user}
    />
  );
}

function TeamHubPage() {
  const navigate = useNavigate();
  const { logout } = useUser();

  return (
    <TeamHub
      onBackToServices={() => navigate("/")}
      onLogout={async () => { await logout(); navigate("/"); }}
    />
  );
}

function AdminCenterPage() {
  const navigate = useNavigate();
  const { logout } = useUser();

  return (
    <AdminCenter
      onBackToServices={() => navigate("/")}
      onLogout={async () => { await logout(); navigate("/"); }}
    />
  );
}

function DashboardHomePage() {
  const navigate = useNavigate();
  return <DashboardHome onTaskClick={() => navigate("/educrm/tasks")} />;
}

// ─── EduCRM Layout ─────────────────────────────────────────────

function EduCrmLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { isAdmin, userMode, setUserMode, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdminMode = location.pathname.startsWith("/educrm/admin");

  useEffect(() => {
    if (isAdminMode && userMode !== "admin") setUserMode("admin");
    if (!isAdminMode && userMode === "admin") setUserMode("user");
  }, [isAdminMode]);

  const t = {
    studentDashboard: language === "en" ? "Student Dashboard" : "Панель студента",
    adminDashboard: language === "en" ? "Admin Dashboard" : "Админ панель",
    logout: language === "en" ? "Logout" : "Выйти",
    backToServices: language === "en" ? "All Services" : "Все сервисы",
    mode: language === "en" ? "Mode" : "Режим",
    user: language === "en" ? "User" : "Пользователь",
    admin: language === "en" ? "Admin" : "Администратор",
    userMode: language === "en" ? "User Mode" : "Режим пользователя",
    adminMode: language === "en" ? "Admin Mode" : "Режим администратора",
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleModeToggle = (checked: boolean): void => {
    if (checked) {
      navigate("/educrm/admin/dashboard");
    } else {
      navigate("/educrm/home");
    }
  };

  const navItems = isAdminMode ? adminNavItems : userNavItems;

  const isActive = (itemPath: string) =>
    location.pathname === `/educrm/${itemPath}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 flex items-center justify-center shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-green-600 dark:from-purple-400 dark:via-indigo-400 dark:to-green-400 bg-clip-text text-transparent">
                EduCRM
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {isAdminMode ? t.adminDashboard : t.studentDashboard}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-muted/50">
                <UserCog className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{t.mode}:</span>
                <Switch
                  checked={isAdminMode}
                  onCheckedChange={handleModeToggle}
                  className="data-[state=checked]:bg-red-600"
                />
                <span className="text-xs font-medium">
                  {isAdminMode ? t.admin : t.user}
                </span>
              </div>
            )}
            <NotificationsDropdown />
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
            bg-background border-r transition-transform md:translate-x-0
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <nav className="space-y-2 p-4">
            {isAdmin && (
              <div className="md:hidden mb-4 p-3 rounded-lg border bg-muted/50 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="admin-mode-mobile" className="text-sm flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    {t.mode}
                  </Label>
                  <Switch
                    id="admin-mode-mobile"
                    checked={isAdminMode}
                    onCheckedChange={handleModeToggle}
                    className="data-[state=checked]:bg-red-600"
                  />
                </div>
                <div className="text-xs text-center font-medium">
                  {isAdminMode ? t.adminMode : t.userMode}
                </div>
              </div>
            )}

            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`w-full justify-start ${isActive(item.path) ? "bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 text-white" : ""}`}
                onClick={() => {
                  navigate(`/educrm/${item.path}`);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.icon}
                <span className="ml-3">
                  {language === "en" ? item.labelEn : item.labelRu}
                </span>
              </Button>
            ))}

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
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// ─── Routes ────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CompanyPage />} />

      <Route path="/educrm" element={<RequireAuth><EduCrmLayout /></RequireAuth>}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<DashboardHomePage />} />
        <Route path="tasks" element={<TaskProgress />} />
        <Route path="courses" element={<Courses />} />
        <Route path="group" element={<Group />} />
        <Route path="team" element={<Team />} />
        <Route path="files" element={<Files />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admin" element={<Navigate to="dashboard" replace />} />
        <Route path="admin/dashboard" element={<AdminModeDashboard />} />
        <Route path="admin/groups" element={<AdminModeGroups />} />
        <Route path="admin/students" element={<AdminModeStudents />} />
        <Route path="admin/elders" element={<AdminModeElders />} />
        <Route path="admin/courses" element={<AdminModeCourses />} />
        <Route path="admin/roadmaps" element={<AdminModeRoadmaps />} />
        <Route path="admin/tasks" element={<AdminModeTasks />} />
        <Route path="admin/achievements" element={<AdminModeAchievements />} />
        <Route path="admin/files" element={<AdminModeFiles />} />
        <Route path="admin/roles" element={<AdminModeRoles />} />
        <Route path="admin/settings" element={<AdminModeSettings />} />
      </Route>

      <Route path="/gta-rp" element={<RequireOwner><GtaRoleplay /></RequireOwner>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<GtaDashboard />} />
        <Route path="servers" element={<GtaServers />} />
        <Route path="servers/:serverId" element={<GtaServerDetail />} />
        <Route path="servers/:serverId/orgs/:orgId" element={<GtaOrgDetail />} />
      </Route>

      <Route path="/teamhub" element={<RequireAuth><TeamHubPage /></RequireAuth>} />
      <Route path="/admin-center" element={<RequireAuth><AdminCenterPage /></RequireAuth>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <UserProvider>
            <AppRoutes />
            <Toaster />
          </UserProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
