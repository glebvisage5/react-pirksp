import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../lib/language-context";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { toast } from "sonner";
import {
  ArrowLeft, Plus, Trash2, Settings, Eye, X, Pencil, GripVertical,
  Users, FileText, ClipboardList, File,
} from "lucide-react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { api } from "../../api/client";
import { gtaIconUrl, isGtaIconImage } from "../../api/gta";
import { IconPicker } from "./IconPicker";
import { LinkifiedText } from "./LinkifiedText";
import { useGtaViewMode } from "./GtaViewModeContext";

interface OrgData {
  id: string;
  server_id: string;
  name: string;
  description: string | null;
  full_description: string | null;
  icon: string;
}

interface Tab {
  id: string;
  org_id: string;
  name: string;
  sort_order: number;
}

interface Section {
  id: string;
  tab_id: string;
  type: "members" | "text" | "form" | "document";
  title: string | null;
  config: Record<string, unknown>;
  sort_order: number;
}

type ActiveView = "overview" | "settings" | string;

const SECTION_TYPES = [
  { type: "members", icon: <Users className="h-4 w-4" />, labelEn: "Members", labelRu: "Участники" },
  { type: "text", icon: <FileText className="h-4 w-4" />, labelEn: "Text Block", labelRu: "Текстовый блок" },
  { type: "form", icon: <ClipboardList className="h-4 w-4" />, labelEn: "Form", labelRu: "Форма" },
  { type: "document", icon: <File className="h-4 w-4" />, labelEn: "Document", labelRu: "Документ" },
] as const;

export function GtaOrgDetail() {
  const { serverId, orgId } = useParams<{ serverId: string; orgId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { viewMode } = useGtaViewMode();
  const isPlayer = viewMode === "player";
  const [org, setOrg] = useState<OrgData | null>(null);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>("overview");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [isTabDialogOpen, setIsTabDialogOpen] = useState(false);
  const [tabName, setTabName] = useState("");
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [sectionForm, setSectionForm] = useState({ type: "text" as string, title: "" });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ name: "", description: "", full_description: "", icon: "" });
  const [deleteTabConfirm, setDeleteTabConfirm] = useState<{ id: string; name: string } | null>(null);
  const [deleteOrgConfirm, setDeleteOrgConfirm] = useState(false);
  const [deleteSectionConfirm, setDeleteSectionConfirm] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const t = {
    back: language === "en" ? "Back to Organizations" : "Назад к организациям",
    overview: language === "en" ? "Overview" : "Обзор",
    settings: language === "en" ? "Settings" : "Настройки",
    addTab: language === "en" ? "Add Tab" : "Добавить вкладку",
    tabName: language === "en" ? "Tab name" : "Название вкладки",
    addSection: language === "en" ? "Add Block" : "Добавить блок",
    sectionType: language === "en" ? "Block type" : "Тип блока",
    sectionTitle: language === "en" ? "Block title" : "Заголовок блока",
    save: language === "en" ? "Save" : "Сохранить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    delete: language === "en" ? "Delete" : "Удалить",
    maxTabs: language === "en" ? "Maximum 3 custom tabs" : "Максимум 3 пользовательские вкладки",
    tabCreated: language === "en" ? "Tab created" : "Вкладка создана",
    noSections: language === "en" ? "No blocks yet. Add one!" : "Блоков пока нет. Добавьте!",
    editSettings: language === "en" ? "Organization Settings" : "Настройки организации",
    deleteOrg: language === "en" ? "Delete Organization" : "Удалить организацию",
    deleteOrgConfirm: language === "en" ? "This will delete the organization and all its data. Continue?" : "Это удалит организацию и все её данные. Продолжить?",
    deleteTab: language === "en" ? "Delete this tab?" : "Удалить эту вкладку?",
    description: language === "en" ? "Short description" : "Краткое описание",
    descriptionHint: language === "en" ? "Shown in the organization list" : "Отображается в списке организаций",
    fullDescription: language === "en" ? "Detailed description" : "Развёрнутое описание",
    fullDescriptionHint: language === "en" ? "Shown together with the short one in the Overview tab" : "Отображается вместе с кратким во вкладке «Обзор»",
    name: language === "en" ? "Name" : "Название",
    icon: language === "en" ? "Icon" : "Иконка",
    noDescription: language === "en" ? "No description" : "Нет описания",
  };

  const loadOrg = useCallback(async () => {
    if (!orgId) return;
    try {
      const [o, ts] = await Promise.all([
        api.get<OrgData>(`/api/gta/orgs/${orgId}`),
        api.get<Tab[]>(`/api/gta/orgs/${orgId}/tabs`),
      ]);
      setOrg(o);
      setTabs(ts);
      setSettingsForm({ name: o.name, description: o.description || "", full_description: o.full_description || "", icon: o.icon });
    } catch { navigate(`/gta-rp/servers/${serverId}`); }
    finally { setLoading(false); }
  }, [orgId, serverId, navigate]);

  useEffect(() => { loadOrg(); }, [loadOrg]);

  useEffect(() => {
    if (isPlayer && activeView === "settings") setActiveView("overview");
  }, [isPlayer, activeView]);

  const loadSections = useCallback(async (tabId: string) => {
    const s = await api.get<Section[]>(`/api/gta/tabs/${tabId}/sections`);
    setSections(s);
  }, []);

  useEffect(() => {
    if (activeView !== "overview" && activeView !== "settings") {
      loadSections(activeView);
    } else {
      setSections([]);
    }
  }, [activeView, loadSections]);

  const handleCreateTab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tabName.trim()) return;
    await api.post(`/api/gta/orgs/${orgId}/tabs`, { name: tabName });
    setTabName("");
    setIsTabDialogOpen(false);
    toast.success(t.tabCreated);
    loadOrg();
  };

  const handleDeleteTab = async (tabId: string) => {
    await api.delete(`/api/gta/tabs/${tabId}`);
    setDeleteTabConfirm(null);
    setActiveView("overview");
    toast.success(language === "en" ? "Tab deleted" : "Вкладка удалена");
    loadOrg();
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeView === "overview" || activeView === "settings") return;
    await api.post(`/api/gta/tabs/${activeView}/sections`, {
      type: sectionForm.type,
      title: sectionForm.title || undefined,
      config: getDefaultConfig(sectionForm.type),
    });
    setIsSectionDialogOpen(false);
    setSectionForm({ type: "text", title: "" });
    toast.success(language === "en" ? "Block added" : "Блок добавлен");
    loadSections(activeView);
  };

  const handleDeleteSection = async (sectionId: string) => {
    await api.delete(`/api/gta/sections/${sectionId}`);
    setDeleteSectionConfirm(null);
    toast.success(language === "en" ? "Block deleted" : "Блок удалён");
    if (activeView !== "overview" && activeView !== "settings") loadSections(activeView);
  };

  const handleUpdateSection = async (sectionId: string, config: Record<string, unknown>) => {
    await api.put(`/api/gta/sections/${sectionId}`, { config });
    if (activeView !== "overview" && activeView !== "settings") loadSections(activeView);
  };

  const handleReorder = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex(s => s.id === active.id);
    const newIndex = sections.findIndex(s => s.id === over.id);
    const reordered = arrayMove(sections, oldIndex, newIndex);
    setSections(reordered);
    await api.patch(`/api/gta/tabs/${activeView}/sections/reorder`, {
      section_ids: reordered.map(s => s.id),
    });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.put(`/api/gta/orgs/${orgId}`, settingsForm);
    setIsSettingsOpen(false);
    toast.success(language === "en" ? "Settings saved" : "Настройки сохранены");
    loadOrg();
  };

  const handleDeleteOrg = async () => {
    await api.delete(`/api/gta/orgs/${orgId}`);
    setDeleteOrgConfirm(false);
    toast.success(language === "en" ? "Organization deleted" : "Организация удалена");
    navigate(`/gta-rp/servers/${serverId}`);
  };

  if (loading) return <div className="animate-pulse space-y-4"><Card className="h-16 bg-card border" /><Card className="h-40 bg-card border" /></div>;

  const isCustomTab = activeView !== "overview" && activeView !== "settings";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <Button variant="ghost" className="mb-4 -ml-2"
          onClick={() => navigate(`/gta-rp/servers/${serverId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> {t.back}
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#e0015b]/10 dark:bg-[#e0015b]/20 flex items-center justify-center text-2xl overflow-hidden shrink-0">
            {org && isGtaIconImage(org.icon) ? (
              <img src={gtaIconUrl(org.icon)} alt="" className="w-full h-full object-cover" />
            ) : (
              org?.icon
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{org?.name}</h1>
            {org?.description && (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                <LinkifiedText text={org.description} language={language} />
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className={`
        flex items-center gap-1 border-b pb-0 overflow-x-auto
        transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}
      `}
        style={{ transitionDelay: "200ms" }}
      >
        <TabButton active={activeView === "overview"} onClick={() => setActiveView("overview")}>
          <Eye className="h-4 w-4" /> {t.overview}
        </TabButton>
        {tabs.map(tab => (
          <div key={tab.id} className="flex items-center group">
            <TabButton active={activeView === tab.id} onClick={() => setActiveView(tab.id)}>
              {tab.name}
            </TabButton>
            {!isPlayer && (
              <Button variant="ghost" size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity -ml-1"
                onClick={() => setDeleteTabConfirm({ id: tab.id, name: tab.name })}>
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
        {!isPlayer && tabs.length < 3 && (
          <Button variant="ghost" size="sm"
            className="text-xs"
            onClick={() => setIsTabDialogOpen(true)}>
            <Plus className="h-3 w-3 mr-1" /> {t.addTab}
          </Button>
        )}
        <div className="flex-1" />
        {!isPlayer && (
          <TabButton active={activeView === "settings"} onClick={() => setActiveView("settings")}>
            <Settings className="h-4 w-4" /> {t.settings}
          </TabButton>
        )}
      </div>

      {/* Content */}
      <div className={`transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{ transitionDelay: "300ms" }}>
        {activeView === "overview" && (
          <Card className="p-6 bg-card border">
            <h2 className="text-lg font-semibold text-foreground mb-3">{org?.name}</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {org?.description ? <LinkifiedText text={org.description} language={language} /> : t.noDescription}
            </p>
            {org?.full_description && (
              <p className="text-muted-foreground whitespace-pre-wrap mt-4 pt-4 border-t">
                <LinkifiedText text={org.full_description} language={language} />
              </p>
            )}
            <div className="mt-4 text-sm text-muted-foreground">
              {tabs.length} {t.addTab.toLowerCase().includes("tab") ? "custom tabs" : "вкладок"}
            </div>
          </Card>
        )}

        {activeView === "settings" && (
          <div className="space-y-4">
            <Card className="p-6 bg-card border">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t.editSettings}</h3>
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t.icon}</Label>
                  <IconPicker
                    value={settingsForm.icon}
                    onChange={icon => setSettingsForm(f => ({ ...f, icon }))}
                    defaultIcon="🏢"
                    language={language}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.name}</Label>
                  <Input value={settingsForm.name} onChange={e => setSettingsForm(f => ({...f, name: e.target.value}))}
                    required />
                </div>
                <div className="space-y-2">
                  <Label>{t.description}</Label>
                  <p className="text-xs text-muted-foreground">{t.descriptionHint}</p>
                  <Textarea value={settingsForm.description} onChange={e => setSettingsForm(f => ({...f, description: e.target.value}))}
                    className="min-h-[80px]" />
                </div>
                <div className="space-y-2">
                  <Label>{t.fullDescription}</Label>
                  <p className="text-xs text-muted-foreground">{t.fullDescriptionHint}</p>
                  <Textarea value={settingsForm.full_description} onChange={e => setSettingsForm(f => ({...f, full_description: e.target.value}))}
                    className="min-h-[120px]" />
                </div>
                <Button type="submit" className="text-white hover:opacity-90" style={{ background: 'linear-gradient(135deg, #e0015b, #f43f5e)' }}>{t.save}</Button>
              </form>
            </Card>
            <Card className="p-6 bg-card border-red-200 dark:border-red-900/30">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">{t.deleteOrg}</h3>
              <Button variant="destructive" onClick={() => setDeleteOrgConfirm(true)}>{t.deleteOrg}</Button>
            </Card>
          </div>
        )}

        {isCustomTab && (
          <div className="space-y-4">
            {!isPlayer && (
              <div className="flex justify-end">
                <Button size="sm" className="text-white hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #e0015b, #f43f5e)' }}
                  onClick={() => setIsSectionDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" /> {t.addSection}
                </Button>
              </div>
            )}

            {sections.length === 0 ? (
              <Card className="p-8 bg-card border text-center">
                <p className="text-muted-foreground">{t.noSections}</p>
              </Card>
            ) : (
              <DndContext collisionDetection={closestCenter} onDragEnd={handleReorder}>
                <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  {sections.map((sec, i) => (
                    <SectionRenderer key={sec.id} section={sec} language={language} isPlayer={isPlayer}
                      onDelete={() => setDeleteSectionConfirm({ id: sec.id, title: sec.title || SECTION_TYPES.find(st => st.type === sec.type)?.[language === "en" ? "labelEn" : "labelRu"] || sec.type })}
                      onUpdate={(config) => handleUpdateSection(sec.id, config)}
                      index={i} mounted={mounted} />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        )}
      </div>

      {/* Create Tab Dialog */}
      <Dialog open={isTabDialogOpen} onOpenChange={setIsTabDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-[#e0015b] dark:text-rose-400">{t.addTab}</DialogTitle></DialogHeader>
          <form onSubmit={handleCreateTab} className="space-y-4">
            <div className="space-y-2">
              <Label>{t.tabName}</Label>
              <Input value={tabName} onChange={e => setTabName(e.target.value)}
                required maxLength={100} />
            </div>
            {tabs.length >= 2 && <p className="text-xs text-yellow-500">{t.maxTabs}</p>}
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => setIsTabDialogOpen(false)}>{t.cancel}</Button>
              <Button type="submit" className="text-white hover:opacity-90" style={{ background: 'linear-gradient(135deg, #e0015b, #f43f5e)' }}>{t.save}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Section Dialog */}
      <Dialog open={isSectionDialogOpen} onOpenChange={setIsSectionDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-[#e0015b] dark:text-rose-400">{t.addSection}</DialogTitle></DialogHeader>
          <form onSubmit={handleCreateSection} className="space-y-4">
            <div>
              <Label>{t.sectionType}</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {SECTION_TYPES.map(st => (
                  <Button key={st.type} type="button"
                    variant={sectionForm.type === st.type ? "default" : "outline"}
                    className={sectionForm.type === st.type ? "text-white" : ""}
                    style={sectionForm.type === st.type ? { background: '#e0015b' } : undefined}
                    onClick={() => setSectionForm(f => ({...f, type: st.type}))}>
                    {st.icon}
                    <span className="ml-2">{language === "en" ? st.labelEn : st.labelRu}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.sectionTitle}</Label>
              <Input value={sectionForm.title} onChange={e => setSectionForm(f => ({...f, title: e.target.value}))} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => setIsSectionDialogOpen(false)}>{t.cancel}</Button>
              <Button type="submit" className="text-white hover:opacity-90" style={{ background: 'linear-gradient(135deg, #e0015b, #f43f5e)' }}>{t.save}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Tab Confirmation */}
      <AlertDialog open={!!deleteTabConfirm} onOpenChange={(open: boolean) => { if (!open) setDeleteTabConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === "en" ? "Delete tab?" : "Удалить вкладку?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? `Tab "${deleteTabConfirm?.name}" and all its blocks will be deleted.`
                : `Вкладка «${deleteTabConfirm?.name}» и все её блоки будут удалены.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteTabConfirm && handleDeleteTab(deleteTabConfirm.id)}>
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Section Confirmation */}
      <AlertDialog open={!!deleteSectionConfirm} onOpenChange={(open: boolean) => { if (!open) setDeleteSectionConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === "en" ? "Delete block?" : "Удалить блок?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? `Block "${deleteSectionConfirm?.title}" will be deleted.`
                : `Блок «${deleteSectionConfirm?.title}» будет удалён.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteSectionConfirm && handleDeleteSection(deleteSectionConfirm.id)}>
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Org Confirmation */}
      <AlertDialog open={deleteOrgConfirm} onOpenChange={setDeleteOrgConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteOrg}</AlertDialogTitle>
            <AlertDialogDescription>{t.deleteOrgConfirm}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteOrg}>
              {t.deleteOrg}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap
        ${active
          ? "border-[#e0015b] text-[#e0015b] dark:border-rose-400 dark:text-rose-400"
          : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
        }
      `}
    >
      {children}
    </button>
  );
}

function SectionRenderer({ section, language, isPlayer, onDelete, onUpdate, index, mounted }: {
  section: Section;
  language: string;
  isPlayer: boolean;
  onDelete: () => void;
  onUpdate: (config: Record<string, unknown>) => void;
  index: number;
  mounted: boolean;
}) {
  const typeInfo = SECTION_TYPES.find(st => st.type === section.type);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState((section.config as { content?: string }).content || "");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const handleSave = () => {
    onUpdate({ ...section.config, content });
    setEditing(false);
  };

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={sortableStyle} {...attributes}>
      <Card className={`
        p-5 bg-card border group
        transition-all duration-500
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
        style={{ transitionDelay: `${400 + index * 100}ms` }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {!isPlayer && (
              <button {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none">
                <GripVertical className="h-4 w-4" />
              </button>
            )}
            <div className="text-[#e0015b] dark:text-rose-400">{typeInfo?.icon}</div>
          <span className="text-sm font-medium text-foreground">
            {section.title || (language === "en" ? typeInfo?.labelEn : typeInfo?.labelRu)}
          </span>
          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-[#e0015b]/10 dark:bg-[#e0015b]/20">
            {section.type}
          </span>
        </div>
        {!isPlayer && (
          <Button variant="ghost" size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {section.type === "text" && (
        <div>
          {editing ? (
            <div className="space-y-2">
              <Textarea value={content} onChange={e => setContent(e.target.value)}
                className="min-h-[100px]" />
              <div className="flex gap-2">
                <Button size="sm" className="text-white hover:opacity-90" style={{ background: '#e0015b' }} onClick={handleSave}>
                  {language === "en" ? "Save" : "Сохранить"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                  {language === "en" ? "Cancel" : "Отмена"}
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`text-muted-foreground text-sm whitespace-pre-wrap min-h-[40px] ${!isPlayer ? "cursor-pointer hover:text-foreground" : ""}`}
              onClick={() => !isPlayer && setEditing(true)}>
              {content || (isPlayer
                ? (language === "en" ? "No content" : "Нет содержимого")
                : (language === "en" ? "Click to edit..." : "Нажмите для редактирования..."))}
            </div>
          )}
        </div>
      )}

      {section.type === "document" && (
        <div>
          {editing ? (
            <div className="space-y-2">
              <Textarea value={content} onChange={e => setContent(e.target.value)}
                className="min-h-[150px] font-mono text-sm" />
              <div className="flex gap-2">
                <Button size="sm" className="text-white hover:opacity-90" style={{ background: '#e0015b' }} onClick={handleSave}>
                  {language === "en" ? "Save" : "Сохранить"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                  {language === "en" ? "Cancel" : "Отмена"}
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`text-muted-foreground text-sm whitespace-pre-wrap min-h-[40px] p-3 bg-muted/50 rounded border ${!isPlayer ? "cursor-pointer hover:text-foreground" : ""}`}
              onClick={() => !isPlayer && setEditing(true)}>
              {content || (isPlayer
                ? (language === "en" ? "No content" : "Нет содержимого")
                : (language === "en" ? "Click to edit document..." : "Нажмите для редактирования документа..."))}
            </div>
          )}
        </div>
      )}

      {section.type === "members" && (
        <MembersBlock
          config={section.config as unknown as MembersConfig}
          language={language}
          isPlayer={isPlayer}
          onUpdate={onUpdate}
        />
      )}

      {section.type === "form" && (
        <FormBlock
          config={section.config as unknown as FormConfig}
          language={language}
          isPlayer={isPlayer}
          onUpdate={onUpdate}
        />
      )}
    </Card>
    </div>
  );
}

function getDefaultConfig(type: string): Record<string, unknown> {
  switch (type) {
    case "members": return { columns: ["name", "rank"], ranks: [], members: [] };
    case "text": return { content: "" };
    case "form": return { fields: [] };
    case "document": return { content: "", is_pinned: false };
    default: return {};
  }
}

interface MembersConfig {
  columns: string[];
  ranks: string[];
  members: Array<{ id: string; name: string; rank: string }>;
}

function MembersBlock({ config, language, isPlayer, onUpdate }: {
  config: MembersConfig;
  language: string;
  isPlayer: boolean;
  onUpdate: (config: Record<string, unknown>) => void;
}) {
  const [newName, setNewName] = useState("");
  const [newRank, setNewRank] = useState("");
  const [showRankSettings, setShowRankSettings] = useState(false);
  const [newRankName, setNewRankName] = useState("");
  const [deleteMemberConfirm, setDeleteMemberConfirm] = useState<{ id: string; name: string } | null>(null);
  const [deleteRankConfirm, setDeleteRankConfirm] = useState<string | null>(null);

  const members = config.members || [];
  const ranks = config.ranks || [];

  const t = {
    name: language === "en" ? "Name" : "Имя",
    rank: language === "en" ? "Rank" : "Ранг",
    addMember: language === "en" ? "Add" : "Добавить",
    noMembers: language === "en" ? "No members yet" : "Участников пока нет",
    namePlaceholder: language === "en" ? "Enter name..." : "Введите имя...",
    selectRank: language === "en" ? "Select rank" : "Выберите ранг",
    rankPlaceholder: language === "en" ? "Rank name..." : "Название ранга...",
    noRanks: language === "en" ? "Add ranks first" : "Сначала добавьте ранги",
    ranksLabel: language === "en" ? "Ranks" : "Ранги",
    membersCount: language === "en" ? "members" : "участников",
  };

  const addMember = () => {
    if (!newName.trim()) return;
    const updated = {
      ...config,
      members: [...members, { id: crypto.randomUUID(), name: newName.trim(), rank: newRank }],
    };
    onUpdate(updated);
    setNewName("");
    setNewRank("");
    toast.success(language === "en" ? "Member added" : "Участник добавлен");
  };

  const removeMember = (id: string) => {
    onUpdate({ ...config, members: members.filter(m => m.id !== id) });
    setDeleteMemberConfirm(null);
    toast.success(language === "en" ? "Member removed" : "Участник удалён");
  };

  const addRank = () => {
    if (!newRankName.trim() || ranks.includes(newRankName.trim())) return;
    onUpdate({ ...config, ranks: [...ranks, newRankName.trim()] });
    setNewRankName("");
    toast.success(language === "en" ? "Rank added" : "Ранг добавлен");
  };

  const removeRank = (rank: string) => {
    onUpdate({ ...config, ranks: ranks.filter(r => r !== rank) });
    setDeleteRankConfirm(null);
    toast.success(language === "en" ? "Rank deleted" : "Ранг удалён");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {members.length} {t.membersCount}
        </span>
        {!isPlayer && (
          <Button variant="ghost" size="sm" className="text-xs h-7"
            onClick={() => setShowRankSettings(!showRankSettings)}>
            <Settings className="h-3 w-3 mr-1" />
            {t.ranksLabel}
          </Button>
        )}
      </div>

      {!isPlayer && showRankSettings && (
        <div className="p-3 rounded border bg-muted/30 space-y-2">
          <p className="text-xs font-medium text-foreground">{t.ranksLabel}</p>
          <div className="flex flex-wrap gap-1.5">
            {ranks.map(rank => (
              <span key={rank} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#e0015b]/10 text-[#e0015b] dark:text-rose-400">
                {rank}
                <button onClick={() => setDeleteRankConfirm(rank)} className="hover:text-red-600 dark:hover:text-red-400">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {ranks.length === 0 && (
              <span className="text-xs text-muted-foreground">{t.noRanks}</span>
            )}
          </div>
          <div className="flex gap-2">
            <Input value={newRankName} onChange={e => setNewRankName(e.target.value)}
              placeholder={t.rankPlaceholder} className="h-7 text-xs"
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addRank(); } }} />
            <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={addRank}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">{t.noMembers}</p>
      ) : (
        <div className="rounded border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">{t.name}</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">{t.rank}</th>
                {!isPlayer && <th className="w-10" />}
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-2 text-foreground">{member.name}</td>
                  <td className="px-3 py-2">
                    {member.rank ? (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-[#e0015b]/10 text-[#e0015b] dark:text-rose-400">
                        {member.rank}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  {!isPlayer && (
                    <td className="px-2 py-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                        onClick={() => setDeleteMemberConfirm({ id: member.id, name: member.name })}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isPlayer && (
        <div className="flex gap-2">
          <Input value={newName} onChange={e => setNewName(e.target.value)}
            placeholder={t.namePlaceholder} className="h-8 text-sm flex-1"
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addMember(); } }} />
          <select
            value={newRank}
            onChange={e => setNewRank(e.target.value)}
            className="h-8 px-2 rounded border text-sm bg-background text-foreground"
          >
            <option value="">{ranks.length === 0 ? t.noRanks : t.selectRank}</option>
            {ranks.map(rank => (
              <option key={rank} value={rank}>{rank}</option>
            ))}
          </select>
          <Button size="sm" className="h-8 text-white hover:opacity-90" style={{ background: '#e0015b' }}
            onClick={addMember} disabled={!newName.trim()}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            {t.addMember}
          </Button>
        </div>
      )}

      {/* Delete Rank Confirmation */}
      <AlertDialog open={!!deleteRankConfirm} onOpenChange={(open: boolean) => { if (!open) setDeleteRankConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === "en" ? "Delete rank?" : "Удалить ранг?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? `Rank "${deleteRankConfirm}" will be removed.`
                : `Ранг «${deleteRankConfirm}» будет удалён.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === "en" ? "Cancel" : "Отмена"}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteRankConfirm && removeRank(deleteRankConfirm)}>
              {language === "en" ? "Delete" : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Member Confirmation */}
      <AlertDialog open={!!deleteMemberConfirm} onOpenChange={(open: boolean) => { if (!open) setDeleteMemberConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === "en" ? "Remove member?" : "Удалить участника?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? `Remove "${deleteMemberConfirm?.name}" from the list?`
                : `Удалить «${deleteMemberConfirm?.name}» из списка?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === "en" ? "Cancel" : "Отмена"}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteMemberConfirm && removeMember(deleteMemberConfirm.id)}>
              {language === "en" ? "Remove" : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  required: boolean;
  options?: string[];
}

interface FormConfig {
  fields: FormField[];
}

const FIELD_TYPES = [
  { type: "text", labelEn: "Text", labelRu: "Текст" },
  { type: "number", labelEn: "Number", labelRu: "Число" },
  { type: "date", labelEn: "Date", labelRu: "Дата" },
  { type: "select", labelEn: "Select", labelRu: "Выбор" },
] as const;

function FormBlock({ config, language, isPlayer, onUpdate }: {
  config: FormConfig;
  language: string;
  isPlayer: boolean;
  onUpdate: (config: Record<string, unknown>) => void;
}) {
  const [isPreview, setIsPreview] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editField, setEditField] = useState<FormField | null>(null);
  const [fieldForm, setFieldForm] = useState({ label: "", type: "text" as string, required: false, options: "" });
  const [deleteFieldConfirm, setDeleteFieldConfirm] = useState<{ id: string; label: string } | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const fields = config.fields || [];

  const t = {
    builder: language === "en" ? "Builder" : "Конструктор",
    preview: language === "en" ? "Preview" : "Предпросмотр",
    addField: language === "en" ? "Add Field" : "Добавить поле",
    editFieldTitle: language === "en" ? "Edit Field" : "Редактировать поле",
    fieldLabel: language === "en" ? "Label" : "Название",
    fieldType: language === "en" ? "Type" : "Тип",
    required: language === "en" ? "Required" : "Обязательное",
    options: language === "en" ? "Options (one per line)" : "Варианты (по одному на строку)",
    save: language === "en" ? "Save" : "Сохранить",
    cancel: language === "en" ? "Cancel" : "Отмена",
    noFields: language === "en" ? "No fields yet. Add one!" : "Полей пока нет. Добавьте!",
    fieldsCount: language === "en" ? "fields" : "полей",
    labelPlaceholder: language === "en" ? "Field name..." : "Название поля...",
    optionsPlaceholder: language === "en" ? "Option 1\nOption 2\nOption 3" : "Вариант 1\nВариант 2\nВариант 3",
    selectPlaceholder: language === "en" ? "Select..." : "Выберите...",
    submit: language === "en" ? "Submit" : "Отправить",
    fillRequired: language === "en" ? "Fill in all required fields" : "Заполните все обязательные поля",
    testModeNotice: language === "en"
      ? "Test mode — this submission is not saved anywhere"
      : "Тестовый режим — эта заявка нигде не сохраняется",
    noFieldsPlayer: language === "en" ? "This form has no fields yet" : "В этой форме пока нет полей",
  };

  const setAnswer = (id: string, value: string) => setAnswers(a => ({ ...a, [id]: value }));

  const handleTestSubmit = () => {
    const missing = fields.filter(f => f.required && !(answers[f.id] ?? "").trim());
    if (missing.length > 0) {
      toast.error(t.fillRequired);
      return;
    }
    toast.info(t.testModeNotice);
  };

  const openAdd = () => {
    setFieldForm({ label: "", type: "text", required: false, options: "" });
    setEditField(null);
    setIsAddOpen(true);
  };

  const openEdit = (field: FormField) => {
    setFieldForm({
      label: field.label,
      type: field.type,
      required: field.required,
      options: (field.options || []).join("\n"),
    });
    setEditField(field);
    setIsAddOpen(true);
  };

  const handleSaveField = () => {
    if (!fieldForm.label.trim()) return;
    const field: FormField = {
      id: editField?.id || crypto.randomUUID(),
      label: fieldForm.label.trim(),
      type: fieldForm.type as FormField["type"],
      required: fieldForm.required,
      options: fieldForm.type === "select"
        ? fieldForm.options.split("\n").map(o => o.trim()).filter(Boolean)
        : undefined,
    };

    let updatedFields: FormField[];
    if (editField) {
      updatedFields = fields.map(f => f.id === editField.id ? field : f);
      toast.success(language === "en" ? "Field updated" : "Поле обновлено");
    } else {
      updatedFields = [...fields, field];
      toast.success(language === "en" ? "Field added" : "Поле добавлено");
    }

    onUpdate({ ...config, fields: updatedFields });
    setIsAddOpen(false);
  };

  const removeField = (id: string) => {
    onUpdate({ ...config, fields: fields.filter(f => f.id !== id) });
    setDeleteFieldConfirm(null);
    toast.success(language === "en" ? "Field deleted" : "Поле удалено");
  };

  if (isPlayer) {
    return (
      <div className="space-y-3 p-3 rounded border bg-muted/20">
        {fields.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">{t.noFieldsPlayer}</p>
        ) : (
          <>
            {fields.map(field => (
              <div key={field.id} className="space-y-1">
                <Label className="text-sm">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.type === "text" && (
                  <Input value={answers[field.id] ?? ""} onChange={e => setAnswer(field.id, e.target.value)}
                    placeholder={field.label} className="h-8 text-sm" />
                )}
                {field.type === "number" && (
                  <Input value={answers[field.id] ?? ""} onChange={e => setAnswer(field.id, e.target.value)}
                    type="number" placeholder="0" className="h-8 text-sm w-32" />
                )}
                {field.type === "date" && (
                  <Input value={answers[field.id] ?? ""} onChange={e => setAnswer(field.id, e.target.value)}
                    type="date" className="h-8 text-sm w-44" />
                )}
                {field.type === "select" && (
                  <select value={answers[field.id] ?? ""} onChange={e => setAnswer(field.id, e.target.value)}
                    className="w-full h-8 px-2 rounded border text-sm bg-background text-foreground">
                    <option value="">{t.selectPlaceholder}</option>
                    {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                )}
              </div>
            ))}
            <Button size="sm" className="text-white hover:opacity-90" style={{ background: 'linear-gradient(135deg, #e0015b, #f43f5e)' }}
              onClick={handleTestSubmit}>
              {t.submit}
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {fields.length} {t.fieldsCount}
        </span>
        <div className="flex gap-1">
          <Button variant={isPreview ? "ghost" : "default"} size="sm"
            className={`text-xs h-7 ${!isPreview ? "text-white" : ""}`}
            style={!isPreview ? { background: '#e0015b' } : undefined}
            onClick={() => setIsPreview(false)}>
            <Settings className="h-3 w-3 mr-1" />
            {t.builder}
          </Button>
          <Button variant={isPreview ? "default" : "ghost"} size="sm"
            className={`text-xs h-7 ${isPreview ? "text-white" : ""}`}
            style={isPreview ? { background: '#e0015b' } : undefined}
            onClick={() => setIsPreview(true)}>
            <Eye className="h-3 w-3 mr-1" />
            {t.preview}
          </Button>
        </div>
      </div>

      {!isPreview ? (
        <div className="space-y-2">
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">{t.noFields}</p>
          ) : (
            fields.map(field => (
              <div key={field.id} className="flex items-center justify-between p-2 rounded border hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm text-foreground truncate">{field.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-[#e0015b]/10 text-[#e0015b] dark:text-rose-400 shrink-0">
                    {FIELD_TYPES.find(ft => ft.type === field.type)?.[language === "en" ? "labelEn" : "labelRu"]}
                  </span>
                  {field.required && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 shrink-0">
                      {t.required}
                    </span>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(field)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                    onClick={() => setDeleteFieldConfirm({ id: field.id, label: field.label })}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={openAdd}>
            <Plus className="h-3 w-3 mr-1" /> {t.addField}
          </Button>
        </div>
      ) : (
        <div className="space-y-3 p-3 rounded border bg-muted/20">
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">{t.noFields}</p>
          ) : (
            fields.map(field => (
              <div key={field.id} className="space-y-1">
                <Label className="text-sm">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.type === "text" && <Input disabled placeholder={field.label} className="h-8 text-sm" />}
                {field.type === "number" && <Input disabled type="number" placeholder="0" className="h-8 text-sm w-32" />}
                {field.type === "date" && <Input disabled type="date" className="h-8 text-sm w-44" />}
                {field.type === "select" && (
                  <select disabled className="w-full h-8 px-2 rounded border text-sm bg-background text-muted-foreground">
                    <option>{t.selectPlaceholder}</option>
                    {(field.options || []).map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#e0015b] dark:text-rose-400">
              {editField ? t.editFieldTitle : t.addField}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.fieldLabel}</Label>
              <Input value={fieldForm.label} onChange={e => setFieldForm(f => ({ ...f, label: e.target.value }))}
                placeholder={t.labelPlaceholder} />
            </div>
            <div>
              <Label>{t.fieldType}</Label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {FIELD_TYPES.map(ft => (
                  <Button key={ft.type} type="button" size="sm"
                    variant={fieldForm.type === ft.type ? "default" : "outline"}
                    className={fieldForm.type === ft.type ? "text-white" : ""}
                    style={fieldForm.type === ft.type ? { background: '#e0015b' } : undefined}
                    onClick={() => setFieldForm(f => ({ ...f, type: ft.type }))}>
                    {language === "en" ? ft.labelEn : ft.labelRu}
                  </Button>
                ))}
              </div>
            </div>
            {fieldForm.type === "select" && (
              <div className="space-y-2">
                <Label>{t.options}</Label>
                <Textarea value={fieldForm.options} onChange={e => setFieldForm(f => ({ ...f, options: e.target.value }))}
                  className="min-h-[80px] text-sm" placeholder={t.optionsPlaceholder} />
              </div>
            )}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="field-required" checked={fieldForm.required}
                onChange={e => setFieldForm(f => ({ ...f, required: e.target.checked }))}
                className="rounded border" />
              <label htmlFor="field-required" className="text-sm text-foreground cursor-pointer">{t.required}</label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setIsAddOpen(false)}>{t.cancel}</Button>
              <Button className="text-white hover:opacity-90" style={{ background: 'linear-gradient(135deg, #e0015b, #f43f5e)' }}
                onClick={handleSaveField} disabled={!fieldForm.label.trim()}>
                {t.save}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteFieldConfirm} onOpenChange={(open: boolean) => { if (!open) setDeleteFieldConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === "en" ? "Delete field?" : "Удалить поле?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? `Field "${deleteFieldConfirm?.label}" will be deleted.`
                : `Поле «${deleteFieldConfirm?.label}» будет удалено.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === "en" ? "Cancel" : "Отмена"}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteFieldConfirm && removeField(deleteFieldConfirm.id)}>
              {language === "en" ? "Delete" : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
