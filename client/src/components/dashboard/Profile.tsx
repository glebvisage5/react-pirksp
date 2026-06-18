import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { apiUsers, type SocialLink, type UserProfile } from "../../api/users";
import { ApiError } from "../../api/client";
import { Mail, Calendar, Plus, Github, Linkedin, Twitter, Globe, Edit, Trash2, Loader2, AlertCircle, Users, Phone, Send } from "lucide-react";

// Простые иконки для соцсетей, которых нет в lucide-react
function VkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.16 19.07c-7.13 0-11.19-4.89-11.36-13.04h3.56c.12 5.91 2.71 8.42 4.77 8.94V6.03h3.35v4.1c1.99-.21 4.08-1.55 4.83-4.1h3.35c-.55 2.94-2.69 5.23-4.83 6.13 2.14.87 4.69 2.91 5.65 6.91h-3.69c-.75-2.74-2.96-4.86-5.31-5.1v5.1z" />
    </svg>
  );
}

function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 7.1h-5.6v1.4H22V7.1zM7.13 13.13c.69-.34 1.05-.95 1.05-1.83 0-1.71-1.26-2.55-3.39-2.55H0v10.6h4.96c2.27 0 3.74-.96 3.74-2.84 0-1.18-.6-2.06-1.57-2.38zm-4.5-2.5h2.1c.95 0 1.5.39 1.5 1.16 0 .77-.55 1.18-1.5 1.18h-2.1v-2.34zm2.42 5.94H2.63v-2.56h2.42c1.08 0 1.7.45 1.7 1.28 0 .84-.62 1.28-1.7 1.28zm14.62-2.43c0-2.55-1.5-4.41-4.13-4.41-2.6 0-4.36 1.93-4.36 4.46 0 2.57 1.69 4.44 4.43 4.44 2.05 0 3.5-.92 4.05-2.5h-2.07c-.25.55-.85.9-1.92.9-1.32 0-2.16-.74-2.31-2.06h6.28c.02-.27.03-.55.03-.83zm-6.27-.86c.21-1.15 1-1.85 2.15-1.85 1.2 0 1.92.75 2.05 1.85h-4.2z" />
    </svg>
  );
}

export function Profile() {
  const { language } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [savingPersonal, setSavingPersonal] = useState(false);

  const [isAddSocialLinkOpen, setIsAddSocialLinkOpen] = useState(false);
  const [isEditSocialLinkOpen, setIsEditSocialLinkOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

  const t = {
    profile: language === "en" ? "Profile" : "Профиль",
    subtitle: language === "en" ? "Manage your personal information and portfolio" : "Управление личной информацией и портфолио",
    joined: language === "en" ? "Joined" : "Присоединился",
    personalInfo: language === "en" ? "Personal Info" : "Личная информация",
    socialLinks: language === "en" ? "Social Links" : "Социальные сети",
    portfolio: language === "en" ? "Portfolio" : "Портфолио",
    personalInformation: language === "en" ? "Personal Information" : "Личная информация",
    edit: language === "en" ? "Edit" : "Редактировать",
    cancel: language === "en" ? "Cancel" : "Отмена",
    fullName: language === "en" ? "Full Name" : "Полное имя",
    email: language === "en" ? "Email" : "Эл. почта",
    bio: language === "en" ? "Bio" : "О себе",
    saveChanges: language === "en" ? "Save Changes" : "Сохранить изменения",
    addLink: language === "en" ? "Add Link" : "Добавить ссылку",
    addNewSocialLink: language === "en" ? "Add New Social Link" : "Добавить социальную сеть",
    connectSocialMedia: language === "en" ? "Connect with your social media profiles" : "Подключите ваши профили в социальных сетях",
    platform: language === "en" ? "Platform" : "Платформа",
    url: language === "en" ? "URL" : "URL",
    noSocialLinks: language === "en" ? "No social links yet" : "Социальные сети пока не добавлены",
    editSocialLink: language === "en" ? "Edit Social Link" : "Редактировать ссылку",
    updateSocialMedia: language === "en" ? "Update your social media profile" : "Обновите профиль в социальной сети",
    noProjects: language === "en" ? "No team projects yet" : "Пока нет командных проектов",
    projectsHint: language === "en"
      ? "Projects from your study teams will appear here"
      : "Здесь появятся проекты из ваших учебных команд",
    loadError: language === "en" ? "Failed to load profile" : "Не удалось загрузить профиль",
    saveError: language === "en" ? "Failed to save changes" : "Не удалось сохранить изменения",
    saved: language === "en" ? "Profile updated" : "Профиль обновлён",
    fieldsRequired: language === "en" ? "Please fill in all fields" : "Заполните все поля",
    linkAdded: language === "en" ? "Social link added" : "Социальная сеть добавлена",
    linkUpdated: language === "en" ? "Social link updated" : "Социальная сеть обновлена",
    linkDeleted: language === "en" ? "Social link removed" : "Социальная сеть удалена",
  };

  useEffect(() => {
    setLoading(true);
    apiUsers.getProfile()
      .then((data) => {
        setProfile(data);
        setNameInput(data.name);
        setBioInput(data.bio ?? "");
      })
      .catch((err: Error) => setError(err instanceof ApiError ? err.message : t.loadError))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPlatformIcon = (platform: string) => {
    const lower = platform.toLowerCase();
    if (lower.includes("github")) return <Github className="h-4 w-4" />;
    if (lower.includes("linkedin")) return <Linkedin className="h-4 w-4" />;
    if (lower.includes("twitter") || lower.includes("x.com")) return <Twitter className="h-4 w-4" />;
    if (lower.includes("vk") || lower.includes("вконтакте") || lower.includes("vkontakte")) return <VkIcon className="h-4 w-4" />;
    if (lower.includes("telegram") || lower.includes("телеграм") || lower.includes("tg")) return <Send className="h-4 w-4" />;
    if (lower.includes("behance")) return <BehanceIcon className="h-4 w-4" />;
    if (lower.includes("phone") || lower.includes("телефон") || lower.includes("тел.")) return <Phone className="h-4 w-4" />;
    return <Globe className="h-4 w-4" />;
  };

  const getInitials = (name: string) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";

  const formatJoined = (iso: string) =>
    new Date(iso).toLocaleDateString(language === "en" ? "en-US" : "ru-RU", { year: "numeric", month: "long" });

  const handleSavePersonal = async () => {
    if (!profile) return;
    setSavingPersonal(true);
    try {
      const updated = await apiUsers.updateProfile({ name: nameInput, bio: bioInput });
      setProfile(updated);
      setIsEditingPersonal(false);
      toast.success(t.saved);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t.saveError);
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleCancelPersonal = () => {
    if (!profile) return;
    setNameInput(profile.name);
    setBioInput(profile.bio ?? "");
    setIsEditingPersonal(false);
  };

  const saveSocialLinks = async (links: SocialLink[], successMessage?: string) => {
    if (!profile) return;
    try {
      const updated = await apiUsers.updateProfile({ social_links: links });
      setProfile(updated);
      if (successMessage) toast.success(successMessage);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t.saveError);
    }
  };

  const handleDeleteSocialLink = (link: SocialLink) => {
    if (!profile) return;
    void saveSocialLinks(profile.social_links.filter((l) => l !== link), t.linkDeleted);
  };

  const handleEditSocialLink = (link: SocialLink) => {
    setEditingLink(link);
    setIsEditSocialLinkOpen(true);
  };

  const handleSaveSocialLink = (platform: string, url: string) => {
    if (!profile) return;
    const trimmedPlatform = platform.trim();
    const trimmedUrl = url.trim();
    if (!trimmedPlatform || !trimmedUrl) {
      toast.error(t.fieldsRequired);
      return;
    }
    const isEdit = !!editingLink;
    let links: SocialLink[];
    if (editingLink) {
      links = profile.social_links.map((l) => (l === editingLink ? { platform: trimmedPlatform, url: trimmedUrl } : l));
    } else {
      links = [...profile.social_links, { platform: trimmedPlatform, url: trimmedUrl }];
    }
    void saveSocialLinks(links, isEdit ? t.linkUpdated : t.linkAdded);
    setEditingLink(null);
    setIsAddSocialLinkOpen(false);
    setIsEditSocialLinkOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2 text-muted-foreground">
        <AlertCircle className="h-8 w-8" />
        <p>{error ?? t.loadError}</p>
      </div>
    );
  }

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
            <Avatar className="h-32 w-32">
              <AvatarFallback className="text-3xl">{getInitials(profile.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div>
                <h3>{profile.name}</h3>
                {profile.bio && <p className="text-muted-foreground">{profile.bio}</p>}
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {t.joined} {formatJoined(profile.created_at)}
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
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.personalInformation}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (isEditingPersonal ? handleCancelPersonal() : setIsEditingPersonal(true))}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditingPersonal ? t.cancel : t.edit}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditingPersonal ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.fullName}</Label>
                    <Input
                      id="name"
                      value={nameInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNameInput(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">{t.bio}</Label>
                    <Textarea
                      id="bio"
                      rows={3}
                      value={bioInput}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBioInput(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSavePersonal} disabled={savingPersonal}>
                    {savingPersonal && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {t.saveChanges}
                  </Button>
                </>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t.fullName}</p>
                    <p>{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t.email}</p>
                    <p>{profile.email}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">{t.bio}</p>
                    <p>{profile.bio || "—"}</p>
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
                    <Input id="socialPlatform" placeholder="GitHub" list="socialPlatformOptions" />
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
          {profile.social_links.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">{t.noSocialLinks}</p>
          ) : (
            <div className="grid gap-4">
              {profile.social_links.map((link, index) => (
                <Card key={`${link.platform}-${index}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getPlatformIcon(link.platform)}
                        <div>
                          <p>{link.platform}</p>
                          <p className="text-sm text-muted-foreground">{link.url}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditSocialLink(link)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteSocialLink(link)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          {profile.projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
              <Users className="h-8 w-8" />
              <p>{t.noProjects}</p>
              <p className="text-sm">{t.projectsHint}</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {profile.projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle className="text-base mb-1">{project.name}</CardTitle>
                    <Badge variant="secondary">{project.group_name}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {project.description && (
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Social Link Dialog */}
      <Dialog open={isEditSocialLinkOpen} onOpenChange={(open: boolean) => {
        setIsEditSocialLinkOpen(open);
        if (!open) setEditingLink(null);
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
                defaultValue={editingLink?.platform}
                placeholder="GitHub"
                list="socialPlatformOptions"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editSocialUrl">{t.url}</Label>
              <Input
                id="editSocialUrl"
                defaultValue={editingLink?.url}
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

      <datalist id="socialPlatformOptions">
        <option value="GitHub" />
        <option value="LinkedIn" />
        <option value="Twitter" />
        <option value="VK" />
        <option value="Telegram" />
        <option value="Behance" />
        <option value={language === "en" ? "Phone" : "Телефон"} />
      </datalist>
    </div>
  );
}
