import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useLanguage } from "../../lib/language-context";
import { toast } from "sonner@2.0.3";
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Edit2,
  Save,
  X,
  Camera
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function TeamHubProfile() {
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Иван Петров",
    email: "ivan.petrov@teamhub.com",
    phone: "+7 (999) 123-45-67",
    position: "Senior Frontend Developer",
    location: "Москва, Россия",
    bio: "Опытный разработчик с 5+ летним опытом в создании веб-приложений. Специализируюсь на React, TypeScript и современных фронтенд технологиях.",
    joinDate: "2024-01-15",
    teams: 3,
    projects: 8,
    completedTasks: 142,
  });

  const t = {
    profile: language === "en" ? "Profile" : "Профиль",
    subtitle: language === "en" ? "Manage your personal information" : "Управление личной информацией",
    edit: language === "en" ? "Edit Profile" : "Редактировать профиль",
    save: language === "en" ? "Save Changes" : "Сохранить изменения",
    cancel: language === "en" ? "Cancel" : "Отмена",
    personalInfo: language === "en" ? "Personal Information" : "Личная информация",
    name: language === "en" ? "Full Name" : "Полное имя",
    email: language === "en" ? "Email" : "Email",
    phone: language === "en" ? "Phone" : "Телефон",
    position: language === "en" ? "Position" : "Должность",
    location: language === "en" ? "Location" : "Местоположение",
    bio: language === "en" ? "Bio" : "О себе",
    statistics: language === "en" ? "Statistics" : "Статистика",
    teams: language === "en" ? "Teams" : "Команды",
    projects: language === "en" ? "Projects" : "Проекты",
    completedTasks: language === "en" ? "Completed Tasks" : "Выполнено задач",
    memberSince: language === "en" ? "Member Since" : "Участник с",
    uploadPhoto: language === "en" ? "Upload Photo" : "Загрузить фото",
  };

  const handleSave = () => {
    // Here would be API call to save profile
    setIsEditing(false);
    toast.success(language === "en" ? "Data saved" : "Данные сохранены");
  };

  const stats = [
    { label: t.teams, value: profileData.teams, icon: User },
    { label: t.projects, value: profileData.projects, icon: Briefcase },
    { label: t.completedTasks, value: profileData.completedTasks, icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            {t.profile}
          </h1>
          <p className="text-muted-foreground mt-2">{t.subtitle}</p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            {t.edit}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4 mr-2" />
              {t.cancel}
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {t.save}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarFallback className="text-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  {profileData.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="text-center">
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
                {profileData.position}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                {t.memberSince}: {new Date(profileData.joinDate).toLocaleDateString(language === "en" ? "en-US" : "ru-RU", {
                  month: "long",
                  year: "numeric"
                })}
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-4">
            <h3 className="text-lg font-semibold mb-4">{t.personalInfo}</h3>
            
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t.name}
              </Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t.email}
              </Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t.phone}
              </Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="position" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {t.position}
              </Label>
              <Input
                id="position"
                value={profileData.position}
                onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t.location}
              </Label>
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">{t.bio}</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                disabled={!isEditing}
                rows={4}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t.statistics}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
