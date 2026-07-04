import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../lib/language-context";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ArrowLeft, Building2, Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "../../api/client";
import type { GtaServer } from "./GtaServers";

interface GtaOrg {
  id: string;
  server_id: string;
  name: string;
  description: string | null;
  icon: string;
  sort_order: number;
  tab_count: number;
}

export function GtaServerDetail() {
  const { serverId } = useParams<{ serverId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [server, setServer] = useState<GtaServer | null>(null);
  const [orgs, setOrgs] = useState<GtaOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editOrg, setEditOrg] = useState<GtaOrg | null>(null);
  const [form, setForm] = useState({ name: "", description: "", icon: "🏢" });

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const t = {
    back: language === "en" ? "Back to Servers" : "Назад к серверам",
    orgs: language === "en" ? "Organizations" : "Организации",
    createOrg: language === "en" ? "Create Organization" : "Создать организацию",
    editOrg: language === "en" ? "Edit Organization" : "Редактировать организацию",
    name: language === "en" ? "Name" : "Название",
    desc: language === "en" ? "Description" : "Описание",
    icon: language === "en" ? "Icon (emoji)" : "Иконка (эмодзи)",
    save: language === "en" ? "Save" : "Сохранить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    empty: language === "en" ? "No organizations yet. Create your first one!" : "Организаций пока нет. Создайте первую!",
    tabs: language === "en" ? "tabs" : "вкладок",
    deleteConfirm: language === "en" ? "Delete this organization?" : "Удалить эту организацию?",
    settings: language === "en" ? "Settings" : "Настройки",
  };

  const load = useCallback(async () => {
    if (!serverId) return;
    try {
      const [s, o] = await Promise.all([
        api.get<GtaServer>(`/api/gta/servers/${serverId}`),
        api.get<GtaOrg[]>(`/api/gta/servers/${serverId}/orgs`),
      ]);
      setServer(s);
      setOrgs(o);
    } catch { navigate("/gta-rp/servers"); }
    finally { setLoading(false); }
  }, [serverId, navigate]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editOrg) {
      await api.put(`/api/gta/orgs/${editOrg.id}`, form);
    } else {
      await api.post(`/api/gta/servers/${serverId}/orgs`, form);
    }
    setIsCreateOpen(false);
    setEditOrg(null);
    setForm({ name: "", description: "", icon: "🏢" });
    load();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t.deleteConfirm)) return;
    await api.delete(`/api/gta/orgs/${id}`);
    load();
  };

  const openEdit = (org: GtaOrg, e: React.MouseEvent) => {
    e.stopPropagation();
    setForm({ name: org.name, description: org.description || "", icon: org.icon });
    setEditOrg(org);
    setIsCreateOpen(true);
  };

  const openCreate = () => {
    setForm({ name: "", description: "", icon: "🏢" });
    setEditOrg(null);
    setIsCreateOpen(true);
  };

  if (loading) return <div className="space-y-4">{[0,1,2].map(i => <Card key={i} className="p-5 bg-card border animate-pulse h-20" />)}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <Button
          variant="ghost"
          className="mb-4 -ml-2"
          onClick={() => navigate("/gta-rp/servers")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> {t.back}
        </Button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#e0015b]/10 dark:bg-[#e0015b]/20 flex items-center justify-center text-2xl">
              {server?.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{server?.name}</h1>
              {server?.project_name && <p className="text-sm text-muted-foreground">{server.project_name}</p>}
            </div>
          </div>
          <Button
            onClick={openCreate}
            className="text-white shadow-lg hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #e0015b, #f43f5e)' }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.createOrg}
          </Button>
        </div>
      </div>

      {/* Org list */}
      <div>
        <h2 className={`
          text-lg font-semibold text-foreground mb-4 flex items-center gap-2
          transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}
        `}
          style={{ transitionDelay: "200ms" }}
        >
          <Building2 className="h-5 w-5 text-[#e0015b] dark:text-rose-400" />
          {t.orgs}
        </h2>

        {orgs.length === 0 ? (
          <Card className={`
            p-12 bg-card border text-center
            transition-all duration-700
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
            style={{ transitionDelay: "300ms" }}
          >
            <Building2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">{t.empty}</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {orgs.map((org, i) => (
              <Card
                key={org.id}
                className={`
                  p-4 bg-card border hover:border-[#e0015b]/50
                  cursor-pointer group transition-all duration-500
                  hover:shadow-lg
                  ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}
                `}
                style={{ transitionDelay: `${300 + i * 100}ms` }}
                onClick={() => navigate(`/gta-rp/servers/${serverId}/orgs/${org.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#e0015b]/10 dark:bg-[#e0015b]/20 flex items-center justify-center text-xl">
                      {org.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-[#e0015b] transition-colors">
                        {org.name}
                      </h3>
                      {org.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{org.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{org.tab_count} {t.tabs}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7"
                        onClick={(e: React.MouseEvent) => openEdit(org, e)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                        onClick={(e: React.MouseEvent) => handleDelete(org.id, e)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#e0015b] dark:text-rose-400">
              {editOrg ? t.editOrg : t.createOrg}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>{t.icon}</Label>
              <Input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                className="text-center text-2xl w-20" maxLength={4} />
            </div>
            <div>
              <Label>{t.name}</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required />
            </div>
            <div>
              <Label>{t.desc}</Label>
              <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>{t.cancel}</Button>
              <Button type="submit" className="text-white hover:opacity-90" style={{ background: 'linear-gradient(135deg, #e0015b, #f43f5e)' }}>{t.save}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
