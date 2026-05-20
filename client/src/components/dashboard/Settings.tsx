import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { useTheme } from "../../lib/theme-context";
import { useLanguage } from "../../lib/language-context";
import { Settings as SettingsIcon, HelpCircle, Globe, Bell, Moon, Sun, CheckCircle, Info } from "lucide-react";

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const t = {
    title: language === "en" ? "Settings" : "Настройки",
    subtitle: language === "en" ? "Manage your account settings and preferences" : "Управление настройками аккаунта и предпочтениями",
    general: language === "en" ? "General" : "Общие",
    notifications: language === "en" ? "Notifications" : "Уведомления",
    support: language === "en" ? "Support" : "Поддержка",
    updates: language === "en" ? "Updates" : "Обновления",
    
    // Appearance
    appearance: language === "en" ? "Appearance" : "Внешний вид",
    appearanceDesc: language === "en" ? "Customize how EduCRM looks for you" : "Настройте внешний вид EduCRM",
    darkMode: language === "en" ? "Dark Mode" : "Темная тема",
    darkModeDesc: language === "en" ? "Switch between light and dark themes" : "Переключение между светлой и темной темами",
    currentTheme: language === "en" ? "Current theme:" : "Текущая тема:",
    
    // Language
    languageRegion: language === "en" ? "Language & Region" : "Язык и регион",
    languageRegionDesc: language === "en" ? "Set your preferred language and regional settings" : "Установите предпочитаемый язык и региональные настройки",
    displayLanguage: language === "en" ? "Display Language" : "Язык интерфейса",
    timeZone: language === "en" ? "Time Zone" : "Часовой пояс",
    dateFormat: language === "en" ? "Date Format" : "Формат даты",
    
    // Display
    displayPreferences: language === "en" ? "Display Preferences" : "Настройки отображения",
    displayPreferencesDesc: language === "en" ? "Control what information is displayed" : "Управление отображаемой информацией",
    compactMode: language === "en" ? "Compact Mode" : "Компактный режим",
    compactModeDesc: language === "en" ? "Show more content by reducing spacing" : "Показать больше контента, уменьшив расстояния",
    showAnimations: language === "en" ? "Show Animations" : "Показывать анимации",
    showAnimationsDesc: language === "en" ? "Enable smooth transitions and animations" : "Включить плавные переходы и анимации",
    
    // Notifications
    notificationPreferences: language === "en" ? "Notification Preferences" : "Настройки уведомлений",
    notificationPreferencesDesc: language === "en" ? "Choose what notifications you want to receive" : "Выберите, какие уведомления вы хотите получать",
    emailNotifications: language === "en" ? "Email Notifications" : "Email уведомления",
    emailNotificationsDesc: language === "en" ? "Receive updates via email" : "Получать обновления по email",
    taskReminders: language === "en" ? "Task Reminders" : "Напоминания о задачах",
    taskRemindersDesc: language === "en" ? "Get reminded about upcoming deadlines" : "Получать напоминания о приближающихся дедлайнах",
    groupUpdates: language === "en" ? "Group Updates" : "Обновления группы",
    groupUpdatesDesc: language === "en" ? "Notifications when group members post" : "Уведомления при публикациях участников группы",
    gradeUpdates: language === "en" ? "Grade Updates" : "Обновления оценок",
    gradeUpdatesDesc: language === "en" ? "Get notified when grades are posted" : "Уведомления при публикации оценок",
    announcements: language === "en" ? "Announcements" : "Объявления",
    announcementsDesc: language === "en" ? "Receive school-wide announcements" : "Получать объявления для всей школы",
    teamInvitations: language === "en" ? "Team Invitations" : "Приглашения в команды",
    teamInvitationsDesc: language === "en" ? "Alerts for team invitation requests" : "Оповещения о приглашениях в команды",
    
    // Support
    contactSupport: language === "en" ? "Contact Technical Support" : "Связаться с технической поддержкой",
    contactSupportDesc: language === "en" ? "Having issues? Our support team is here to help" : "Есть проблемы? Наша команда поддержки здесь, чтобы помочь",
    subject: language === "en" ? "Subject" : "Тема",
    selectTopic: language === "en" ? "Select a topic" : "Выберите тему",
    technicalIssue: language === "en" ? "Technical Issue" : "Техническая проблема",
    accountProblem: language === "en" ? "Account Problem" : "Проблема с аккаунтом",
    featureRequest: language === "en" ? "Feature Request" : "Запрос функции",
    bugReport: language === "en" ? "Bug Report" : "Сообщение об ошибке",
    other: language === "en" ? "Other" : "Другое",
    message: language === "en" ? "Message" : "Сообщение",
    messagePlaceholder: language === "en" ? "Describe your issue or question in detail..." : "Опишите вашу проблему или вопрос подробно...",
    submitRequest: language === "en" ? "Submit Support Request" : "Отправить запрос в поддержку",
    resources: language === "en" ? "Resources" : "Ресурсы",
    helpCenter: language === "en" ? "Help Center" : "Центр помощи",
    faqs: language === "en" ? "FAQs" : "Часто задаваемые вопросы",
    communityForum: language === "en" ? "Community Forum" : "Форум сообщества",
    
    // Updates
    upToDate: language === "en" ? "You're up to date!" : "У вас последняя версия!",
    lastChecked: language === "en" ? "Last checked:" : "Последняя проверка:",
    checkForUpdates: language === "en" ? "Check for Updates" : "Проверить обновления",
    releaseHistory: language === "en" ? "Release History" : "История релизов",
    version: language === "en" ? "Version" : "Версия",
    feature: language === "en" ? "feature" : "функция",
    bugfix: language === "en" ? "bugfix" : "исправление",
    automaticUpdates: language === "en" ? "Automatic Updates" : "Автоматические обновления",
    automaticUpdatesDesc: language === "en" ? "Keep EduCRM up to date automatically" : "Автоматически обновлять EduCRM",
    autoUpdate: language === "en" ? "Auto-update" : "Автообновление",
    autoUpdateDesc: language === "en" ? "Automatically install updates when available" : "Автоматически устанавливать обновления",
    betaFeatures: language === "en" ? "Beta Features" : "Бета-функции",
    betaFeaturesDesc: language === "en" ? "Get early access to new features" : "Получать ранний доступ к новым функциям"
  };

  const updates = [
    {
      version: "2.5.0",
      date: language === "en" ? "Dec 1, 2024" : "1 дек, 2024",
      type: "feature" as const,
      changes: language === "en" ? [
        "Added dark mode support",
        "New team collaboration features",
        "Enhanced file upload functionality",
        "Improved performance and loading times"
      ] : [
        "Добавлена поддержка темной темы",
        "Новые функции совместной работы команды",
        "Улучшенная функциональность загрузки файлов",
        "Улучшенная производительность и время загрузки"
      ]
    },
    {
      version: "2.4.1",
      date: language === "en" ? "Nov 15, 2024" : "15 ноя, 2024",
      type: "bugfix" as const,
      changes: language === "en" ? [
        "Fixed calendar sync issues",
        "Resolved notification display bugs",
        "Improved mobile responsiveness"
      ] : [
        "Исправлены проблемы синхронизации календаря",
        "Решены ошибки отображения уведомлений",
        "Улучшена адаптивность для мобильных устройств"
      ]
    },
    {
      version: "2.4.0",
      date: language === "en" ? "Nov 1, 2024" : "1 ноя, 2024",
      type: "feature" as const,
      changes: language === "en" ? [
        "Introduced portfolio section",
        "Added achievement tracking",
        "New analytics dashboard",
        "Enhanced group management"
      ] : [
        "Введен раздел портфолио",
        "Добавлено отслеживание достижений",
        "Новая панель аналитики",
        "Улучшенное управление группами"
      ]
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6 max-w-[1800px] mx-auto">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl">{t.title}</h2>
        <p className="text-muted-foreground text-sm sm:text-base">{t.subtitle}</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">{t.general}</TabsTrigger>
          <TabsTrigger value="notifications">{t.notifications}</TabsTrigger>
          <TabsTrigger value="support">{t.support}</TabsTrigger>
          <TabsTrigger value="updates">{t.updates}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                {t.appearance}
              </CardTitle>
              <CardDescription>{t.appearanceDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.darkMode}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.darkModeDesc}
                  </p>
                </div>
                <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {t.currentTheme} <strong className="capitalize">{theme === "dark" ? (language === "en" ? "dark" : "темная") : (language === "en" ? "light" : "светлая")}</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t.languageRegion}
              </CardTitle>
              <CardDescription>{t.languageRegionDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">{t.displayLanguage}</Label>
                <Select defaultValue={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">{t.timeZone}</Label>
                <Select defaultValue="est">
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="est">{language === "en" ? "Eastern Time (ET)" : "Восточное время (ET)"}</SelectItem>
                    <SelectItem value="cst">{language === "en" ? "Central Time (CT)" : "Центральное время (CT)"}</SelectItem>
                    <SelectItem value="mst">{language === "en" ? "Mountain Time (MT)" : "Горное время (MT)"}</SelectItem>
                    <SelectItem value="pst">{language === "en" ? "Pacific Time (PT)" : "Тихоокеанское время (PT)"}</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">{t.dateFormat}</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger id="dateFormat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                {t.displayPreferences}
              </CardTitle>
              <CardDescription>{t.displayPreferencesDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.compactMode}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.compactModeDesc}
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.showAnimations}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.showAnimationsDesc}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t.notificationPreferences}
              </CardTitle>
              <CardDescription>{t.notificationPreferencesDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.emailNotifications}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.emailNotificationsDesc}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.taskReminders}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.taskRemindersDesc}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.groupUpdates}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.groupUpdatesDesc}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.gradeUpdates}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.gradeUpdatesDesc}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.announcements}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.announcementsDesc}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.teamInvitations}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.teamInvitationsDesc}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                {t.contactSupport}
              </CardTitle>
              <CardDescription>
                {t.contactSupportDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">{t.subject}</Label>
                <Select>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder={t.selectTopic} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">{t.technicalIssue}</SelectItem>
                    <SelectItem value="account">{t.accountProblem}</SelectItem>
                    <SelectItem value="feature">{t.featureRequest}</SelectItem>
                    <SelectItem value="bug">{t.bugReport}</SelectItem>
                    <SelectItem value="other">{t.other}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">{t.message}</Label>
                <Textarea
                  id="message"
                  placeholder={t.messagePlaceholder}
                  rows={6}
                />
              </div>
              <Button className="w-full">
                <HelpCircle className="mr-2 h-4 w-4" />
                {t.submitRequest}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.resources}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Info className="mr-2 h-4 w-4" />
                {t.helpCenter}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <HelpCircle className="mr-2 h-4 w-4" />
                {t.faqs}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="mr-2 h-4 w-4" />
                {t.communityForum}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                {t.upToDate}
              </CardTitle>
              <CardDescription>
                EduCRM v{updates[0].version} • {t.lastChecked} {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">{t.checkForUpdates}</Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3>{t.releaseHistory}</h3>
            {updates.map((update, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{t.version} {update.version}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={update.type === "feature" ? "default" : "secondary"}>
                        {t[update.type]}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{update.date}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {update.changes.map((change, changeIndex) => (
                      <li key={changeIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t.automaticUpdates}</CardTitle>
              <CardDescription>{t.automaticUpdatesDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.autoUpdate}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.autoUpdateDesc}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.betaFeatures}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.betaFeaturesDesc}
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
