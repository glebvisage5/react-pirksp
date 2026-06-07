import { useState, useEffect } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { useLanguage } from "../../../lib/language-context";
import { useUser } from "../../../lib/user-context";
import { toast } from "sonner@2.0.3";
import {
  Loader2, FileText, Plus, Search, MoreVertical, Eye, Edit,
  Trash2, Clock, User, FolderKanban, History, Save, Type,
  AlignLeft, List, Code, X,
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog";
import { ScrollArea } from "../../ui/scroll-area";
import { apiTeams, type Spec, type SpecVersion, type Project } from "../../../api/teams";

interface TeamSpecsProps {
  teamId: string;
  userRole?: "Team Leader" | "Moderator" | "Member" | "Viewer";
}

type BlockType = "heading" | "text" | "list" | "code";

interface Block {
  id: string;
  type: BlockType;
  content: string;
}

function makeBlock(type: BlockType): Block {
  return { id: String(Date.now() + Math.random()), type, content: "" };
}

function renderBlockPreview(block: Block) {
  switch (block.type) {
    case "heading":
      return <h3 className="text-lg font-bold">{block.content || <span className="text-muted-foreground italic">Заголовок...</span>}</h3>;
    case "list":
      return (
        <ul className="list-disc list-inside space-y-1 text-sm">
          {(block.content || "").split("\n").filter(Boolean).map((line, i) => (
            <li key={i}>{line}</li>
          ))}
          {!block.content && <li className="text-muted-foreground italic">Пункт списка...</li>}
        </ul>
      );
    case "code":
      return <pre className="bg-muted rounded p-3 text-xs font-mono overflow-x-auto">{block.content || "// код..."}</pre>;
    default:
      return <p className="text-sm">{block.content || <span className="text-muted-foreground italic">Текст...</span>}</p>;
  }
}

export function TeamSpecs({ teamId, userRole = "Team Leader" }: TeamSpecsProps) {
  const { language } = useLanguage();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // dialogs
  const [viewSpec, setViewSpec] = useState<Spec | null>(null);
  const [editSpec, setEditSpec] = useState<Spec | null>(null);
  const [versionsSpec, setVersionsSpec] = useState<Spec | null>(null);
  const [versions, setVersions] = useState<SpecVersion[]>([]);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [specToDelete, setSpecToDelete] = useState<Spec | null>(null);

  // editor state
  const [editTitle, setEditTitle] = useState("");
  const [editBlocks, setEditBlocks] = useState<Block[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([apiTeams.specs(teamId), apiTeams.projects(teamId)])
      .then(([s, p]) => { setSpecs(s); setProjects(p); })
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [teamId]);

  const t = {
    specifications: language === "en" ? "Technical Specifications" : "Технические задания",
    subtitle: language === "en" ? "Manage team specifications and requirements" : "Управление техническими заданиями команды",
    createSpec: language === "en" ? "Create Specification" : "Создать ТЗ",
    search: language === "en" ? "Search specifications..." : "Поиск ТЗ...",
    filterAll: language === "en" ? "All Projects" : "Все проекты",
    project: language === "en" ? "Project" : "Проект",
    author: language === "en" ? "Author" : "Автор",
    lastModified: language === "en" ? "Last Modified" : "Изменено",
    version: language === "en" ? "Version" : "Версия",
    blocks: language === "en" ? "Blocks" : "Блоков",
    view: language === "en" ? "View" : "Просмотр",
    edit: language === "en" ? "Edit" : "Редактировать",
    versions: language === "en" ? "Versions" : "Версии",
    delete: language === "en" ? "Delete" : "Удалить",
    noSpecs: language === "en" ? "No specifications found" : "ТЗ не найдены",
    createFirst: language === "en" ? "Create your first specification" : "Создайте первое ТЗ",
    specTitle: language === "en" ? "Title" : "Название",
    cancel: language === "en" ? "Cancel" : "Отмена",
    create: language === "en" ? "Create" : "Создать",
    save: language === "en" ? "Save" : "Сохранить",
    close: language === "en" ? "Close" : "Закрыть",
    addBlock: language === "en" ? "Add Block" : "Добавить блок",
    editTitle: language === "en" ? "Edit Specification" : "Редактировать ТЗ",
    versionsTitle: language === "en" ? "Version History" : "История версий",
    noVersions: language === "en" ? "No saved versions yet" : "Версий пока нет",
    savedBy: language === "en" ? "Saved by" : "Сохранено",
    noContent: language === "en" ? "This specification has no content blocks yet." : "В этом ТЗ пока нет блоков контента.",
  };

  const canEdit = userRole === "Team Leader" || userRole === "Moderator";

  const isOwner = (spec: Spec) => spec.created_by === user?.id;

  const canEditSpec = (spec: Spec) => canEdit && isOwner(spec);

  const filteredSpecs = specs.filter(spec => {
    const matchesSearch =
      spec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (spec.author_name ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = filterProject === "all" || spec.project_id === filterProject;
    return matchesSearch && matchesProject;
  });

  const openEditor = (spec: Spec) => {
    setEditTitle(spec.title);
    const raw = spec.blocks as { id?: string; type?: string; content?: string }[];
    setEditBlocks(raw.length > 0
      ? raw.map(b => ({ id: b.id ?? String(Math.random()), type: (b.type ?? "text") as BlockType, content: b.content ?? "" }))
      : [makeBlock("heading"), makeBlock("text")]
    );
    setEditSpec(spec);
  };

  const openVersions = async (spec: Spec) => {
    setVersionsSpec(spec);
    setVersionsLoading(true);
    try {
      const v = await apiTeams.specVersions(spec.id);
      setVersions(v);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setVersionsLoading(false);
    }
  };

  const handleSaveSpec = async () => {
    if (!editSpec) return;
    setSaving(true);
    try {
      const updated = await apiTeams.updateSpec(editSpec.id, {
        title: editTitle,
        blocks: editBlocks,
      });
      setSpecs(prev => prev.map(s => s.id === editSpec.id ? updated : s));
      setEditSpec(null);
      toast.success(language === "en" ? "Specification saved" : "ТЗ сохранено");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSpec = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const projectId = fd.get("project_id") as string;
    try {
      const created = await apiTeams.createSpec(teamId, {
        title: fd.get("title") as string,
        project_id: projectId || undefined,
      });
      setSpecs(prev => [created, ...prev]);
      setIsCreateOpen(false);
      toast.success(language === "en" ? "Specification created" : "ТЗ создано");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!specToDelete) return;
    try {
      await apiTeams.deleteSpec(specToDelete.id);
      setSpecs(prev => prev.filter(s => s.id !== specToDelete.id));
      toast.success(language === "en" ? `Deleted: ${specToDelete.title}` : `Удалено: ${specToDelete.title}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setSpecToDelete(null);
    }
  };

  const addBlock = (type: BlockType) => setEditBlocks(prev => [...prev, makeBlock(type)]);
  const removeBlock = (id: string) => setEditBlocks(prev => prev.filter(b => b.id !== id));
  const updateBlock = (id: string, content: string) =>
    setEditBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />{t.specifications}
        </h2>
        <p className="text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t.search} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-full sm:w-64"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.filterAll}</SelectItem>
              {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {canEdit && (
          <Button onClick={() => setIsCreateOpen(true)} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all w-full lg:w-auto">
            <Plus className="h-4 w-4 mr-2" />{t.createSpec}
          </Button>
        )}
      </div>

      {filteredSpecs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredSpecs.map(spec => (
            <Card key={spec.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">{spec.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        {spec.project_title && (
                          <div className="flex items-center gap-1">
                            <FolderKanban className="h-3.5 w-3.5" /><span>{spec.project_title}</span>
                          </div>
                        )}
                        {spec.author_name && (
                          <><span>•</span><div className="flex items-center gap-1"><User className="h-3.5 w-3.5" /><span>{spec.author_name}</span></div></>
                        )}
                        {isOwner(spec) && (
                          <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-300">
                            {language === "en" ? "Owner" : "Владелец"}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewSpec(spec)}>
                          <Eye className="h-4 w-4 mr-2" />{t.view}
                        </DropdownMenuItem>
                        {canEditSpec(spec) && (
                          <DropdownMenuItem onClick={() => openEditor(spec)}>
                            <Edit className="h-4 w-4 mr-2" />{t.edit}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => openVersions(spec)}>
                          <History className="h-4 w-4 mr-2" />{t.versions}
                        </DropdownMenuItem>
                        {canEdit && isOwner(spec) && (
                          <DropdownMenuItem className="text-red-600" onClick={() => setSpecToDelete(spec)}>
                            <Trash2 className="h-4 w-4 mr-2" />{t.delete}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{new Date(spec.updated_at).toLocaleDateString(language === "en" ? "en-GB" : "ru-RU")}</span>
                    </div>
                    <Badge variant="outline">{t.version} {spec.version}</Badge>
                    <Badge variant="secondary">{(spec.blocks as unknown[]).length} {t.blocks}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-semibold mb-2">{t.noSpecs}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t.createFirst}</p>
            {canEdit && (
              <Button onClick={() => setIsCreateOpen(true)} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <Plus className="h-4 w-4 mr-2" />{t.createSpec}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* View Dialog */}
      <Dialog open={!!viewSpec} onOpenChange={open => !open && setViewSpec(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />{viewSpec?.title}
            </DialogTitle>
            <DialogDescription>
              {viewSpec?.author_name && `${t.author}: ${viewSpec.author_name}`}
              {viewSpec?.project_title && ` • ${viewSpec.project_title}`}
              {viewSpec && ` • v${viewSpec.version}`}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 mt-4">
            {viewSpec && (viewSpec.blocks as Block[]).length > 0 ? (
              <div className="space-y-4 pr-4">
                {(viewSpec.blocks as Block[]).map((block, i) => (
                  <div key={block.id ?? i}>{renderBlockPreview(block)}</div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">{t.noContent}</p>
            )}
          </ScrollArea>
          <DialogFooter className="mt-4">
            {viewSpec && canEditSpec(viewSpec) && (
              <Button variant="outline" onClick={() => { setViewSpec(null); openEditor(viewSpec); }}>
                <Edit className="h-4 w-4 mr-2" />{t.edit}
              </Button>
            )}
            <Button onClick={() => setViewSpec(null)}>{t.close}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editSpec} onOpenChange={open => !open && setEditSpec(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{t.editTitle}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div className="space-y-2">
              <Label>{t.specTitle}</Label>
              <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t.addBlock}</Label>
              <div className="flex flex-wrap gap-2">
                {([
                  { type: "heading" as BlockType, icon: <Type className="h-3 w-3" />, label: language === "en" ? "Heading" : "Заголовок" },
                  { type: "text" as BlockType, icon: <AlignLeft className="h-3 w-3" />, label: language === "en" ? "Text" : "Текст" },
                  { type: "list" as BlockType, icon: <List className="h-3 w-3" />, label: language === "en" ? "List" : "Список" },
                  { type: "code" as BlockType, icon: <Code className="h-3 w-3" />, label: language === "en" ? "Code" : "Код" },
                ] as const).map(({ type, icon, label }) => (
                  <Button key={type} variant="outline" size="sm" onClick={() => addBlock(type)}>
                    {icon}<span className="ml-1">{label}</span>
                  </Button>
                ))}
              </div>
            </div>
            {editBlocks.map(block => (
              <Card key={block.id} className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs capitalize">{block.type}</Badge>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeBlock(block.id)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <Textarea
                  value={block.content}
                  onChange={e => updateBlock(block.id, e.target.value)}
                  rows={block.type === "code" ? 4 : 2}
                  className={block.type === "code" ? "font-mono text-sm" : ""}
                  placeholder={
                    block.type === "heading" ? (language === "en" ? "Heading text..." : "Текст заголовка...") :
                    block.type === "list" ? (language === "en" ? "One item per line..." : "Один пункт на строку...") :
                    block.type === "code" ? "// code..." :
                    (language === "en" ? "Paragraph text..." : "Текст абзаца...")
                  }
                />
              </Card>
            ))}
          </div>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={() => setEditSpec(null)}>{t.cancel}</Button>
            <Button onClick={handleSaveSpec} disabled={saving} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Versions Dialog */}
      <Dialog open={!!versionsSpec} onOpenChange={open => !open && setVersionsSpec(null)}>
        <DialogContent className="max-w-lg max-h-[70vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />{t.versionsTitle}
            </DialogTitle>
            <DialogDescription>{versionsSpec?.title}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 mt-2">
            {versionsLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : versions.length > 0 ? (
              <div className="space-y-3 pr-4">
                {versions.map(v => (
                  <Card key={v.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge>{t.version} {v.version}</Badge>
                          {v.saved_by_name && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <User className="h-3 w-3" />{v.saved_by_name}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(v.saved_at).toLocaleString(language === "en" ? "en-GB" : "ru-RU")}
                        </p>
                      </div>
                      <Badge variant="secondary">{(v.blocks as unknown[]).length} {t.blocks}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">{t.noVersions}</p>
            )}
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button onClick={() => setVersionsSpec(null)}>{t.close}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.createSpec}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSpec} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spec-title">{t.specTitle}</Label>
              <Input id="spec-title" name="title" required placeholder={language === "en" ? "API Requirements v1.0" : "Требования к API v1.0"} />
            </div>
            <div className="space-y-2">
              <Label>{t.project}</Label>
              <Select name="project_id">
                <SelectTrigger><SelectValue placeholder={t.filterAll} /></SelectTrigger>
                <SelectContent>
                  {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>{t.cancel}</Button>
              <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">{t.create}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!specToDelete} onOpenChange={open => !open && setSpecToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === "en" ? "Delete Specification?" : "Удалить ТЗ?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? `Are you sure you want to delete "${specToDelete?.title}"? This cannot be undone.`
                : `Вы уверены, что хотите удалить "${specToDelete?.title}"? Это нельзя отменить.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">{t.delete}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
