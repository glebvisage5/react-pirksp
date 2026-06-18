import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { useLanguage } from "../../lib/language-context";
import { toast } from "sonner";
import type { Course } from "../../api/courses";
import {
  Plus,
  Trash2,
  GripVertical,
  Video,
  Code,
  FileQuestion,
  Lightbulb,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Edit
} from "lucide-react";

export interface Question {
  id: string;
  question: string;
  type: "single" | "multiple" | "text";
  options: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface EditLesson {
  id: string;
  isNew?: boolean;
  title: string;
  duration: string;
  type: "video" | "interactive" | "quiz" | "project";
  order_index: number;
  is_locked: boolean;
  description?: string;
  videoUrl?: string;
  codeContent?: string;
  projectDescription?: string;
  questions?: Question[];
}

interface EditCourseModalProps {
  course: Course;
  lessons: EditLesson[];
  open: boolean;
  onClose: () => void;
  onSave: (course: Partial<Course>, lessons: EditLesson[], deletedLessonIds: string[]) => void;
}

export function EditCourseModal({ course, lessons, open, onClose, onSave }: EditCourseModalProps) {
  const { language } = useLanguage();
  const [editedCourse, setEditedCourse] = useState<Course>(course);
  const [editedLessons, setEditedLessons] = useState<EditLesson[]>(lessons);
  const [deletedLessonIds, setDeletedLessonIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"info" | "lessons">("info");
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const t = {
    editCourse: language === "en" ? "Edit Course" : "Редактировать курс",
    courseInfo: language === "en" ? "Course Information" : "Информация о курсе",
    lessons: language === "en" ? "Lessons" : "Уроки",
    title: language === "en" ? "Title" : "Название",
    description: language === "en" ? "Description" : "Описание",
    difficulty: language === "en" ? "Difficulty" : "Сложность",
    beginner: language === "en" ? "Beginner" : "Начальный",
    intermediate: language === "en" ? "Intermediate" : "Средний",
    advanced: language === "en" ? "Advanced" : "Продвинутый",
    aiPowered: language === "en" ? "AI-Powered" : "С ИИ",
    addLesson: language === "en" ? "Add Lesson" : "Добавить урок",
    save: language === "en" ? "Save Changes" : "Сохранить изменения",
    cancel: language === "en" ? "Cancel" : "Отмена",
    lessonTitle: language === "en" ? "Lesson Title" : "Название урока",
    lessonType: language === "en" ? "Lesson Type" : "Тип урока",
    video: language === "en" ? "Video" : "Видео",
    interactive: language === "en" ? "Interactive" : "Интерактивный",
    quiz: language === "en" ? "Quiz" : "Тест",
    project: language === "en" ? "Project" : "Проект",
    duration: language === "en" ? "Duration" : "Длительность",
    locked: language === "en" ? "Locked" : "Заблокирован",
    delete: language === "en" ? "Delete" : "Удалить",
    addQuestion: language === "en" ? "Add Question" : "Добавить вопрос",
    questionType: language === "en" ? "Question Type" : "Тип вопроса",
    singleChoice: language === "en" ? "Single Choice" : "Один вариант",
    multipleChoice: language === "en" ? "Multiple Choice" : "Несколько вариантов",
    textAnswer: language === "en" ? "Text Answer" : "Текстовый ответ",
    options: language === "en" ? "Options" : "Варианты ответов",
    correctAnswer: language === "en" ? "Correct Answer" : "Правильный ответ",
    explanation: language === "en" ? "Explanation (optional)" : "Объяснение (необязательно)",
    videoUrl: language === "en" ? "Video URL" : "URL видео",
    codeContent: language === "en" ? "Code Content" : "Код",
    projectDescription: language === "en" ? "Project Description" : "Описание проекта",
    thumbnailIcon: language === "en" ? "Thumbnail Icon" : "Иконка превью",
  };

  const icons = ["📚", "💻", "🎨", "🤖", "📊", "🎓", "🔬", "📱", "🌐", "⚡", "🎯", "🚀"];

  const addLesson = () => {
    const newLesson: EditLesson = {
      id: `new-${Date.now()}`,
      isNew: true,
      title: language === "en" ? "New Lesson" : "Новый урок",
      duration: "15 min",
      type: "video",
      order_index: editedLessons.length,
      is_locked: false,
      description: "",
    };
    setEditedLessons([...editedLessons, newLesson]);
    setExpandedLesson(newLesson.id);
  };

  const deleteLesson = (lessonId: string) => {
    const lesson = editedLessons.find(l => l.id === lessonId);
    if (lesson && !lesson.isNew) {
      setDeletedLessonIds([...deletedLessonIds, lessonId]);
    }
    setEditedLessons(editedLessons.filter(l => l.id !== lessonId));
    if (expandedLesson === lessonId) setExpandedLesson(null);
  };

  const updateLesson = (lessonId: string, updates: Partial<EditLesson>) => {
    setEditedLessons(editedLessons.map(l =>
      l.id === lessonId ? { ...l, ...updates } : l
    ));
  };

  const addQuestion = (lessonId: string) => {
    const lesson = editedLessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      question: "",
      type: "single",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
    };

    updateLesson(lessonId, {
      questions: [...(lesson.questions || []), newQuestion],
    });
  };

  const updateQuestion = (lessonId: string, questionId: string, updates: Partial<Question>) => {
    const lesson = editedLessons.find(l => l.id === lessonId);
    if (!lesson || !lesson.questions) return;

    updateLesson(lessonId, {
      questions: lesson.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    });
  };

  const deleteQuestion = (lessonId: string, questionId: string) => {
    const lesson = editedLessons.find(l => l.id === lessonId);
    if (!lesson || !lesson.questions) return;

    updateLesson(lessonId, {
      questions: lesson.questions.filter(q => q.id !== questionId),
    });
  };

  const updateQuestionOption = (lessonId: string, questionId: string, index: number, value: string) => {
    const lesson = editedLessons.find(l => l.id === lessonId);
    if (!lesson || !lesson.questions) return;

    const question = lesson.questions.find(q => q.id === questionId);
    if (!question) return;

    const newOptions = [...question.options];
    newOptions[index] = value;

    updateQuestion(lessonId, questionId, { options: newOptions });
  };

  const handleSave = () => {
    onSave(
      {
        title: editedCourse.title,
        description: editedCourse.description,
        difficulty: editedCourse.difficulty,
        is_ai_powered: editedCourse.is_ai_powered,
        thumbnail_emoji: editedCourse.thumbnail_emoji,
      },
      editedLessons,
      deletedLessonIds
    );
    toast.success(language === "en" ? "Course updated successfully!" : "Курс успешно обновлён!");
    onClose();
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "interactive": return <Code className="h-4 w-4" />;
      case "quiz": return <FileQuestion className="h-4 w-4" />;
      case "project": return <Lightbulb className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            {t.editCourse}
          </DialogTitle>
          <DialogDescription>
            {language === "en"
              ? "Edit course information and manage lessons"
              : "Редактируйте информацию о курсе и управляйте уроками"
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as "info" | "lessons")} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">{t.courseInfo}</TabsTrigger>
            <TabsTrigger value="lessons">{t.lessons} ({editedLessons.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t.title}</Label>
              <Input
                id="title"
                value={editedCourse.title}
                onChange={(e) => setEditedCourse({ ...editedCourse, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t.description}</Label>
              <Textarea
                id="description"
                rows={4}
                value={editedCourse.description ?? ""}
                onChange={(e) => setEditedCourse({ ...editedCourse, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">{t.difficulty}</Label>
              <Select
                value={editedCourse.difficulty}
                onValueChange={(v: any) => setEditedCourse({ ...editedCourse, difficulty: v })}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">{t.beginner}</SelectItem>
                  <SelectItem value="intermediate">{t.intermediate}</SelectItem>
                  <SelectItem value="advanced">{t.advanced}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t.thumbnailIcon}</Label>
              <div className="grid grid-cols-6 gap-2">
                {icons.map((icon) => (
                  <Button
                    key={icon}
                    type="button"
                    variant="outline"
                    className={`h-12 text-2xl ${
                      editedCourse.thumbnail_emoji === icon ? "border-primary bg-primary/10" : ""
                    }`}
                    onClick={() => setEditedCourse({ ...editedCourse, thumbnail_emoji: icon })}
                  >
                    {icon}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t.aiPowered}</Label>
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "Enable AI assistance" : "Включить помощь ИИ"}
                </p>
              </div>
              <Switch
                checked={editedCourse.is_ai_powered}
                onCheckedChange={(checked: any) => setEditedCourse({ ...editedCourse, is_ai_powered: checked })}
              />
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4 mt-4">
            <Button onClick={addLesson} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              {t.addLesson}
            </Button>

            <div className="space-y-3">
              {editedLessons.map((lesson, index) => (
                <Card key={lesson.id}>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          {getLessonIcon(lesson.type)}
                          <span>
                            {index + 1}. {lesson.title}
                          </span>
                          <Badge variant="outline">{lesson.type}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                        >
                          {expandedLesson === lesson.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLesson(lesson.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {expandedLesson === lesson.id && (
                    <CardContent className="p-4 pt-0 space-y-4">
                      <div className="space-y-2">
                        <Label>{t.lessonTitle}</Label>
                        <Input
                          value={lesson.title}
                          onChange={(e) => updateLesson(lesson.id, { title: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t.lessonType}</Label>
                          <Select
                            value={lesson.type}
                            onValueChange={(v: any) => updateLesson(lesson.id, { type: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="video">{t.video}</SelectItem>
                              <SelectItem value="interactive">{t.interactive}</SelectItem>
                              <SelectItem value="quiz">{t.quiz}</SelectItem>
                              <SelectItem value="project">{t.project}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>{t.duration}</Label>
                          <Input
                            value={lesson.duration}
                            placeholder="e.g., 15 min"
                            onChange={(e) => updateLesson(lesson.id, { duration: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{t.description}</Label>
                        <Textarea
                          rows={3}
                          value={lesson.description || ""}
                          onChange={(e) => updateLesson(lesson.id, { description: e.target.value })}
                        />
                      </div>

                      {/* Video URL field */}
                      {lesson.type === "video" && (
                        <div className="space-y-2">
                          <Label>{t.videoUrl}</Label>
                          <Input
                            value={lesson.videoUrl || ""}
                            placeholder="https://youtube.com/watch?v=..."
                            onChange={(e) => updateLesson(lesson.id, { videoUrl: e.target.value })}
                          />
                        </div>
                      )}

                      {/* Code Content field */}
                      {lesson.type === "interactive" && (
                        <div className="space-y-2">
                          <Label>{t.codeContent}</Label>
                          <Textarea
                            rows={6}
                            value={lesson.codeContent || ""}
                            placeholder="// Your code here..."
                            onChange={(e) => updateLesson(lesson.id, { codeContent: e.target.value })}
                            className="font-mono text-sm"
                          />
                        </div>
                      )}

                      {/* Project Description field */}
                      {lesson.type === "project" && (
                        <div className="space-y-2">
                          <Label>{t.projectDescription}</Label>
                          <Textarea
                            rows={6}
                            value={lesson.projectDescription || ""}
                            onChange={(e) => updateLesson(lesson.id, { projectDescription: e.target.value })}
                          />
                        </div>
                      )}

                      {/* Quiz Questions */}
                      {lesson.type === "quiz" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>{language === "en" ? "Quiz Questions" : "Вопросы теста"}</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addQuestion(lesson.id)}
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              {t.addQuestion}
                            </Button>
                          </div>

                          {lesson.questions && lesson.questions.length > 0 ? (
                            <div className="space-y-3">
                              {lesson.questions.map((question, qIndex) => (
                                <Card key={question.id} className="p-4">
                                  <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                      <Label>
                                        {language === "en" ? "Question" : "Вопрос"} {qIndex + 1}
                                      </Label>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteQuestion(lesson.id, question.id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                      </Button>
                                    </div>

                                    <Input
                                      value={question.question}
                                      placeholder={language === "en" ? "Enter your question..." : "Введите ваш вопрос..."}
                                      onChange={(e) => updateQuestion(lesson.id, question.id, { question: e.target.value })}
                                    />

                                    <div className="space-y-2">
                                      <Label>{t.questionType}</Label>
                                      <Select
                                        value={question.type}
                                        onValueChange={(v: any) => updateQuestion(lesson.id, question.id, { type: v as any })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="single">{t.singleChoice}</SelectItem>
                                          <SelectItem value="multiple">{t.multipleChoice}</SelectItem>
                                          <SelectItem value="text">{t.textAnswer}</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {(question.type === "single" || question.type === "multiple") && (
                                      <>
                                        <div className="space-y-2">
                                          <Label>{t.options}</Label>
                                          {question.options.map((option, optIndex) => (
                                            <Input
                                              key={optIndex}
                                              value={option}
                                              placeholder={`${language === "en" ? "Option" : "Вариант"} ${optIndex + 1}`}
                                              onChange={(e) => updateQuestionOption(lesson.id, question.id, optIndex, e.target.value)}
                                            />
                                          ))}
                                        </div>

                                        <div className="space-y-2">
                                          <Label>{t.correctAnswer}</Label>
                                          {question.type === "single" ? (
                                            <Select
                                              value={question.correctAnswer as string}
                                              onValueChange={(v: any) => updateQuestion(lesson.id, question.id, { correctAnswer: v })}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder={language === "en" ? "Select correct answer" : "Выберите правильный ответ"} />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {question.options.map((option, idx) => (
                                                  <SelectItem key={idx} value={option}>
                                                    {option || `${language === "en" ? "Option" : "Вариант"} ${idx + 1}`}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          ) : (
                                            <div className="text-sm text-muted-foreground">
                                              {language === "en"
                                                ? "Multiple correct answers can be selected during the quiz"
                                                : "Несколько правильных ответов можно выбрать во время теста"
                                              }
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    )}

                                    {question.type === "text" && (
                                      <div className="space-y-2">
                                        <Label>{t.correctAnswer}</Label>
                                        <Input
                                          value={question.correctAnswer as string}
                                          placeholder={language === "en" ? "Expected answer" : "Ожидаемый ответ"}
                                          onChange={(e) => updateQuestion(lesson.id, question.id, { correctAnswer: e.target.value })}
                                        />
                                      </div>
                                    )}

                                    <div className="space-y-2">
                                      <Label>{t.explanation}</Label>
                                      <Textarea
                                        rows={2}
                                        value={question.explanation || ""}
                                        placeholder={language === "en" ? "Explain why this is the correct answer..." : "Объясните, почему это правильный ответ..."}
                                        onChange={(e) => updateQuestion(lesson.id, question.id, { explanation: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">
                              {language === "en"
                                ? "No questions added yet. Click 'Add Question' to create quiz questions."
                                : "Вопросы еще не добавлены. Нажмите 'Добавить вопрос' для создания вопросов теста."
                              }
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={lesson.is_locked}
                            onCheckedChange={(checked: any) => updateLesson(lesson.id, { is_locked: checked })}
                          />
                          <Label>{t.locked}</Label>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}

              {editedLessons.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  {language === "en"
                    ? "No lessons added yet. Click 'Add Lesson' to get started."
                    : "Уроки еще не добавлены. Нажмите 'Добавить урок' чтобы начать."
                  }
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            {t.cancel}
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {t.save}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
