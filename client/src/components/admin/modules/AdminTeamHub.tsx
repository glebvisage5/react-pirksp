import React from "react";
import { Users, Folder, CheckSquare, TrendingUp } from "lucide-react";
import { useLanguage } from "../../../lib/language-context";
import { Card } from "../../ui/card";

const AdminTeamHub = () => {
  const { language } = useLanguage();

  const stats = [
    { icon: Users, label: language === "en" ? "Total Teams" : "Всего команд", value: "87", color: "#22c55e" },
    { icon: Folder, label: language === "en" ? "Total Projects" : "Всего проектов", value: "234", color: "#4f46e5" },
    { icon: CheckSquare, label: language === "en" ? "Active Tasks" : "Активные задачи", value: "1,523", color: "#a855f7" },
    { icon: TrendingUp, label: language === "en" ? "Completed" : "Завершено", value: "3,892", color: "#06b6d4" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {language === "en" ? "TeamHub Global Management" : "Глобальное управление TeamHub"}
        </h1>
        <p className="text-muted-foreground">
          {language === "en"
            ? "Manage all teams, projects, and collaboration tools"
            : "Управление всеми командами, проектами и инструментами совместной работы"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="h-6 w-6" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-12 text-center">
        <Users className="h-16 w-16 mx-auto mb-4 text-[#22c55e]" />
        <h3 className="text-xl font-semibold mb-2">
          {language === "en" ? "TeamHub Administration" : "Администрирование TeamHub"}
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {language === "en"
            ? "This module provides global management for all TeamHub features including teams, projects, tasks, and collaboration tools."
            : "Этот модуль предоставляет глобальное управление всеми функциями TeamHub, включая команды, проекты, задачи и инструменты совместной работы."}
        </p>
      </Card>
    </div>
  );
};

export default AdminTeamHub;
