import React, { useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { useLanguage } from "../../../lib/language-context";
import { 
  Shield, 
  Crown,
  User,
  Eye,
  Check,
  X
} from "lucide-react";
import { Badge } from "../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface Permission {
  id: string;
  name: string;
  nameRu: string;
  category: "projects" | "tasks" | "specs" | "members" | "files" | "settings";
}

interface Role {
  id: string;
  name: "Team Leader" | "Moderator" | "Member" | "Viewer";
  nameRu: string;
  icon: React.ReactNode;
  color: string;
  permissions: string[];
  memberCount: number;
}

interface TeamRolesProps {
  teamId: string;
}

export function TeamRoles({ teamId }: TeamRolesProps) {
  const { language } = useLanguage();

  const permissions: Permission[] = [
    // Projects
    { id: "view_projects", name: "View Projects", nameRu: "Просмотр проектов", category: "projects" },
    { id: "create_projects", name: "Create Projects", nameRu: "Создание проектов", category: "projects" },
    { id: "edit_projects", name: "Edit Projects", nameRu: "Редактирование проектов", category: "projects" },
    { id: "delete_projects", name: "Delete Projects", nameRu: "Удаление проектов", category: "projects" },
    
    // Tasks
    { id: "view_tasks", name: "View Tasks", nameRu: "Просмотр задач", category: "tasks" },
    { id: "create_tasks", name: "Create Tasks", nameRu: "Создание задач", category: "tasks" },
    { id: "edit_tasks", name: "Edit Tasks", nameRu: "Редактирование задач", category: "tasks" },
    { id: "delete_tasks", name: "Delete Tasks", nameRu: "Удаление задач", category: "tasks" },
    { id: "assign_tasks", name: "Assign Tasks", nameRu: "Назначение задач", category: "tasks" },
    
    // Specifications
    { id: "view_specs", name: "View Specifications", nameRu: "Просмотр ТЗ", category: "specs" },
    { id: "create_specs", name: "Create Specifications", nameRu: "Создание ТЗ", category: "specs" },
    { id: "edit_specs", name: "Edit Specifications", nameRu: "Редактирование ТЗ", category: "specs" },
    { id: "delete_specs", name: "Delete Specifications", nameRu: "Удаление ТЗ", category: "specs" },
    { id: "approve_specs", name: "Approve Specifications", nameRu: "Утверждение ТЗ", category: "specs" },
    
    // Members
    { id: "view_members", name: "View Members", nameRu: "Просмотр участников", category: "members" },
    { id: "invite_members", name: "Invite Members", nameRu: "Приглашение участников", category: "members" },
    { id: "remove_members", name: "Remove Members", nameRu: "Удаление участников", category: "members" },
    { id: "manage_roles", name: "Manage Roles", nameRu: "Управление ролями", category: "members" },
    
    // Files
    { id: "view_files", name: "View Files", nameRu: "Просмотр файлов", category: "files" },
    { id: "upload_files", name: "Upload Files", nameRu: "Загрузка файлов", category: "files" },
    { id: "delete_files", name: "Delete Files", nameRu: "Удаление файлов", category: "files" },
    
    // Settings
    { id: "view_settings", name: "View Settings", nameRu: "Просмотр настроек", category: "settings" },
    { id: "edit_settings", name: "Edit Settings", nameRu: "Изменение настроек", category: "settings" },
    { id: "delete_team", name: "Delete Team", nameRu: "Удаление команды", category: "settings" },
  ];

  const roles: Role[] = [
    {
      id: "leader",
      name: "Team Leader",
      nameRu: "Лидер команды",
      icon: <Crown className="h-5 w-5" />,
      color: "from-yellow-500 to-orange-600",
      permissions: permissions.map(p => p.id), // All permissions
      memberCount: 1,
    },
    {
      id: "moderator",
      name: "Moderator",
      nameRu: "Модератор",
      icon: <Shield className="h-5 w-5" />,
      color: "from-blue-500 to-indigo-600",
      permissions: permissions.filter(p => 
        !["delete_team", "manage_roles", "remove_members"].includes(p.id)
      ).map(p => p.id),
      memberCount: 1,
    },
    {
      id: "member",
      name: "Member",
      nameRu: "Участник",
      icon: <User className="h-5 w-5" />,
      color: "from-emerald-500 to-teal-600",
      permissions: permissions.filter(p => 
        ["view", "create", "edit", "upload"].some(action => p.id.includes(action))
      ).map(p => p.id),
      memberCount: 4,
    },
    {
      id: "viewer",
      name: "Viewer",
      nameRu: "Наблюдатель",
      icon: <Eye className="h-5 w-5" />,
      color: "from-gray-500 to-slate-600",
      permissions: permissions.filter(p => p.id.includes("view")).map(p => p.id),
      memberCount: 1,
    },
  ];

  const t = {
    roles: language === "en" ? "Team Roles" : "Роли команды",
    subtitle: language === "en" ? "Manage roles and permissions" : "Управление ролями и правами доступа",
    rolesOverview: language === "en" ? "Roles Overview" : "Обзор ролей",
    permissionsMatrix: language === "en" ? "Permissions Matrix" : "Матрица прав доступа",
    members: language === "en" ? "Members" : "Участников",
    permissions: language === "en" ? "Permissions" : "Права доступа",
    
    // Categories
    categoryProjects: language === "en" ? "Projects" : "Проекты",
    categoryTasks: language === "en" ? "Tasks" : "Задачи",
    categorySpecs: language === "en" ? "Specifications" : "Технические задания",
    categoryMembers: language === "en" ? "Members" : "Участники",
    categoryFiles: language === "en" ? "Files" : "Файлы",
    categorySettings: language === "en" ? "Settings" : "Настройки",
    
    description: language === "en" 
      ? "Roles define what actions members can perform within the team. Only Team Leaders can modify role permissions."
      : "Роли определяют, какие действия могут выполнять участники команды. Только лидеры команды могут изменять права доступа ролей.",
    
    descriptionLeader: language === "en"
      ? "Full control over all team aspects. Can manage members, roles, and team settings."
      : "Полный контроль над всеми аспектами команды. Может управлять участниками, ролями и настройками команды.",
    
    descriptionModerator: language === "en"
      ? "Can manage projects, tasks, and specifications. Can invite members but cannot change roles."
      : "Может управлять проектами, задачами и ТЗ. Может приглашать участников, но не может изменять роли.",
    
    descriptionMember: language === "en"
      ? "Can create and edit content, upload files. Standard team member with working permissions."
      : "Может создавать и редактировать контент, загружать файлы. Стандартный участник команды с рабочими правами.",
    
    descriptionViewer: language === "en"
      ? "Read-only access. Can view all content but cannot make any changes."
      : "Доступ только для чтения. Может просматривать весь контент, но не может вносить изменения.",
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "projects":
        return t.categoryProjects;
      case "tasks":
        return t.categoryTasks;
      case "specs":
        return t.categorySpecs;
      case "members":
        return t.categoryMembers;
      case "files":
        return t.categoryFiles;
      case "settings":
        return t.categorySettings;
      default:
        return category;
    }
  };

  const getRoleDescription = (roleName: string) => {
    switch (roleName) {
      case "Team Leader":
        return t.descriptionLeader;
      case "Moderator":
        return t.descriptionModerator;
      case "Member":
        return t.descriptionMember;
      case "Viewer":
        return t.descriptionViewer;
      default:
        return "";
    }
  };

  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          {t.roles}
        </h2>
        <p className="text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      {/* Description */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-100">{t.description}</p>
      </Card>

      {/* Roles Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{t.rolesOverview}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => (
            <Card key={role.id} className="p-6 hover:shadow-lg transition-all">
              <div className="space-y-4">
                {/* Icon & Name */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white shadow-lg`}>
                    {role.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{language === "en" ? role.name : role.nameRu}</h4>
                    <p className="text-xs text-muted-foreground">
                      {role.memberCount} {t.members.toLowerCase()}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground">
                  {getRoleDescription(role.name)}
                </p>

                {/* Permissions Count */}
                <div className="pt-3 border-t">
                  <Badge variant="secondary" className="w-full justify-center">
                    {role.permissions.length} {t.permissions.toLowerCase()}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Permissions Matrix */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{t.permissionsMatrix}</h3>
        <Card className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-64 font-semibold">{t.permissions}</TableHead>
                {roles.map((role) => (
                  <TableHead key={role.id} className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center text-white shadow`}>
                        {role.icon}
                      </div>
                      <span className="font-semibold text-xs">
                        {language === "en" ? role.name : role.nameRu}
                      </span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                <React.Fragment key={`category-group-${category}`}>
                  {/* Category Header */}
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={roles.length + 1} className="font-semibold">
                      {getCategoryName(category)}
                    </TableCell>
                  </TableRow>
                  {/* Permissions */}
                  {categoryPermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">
                        {language === "en" ? permission.name : permission.nameRu}
                      </TableCell>
                      {roles.map((role) => (
                        <TableCell key={`${permission.id}-${role.id}`} className="text-center">
                          {role.permissions.includes(permission.id) ? (
                            <div className="flex justify-center">
                              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Check className="h-4 w-4 text-emerald-600" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <div className="w-6 h-6 rounded-full bg-gray-500/10 flex items-center justify-center">
                                <X className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
