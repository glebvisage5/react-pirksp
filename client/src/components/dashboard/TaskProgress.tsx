import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useLanguage } from "../../lib/language-context";
import { 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Search, 
  Filter,
  Plus,
  Paperclip,
  MessageSquare,
  FileText,
  Upload
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  course: string;
  description: string;
  dueDate: string;
  progress: number;
  status: "completed" | "in-progress" | "pending";
  priority: "high" | "medium" | "low";
  attachments: string[];
  comments: Array<{author: string; text: string; time: string}>;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "React Component Assignment",
    course: "Web Development",
    description: "Create a reusable component library with at least 10 components including buttons, cards, forms, and modals. Each component should be well-documented with proper TypeScript types and include unit tests.",
    dueDate: "Dec 10, 2024",
    progress: 75,
    status: "in-progress",
    priority: "high",
    attachments: ["components.tsx", "tests.spec.ts"],
    comments: [
      { author: "Prof. Johnson", text: "Great progress! Make sure to add accessibility features.", time: "2 hours ago" },
      { author: "You", text: "Thanks! Working on ARIA labels now.", time: "1 hour ago" }
    ]
  },
  {
    id: "2",
    title: "Database Design Project",
    course: "Data Science",
    description: "Design and implement a normalized database schema for an e-commerce platform. Include ER diagrams, SQL scripts for table creation, and sample queries demonstrating key functionality.",
    dueDate: "Dec 8, 2024",
    progress: 100,
    status: "completed",
    priority: "high",
    attachments: ["schema.sql", "er-diagram.pdf"],
    comments: [
      { author: "Dr. Martinez", text: "Excellent work! Full marks.", time: "1 day ago" }
    ]
  },
  {
    id: "3",
    title: "Marketing Case Study Analysis",
    course: "Digital Marketing",
    description: "Analyze a successful digital marketing campaign from the past year. Include SWOT analysis, target audience breakdown, channel strategy, and ROI calculations.",
    dueDate: "Dec 15, 2024",
    progress: 30,
    status: "in-progress",
    priority: "medium",
    attachments: [],
    comments: []
  },
  {
    id: "4",
    title: "Calculus Problem Set",
    course: "Advanced Mathematics",
    description: "Complete problems 1-50 from Chapter 7. Show all work and include step-by-step solutions. Focus on integration techniques and applications.",
    dueDate: "Dec 12, 2024",
    progress: 0,
    status: "pending",
    priority: "medium",
    attachments: [],
    comments: []
  },
  {
    id: "5",
    title: "UI/UX Design Mockups",
    course: "Design Fundamentals",
    description: "Create high-fidelity mockups for a mobile banking app. Include user flows, wireframes, and interactive prototypes in Figma.",
    dueDate: "Dec 20, 2024",
    progress: 45,
    status: "in-progress",
    priority: "low",
    attachments: ["mockups.fig"],
    comments: [
      { author: "Ms. Lee", text: "Love the color scheme! Consider adding dark mode.", time: "3 hours ago" }
    ]
  },
  {
    id: "6",
    title: "Research Paper Draft",
    course: "Data Science",
    description: "Write a 10-page research paper on machine learning applications in healthcare. Include literature review, methodology, and findings.",
    dueDate: "Dec 25, 2024",
    progress: 20,
    status: "in-progress",
    priority: "high",
    attachments: ["outline.docx"],
    comments: []
  },
];

export function TaskProgress() {
  const { language } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const t = {
    title: language === "en" ? "Task Progress" : "Прогресс задач",
    subtitle: language === "en" ? "Manage and track your assignments" : "Управляйте и отслеживайте ваши задания",
    newTask: language === "en" ? "New Task" : "Новая задача",
    totalTasks: language === "en" ? "Total Tasks" : "Всего задач",
    completed: language === "en" ? "Completed" : "Завершено",
    inProgress: language === "en" ? "In Progress" : "В процессе",
    pending: language === "en" ? "Pending" : "Ожидает",
    searchPlaceholder: language === "en" ? "Search tasks..." : "Поиск задач...",
    progress: language === "en" ? "Progress" : "Прогресс",
    due: language === "en" ? "Due:" : "Срок:",
    high: language === "en" ? "High" : "Высокий",
    medium: language === "en" ? "Medium" : "Средний",
    low: language === "en" ? "Low" : "Низкий",
    priority: language === "en" ? "priority" : "приоритет",
    details: language === "en" ? "Details" : "Детали",
    attachments: language === "en" ? "Attachments" : "Вложения",
    comments: language === "en" ? "Comments" : "Комментарии",
    description: language === "en" ? "Description" : "Описание",
    dueDate: language === "en" ? "Due Date" : "Срок сдачи",
    status: language === "en" ? "Status" : "Статус",
    complete: language === "en" ? "Complete" : "Завершено",
    remaining: language === "en" ? "Remaining" : "Осталось",
    updateProgress: language === "en" ? "Update Progress" : "Обновить прогресс",
    markComplete: language === "en" ? "Mark as Complete" : "Отметить как выполненное",
    download: language === "en" ? "Download" : "Скачать",
    uploadNewFile: language === "en" ? "Upload New File" : "Загрузить новый файл",
    noAttachments: language === "en" ? "No attachments yet" : "Пока нет вложений",
    uploadFile: language === "en" ? "Upload File" : "Загрузить файл",
    noComments: language === "en" ? "No comments yet" : "Пока нет комментариев",
    addComment: language === "en" ? "Add a comment..." : "Добавить комментарий...",
    postComment: language === "en" ? "Post Comment" : "Опубликовать"
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress": return <Clock className="h-4 w-4 text-blue-600" />;
      case "pending": return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500";
      case "medium": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-500";
      case "low": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500";
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    pending: tasks.filter(t => t.status === "pending").length,
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-[1800px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-center sm:text-left w-full sm:w-auto">
          <h2 className="text-xl sm:text-2xl">{t.title}</h2>
          <p className="text-muted-foreground text-sm sm:text-base">{t.subtitle}</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          {t.newTask}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.totalTasks}</p>
                <div className="text-2xl">{stats.total}</div>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.completed}</p>
                <div className="text-2xl text-green-600">{stats.completed}</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.inProgress}</p>
                <div className="text-2xl text-blue-600">{stats.inProgress}</div>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.pending}</p>
                <div className="text-2xl text-yellow-600">{stats.pending}</div>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "en" ? "All Status" : "Все статусы"}</SelectItem>
                <SelectItem value="completed">{language === "en" ? "Completed" : "Завершено"}</SelectItem>
                <SelectItem value="in-progress">{language === "en" ? "In Progress" : "В процессе"}</SelectItem>
                <SelectItem value="pending">{language === "en" ? "Pending" : "Ожидает"}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "en" ? "All Priority" : "Все приоритеты"}</SelectItem>
                <SelectItem value="high">{t.high}</SelectItem>
                <SelectItem value="medium">{t.medium}</SelectItem>
                <SelectItem value="low">{t.low}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Task Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => (
          <Card
            key={task.id}
            className="hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setSelectedTask(task)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base mb-2 line-clamp-2">{task.title}</CardTitle>
                  <p className="text-sm text-muted-foreground truncate">{task.course}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Badge className={getStatusColor(task.status)} variant="secondary">
                    {t[task.status.replace("-", "") as keyof typeof t] || task.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className={getPriorityColor(task.priority)} variant="secondary">
                {t[task.priority]} {t.priority}
              </Badge>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t.progress}</span>
                  <span>{task.progress}%</span>
                </div>
                <Progress value={task.progress} />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span className="truncate">{t.due} {task.dueDate}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedTask && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle>{selectedTask.title}</DialogTitle>
                    <DialogDescription>{selectedTask.course}</DialogDescription>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Badge className={getStatusColor(selectedTask.status)} variant="secondary">
                      {selectedTask.status}
                    </Badge>
                    <Badge className={getPriorityColor(selectedTask.priority)} variant="secondary">
                      {selectedTask.priority}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">{t.details}</TabsTrigger>
                  <TabsTrigger value="attachments">{t.attachments}</TabsTrigger>
                  <TabsTrigger value="comments">{t.comments}</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2">{t.description}</h4>
                      <p className="text-muted-foreground">{selectedTask.description}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">{t.dueDate}</p>
                              <p>{selectedTask.dueDate}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(selectedTask.status)}
                            <div>
                              <p className="text-sm text-muted-foreground">{t.status}</p>
                              <p className="capitalize">{t[selectedTask.status.replace("-", "") as keyof typeof t] || selectedTask.status}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h4 className="mb-2">{t.progress}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{selectedTask.progress}% {t.complete}</span>
                          <span>{100 - selectedTask.progress}% {t.remaining}</span>
                        </div>
                        <Progress value={selectedTask.progress} />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">{t.updateProgress}</Button>
                      <Button variant="outline" className="flex-1">{t.markComplete}</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attachments" className="mt-4">
                  <div className="space-y-4">
                    {selectedTask.attachments.length > 0 ? (
                      <>
                        {selectedTask.attachments.map((file, index) => (
                          <Card key={index}>
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-muted-foreground" />
                                  <span>{file}</span>
                                </div>
                                <Button variant="outline" size="sm">{t.download}</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        <Button variant="outline" className="w-full">
                          <Upload className="mr-2 h-4 w-4" />
                          {t.uploadNewFile}
                        </Button>
                      </>
                    ) : (
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-4">{t.noAttachments}</p>
                          <Button>
                            <Upload className="mr-2 h-4 w-4" />
                            {t.uploadFile}
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="comments" className="mt-4">
                  <div className="space-y-4">
                    {selectedTask.comments.length > 0 ? (
                      <>
                        {selectedTask.comments.map((comment, index) => (
                          <Card key={index}>
                            <CardContent className="pt-6">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                                  {comment.author.charAt(0)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span>{comment.author}</span>
                                    <span className="text-xs text-muted-foreground">{comment.time}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{comment.text}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </>
                    ) : (
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-4">{t.noComments}</p>
                        </CardContent>
                      </Card>
                    )}
                    <div className="space-y-2">
                      <Textarea placeholder={t.addComment} rows={3} />
                      <Button className="w-full">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {t.postComment}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}