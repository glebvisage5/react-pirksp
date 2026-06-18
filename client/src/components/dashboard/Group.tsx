import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Users, Search, Mail, Trophy, AlertCircle, Loader2 } from "lucide-react";
import { useLanguage } from "../../lib/language-context";
import { apiGroups, type MyGroup } from "../../api/groups";

export function Group() {
  const { language } = useLanguage();
  const [group, setGroup] = useState<MyGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const t = {
    title: language === "en" ? "My Group" : "Моя группа",
    subtitle: language === "en" ? "View your group and its members" : "Просмотр группы и её участников",
    totalMembers: language === "en" ? "Total Members" : "Всего участников",
    groupLeaders: language === "en" ? "Group Leaders" : "Лидеры группы",
    searchPlaceholder: language === "en" ? "Search members by name or email..." : "Поиск участников по имени или email...",
    leader: language === "en" ? "Leader" : "Лидер",
    member: language === "en" ? "Member" : "Участник",
    noMembersFound: language === "en" ? "No members found" : "Участники не найдены",
    noGroup: language === "en" ? "You are not part of any group yet" : "Вы пока не состоите в группе",
    loading: language === "en" ? "Loading..." : "Загрузка...",
  };

  useEffect(() => {
    setLoading(true);
    apiGroups.my()
      .then(setGroup)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-3 text-muted-foreground">{t.loading}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive gap-2">
        <AlertCircle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  if (!group) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t.noGroup}</p>
        </CardContent>
      </Card>
    );
  }

  const filteredMembers = group.members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const leaderCount = group.members.filter(m => m.role === "elder").length;

  return (
    <div className="space-y-4 md:space-y-6 max-w-[1800px] mx-auto">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl">{group.name}</h2>
        <p className="text-muted-foreground text-sm sm:text-base">{t.subtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.totalMembers}</p>
                <div className="text-2xl">{group.members.length}</div>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.groupLeaders}</p>
                <div className="text-2xl">{leaderCount}</div>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Member List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar>
                  <AvatarImage src={member.avatar_url ?? undefined} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base truncate">{member.name}</CardTitle>
                    {member.role === "elder" && (
                      <Trophy className="h-4 w-4 text-yellow-500 shrink-0" />
                    )}
                  </div>
                  <Badge variant={member.role === "elder" ? "default" : "secondary"} className="mt-1">
                    {member.role === "elder" ? t.leader : t.member}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t.noMembersFound}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
