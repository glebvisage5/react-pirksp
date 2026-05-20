import React from "react";
import { motion } from "motion/react";
import {
  Users,
  GraduationCap,
  BookOpen,
  CheckSquare,
  FileText,
  TrendingUp,
  Activity,
  Server,
  AlertCircle,
  Clock,
  Calendar
} from "lucide-react";
import { useLanguage } from "../../../lib/language-context";
import { Card } from "../../ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const AdminDashboard = () => {
  const { language } = useLanguage();

  // Mock data
  const stats = {
    totalUsers: 1247,
    activeUsers24h: 342,
    activeUsers7d: 856,
    activeUsers30d: 1108,
    totalTeams: 87,
    totalGroups: 45,
    totalCourses: 128,
    totalTasks: 2456,
    totalFiles: 8934,
    pendingOrders: 23
  };

  const serviceStatus = [
    { name: "EduCRM", status: "online", users: 456, uptime: "99.9%" },
    { name: "TeamHub", status: "online", users: 312, uptime: "99.8%" },
    { name: "Admin Center", status: "online", users: 8, uptime: "100%" }
  ];

  const recentActivity = [
    {
      user: "Иван Петров",
      action: language === "en" ? "Created new user" : "Создал нового пользователя",
      time: "2 минуты назад",
      type: "user"
    },
    {
      user: "Admin",
      action: language === "en" ? "Updated service settings" : "Обновил настройки сервиса",
      time: "15 минут назад",
      type: "settings"
    },
    {
      user: "Мария Сидорова",
      action: language === "en" ? "Assigned new role" : "Назначила новую роль",
      time: "1 час назад",
      type: "role"
    },
    {
      user: "System",
      action: language === "en" ? "Service restart" : "Перезапуск сервиса",
      time: "3 часа назад",
      type: "system"
    }
  ];

  const userActivityData = [
    { date: "Пн", users: 820 },
    { date: "Вт", users: 950 },
    { date: "Ср", users: 1100 },
    { date: "Чт", users: 890 },
    { date: "Пт", users: 1200 },
    { date: "Сб", users: 650 },
    { date: "Вс", users: 480 }
  ];

  const serviceUsageData = [
    { name: "EduCRM", value: 456, color: "#4f46e5" },
    { name: "TeamHub", value: 312, color: "#22c55e" },
    { name: "Admin", value: 8, color: "#a855f7" }
  ];

  const StatCard = ({
    icon: Icon,
    label,
    value,
    change,
    color
  }: {
    icon: any;
    label: string;
    value: string | number;
    change?: string;
    color: string;
  }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-xl border bg-card shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          {change && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {change}
            </p>
          )}
        </div>
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {language === "en" ? "Platform Dashboard" : "Панель управления платформой"}
        </h1>
        <p className="text-muted-foreground">
          {language === "en"
            ? "Overview of all platform services and activities"
            : "Обзор всех сервисов и активности платформы"}
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label={language === "en" ? "Total Users" : "Всего пользователей"}
          value={stats.totalUsers}
          change="+12% за месяц"
          color="#4f46e5"
        />
        <StatCard
          icon={Activity}
          label={language === "en" ? "Active (24h)" : "Активные (24ч)"}
          value={stats.activeUsers24h}
          change="+8% за день"
          color="#22c55e"
        />
        <StatCard
          icon={GraduationCap}
          label={language === "en" ? "Total Groups" : "Всего групп"}
          value={stats.totalGroups}
          color="#a855f7"
        />
        <StatCard
          icon={Users}
          label={language === "en" ? "Total Teams" : "Всего команд"}
          value={stats.totalTeams}
          color="#f59e0b"
        />
        <StatCard
          icon={BookOpen}
          label={language === "en" ? "Total Courses" : "Всего курсов"}
          value={stats.totalCourses}
          color="#06b6d4"
        />
        <StatCard
          icon={CheckSquare}
          label={language === "en" ? "Total Tasks" : "Всего задач"}
          value={stats.totalTasks}
          color="#ec4899"
        />
        <StatCard
          icon={FileText}
          label={language === "en" ? "Total Files" : "Всего файлов"}
          value={stats.totalFiles}
          color="#8b5cf6"
        />
        <StatCard
          icon={Clock}
          label={language === "en" ? "Pending Orders" : "Ожидающие заказы"}
          value={stats.pendingOrders}
          change="Требуют внимания"
          color="#ef4444"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {language === "en" ? "User Activity (7 days)" : "Активность пользователей (7 дней)"}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ fill: "#4f46e5" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Service Usage Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {language === "en" ? "Service Usage Distribution" : "Распределение использования сервисов"}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceUsageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {serviceUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Service Status and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Status */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Server className="h-5 w-5 text-[#4f46e5]" />
            <h3 className="text-lg font-semibold">
              {language === "en" ? "Service Status" : "Статус сервисов"}
            </h3>
          </div>
          <div className="space-y-4">
            {serviceStatus.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-4 rounded-lg border bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.users} {language === "en" ? "active users" : "активных пользователей"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    {language === "en" ? "Online" : "Онлайн"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === "en" ? "Uptime" : "Аптайм"}: {service.uptime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-[#4f46e5]" />
            <h3 className="text-lg font-semibold">
              {language === "en" ? "Recent Admin Activity" : "Последняя активность администраторов"}
            </h3>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-[#4f46e5] mt-2" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {language === "en" ? "Active Users Statistics" : "Статистика активных пользователей"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-lg border bg-muted/50">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-[#4f46e5]" />
            <p className="text-2xl font-bold">{stats.activeUsers24h}</p>
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "Last 24 hours" : "За последние 24 часа"}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg border bg-muted/50">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-[#22c55e]" />
            <p className="text-2xl font-bold">{stats.activeUsers7d}</p>
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "Last 7 days" : "За последние 7 дней"}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg border bg-muted/50">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-[#a855f7]" />
            <p className="text-2xl font-bold">{stats.activeUsers30d}</p>
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "Last 30 days" : "За последние 30 дней"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
