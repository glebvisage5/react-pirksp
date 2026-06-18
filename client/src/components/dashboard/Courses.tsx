import { useEffect, useState, type MouseEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useLanguage } from "../../lib/language-context";
import { useUser } from "../../lib/user-context";
import { toast } from "sonner";
import { CreateCourseModal, type CreateCourseFormData } from "./CreateCourseModal";
import { EditCourseModal, type EditLesson, type Question } from "./EditCourseModal";
import { LessonView } from "./LessonView";
import { apiCourses, type Course, type Lesson } from "../../api/courses";
import {
  Brain,
  Plus,
  Search,
  Loader2,
  AlertCircle,
  BookOpen,
  Edit,
  CheckCircle,
  Lock,
  Sparkles,
  Play,
  Video,
  Code,
  FileText,
  Lightbulb,
  MessageSquare,
  Target,
  Award
} from "lucide-react";

interface LessonContentQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface LessonContentData {
  description?: string;
  videoUrl?: string;
  codeContent?: string;
  projectDescription?: string;
  questions?: Array<{
    question: string;
    type?: "single" | "multiple" | "text";
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
}

export function Courses() {
  const { language } = useLanguage();
  const { isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const t = {
    title: language === "en" ? "Intelligent Learning Courses" : "Интеллектуальные курсы обучения",
    subtitle: language === "en"
      ? "AI-powered interactive courses tailored to your learning style"
      : "ИИ-курсы, адаптированные под ваш стиль обучения",
    createCourse: language === "en" ? "Create Course" : "Создать курс",
    search: language === "en" ? "Search courses..." : "Поиск курсов...",
    allCourses: language === "en" ? "All Courses" : "Все курсы",
    inProgress: language === "en" ? "In Progress" : "В процессе",
    completed: language === "en" ? "Completed" : "Завершено",
    aiPowered: language === "en" ? "AI-Powered" : "С ИИ",
    continue: language === "en" ? "Continue Learning" : "Продолжить обучение",
    start: language === "en" ? "Start Course" : "Начать курс",
    lessons: language === "en" ? "lessons" : "уроков",
    beginner: language === "en" ? "Beginner" : "Начинающий",
    intermediate: language === "en" ? "Intermediate" : "Средний",
    advanced: language === "en" ? "Advanced" : "Продвинутый",
    recommended: language === "en" ? "Recommended for you" : "Рекомендовано для вас",
    courseDetails: language === "en" ? "Course Details" : "Детали курса",
    curriculum: language === "en" ? "Curriculum" : "Программа",
    overview: language === "en" ? "Overview" : "Обзор",
    instructor: language === "en" ? "Instructor" : "Инструктор",
    difficulty: language === "en" ? "Difficulty" : "Сложность",
    backToCourses: language === "en" ? "Back to Courses" : "К курсам",
    loading: language === "en" ? "Loading..." : "Загрузка...",
    noCourses: language === "en" ? "No courses found" : "Курсы не найдены",
  };

  const loadCourses = () => {
    setLoading(true);
    apiCourses.list()
      .then(setCourses)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const loadLessons = (courseId: string) => {
    setLessonsLoading(true);
    apiCourses.lessons(courseId)
      .then(setCourseLessons)
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLessonsLoading(false));
  };

  const handleCreateCourse = (formData: CreateCourseFormData) => {
    apiCourses.create(formData)
      .then(() => {
        toast.success(language === "en" ? "Course created successfully!" : "Курс успешно создан!");
        setShowCreateModal(false);
        loadCourses();
      })
      .catch((err: Error) => toast.error(err.message));
  };

  const lessonToEdit = (lesson: Lesson): EditLesson => {
    const content = (lesson.content ?? {}) as LessonContentData;
    return {
      id: lesson.id,
      title: lesson.title,
      duration: lesson.duration ?? "",
      type: lesson.type,
      order_index: lesson.order_index,
      is_locked: lesson.is_locked,
      description: content.description ?? "",
      videoUrl: content.videoUrl ?? "",
      codeContent: content.codeContent ?? "",
      projectDescription: content.projectDescription ?? "",
      questions: content.questions?.map((q, i): Question => ({
        id: `q-${i}`,
        question: q.question,
        type: q.type ?? "single",
        options: q.options,
        correctAnswer: q.type === "text" ? String(q.correctAnswer) : q.options[q.correctAnswer] ?? "",
        explanation: q.explanation ?? "",
      })),
    };
  };

  const editLessonToContent = (lesson: EditLesson): Record<string, unknown> => {
    const content: LessonContentData = {};
    if (lesson.type === "video") {
      content.description = lesson.description;
      content.videoUrl = lesson.videoUrl;
    } else if (lesson.type === "interactive") {
      content.description = lesson.description;
      content.codeContent = lesson.codeContent;
    } else if (lesson.type === "project") {
      content.description = lesson.description;
      content.projectDescription = lesson.projectDescription;
    } else if (lesson.type === "quiz") {
      content.questions = (lesson.questions ?? []).map((q) => ({
        question: q.question,
        type: q.type,
        options: q.options,
        correctAnswer: q.type === "text"
          ? (q.correctAnswer as string)
          : Math.max(0, q.options.indexOf(q.correctAnswer as string)),
        explanation: q.explanation,
      })) as any;
    }
    return content as Record<string, unknown>;
  };

  const handleSaveCourse = (
    courseUpdates: Partial<Course>,
    lessons: EditLesson[],
    deletedLessonIds: string[]
  ) => {
    if (!selectedCourse) return;
    const courseId = selectedCourse.id;

    const requests: Promise<unknown>[] = [
      apiCourses.update(courseId, courseUpdates),
      ...deletedLessonIds.map((id) => apiCourses.deleteLesson(id)),
      ...lessons.map((lesson) => {
        const payload = {
          title: lesson.title,
          type: lesson.type,
          duration: lesson.duration,
          order_index: lesson.order_index,
          is_locked: lesson.is_locked,
          content: editLessonToContent(lesson),
        };
        return lesson.isNew
          ? apiCourses.createLesson(courseId, payload)
          : apiCourses.updateLesson(lesson.id, payload);
      }),
    ];

    Promise.all(requests)
      .then(() => {
        loadCourses();
        loadLessons(courseId);
        setSelectedCourse({ ...selectedCourse, ...courseUpdates });
        setShowEditModal(false);
      })
      .catch((err: Error) => toast.error(err.message));
  };

  const getLessonContent = (lesson: Lesson) => {
    const content = (lesson.content ?? {}) as LessonContentData;
    const baseContent = {
      id: lesson.id,
      title: lesson.title,
      type: lesson.type,
      duration: lesson.duration ?? "",
      completed: lesson.completed,
    };

    if (lesson.type === "video") {
      return { ...baseContent, content: content.description, videoUrl: content.videoUrl };
    }
    if (lesson.type === "interactive") {
      return { ...baseContent, content: content.description, codeExample: content.codeContent };
    }
    if (lesson.type === "quiz") {
      const quiz: LessonContentQuestion[] | undefined = content.questions?.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
      }));
      return { ...baseContent, quiz };
    }
    if (lesson.type === "project") {
      return { ...baseContent, content: content.projectDescription ?? content.description };
    }
    return baseContent;
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.is_locked) {
      setSelectedLesson(lesson);
    }
  };

  const handleStartCourse = (course: Course) => {
    const proceed = () => {
      setSelectedCourse(course);
      loadLessons(course.id);
    };
    if (!course.enrolled) {
      apiCourses.enroll(course.id)
        .then(() => {
          loadCourses();
          proceed();
        })
        .catch((err: Error) => toast.error(err.message));
    } else {
      proceed();
    }
  };

  const handleCompleteLesson = () => {
    if (!selectedLesson) return;
    apiCourses.completeLesson(selectedLesson.id)
      .then(() => {
        setSelectedLesson({ ...selectedLesson, completed: true });
        setCourseLessons(courseLessons.map(l => l.id === selectedLesson.id ? { ...l, completed: true } : l));
        loadCourses();
      })
      .catch((err: Error) => toast.error(err.message));
  };

  const handleNextLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = courseLessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex < courseLessons.length - 1) {
      const nextLesson = courseLessons[currentIndex + 1]!;
      if (!nextLesson.is_locked) {
        setSelectedLesson(nextLesson);
      }
    }
  };

  const handlePreviousLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = courseLessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex > 0) {
      setSelectedLesson(courseLessons[currentIndex - 1]!);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "inProgress") return matchesSearch && course.progress > 0 && course.progress < 100;
    if (activeTab === "completed") return matchesSearch && course.progress === 100;
    return matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500";
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "interactive":
        return <Code className="h-4 w-4" />;
      case "quiz":
        return <FileText className="h-4 w-4" />;
      case "project":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-3 text-muted-foreground">{t.loading}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive gap-2">
        <AlertCircle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  // Show lesson view
  if (selectedLesson) {
    const lessonContent = getLessonContent(selectedLesson);
    const currentIndex = courseLessons.findIndex(l => l.id === selectedLesson.id);

    return (
      <LessonView
        lesson={lessonContent as any}
        onBack={() => setSelectedLesson(null)}
        onComplete={handleCompleteLesson}
        onNext={handleNextLesson}
        onPrevious={handlePreviousLesson}
        hasNext={currentIndex < courseLessons.length - 1 && !courseLessons[currentIndex + 1]?.is_locked}
        hasPrevious={currentIndex > 0}
      />
    );
  }

  if (selectedCourse) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => { setSelectedCourse(null); setCourseLessons([]); }} className="gap-2">
            ← {t.backToCourses}
          </Button>
          {isAdmin && (
            <Button variant="ghost" onClick={() => setShowEditModal(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              {language === "en" ? "Edit Course" : "Редактировать курс"}
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
          {/* Course Overview */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{selectedCourse.title}</CardTitle>
                    <CardDescription>{selectedCourse.instructor_name ?? "—"}</CardDescription>
                  </div>
                  <div className="text-6xl">{selectedCourse.thumbnail_emoji}</div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedCourse.is_ai_powered && (
                    <Badge className="gap-1">
                      <Brain className="h-3 w-3" />
                      {t.aiPowered}
                    </Badge>
                  )}
                  <Badge className={getDifficultyColor(selectedCourse.difficulty)}>
                    {t[selectedCourse.difficulty as keyof typeof t]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-2">{t.overview}</h3>
                  <p className="text-muted-foreground">{selectedCourse.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedCourse.total_lessons} {t.lessons}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{language === "en" ? "Progress" : "Прогресс"}</span>
                    <span>{selectedCourse.progress}%</span>
                  </div>
                  <Progress value={selectedCourse.progress} />
                </div>
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle>{t.curriculum}</CardTitle>
              </CardHeader>
              <CardContent>
                {lessonsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {courseLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson)}
                        className={`p-4 rounded-lg border transition-all ${
                          lesson.is_locked ? "opacity-50 cursor-not-allowed" : "hover:bg-accent cursor-pointer hover:border-primary"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            lesson.completed ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-500" :
                            lesson.is_locked ? "bg-muted text-muted-foreground" :
                            "bg-primary/10 text-primary"
                          }`}>
                            {lesson.completed ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : lesson.is_locked ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              getLessonIcon(lesson.type)
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                          </div>
                          {!lesson.is_locked && !lesson.completed && (
                            <Button size="sm" onClick={(e: MouseEvent) => {
                              e.stopPropagation();
                              handleLessonClick(lesson);
                            }}>
                              <Play className="h-3 w-3 mr-1" />
                              {language === "en" ? "Start" : "Начать"}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {courseLessons.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        {language === "en" ? "No lessons yet" : "Уроков пока нет"}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Learning Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-purple-500" />
                  {language === "en" ? "AI Learning Assistant" : "ИИ помощник"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {language === "en"
                    ? "Get personalized help, instant feedback, and adaptive learning paths tailored to your progress."
                    : "Получайте персональную помощь, мгновенную обратную связь и адаптивные пути обучения."}
                </p>
                <Button className="w-full gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {language === "en" ? "Ask AI Tutor" : "Спросить ИИ"}
                </Button>
              </CardContent>
            </Card>

            {/* Learning Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-blue-500" />
                  {language === "en" ? "Learning Goals" : "Цели обучения"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className={`h-4 w-4 mt-0.5 ${selectedCourse.progress >= 50 ? "text-green-500" : "text-muted-foreground"}`} />
                  <p className="text-sm">
                    {language === "en"
                      ? "Complete half of the course"
                      : "Пройти половину курса"}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className={`h-4 w-4 mt-0.5 ${selectedCourse.progress === 100 ? "text-green-500" : "text-muted-foreground"}`} />
                  <p className="text-sm">
                    {language === "en"
                      ? "Finish the course"
                      : "Завершить курс"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-yellow-500" />
                  {language === "en" ? "Achievements" : "Достижения"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <div
                    className={`p-3 bg-muted rounded-lg text-2xl ${selectedCourse.progress > 0 ? "" : "opacity-50"}`}
                    title={language === "en" ? "Started" : "Начато"}
                  >
                    🚀
                  </div>
                  <div
                    className={`p-3 bg-muted rounded-lg text-2xl ${selectedCourse.progress === 100 ? "" : "opacity-50"}`}
                    title={language === "en" ? "Course Master" : "Мастер курса"}
                  >
                    🏆
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Course Modal */}
        {showEditModal && (
          <EditCourseModal
            course={selectedCourse}
            lessons={courseLessons.map(lessonToEdit)}
            open={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveCourse}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-center sm:text-left w-full sm:w-auto">
          <h2 className="flex items-center gap-2 text-xl sm:text-2xl justify-center sm:justify-start">
            <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            {t.title}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">{t.subtitle}</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowCreateModal(true)} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            {t.createCourse}
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">{t.allCourses}</TabsTrigger>
          <TabsTrigger value="inProgress">{t.inProgress}</TabsTrigger>
          <TabsTrigger value="completed">{t.completed}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-6">
          {/* Recommended Section */}
          {activeTab === "all" && (
            <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200 dark:border-purple-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  {t.recommended}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === "en"
                    ? "Based on your learning history and goals, we recommend these AI-powered courses."
                    : "Исходя из вашей истории обучения и целей, мы рекомендуем эти курсы с ИИ."}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">{t.noCourses}</p>
          ) : (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className="hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => handleStartCourse(course)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-4xl">{course.thumbnail_emoji}</div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription>{course.instructor_name ?? "—"}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {course.is_ai_powered && (
                        <Badge variant="secondary" className="gap-1">
                          <Brain className="h-3 w-3" />
                          {t.aiPowered}
                        </Badge>
                      )}
                      <Badge className={getDifficultyColor(course.difficulty)} variant="secondary">
                        {t[course.difficulty as keyof typeof t]}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {course.completed_lessons}/{course.total_lessons} {t.lessons}
                        </span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                    </div>

                    <Button
                      className="w-full"
                      variant={course.progress > 0 ? "default" : "outline"}
                      onClick={(e: MouseEvent) => { e.stopPropagation(); handleStartCourse(course); }}
                    >
                      {course.progress > 0 ? t.continue : t.start}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Course Modal */}
      {showCreateModal && (
        <CreateCourseModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onSave={handleCreateCourse} />
      )}
    </div>
  );
}
