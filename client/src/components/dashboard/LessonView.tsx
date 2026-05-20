import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { useLanguage } from "../../lib/language-context";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Video, 
  FileText, 
  Code, 
  Lightbulb,
  Play,
  Pause,
  Volume2,
  Settings,
  Maximize,
  BookOpen,
  MessageSquare,
  Brain,
  Sparkles,
  Download,
  Share2
} from "lucide-react";

interface LessonContent {
  id: string;
  title: string;
  type: "video" | "interactive" | "quiz" | "project";
  duration: string;
  completed: boolean;
  videoUrl?: string;
  content?: string;
  codeExample?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  resources?: {
    name: string;
    type: string;
    url: string;
  }[];
}

interface Props {
  lesson: LessonContent;
  onBack: () => void;
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function LessonView({ 
  lesson, 
  onBack, 
  onComplete, 
  onNext, 
  onPrevious,
  hasNext,
  hasPrevious 
}: Props) {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);
  const [notes, setNotes] = useState("");

  const t = {
    back: language === "en" ? "Back to Course" : "К курсу",
    markComplete: language === "en" ? "Mark as Complete" : "Отметить завершённым",
    completed: language === "en" ? "Completed" : "Завершено",
    next: language === "en" ? "Next Lesson" : "Следующий урок",
    previous: language === "en" ? "Previous Lesson" : "Предыдущий урок",
    overview: language === "en" ? "Overview" : "Обзор",
    resources: language === "en" ? "Resources" : "Ресурсы",
    notes: language === "en" ? "Notes" : "Заметки",
    discussion: language === "en" ? "Discussion" : "Обсуждение",
    aiAssistant: language === "en" ? "AI Assistant" : "ИИ ассистент",
    yourNotes: language === "en" ? "Your notes..." : "Ваши заметки...",
    saveNotes: language === "en" ? "Save Notes" : "Сохранить",
    download: language === "en" ? "Download" : "Скачать",
    askAI: language === "en" ? "Ask AI" : "Спросить ИИ",
    submitAnswers: language === "en" ? "Submit Answers" : "Отправить ответы",
    yourAnswer: language === "en" ? "Your Answer" : "Ваш ответ",
    correctAnswers: language === "en" ? "Correct Answers" : "Правильных ответов",
    tryAgain: language === "en" ? "Try Again" : "Попробовать снова",
    continueToNext: language === "en" ? "Continue to Next" : "Продолжить"
  };

  const handleQuizSubmit = () => {
    setShowResults(true);
    const allCorrect = lesson.quiz?.every((q, index) => 
      selectedAnswers[index] === q.correctAnswer
    );
    if (allCorrect) {
      setTimeout(() => onComplete(), 1500);
    }
  };

  const getCorrectCount = () => {
    if (!lesson.quiz) return 0;
    return lesson.quiz.filter((q, index) => selectedAnswers[index] === q.correctAnswer).length;
  };

  const renderVideoPlayer = () => (
    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white space-y-4">
          <Video className="h-20 w-20 mx-auto opacity-50" />
          <p className="text-sm opacity-75">Video Player Placeholder</p>
          <Button
            size="lg"
            className="gap-2"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
        </div>
      </div>
      
      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <Progress value={progress} className="mb-2" />
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Volume2 className="h-4 w-4" />
            <span className="text-sm">5:32 / 15:00</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <Settings className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInteractiveContent = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Interactive Code Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{lesson.codeExample || `function helloWorld() {\n  console.log("Hello, World!");\n  return true;\n}`}</pre>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 gap-2">
              <Play className="h-4 w-4" />
              Run Code
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Output:</p>
            <code className="text-sm">Hello, World!</code>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <h3>Try it yourself!</h3>
            <p>{lesson.content || "Modify the code above to create your own greeting message. Try using different variable names and console.log statements."}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuiz = () => (
    <div className="space-y-4">
      {lesson.quiz?.map((question, qIndex) => (
        <Card key={qIndex}>
          <CardHeader>
            <CardTitle className="text-base">
              Question {qIndex + 1}: {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {question.options.map((option, oIndex) => {
              const isSelected = selectedAnswers[qIndex] === oIndex;
              const isCorrect = oIndex === question.correctAnswer;
              const showCorrect = showResults && isCorrect;
              const showWrong = showResults && isSelected && !isCorrect;

              return (
                <button
                  key={oIndex}
                  onClick={() => !showResults && setSelectedAnswers({...selectedAnswers, [qIndex]: oIndex})}
                  disabled={showResults}
                  className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                    showCorrect ? "border-green-500 bg-green-50 dark:bg-green-950" :
                    showWrong ? "border-red-500 bg-red-50 dark:bg-red-950" :
                    isSelected ? "border-primary bg-primary/5" :
                    "border-border hover:border-primary/50"
                  } ${showResults ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {showWrong && <span className="text-red-600">✕</span>}
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {showResults && (
        <Card className="border-2 border-primary">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="text-4xl mb-2">
              {getCorrectCount() === lesson.quiz?.length ? "🎉" : "📝"}
            </div>
            <h3>
              {t.correctAnswers}: {getCorrectCount()} / {lesson.quiz?.length}
            </h3>
            <p className="text-muted-foreground">
              {getCorrectCount() === lesson.quiz?.length 
                ? (language === "en" ? "Perfect! You've mastered this topic." : "Отлично! Вы освоили эту тему.")
                : (language === "en" ? "Good try! Review the material and try again." : "Хорошая попытка! Повторите материал и попробуйте снова.")}
            </p>
            <div className="flex gap-2">
              {getCorrectCount() !== lesson.quiz?.length && (
                <Button variant="outline" className="flex-1" onClick={() => {
                  setShowResults(false);
                  setSelectedAnswers({});
                }}>
                  {t.tryAgain}
                </Button>
              )}
              {getCorrectCount() === lesson.quiz?.length && (
                <Button className="flex-1" onClick={() => {
                  onComplete();
                  if (hasNext && onNext) {
                    setTimeout(() => onNext(), 500);
                  }
                }}>
                  {hasNext ? t.continueToNext : t.completed}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!showResults && (
        <Button 
          className="w-full" 
          onClick={handleQuizSubmit}
          disabled={Object.keys(selectedAnswers).length !== lesson.quiz?.length}
        >
          {t.submitAnswers}
        </Button>
      )}
    </div>
  );

  const renderProjectContent = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Project Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose dark:prose-invert max-w-none">
            <h3>Build Your First AI-Enhanced Application</h3>
            <p>{lesson.content || "In this project, you'll create a fully functional web application that demonstrates your understanding of the concepts covered in this course."}</p>
            
            <h4>Requirements:</h4>
            <ul>
              <li>Create a responsive user interface</li>
              <li>Implement core functionality using JavaScript</li>
              <li>Add AI-powered features</li>
              <li>Write clean, documented code</li>
            </ul>

            <h4>Submission Guidelines:</h4>
            <ol>
              <li>Complete all required features</li>
              <li>Test your application thoroughly</li>
              <li>Upload your code to GitHub</li>
              <li>Submit the project link below</li>
            </ol>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Project URL (GitHub/CodePen)</label>
            <input 
              type="text" 
              placeholder="https://github.com/username/project"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Project Description</label>
            <Textarea 
              placeholder="Describe your project and the technologies you used..."
              rows={4}
            />
          </div>

          <Button className="w-full gap-2">
            <CheckCircle className="h-4 w-4" />
            Submit Project
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderMainContent = () => {
    switch (lesson.type) {
      case "video":
        return (
          <div className="space-y-4">
            {renderVideoPlayer()}
            <Card>
              <CardContent className="pt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <h3>Lesson Overview</h3>
                  <p>{lesson.content || "In this lesson, you'll learn about the fundamentals of AI-assisted coding. We'll explore how AI can help you write better code faster and understand complex programming concepts."}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "interactive":
        return renderInteractiveContent();
      case "quiz":
        return renderQuiz();
      case "project":
        return renderProjectContent();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t.back}
        </Button>
        <div className="flex items-center gap-2">
          {lesson.completed ? (
            <Badge className="gap-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
              <CheckCircle className="h-3 w-3" />
              {t.completed}
            </Badge>
          ) : (
            <Button onClick={onComplete} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              {t.markComplete}
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Lesson Title */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {lesson.type === "video" && <Video className="h-4 w-4" />}
                    {lesson.type === "interactive" && <Code className="h-4 w-4" />}
                    {lesson.type === "quiz" && <FileText className="h-4 w-4" />}
                    {lesson.type === "project" && <Lightbulb className="h-4 w-4" />}
                    <span>{lesson.duration}</span>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">{lesson.title}</CardTitle>
                </div>
                <Sparkles className="h-6 w-6 text-purple-500 shrink-0" />
              </div>
            </CardHeader>
          </Card>

          {/* Lesson Content */}
          {renderMainContent()}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex-1 gap-2" 
              onClick={onPrevious}
              disabled={!hasPrevious}
            >
              <ArrowLeft className="h-4 w-4" />
              {t.previous}
            </Button>
            <Button 
              className="flex-1 gap-2" 
              onClick={onNext}
              disabled={!hasNext}
            >
              {t.next}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Tabs for additional content */}
          <Card>
            <Tabs defaultValue="resources" className="w-full">
              <CardHeader className="pb-3">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="resources" className="text-xs sm:text-sm">{t.resources}</TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs sm:text-sm">{t.notes}</TabsTrigger>
                </TabsList>
              </CardHeader>
              
              <CardContent>
                <TabsContent value="resources" className="space-y-3 mt-0">
                  {lesson.resources?.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{resource.name}</p>
                          <p className="text-xs text-muted-foreground">{resource.type}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )) || (
                    <>
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium">Lesson Slides</p>
                            <p className="text-xs text-muted-foreground">PDF, 2.4 MB</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Code className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium">Code Examples</p>
                            <p className="text-xs text-muted-foreground">ZIP, 156 KB</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium">Additional Reading</p>
                            <p className="text-xs text-muted-foreground">Article Link</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="notes" className="space-y-3 mt-0">
                  <Textarea 
                    placeholder={t.yourNotes}
                    rows={8}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="resize-none"
                  />
                  <Button className="w-full">
                    {t.saveNotes}
                  </Button>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* AI Assistant */}
          <Card className="border-2 border-purple-200 dark:border-purple-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Brain className="h-5 w-5 text-purple-500" />
                {t.aiAssistant}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {language === "en" 
                  ? "Need help? Ask our AI assistant any questions about this lesson."
                  : "Нужна помощь? Спросите нашего ИИ ассистента о материале урока."}
              </p>
              <Button className="w-full gap-2">
                <MessageSquare className="h-4 w-4" />
                {t.askAI}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}