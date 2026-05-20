import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  Server,
  FileText,
  Activity,
  GraduationCap,
  Users as TeamIcon,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
  Globe
} from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "../../lib/theme-context";
import { useLanguage } from "../../lib/language-context";
import { useUser } from "../../lib/user-context";

// Import module components
import AdminDashboard from "./modules/AdminDashboard";
import AdminUsers from "./modules/AdminUsers";
import AdminRoles from "./modules/AdminRoles";
import AdminServices from "./modules/AdminServices";
import AdminEduCRM from "./modules/AdminEduCRM";
import AdminTeamHub from "./modules/AdminTeamHub";
import AdminOrders from "./modules/AdminOrders";
import AdminLogs from "./modules/AdminLogs";
import AdminSettings from "./modules/AdminSettings";

interface AdminCenterProps {
  onBackToServices: () => void;
  onLogout: () => void;
}

type ModuleType =
  | "dashboard"
  | "users"
  | "roles"
  | "services"
  | "educrm"
  | "teamhub"
  | "orders"
  | "logs"
  | "settings";

const AdminCenter: React.FC<AdminCenterProps> = ({
  onBackToServices,
  onLogout
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { user } = useUser();

  const [currentModule, setCurrentModule] = useState<ModuleType>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const modules = [
    {
      id: "dashboard" as ModuleType,
      name: language === "en" ? "Dashboard" : "Панель управления",
      icon: LayoutDashboard,
      description: language === "en" ? "Overview and statistics" : "Обзор и статистика"
    },
    {
      id: "users" as ModuleType,
      name: language === "en" ? "Users" : "Пользователи",
      icon: Users,
      description: language === "en" ? "Manage all platform users" : "Управление пользователями"
    },
    {
      id: "roles" as ModuleType,
      name: language === "en" ? "Roles & Permissions" : "Роли и права",
      icon: Shield,
      description: language === "en" ? "Manage roles and access" : "Управление ролями и доступами"
    },
    {
      id: "services" as ModuleType,
      name: language === "en" ? "Services" : "Сервисы",
      icon: Server,
      description: language === "en" ? "Manage platform services" : "Управление сервисами"
    },
    {
      id: "educrm" as ModuleType,
      name: "EduCRM Admin",
      icon: GraduationCap,
      description: language === "en" ? "Global EduCRM management" : "Глобальное управление EduCRM"
    },
    {
      id: "teamhub" as ModuleType,
      name: "TeamHub Admin",
      icon: TeamIcon,
      description: language === "en" ? "Global TeamHub management" : "Глобальное управление TeamHub"
    },
    {
      id: "orders" as ModuleType,
      name: language === "en" ? "Orders" : "Заказы",
      icon: FileText,
      description: language === "en" ? "Website order requests" : "Заявки с сайта"
    },
    {
      id: "logs" as ModuleType,
      name: language === "en" ? "Logs & Activity" : "Логи и активность",
      icon: Activity,
      description: language === "en" ? "System logs and user activity" : "Системные логи и активность"
    },
    {
      id: "settings" as ModuleType,
      name: language === "en" ? "Platform Settings" : "Настройки платформы",
      icon: Settings,
      description: language === "en" ? "Global platform settings" : "Глобальные настройки"
    }
  ];

  const renderModule = () => {
    switch (currentModule) {
      case "dashboard":
        return <AdminDashboard />;
      case "users":
        return <AdminUsers />;
      case "roles":
        return <AdminRoles />;
      case "services":
        return <AdminServices />;
      case "educrm":
        return <AdminEduCRM />;
      case "teamhub":
        return <AdminTeamHub />;
      case "orders":
        return <AdminOrders />;
      case "logs":
        return <AdminLogs />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  const Sidebar = ({ mobile = false }) => (
    <div className="h-full flex flex-col bg-card border-r">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-green-600 dark:from-purple-400 dark:via-indigo-400 dark:to-green-400 bg-clip-text text-transparent">
            Admin Center
          </h1>
          {mobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {language === "en" ? "Platform Management" : "Управление платформой"}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = currentModule === module.id;
          return (
            <motion.button
              key={module.id}
              onClick={() => {
                setCurrentModule(module.id);
                if (mobile) setIsMobileSidebarOpen(false);
              }}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-purple-500 via-indigo-500 to-green-500 text-white shadow-lg"
                  : "hover:bg-muted"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <div className="flex-1">
                  <div className="font-medium">{module.name}</div>
                  {!isActive && (
                    <div className="text-xs text-muted-foreground">
                      {module.description}
                    </div>
                  )}
                </div>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={onBackToServices}
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          {language === "en" ? "Back to Services" : "Назад к сервисам"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="hidden lg:block w-80 h-full"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="lg:hidden fixed left-0 top-0 h-full w-80 z-50"
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-semibold">
                {modules.find((m) => m.id === currentModule)?.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                {user?.name} • Platform Admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleLanguage}>
              <Globe className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Module Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentModule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderModule()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminCenter;
