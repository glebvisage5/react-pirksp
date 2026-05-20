import React from "react";
import {
  Settings,
  Globe,
  Moon,
  Mail,
  Shield,
  Database,
  Zap,
  Bell,
  Users
} from "lucide-react";
import { useLanguage } from "../../../lib/language-context";
import { Card } from "../../ui/card";
import { Switch } from "../../ui/switch";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

const AdminSettings = () => {
  const { language } = useLanguage();

  const settingSections = [
    {
      title: language === "en" ? "General Settings" : "Общие настройки",
      icon: Settings,
      color: "#4f46e5",
      settings: [
        {
          label: language === "en" ? "Platform Name" : "Название платформы",
          type: "input",
          value: "Avis"
        },
        {
          label: language === "en" ? "Default Language" : "Язык по умолчанию",
          type: "select",
          value: "Russian",
          options: ["English", "Russian"]
        },
        {
          label: language === "en" ? "Default Theme" : "Тема по умолчанию",
          type: "select",
          value: "Dark",
          options: ["Light", "Dark", "System"]
        },
        {
          label: language === "en" ? "Time Zone" : "Часовой пояс",
          type: "select",
          value: "Europe/Moscow",
          options: ["UTC", "Europe/Moscow", "America/New_York"]
        }
      ]
    },
    {
      title: language === "en" ? "Security Settings" : "Настройки безопасности",
      icon: Shield,
      color: "#ef4444",
      settings: [
        {
          label: language === "en" ? "Two-Factor Authentication" : "Двухфакторная аутентификация",
          type: "switch",
          value: true
        },
        {
          label: language === "en" ? "Password Expiration (days)" : "Срок действия пароля (дни)",
          type: "input",
          value: "90"
        },
        {
          label: language === "en" ? "Maximum Login Attempts" : "Макс. попыток входа",
          type: "input",
          value: "5"
        },
        {
          label: language === "en" ? "Session Timeout (minutes)" : "Таймаут сессии (минуты)",
          type: "input",
          value: "60"
        }
      ]
    },
    {
      title: language === "en" ? "Email Settings" : "Настройки Email",
      icon: Mail,
      color: "#22c55e",
      settings: [
        {
          label: language === "en" ? "Email Notifications" : "Email уведомления",
          type: "switch",
          value: true
        },
        {
          label: language === "en" ? "SMTP Server" : "SMTP сервер",
          type: "input",
          value: "smtp.example.com"
        },
        {
          label: language === "en" ? "SMTP Port" : "SMTP порт",
          type: "input",
          value: "587"
        },
        {
          label: language === "en" ? "From Email" : "Email отправителя",
          type: "input",
          value: "noreply@innovatecrm.com"
        }
      ]
    },
    {
      title: language === "en" ? "Integration Settings" : "Настройки интеграций",
      icon: Zap,
      color: "#a855f7",
      settings: [
        {
          label: "Telegram Bot",
          type: "switch",
          value: false
        },
        {
          label: "GitHub Integration",
          type: "switch",
          value: true
        },
        {
          label: "Google OAuth",
          type: "switch",
          value: true
        },
        {
          label: "Slack Notifications",
          type: "switch",
          value: false
        }
      ]
    },
    {
      title: language === "en" ? "System Limits" : "Системные ограничения",
      icon: Database,
      color: "#f59e0b",
      settings: [
        {
          label: language === "en" ? "Max File Size (MB)" : "Макс. размер файла (МБ)",
          type: "input",
          value: "50"
        },
        {
          label: language === "en" ? "Max Users per Group" : "Макс. пользователей в группе",
          type: "input",
          value: "100"
        },
        {
          label: language === "en" ? "Max Tasks per User" : "Макс. задач на пользователя",
          type: "input",
          value: "500"
        },
        {
          label: language === "en" ? "Storage Quota (GB)" : "Квота хранилища (ГБ)",
          type: "input",
          value: "1000"
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {language === "en" ? "Platform Settings" : "Настройки платформы"}
        </h1>
        <p className="text-muted-foreground">
          {language === "en"
            ? "Configure global platform settings and preferences"
            : "Настройка глобальных параметров и предпочтений платформы"}
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index} className="overflow-hidden">
              <div className="p-6 border-b bg-muted/30">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${section.color}20` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: section.color }} />
                  </div>
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {section.settings.map((setting, settingIndex) => (
                  <div
                    key={settingIndex}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <label className="font-medium">{setting.label}</label>
                    {setting.type === "switch" ? (
                      <Switch 
                        checked={setting.value as boolean}
                        onCheckedChange={() => {
                          // Handle switch change
                          console.log("Switch toggled");
                        }}
                      />
                    ) : setting.type === "select" ? (
                      <select
                        className="px-4 py-2 rounded-md border bg-background"
                        value={setting.value as string}
                        onChange={(e) => {
                          // Handle select change
                          console.log("Select changed to:", e.target.value);
                        }}
                      >
                        {setting.options?.map((option, optionIndex) => (
                          <option key={optionIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        className="w-64"
                        value={setting.value as string}
                        onChange={(e) => {
                          // Handle input change
                          console.log("Input changed to:", e.target.value);
                        }}
                        type={
                          setting.label.includes("Password") ||
                          setting.label.includes("пароля")
                            ? "password"
                            : "text"
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">
          {language === "en" ? "Reset to Default" : "Сбросить по умолчанию"}
        </Button>
        <Button
          style={{
            background: "linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)",
            color: "white"
          }}
        >
          {language === "en" ? "Save Changes" : "Сохранить изменения"}
        </Button>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <div className="p-6 bg-red-50 dark:bg-red-950/20">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
            {language === "en" ? "Danger Zone" : "Опасная зона"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {language === "en"
              ? "These actions cannot be undone. Please be careful."
              : "Эти действия необратимы. Будьте осторожны."}
          </p>
          <div className="flex gap-4">
            <Button variant="destructive">
              {language === "en" ? "Clear All Logs" : "Очистить все логи"}
            </Button>
            <Button variant="destructive">
              {language === "en" ? "Reset Platform" : "Сбросить платформу"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettings;
