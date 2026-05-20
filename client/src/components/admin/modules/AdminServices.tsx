import React from "react";
import { motion } from "motion/react";
import {
  Server,
  Power,
  Settings,
  Activity,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database
} from "lucide-react";
import { useLanguage } from "../../../lib/language-context";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Switch } from "../../ui/switch";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const AdminServices = () => {
  const { language } = useLanguage();

  const services = [
    {
      id: "educrm",
      name: "EduCRM",
      description:
        language === "en"
          ? "Educational management system"
          : "Система управления обучением",
      status: "online",
      enabled: true,
      users: 456,
      activeNow: 87,
      uptime: "99.9%",
      requests: "12.5k/hour",
      avgResponse: "45ms",
      errors: 3,
      color: "#4f46e5",
      stats: [
        { time: "00:00", users: 45 },
        { time: "04:00", users: 32 },
        { time: "08:00", users: 78 },
        { time: "12:00", users: 95 },
        { time: "16:00", users: 102 },
        { time: "20:00", users: 87 },
        { time: "24:00", users: 56 }
      ]
    },
    {
      id: "teamhub",
      name: "TeamHub",
      description:
        language === "en"
          ? "Team collaboration platform"
          : "Платформа для командной работы",
      status: "online",
      enabled: true,
      users: 312,
      activeNow: 54,
      uptime: "99.8%",
      requests: "8.3k/hour",
      avgResponse: "52ms",
      errors: 1,
      color: "#22c55e",
      stats: [
        { time: "00:00", users: 28 },
        { time: "04:00", users: 15 },
        { time: "08:00", users: 45 },
        { time: "12:00", users: 68 },
        { time: "16:00", users: 72 },
        { time: "20:00", users: 54 },
        { time: "24:00", users: 38 }
      ]
    },
    {
      id: "admin",
      name: "Admin Center",
      description:
        language === "en"
          ? "Platform administration center"
          : "Центр администрирования платформы",
      status: "online",
      enabled: true,
      users: 8,
      activeNow: 3,
      uptime: "100%",
      requests: "1.2k/hour",
      avgResponse: "38ms",
      errors: 0,
      color: "#a855f7",
      stats: [
        { time: "00:00", users: 0 },
        { time: "04:00", users: 0 },
        { time: "08:00", users: 2 },
        { time: "12:00", users: 4 },
        { time: "16:00", users: 5 },
        { time: "20:00", users: 3 },
        { time: "24:00", users: 1 }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {language === "en" ? "Service Management" : "Управление сервисами"}
        </h1>
        <p className="text-muted-foreground">
          {language === "en"
            ? "Monitor and manage all platform services"
            : "Мониторинг и управление всеми сервисами платформы"}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-6">
        {services.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden">
              {/* Service Header */}
              <div className="p-6 border-b">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${service.color}20` }}
                    >
                      <Server
                        className="h-8 w-8"
                        style={{ color: service.color }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold">
                          {service.name}
                        </h3>
                        <span className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          {language === "en" ? "Online" : "Онлайн"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={service.enabled} />
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {language === "en" ? "Active Now" : "Активных сейчас"}
                      </span>
                    </div>
                    <p className="text-lg font-bold">{service.activeNow}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {language === "en" ? "Uptime" : "Аптайм"}
                      </span>
                    </div>
                    <p className="text-lg font-bold">{service.uptime}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {language === "en" ? "Requests" : "Запросы"}
                      </span>
                    </div>
                    <p className="text-lg font-bold">{service.requests}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {language === "en" ? "Avg Response" : "Ср. ответ"}
                      </span>
                    </div>
                    <p className="text-lg font-bold">{service.avgResponse}</p>
                  </div>
                </div>
              </div>

              {/* Activity Chart */}
              <div className="p-6 border-b">
                <h4 className="text-sm font-semibold mb-4">
                  {language === "en"
                    ? "Active Users (24h)"
                    : "Активные пользователи (24ч)"}
                </h4>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={service.stats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke={service.color}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Stats */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg border">
                    <Users
                      className="h-8 w-8"
                      style={{ color: service.color }}
                    />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === "en" ? "Total Users" : "Всего пользователей"}
                      </p>
                      <p className="text-2xl font-bold">{service.users}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === "en" ? "Success Rate" : "Успешность"}
                      </p>
                      <p className="text-2xl font-bold">99.7%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border">
                    <AlertTriangle
                      className={`h-8 w-8 ${
                        service.errors > 0 ? "text-yellow-500" : "text-green-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === "en" ? "Errors (24h)" : "Ошибки (24ч)"}
                      </p>
                      <p className="text-2xl font-bold">{service.errors}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2">
                    <Activity className="h-4 w-4" />
                    {language === "en" ? "View Logs" : "Просмотр логов"}
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Settings className="h-4 w-4" />
                    {language === "en" ? "Configure" : "Настроить"}
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Database className="h-4 w-4" />
                    {language === "en" ? "Database" : "База данных"}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Platform Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {language === "en" ? "Platform Overview" : "Обзор платформы"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <Server className="h-8 w-8 mx-auto mb-2 text-[#4f46e5]" />
            <p className="text-sm text-muted-foreground mb-1">
              {language === "en" ? "Total Services" : "Всего сервисов"}
            </p>
            <p className="text-2xl font-bold">{services.length}</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm text-muted-foreground mb-1">
              {language === "en" ? "Online" : "Онлайн"}
            </p>
            <p className="text-2xl font-bold">
              {services.filter((s) => s.status === "online").length}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <Users className="h-8 w-8 mx-auto mb-2 text-[#22c55e]" />
            <p className="text-sm text-muted-foreground mb-1">
              {language === "en" ? "Total Active" : "Всего активных"}
            </p>
            <p className="text-2xl font-bold">
              {services.reduce((sum, s) => sum + s.activeNow, 0)}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <Activity className="h-8 w-8 mx-auto mb-2 text-[#a855f7]" />
            <p className="text-sm text-muted-foreground mb-1">
              {language === "en" ? "Avg Uptime" : "Ср. аптайм"}
            </p>
            <p className="text-2xl font-bold">99.9%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminServices;
