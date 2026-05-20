import { Card } from "../ui/card";
import { useLanguage } from "../../lib/language-context";
import { Settings as SettingsIcon, Globe, Bell, FileText, CheckSquare, FolderOpen, Shield, Database } from "lucide-react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function AdminModeSettingsTeamHub() {
  const { language } = useLanguage();

  const t = {
    title: language === "en" ? "TeamHub Settings" : "Настройки TeamHub",
    subtitle: language === "en" ? "Configure system settings and preferences" : "Настройка системных параметров и предпочтений",
    general: language === "en" ? "General Settings" : "Общие настройки",
    defaultTheme: language === "en" ? "Default Theme" : "Тема по умолчанию",
    language: language === "en" ? "Default Language" : "Язык по умолчанию",
    notifications: language === "en" ? "Notification Settings" : "Настройки уведомлений",
    emailNotifications: language === "en" ? "Email Notifications" : "Email уведомления",
    taskAssigned: language === "en" ? "Task Assigned" : "Назначена задача",
    projectUpdated: language === "en" ? "Project Updated" : "Обновлён проект",
    specReviewed: language === "en" ? "Specification Reviewed" : "Проверено ТЗ",
    taskSettings: language === "en" ? "Task Settings" : "Настройки задач",
    autoAssign: language === "en" ? "Auto-assign tasks" : "Автоназначение задач",
    requireEstimate: language === "en" ? "Require time estimates" : "Требовать оценку времени",
    specSettings: language === "en" ? "Specification Settings" : "Настройки ТЗ",
    versionControl: language === "en" ? "Enable version control" : "Версионирование",
    autoSave: language === "en" ? "Auto-save drafts" : "Автосохранение черновиков",
    fileSettings: language === "en" ? "File Settings" : "Настройки файлов",
    maxFileSize: language === "en" ? "Max file size (MB)" : "Макс. размер файла (МБ)",
    storageQuota: language === "en" ? "Storage quota per team (GB)" : "Квота хранилища на команду (ГБ)",
    roleSettings: language === "en" ? "Role Settings" : "Настройки ролей",
    customRoles: language === "en" ? "Allow custom roles" : "Разрешить пользовательские роли",
    roleHierarchy: language === "en" ? "Enforce role hierarchy" : "Использовать иерархию ролей",
    integrations: language === "en" ? "Integrations" : "Интеграции",
    telegramBot: language === "en" ? "Telegram Bot" : "Telegram-бот",
    webhooks: language === "en" ? "Webhooks" : "Вебхуки",
    apiAccess: language === "en" ? "API Access" : "Доступ к API",
    save: language === "en" ? "Save Changes" : "Сохранить изменения",
    light: language === "en" ? "Light" : "Светлая",
    dark: language === "en" ? "Dark" : "Тёмная",
    system: language === "en" ? "System" : "Системная",
    english: language === "en" ? "English" : "Английский",
    russian: language === "en" ? "Russian" : "Русский",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
              <Globe className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">{t.general}</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">{t.defaultTheme}</Label>
              <Select defaultValue="system">
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t.light}</SelectItem>
                  <SelectItem value="dark">{t.dark}</SelectItem>
                  <SelectItem value="system">{t.system}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">{t.language}</Label>
              <Select defaultValue="ru">
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t.english}</SelectItem>
                  <SelectItem value="ru">{t.russian}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white">
              <Bell className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">{t.notifications}</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="cursor-pointer">{t.emailNotifications}</Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="task-assigned" className="cursor-pointer">{t.taskAssigned}</Label>
              <Switch id="task-assigned" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="project-updated" className="cursor-pointer">{t.projectUpdated}</Label>
              <Switch id="project-updated" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="spec-reviewed" className="cursor-pointer">{t.specReviewed}</Label>
              <Switch id="spec-reviewed" defaultChecked />
            </div>
          </div>
        </Card>

        {/* Task Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
              <CheckSquare className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">{t.taskSettings}</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-assign" className="cursor-pointer">{t.autoAssign}</Label>
              <Switch id="auto-assign" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="require-estimate" className="cursor-pointer">{t.requireEstimate}</Label>
              <Switch id="require-estimate" defaultChecked />
            </div>
          </div>
        </Card>

        {/* Specification Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">{t.specSettings}</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="version-control" className="cursor-pointer">{t.versionControl}</Label>
              <Switch id="version-control" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save" className="cursor-pointer">{t.autoSave}</Label>
              <Switch id="auto-save" defaultChecked />
            </div>
          </div>
        </Card>

        {/* File Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white">
              <FolderOpen className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">{t.fileSettings}</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max-file-size">{t.maxFileSize}</Label>
              <Input id="max-file-size" type="number" defaultValue="50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage-quota">{t.storageQuota}</Label>
              <Input id="storage-quota" type="number" defaultValue="10" />
            </div>
          </div>
        </Card>

        {/* Role Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-white">
              <Shield className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">{t.roleSettings}</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="custom-roles" className="cursor-pointer">{t.customRoles}</Label>
              <Switch id="custom-roles" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="role-hierarchy" className="cursor-pointer">{t.roleHierarchy}</Label>
              <Switch id="role-hierarchy" defaultChecked />
            </div>
          </div>
        </Card>

        {/* Integrations */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white">
              <Database className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">{t.integrations}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="telegram-bot" className="cursor-pointer">{t.telegramBot}</Label>
              <Switch id="telegram-bot" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="webhooks" className="cursor-pointer">{t.webhooks}</Label>
              <Switch id="webhooks" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="api-access" className="cursor-pointer">{t.apiAccess}</Label>
              <Switch id="api-access" defaultChecked />
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
          <SettingsIcon className="h-4 w-4" />
          {t.save}
        </Button>
      </div>
    </div>
  );
}
