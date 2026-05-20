import { useState } from "react";
import { Button } from "../../ui/button";
import { useLanguage } from "../../../lib/language-context";
import { 
  ArrowLeft,
  Users,
  LayoutDashboard,
  FolderKanban,
  FileText,
  CheckSquare,
  UserPlus,
  FolderOpen,
  MessageSquare,
  Shield,
  Settings as SettingsIcon
} from "lucide-react";
import { TeamOverview } from "./TeamOverview";
import { TeamProjects } from "./TeamProjects";
import { TeamSpecs } from "./TeamSpecs";
import { TeamTasks } from "./TeamTasks";
import { TeamMembers } from "./TeamMembers";
import { TeamFiles } from "./TeamFiles";
import { TeamChat } from "./TeamChat";
import { TeamRoles } from "./TeamRoles";
import { TeamSettings } from "./TeamSettings";
import { Badge } from "../../ui/badge";

type TeamViewTab = 
  | "overview" 
  | "projects" 
  | "specs" 
  | "tasks" 
  | "members" 
  | "files" 
  | "chat"
  | "roles" 
  | "settings";

interface Team {
  id: string;
  name: string;
  description: string;
  owner: string;
  role: "Team Leader" | "Moderator" | "Member" | "Viewer";
  members: number;
  projects: number;
  createdAt: string;
}

interface TeamViewProps {
  team: Team;
  onBack: () => void;
  onCreateSpec?: () => void;
}

export function TeamView({ team, onBack, onCreateSpec }: TeamViewProps) {
  const { language } = useLanguage();
  const [currentTab, setCurrentTab] = useState<TeamViewTab>("overview");

  const t = {
    backToTeams: language === "en" ? "My Teams" : "Мои команды",
    overview: language === "en" ? "Overview" : "Обзор",
    projects: language === "en" ? "Projects" : "Проекты",
    specifications: language === "en" ? "Specifications" : "Технические задания",
    tasks: language === "en" ? "Tasks" : "Задачи",
    members: language === "en" ? "Members" : "Участники",
    files: language === "en" ? "Files" : "Файлы",
    chat: language === "en" ? "Chat" : "Чат",
    roles: language === "en" ? "Roles" : "Роли команды",
    settings: language === "en" ? "Settings" : "Настройки",
    yourRole: language === "en" ? "Your Role" : "Ваша роль",
    teamLeader: language === "en" ? "Team Leader" : "Лидер команды",
    moderator: language === "en" ? "Moderator" : "Модератор",
    member: language === "en" ? "Member" : "Участник",
    viewer: language === "en" ? "Viewer" : "Наблюдатель",
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Team Leader":
        return "from-yellow-500 to-orange-600";
      case "Moderator":
        return "from-blue-500 to-indigo-600";
      case "Member":
        return "from-emerald-500 to-teal-600";
      case "Viewer":
        return "from-gray-500 to-slate-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "Team Leader":
        return t.teamLeader;
      case "Moderator":
        return t.moderator;
      case "Member":
        return t.member;
      case "Viewer":
        return t.viewer;
      default:
        return role;
    }
  };

  const tabs = [
    { id: "overview" as TeamViewTab, label: t.overview, icon: <LayoutDashboard className="h-4 w-4" />, showForAll: true },
    { id: "projects" as TeamViewTab, label: t.projects, icon: <FolderKanban className="h-4 w-4" />, showForAll: true },
    { id: "specs" as TeamViewTab, label: t.specifications, icon: <FileText className="h-4 w-4" />, showForAll: true },
    { id: "tasks" as TeamViewTab, label: t.tasks, icon: <CheckSquare className="h-4 w-4" />, showForAll: true },
    { id: "members" as TeamViewTab, label: t.members, icon: <UserPlus className="h-4 w-4" />, showForAll: true },
    { id: "files" as TeamViewTab, label: t.files, icon: <FolderOpen className="h-4 w-4" />, showForAll: true },
    { id: "chat" as TeamViewTab, label: t.chat, icon: <MessageSquare className="h-4 w-4" />, showForAll: true },
    { id: "roles" as TeamViewTab, label: t.roles, icon: <Shield className="h-4 w-4" />, showForAll: false, roles: ["Team Leader", "Moderator"] },
    { id: "settings" as TeamViewTab, label: t.settings, icon: <SettingsIcon className="h-4 w-4" />, showForAll: false, roles: ["Team Leader", "Moderator"] },
  ];

  const visibleTabs = tabs.filter(tab => 
    tab.showForAll || (tab.roles && tab.roles.includes(team.role))
  );

  const renderContent = () => {
    switch (currentTab) {
      case "overview":
        return <TeamOverview team={team} />;
      case "projects":
        return <TeamProjects teamId={team.id} userRole={team.role} />;
      case "specs":
        return <TeamSpecs teamId={team.id} userRole={team.role} />;
      case "tasks":
        return <TeamTasks teamId={team.id} />;
      case "members":
        return <TeamMembers teamId={team.id} userRole={team.role} />;
      case "files":
        return <TeamFiles teamId={team.id} userRole={team.role} />;
      case "chat":
        return <TeamChat teamId={team.id} userRole={team.role} />;
      case "roles":
        return <TeamRoles teamId={team.id} />;
      case "settings":
        return <TeamSettings teamId={team.id} team={team} userRole={team.role} />;
      default:
        return <TeamOverview team={team} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Team Info */}
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getRoleColor(team.role)} flex items-center justify-center text-white shadow-lg shrink-0`}>
              <Users className="h-8 w-8" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{team.name}</h1>
                <Badge className={`bg-gradient-to-r ${getRoleColor(team.role)} text-white border-0`}>
                  {getRoleText(team.role)}
                </Badge>
              </div>
              <p className="text-muted-foreground">{team.description}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{team.members} {language === "en" ? "members" : "участников"}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <FolderKanban className="h-4 w-4" />
                  <span>{team.projects} {language === "en" ? "projects" : "проектов"}</span>
                </div>
                <span>•</span>
                <span>{language === "en" ? "Owner" : "Владелец"}: {team.owner}</span>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={onBack}
            className="whitespace-nowrap"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.backToTeams}
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {visibleTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={currentTab === tab.id ? "default" : "ghost"}
              onClick={() => setCurrentTab(tab.id)}
              className={`rounded-b-none border-b-2 ${
                currentTab === tab.id
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="pb-8">
        {renderContent()}
      </div>
    </div>
  );
}
