import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { useLanguage } from "../../lib/language-context";
import { useTheme } from "../../lib/theme-context";
import { toast } from "sonner@2.0.3";
import { 
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Mail,
  MessageSquare,
  Save
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function TeamHubSettings() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskUpdates: true,
    teamInvites: true,
    projectUpdates: false,
    weeklyDigest: true,
  });

  const t = {
    settings: language === "en" ? "Settings" : "Настройки",
    subtitle: language === "en" ? "Manage your preferences" : "Управление настройками",
    appearance: language === "en" ? "Appearance" : "Внешний вид",
    theme: language === "en" ? "Theme" : "Тема",
    themeDesc: language === "en" ? "Choose your preferred theme" : "Выберите предпочитаемую тему",
    light: language === "en" ? "Light" : "Светлая",
    dark: language === "en" ? "Dark" : "Темная",
    system: language === "en" ? "System" : "Системная",
    languageLabel: language === "en" ? "Language" : "Язык",
    languageDesc: language === "en" ? "Choose your preferred language" : "Выберите предпочитаемый язык",
    english: language === "en" ? "English" : "Английский",
    russian: language === "en" ? "Russian" : "Русский",
    notifications: language === "en" ? "Notifications" : "Уведомления",
    notificationsDesc: language === "en" ? "Manage how you receive notifications" : "Управление получением уведомлений",
    emailNotifications: language === "en" ? "Email Notifications" : "Email уведомления",
    emailNotificationsDesc: language === "en" ? "Receive notifications via email" : "Получать уведомления на email",
    pushNotifications: language === "en" ? "Push Notifications" : "Push уведомления",
    pushNotificationsDesc: language === "en" ? "Receive push notifications in browser" : "Получать push уведомления в браузере",
    taskUpdates: language === "en" ? "Task Updates" : "Обновления задач",
    taskUpdatesDesc: language === "en" ? "Get notified about task changes" : "Получать уведомления об изменениях задач",
    teamInvites: language === "en" ? "Team Invites" : "Приглашения в команды",
    teamInvitesDesc: language === "en" ? "Get notified about team invitations" : "Получать уведомления о приглашениях в команды",
    projectUpdates: language === "en" ? "Project Updates" : "Обновления проектов",
    projectUpdatesDesc: language === "en" ? "Get notified about project changes" : "Получать уведомления об изменениях проектов",
    weeklyDigest: language === "en" ? "Weekly Digest" : "Еженедельная сводка",
    weeklyDigestDesc: language === "en" ? "Receive weekly summary of activities" : "Получать еженедельную сводку активности",
    privacy: language === "en" ? "Privacy & Security" : "Конфиденциальность и безопасность",
    privacyDesc: language === "en" ? "Manage your privacy settings" : "Управление настройками конфиденциальности",
    saveChanges: language === "en" ? "Save Changes" : "Сохранить изменения",
    changesSaved: language === "en" ? "Changes saved successfully!" : "Изменения успешно сохранены!",
  };

  const handleSave = () => {
    // Here would be API call to save settings
    toast.success(language === "en" ? "Data saved" : "Данные сохранены");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          {t.settings}
        </h1>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {/* Appearance Settings */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
            {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{t.appearance}</h2>
            <p className="text-sm text-muted-foreground">{t.themeDesc}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">{t.theme}</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t.light}</SelectItem>
                <SelectItem value="dark">{t.dark}</SelectItem>
                <SelectItem value="system">{t.system}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="language">{t.languageLabel}</Label>
            </div>
            <Select value={language} onValueChange={(value: "en" | "ru") => setLanguage(value)}>
              <SelectTrigger className="w-[180px]">
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

      {/* Notifications Settings */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <Bell className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{t.notifications}</h2>
            <p className="text-sm text-muted-foreground">{t.notificationsDesc}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Mail className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <Label htmlFor="email-notifications">{t.emailNotifications}</Label>
                <p className="text-sm text-muted-foreground">{t.emailNotificationsDesc}</p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-start gap-3 flex-1">
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <Label htmlFor="push-notifications">{t.pushNotifications}</Label>
                <p className="text-sm text-muted-foreground">{t.pushNotificationsDesc}</p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
            />
          </div>

          {/* Task Updates */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex-1">
              <Label htmlFor="task-updates">{t.taskUpdates}</Label>
              <p className="text-sm text-muted-foreground">{t.taskUpdatesDesc}</p>
            </div>
            <Switch
              id="task-updates"
              checked={settings.taskUpdates}
              onCheckedChange={(checked) => setSettings({ ...settings, taskUpdates: checked })}
            />
          </div>

          {/* Team Invites */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex-1">
              <Label htmlFor="team-invites">{t.teamInvites}</Label>
              <p className="text-sm text-muted-foreground">{t.teamInvitesDesc}</p>
            </div>
            <Switch
              id="team-invites"
              checked={settings.teamInvites}
              onCheckedChange={(checked) => setSettings({ ...settings, teamInvites: checked })}
            />
          </div>

          {/* Project Updates */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex-1">
              <Label htmlFor="project-updates">{t.projectUpdates}</Label>
              <p className="text-sm text-muted-foreground">{t.projectUpdatesDesc}</p>
            </div>
            <Switch
              id="project-updates"
              checked={settings.projectUpdates}
              onCheckedChange={(checked) => setSettings({ ...settings, projectUpdates: checked })}
            />
          </div>

          {/* Weekly Digest */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex-1">
              <Label htmlFor="weekly-digest">{t.weeklyDigest}</Label>
              <p className="text-sm text-muted-foreground">{t.weeklyDigestDesc}</p>
            </div>
            <Switch
              id="weekly-digest"
              checked={settings.weeklyDigest}
              onCheckedChange={(checked) => setSettings({ ...settings, weeklyDigest: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{t.privacy}</h2>
            <p className="text-sm text-muted-foreground">{t.privacyDesc}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {language === "en" 
            ? "Privacy and security settings will be available in the next update." 
            : "Настройки конфиденциальности и безопасности будут доступны в следующем обновлении."}
        </p>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          {t.saveChanges}
        </Button>
      </div>
    </div>
  );
}
