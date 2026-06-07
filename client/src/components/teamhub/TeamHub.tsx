import { useState } from "react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useLanguage } from "../../lib/language-context";
import { useUser } from "../../lib/user-context";
import { 
  Users, 
  LayoutDashboard, 
  Menu, 
  X, 
  LogOut, 
  ArrowLeft,
  UserCog,
  Settings as SettingsIcon,
  Clock,
  User as UserIcon,
  FolderKanban,
  FileText,
  CheckSquare,
  UserPlus,
  FolderOpen,
  MessageSquare,
  Shield
} from "lucide-react";
import { TeamHubDashboard } from "./TeamHubDashboard";
import { Teams } from "./Teams";
import { Deadlines } from "./Deadlines";
import { TeamHubProfile } from "./Profile";
import { TeamHubSettings } from "./Settings";
import { NotificationsDropdown } from "../dashboard/Notifications";
import {
  AdminModeDashboardTeamHub,
  AdminModeTeamsTeamHub,
  AdminModeMembersTeamHub,
  AdminModeRolesTeamHub,
  AdminModeProjectsTeamHub,
  AdminModeTasksTeamHub,
  AdminModeSpecsTeamHub,
  AdminModeFilesTeamHub,
  AdminModeSettingsTeamHub
} from "../teamhub-admin";
import { TeamOverview } from "./team-views/TeamOverview";
import { TeamProjects } from "./team-views/TeamProjects";
import { TeamSpecs } from "./team-views/TeamSpecs";
import { TeamTasks } from "./team-views/TeamTasks";
import { TeamMembers } from "./team-views/TeamMembers";
import { TeamFiles } from "./team-views/TeamFiles";
import { TeamChat } from "./team-views/TeamChat";
import { TeamRoles } from "./team-views/TeamRoles";
import { TeamSettings } from "./team-views/TeamSettings";
import { type Team } from "../../api/teams";

type MainView = "dashboard" | "teams" | "deadlines" | "profile" | "settings";
type TeamView = "overview" | "projects" | "specs" | "tasks" | "members" | "files" | "chat" | "roles" | "team-settings";
type AdminTeamHubView = "admin-dashboard" | "admin-teams" | "admin-members" | "admin-roles" | "admin-projects" | "admin-tasks" | "admin-specs" | "admin-files" | "admin-settings";

interface NavItem {
  id: MainView;
  labelEn: string;
  labelRu: string;
  icon: React.ReactNode;
}

interface TeamNavItem {
  id: TeamView;
  labelEn: string;
  labelRu: string;
  icon: React.ReactNode;
  showForAll: boolean;
  roles?: string[];
}

interface AdminNavItem {
  id: AdminTeamHubView;
  labelEn: string;
  labelRu: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  { id: "dashboard", labelEn: "Dashboard", labelRu: "Панель управления", icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: "teams", labelEn: "Teams", labelRu: "Команды", icon: <Users className="h-5 w-5" /> },
  { id: "deadlines", labelEn: "Deadlines", labelRu: "Дедлайны", icon: <Clock className="h-5 w-5" /> },
  { id: "profile", labelEn: "Profile", labelRu: "Профиль", icon: <UserIcon className="h-5 w-5" /> },
  { id: "settings", labelEn: "Settings", labelRu: "Настройки", icon: <SettingsIcon className="h-5 w-5" /> },
];

const teamNavItems: TeamNavItem[] = [
  { id: "overview", labelEn: "Overview", labelRu: "Обзор", icon: <LayoutDashboard className="h-4 w-4" />, showForAll: true },
  { id: "projects", labelEn: "Projects", labelRu: "Проекты", icon: <FolderKanban className="h-4 w-4" />, showForAll: true },
  { id: "specs", labelEn: "Specifications", labelRu: "Технические задания", icon: <FileText className="h-4 w-4" />, showForAll: true },
  { id: "tasks", labelEn: "Tasks", labelRu: "Задачи", icon: <CheckSquare className="h-4 w-4" />, showForAll: true },
  { id: "members", labelEn: "Members", labelRu: "Участники", icon: <UserPlus className="h-4 w-4" />, showForAll: true },
  { id: "files", labelEn: "Files", labelRu: "Файлы", icon: <FolderOpen className="h-4 w-4" />, showForAll: true },
  { id: "chat", labelEn: "Chat", labelRu: "Чат", icon: <MessageSquare className="h-4 w-4" />, showForAll: true },
  { id: "roles", labelEn: "Roles", labelRu: "Роли команды", icon: <Shield className="h-4 w-4" />, showForAll: false, roles: ["Team Leader", "Moderator"] },
  { id: "team-settings", labelEn: "Team Settings", labelRu: "Настройки команды", icon: <SettingsIcon className="h-4 w-4" />, showForAll: false, roles: ["Team Leader", "Moderator"] },
];

const adminNavItems: AdminNavItem[] = [
  { id: "admin-dashboard", labelEn: "Dashboard TeamHub", labelRu: "Dashboard TeamHub", icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: "admin-teams", labelEn: "Teams", labelRu: "Команды", icon: <Users className="h-5 w-5" /> },
  { id: "admin-members", labelEn: "Members", labelRu: "Участники", icon: <UserPlus className="h-5 w-5" /> },
  { id: "admin-roles", labelEn: "Roles TeamHub", labelRu: "Роли TeamHub", icon: <Shield className="h-5 w-5" /> },
  { id: "admin-projects", labelEn: "Projects", labelRu: "Проекты", icon: <FolderKanban className="h-5 w-5" /> },
  { id: "admin-tasks", labelEn: "Tasks", labelRu: "Задачи", icon: <CheckSquare className="h-5 w-5" /> },
  { id: "admin-specs", labelEn: "Specifications", labelRu: "Технические задания", icon: <FileText className="h-5 w-5" /> },
  { id: "admin-files", labelEn: "Files", labelRu: "Файлы", icon: <FolderOpen className="h-5 w-5" /> },
  { id: "admin-settings", labelEn: "Settings TeamHub", labelRu: "Настройки TeamHub", icon: <SettingsIcon className="h-5 w-5" /> },
];

interface TeamHubProps {
  onBackToServices: () => void;
  onLogout: () => void;
}

export function TeamHub({ onBackToServices, onLogout }: TeamHubProps) {
  const [mainView, setMainView] = useState<MainView>("dashboard");
  const [teamView, setTeamView] = useState<TeamView>("overview");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [adminView, setAdminView] = useState<AdminTeamHubView>("admin-dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [teamHubMode, setTeamHubMode] = useState<"user" | "admin">("user");
  const { language } = useLanguage();
  const { isAdmin } = useUser();

  const t = {
    teamHub: language === "en" ? "TeamHub" : "TeamHub",
    subtitle: language === "en" ? "Team Collaboration Platform" : "Платформа для командной работы",
    adminSubtitle: language === "en" ? "TeamHub Administration" : "Администрирование TeamHub",
    logout: language === "en" ? "Logout" : "Выйти",
    backToServices: language === "en" ? "All Services" : "Все сервисы",
    backToTeams: language === "en" ? "Back to Teams" : "Назад к командам",
    mode: language === "en" ? "Mode" : "Режим",
    user: language === "en" ? "User" : "Пользователь",
    admin: language === "en" ? "Admin" : "Администратор",
    userMode: language === "en" ? "User Mode" : "Режим пользователя",
    adminMode: language === "en" ? "Admin Mode" : "Режим администратора",
  };

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    setTeamView("overview");
  };

  const handleBackToTeams = () => {
    setSelectedTeam(null);
    setMainView("teams");
  };

  const getVisibleTeamNavItems = () => {
    if (!selectedTeam) return [];
    console.log("[TeamHub] selectedTeam.user_role =", selectedTeam.user_role);
    return teamNavItems.filter(item =>
      item.showForAll || (item.roles && item.roles.includes(selectedTeam.user_role))
    );
  };

  const renderContent = () => {
    // Admin Mode Views
    if (teamHubMode === "admin") {
      switch (adminView) {
        case "admin-dashboard":
          return <AdminModeDashboardTeamHub />;
        case "admin-teams":
          return <AdminModeTeamsTeamHub />;
        case "admin-members":
          return <AdminModeMembersTeamHub />;
        case "admin-roles":
          return <AdminModeRolesTeamHub />;
        case "admin-projects":
          return <AdminModeProjectsTeamHub />;
        case "admin-tasks":
          return <AdminModeTasksTeamHub />;
        case "admin-specs":
          return <AdminModeSpecsTeamHub />;
        case "admin-files":
          return <AdminModeFilesTeamHub />;
        case "admin-settings":
          return <AdminModeSettingsTeamHub />;
        default:
          return <AdminModeDashboardTeamHub />;
      }
    }

    // Team Views (when a team is selected)
    if (selectedTeam) {
      switch (teamView) {
        case "overview":
          return <TeamOverview team={selectedTeam} />;
        case "projects":
          return <TeamProjects teamId={selectedTeam.id} />;
        case "specs":
          return <TeamSpecs teamId={selectedTeam.id} />;
        case "tasks":
          return <TeamTasks teamId={selectedTeam.id} />;
        case "members":
          return <TeamMembers teamId={selectedTeam.id} />;
        case "files":
          return <TeamFiles teamId={selectedTeam.id} />;
        case "chat":
          return <TeamChat teamId={selectedTeam.id} userRole={selectedTeam.user_role} />;
        case "roles":
          return <TeamRoles teamId={selectedTeam.id} />;
        case "team-settings":
          return <TeamSettings teamId={selectedTeam.id} team={selectedTeam} />;
        default:
          return <TeamOverview team={selectedTeam} />;
      }
    }

    // Main Views
    switch (mainView) {
      case "dashboard":
        return <TeamHubDashboard onNavigate={(view) => {
          if (view === "teams") setMainView("teams");
        }} />;
      case "teams":
        return <Teams onTeamSelect={handleTeamSelect} />;
      case "deadlines":
        return <Deadlines />;
      case "profile":
        return <TeamHubProfile />;
      case "settings":
        return <TeamHubSettings />;
      default:
        return <TeamHubDashboard onNavigate={(view) => {
          if (view === "teams") setMainView("teams");
        }} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                {selectedTeam ? selectedTeam.name : t.teamHub}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {teamHubMode === "admin" ? t.adminSubtitle : t.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Admin Mode Toggle */}
            {isAdmin && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-muted/50">
                <UserCog className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{t.mode}:</span>
                <Switch
                  checked={teamHubMode === "admin"}
                  onCheckedChange={(checked: boolean) => {
                    setTeamHubMode(checked ? "admin" : "user");
                    setSelectedTeam(null);
                  }}
                  className="data-[state=checked]:bg-red-600"
                />
                <span className="text-xs font-medium">
                  {teamHubMode === "admin" ? t.admin : t.user}
                </span>
              </div>
            )}

            {/* Notifications */}
            <NotificationsDropdown />

            {/* Back to All Services */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToServices}
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
        {/* Sidebar Navigation */}
        <aside
          className={`
            fixed md:sticky top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] 
            bg-background border-r transition-transform md:translate-x-0
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <nav className="space-y-2 p-4 h-full flex flex-col">
            {/* Admin Mode Toggle - Mobile */}
            {isAdmin && (
              <div className="md:hidden mb-4 p-3 rounded-lg border bg-muted/50 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="admin-mode-mobile-teamhub" className="text-sm flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    {t.mode}
                  </Label>
                  <Switch
                    id="admin-mode-mobile-teamhub"
                    checked={teamHubMode === "admin"}
                    onCheckedChange={(checked: boolean) => {
                      setTeamHubMode(checked ? "admin" : "user");
                      setSelectedTeam(null);
                    }}
                    className="data-[state=checked]:bg-red-600"
                  />
                </div>
                <div className="text-xs text-center font-medium">
                  {teamHubMode === "admin" ? t.adminMode : t.userMode}
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {teamHubMode === "admin" ? (
                // Admin Mode Navigation
                adminNavItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={adminView === item.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      adminView === item.id 
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" 
                        : ""
                    }`}
                    onClick={() => {
                      setAdminView(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.icon}
                    <span className="ml-3">{language === "en" ? item.labelEn : item.labelRu}</span>
                  </Button>
                ))
              ) : selectedTeam ? (
                // Team View Navigation (when team is selected)
                <>
                  {/* Back to Teams Button */}
                  <Button
                    variant="outline"
                    className="w-full justify-start mb-4"
                    onClick={() => {
                      handleBackToTeams();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="ml-3">{t.backToTeams}</span>
                  </Button>

                  {/* Team Navigation Items */}
                  {getVisibleTeamNavItems().map((item) => (
                    <Button
                      key={item.id}
                      variant={teamView === item.id ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        teamView === item.id 
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" 
                          : ""
                      }`}
                      onClick={() => {
                        setTeamView(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {item.icon}
                      <span className="ml-3">{language === "en" ? item.labelEn : item.labelRu}</span>
                    </Button>
                  ))}
                </>
              ) : (
                // Main Navigation (no team selected)
                mainNavItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={mainView === item.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      mainView === item.id 
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" 
                        : ""
                    }`}
                    onClick={() => {
                      setMainView(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.icon}
                    <span className="ml-3">{language === "en" ? item.labelEn : item.labelRu}</span>
                  </Button>
                ))
              )}
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t space-y-2">
              {/* Back to All Services - visible on mobile */}
              <Button
                variant="ghost"
                className="w-full justify-start md:hidden"
                onClick={() => {
                  onBackToServices();
                  setIsMobileMenuOpen(false);
                }}
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="ml-3">{t.backToServices}</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={onLogout}
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
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
