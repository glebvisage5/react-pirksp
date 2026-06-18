import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useLanguage } from "../../lib/language-context";
import { X, Brain, Upload } from "lucide-react";
import { toast } from "sonner";

export interface CreateCourseFormData {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  is_ai_powered: boolean;
  thumbnail_emoji: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (course: CreateCourseFormData) => void;
}

export function CreateCourseModal({ open, onClose, onSave }: Props) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<CreateCourseFormData>({
    title: "",
    description: "",
    difficulty: "beginner",
    is_ai_powered: true,
    thumbnail_emoji: "📚"
  });

  const t = {
    title: language === "en" ? "Create New Course" : "Создать новый курс",
    courseName: language === "en" ? "Course Name" : "Название курса",
    courseNamePlaceholder: language === "en" ? "e.g., Advanced Web Development" : "например, Продвинутая веб-разработка",
    description: language === "en" ? "Description" : "Описание",
    descriptionPlaceholder: language === "en"
      ? "Describe what students will learn..."
      : "Опишите, что узнают студенты...",
    difficulty: language === "en" ? "Difficulty Level" : "Уровень сложности",
    beginner: language === "en" ? "Beginner" : "Начинающий",
    intermediate: language === "en" ? "Intermediate" : "Средний",
    advanced: language === "en" ? "Advanced" : "Продвинутый",
    aiPowered: language === "en" ? "AI-Powered Learning" : "Обучение с ИИ",
    aiPoweredDesc: language === "en"
      ? "Enable intelligent tutoring and personalized feedback"
      : "Включить интеллектуальное обучение и персональную обратную связь",
    thumbnailIcon: language === "en" ? "Thumbnail Icon" : "Иконка превью",
    selectIcon: language === "en" ? "Select an icon for your course" : "Выберите иконку для курса",
    cancel: language === "en" ? "Cancel" : "Отменить",
    createCourse: language === "en" ? "Create Course" : "Создать курс",
  };

  const icons = ["📚", "💻", "🎨", "🤖", "📊", "🎓", "🔬", "📱", "🌐", "⚡", "🎯", "🚀"];

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast.error(language === "en" ? "Please fill in all required fields" : "Заполните все обязательные поля");
      return;
    }
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
            <h2 className="text-2xl">{t.title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
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

          {/* AI Feature toggle */}
          <Card
            className={`p-4 cursor-pointer transition-all ${
              formData.is_ai_powered ? "border-primary bg-primary/5" : "hover:bg-accent"
            }`}
            onClick={() => setFormData({ ...formData, is_ai_powered: !formData.is_ai_powered })}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                formData.is_ai_powered ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}>
                <Brain className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">{t.aiPowered}</p>
                  <div className={`h-5 w-9 rounded-full transition-colors ${
                    formData.is_ai_powered ? "bg-primary" : "bg-muted"
                  }`}>
                    <div className={`h-4 w-4 bg-white rounded-full shadow-sm transition-transform m-0.5 ${
                      formData.is_ai_powered ? "translate-x-4" : "translate-x-0"
                    }`} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{t.aiPoweredDesc}</p>
              </div>
            </div>
          </Card>

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
                    formData.thumbnail_emoji === icon ? "border-primary bg-primary/10" : ""
                  }`}
                  onClick={() => setFormData({ ...formData, thumbnail_emoji: icon })}
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
                <div className="text-4xl">{formData.thumbnail_emoji}</div>
                <div className="flex-1">
                  <h4 className="mb-1">{formData.title || (language === "en" ? "Your Course Title" : "Название вашего курса")}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {formData.description || (language === "en" ? "Your course description will appear here..." : "Описание вашего курса появится здесь...")}
                  </p>
                  {formData.is_ai_powered && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge className="gap-1">
                        <Brain className="h-3 w-3" />
                        AI
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t p-6">
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Upload className="h-4 w-4" />
              {t.createCourse}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
