import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../lib/language-context";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { ArrowLeft, Building2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../api/client";
import { gtaIconUrl, isGtaIconImage } from "../../api/gta";
import { IconPicker } from "./IconPicker";
import { useGtaViewMode } from "./GtaViewModeContext";
import type { GtaServer } from "./GtaServers";

interface GtaOrg {
  id: string;
  server_id: string;
  name: string;
  description: string | null;
  full_description: string | null;
  icon: string;
  sort_order: number;
  tab_count: number;
}

export function GtaServerDetail() {
  const { serverId } = useParams<{ serverId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { viewMode } = useGtaViewMode();
  const isPlayer = viewMode === "player";
  const [server, setServer] = useState<GtaServer | null>(null);
  const [orgs, setOrgs] = useState<GtaOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editOrg, setEditOrg] = useState<GtaOrg | null>(null);
  const [form, setForm] = useState({ name: "", description: "", full_description: "", icon: "🏢" });
  const [deleteOrgConfirm, setDeleteOrgConfirm] = useState<GtaOrg | null>(null);

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const t = {
    back: language === "en" ? "Back to Servers" : "Назад к серверам",
    orgs: language === "en" ? "Organizations" : "Организации",
    createOrg: language === "en" ? "Create Organization" : "Создать организацию",
    editOrg: language === "en" ? "Edit Organization" : "Редактировать организацию",
    name: language === "en" ? "Name" : "Название",
    desc: language === "en" ? "Short description" : "Краткое описание",
    descHint: language === "en" ? "Shown in the organization list" : "Отображается в списке организаций",
    fullDesc: language === "en" ? "Detailed description" : "Развёрнутое описание",
    fullDescHint: language === "en" ? "Shown together with the short one in the Overview tab" : "Отображается вместе с кратким во вкладке «Обзор»",
    icon: language === "en" ? "Icon" : "Иконка",
    save: language === "en" ? "Save" : "Сохранить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    empty: language === "en" ? "No organizations yet. Create your first one!" : "Организаций пока нет. Создайте первую!",
    tabs: language === "en" ? "tabs" : "вкладок",
    deleteOrg: language === "en" ? "Delete Organization" : "Удалить организацию",
    deleteConfirm: language === "en"
      ? "This will delete the organization and all its data. Continue?"
      : "Это удалит организацию и все её данные. Продолжить?",
    deleted: language === "en" ? "Organization deleted" : "Организация удалена",
    created: language === "en" ? "Organization created" : "Организация создана",
    updated: language === "en" ? "Organization updated" : "Организация обновлена",
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
      toast.success(t.updated);
    } else {
      await api.post(`/api/gta/servers/${serverId}/orgs`, form);
      toast.success(t.created);
    }
    setIsCreateOpen(false);
    setEditOrg(null);
    setForm({ name: "", description: "", full_description: "", icon: "🏢" });
    load();
  };

  const handleDelete = (org: GtaOrg, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteOrgConfirm(org);
  };

  const confirmDelete = async () => {
    if (!deleteOrgConfirm) return;
    await api.delete(`/api/gta/orgs/${deleteOrgConfirm.id}`);
    setDeleteOrgConfirm(null);
    toast.success(t.deleted);
    load();
  };

  const openEdit = (org: GtaOrg, e: React.MouseEvent) => {
    e.stopPropagation();
    setForm({ name: org.name, description: org.description || "", full_description: org.full_description || "", icon: org.icon });
    setEditOrg(org);
    setIsCreateOpen(true);
  };

  const openCreate = () => {
    setForm({ name: "", description: "", full_description: "", icon: "🏢" });
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
            <div className="w-12 h-12 rounded-lg bg-[#e0015b]/10 dark:bg-[#e0015b]/20 flex items-center justify-center text-2xl overflow-hidden shrink-0">
              {server && isGtaIconImage(server.icon) ? (
                <img src={gtaIconUrl(server.icon)} alt="" className="w-full h-full object-cover" />
              ) : (
                server?.icon
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{server?.name}</h1>
              {server?.project_name && <p className="text-sm text-muted-foreground">{server.project_name}</p>}
            </div>
          </div>
          {!isPlayer && (
            <Button
              onClick={openCreate}
              className="text-white shadow-lg hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #e0015b, #f43f5e)' }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.createOrg}
            </Button>
          )}
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
                    <div className="w-10 h-10 rounded-lg bg-[#e0015b]/10 dark:bg-[#e0015b]/20 flex items-center justify-center text-xl overflow-hidden shrink-0">
                      {isGtaIconImage(org.icon) ? (
                        <img src={gtaIconUrl(org.icon)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        org.icon
                      )}
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
                    {!isPlayer && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7"
                          onClick={(e: React.MouseEvent) => openEdit(org, e)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                          onClick={(e: React.MouseEvent) => handleDelete(org, e)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
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
            <div className="space-y-2">
              <Label>{t.icon}</Label>
              <IconPicker
                value={form.icon}
                onChange={icon => setForm(f => ({ ...f, icon }))}
                defaultIcon="🏢"
                language={language}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.name}</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required />
            </div>
            <div className="space-y-2">
              <Label>{t.desc}</Label>
              <p className="text-xs text-muted-foreground">{t.descHint}</p>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <Label>{t.fullDesc}</Label>
              <p className="text-xs text-muted-foreground">{t.fullDescHint}</p>
              <Textarea value={form.full_description} onChange={e => setForm(f => ({ ...f, full_description: e.target.value }))}
                className="min-h-[120px]" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>{t.cancel}</Button>
              <Button type="submit" className="text-white hover:opacity-90" style={{ background: 'linear-gradient(135deg, #e0015b, #f43f5e)' }}>{t.save}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Org Confirmation */}
      <AlertDialog open={!!deleteOrgConfirm} onOpenChange={(open: boolean) => { if (!open) setDeleteOrgConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteOrg}</AlertDialogTitle>
            <AlertDialogDescription>{t.deleteConfirm}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>
              {t.deleteOrg}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
