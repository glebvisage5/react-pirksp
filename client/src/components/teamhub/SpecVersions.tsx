import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useLanguage } from "../../lib/language-context";
import { 
  Clock, 
  GitBranch,
  Eye,
  RotateCcw,
  User,
  FileText,
  MessageSquare,
  Calendar,
  ChevronDown,
  ChevronRight,
  Download
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

interface Version {
  id: string;
  version: string;
  createdAt: string;
  author: string;
  comment: string;
  changes: string[];
  isCurrent: boolean;
}

export function SpecVersions() {
  const { language } = useLanguage();
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());

  const [versions] = useState<Version[]>([
    {
      id: "v2.0",
      version: "2.0",
      createdAt: "2024-02-15 14:30",
      author: "Иван Петров",
      comment: language === "en" ? "Major update with new architecture section" : "Крупное обновление с новым разделом архитектуры",
      changes: [
        language === "en" ? "Added architecture section" : "Добавлен раздел архитектуры",
        language === "en" ? "Updated functional requirements" : "Обновлены функциональные требования",
        language === "en" ? "Added API specifications" : "Добавлены спецификации API",
      ],
      isCurrent: true,
    },
    {
      id: "v1.5",
      version: "1.5",
      createdAt: "2024-02-10 11:20",
      author: "Мария Сидорова",
      comment: language === "en" ? "Updated timeline and team structure" : "Обновлены сроки и структура команды",
      changes: [
        language === "en" ? "Modified project timeline" : "Изменён график проекта",
        language === "en" ? "Added new team members" : "Добавлены новые члены команды",
        language === "en" ? "Updated risk assessment" : "Обновлена оценка рисков",
      ],
      isCurrent: false,
    },
    {
      id: "v1.0",
      version: "1.0",
      createdAt: "2024-02-01 09:00",
      author: "Иван Петров",
      comment: language === "en" ? "Initial specification version" : "Начальная версия спецификации",
      changes: [
        language === "en" ? "Created project overview" : "Создан обзор проекта",
        language === "en" ? "Defined goals and objectives" : "Определены цели и задачи",
        language === "en" ? "Listed functional requirements" : "Перечислены функциональные требования",
      ],
      isCurrent: false,
    },
  ]);

  const t = {
    versions: language === "en" ? "Version History" : "История версий",
    subtitle: language === "en" ? "View and manage specification versions" : "Просмотр и управление версиями спецификации",
    currentVersion: language === "en" ? "Current Version" : "Текущая версия",
    version: language === "en" ? "Version" : "Версия",
    author: language === "en" ? "Author" : "Автор",
    date: language === "en" ? "Date" : "Дата",
    comment: language === "en" ? "Comment" : "Комментарий",
    changes: language === "en" ? "Changes" : "Изменения",
    viewVersion: language === "en" ? "View" : "Просмотр",
    restore: language === "en" ? "Restore" : "Восстановить",
    compare: language === "en" ? "Compare" : "Сравнить",
    download: language === "en" ? "Download" : "Скачать",
    showChanges: language === "en" ? "Show Changes" : "Показать изменения",
    hideChanges: language === "en" ? "Hide Changes" : "Скрыть изменения",
    restoreConfirm: language === "en" ? "Restore this version?" : "Восстановить эту версию?",
    restoreDesc: language === "en" 
      ? "This will create a new version based on the selected version." 
      : "Это создаст новую версию на основе выбранной.",
    cancel: language === "en" ? "Cancel" : "Отмена",
    restoreButton: language === "en" ? "Restore Version" : "Восстановить версию",
  };

  const toggleVersionExpanded = (versionId: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(versionId)) {
      newExpanded.delete(versionId);
    } else {
      newExpanded.add(versionId);
    }
    setExpandedVersions(newExpanded);
  };

  const handleRestore = (version: Version) => {
    alert(`${t.restoreButton}: ${version.version}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          {t.versions}
        </h1>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {/* Version Timeline */}
      <div className="space-y-4">
        {versions.map((version, index) => (
          <Card 
            key={version.id} 
            className={`p-6 transition-all ${version.isCurrent ? "border-emerald-500 border-2" : ""}`}
          >
            <div className="space-y-4">
              {/* Version Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Timeline Indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      version.isCurrent 
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" 
                        : "bg-muted"
                    }`}>
                      <GitBranch className="h-5 w-5" />
                    </div>
                    {index < versions.length - 1 && (
                      <div className="w-0.5 h-16 bg-border mt-2" />
                    )}
                  </div>

                  {/* Version Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">
                        {t.version} {version.version}
                      </h3>
                      {version.isCurrent && (
                        <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                          {t.currentVersion}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {version.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {version.createdAt}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm text-muted-foreground italic">
                        "{version.comment}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    {t.viewVersion}
                  </Button>
                  {!version.isCurrent && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          {t.restore}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t.restoreConfirm}</DialogTitle>
                          <DialogDescription>{t.restoreDesc}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Card className="p-4 bg-muted/50">
                            <p className="text-sm">
                              <strong>{t.version}:</strong> {version.version}
                            </p>
                            <p className="text-sm">
                              <strong>{t.author}:</strong> {version.author}
                            </p>
                            <p className="text-sm">
                              <strong>{t.date}:</strong> {version.createdAt}
                            </p>
                          </Card>
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline">
                              {t.cancel}
                            </Button>
                            <Button 
                              onClick={() => handleRestore(version)}
                              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              {t.restoreButton}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Changes Accordion */}
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleVersionExpanded(version.id)}
                  className="text-sm"
                >
                  {expandedVersions.has(version.id) ? (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      {t.hideChanges}
                    </>
                  ) : (
                    <>
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {t.showChanges} ({version.changes.length})
                    </>
                  )}
                </Button>

                {expandedVersions.has(version.id) && (
                  <Card className="mt-2 p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t.changes}
                    </h4>
                    <ul className="space-y-1">
                      {version.changes.map((change, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-emerald-600 mt-1">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Compare Versions */}
      <Card className="p-6 bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">{t.compare}</h3>
            <p className="text-sm text-muted-foreground">
              {language === "en" 
                ? "Select two versions to see what changed between them" 
                : "Выберите две версии чтобы увидеть различия"}
            </p>
          </div>
          <Button variant="outline">
            <GitBranch className="h-4 w-4 mr-2" />
            {t.compare}
          </Button>
        </div>
      </Card>
    </div>
  );
}
