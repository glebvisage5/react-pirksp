import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useLanguage } from "../../lib/language-context";
import { exportSpecToPDF, downloadSpecAsHTML } from "../../lib/pdf-export";
import { 
  FileText, 
  Plus, 
  Save,
  Eye,
  Trash2,
  GripVertical,
  Type,
  List,
  Table2,
  Image as ImageIcon,
  Code,
  Link,
  CheckSquare,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  Edit2,
  Download,
  FileDown
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner@2.0.3";

type BlockType = 
  | "heading" 
  | "text" 
  | "list" 
  | "table" 
  | "image" 
  | "code" 
  | "link" 
  | "checklist";

interface Block {
  id: string;
  type: BlockType;
  content: any;
  order: number;
}

interface SpecBuilderProps {
  onSave: () => void;
}

export function SpecBuilder({ onSave }: SpecBuilderProps) {
  const { language } = useLanguage();
  const [specTitle, setSpecTitle] = useState("Новое техническое задание");
  const [specProject, setSpecProject] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: "1",
      type: "heading",
      content: { text: language === "en" ? "Project Overview" : "Обзор проекта", level: 1 },
      order: 0,
    },
    {
      id: "2",
      type: "text",
      content: { text: language === "en" ? "Enter project description..." : "Введите описание проекта..." },
      order: 1,
    },
  ]);

  const t = {
    specBuilder: language === "en" ? "Specification Builder" : "Конструктор ТЗ",
    subtitle: language === "en" ? "Create structured technical specifications" : "Создавайте структурированные технические задания",
    specTitle: language === "en" ? "Specification Title" : "Название ТЗ",
    project: language === "en" ? "Project" : "Проект",
    selectProject: language === "en" ? "Select Project" : "Выберите проект",
    addBlock: language === "en" ? "Add Block" : "Добавить блок",
    save: language === "en" ? "Save Spec" : "Сохранить ТЗ",
    preview: language === "en" ? "Preview" : "Предпросмотр",
    // Block types
    heading: language === "en" ? "Heading" : "Заголовок",
    text: language === "en" ? "Text" : "Текст",
    list: language === "en" ? "List" : "Список",
    table: language === "en" ? "Table" : "Таблица",
    image: language === "en" ? "Image" : "Изображение",
    code: language === "en" ? "Code" : "Код",
    link: language === "en" ? "Link" : "Ссылка",
    checklist: language === "en" ? "Checklist" : "Чеклист",
    // Actions
    moveUp: language === "en" ? "Move Up" : "Вверх",
    moveDown: language === "en" ? "Move Down" : "Вниз",
    delete: language === "en" ? "Delete" : "Удалить",
    createTask: language === "en" ? "Create Task" : "Создать задачу",
    // Messages
    saved: language === "en" ? "Specification saved!" : "ТЗ сохранено!",
    taskCreated: language === "en" ? "Task created from block" : "Задача создана из блока",
    // Export
    export: language === "en" ? "Export" : "Экспорт",
    exportPDF: language === "en" ? "Export as PDF" : "Экспортировать в PDF",
    exportHTML: language === "en" ? "Export as HTML" : "Экспортировать в HTML",
    exporting: language === "en" ? "Exporting specification..." : "Экспорт спецификации...",
  };

  const blockTypes: { type: BlockType; label: string; icon: React.ReactNode }[] = [
    { type: "heading", label: t.heading, icon: <Type className="h-4 w-4" /> },
    { type: "text", label: t.text, icon: <AlignLeft className="h-4 w-4" /> },
    { type: "list", label: t.list, icon: <List className="h-4 w-4" /> },
    { type: "table", label: t.table, icon: <Table2 className="h-4 w-4" /> },
    { type: "image", label: t.image, icon: <ImageIcon className="h-4 w-4" /> },
    { type: "code", label: t.code, icon: <Code className="h-4 w-4" /> },
    { type: "link", label: t.link, icon: <Link className="h-4 w-4" /> },
    { type: "checklist", label: t.checklist, icon: <CheckSquare className="h-4 w-4" /> },
  ];

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: String(Date.now()),
      type,
      content: getDefaultContent(type),
      order: blocks.length,
    };
    setBlocks([...blocks, newBlock]);
  };

  const getDefaultContent = (type: BlockType) => {
    switch (type) {
      case "heading":
        return { text: language === "en" ? "New Heading" : "Новый заголовок", level: 2 };
      case "text":
        return { text: language === "en" ? "Enter text..." : "Введите текст..." };
      case "list":
        return { items: [language === "en" ? "Item 1" : "Пункт 1", language === "en" ? "Item 2" : "Пункт 2"], ordered: false };
      case "table":
        return { 
          headers: [language === "en" ? "Column 1" : "Колонка 1", language === "en" ? "Column 2" : "Колонка 2"], 
          rows: [[language === "en" ? "Data 1" : "Данные 1", language === "en" ? "Data 2" : "Данные 2"]] 
        };
      case "image":
        return { url: "", alt: language === "en" ? "Image description" : "Описание изображения" };
      case "code":
        return { code: "// " + (language === "en" ? "Enter code..." : "Введите код..."), language: "javascript" };
      case "link":
        return { url: "https://", text: language === "en" ? "Link text" : "Текст ссылки" };
      case "checklist":
        return { 
          items: [
            { text: language === "en" ? "Item 1" : "Пункт 1", checked: false },
            { text: language === "en" ? "Item 2" : "Пункт 2", checked: false }
          ] 
        };
      default:
        return {};
    }
  };

  const updateBlock = (id: string, content: any) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex(b => b.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === blocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    
    // Update order
    newBlocks.forEach((block, idx) => {
      block.order = idx;
    });

    setBlocks(newBlocks);
  };

  const createTaskFromBlock = (block: Block) => {
    toast.success(t.taskCreated);
    // Here you would create a task from the block content
  };

  const handleSave = () => {
    toast.success(t.saved);
    // Auto-save version
    setTimeout(() => {
      onSave();
    }, 1000);
  };

  const handleExportPDF = () => {
    const specData = {
      title: specTitle,
      project: specProject,
      version: "1.0",
      author: "Current User",
      createdAt: new Date().toLocaleDateString(),
      blocks,
    };
    
    toast.success(t.exporting);
    setTimeout(() => {
      exportSpecToPDF(specData, language);
    }, 500);
  };

  const handleExportHTML = () => {
    const specData = {
      title: specTitle,
      project: specProject,
      version: "1.0",
      author: "Current User",
      createdAt: new Date().toLocaleDateString(),
      blocks,
    };
    
    toast.success(t.exporting);
    setTimeout(() => {
      downloadSpecAsHTML(specData, language);
    }, 500);
  };

  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case "heading":
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Select 
                value={String(block.content.level)} 
                onValueChange={(value) => updateBlock(block.id, { ...block.content, level: parseInt(value) })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">H1</SelectItem>
                  <SelectItem value="2">H2</SelectItem>
                  <SelectItem value="3">H3</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                value={block.content.text}
                onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
                className="flex-1 font-bold"
              />
            </div>
          </div>
        );
      
      case "text":
        return (
          <Textarea 
            value={block.content.text}
            onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
            rows={4}
            className="w-full"
          />
        );

      case "list":
        return (
          <div className="space-y-2">
            <div className="flex gap-2 mb-2">
              <Select 
                value={block.content.ordered ? "ordered" : "unordered"}
                onValueChange={(value) => updateBlock(block.id, { ...block.content, ordered: value === "ordered" })}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unordered">{language === "en" ? "Bulleted" : "Маркеры"}</SelectItem>
                  <SelectItem value="ordered">{language === "en" ? "Numbered" : "Нумерация"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {block.content.items.map((item: string, index: number) => (
              <div key={index} className="flex gap-2">
                <span className="text-muted-foreground mt-2">{block.content.ordered ? `${index + 1}.` : "•"}</span>
                <Input 
                  value={item}
                  onChange={(e) => {
                    const newItems = [...block.content.items];
                    newItems[index] = e.target.value;
                    updateBlock(block.id, { ...block.content, items: newItems });
                  }}
                  className="flex-1"
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    const newItems = block.content.items.filter((_: any, i: number) => i !== index);
                    updateBlock(block.id, { ...block.content, items: newItems });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                updateBlock(block.id, { 
                  ...block.content, 
                  items: [...block.content.items, language === "en" ? "New item" : "Новый пункт"] 
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === "en" ? "Add item" : "Добавить пункт"}
            </Button>
          </div>
        );

      case "code":
        return (
          <div className="space-y-2">
            <Select 
              value={block.content.language}
              onValueChange={(value) => updateBlock(block.id, { ...block.content, language: value })}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
              </SelectContent>
            </Select>
            <Textarea 
              value={block.content.code}
              onChange={(e) => updateBlock(block.id, { ...block.content, code: e.target.value })}
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        );

      case "checklist":
        return (
          <div className="space-y-2">
            {block.content.items.map((item: any, index: number) => (
              <div key={index} className="flex gap-2 items-center">
                <input 
                  type="checkbox" 
                  checked={item.checked}
                  onChange={(e) => {
                    const newItems = [...block.content.items];
                    newItems[index].checked = e.target.checked;
                    updateBlock(block.id, { ...block.content, items: newItems });
                  }}
                  className="h-4 w-4"
                />
                <Input 
                  value={item.text}
                  onChange={(e) => {
                    const newItems = [...block.content.items];
                    newItems[index].text = e.target.value;
                    updateBlock(block.id, { ...block.content, items: newItems });
                  }}
                  className="flex-1"
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => createTaskFromBlock(block)}
                  title={t.createTask}
                >
                  <CheckSquare className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    const newItems = block.content.items.filter((_: any, i: number) => i !== index);
                    updateBlock(block.id, { ...block.content, items: newItems });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                updateBlock(block.id, { 
                  ...block.content, 
                  items: [...block.content.items, { text: language === "en" ? "New item" : "Новый пункт", checked: false }] 
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === "en" ? "Add item" : "Добавить пункт"}
            </Button>
          </div>
        );

      case "link":
        return (
          <div className="space-y-2">
            <Input 
              value={block.content.text}
              onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
              placeholder={language === "en" ? "Link text" : "Текст ссылки"}
            />
            <Input 
              value={block.content.url}
              onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
              placeholder="https://"
            />
          </div>
        );

      case "image":
        return (
          <div className="space-y-2">
            <Input 
              value={block.content.url}
              onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
              placeholder={language === "en" ? "Image URL" : "URL изображения"}
            />
            <Input 
              value={block.content.alt}
              onChange={(e) => updateBlock(block.id, { ...block.content, alt: e.target.value })}
              placeholder={language === "en" ? "Image description" : "Описание изображения"}
            />
            {block.content.url && (
              <div className="mt-2 rounded-lg overflow-hidden border">
                <img 
                  src={block.content.url} 
                  alt={block.content.alt} 
                  className="w-full max-h-96 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );

      case "table":
        return (
          <div className="space-y-3">
            {/* Table Headers */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                {language === "en" ? "Table Headers" : "Заголовки таблицы"}
              </Label>
              <div className="flex gap-2">
                {block.content.headers.map((header: string, index: number) => (
                  <div key={index} className="flex-1 flex gap-1">
                    <Input 
                      value={header}
                      onChange={(e) => {
                        const newHeaders = [...block.content.headers];
                        newHeaders[index] = e.target.value;
                        updateBlock(block.id, { ...block.content, headers: newHeaders });
                      }}
                      className="flex-1"
                      placeholder={`${language === "en" ? "Column" : "Колонка"} ${index + 1}`}
                    />
                    {block.content.headers.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          const newHeaders = block.content.headers.filter((_: any, i: number) => i !== index);
                          const newRows = block.content.rows.map((row: string[]) => 
                            row.filter((_: any, i: number) => i !== index)
                          );
                          updateBlock(block.id, { ...block.content, headers: newHeaders, rows: newRows });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const newHeaders = [...block.content.headers, language === "en" ? "Column" : "Колонка"];
                    const newRows = block.content.rows.map((row: string[]) => [...row, ""]);
                    updateBlock(block.id, { ...block.content, headers: newHeaders, rows: newRows });
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Table Rows */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                {language === "en" ? "Table Rows" : "Строки таблицы"}
              </Label>
              {block.content.rows.map((row: string[], rowIndex: number) => (
                <div key={rowIndex} className="flex gap-2">
                  {row.map((cell: string, cellIndex: number) => (
                    <Input 
                      key={cellIndex}
                      value={cell}
                      onChange={(e) => {
                        const newRows = [...block.content.rows];
                        newRows[rowIndex][cellIndex] = e.target.value;
                        updateBlock(block.id, { ...block.content, rows: newRows });
                      }}
                      className="flex-1"
                      placeholder={block.content.headers[cellIndex] || `${language === "en" ? "Data" : "Данные"}`}
                    />
                  ))}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      const newRows = block.content.rows.filter((_: any, i: number) => i !== rowIndex);
                      updateBlock(block.id, { ...block.content, rows: newRows });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const newRow = block.content.headers.map(() => "");
                  updateBlock(block.id, { 
                    ...block.content, 
                    rows: [...block.content.rows, newRow] 
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {language === "en" ? "Add row" : "Добавить строку"}
              </Button>
            </div>

            {/* Table Preview */}
            <div className="mt-4 rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {block.content.headers.map((header: string, index: number) => (
                        <th key={index} className="px-4 py-2 text-left font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.content.rows.map((row: string[], rowIndex: number) => (
                      <tr key={rowIndex} className="border-t">
                        {row.map((cell: string, cellIndex: number) => (
                          <td key={cellIndex} className="px-4 py-2">
                            {cell || <span className="text-muted-foreground italic">-</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return <p className="text-muted-foreground">{language === "en" ? "Unsupported block type" : "Неподдерживаемый тип блока"}</p>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          {t.specBuilder}
        </h1>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {/* Spec Info */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.specTitle}</Label>
              <Input 
                value={specTitle}
                onChange={(e) => setSpecTitle(e.target.value)}
                className="text-lg font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label>{t.project}</Label>
              <Select value={specProject} onValueChange={setSpecProject}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectProject} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile">Mobile App Redesign</SelectItem>
                  <SelectItem value="api">API v2 Development</SelectItem>
                  <SelectItem value="landing">Landing Page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {t.save}
            </Button>
            <Button variant="outline" onClick={onSave}>
              <Eye className="h-4 w-4 mr-2" />
              {t.preview}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  {t.export}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  {t.exportPDF}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportHTML}>
                  <FileDown className="h-4 w-4 mr-2" />
                  {t.exportHTML}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      {/* Blocks */}
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <Card key={block.id} className="p-4 hover:shadow-md transition-all">
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 pt-2">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    {blockTypes.find(bt => bt.type === block.type)?.label}
                  </Badge>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => moveBlock(block.id, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => moveBlock(block.id, "down")}
                      disabled={index === blocks.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteBlock(block.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {renderBlockContent(block)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Block Menu */}
      <Card className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {t.addBlock}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {blockTypes.map((blockType) => (
              <DropdownMenuItem key={blockType.type} onClick={() => addBlock(blockType.type)}>
                {blockType.icon}
                <span className="ml-2">{blockType.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>
    </div>
  );
}
