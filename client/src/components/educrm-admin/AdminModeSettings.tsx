import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Settings as SettingsIcon, Bell, Calendar, TrendingUp, FileText, Zap, Globe } from "lucide-react";
import { useLanguage } from "../../lib/language-context";

export function AdminModeSettings() {
  const { language } = useLanguage();
  const [settings, setSettings] = useState({
    defaultTheme: "system",
    enableNotifications: true,
    notifyOnNewTask: true,
    notifyOnDeadline: true,
    notifyOnAchievement: true,
    deadlineWarningDays: 3,
    showProgressBars: true,
    showLeaderboards: true,
    enableTelegramBot: false,
    telegramBotToken: "",
    maxFileSize: 10,
    maxFilesPerUser: 100,
    autoAssignCourses: false,
    requireCourseApproval: true,
    enableGamification: true,
  });

  const t = {
    title: language === "en" ? "EduCRM Settings" : "Настройки EduCRM",
    subtitle: language === "en" ? "Configure EduCRM system settings" : "Конфигурация системных настроек EduCRM",
    appearance: language === "en" ? "Appearance" : "Внешний вид",
    notifications: language === "en" ? "Notifications" : "Уведомления",
    deadlines: language === "en" ? "Deadlines" : "Дедлайны",
    display: language === "en" ? "Display" : "Отображение",
    integrations: language === "en" ? "Integrations" : "Интеграции",
    files: language === "en" ? "Files" : "Файлы",
    courses: language === "en" ? "Courses" : "Курсы",
    defaultTheme: language === "en" ? "Default Theme" : "Тема по умолчанию",
    light: language === "en" ? "Light" : "Светлая",
    dark: language === "en" ? "Dark" : "Темная",
    system: language === "en" ? "System" : "Системная",
    enableNotifications: language === "en" ? "Enable Notifications" : "Включить уведомления",
    notifyNewTask: language === "en" ? "Notify on new task" : "Уведомлять о новых задачах",
    notifyDeadline: language === "en" ? "Notify before deadline" : "Уведомлять о дедлайнах",
    notifyAchievement: language === "en" ? "Notify on achievement" : "Уведомлять о достижениях",
    deadlineWarningDays: language === "en" ? "Deadline warning (days)" : "Предупреждение о дедлайне (дней)",
    showProgressBars: language === "en" ? "Show progress bars" : "Показывать прогресс-бары",
    showLeaderboards: language === "en" ? "Show leaderboards" : "Показывать рейтинги",
    enableTelegramBot: language === "en" ? "Enable Telegram Bot" : "Включить Telegram-бота",
    telegramBotToken: language === "en" ? "Telegram Bot Token" : "Токен Telegram-бота",
    maxFileSize: language === "en" ? "Max file size (MB)" : "Макс. размер файла (МБ)",
    maxFilesPerUser: language === "en" ? "Max files per user" : "Макс. файлов на пользователя",
    autoAssignCourses: language === "en" ? "Auto-assign courses" : "Автоматически назначать курсы",
    requireApproval: language === "en" ? "Require course approval" : "Требовать одобрение курса",
    enableGamification: language === "en" ? "Enable gamification" : "Включить геймификацию",
    saveChanges: language === "en" ? "Save Changes" : "Сохранить изменения",
    changesSaved: language === "en" ? "Settings saved successfully" : "Настройки успешно сохранены",
  };

  const handleSaveSettings = () => {
    console.log("Settings saved:", settings);
    alert(t.changesSaved);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t.appearance}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">{t.defaultTheme}</Label>
              <Select 
                value={settings.defaultTheme} 
                onValueChange={(value) => setSettings({ ...settings, defaultTheme: value })}
              >
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
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t.notifications}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-notif">{t.enableNotifications}</Label>
              <Switch
                id="enable-notif"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-task">{t.notifyNewTask}</Label>
              <Switch
                id="notif-task"
                checked={settings.notifyOnNewTask}
                onCheckedChange={(checked) => setSettings({ ...settings, notifyOnNewTask: checked })}
                disabled={!settings.enableNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-deadline">{t.notifyDeadline}</Label>
              <Switch
                id="notif-deadline"
                checked={settings.notifyOnDeadline}
                onCheckedChange={(checked) => setSettings({ ...settings, notifyOnDeadline: checked })}
                disabled={!settings.enableNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-achievement">{t.notifyAchievement}</Label>
              <Switch
                id="notif-achievement"
                checked={settings.notifyOnAchievement}
                onCheckedChange={(checked) => setSettings({ ...settings, notifyOnAchievement: checked })}
                disabled={!settings.enableNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Deadline Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t.deadlines}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deadline-days">{t.deadlineWarningDays}</Label>
              <Input
                id="deadline-days"
                type="number"
                min="1"
                max="30"
                value={settings.deadlineWarningDays}
                onChange={(e) => setSettings({ ...settings, deadlineWarningDays: parseInt(e.target.value) || 3 })}
              />
              <p className="text-xs text-muted-foreground">
                {language === "en" 
                  ? "Number of days before deadline to send warning" 
                  : "Количество дней до дедлайна для отправки предупреждения"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t.display}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="progress-bars">{t.showProgressBars}</Label>
              <Switch
                id="progress-bars"
                checked={settings.showProgressBars}
                onCheckedChange={(checked) => setSettings({ ...settings, showProgressBars: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="leaderboards">{t.showLeaderboards}</Label>
              <Switch
                id="leaderboards"
                checked={settings.showLeaderboards}
                onCheckedChange={(checked) => setSettings({ ...settings, showLeaderboards: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="gamification">{t.enableGamification}</Label>
              <Switch
                id="gamification"
                checked={settings.enableGamification}
                onCheckedChange={(checked) => setSettings({ ...settings, enableGamification: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {t.integrations}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="telegram-bot">{t.enableTelegramBot}</Label>
              <Switch
                id="telegram-bot"
                checked={settings.enableTelegramBot}
                onCheckedChange={(checked) => setSettings({ ...settings, enableTelegramBot: checked })}
              />
            </div>
            {settings.enableTelegramBot && (
              <div className="space-y-2">
                <Label htmlFor="telegram-token">{t.telegramBotToken}</Label>
                <Input
                  id="telegram-token"
                  type="password"
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  value={settings.telegramBotToken}
                  onChange={(e) => setSettings({ ...settings, telegramBotToken: e.target.value })}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* File Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t.files}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max-file-size">{t.maxFileSize}</Label>
              <Input
                id="max-file-size"
                type="number"
                min="1"
                max="100"
                value={settings.maxFileSize}
                onChange={(e) => setSettings({ ...settings, maxFileSize: parseInt(e.target.value) || 10 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-files">{t.maxFilesPerUser}</Label>
              <Input
                id="max-files"
                type="number"
                min="10"
                max="1000"
                value={settings.maxFilesPerUser}
                onChange={(e) => setSettings({ ...settings, maxFilesPerUser: parseInt(e.target.value) || 100 })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Course Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              {t.courses}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-assign">{t.autoAssignCourses}</Label>
              <Switch
                id="auto-assign"
                checked={settings.autoAssignCourses}
                onCheckedChange={(checked) => setSettings({ ...settings, autoAssignCourses: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="require-approval">{t.requireApproval}</Label>
              <Switch
                id="require-approval"
                checked={settings.requireCourseApproval}
                onCheckedChange={(checked) => setSettings({ ...settings, requireCourseApproval: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 text-white"
        >
          {t.saveChanges}
        </Button>
      </div>
    </div>
  );
}
