import { useState } from "react";
import { ThemeProvider } from "./lib/theme-context";
import {
  LanguageProvider,
  useLanguage,
} from "./lib/language-context";
import { UserProvider, useUser } from "./lib/user-context";
import { CompanyHome } from "./components/company/CompanyHome";
import { LandingPage } from "./components/LandingPage";
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
  Home,
  Shield,
  UserCog,
  Database,
  UserCheck,
  MapPin,
  Award,
  File,
  Target,
} from "lucide-react";
import { Toaster } from "./components/ui/sonner";

type AppView =
  | "company"
  | "landing"
  | "dashboard"
  | "admin-center"
  | "teamhub";
type DashboardView =
  | "home"
  | "tasks"
  | "courses"
  | "group"
  | "team"
  | "files"
  | "profile"
  | "settings";
type AdminModeView =
  | "dashboard"
  | "groups"
  | "students"
  | "elders"
  | "courses"
  | "roadmaps"
  | "tasks"
  | "achievements"
  | "files"
  | "roles"
  | "settings";

interface NavItem {
  id: DashboardView;
  labelEn: string;
  labelRu: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

interface AdminNavItem {
  id: AdminModeView;
  labelEn: string;
  labelRu: string;
  icon: React.ReactNode;
}

const baseNavItems: NavItem[] = [
  {
    id: "home",
    labelEn: "Dashboard",
    labelRu: "Дашборд",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    id: "tasks",
    labelEn: "Tasks",
    labelRu: "Задачи",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    id: "courses",
    labelEn: "Courses",
    labelRu: "Курсы",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: "group",
    labelEn: "Group",
    labelRu: "Группа",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "team",
    labelEn: "Team",
    labelRu: "Команда",
    icon: <UsersRound className="h-5 w-5" />,
  },
  {
    id: "files",
    labelEn: "Files",
    labelRu: "Файлы",
    icon: <FolderOpen className="h-5 w-5" />,
  },
  {
    id: "profile",
    labelEn: "Profile",
    labelRu: "Профиль",
    icon: <User className="h-5 w-5" />,
  },
  {
    id: "settings",
    labelEn: "Settings",
    labelRu: "Настройки",
    icon: <SettingsIcon className="h-5 w-5" />,
  },
];

const adminNavItems: AdminNavItem[] = [
  {
    id: "dashboard",
    labelEn: "Dashboard EduCRM",
    labelRu: "Dashboard EduCRM",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    id: "groups",
    labelEn: "Groups",
    labelRu: "Группы",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "students",
    labelEn: "Students",
    labelRu: "Студенты",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    id: "elders",
    labelEn: "Elders",
    labelRu: "Старосты",
    icon: <UserCheck className="h-5 w-5" />,
  },
  {
    id: "courses",
    labelEn: "Courses",
    labelRu: "Курсы",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: "roadmaps",
    labelEn: "Roadmaps",
    labelRu: "Дорожные карты",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    id: "tasks",
    labelEn: "Tasks",
    labelRu: "Задачи",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    id: "achievements",
    labelEn: "Achievements",
    labelRu: "Достижения",
    icon: <Award className="h-5 w-5" />,
  },
  {
    id: "files",
    labelEn: "Files",
    labelRu: "Файлы",
    icon: <File className="h-5 w-5" />,
  },
  {
    id: "roles",
    labelEn: "Roles EduCRM",
    labelRu: "Роли EduCRM",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    id: "settings",
    labelEn: "Settings EduCRM",
    labelRu: "Настройки EduCRM",
    icon: <SettingsIcon className="h-5 w-5" />,
  },
];

function AppContent() {
  const [appView, setAppView] = useState<AppView>("company");
  const [dashboardView, setDashboardView] =
    useState<DashboardView>("home");
  const [adminModeView, setAdminModeView] =
    useState<AdminModeView>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<
    string | null
  >(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { language } = useLanguage();
  const { isAdmin, userMode, setUserMode, setUser } = useUser();

  const t = {
    studentDashboard:
      language === "en"
        ? "Student Dashboard"
        : "Панель студента",
    adminDashboard:
      language === "en" ? "Admin Dashboard" : "Админ панель",
    logout: language === "en" ? "Logout" : "Выйти",
    backToEduCRM:
      language === "en" ? "EduCRM Home" : "EduCRM Главная",
    backToServices:
      language === "en" ? "All Services" : "Все сервисы",
    userMode:
      language === "en" ? "User Mode" : "Режим пользователя",
    adminMode:
      language === "en" ? "Admin Mode" : "Режим администратора",
    mode: language === "en" ? "Mode" : "Режим",
    user: language === "en" ? "User" : "Пользователь",
    admin: language === "en" ? "Admin" : "Администратор",
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleServiceSelect = (serviceId: string) => {
    if (serviceId === "educrm") {
      setAppView("landing");
    } else if (serviceId === "admin-center") {
      setAppView("admin-center");
    } else if (serviceId === "teamhub") {
      setAppView("teamhub");
    }
    // Add other services navigation here when they are implemented
  };

  const handleGetStartedFromLanding = () => {
    setAppView("dashboard");
    setDashboardView("home");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAppView("company");
    setDashboardView("home");
    setUser(null);
    setUserMode("user");
  };

  const handleBackToCompany = () => {
    setAppView("company");
  };

  const handleBackToLanding = () => {
    setAppView("landing");
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setDashboardView("tasks");
  };

  const renderDashboardContent = () => {
    // If admin mode is active, show admin mode views
    if (userMode === "admin") {
      switch (adminModeView) {
        case "dashboard":
          return <AdminModeDashboard />;
        case "groups":
          return <AdminModeGroups />;
        case "students":
          return <AdminModeStudents />;
        case "elders":
          return <AdminModeElders />;
        case "courses":
          return <AdminModeCourses />;
        case "roadmaps":
          return <AdminModeRoadmaps />;
        case "tasks":
          return <AdminModeTasks />;
        case "achievements":
          return <AdminModeAchievements />;
        case "files":
          return <AdminModeFiles />;
        case "roles":
          return <AdminModeRoles />;
        case "settings":
          return <AdminModeSettings />;
        default:
          return <AdminModeDashboard />;
      }
    }

    // Regular user views
    switch (dashboardView) {
      case "home":
        return <DashboardHome onTaskClick={handleTaskClick} />;
      case "tasks":
        return <TaskProgress />;
      case "courses":
        return <Courses />;
      case "group":
        return <Group />;
      case "team":
        return <Team />;
      case "files":
        return <Files />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      default:
        return <DashboardHome onTaskClick={handleTaskClick} />;
    }
  };

  // Company Home Page - теперь с авторизацией
  if (appView === "company") {
    return (
      <CompanyHome
        onLogin={handleLogin}
        onServiceSelect={handleServiceSelect}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  // Landing Page EduCRM
  if (appView === "landing") {
    return (
      <LandingPage
        onGetStarted={handleGetStartedFromLanding}
        onLogin={handleGetStartedFromLanding}
        onBackToServices={handleBackToCompany}
      />
    );
  }

  // Admin Center
  if (appView === "admin-center") {
    return (
      <AdminCenter
        onBackToServices={handleBackToCompany}
        onLogout={handleLogout}
      />
    );
  }

  // TeamHub
  if (appView === "teamhub") {
    return (
      <TeamHub
        onBackToServices={handleBackToCompany}
        onLogout={handleLogout}
      />
    );
  }

  // Dashboard
  if (appView === "dashboard") {
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
                  {userMode === "admin"
                    ? t.adminDashboard
                    : t.studentDashboard}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Admin Mode Toggle */}
              {isAdmin && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-muted/50">
                  <UserCog className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {t.mode}:
                  </span>
                  <Switch
                    checked={userMode === "admin"}
                    onCheckedChange={(checked) =>
                      setUserMode(checked ? "admin" : "user")
                    }
                    className="data-[state=checked]:bg-red-600"
                  />
                  <span className="text-xs font-medium">
                    {userMode === "admin" ? t.admin : t.user}
                  </span>
                </div>
              )}

              {/* Notifications */}
              <NotificationsDropdown />

              {/* Back to EduCRM Home */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToLanding}
                className="hidden lg:flex gap-2"
              >
                <Home className="h-4 w-4" />
                {t.backToEduCRM}
              </Button>

              {/* Back to All Services */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToCompany}
                className="hidden md:flex gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.backToServices}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() =>
                  setIsMobileMenuOpen(!isMobileMenuOpen)
                }
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </header>

        <div className="flex w-full">
          {/* Sidebar Navigation */}
          <aside
            className={`
              fixed md:sticky top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] 
              bg-background border-r transition-transform md:translate-x-0
              ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <nav className="space-y-2 p-4">
              {/* Admin Mode Toggle - Mobile */}
              {isAdmin && (
                <div className="md:hidden mb-4 p-3 rounded-lg border bg-muted/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="admin-mode-mobile"
                      className="text-sm flex items-center gap-2"
                    >
                      <UserCog className="h-4 w-4" />
                      {t.mode}
                    </Label>
                    <Switch
                      id="admin-mode-mobile"
                      checked={userMode === "admin"}
                      onCheckedChange={(checked) =>
                        setUserMode(checked ? "admin" : "user")
                      }
                      className="data-[state=checked]:bg-red-600"
                    />
                  </div>
                  <div className="text-xs text-center font-medium">
                    {userMode === "admin"
                      ? t.adminMode
                      : t.userMode}
                  </div>
                </div>
              )}

              {/* Navigation Items - Show different menus based on user mode */}
              {userMode === "admin"
                ? // Admin Mode Navigation
                  adminNavItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={
                        adminModeView === item.id
                          ? "default"
                          : "ghost"
                      }
                      className={`w-full justify-start ${adminModeView === item.id ? "bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 text-white" : ""}`}
                      onClick={() => {
                        setAdminModeView(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {item.icon}
                      <span className="ml-3">
                        {language === "en"
                          ? item.labelEn
                          : item.labelRu}
                      </span>
                    </Button>
                  ))
                : // Regular User Navigation
                  baseNavItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={
                        dashboardView === item.id
                          ? "default"
                          : "ghost"
                      }
                      className="w-full justify-start"
                      onClick={() => {
                        setDashboardView(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {item.icon}
                      <span className="ml-3">
                        {language === "en"
                          ? item.labelEn
                          : item.labelRu}
                      </span>
                    </Button>
                  ))}

              <div className="pt-4 border-t mt-4 space-y-2">
                {/* Back to EduCRM Home - visible on mobile */}
                <Button
                  variant="ghost"
                  className="w-full justify-start lg:hidden"
                  onClick={() => {
                    handleBackToLanding();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Home className="h-5 w-5" />
                  <span className="ml-3">{t.backToEduCRM}</span>
                </Button>
                {/* Back to All Services - visible on mobile */}
                <Button
                  variant="ghost"
                  className="w-full justify-start md:hidden"
                  onClick={() => {
                    handleBackToCompany();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="ml-3">
                    {t.backToServices}
                  </span>
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

          {/* Mobile Overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8">
            {renderDashboardContent()}
          </main>
        </div>
      </div>
    );
  }

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <AppContent />
          <Toaster />
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}