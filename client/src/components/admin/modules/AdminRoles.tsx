import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  Check,
  X,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useLanguage } from "../../../lib/language-context";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Switch } from "../../ui/switch";

interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: {
    category: string;
    permissions: string[];
  }[];
  color: string;
}

const AdminRoles = () => {
  const { language } = useLanguage();
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const roles: Role[] = [
    {
      id: "1",
      name: "Platform Admin",
      description:
        language === "en"
          ? "Full platform access and control"
          : "Полный доступ к платформе",
      users: 3,
      color: "#ef4444",
      permissions: [
        {
          category: language === "en" ? "User Management" : "Управление пользователями",
          permissions: [
            language === "en" ? "Create users" : "Создание пользователей",
            language === "en" ? "Edit users" : "Редактирование пользователей",
            language === "en" ? "Delete users" : "Удаление пользователей",
            language === "en" ? "Block users" : "Блокировка пользователей"
          ]
        },
        {
          category: language === "en" ? "Role Management" : "Управление ролями",
          permissions: [
            language === "en" ? "Create roles" : "Создание ролей",
            language === "en" ? "Edit roles" : "Редактирование ролей",
            language === "en" ? "Delete roles" : "Удаление ролей",
            language === "en" ? "Assign roles" : "Назначение ролей"
          ]
        },
        {
          category: language === "en" ? "Service Management" : "Управление сервисами",
          permissions: [
            language === "en" ? "Enable/disable services" : "Включение/выключение сервисов",
            language === "en" ? "Configure services" : "Настройка сервисов",
            language === "en" ? "View service logs" : "Просмотр логов"
          ]
        },
        {
          category: language === "en" ? "Platform Settings" : "Настройки платформы",
          permissions: [
            language === "en" ? "Global settings" : "Глобальные настройки",
            language === "en" ? "Security settings" : "Настройки безопасности",
            language === "en" ? "Integration settings" : "Настройки интеграций"
          ]
        }
      ]
    },
    {
      id: "2",
      name: "EduCRM Admin",
      description:
        language === "en"
          ? "Full access to EduCRM service"
          : "Полный доступ к EduCRM",
      users: 8,
      color: "#4f46e5",
      permissions: [
        {
          category: language === "en" ? "Course Management" : "Управление курсами",
          permissions: [
            language === "en" ? "Create courses" : "Создание курсов",
            language === "en" ? "Edit courses" : "Редактирование курсов",
            language === "en" ? "Delete courses" : "Удаление курсов"
          ]
        },
        {
          category: language === "en" ? "Group Management" : "Управление группами",
          permissions: [
            language === "en" ? "Create groups" : "Создание групп",
            language === "en" ? "Edit groups" : "Редактирование групп",
            language === "en" ? "Manage students" : "Управление студентами"
          ]
        }
      ]
    },
    {
      id: "3",
      name: "TeamHub Admin",
      description:
        language === "en"
          ? "Full access to TeamHub service"
          : "Полный доступ к TeamHub",
      users: 5,
      color: "#22c55e",
      permissions: [
        {
          category: language === "en" ? "Team Management" : "Управление командами",
          permissions: [
            language === "en" ? "Create teams" : "Создание команд",
            language === "en" ? "Edit teams" : "Редактирование команд",
            language === "en" ? "Manage members" : "Управление участниками"
          ]
        }
      ]
    },
    {
      id: "4",
      name: "Teacher",
      description:
        language === "en"
          ? "Access to teaching tools in EduCRM"
          : "Доступ к инструментам преподавателя",
      users: 45,
      color: "#a855f7",
      permissions: [
        {
          category: language === "en" ? "Teaching" : "Преподавание",
          permissions: [
            language === "en" ? "View groups" : "Просмотр групп",
            language === "en" ? "Create tasks" : "Создание задач",
            language === "en" ? "Grade students" : "Оценка студентов"
          ]
        }
      ]
    },
    {
      id: "5",
      name: "Student",
      description:
        language === "en"
          ? "Basic access to EduCRM"
          : "Базовый доступ к EduCRM",
      users: 856,
      color: "#06b6d4",
      permissions: [
        {
          category: language === "en" ? "Learning" : "Обучение",
          permissions: [
            language === "en" ? "View courses" : "Просмотр курсов",
            language === "en" ? "Submit tasks" : "Отправка задач",
            language === "en" ? "View grades" : "Просмотр оценок"
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === "en" ? "Roles & Permissions" : "Роли и права"}
          </h1>
          <p className="text-muted-foreground">
            {language === "en"
              ? "Manage platform roles and their permissions"
              : "Управление ролями и правами доступа платформы"}
          </p>
        </div>
        <Button
          className="gap-2"
          style={{
            background: "linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)",
            color: "white"
          }}
        >
          <Plus className="h-4 w-4" />
          {language === "en" ? "Create Role" : "Создать роль"}
        </Button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 gap-4">
        {roles.map((role) => {
          const isExpanded = expandedRole === role.id;
          return (
            <motion.div
              key={role.id}
              layout
              className="rounded-xl border bg-card overflow-hidden"
            >
              {/* Role Header */}
              <div
                className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() =>
                  setExpandedRole(isExpanded ? null : role.id)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${role.color}20` }}
                    >
                      <Shield
                        className="h-6 w-6"
                        style={{ color: role.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{role.name}</h3>
                        <span
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: `${role.color}20`,
                            color: role.color
                          }}
                        >
                          {role.users} {language === "en" ? "users" : "пользователей"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {role.id !== "1" && (
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {/* Permissions Accordion */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t bg-muted/30"
                  >
                    <div className="p-6 space-y-6">
                      {role.permissions.map((category, index) => (
                        <div key={index}>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <div
                              className="w-1 h-4 rounded"
                              style={{ backgroundColor: role.color }}
                            />
                            {category.category}
                          </h4>
                          <div className="space-y-2 ml-5">
                            {category.permissions.map((permission, pIndex) => (
                              <div
                                key={pIndex}
                                className="flex items-center justify-between p-3 rounded-lg bg-background"
                              >
                                <span className="text-sm">{permission}</span>
                                <Switch checked disabled />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Role Hierarchy */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {language === "en" ? "Role Hierarchy" : "Иерархия ролей"}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
            <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold">
              1
            </div>
            <span className="font-medium">Platform Admin</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 ml-8">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold">
              2
            </div>
            <span className="font-medium">EduCRM Admin / TeamHub Admin</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 ml-16">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
              3
            </div>
            <span className="font-medium">Teacher / Team Lead</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/20 ml-24">
            <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold">
              4
            </div>
            <span className="font-medium">Student / Team Member</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminRoles;
