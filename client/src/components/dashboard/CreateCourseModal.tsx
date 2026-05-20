import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useLanguage } from "../../lib/language-context";
import { X, Brain, Zap, Upload, Video, Code, FileText, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (course: any) => void;
}

export function CreateCourseModal({ open, onClose, onSave }: Props) {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    estimatedTime: "",
    aiPowered: true,
    interactive: true,
    thumbnail: "📚"
  });

  const t = {
    title: language === "en" ? "Create New Course" : "Создать новый курс",
    step: language === "en" ? "Step" : "Шаг",
    of: language === "en" ? "of" : "из",
    basicInfo: language === "en" ? "Basic Information" : "Основная информация",
    courseSettings: language === "en" ? "Course Settings" : "Настройки курса",
    courseName: language === "en" ? "Course Name" : "Название курса",
    courseNamePlaceholder: language === "en" ? "e.g., Advanced Web Development" : "например, Продвинутая веб-разработка",
    description: language === "en" ? "Description" : "Описание",
    descriptionPlaceholder: language === "en" 
      ? "Describe what students will learn..."
      : "Опишите, что узнают студенты...",
    category: language === "en" ? "Category" : "Категория",
    categoryPlaceholder: language === "en" ? "e.g., Development, Design, Data Science" : "например, Разработка, Дизайн, Наука о данных",
    difficulty: language === "en" ? "Difficulty Level" : "Уровень сложности",
    beginner: language === "en" ? "Beginner" : "Начинающий",
    intermediate: language === "en" ? "Intermediate" : "Средний",
    advanced: language === "en" ? "Advanced" : "Продвинутый",
    estimatedTime: language === "en" ? "Estimated Duration" : "Примерная длительность",
    estimatedTimePlaceholder: language === "en" ? "e.g., 8 weeks, 40 hours" : "например, 8 недель, 40 часов",
    aiFeatures: language === "en" ? "AI Features" : "ИИ возможности",
    aiPowered: language === "en" ? "AI-Powered Learning" : "Обучение с ИИ",
    aiPoweredDesc: language === "en" 
      ? "Enable intelligent tutoring and personalized feedback"
      : "Включить интеллектуальное обучение и персональную обратную связь",
    interactiveLearning: language === "en" ? "Interactive Learning" : "Интерактивное обучение",
    interactiveLearningDesc: language === "en"
      ? "Add interactive exercises and real-time practice"
      : "Добавить интерактивные упражнения и практику в реальном времени",
    thumbnailIcon: language === "en" ? "Thumbnail Icon" : "Иконка превью",
    selectIcon: language === "en" ? "Select an icon for your course" : "Выберите иконку для курса",
    cancel: language === "en" ? "Cancel" : "Отменить",
    previous: language === "en" ? "Previous" : "Назад",
    next: language === "en" ? "Next" : "Далее",
    createCourse: language === "en" ? "Create Course" : "Создать курс",
    courseCreated: language === "en" ? "Course created successfully!" : "Курс успешно создан!",
    courseCreatedDesc: language === "en" 
      ? "Your AI-powered course is ready to go!"
      : "Ваш курс с ИИ готов к использованию!"
  };

  const icons = ["📚", "💻", "🎨", "🤖", "📊", "🎓", "🔬", "📱", "🌐", "⚡", "🎯", "🚀"];

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast.error(language === "en" ? "Please fill in all required fields" : "Заполните все обязательные поля");
      return;
    }

    // Simulate course creation
    toast.success(t.courseCreated, {
      description: t.courseCreatedDesc
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "",
      difficulty: "beginner",
      estimatedTime: "",
      aiPowered: true,
      interactive: true,
      thumbnail: "📚"
    });
    setStep(1);
    onClose();
    onSave(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
        <div className="sticky top-0 z-10 bg-background border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl mb-1">{t.title}</h2>
              <p className="text-sm text-muted-foreground">
                {t.step} {step} {t.of} 2
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          {/* Progress bar */}
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4">{t.basicInfo}</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">{t.courseName} *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder={t.courseNamePlaceholder}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">{t.description} *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder={t.descriptionPlaceholder}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="category">{t.category}</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder={t.categoryPlaceholder}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="estimatedTime">{t.estimatedTime}</Label>
                      <Input
                        id="estimatedTime"
                        value={formData.estimatedTime}
                        onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                        placeholder={t.estimatedTimePlaceholder}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>{t.difficulty}</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {(["beginner", "intermediate", "advanced"] as const).map((level) => (
                        <Button
                          key={level}
                          type="button"
                          variant={formData.difficulty === level ? "default" : "outline"}
                          onClick={() => setFormData({ ...formData, difficulty: level })}
                          className="w-full"
                        >
                          {t[level]}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4">{t.courseSettings}</h3>
                
                <div className="space-y-6">
                  {/* AI Features */}
                  <div>
                    <h4 className="mb-3">{t.aiFeatures}</h4>
                    <div className="space-y-3">
                      <Card
                        className={`p-4 cursor-pointer transition-all ${
                          formData.aiPowered ? "border-primary bg-primary/5" : "hover:bg-accent"
                        }`}
                        onClick={() => setFormData({ ...formData, aiPowered: !formData.aiPowered })}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            formData.aiPowered ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}>
                            <Brain className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium">{t.aiPowered}</p>
                              <div className={`h-5 w-9 rounded-full transition-colors ${
                                formData.aiPowered ? "bg-primary" : "bg-muted"
                              }`}>
                                <div className={`h-4 w-4 bg-white rounded-full shadow-sm transition-transform m-0.5 ${
                                  formData.aiPowered ? "translate-x-4" : "translate-x-0"
                                }`} />
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{t.aiPoweredDesc}</p>
                          </div>
                        </div>
                      </Card>

                      <Card
                        className={`p-4 cursor-pointer transition-all ${
                          formData.interactive ? "border-primary bg-primary/5" : "hover:bg-accent"
                        }`}
                        onClick={() => setFormData({ ...formData, interactive: !formData.interactive })}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            formData.interactive ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}>
                            <Zap className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium">{t.interactiveLearning}</p>
                              <div className={`h-5 w-9 rounded-full transition-colors ${
                                formData.interactive ? "bg-primary" : "bg-muted"
                              }`}>
                                <div className={`h-4 w-4 bg-white rounded-full shadow-sm transition-transform m-0.5 ${
                                  formData.interactive ? "translate-x-4" : "translate-x-0"
                                }`} />
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{t.interactiveLearningDesc}</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Thumbnail Selection */}
                  <div>
                    <Label>{t.thumbnailIcon}</Label>
                    <p className="text-sm text-muted-foreground mb-3">{t.selectIcon}</p>
                    <div className="grid grid-cols-6 gap-2">
                      {icons.map((icon) => (
                        <Button
                          key={icon}
                          type="button"
                          variant="outline"
                          className={`h-12 text-2xl ${
                            formData.thumbnail === icon ? "border-primary bg-primary/10" : ""
                          }`}
                          onClick={() => setFormData({ ...formData, thumbnail: icon })}
                        >
                          {icon}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div>
                    <Label>{language === "en" ? "Preview" : "Предпросмотр"}</Label>
                    <Card className="p-4 mt-2">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{formData.thumbnail}</div>
                        <div className="flex-1">
                          <h4 className="mb-1">{formData.title || (language === "en" ? "Your Course Title" : "Название вашего курса")}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {formData.description || (language === "en" ? "Your course description will appear here..." : "Описание вашего курса появится здесь...")}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {formData.aiPowered && (
                              <Badge className="gap-1">
                                <Brain className="h-3 w-3" />
                                AI
                              </Badge>
                            )}
                            {formData.interactive && (
                              <Badge className="gap-1">
                                <Zap className="h-3 w-3" />
                                {language === "en" ? "Interactive" : "Интерактивный"}
                              </Badge>
                            )}
                            {formData.category && (
                              <Badge variant="secondary">{formData.category}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t p-6">
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              {t.cancel}
            </Button>
            <div className="flex gap-2">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  {t.previous}
                </Button>
              )}
              {step < 2 ? (
                <Button onClick={() => setStep(step + 1)}>
                  {t.next}
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="gap-2">
                  <Brain className="h-4 w-4" />
                  {t.createCourse}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}