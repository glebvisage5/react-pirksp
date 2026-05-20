import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useLanguage } from "../../lib/language-context";
import { exportSpecToPDF, downloadSpecAsHTML } from "../../lib/pdf-export";
import { 
  FileText, 
  Download,
  Share2,
  Edit,
  Clock,
  Users,
  Eye,
  Maximize,
  Menu,
  ChevronRight,
  FileDown
} from "lucide-react";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner@2.0.3";

interface SpecViewerProps {
  onEdit: () => void;
}

export function SpecViewer({ onEdit }: SpecViewerProps) {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock spec data
  const spec = {
    title: "Mobile App Redesign - Technical Specification",
    titleRu: "Редизайн мобильного приложения - Техническое задание",
    version: "2.0",
    project: "Mobile App Redesign",
    lastUpdated: "2024-02-15",
    author: "Иван Петров",
    team: "Mobile Dev Team",
    sections: [
      {
        id: "overview",
        title: language === "en" ? "Project Overview" : "Обзор проекта",
        content: language === "en" 
          ? "Complete redesign of the mobile application with new UI/UX, improved performance, and additional features."
          : "Полный редизайн мобильного приложения с новым UI/UX, улучшенной производительностью и дополнительными функциями.",
      },
      {
        id: "goals",
        title: language === "en" ? "Goals & Objectives" : "Цели и задачи",
        content: language === "en"
          ? "1. Improve user experience\n2. Increase app performance by 40%\n3. Add dark mode support\n4. Implement new authentication system"
          : "1. Улучшить пользовательский опыт\n2. Повысить производительность на 40%\n3. Добавить поддержку тёмной темы\n4. Реализовать новую систему авторизации",
      },
      {
        id: "functional",
        title: language === "en" ? "Functional Requirements" : "Функциональные требования",
        content: language === "en"
          ? "- User authentication and authorization\n- Profile management\n- Real-time notifications\n- Offline mode support\n- Multi-language support"
          : "- Авторизация и аутентификация пользователей\n- Управление профилем\n- Уведомления в реальном времени\n- Поддержка оффлайн режима\n- Мультиязычность",
      },
      {
        id: "non-functional",
        title: language === "en" ? "Non-functional Requirements" : "Нефункциональные требования",
        content: language === "en"
          ? "- Performance: App launch time < 2 seconds\n- Security: Encryption for sensitive data\n- Scalability: Support for 100k+ concurrent users\n- Compatibility: iOS 14+, Android 10+"
          : "- Производительность: Запуск приложения < 2 секунд\n- Безопасность: Шифрование чувствительных данных\n- Масштабируемость: Поддержка 100k+ одновременных пользователей\n- Совместимость: iOS 14+, Android 10+",
      },
      {
        id: "architecture",
        title: language === "en" ? "Architecture" : "Архитектура",
        content: language === "en"
          ? "Clean Architecture with MVVM pattern\n- Presentation Layer\n- Domain Layer\n- Data Layer\n- External Services Integration"
          : "Clean Architecture с паттерном MVVM\n- Слой представления\n- Доменный слой\n- Слой данных\n- Интеграция внешних сервисов",
      },
      {
        id: "api",
        title: "API",
        content: "REST API v2\n- Authentication endpoints\n- User management\n- Content delivery\n- Real-time WebSocket connections",
      },
      {
        id: "design",
        title: language === "en" ? "Design" : "Дизайн",
        content: language === "en"
          ? "Material Design 3 guidelines\n- Primary color: #4f46e5\n- Gradient: from-purple-500 via-indigo-600 to-green-500\n- Typography: Inter font family"
          : "Гайдлайны Material Design 3\n- Основной цвет: #4f46e5\n- Градиент: from-purple-500 via-indigo-600 to-green-500\n- Типографика: Шрифт Inter",
      },
      {
        id: "timeline",
        title: language === "en" ? "Timeline & Deadlines" : "Сроки и дедлайны",
        content: language === "en"
          ? "Phase 1: Design & Planning - 2 weeks\nPhase 2: Core Development - 6 weeks\nPhase 3: Testing & QA - 2 weeks\nPhase 4: Deployment - 1 week"
          : "Этап 1: Дизайн и планирование - 2 недели\nЭтап 2: Основная разработка - 6 недель\nЭтап 3: Тестирование и QA - 2 недели\nЭтап 4: Развертывание - 1 неделя",
      },
      {
        id: "team",
        title: language === "en" ? "Team" : "Команда",
        content: language === "en"
          ? "- Project Manager: Иван Петров\n- Lead Developer: Мария Сидорова\n- UI/UX Designer: Алексей Иванов\n- QA Engineer: Анна Смирнова\n- Backend Developer: Дмитрий Козлов"
          : "- Менеджер проекта: Иван Петров\n- Ведущий разработчик: Мария Сидорова\n- UI/UX дизайнер: Алексей Иванов\n- QA инженер: Анна Смирнова\n- Backend разработчик: Дмитрий Козлов",
      },
      {
        id: "risks",
        title: language === "en" ? "Risks" : "Риски",
        content: language === "en"
          ? "- Tight deadlines may affect quality\n- Third-party API dependencies\n- Platform-specific issues\n- Resource availability"
          : "- Сжатые сроки могут повлиять на качество\n- Зависимость от сторонних API\n- Проблемы специфичные для платформ\n- Доступность ресурсов",
      },
    ],
  };

  const t = {
    specViewer: language === "en" ? "Specification Viewer" : "Просмотр ТЗ",
    subtitle: language === "en" ? "View and export technical specifications" : "Просмотр и экспорт технических заданий",
    version: language === "en" ? "Version" : "Версия",
    lastUpdated: language === "en" ? "Last Updated" : "Обновлено",
    author: language === "en" ? "Author" : "Автор",
    team: language === "en" ? "Team" : "Команда",
    edit: language === "en" ? "Edit" : "Редактировать",
    download: language === "en" ? "Download PDF" : "Скачать PDF",
    downloadHTML: language === "en" ? "Download HTML" : "Скачать HTML",
    share: language === "en" ? "Share" : "Поделиться",
    versions: language === "en" ? "Versions" : "Версии",
    fullscreen: language === "en" ? "Fullscreen" : "Полный экран",
    tableOfContents: language === "en" ? "Table of Contents" : "Оглавление",
    export: language === "en" ? "Export" : "Экспорт",
    linkCopied: language === "en" ? "Share link copied to clipboard" : "Ссылка скопирована в буфер обмена",
    exportingPDF: language === "en" ? "Generating PDF..." : "Генерация PDF...",
    exportingHTML: language === "en" ? "Downloading HTML..." : "Скачивание HTML...",
  };

  const handleDownloadPDF = () => {
    // Convert spec sections to blocks format for export
    const blocks = spec.sections.map((section, index) => ({
      id: section.id,
      type: index === 0 ? 'heading' : 'text',
      content: index === 0 
        ? { text: section.title, level: 1 } 
        : { text: `${section.title}\n\n${section.content}` },
      order: index,
    }));

    const specData = {
      title: language === "en" ? spec.title : spec.titleRu,
      version: spec.version,
      project: spec.project,
      author: spec.author,
      team: spec.team,
      createdAt: spec.lastUpdated,
      blocks,
    };

    toast.success(t.exportingPDF);
    setTimeout(() => {
      exportSpecToPDF(specData, language);
    }, 500);
  };

  const handleDownloadHTML = () => {
    const blocks = spec.sections.map((section, index) => ({
      id: section.id,
      type: index === 0 ? 'heading' : 'text',
      content: index === 0 
        ? { text: section.title, level: 1 } 
        : { text: `${section.title}\n\n${section.content}` },
      order: index,
    }));

    const specData = {
      title: language === "en" ? spec.title : spec.titleRu,
      version: spec.version,
      project: spec.project,
      author: spec.author,
      team: spec.team,
      createdAt: spec.lastUpdated,
      blocks,
    };

    toast.success(t.exportingHTML);
    setTimeout(() => {
      downloadSpecAsHTML(specData, language);
    }, 500);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/teamhub/spec/${spec.project}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success(t.linkCopied);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          {t.specViewer}
        </h1>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {/* Actions Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">{language === "en" ? spec.title : spec.titleRu}</h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="outline">{t.version} {spec.version}</Badge>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {t.lastUpdated}: {spec.lastUpdated}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {spec.team}
              </span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              {t.edit}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t.export}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleDownloadPDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  {t.download}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadHTML}>
                  <FileDown className="h-4 w-4 mr-2" />
                  {t.downloadHTML}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              {t.share}
            </Button>
          </div>
        </div>
      </Card>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table of Contents - Sidebar */}
        <Card className="lg:col-span-1 p-4 h-fit lg:sticky lg:top-20">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Menu className="h-4 w-4" />
            {t.tableOfContents}
          </h3>
          <ScrollArea className="h-[500px]">
            <nav className="space-y-1">
              {spec.sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                    flex items-center gap-2 group
                    ${activeSection === section.id 
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" 
                      : "hover:bg-muted"
                    }
                  `}
                >
                  <ChevronRight className={`h-3 w-3 transition-transform ${activeSection === section.id ? "rotate-90" : ""}`} />
                  <span className="line-clamp-1">{section.title}</span>
                </button>
              ))}
            </nav>
          </ScrollArea>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {spec.sections.map((section) => (
            <Card 
              key={section.id} 
              id={section.id}
              className={`p-6 transition-all ${activeSection === section.id ? "ring-2 ring-emerald-500" : ""}`}
            >
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                {section.title}
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </div>
            </Card>
          ))}

          {/* Author Info */}
          <Card className="p-6 bg-muted/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                {spec.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.author}</p>
                <p className="font-medium">{spec.author}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
