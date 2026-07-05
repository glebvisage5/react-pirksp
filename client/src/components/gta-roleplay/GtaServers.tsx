import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../lib/language-context";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Server, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../api/client";
import { gtaIconUrl, isGtaIconImage } from "../../api/gta";
import { IconPicker } from "./IconPicker";
import { useGtaViewMode } from "./GtaViewModeContext";

export interface GtaServer {
  id: string;
  name: string;
  project_name: string | null;
  icon: string;
  created_at: string;
  org_count: number;
}

export function GtaServers() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { viewMode } = useGtaViewMode();
  const isPlayer = viewMode === "player";
  const [servers, setServers] = useState<GtaServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editServer, setEditServer] = useState<GtaServer | null>(null);
  const [form, setForm] = useState({ name: "", project_name: "", icon: "🎮" });
  const [deleteServerConfirm, setDeleteServerConfirm] = useState<GtaServer | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const t = {
    title: language === "en" ? "Servers" : "Серверы",
    subtitle: language === "en" ? "Manage your GTA RP servers" : "Управление серверами GTA RP",
    create: language === "en" ? "Create Server" : "Создать сервер",
    edit: language === "en" ? "Edit Server" : "Редактировать сервер",
    name: language === "en" ? "Server name" : "Название сервера",
    project: language === "en" ? "Project name" : "Название проекта",
    icon: language === "en" ? "Icon" : "Иконка",
    save: language === "en" ? "Save" : "Сохранить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    empty: language === "en" ? "No servers yet. Create your first one!" : "Серверов пока нет. Создайте первый!",
    orgs: language === "en" ? "organizations" : "организаций",
    deleteServer: language === "en" ? "Delete Server" : "Удалить сервер",
    deleteConfirm: language === "en"
      ? "This will delete the server and all its organizations. Continue?"
      : "Это удалит сервер и все его организации. Продолжить?",
    deleted: language === "en" ? "Server deleted" : "Сервер удалён",
    created: language === "en" ? "Server created" : "Сервер создан",
    updated: language === "en" ? "Server updated" : "Сервер обновлён",
  };

  const loadServers = useCallback(async () => {
    try {
      const data = await api.get<GtaServer[]>("/api/gta/servers");
      setServers(data);
    } catch {
      setServers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadServers(); }, [loadServers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editServer) {
      await api.put(`/api/gta/servers/${editServer.id}`, form);
      toast.success(t.updated);
    } else {
      await api.post("/api/gta/servers", form);
      toast.success(t.created);
    }
    setIsCreateOpen(false);
    setEditServer(null);
    setForm({ name: "", project_name: "", icon: "🎮" });
    loadServers();
  };

  const handleDelete = (s: GtaServer) => {
    setDeleteServerConfirm(s);
  };

  const confirmDelete = async () => {
    if (!deleteServerConfirm) return;
    await api.delete(`/api/gta/servers/${deleteServerConfirm.id}`);
    setDeleteServerConfirm(null);
    toast.success(t.deleted);
    loadServers();
  };

  const openEdit = (s: GtaServer) => {
    setForm({ name: s.name, project_name: s.project_name || "", icon: s.icon });
    setEditServer(s);
    setIsCreateOpen(true);
  };

  const openCreate = () => {
    setForm({ name: "", project_name: "", icon: "🎮" });
    setEditServer(null);
    setIsCreateOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`
        flex items-center justify-between
        transition-all duration-700
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Server className="h-7 w-7 text-[#e0015b] dark:text-rose-400" />
            <h1 className="text-3xl font-bold text-foreground">
              {t.title}
            </h1>
          </div>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        {!isPlayer && (
          <Button
            onClick={openCreate}
            className="text-white shadow-lg hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #e0015b, #f43f5e)' }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.create}
          </Button>
        )}
      </div>

      {/* Server cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <Card key={i} className="p-5 bg-card border animate-pulse h-28" />
          ))}
        </div>
      ) : servers.length === 0 ? (
        <Card className={`
          p-12 bg-card border text-center
          transition-all duration-700
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
          style={{ transitionDelay: "200ms" }}
        >
          <Server className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">{t.empty}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.map((s, i) => (
            <Card
              key={s.id}
              className={`
                p-5 bg-card border hover:border-[#e0015b]/50
                cursor-pointer group transition-all duration-500
                hover:shadow-lg hover:scale-[1.02]
                ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
              `}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
              onClick={() => navigate(`/gta-rp/servers/${s.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#e0015b]/10 dark:bg-[#e0015b]/20 flex items-center justify-center text-2xl overflow-hidden shrink-0">
                    {isGtaIconImage(s.icon) ? (
                      <img src={gtaIconUrl(s.icon)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      s.icon
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-[#e0015b] transition-colors">
                      {s.name}
                    </h3>
                    {s.project_name && (
                      <p className="text-xs text-muted-foreground">{s.project_name}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {s.org_count} {t.orgs}
                    </p>
                  </div>
                </div>
                {!isPlayer && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost" size="icon"
                      className="h-7 w-7"
                      onClick={(e: React.MouseEvent) => { e.stopPropagation(); openEdit(s); }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                      onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDelete(s); }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#e0015b] dark:text-rose-400">
              {editServer ? t.edit : t.create}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t.icon}</Label>
              <IconPicker
                value={form.icon}
                onChange={icon => setForm(f => ({ ...f, icon }))}
                defaultIcon="🎮"
                language={language}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.name}</Label>
              <Input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t.project}</Label>
              <Input
                value={form.project_name}
                onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                {t.cancel}
              </Button>
              <Button type="submit" className="text-white hover:opacity-90" style={{ background: 'linear-gradient(135deg, #e0015b, #f43f5e)' }}>
                {t.save}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Server Confirmation */}
      <AlertDialog open={!!deleteServerConfirm} onOpenChange={(open: boolean) => { if (!open) setDeleteServerConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteServer}</AlertDialogTitle>
            <AlertDialogDescription>{t.deleteConfirm}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>
              {t.deleteServer}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
