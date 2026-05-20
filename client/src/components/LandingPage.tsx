import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { GraduationCap, Users, BookOpen, BarChart3, MessageSquare, Calendar, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Header } from "./Header";
import { useLanguage } from "../lib/language-context";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
    <CardContent className="pt-6">
      <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

interface Props {
  onGetStarted: () => void;
  onLogin: () => void;
  onBackToServices?: () => void;
}

export function LandingPage({ onGetStarted, onLogin, onBackToServices }: Props) {
  const { language } = useLanguage();

  const t = {
    badge: language === "en" ? "Modern Learning Management" : "Современное управление обучением",
    heroTitle1: language === "en" ? "Transform Your" : "Преобразуйте ваш",
    heroTitle2: language === "en" ? "Learning Experience" : "опыт обучения",
    heroDescription: language === "en" 
      ? "EduCRM is the all-in-one platform for managing students, courses, and academic performance with powerful analytics and seamless collaboration."
      : "EduCRM - это универсальная платформа для управления учащимися, курсами и академической успеваемостью с мощной аналитикой и бесшовной коллаборацией.",
    getStarted: language === "en" ? "Get Started" : "Начать",
    watchDemo: language === "en" ? "Watch Demo" : "Смотреть демо",
    activeStudents: language === "en" ? "Active Students" : "Активных студентов",
    institutions: language === "en" ? "Institutions" : "Учреждений",
    satisfaction: language === "en" ? "Satisfaction" : "Удовлетворённость",
    featuresTitle: language === "en" ? "Everything You Need" : "Всё что вам нужно",
    featuresSubtitle: language === "en"
      ? "Powerful features designed to streamline education management and enhance learning outcomes"
      : "Мощные функции для оптимизации управления образованием и улучшения результатов обучения",
  };

  const features = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: language === "en" ? "Student Management" : "Управление студентами",
      description: language === "en" 
        ? "Comprehensive student profiles, enrollment tracking, and performance monitoring all in one place."
        : "Полные профили студентов, отслеживание зачислений и мониторинг успеваемости в одном месте."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: language === "en" ? "Course Organization" : "Организация курсов",
      description: language === "en"
        ? "Create, manage, and track courses with scheduling, assignments, and resource management."
        : "Создавайте, управляйте и отслеживайте курсы с расписанием, заданиями и управлением ресурсами."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: language === "en" ? "Advanced Analytics" : "Продвинутая аналитика",
      description: language === "en"
        ? "Data-driven insights with visual dashboards to track progress and performance metrics."
        : "Инсайты на основе данных с визуальными дашбордами для отслеживания прогресса и метрик."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: language === "en" ? "Communication Hub" : "Центр коммуникаций",
      description: language === "en"
        ? "Integrated messaging, announcements, and notifications for seamless communication."
        : "Интегрированные сообщения, объявления и уведомления для бесшовной коммуникации."
    },
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: language === "en" ? "Smart Scheduling" : "Умное расписание",
      description: language === "en"
        ? "Automated scheduling with calendar integration and deadline management."
        : "Автоматизированное расписание с интеграцией календаря и управлением дедлайнами."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: language === "en" ? "Task Tracking" : "Отслеживание задач",
      description: language === "en"
        ? "Monitor assignments, projects, and tasks with progress tracking and team collaboration."
        : "Мониторинг заданий, проектов и задач с отслеживанием прогресса и командной работой."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header onLogin={onLogin} onRegister={onGetStarted} onBackToServices={onBackToServices} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-green-50 dark:from-purple-950/20 dark:via-indigo-950/20 dark:to-green-950/20" />
        
        <div className="container relative px-4 pt-20 pb-24 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full mx-auto lg:mx-0">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">{t.badge}</span>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl">
                  {t.heroTitle1}
                  <span className="block mt-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-green-600 dark:from-purple-400 dark:via-indigo-400 dark:to-green-400 bg-clip-text text-transparent">{t.heroTitle2}</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
                  {t.heroDescription}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
                <Button size="lg" onClick={onGetStarted} className="group w-full sm:w-auto text-white shadow-lg hover:shadow-xl transition-shadow" style={{
                  background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)',
                  color: 'white'
                }}>
                  {t.getStarted}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5]/10">
                  {t.watchDemo}
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl">10K+</div>
                  <p className="text-xs md:text-sm text-muted-foreground">{t.activeStudents}</p>
                </div>
                <div className="hidden sm:block h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-2xl md:text-3xl">500+</div>
                  <p className="text-xs md:text-sm text-muted-foreground">{t.institutions}</p>
                </div>
                <div className="hidden sm:block h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-2xl md:text-3xl">98%</div>
                  <p className="text-xs md:text-sm text-muted-foreground">{t.satisfaction}</p>
                </div>
              </div>
            </div>
            <div className="relative lg:order-last order-first">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-3xl" />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1625819988276-79d18daddfc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMG93bCUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjUwNDIzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="3D Owl Education Platform"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-green-300 dark:bg-green-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-24 bg-background">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl">{t.featuresTitle}</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.featuresSubtitle}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-gradient-to-br from-purple-50 via-indigo-50 to-green-50 dark:from-purple-950/20 dark:via-indigo-950/20 dark:to-green-950/20">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl">{language === "en" ? "How EduCRM Works" : "Как работает EduCRM"}</h2>
            <p className="text-lg md:text-xl text-muted-foreground">{language === "en" ? "Simple, powerful, and effective" : "Просто, мощно и эффективно"}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative order-2 lg:order-1">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1647320293733-92affa4fa39c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGxlYXJuaW5nJTIwcGxhdGZvcm18ZW58MXx8fHwxNzY0NzYwOTgxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Learning Platform Interface"
                className="rounded-3xl shadow-2xl w-full"
              />
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg" style={{
                  background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)'
                }}>
                  1
                </div>
                <div>
                  <h3 className="mb-2">{language === "en" ? "Create Your Account" : "Создайте аккаунт"}</h3>
                  <p className="text-muted-foreground">{language === "en" ? "Sign up in seconds and customize your institution's profile with your branding and preferences." : "Зарегистрируйтесь за секунды и настройте профиль вашего учреждения с вашим брендингом и предпочтениями."}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg" style={{
                  background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)'
                }}>
                  2
                </div>
                <div>
                  <h3 className="mb-2">{language === "en" ? "Add Students & Courses" : "Добавьте студентов и курсы"}</h3>
                  <p className="text-muted-foreground">{language === "en" ? "Import your student database and set up courses with our intuitive interface." : "Импортируйте базу данных студентов и настройте курсы с помощью нашего интуитивного интерфейса."}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg" style={{
                  background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)'
                }}>
                  3
                </div>
                <div>
                  <h3 className="mb-2">{language === "en" ? "Track & Analyze" : "Отслеживайте и анализируйте"}</h3>
                  <p className="text-muted-foreground">{language === "en" ? "Monitor progress, track performance, and make data-driven decisions with powerful analytics." : "Мониторьте прогресс, отслеживайте эффективность и принимайте решения на основе данных с мощной аналитикой."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="about" className="py-20 sm:py-24 bg-background">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden" style={{
            background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)'
          }}>
            <div className="absolute inset-0 opacity-10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1637401937636-f7d5bb75e0a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGFic3RyYWN0JTIwZ3JhZGllbnR8ZW58MXx8fHwxNzY0NzM2MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Background"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative text-center text-white space-y-8">
              <h2 className="text-3xl md:text-4xl">{language === "en" ? "Trusted by Educational Institutions Worldwide" : "Нам доверяют образовательные учреждения по всему миру"}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
                <div>
                  <div className="text-4xl md:text-5xl mb-2">500+</div>
                  <p className="text-sm md:text-base opacity-90">{language === "en" ? "Schools & Institutions" : "Школ и учреждений"}</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl mb-2">10K+</div>
                  <p className="text-sm md:text-base opacity-90">{language === "en" ? "Active Students" : "Активных студентов"}</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl mb-2">2K+</div>
                  <p className="text-sm md:text-base opacity-90">{language === "en" ? "Courses Available" : "Доступных курсов"}</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl mb-2">98%</div>
                  <p className="text-sm md:text-base opacity-90">{language === "en" ? "Satisfaction Rate" : "Уровень удовлетворённости"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 sm:py-24 bg-gradient-to-br from-purple-50 via-indigo-50 to-green-50 dark:from-purple-950/20 dark:via-indigo-950/20 dark:to-green-950/20">
        <div className="container px-4 max-w-7xl mx-auto">
          <Card className="border-2 border-primary/20 max-w-5xl mx-auto">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <GraduationCap className="h-16 w-16 text-primary mx-auto" />
              <h2 className="text-3xl md:text-4xl">{language === "en" ? "Ready to Transform Your Institution?" : "Готовы трансформировать ваше учреждение?"}</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {language === "en" 
                  ? "Join thousands of educational institutions already using EduCRM to streamline their operations and improve student outcomes."
                  : "Присоединяйтесь к тысячам образовательных учреждений, которые уже используют EduCRM для оптимизации своих операций и улучшения результатов студентов."}
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center pt-4">
                <Button size="lg" onClick={onGetStarted} className="w-full sm:w-auto text-white shadow-lg hover:shadow-xl transition-shadow" style={{
                  background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)',
                  color: 'white'
                }}>
                  {language === "en" ? "Start Free Trial" : "Начать пробный период"}
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5]/10">
                  {language === "en" ? "Schedule a Demo" : "Запланировать демо"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container px-4 py-12 mx-auto max-w-7xl text-center">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-center">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold">EduCRM</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === "en" 
                  ? "Modern learning management system for the future of education."
                  : "Современная система управления обучением для будущего образования."}
              </p>
            </div>
            <div>
              <h4 className="mb-4">{language === "en" ? "Product" : "Продукт"}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">{language === "en" ? "Features" : "Возможности"}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{language === "en" ? "Pricing" : "Цены"}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{language === "en" ? "Demo" : "Демо"}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">{language === "en" ? "Company" : "Компания"}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">{language === "en" ? "About" : "О нас"}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{language === "en" ? "Blog" : "Блог"}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{language === "en" ? "Careers" : "Карьера"}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">{language === "en" ? "Support" : "Поддержка"}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">{language === "en" ? "Help Center" : "Центр помощи"}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{language === "en" ? "Contact" : "Контакты"}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{language === "en" ? "Privacy" : "Конфиденциальность"}</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>{language === "en" ? "© 2024 EduCRM. All rights reserved." : "© 2024 EduCRM. Все права защищены."}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}