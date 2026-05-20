import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Activity,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  User,
  Settings,
  Lock,
  Database
} from "lucide-react";
import { useLanguage } from "../../../lib/language-context";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card } from "../../ui/card";

interface Log {
  id: string;
  type: "auth" | "error" | "admin" | "user" | "system" | "api";
  level: "info" | "warning" | "error" | "success";
  user: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
}

const AdminLogs = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");

  const logs: Log[] = [
    {
      id: "1",
      type: "auth",
      level: "success",
      user: "ivan@example.com",
      action: language === "en" ? "User login" : "Вход пользователя",
      details: "Successful authentication",
      timestamp: "2024-01-31 14:32:15",
      ip: "192.168.1.1"
    },
    {
      id: "2",
      type: "admin",
      level: "info",
      user: "admin@example.com",
      action: language === "en" ? "Created new user" : "Создан новый пользователь",
      details: "User: maria@example.com",
      timestamp: "2024-01-31 14:15:42",
      ip: "192.168.1.5"
    },
    {
      id: "3",
      type: "error",
      level: "error",
      user: "system",
      action: language === "en" ? "Database connection failed" : "Ошибка подключения к БД",
      details: "Connection timeout after 30s",
      timestamp: "2024-01-31 13:45:23",
      ip: "localhost"
    },
    {
      id: "4",
      type: "admin",
      level: "warning",
      user: "admin@example.com",
      action: language === "en" ? "Modified user roles" : "Изменены роли пользователя",
      details: "User: alexey@example.com, Added: Teacher",
      timestamp: "2024-01-31 13:20:10",
      ip: "192.168.1.5"
    },
    {
      id: "5",
      type: "system",
      level: "info",
      user: "system",
      action: language === "en" ? "Service restart" : "Перезапуск сервиса",
      details: "EduCRM service restarted",
      timestamp: "2024-01-31 12:00:00",
      ip: "localhost"
    },
    {
      id: "6",
      type: "api",
      level: "info",
      user: "api-client",
      action: language === "en" ? "API request" : "API запрос",
      details: "GET /api/users - 200 OK",
      timestamp: "2024-01-31 11:45:33",
      ip: "203.0.113.42"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "info":
        return "text-blue-600 dark:text-blue-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "info":
        return <Info className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "error":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "auth":
        return <Lock className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "admin":
        return <Settings className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      case "system":
        return <Activity className="h-4 w-4" />;
      case "api":
        return <Database className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {language === "en" ? "Logs & Activity" : "Логи и активность"}
        </h1>
        <p className="text-muted-foreground">
          {language === "en"
            ? "Monitor system logs and user activity"
            : "Мониторинг системных логов и активности пользователей"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Success" : "Успешно"}
              </p>
              <p className="text-2xl font-bold">
                {logs.filter((l) => l.level === "success").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Info className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Info" : "Информация"}
              </p>
              <p className="text-2xl font-bold">
                {logs.filter((l) => l.level === "info").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Warning" : "Предупреждения"}
              </p>
              <p className="text-2xl font-bold">
                {logs.filter((l) => l.level === "warning").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Errors" : "Ошибки"}
              </p>
              <p className="text-2xl font-bold">
                {logs.filter((l) => l.level === "error").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                language === "en" ? "Search logs..." : "Поиск в логах..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-md border bg-background"
            >
              <option value="all">
                {language === "en" ? "All Types" : "Все типы"}
              </option>
              <option value="auth">
                {language === "en" ? "Authentication" : "Авторизация"}
              </option>
              <option value="admin">
                {language === "en" ? "Admin Actions" : "Действия админа"}
              </option>
              <option value="error">
                {language === "en" ? "Errors" : "Ошибки"}
              </option>
              <option value="system">
                {language === "en" ? "System" : "Система"}
              </option>
              <option value="api">API</option>
            </select>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2 rounded-md border bg-background"
            >
              <option value="all">
                {language === "en" ? "All Levels" : "Все уровни"}
              </option>
              <option value="success">
                {language === "en" ? "Success" : "Успешно"}
              </option>
              <option value="info">
                {language === "en" ? "Info" : "Информация"}
              </option>
              <option value="warning">
                {language === "en" ? "Warning" : "Предупреждения"}
              </option>
              <option value="error">
                {language === "en" ? "Error" : "Ошибки"}
              </option>
            </select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Logs List */}
      <Card>
        <div className="divide-y">
          {logs.map((log) => (
            <motion.div
              key={log.id}
              className="p-4 hover:bg-muted/30 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-start gap-4">
                <div className={getLevelColor(log.level)}>
                  {getLevelIcon(log.level)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-1 text-xs rounded-full bg-muted flex items-center gap-1">
                      {getTypeIcon(log.type)}
                      {log.type}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {log.user}
                    </span>
                  </div>
                  <p className="font-medium mb-1">{log.action}</p>
                  <p className="text-sm text-muted-foreground">{log.details}</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>{log.timestamp}</p>
                  <p className="text-xs">{log.ip}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminLogs;
