import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useLanguage } from "../../lib/language-context";
import { toast } from "sonner@2.0.3";
import { CreateCourseModal } from "./CreateCourseModal";
import { EditCourseModal } from "./EditCourseModal";
import { LessonView } from "./LessonView";
import { 
  Brain, 
  Zap, 
  Plus, 
  Search, 
  Star, 
  Users, 
  Clock, 
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

interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  aiPowered: boolean;
  interactive: boolean;
  rating: number;
  students: number;
  estimatedTime: string;
  thumbnail: string;
}

interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  type: "video" | "interactive" | "quiz" | "project";
  completed: boolean;
  locked: boolean;
  aiAssisted: boolean;
  description?: string;
  videoUrl?: string;
  codeContent?: string;
  questions?: any[];
  projectDescription?: string;
  resources?: { name: string, type: string, url: string }[];
}

export function Courses() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const initialCourses: Course[] = [
    {
      id: "1",
      title: language === "en" ? "AI-Enhanced Web Development" : "Веб-разработка с ИИ",
      instructor: language === "en" ? "Dr. Sarah Chen" : "Д-р Сара Чен",
      description: language === "en"
        ? "Master modern web development with AI assistance. Interactive coding exercises adapt to your skill level."
        : "Освойте современную веб-разработку с помощью ИИ. Интерактивные упражнения адаптируются к вашему уровню.",
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      difficulty: "intermediate",
      category: "Development",
      aiPowered: true,
      interactive: true,
      rating: 4.8,
      students: 2340,
      estimatedTime: "8 weeks",
      thumbnail: "🎨"
    },
    {
      id: "2",
      title: language === "en" ? "Interactive Data Science" : "Интерактивная наука о данных",
      instructor: language === "en" ? "Prof. Michael Rodriguez" : "Проф. Майкл Родригес",
      description: language === "en"
        ? "Learn data science through hands-on projects with real-time AI feedback and personalized learning paths."
        : "Изучайте науку о данных через практические проекты с обратной связью ИИ и персональными путями обучения.",
      progress: 30,
      totalLessons: 32,
      completedLessons: 10,
      difficulty: "advanced",
      category: "Data Science",
      aiPowered: true,
      interactive: true,
      rating: 4.9,
      students: 1850,
      estimatedTime: "12 weeks",
      thumbnail: "📊"
    },
    {
      id: "3",
      title: language === "en" ? "Smart UI/UX Design" : "Умн��й UI/UX дизайн",
      instructor: language === "en" ? "Emma Watson" : "Эмма Уотсон",
      description: language === "en"
        ? "AI-powered design course with interactive prototyping and instant design feedback."
        : "Курс дизайна с ИИ, интерактивным прототипированием и мгновенной обратной связью.",
      progress: 100,
      totalLessons: 18,
      completedLessons: 18,
      difficulty: "intermediate",
      category: "Design",
      aiPowered: true,
      interactive: true,
      rating: 4.7,
      students: 3120,
      estimatedTime: "6 weeks",
      thumbnail: "🎨"
    },
    {
      id: "4",
      title: language === "en" ? "Machine Learning Fundamentals" : "Основы машинного обучения",
      instructor: language === "en" ? "Dr. James Liu" : "Д-р Джеймс Лю",
      description: language === "en"
        ? "Interactive ML course with adaptive learning algorithm and hands-on projects."
        : "Интерактивный курс ML с адаптивным алгоритмом обучения и практическими проектами.",
      progress: 0,
      totalLessons: 28,
      completedLessons: 0,
      difficulty: "advanced",
      category: "AI/ML",
      aiPowered: true,
      interactive: true,
      rating: 5.0,
      students: 4200,
      estimatedTime: "10 weeks",
      thumbnail: "🤖"
    }
  ];

  const initialLessons: Lesson[] = [
    {
      id: "1",
      courseId: "1",
      title: language === "en" ? "Introduction to AI-Assisted Coding" : "Введение в программирование с ИИ",
      duration: "15 min",
      type: "video",
      completed: true,
      locked: false,
      aiAssisted: true,
      description: language === "en"
        ? "In this lesson, you'll learn about the fundamentals of AI-assisted coding. We'll explore how AI can help you write better code faster and understand complex programming concepts. You'll discover practical tools and techniques that professional developers use every day."
        : "В этом уроке вы узнаете об основах программирования с помощью ИИ. Мы изучим, как ИИ может помочь вам писать лучший код быстрее и понимать сложные концепции программирования.",
      videoUrl: "https://example.com/video1.mp4"
    },
    {
      id: "2",
      courseId: "1",
      title: language === "en" ? "Interactive HTML & CSS Workshop" : "Интерактивный воркшоп HTML & CSS",
      duration: "30 min",
      type: "interactive",
      completed: true,
      locked: false,
      aiAssisted: true,
      description: language === "en"
        ? "Modify the code above to create your own greeting message. Try using different variable names and console.log statements. Experiment with string concatenation and template literals."
        : "Измените код выше, чтобы создать своё приветственное сообщение. Попробуйте использовать разные имена переменных и операторы console.log.",
      codeContent: `function createGreeting(name) {\n  const greeting = \`Hello, \${name}! Welcome to AI-Assisted Coding.\`;\n  console.log(greeting);\n  return greeting;\n}\n\ncreateGreeting("Student");`
    },
    {
      id: "3",
      courseId: "1",
      title: language === "en" ? "JavaScript Fundamentals Quiz" : "Тест по основам JavaScript",
      duration: "20 min",
      type: "quiz",
      completed: false,
      locked: false,
      aiAssisted: true,
      questions: [
        {
          question: language === "en" 
            ? "What is the correct way to declare a variable in JavaScript?"
            : "Как правильно объявить переменную в JavaScript?",
          options: [
            "var myVariable = 5;",
            "variable myVariable = 5;",
            "v myVariable = 5;",
            "myVariable := 5;"
          ],
          correctAnswer: 0
        },
        {
          question: language === "en"
            ? "Which method is used to select an element by ID?"
            : "Какой метод используется для выбора элемента по ID?",
          options: [
            "document.getElementByClass()",
            "document.querySelector()",
            "document.getElementById()",
            "document.selectById()"
          ],
          correctAnswer: 2
        },
        {
          question: language === "en"
            ? "What does the '===' operator do in JavaScript?"
            : "Что делает оператор '===' в JavaScript?",
          options: [
            language === "en" ? "Assigns a value" : "Присваивает значение",
            language === "en" ? "Compares with type coercion" : "Сравнивает с преобразованием типа",
            language === "en" ? "Compares without type coercion" : "Сравнивает без преобразования типа",
            language === "en" ? "Creates a new variable" : "Создаёт новую переменную"
          ],
          correctAnswer: 2
        }
      ]
    },
    {
      id: "4",
      courseId: "1",
      title: language === "en" ? "Build Your First AI-Enhanced App" : "Создайте первое приложение с ИИ",
      duration: "45 min",
      type: "project",
      completed: false,
      locked: true,
      aiAssisted: true,
      projectDescription: language === "en"
        ? "In this project, you'll create a fully functional web application that demonstrates your understanding of the concepts covered in this course. Build something creative and showcase your skills!"
        : "В этом проекте вы создадите полнофункциональное веб-приложение, которое продемонстрирует ваше понимание концепций, изученных в этом курсе.",
      resources: [
        { name: "Project Requirements", type: "PDF", url: "#" },
        { name: "Starter Template", type: "ZIP", url: "#" },
        { name: "Submission Guidelines", type: "PDF", url: "#" }
      ]
    }
  ];

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);

  const t = {
    title: language === "en" ? "Intelligent Learning Courses" : "Интеллектуальные курсы обучения",
    subtitle: language === "en" 
      ? "AI-powered interactive courses tailored to your learning style"
      : "ИИ-курсы, адаптированные под ваш стиль обучения",
    createCourse: language === "en" ? "Create Course" : "Создать курс",
    addCourse: language === "en" ? "Add Course" : "Добавить курс",
    search: language === "en" ? "Search courses..." : "Поиск курсов...",
    allCourses: language === "en" ? "All Courses" : "Все курсы",
    inProgress: language === "en" ? "In Progress" : "В процессе",
    completed: language === "en" ? "Completed" : "Завершено",
    aiPowered: language === "en" ? "AI-Powered" : "С ИИ",
    interactive: language === "en" ? "Interactive" : "Интерактивный",
    continue: language === "en" ? "Continue Learning" : "Продолжить обучение",
    start: language === "en" ? "Start Course" : "Начать курс",
    lessons: language === "en" ? "lessons" : "уроков",
    students: language === "en" ? "students" : "студентов",
    beginner: language === "en" ? "Beginner" : "Начинающий",
    intermediate: language === "en" ? "Средний" : "Средний",
    advanced: language === "en" ? "Продвинутый" : "Продвинутый",
    recommended: language === "en" ? "Recommended for you" : "Рекомендовано для вас",
    courseDetails: language === "en" ? "Course Details" : "Детали курса",
    curriculum: language === "en" ? "Curriculum" : "Программа",
    overview: language === "en" ? "Overview" : "Обзор",
    instructor: language === "en" ? "Instructor" : "Инструктор",
    difficulty: language === "en" ? "Difficulty" : "Сложность",
    estimatedTime: language === "en" ? "Estimated Time" : "Примерное время",
    backToCourses: language === "en" ? "Back to Courses" : "К курсам"
  };

  const handleSaveCourse = (updatedCourse: Course, updatedLessons: Lesson[]) => {
    // Update course in the list
    setCourses(courses.map(c => c.id === updatedCourse.id ? {
      ...updatedCourse,
      totalLessons: updatedLessons.length,
      completedLessons: updatedLessons.filter(l => l.completed).length
    } : c));
    
    // Update lessons - remove old lessons for this course and add new ones
    setLessons([
      ...lessons.filter(l => l.courseId !== updatedCourse.id),
      ...updatedLessons
    ]);
    
    // Update selected course
    setSelectedCourse({
      ...updatedCourse,
      totalLessons: updatedLessons.length,
      completedLessons: updatedLessons.filter(l => l.completed).length
    });
    
    setShowEditModal(false);
  };

  const handleCreateCourse = (formData: any) => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: formData.title,
      instructor: language === "en" ? "You" : "Вы",
      description: formData.description,
      progress: 0,
      totalLessons: 0,
      completedLessons: 0,
      difficulty: formData.difficulty,
      category: formData.category || "General",
      aiPowered: formData.aiPowered,
      interactive: formData.interactive,
      rating: 0,
      students: 0,
      estimatedTime: formData.estimatedTime || "4 weeks",
      thumbnail: formData.thumbnail
    };
    
    setCourses([newCourse, ...courses]);
    setShowCreateModal(false);
    toast.success(language === "en" ? "Course created successfully!" : "Курс успешно создан!");
  };

  const getLessonContent = (lesson: Lesson) => {
    const baseContent = {
      id: lesson.id,
      title: lesson.title,
      type: lesson.type,
      duration: lesson.duration,
      completed: lesson.completed,
    };

    if (lesson.type === "video") {
      return {
        ...baseContent,
        content: language === "en"
          ? "In this lesson, you'll learn about the fundamentals of AI-assisted coding. We'll explore how AI can help you write better code faster and understand complex programming concepts. You'll discover practical tools and techniques that professional developers use every day."
          : "В этом уроке вы узнаете об основах программирования с помощью ИИ. Мы изучим, как ИИ может помочь вам писать лучший код быстрее и понимать сложные концепции программирования.",
        videoUrl: lesson.videoUrl
      };
    }

    if (lesson.type === "interactive") {
      return {
        ...baseContent,
        content: language === "en"
          ? "Modify the code above to create your own greeting message. Try using different variable names and console.log statements. Experiment with string concatenation and template literals."
          : "Измените код выше, чтобы создать своё приветственное сообщение. Попробуйте использовать разные имена переменных и операторы console.log.",
        codeExample: lesson.codeContent,
        resources: [
          { name: "HTML Cheatsheet", type: "PDF", url: "#" },
          { name: "CSS Guide", type: "PDF", url: "#" }
        ]
      };
    }

    if (lesson.type === "quiz") {
      return {
        ...baseContent,
        quiz: lesson.questions
      };
    }

    if (lesson.type === "project") {
      return {
        ...baseContent,
        content: language === "en"
          ? "In this project, you'll create a fully functional web application that demonstrates your understanding of the concepts covered in this course. Build something creative and showcase your skills!"
          : "В этом проекте вы создадите полнофункциональное веб-приложение, которое продемонстрирует ваше понимание концепций, изученных в этом курсе.",
        resources: [
          { name: "Project Requirements", type: "PDF", url: "#" },
          { name: "Starter Template", type: "ZIP", url: "#" },
          { name: "Submission Guidelines", type: "PDF", url: "#" }
        ]
      };
    }

    return baseContent;
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.locked) {
      setSelectedLesson(lesson);
    }
  };

  const handleStartCourse = (course: Course) => {
    setSelectedCourse(course);
    // Find first incomplete lesson
    const firstIncomplete = lessons.find(l => !l.completed && !l.locked);
    if (firstIncomplete) {
      setSelectedLesson(firstIncomplete);
    }
  };

  const handleCompleteLesson = () => {
    if (selectedLesson) {
      const updatedLesson = { ...selectedLesson, completed: true };
      setSelectedLesson(updatedLesson);
    }
  };

  const handleNextLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      if (!nextLesson.locked) {
        setSelectedLesson(nextLesson);
      }
    }
  };

  const handlePreviousLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex > 0) {
      setSelectedLesson(lessons[currentIndex - 1]);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
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

  // Show lesson view
  if (selectedLesson) {
    const lessonContent = getLessonContent(selectedLesson);
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
    
    return (
      <LessonView
        lesson={lessonContent as any}
        onBack={() => setSelectedLesson(null)}
        onComplete={handleCompleteLesson}
        onNext={handleNextLesson}
        onPrevious={handlePreviousLesson}
        hasNext={currentIndex < lessons.length - 1 && !lessons[currentIndex + 1]?.locked}
        hasPrevious={currentIndex > 0}
      />
    );
  }

  if (selectedCourse) {
    // Filter lessons for the selected course
    const courseLessons = lessons.filter(l => l.courseId === selectedCourse.id);
    
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedCourse(null)} className="gap-2">
            ← {t.backToCourses}
          </Button>
          <Button variant="ghost" onClick={() => setShowEditModal(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            {language === "en" ? "Edit Course" : "Редактировать курс"}
          </Button>
        </div>

        <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
          {/* Course Overview */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{selectedCourse.title}</CardTitle>
                    <CardDescription>{selectedCourse.instructor}</CardDescription>
                  </div>
                  <div className="text-6xl">{selectedCourse.thumbnail}</div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedCourse.aiPowered && (
                    <Badge className="gap-1">
                      <Brain className="h-3 w-3" />
                      {t.aiPowered}
                    </Badge>
                  )}
                  {selectedCourse.interactive && (
                    <Badge className="gap-1">
                      <Zap className="h-3 w-3" />
                      {t.interactive}
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCourse.students} {t.students}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCourse.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{selectedCourse.rating}/5.0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCourse.totalLessons} {t.lessons}</span>
                  </div>
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
                <div className="space-y-2">
                  {courseLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson)}
                      className={`p-4 rounded-lg border transition-all ${
                        lesson.locked ? "opacity-50 cursor-not-allowed" : "hover:bg-accent cursor-pointer hover:border-primary"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          lesson.completed ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-500" :
                          lesson.locked ? "bg-muted text-muted-foreground" :
                          "bg-primary/10 text-primary"
                        }`}>
                          {lesson.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : lesson.locked ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            getLessonIcon(lesson.type)
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{lesson.title}</p>
                            {lesson.aiAssisted && (
                              <Sparkles className="h-3 w-3 text-purple-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                        </div>
                        {!lesson.locked && !lesson.completed && (
                          <Button size="sm" onClick={(e) => {
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
                </div>
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
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <p className="text-sm">
                    {language === "en" 
                      ? "Master React fundamentals" 
                      : "Освоить основы React"}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <p className="text-sm">
                    {language === "en" 
                      ? "Build 3 portfolio projects" 
                      : "Создать 3 проекта для портфолио"}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-muted mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    {language === "en" 
                      ? "Deploy production app" 
                      : "Развернуть production приложение"}
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
                  <div className="p-3 bg-muted rounded-lg text-2xl" title={language === "en" ? "Fast Learner" : "Быстро учится"}>
                    🚀
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-2xl" title={language === "en" ? "Consistent" : "Последовательный"}>
                   
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-2xl opacity-50" title={language === "en" ? "Course Master" : "Мастер курса"}>
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
            lessons={lessons.filter(l => l.courseId === selectedCourse.id)}
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
        <Button onClick={() => setShowCreateModal(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          {t.createCourse}
        </Button>
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
                    : "Исходя из вашей истори обучения и целей, мы рекомендуем эти курсы с ИИ."}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Courses Grid */}
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => setSelectedCourse(course)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-4xl">{course.thumbnail}</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription>{course.instructor}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {course.aiPowered && (
                      <Badge variant="secondary" className="gap-1">
                        <Brain className="h-3 w-3" />
                        {t.aiPowered}
                      </Badge>
                    )}
                    {course.interactive && (
                      <Badge variant="secondary" className="gap-1">
                        <Zap className="h-3 w-3" />
                        {t.interactive}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {course.completedLessons}/{course.totalLessons} {t.lessons}
                      </span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {course.students}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.estimatedTime}
                    </span>
                  </div>

                  <Button 
                    className="w-full" 
                    variant={course.progress > 0 ? "default" : "outline"}
                    onClick={() => handleStartCourse(course)}
                  >
                    {course.progress > 0 ? t.continue : t.start}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Course Modal */}
      {showCreateModal && (
        <CreateCourseModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onSave={handleCreateCourse} />
      )}
    </div>
  );
}