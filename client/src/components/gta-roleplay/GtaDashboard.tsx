import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../lib/language-context";
import { Card } from "../ui/card";
import { Gamepad2, Server, Building2, Wrench, Clock } from "lucide-react";
import { api } from "../../api/client";

interface DashboardStats {
  servers: number;
  orgs: number;
  tabs: number;
  recentServers: Array<{ id: string; name: string; icon: string; created_at: string; org_count: number }>;
  recentOrgs: Array<{ id: string; name: string; icon: string; created_at: string; server_id: string; server_name: string }>;
}

export function GtaDashboard() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const data = await api.get<DashboardStats>("/api/gta/dashboard/stats");
      setStats(data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const t = {
    title: language === "en" ? "Dashboard" : "Дашборд",
    subtitle: language === "en"
      ? "GTA RolePlay server management platform"
      : "Платформа управления серверами GTA RolePlay",
    servers: language === "en" ? "Servers" : "Серверы",
    orgs: language === "en" ? "Organizations" : "Организации",
    tabs: language === "en" ? "Custom Tabs" : "Вкладки",
    recentServers: language === "en" ? "Recent Servers" : "Последние серверы",
    recentOrgs: language === "en" ? "Recent Organizations" : "Последние организации",
    noActivity: language === "en" ? "No activity yet. Create your first server!" : "Пока нет активности. Создайте первый сервер!",
    orgsCount: language === "en" ? "orgs" : "орг.",
  };

  const statCards = [
    { icon: <Server className="h-8 w-8" />, label: t.servers, value: stats?.servers ?? 0 },
    { icon: <Building2 className="h-8 w-8" />, label: t.orgs, value: stats?.orgs ?? 0 },
    { icon: <Wrench className="h-8 w-8" />, label: t.tabs, value: stats?.tabs ?? 0 },
  ];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(language === "en" ? "en-US" : "ru-RU", { month: "short", day: "numeric" });
  };

  const hasActivity = (stats?.recentServers?.length ?? 0) > 0 || (stats?.recentOrgs?.length ?? 0) > 0;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className={`
        transition-all duration-700
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}>
        <div className="flex items-center gap-3 mb-2">
          <Gamepad2 className="h-8 w-8 text-[#e0015b] dark:text-rose-400" />
          <h1 className="text-3xl font-bold text-foreground">
            {t.title}
          </h1>
        </div>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((item, i) => (
          <Card
            key={i}
            className={`
              p-6 bg-card border hover:border-[#e0015b]/50
              transition-all duration-500
              ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
            `}
            style={{ transitionDelay: `${200 + i * 150}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[#e0015b]/10 text-[#e0015b] dark:bg-[#e0015b]/20 dark:text-rose-400">
                {item.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? "—" : item.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      <div className={`
        grid grid-cols-1 lg:grid-cols-2 gap-4
        transition-all duration-700
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
        style={{ transitionDelay: "650ms" }}
      >
        {!loading && !hasActivity ? (
          <Card className="p-8 bg-card border text-center col-span-full">
            <Clock className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">{t.noActivity}</p>
          </Card>
        ) : (
          <>
            {/* Recent servers */}
            <Card className="p-5 bg-card border">
              <div className="flex items-center gap-2 mb-4">
                <Server className="h-4 w-4 text-[#e0015b] dark:text-rose-400" />
                <h3 className="text-sm font-semibold text-foreground">{t.recentServers}</h3>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map(i => <div key={i} className="h-10 bg-muted/50 rounded animate-pulse" />)}
                </div>
              ) : (stats?.recentServers?.length ?? 0) === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">—</p>
              ) : (
                <div className="space-y-2">
                  {stats!.recentServers.map(s => (
                    <div key={s.id}
                      className="flex items-center justify-between p-2 rounded hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/gta-rp/servers/${s.id}`)}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{s.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.org_count} {t.orgsCount}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(s.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent organizations */}
            <Card className="p-5 bg-card border">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-4 w-4 text-[#e0015b] dark:text-rose-400" />
                <h3 className="text-sm font-semibold text-foreground">{t.recentOrgs}</h3>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map(i => <div key={i} className="h-10 bg-muted/50 rounded animate-pulse" />)}
                </div>
              ) : (stats?.recentOrgs?.length ?? 0) === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">—</p>
              ) : (
                <div className="space-y-2">
                  {stats!.recentOrgs.map(o => (
                    <div key={o.id}
                      className="flex items-center justify-between p-2 rounded hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/gta-rp/servers/${o.server_id}/orgs/${o.id}`)}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{o.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{o.name}</p>
                          <p className="text-xs text-muted-foreground">{o.server_name}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(o.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
