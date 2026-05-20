import { useState } from "react";
import { Bell, X, Check, Mail, Calendar, Trophy, AlertCircle, MessageSquare, FileText, Clock, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { useLanguage } from "../../lib/language-context";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface Notification {
  id: string;
  type: "message" | "deadline" | "achievement" | "grade" | "event";
  title: string;
  description: string;
  time: string;
  read: boolean;
  priority?: "high" | "medium" | "low";
}

export function NotificationsDropdown() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "grade",
      title: language === "en" ? "New Grade Posted" : "Оценка опубликована",
      description: language === "en" 
        ? "Your grade for React Assignment is now available" 
        : "Ваша оценка за задание React теперь доступна",
      time: language === "en" ? "5 min ago" : "5 мин назад",
      read: false
    },
    {
      id: "2",
      type: "deadline",
      title: language === "en" ? "Deadline Reminder" : "Напоминание о сроке",
      description: language === "en"
        ? "Database Project due in 2 days"
        : "Проект базы данных через 2 дня",
      time: language === "en" ? "1 hour ago" : "1 час назад",
      read: false
    },
    {
      id: "3",
      type: "achievement",
      title: language === "en" ? "Achievement Unlocked!" : "Достижение разблокировано!",
      description: language === "en"
        ? "You've completed 10 assignments this month"
        : "Вы выполнили 10 заданий в этом месяце",
      time: language === "en" ? "3 hours ago" : "3 часа назад",
      read: false
    },
    {
      id: "4",
      type: "message",
      title: language === "en" ? "New Message" : "Новое сообщение",
      description: language === "en"
        ? "Prof. Johnson commented on your submission"
        : "Проф. Джонсон прокомментировал вашу работу",
      time: language === "en" ? "5 hours ago" : "5 часов назад",
      read: true
    },
    {
      id: "5",
      type: "event",
      title: language === "en" ? "Event Tomorrow" : "Событие завтра",
      description: language === "en"
        ? "Team meeting scheduled at 4:00 PM"
        : "Встреча команды назначена на 16:00",
      time: language === "en" ? "1 day ago" : "1 день назад",
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const t = {
    notifications: language === "en" ? "Notifications" : "Уведомления",
    markAllRead: language === "en" ? "Mark all as read" : "Отметить все прочитанными",
    noNotifications: language === "en" ? "No notifications" : "Нет уведомлений",
    viewAll: language === "en" ? "View All" : "Показать все"
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      case "deadline":
        return <AlertCircle className="h-4 w-4" />;
      case "achievement":
        return <Trophy className="h-4 w-4" />;
      case "grade":
        return <FileText className="h-4 w-4" />;
      case "event":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "message":
        return "text-blue-500";
      case "deadline":
        return "text-red-500";
      case "achievement":
        return "text-yellow-500";
      case "grade":
        return "text-green-500";
      case "event":
        return "text-purple-500";
      default:
        return "text-muted-foreground";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-background border rounded-lg shadow-lg z-50 max-h-[calc(100vh-120px)] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">{t.notifications}</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    {t.markAllRead}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>{t.noNotifications}</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-accent/50 transition-colors cursor-pointer group ${
                        !notification.read ? "bg-primary/5" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className={`p-2 h-fit rounded-lg bg-muted ${getIconColor(notification.type)}`}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-medium text-sm truncate">{notification.title}</p>
                            {!notification.read && (
                              <div className="h-2 w-2 bg-primary rounded-full shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t">
                <Button variant="ghost" className="w-full" size="sm" onClick={() => {
                  setShowAllModal(true);
                  setIsOpen(false);
                }}>
                  {t.viewAll}
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* All Notifications Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAllModal(false)}
          />

          {/* Modal */}
          <Card className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-background z-10">
            {/* Header */}
            <div className="sticky top-0 bg-background border-b p-4 sm:p-6 z-10">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl truncate">{t.notifications}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {notifications.length} {language === "en" ? "total notifications" : "всего уведомлений"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {unreadCount > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllAsRead} className="hidden sm:flex">
                      <Check className="h-4 w-4 mr-2" />
                      {t.markAllRead}
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => setShowAllModal(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead} className="sm:hidden w-full mt-3">
                  <Check className="h-4 w-4 mr-2" />
                  {t.markAllRead}
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">{t.noNotifications}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`p-3 sm:p-4 hover:shadow-md transition-all cursor-pointer group ${
                        !notification.read ? "border-primary/50 bg-primary/5" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3 sm:gap-4">
                        <div className={`p-2 sm:p-3 h-fit rounded-lg bg-muted ${getIconColor(notification.type)}`}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <h4 className="font-medium text-sm sm:text-base truncate">{notification.title}</h4>
                              {!notification.read && (
                                <Badge variant="default" className="text-xs shrink-0">
                                  {language === "en" ? "New" : "Новое"}
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                            {notification.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}