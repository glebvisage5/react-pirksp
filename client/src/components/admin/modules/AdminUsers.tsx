import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Eye,
  Mail,
  Phone,
  Calendar,
  Shield,
  MoreVertical,
  Download,
  UserPlus
} from "lucide-react";
import { useLanguage } from "../../../lib/language-context";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card } from "../../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../ui/dropdown-menu";

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: "active" | "blocked" | "pending";
  registeredAt: string;
  lastLogin: string;
  services: string[];
  groups: number;
  teams: number;
}

const AdminUsers = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data
  const users: User[] = [
    {
      id: "1",
      name: "Иван Петров",
      email: "ivan@example.com",
      roles: ["Platform Admin", "EduCRM Admin"],
      status: "active",
      registeredAt: "2024-01-15",
      lastLogin: "2 минуты назад",
      services: ["EduCRM", "TeamHub", "Admin Center"],
      groups: 3,
      teams: 2
    },
    {
      id: "2",
      name: "Мария Сидорова",
      email: "maria@example.com",
      roles: ["EduCRM Admin", "Teacher"],
      status: "active",
      registeredAt: "2024-02-10",
      lastLogin: "1 час назад",
      services: ["EduCRM"],
      groups: 5,
      teams: 0
    },
    {
      id: "3",
      name: "Алексей Иванов",
      email: "alexey@example.com",
      roles: ["Student"],
      status: "active",
      registeredAt: "2024-03-05",
      lastLogin: "3 часа назад",
      services: ["EduCRM"],
      groups: 2,
      teams: 1
    },
    {
      id: "4",
      name: "Ольга Смирнова",
      email: "olga@example.com",
      roles: ["TeamHub Admin"],
      status: "active",
      registeredAt: "2024-01-20",
      lastLogin: "5 часов назад",
      services: ["TeamHub"],
      groups: 0,
      teams: 4
    },
    {
      id: "5",
      name: "Дмитрий Козлов",
      email: "dmitry@example.com",
      roles: ["Student"],
      status: "blocked",
      registeredAt: "2024-02-28",
      lastLogin: "2 дня назад",
      services: ["EduCRM"],
      groups: 1,
      teams: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "blocked":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    if (language === "en") {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }
    switch (status) {
      case "active":
        return "Активен";
      case "blocked":
        return "Заблокирован";
      case "pending":
        return "Ожидает";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === "en" ? "User Management" : "Управление пользователями"}
          </h1>
          <p className="text-muted-foreground">
            {language === "en"
              ? "Manage all platform users, roles, and access"
              : "Управление всеми пользователями, ролями и доступами платформы"}
          </p>
        </div>
        <Button
          className="gap-2"
          style={{
            background: "linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)",
            color: "white"
          }}
        >
          <UserPlus className="h-4 w-4" />
          {language === "en" ? "Add User" : "Добавить пользователя"}
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                language === "en"
                  ? "Search by name, email..."
                  : "Поиск по имени, email..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 rounded-md border bg-background"
            >
              <option value="all">
                {language === "en" ? "All Roles" : "Все роли"}
              </option>
              <option value="admin">
                {language === "en" ? "Admin" : "Администратор"}
              </option>
              <option value="teacher">
                {language === "en" ? "Teacher" : "Преподаватель"}
              </option>
              <option value="student">
                {language === "en" ? "Student" : "Студент"}
              </option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-md border bg-background"
            >
              <option value="all">
                {language === "en" ? "All Statuses" : "Все статусы"}
              </option>
              <option value="active">
                {language === "en" ? "Active" : "Активные"}
              </option>
              <option value="blocked">
                {language === "en" ? "Blocked" : "Заблокированные"}
              </option>
            </select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">
                  {language === "en" ? "User" : "Пользователь"}
                </th>
                <th className="text-left p-4 font-medium">
                  {language === "en" ? "Roles" : "Роли"}
                </th>
                <th className="text-left p-4 font-medium">
                  {language === "en" ? "Status" : "Статус"}
                </th>
                <th className="text-left p-4 font-medium">
                  {language === "en" ? "Services" : "Сервисы"}
                </th>
                <th className="text-left p-4 font-medium">
                  {language === "en" ? "Last Login" : "Последний вход"}
                </th>
                <th className="text-left p-4 font-medium">
                  {language === "en" ? "Actions" : "Действия"}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  className="border-t hover:bg-muted/30 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-full bg-[#4f46e5]/10 text-[#4f46e5]"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {getStatusText(user.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{user.services.join(", ")}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{user.lastLogin}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === "en" ? "Registered" : "Регистрация"}:{" "}
                      {user.registeredAt}
                    </p>
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          {language === "en" ? "View Profile" : "Просмотр профиля"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          {language === "en" ? "Edit" : "Редактировать"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Shield className="h-4 w-4" />
                          {language === "en" ? "Manage Roles" : "Управление ролями"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          {user.status === "active" ? (
                            <>
                              <Lock className="h-4 w-4" />
                              {language === "en" ? "Block User" : "Заблокировать"}
                            </>
                          ) : (
                            <>
                              <Unlock className="h-4 w-4" />
                              {language === "en" ? "Unblock User" : "Разблокировать"}
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600">
                          <Trash2 className="h-4 w-4" />
                          {language === "en" ? "Delete" : "Удалить"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">
            {language === "en" ? "Total Users" : "Всего пользователей"}
          </p>
          <p className="text-2xl font-bold">{users.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">
            {language === "en" ? "Active" : "Активные"}
          </p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.status === "active").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">
            {language === "en" ? "Blocked" : "Заблокированные"}
          </p>
          <p className="text-2xl font-bold text-red-600">
            {users.filter((u) => u.status === "blocked").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">
            {language === "en" ? "Admins" : "Администраторы"}
          </p>
          <p className="text-2xl font-bold text-purple-600">
            {
              users.filter((u) =>
                u.roles.some((r) => r.includes("Admin"))
              ).length
            }
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;
