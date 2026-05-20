import React from "react";
import { GraduationCap, Users, BookOpen, Award, FileText } from "lucide-react";
import { useLanguage } from "../../../lib/language-context";
import { Card } from "../../ui/card";

const AdminEduCRM = () => {
  const { language } = useLanguage();

  const stats = [
    { icon: Users, label: language === "en" ? "Total Groups" : "Всего групп", value: "45", color: "#4f46e5" },
    { icon: BookOpen, label: language === "en" ? "Total Courses" : "Всего курсов", value: "128", color: "#22c55e" },
    { icon: FileText, label: language === "en" ? "Total Tasks" : "Всего задач", value: "2,456", color: "#a855f7" },
    { icon: Award, label: language === "en" ? "Achievements" : "Достижения", value: "342", color: "#f59e0b" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {language === "en" ? "EduCRM Global Management" : "Глобальное управление EduCRM"}
        </h1>
        <p className="text-muted-foreground">
          {language === "en"
            ? "Manage all groups, courses, students, and educational content"
            : "Управление всеми группами, курсами, студентами и образовательным контентом"}
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
        <GraduationCap className="h-16 w-16 mx-auto mb-4 text-[#4f46e5]" />
        <h3 className="text-xl font-semibold mb-2">
          {language === "en" ? "EduCRM Administration" : "Администрирование EduCRM"}
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {language === "en"
            ? "This module provides global management for all EduCRM features including groups, courses, students, tasks, and achievements."
            : "Этот модуль предоставляет глобальное управление всеми функциями EduCRM, включая группы, курсы, студентов, задачи и достижения."}
        </p>
      </Card>
    </div>
  );
};

export default AdminEduCRM;
