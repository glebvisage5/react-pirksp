import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { useLanguage } from "../../lib/language-context";
import { User, Mail, Phone, MapPin, Calendar, Upload, Plus, Trophy, Github, Linkedin, Twitter, Globe, Edit, Trash2, Award } from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: React.ReactNode;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  url: string;
  date: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "award" | "certificate" | "milestone";
}

export function Profile() {
  const { language } = useLanguage();
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddAchievementOpen, setIsAddAchievementOpen] = useState(false);
  const [isAddSocialLinkOpen, setIsAddSocialLinkOpen] = useState(false);
  const [isEditSocialLinkOpen, setIsEditSocialLinkOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isEditAchievementOpen, setIsEditAchievementOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const t = {
    profile: language === "en" ? "Profile" : "Профиль",
    subtitle: language === "en" ? "Manage your personal information and portfolio" : "Управление личной информацией и портфолио",
    joined: language === "en" ? "Joined" : "Присоединился",
    personalInfo: language === "en" ? "Personal Info" : "Личная информация",
    socialLinks: language === "en" ? "Social Links" : "Социальные сети",
    portfolio: language === "en" ? "Portfolio" : "Портфолио",
    achievements: language === "en" ? "Achievements" : "Достижения",
    personalInformation: language === "en" ? "Personal Information" : "Личная информация",
    edit: language === "en" ? "Edit" : "Редактировать",
    cancel: language === "en" ? "Cancel" : "Отмена",
    fullName: language === "en" ? "Full Name" : "Полное имя",
    email: language === "en" ? "Email" : "Эл. почта",
    phone: language === "en" ? "Phone" : "Телефон",
    location: language === "en" ? "Location" : "Местоположение",
    bio: language === "en" ? "Bio" : "О себе",
    saveChanges: language === "en" ? "Save Changes" : "Сохранить изменения",
    addLink: language === "en" ? "Add Link" : "Добавить ссылку",
    addNewSocialLink: language === "en" ? "Add New Social Link" : "Добавить социальную сеть",
    connectSocialMedia: language === "en" ? "Connect with your social media profiles" : "Подключите ваши профили в социальных сетях",
    platform: language === "en" ? "Platform" : "Платформа",
    url: language === "en" ? "URL" : "URL",
    addProject: language === "en" ? "Add Project" : "Добавить проект",
    addNewProject: language === "en" ? "Add New Project" : "Добавить новый проект",
    showcaseWork: language === "en" ? "Showcase your work in your portfolio" : "Покажите свою работу в портфолио",
    projectTitle: language === "en" ? "Project Title" : "Название проекта",
    description: language === "en" ? "Description" : "Описание",
    technologies: language === "en" ? "Technologies (comma-separated)" : "Технологии (через запятую)",
    projectUrl: language === "en" ? "Project URL" : "URL проекта",
    date: language === "en" ? "Date" : "Дата",
    addAchievement: language === "en" ? "Add Achievement" : "Добавить достижение",
    addNewAchievement: language === "en" ? "Add New Achievement" : "Добавить новое достижение",
    recordAccomplishments: language === "en" ? "Record your accomplishments" : "Запишите свои достижения",
    title: language === "en" ? "Title" : "Название",
    editSocialLink: language === "en" ? "Edit Social Link" : "Редактировать ссылку",
    updateSocialMedia: language === "en" ? "Update your social media profile" : "Обновите профиль в социальной сети",
    editProject: language === "en" ? "Edit Project" : "Редактировать проект",
    updateProjectDetails: language === "en" ? "Update your project details" : "Обновите детали проекта",
    editAchievement: language === "en" ? "Edit Achievement" : "Редактировать достижение",
    updateAchievement: language === "en" ? "Update your achievement details" : "Обновите детали достижения",
    type: language === "en" ? "Type" : "Тип",
    award: language === "en" ? "Award" : "Награда",
    certificate: language === "en" ? "Certificate" : "Сертификат",
    milestone: language === "en" ? "Milestone" : "Вeха"
  };

  const [personalInfo, setPersonalInfo] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Passionate computer science student focused on web development and machine learning.",
    joinedDate: "September 2023"
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: "1", platform: "GitHub", url: "github.com/johndoe", icon: <Github className="h-4 w-4" /> },
    { id: "2", platform: "LinkedIn", url: "linkedin.com/in/johndoe", icon: <Linkedin className="h-4 w-4" /> },
    { id: "3", platform: "Twitter", url: "twitter.com/johndoe", icon: <Twitter className="h-4 w-4" /> },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "E-commerce Platform",
      description: "Full-stack MERN application with payment integration and admin dashboard",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      url: "github.com/johndoe/ecommerce",
      date: "Nov 2024"
    },
    {
      id: "2",
      title: "AI Chatbot",
      description: "Natural language processing chatbot using GPT-3 API",
      technologies: ["Python", "TensorFlow", "Flask"],
      url: "github.com/johndoe/chatbot",
      date: "Oct 2024"
    },
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "Dean's List",
      description: "Achieved Dean's List for academic excellence in Fall 2024",
      date: "Dec 2024",
      type: "award"
    },
    {
      id: "2",
      title: "AWS Certified Developer",
      description: "Obtained AWS Certified Developer - Associate certification",
      date: "Oct 2024",
      type: "certificate"
    },
    {
      id: "3",
      title: "100 Tasks Completed",
      description: "Completed 100 assignments and projects",
      date: "Nov 2024",
      type: "milestone"
    },
  ]);

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "award": return <Trophy className="h-8 w-8 text-yellow-500" />;
      case "certificate": return <Award className="h-8 w-8 text-blue-500" />;
      case "milestone": return <Trophy className="h-8 w-8 text-green-500" />;
      default: return <Trophy className="h-8 w-8 text-gray-500" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    const lower = platform.toLowerCase();
    if (lower.includes("github")) return <Github className="h-4 w-4" />;
    if (lower.includes("linkedin")) return <Linkedin className="h-4 w-4" />;
    if (lower.includes("twitter")) return <Twitter className="h-4 w-4" />;
    return <Globe className="h-4 w-4" />;
  };

  // Social Links handlers
  const handleDeleteSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id));
  };

  const handleEditSocialLink = (link: SocialLink) => {
    setEditingItem(link);
    setIsEditSocialLinkOpen(true);
  };

  const handleSaveSocialLink = (platform: string, url: string) => {
    if (editingItem) {
      setSocialLinks(socialLinks.map(link => 
        link.id === editingItem.id 
          ? { ...link, platform, url, icon: getPlatformIcon(platform) }
          : link
      ));
    } else {
      const newLink: SocialLink = {
        id: Date.now().toString(),
        platform,
        url,
        icon: getPlatformIcon(platform)
      };
      setSocialLinks([...socialLinks, newLink]);
    }
    setEditingItem(null);
    setIsAddSocialLinkOpen(false);
    setIsEditSocialLinkOpen(false);
  };

  // Project handlers
  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const handleEditProject = (project: Project) => {
    setEditingItem(project);
    setIsEditProjectOpen(true);
  };

  const handleSaveProject = (title: string, description: string, technologies: string[], url: string, date: string) => {
    if (editingItem) {
      setProjects(projects.map(project =>
        project.id === editingItem.id
          ? { ...project, title, description, technologies, url, date }
          : project
      ));
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        title,
        description,
        technologies,
        url,
        date
      };
      setProjects([...projects, newProject]);
    }
    setEditingItem(null);
    setIsAddProjectOpen(false);
    setIsEditProjectOpen(false);
  };

  // Achievement handlers
  const handleDeleteAchievement = (id: string) => {
    setAchievements(achievements.filter(achievement => achievement.id !== id));
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setEditingItem(achievement);
    setIsEditAchievementOpen(true);
  };

  const handleSaveAchievement = (title: string, description: string, date: string, type: "award" | "certificate" | "milestone") => {
    if (editingItem) {
      setAchievements(achievements.map(achievement =>
        achievement.id === editingItem.id
          ? { ...achievement, title, description, date, type }
          : achievement
      ));
    } else {
      const newAchievement: Achievement = {
        id: Date.now().toString(),
        title,
        description,
        date,
        type
      };
      setAchievements([...achievements, newAchievement]);
    }
    setEditingItem(null);
    setIsAddAchievementOpen(false);
    setIsEditAchievementOpen(false);
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-[1800px] mx-auto">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl">{t.profile}</h2>
        <p className="text-muted-foreground text-sm sm:text-base">{t.subtitle}</p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative group">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-3xl">JD</AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3>{personalInfo.name}</h3>
                <p className="text-muted-foreground">{personalInfo.bio}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {personalInfo.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {personalInfo.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {personalInfo.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {t.joined} {personalInfo.joinedDate}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">{t.personalInfo}</TabsTrigger>
          <TabsTrigger value="social">{t.socialLinks}</TabsTrigger>
          <TabsTrigger value="portfolio">{t.portfolio}</TabsTrigger>
          <TabsTrigger value="achievements">{t.achievements}</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.personalInformation}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditingPersonal ? t.cancel : t.edit}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditingPersonal ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.fullName}</Label>
                      <Input
                        id="name"
                        value={personalInfo.name}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.phone}</Label>
                      <Input
                        id="phone"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">{t.location}</Label>
                      <Input
                        id="location"
                        value={personalInfo.location}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">{t.bio}</Label>
                    <Textarea
                      id="bio"
                      rows={3}
                      value={personalInfo.bio}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                    />
                  </div>
                  <Button onClick={() => setIsEditingPersonal(false)}>{t.saveChanges}</Button>
                </>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t.fullName}</p>
                    <p>{personalInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t.email}</p>
                    <p>{personalInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t.phone}</p>
                    <p>{personalInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t.location}</p>
                    <p>{personalInfo.location}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">{t.bio}</p>
                    <p>{personalInfo.bio}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isAddSocialLinkOpen} onOpenChange={setIsAddSocialLinkOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addLink}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.addNewSocialLink}</DialogTitle>
                  <DialogDescription>{t.connectSocialMedia}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="socialPlatform">{t.platform}</Label>
                    <Input id="socialPlatform" placeholder="GitHub" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="socialUrl">{t.url}</Label>
                    <Input id="socialUrl" placeholder="github.com/username" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsAddSocialLinkOpen(false)} className="flex-1">
                      {t.cancel}
                    </Button>
                    <Button onClick={() => handleSaveSocialLink((document.getElementById("socialPlatform") as HTMLInputElement).value, (document.getElementById("socialUrl") as HTMLInputElement).value)} className="flex-1">
                      {t.addLink}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4">
            {socialLinks.map((link) => (
              <Card key={link.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {link.icon}
                      <div>
                        <p>{link.platform}</p>
                        <p className="text-sm text-muted-foreground">{link.url}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditSocialLink(link)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteSocialLink(link.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addProject}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.addNewProject}</DialogTitle>
                  <DialogDescription>{t.showcaseWork}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectTitle">{t.projectTitle}</Label>
                    <Input id="projectTitle" placeholder={language === "en" ? "My Awesome Project" : "Мой проект"} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectDesc">{t.description}</Label>
                    <Textarea id="projectDesc" rows={3} placeholder={language === "en" ? "Brief description of your project..." : "Краткое описание проекта..."} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectTech">{t.technologies}</Label>
                    <Input id="projectTech" placeholder="React, Node.js, MongoDB" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectUrl">{t.projectUrl}</Label>
                    <Input id="projectUrl" placeholder="github.com/username/project" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectDate">{t.date}</Label>
                    <Input id="projectDate" placeholder={language === "en" ? "Nov 2024" : "Ноя 2024"} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsAddProjectOpen(false)} className="flex-1">
                      {t.cancel}
                    </Button>
                    <Button onClick={() => handleSaveProject((document.getElementById("projectTitle") as HTMLInputElement).value, (document.getElementById("projectDesc") as HTMLTextAreaElement).value, (document.getElementById("projectTech") as HTMLInputElement).value.split(",").map(t => t.trim()), (document.getElementById("projectUrl") as HTMLInputElement).value, (document.getElementById("projectDate") as HTMLInputElement).value)} className="flex-1">
                      {t.addProject}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-1">{project.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{project.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <a href={`https://${project.url}`} className="hover:underline">
                      {project.url}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isAddAchievementOpen} onOpenChange={setIsAddAchievementOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addAchievement}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.addNewAchievement}</DialogTitle>
                  <DialogDescription>{t.recordAccomplishments}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="achievementTitle">{t.title}</Label>
                    <Input id="achievementTitle" placeholder={language === "en" ? "Award name or milestone" : "Название награды или достижения"} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="achievementDesc">{t.description}</Label>
                    <Textarea id="achievementDesc" rows={3} placeholder={language === "en" ? "Details about this achievement..." : "Детали достижения..."} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="achievementDate">{t.date}</Label>
                    <Input id="achievementDate" type="date" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsAddAchievementOpen(false)} className="flex-1">
                      {t.cancel}
                    </Button>
                    <Button onClick={() => handleSaveAchievement((document.getElementById("achievementTitle") as HTMLInputElement).value, (document.getElementById("achievementDesc") as HTMLTextAreaElement).value, (document.getElementById("achievementDate") as HTMLInputElement).value, (document.getElementById("achievementType") as HTMLSelectElement).value as "award" | "certificate" | "milestone")} className="flex-1">
                      {t.addAchievement}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      {getAchievementIcon(achievement.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="mb-1">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground">{achievement.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditAchievement(achievement)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteAchievement(achievement.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Social Link Dialog */}
      <Dialog open={isEditSocialLinkOpen} onOpenChange={(open) => {
        setIsEditSocialLinkOpen(open);
        if (!open) setEditingItem(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.editSocialLink}</DialogTitle>
            <DialogDescription>{t.updateSocialMedia}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="editSocialPlatform">{t.platform}</Label>
              <Input 
                id="editSocialPlatform" 
                defaultValue={editingItem?.platform}
                placeholder="GitHub" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editSocialUrl">{t.url}</Label>
              <Input 
                id="editSocialUrl" 
                defaultValue={editingItem?.url}
                placeholder="github.com/username" 
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditSocialLinkOpen(false)} className="flex-1">
                {t.cancel}
              </Button>
              <Button onClick={() => {
                const platform = (document.getElementById("editSocialPlatform") as HTMLInputElement).value;
                const url = (document.getElementById("editSocialUrl") as HTMLInputElement).value;
                handleSaveSocialLink(platform, url);
              }} className="flex-1">
                {t.saveChanges}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditProjectOpen} onOpenChange={(open) => {
        setIsEditProjectOpen(open);
        if (!open) setEditingItem(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.editProject}</DialogTitle>
            <DialogDescription>{t.updateProjectDetails}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="editProjectTitle">{t.projectTitle}</Label>
              <Input 
                id="editProjectTitle" 
                defaultValue={editingItem?.title}
                placeholder={language === "en" ? "My Awesome Project" : "Мой проект"} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editProjectDesc">{t.description}</Label>
              <Textarea 
                id="editProjectDesc" 
                rows={3} 
                defaultValue={editingItem?.description}
                placeholder={language === "en" ? "Brief description of your project..." : "Краткое описание проекта..."} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editProjectTech">{t.technologies}</Label>
              <Input 
                id="editProjectTech" 
                defaultValue={editingItem?.technologies?.join(", ")}
                placeholder="React, Node.js, MongoDB" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editProjectUrl">{t.projectUrl}</Label>
              <Input 
                id="editProjectUrl" 
                defaultValue={editingItem?.url}
                placeholder="github.com/username/project" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editProjectDate">{t.date}</Label>
              <Input 
                id="editProjectDate" 
                defaultValue={editingItem?.date}
                placeholder={language === "en" ? "Nov 2024" : "Ноя 2024"} 
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditProjectOpen(false)} className="flex-1">
                {t.cancel}
              </Button>
              <Button onClick={() => {
                const title = (document.getElementById("editProjectTitle") as HTMLInputElement).value;
                const description = (document.getElementById("editProjectDesc") as HTMLTextAreaElement).value;
                const technologies = (document.getElementById("editProjectTech") as HTMLInputElement).value.split(",").map(t => t.trim());
                const url = (document.getElementById("editProjectUrl") as HTMLInputElement).value;
                const date = (document.getElementById("editProjectDate") as HTMLInputElement).value;
                handleSaveProject(title, description, technologies, url, date);
              }} className="flex-1">
                {t.saveChanges}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Achievement Dialog */}
      <Dialog open={isEditAchievementOpen} onOpenChange={(open) => {
        setIsEditAchievementOpen(open);
        if (!open) setEditingItem(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.editAchievement}</DialogTitle>
            <DialogDescription>{t.updateAchievement}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="editAchievementTitle">{t.title}</Label>
              <Input 
                id="editAchievementTitle" 
                defaultValue={editingItem?.title}
                placeholder={language === "en" ? "Award name or milestone" : "Название награды или достижения"} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editAchievementDesc">{t.description}</Label>
              <Textarea 
                id="editAchievementDesc" 
                rows={3} 
                defaultValue={editingItem?.description}
                placeholder={language === "en" ? "Details about this achievement..." : "Детали достижения..."} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editAchievementDate">{t.date}</Label>
              <Input 
                id="editAchievementDate" 
                defaultValue={editingItem?.date}
                placeholder={language === "en" ? "Dec 2024" : "Дек 2024"} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editAchievementType">{t.type}</Label>
              <select 
                id="editAchievementType"
                defaultValue={editingItem?.type}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="award">{t.award}</option>
                <option value="certificate">{t.certificate}</option>
                <option value="milestone">{t.milestone}</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditAchievementOpen(false)} className="flex-1">
                {t.cancel}
              </Button>
              <Button onClick={() => {
                const title = (document.getElementById("editAchievementTitle") as HTMLInputElement).value;
                const description = (document.getElementById("editAchievementDesc") as HTMLTextAreaElement).value;
                const date = (document.getElementById("editAchievementDate") as HTMLInputElement).value;
                const type = (document.getElementById("editAchievementType") as HTMLSelectElement).value as "award" | "certificate" | "milestone";
                handleSaveAchievement(title, description, date, type);
              }} className="flex-1">
                {t.saveChanges}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}