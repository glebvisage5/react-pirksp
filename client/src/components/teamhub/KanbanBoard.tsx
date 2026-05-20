import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useLanguage } from "../../lib/language-context";
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  User,
  Calendar,
  Circle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  project: string;
  projectId?: string;
  dueDate: string;
  createdAt: string;
  sourceSpec?: string;
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task["status"]) => void;
  onTaskClick?: (task: Task) => void;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
}

interface TaskCardProps {
  task: Task;
  onTaskClick?: (task: Task) => void;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
}

const TaskCard = ({ task, onTaskClick, onTaskEdit, onTaskDelete, onDragStart }: TaskCardProps) => {
  const { language } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);

  const t = {
    view: language === "en" ? "View" : "Просмотр",
    edit: language === "en" ? "Edit" : "Редактировать",
    delete: language === "en" ? "Delete" : "Удалить",
    dueDate: language === "en" ? "Due" : "Срок",
    fromSpec: language === "en" ? "From spec" : "Из ТЗ",
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getPriorityLabel = (priority: Task["priority"]) => {
    const labels = {
      urgent: language === "en" ? "Urgent" : "Срочно",
      high: language === "en" ? "High" : "Высокий",
      medium: language === "en" ? "Medium" : "Средний",
      low: language === "en" ? "Low" : "Низкий",
    };
    return labels[priority];
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    onDragStart(e, task.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`p-4 cursor-move hover:shadow-md transition-all ${
        isDragging ? "opacity-50 rotate-2" : ""
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm line-clamp-2 flex-1">{task.title}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onTaskClick && (
                <DropdownMenuItem onClick={() => onTaskClick(task)}>
                  <Eye className="h-4 w-4 mr-2" />
                  {t.view}
                </DropdownMenuItem>
              )}
              {onTaskEdit && (
                <DropdownMenuItem onClick={() => onTaskEdit(task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  {t.edit}
                </DropdownMenuItem>
              )}
              {onTaskDelete && (
                <DropdownMenuItem
                  onClick={() => onTaskDelete(task.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t.delete}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={getPriorityColor(task.priority)}>
            {getPriorityLabel(task.priority)}
          </Badge>
          {task.sourceSpec && (
            <Badge variant="outline" className="text-xs">
              {t.fromSpec}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate max-w-[100px]">{task.assignee}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{task.dueDate}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface ColumnProps {
  status: Task["status"];
  title: string;
  tasks: Task[];
  icon: React.ReactNode;
  color: string;
  onTaskMove: (taskId: string, newStatus: Task["status"]) => void;
  onTaskClick?: (task: Task) => void;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onAddTask?: (status: Task["status"]) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: Task["status"]) => void;
  isOver: boolean;
}

const Column = ({
  status,
  title,
  tasks,
  icon,
  color,
  onTaskMove,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  onAddTask,
  onDragStart,
  onDragOver,
  onDrop,
  isOver,
}: ColumnProps) => {
  const { language } = useLanguage();

  const t = {
    addTask: language === "en" ? "Add task" : "Добавить задачу",
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    onDrop(e, status);
  };

  return (
    <div className="flex-1 min-w-[280px]">
      <div className="space-y-3">
        {/* Column Header */}
        <div className={`flex items-center justify-between p-3 rounded-lg border-2 ${color}`}>
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-semibold">{title}</h3>
            <Badge variant="outline" className="ml-1">
              {tasks.length}
            </Badge>
          </div>
          {onAddTask && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onAddTask(status)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={onDragOver}
          onDrop={handleDrop}
          className={`space-y-3 min-h-[500px] p-3 rounded-lg border-2 border-dashed transition-colors ${
            isOver ? "bg-muted border-primary" : "border-transparent bg-muted/30"
          }`}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onTaskClick={onTaskClick}
              onTaskEdit={onTaskEdit}
              onTaskDelete={onTaskDelete}
              onDragStart={onDragStart}
            />
          ))}
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
              {language === "en" ? "No tasks" : "Нет задач"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function KanbanBoard({
  tasks,
  onTaskMove,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
}: KanbanBoardProps) {
  const { language } = useLanguage();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<Task["status"] | null>(null);

  const columns: {
    status: Task["status"];
    title: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      status: "todo",
      title: language === "en" ? "To Do" : "К выполнению",
      icon: <Circle className="h-4 w-4" />,
      color: "border-gray-300 bg-gray-50 dark:bg-gray-900",
    },
    {
      status: "in-progress",
      title: language === "en" ? "In Progress" : "В работе",
      icon: <Clock className="h-4 w-4 text-blue-600" />,
      color: "border-blue-300 bg-blue-50 dark:bg-blue-950",
    },
    {
      status: "review",
      title: language === "en" ? "Review" : "На проверке",
      icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
      color: "border-yellow-300 bg-yellow-50 dark:bg-yellow-950",
    },
    {
      status: "done",
      title: language === "en" ? "Done" : "Выполнено",
      icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
      color: "border-green-300 bg-green-50 dark:bg-green-950",
    },
  ];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", taskId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: Task["status"]) => {
    e.preventDefault();
    if (draggedTaskId) {
      const task = tasks.find((t) => t.id === draggedTaskId);
      if (task && task.status !== newStatus) {
        onTaskMove(draggedTaskId, newStatus);
      }
      setDraggedTaskId(null);
      setOverStatus(null);
    }
  };

  const handleDragEnter = (status: Task["status"]) => {
    setOverStatus(status);
  };

  const handleDragLeave = () => {
    setOverStatus(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.status}
          onDragEnter={() => handleDragEnter(column.status)}
          onDragLeave={handleDragLeave}
        >
          <Column
            status={column.status}
            title={column.title}
            tasks={tasks.filter((task) => task.status === column.status)}
            icon={column.icon}
            color={column.color}
            onTaskMove={onTaskMove}
            onTaskClick={onTaskClick}
            onTaskEdit={onTaskEdit}
            onTaskDelete={onTaskDelete}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isOver={overStatus === column.status}
          />
        </div>
      ))}
    </div>
  );
}
