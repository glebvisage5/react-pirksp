import { useState, useRef } from "react";
import { apiLogin, apiRegister } from "../../api/auth";
import { Button } from "../ui/button";
import { Moon, Sun, Globe, Sparkles, ChevronRight, Code2, Zap, Users, Shield, CheckCircle2, Clock, Package, Star, Briefcase, HeadphonesIcon, Lightbulb, Rocket, Settings, TrendingUp, Mail, Lock, User, Eye, EyeOff, Building, Menu, X, FileText } from "lucide-react";
import { useTheme } from "../../lib/theme-context";
import { useLanguage } from "../../lib/language-context";
import { useUser } from "../../lib/user-context";
import { ServicesModal } from "./ServicesModal";
import { TechLogos } from "./TechLogos";
import { PrivacyPolicy } from "./PrivacyPolicy";
import { TermsOfService } from "./TermsOfService";
import { ContactModal } from "./ContactModal";
import { motion } from "motion/react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { toast } from "sonner@2.0.3";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { getTranslations, type Language } from "../../lib/translations";

interface CompanyHomeProps {
  onLogin: () => void;
  onServiceSelect: (serviceId: string) => void;
  isAuthenticated: boolean;
}

export function CompanyHome({ onLogin, onServiceSelect, isAuthenticated }: CompanyHomeProps) {
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { setUser } = useUser();
  const orderFormRef = useRef<HTMLElement>(null);

  // Get translations
  const t = getTranslations(language as Language);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    institution: "",
    password: "",
    confirmPassword: ""
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) return;
    try {
      const { user } = await apiLogin(loginForm.email, loginForm.password);
      setUser(user);
      onLogin();
      setIsLoginModalOpen(false);
      setTimeout(() => setIsServicesModalOpen(true), 300);
      toast.success(t.validation.loginSuccess, {
        duration: 3000,
        className: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ошибка входа";
      toast.error(msg, {
        duration: 3000,
        className: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error(language === "en" ? "Passwords do not match" : "Пароли не совпадают", {
        duration: 3000,
        className: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      });
      return;
    }
    try {
      const { user } = await apiRegister(registerForm.name, registerForm.email, registerForm.password);
      setUser(user);
      onLogin();
      setIsRegisterModalOpen(false);
      setTimeout(() => setIsServicesModalOpen(true), 300);
      toast.success(t.validation.registerSuccess, {
        duration: 3000,
        className: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ошибка регистрации";
      toast.error(msg, {
        duration: 3000,
        className: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      });
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    setIsServicesModalOpen(false);
    onServiceSelect(serviceId);
  };

  const handleExploreServices = () => {
    if (isAuthenticated) {
      setIsServicesModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const scrollToOrderForm = () => {
    setIsServicesModalOpen(false);
    setIsMobileMenuOpen(false);
    // Используем requestAnimationFrame для гарантии, что DOM обновлен
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (orderFormRef.current) {
          orderFormRef.current.scrollIntoView({ 
            behavior: "smooth", 
            block: "start" 
          });
        }
      }, 50);
    });
  };

  // Features data
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: t.features.items[0].title,
      description: t.features.items[0].description,
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t.features.items[1].title,
      description: t.features.items[1].description,
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t.features.items[2].title,
      description: t.features.items[2].description,
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: t.features.items[3].title,
      description: t.features.items[3].description,
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6" />,
      title: t.features.items[4].title,
      description: t.features.items[4].description,
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: t.features.items[5].title,
      description: t.features.items[5].description,
      color: "from-red-500 to-pink-600"
    }
  ];

  // Programming languages for the ticker
  const programmingLanguages = [
    { name: "React", Logo: TechLogos.React },
    { name: "TypeScript", Logo: TechLogos.TypeScript },
    { name: "Python", Logo: TechLogos.Python },
    { name: "Node.js", Logo: TechLogos.NodeJS },
    { name: "PostgreSQL", Logo: TechLogos.PostgreSQL },
    { name: "MongoDB", Logo: TechLogos.MongoDB },
    { name: "Docker", Logo: TechLogos.Docker },
    { name: "Kubernetes", Logo: TechLogos.Kubernetes },
    { name: "GraphQL", Logo: TechLogos.GraphQL },
    { name: "Next.js", Logo: TechLogos.NextJS },
    { name: "Vue.js", Logo: TechLogos.VueJS },
    { name: "Go", Logo: TechLogos.Go }
  ];

  // Company services
  const companyServices = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: language === "en" ? "CRM Development" : "Разработка CRM",
      description: language === "en"
        ? "Custom CRM solutions tailored to your business processes and requirements"
        : "Кастомные CRM решения, адаптированные под ваши бизнес-процессы и требования",
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: language === "en" ? "Consulting" : "Консалтинг",
      description: language === "en"
        ? "Expert advice on digital transformation and system architecture"
        : "Экспертные советы по цифровой трансформации и архитектуре систем",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: language === "en" ? "Integration Services" : "Интеграция",
      description: language === "en"
        ? "Seamless integration with existing tools and third-party services"
        : "Бесшовная интеграция с существующими инструментами и сторонними сервисами",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6" />,
      title: language === "en" ? "24/7 Support" : "Поддержка 24/7",
      description: language === "en"
        ? "Round-the-clock technical support and system maintenance"
        : "Круглосуточная техническая поддержка и обслуживание систем",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: language === "en" ? "Analytics & BI" : "Аналитика и BI",
      description: language === "en"
        ? "Advanced analytics and business intelligence dashboards"
        : "Продвинутая аналитика и дашборды бизнес-аналитики",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: language === "en" ? "Cloud Deployment" : "Облачное развёртывание",
      description: language === "en"
        ? "Secure cloud infrastructure setup and migration services"
        : "Настройка безопасной облачной инфраструктуры и миграция",
      color: "from-red-500 to-pink-600"
    }
  ];

  // Client projects
  const projects = [
    {
      id: 1,
      title: language === "en" ? "EduCRM Platform" : "Платформа EduCRM",
      description: language === "en" 
        ? "Complete CRM system for educational institutions with student management"
        : "Полная CRM система для учебных заведений с управлением студентами",
      tech: "React, TypeScript, Node.js",
      status: language === "en" ? "Completed" : "Завершён",
      isOrder: true
    },
    {
      id: 2,
      title: language === "en" ? "RetailPro Analytics" : "RetailPro Аналитика",
      description: language === "en"
        ? "Advanced analytics dashboard for retail business intelligence"
        : "Продвинутая аналитическая панель для розничной торговли",
      tech: "Vue.js, Python, PostgreSQL",
      status: language === "en" ? "In Development" : "В разработке",
      isOrder: true
    },
    {
      id: 3,
      title: language === "en" ? "HealthTrack System" : "Система HealthTrack",
      description: language === "en"
        ? "Patient management and appointment scheduling for healthcare"
        : "Управление пациентами и запись на приём для здравоохранения",
      tech: "React, GraphQL, MongoDB",
      status: language === "en" ? "In Development" : "В разработке",
      isOrder: false
    },
    {
      id: 4,
      title: language === "en" ? "FinanceHub Portal" : "Портал FinanceHub",
      description: language === "en"
        ? "Financial management and reporting platform for enterprises"
        : "Платформа финансового управления и отчётности для предприятий",
      tech: "Next.js, TypeScript, Go",
      status: language === "en" ? "Completed" : "Завершён",
      isOrder: true
    },
    {
      id: 5,
      title: language === "en" ? "LogisticsPro CRM" : "LogisticsPro CRM",
      description: language === "en"
        ? "Supply chain and logistics management solution"
        : "Решение для управления цепочками поставок и логистикой",
      tech: "React, Node.js, Docker",
      status: language === "en" ? "Planning" : "Планирование",
      isOrder: false
    },
    {
      id: 6,
      title: language === "en" ? "RealEstate Manager" : "RealEstate Manager",
      description: language === "en"
        ? "Property management system with client portal"
        : "Система управления недвижимостью с клиентским порталом",
      tech: "Vue.js, Python, Kubernetes",
      status: language === "en" ? "Completed" : "Завершён",
      isOrder: true
    }
  ];

  // Client testimonials
  const testimonials = t.testimonials.items.map((item, index) => ({
    id: index + 1,
    name: item.name,
    role: item.role,
    company: item.company,
    avatar: item.name.split(' ').map(n => n[0]).join(''),
    rating: 5,
    text: item.text
  }));

  // Stats data
  const stats = t.stats.items;

  // Form state
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    company: "",
    project: "",
    description: ""
  });

  const handleFormChange = (field: string, value: string) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t.validation.contactSuccess, {
      duration: 3000,
      className: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
    });
    setOrderForm({
      name: "",
      email: "",
      company: "",
      project: "",
      description: ""
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-green-600 dark:from-purple-400 dark:via-indigo-400 dark:to-green-400 bg-clip-text text-transparent">
                  {t.company}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {t.tagline}
                </p>
              </div>
            </motion.div>

            {/* Navigation & Controls - Desktop */}
            <motion.div 
              className="hidden md:flex items-center gap-2 sm:gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="gap-2"
              >
                <Globe className="h-4 w-4" />
                <span>{t.nav.language}</span>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* Auth Buttons or Services Button */}
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    {t.auth.login}
                  </Button>
                  <Button
                    onClick={() => setIsRegisterModalOpen(true)}
                    size="sm"
                    className="gap-2 text-white shadow-lg hover:shadow-xl transition-shadow"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)',
                      color: 'white'
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    {t.auth.register}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleExploreServices}
                  className="gap-2 text-white shadow-lg hover:shadow-xl transition-shadow"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)',
                    color: 'white'
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  {t.hero.ctaServices}
                </Button>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <motion.div
            className="fixed top-16 right-0 z-50 w-64 h-[calc(100vh-4rem)] bg-background border-l shadow-xl md:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <nav className="p-4 space-y-2">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toggleLanguage();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start gap-2"
              >
                <Globe className="h-4 w-4" />
                {t.nav[language === "en" ? "english" : "russian"]}
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start gap-2"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4" />
                    {t.nav.lightMode}
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    {t.nav.darkMode}
                  </>
                )}
              </Button>

              {/* Contact Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToOrderForm}
                className="w-full justify-start gap-2"
              >
                <Mail className="h-4 w-4" />
                {t.hero.ctaContact}
              </Button>

              <div className="pt-2 border-t" />

              {/* Footer Links */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsPrivacyOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start gap-2 text-sm"
              >
                <Shield className="h-4 w-4" />
                {language === "en" ? "Privacy Policy" : "Конфиденциальность"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsTermsOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start gap-2 text-sm"
              >
                <FileText className="h-4 w-4" />
                {language === "en" ? "Terms of Service" : "Условия использования"}
              </Button>

              {/* Auth Buttons or Services Button */}
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start gap-2"
                  >
                    <User className="h-4 w-4" />
                    {t.auth.login}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsRegisterModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    size="sm"
                    className="w-full justify-start gap-2 text-white"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)',
                      color: 'white'
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    {t.auth.register}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    handleExploreServices();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start gap-2 text-white"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)',
                    color: 'white'
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  {t.hero.ctaServices}
                </Button>
              )}
            </nav>
          </motion.div>
        </>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-green-50 dark:from-purple-950/20 dark:via-indigo-950/20 dark:to-green-950/20" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">
                  {t.hero.trusted}
                </span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-green-600 dark:from-purple-400 dark:via-indigo-400 dark:to-green-400 bg-clip-text text-transparent">
                {t.hero.title}
              </h2>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t.hero.subtitle}
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                size="lg"
                onClick={handleExploreServices}
                className="gap-2 text-white shadow-lg hover:shadow-xl transition-shadow text-lg px-8"
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)',
                }}
              >
                {t.hero.ctaServices}
                <ChevronRight className="w-10 h-10" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-8 border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5]/10"
                onClick={scrollToOrderForm}
              >
                {t.hero.ctaContact}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-green-300 dark:bg-green-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl mb-4">
              {t.features.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === "en" 
                ? "Everything you need to succeed in one place"
                : "Всё необходимое для успеха в одном месте"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`
                  w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color}
                  flex items-center justify-center text-white mb-4
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  {feature.icon}
                </div>
                <h3 className="text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programming Languages Ticker */}
      <section className="py-12 bg-gradient-to-r from-purple-50 via-indigo-50 to-green-50 dark:from-purple-950/10 dark:via-indigo-950/10 dark:to-green-950/10 overflow-hidden">
        <div className="mb-6 text-center">
          <h3 className="text-2xl sm:text-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-green-600 dark:from-purple-400 dark:via-indigo-400 dark:to-green-400 bg-clip-text text-transparent">
            {language === "en" ? "Technologies We Use" : "Технологии, которые мы используем"}
          </h3>
        </div>
        
        <div className="relative">
          <div className="flex animate-scroll">
            {/* First set */}
            {programmingLanguages.map((lang, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 mx-4 px-6 py-3 rounded-full bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <lang.Logo />
                  <span className="text-sm whitespace-nowrap">{lang.name}</span>
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {programmingLanguages.map((lang, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 mx-4 px-6 py-3 rounded-full bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <lang.Logo />
                  <span className="text-sm whitespace-nowrap">{lang.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Services Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl mb-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-green-600 dark:from-purple-400 dark:via-indigo-400 dark:to-green-400 bg-clip-text text-transparent">
              {language === "en" ? "Our Services" : "Наши услуги"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === "en"
                ? "Comprehensive solutions to power your business transformation"
                : "Комплексные решения для трансформации вашего бизнеса"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyServices.map((service, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl border bg-card hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`
                  w-12 h-12 rounded-xl bg-gradient-to-br ${service.color}
                  flex items-center justify-center text-white mb-4
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  {service.icon}
                </div>
                <h3 className="text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Projects Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl mb-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-green-600 dark:from-purple-400 dark:via-indigo-400 dark:to-green-400 bg-clip-text text-transparent">
              {language === "en" ? "Our Client Projects" : "Проекты наших клиентов"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === "en"
                ? "Successful solutions we've delivered for businesses"
                : "Успешные решения, которые мы создали для бизнеса"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="group p-6 rounded-2xl border bg-card hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Header with title and order badge */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {project.title}
                  </h3>
                  {project.isOrder && (
                    <Badge className="bg-[#4f46e5] text-white border-0 rounded-full" style={{
                      background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)',
                      color: 'white'
                    }}>
                      <Package className="w-3 h-3 mr-1" />
                      {language === "en" ? "Order" : "Заказ"}
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs text-muted-foreground">{project.tech}</span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {project.status === (language === "en" ? "Completed" : "Завершён") ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <Badge variant="outline" className="rounded-full border-green-500 text-green-600 dark:text-green-400">
                        {project.status}
                      </Badge>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-orange-500" />
                      <Badge variant="outline" className="rounded-full border-orange-500 text-orange-600 dark:text-orange-400">
                        {project.status}
                      </Badge>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-br from-purple-50 via-indigo-50 to-green-50 dark:from-purple-950/20 dark:via-indigo-950/20 dark:to-green-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl mb-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-green-600 dark:from-purple-400 dark:via-indigo-400 dark:to-green-400 bg-clip-text text-transparent">
              {language === "en" ? "Client Testimonials" : "Отзывы клиентов"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === "en"
                ? "What our clients have to say about our services"
                : "Что наши клиенты говорят о наших услугах"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="p-6 rounded-2xl border bg-card hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Header with avatar and rating */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{
                      background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)'
                    }}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {testimonial.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      <section id="contact-form" ref={orderFormRef} className="py-20 sm:py-32 bg-gradient-to-br from-purple-50 via-indigo-50 to-green-50 dark:from-purple-950/20 dark:via-indigo-950/20 dark:to-green-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl mb-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-green-600 dark:from-purple-400 dark:via-indigo-400 dark:to-green-400 bg-clip-text text-transparent">
                {t.contact.titleAlt}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t.contact.subtitleAlt}
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-6 p-8 rounded-3xl border bg-card shadow-xl">
              <div className="space-y-2">
                <label className="text-sm">
                  {t.contact.name} <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder={t.contact.namePlaceholder}
                  value={orderForm.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm">
                  {t.contact.email} <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  type="email"
                  placeholder={t.contact.emailPlaceholder}
                  value={orderForm.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm">
                  {t.contact.company}
                </label>
                <Input
                  placeholder={t.contact.companyPlaceholder}
                  value={orderForm.company}
                  onChange={(e) => handleFormChange("company", e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm">
                  {t.contact.project} <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder={t.contact.projectPlaceholder}
                  value={orderForm.project}
                  onChange={(e) => handleFormChange("project", e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm">
                  {t.contact.message} <span className="text-red-500">*</span>
                </label>
                <Textarea
                  required
                  placeholder={t.contact.messagePlaceholder}
                  value={orderForm.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  className="rounded-xl min-h-32"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 text-white shadow-lg hover:shadow-xl transition-shadow rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)',
                  color: 'white'
                }}
              >
                <Sparkles className="w-5 h-5" />
                {t.contact.submit}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                {t.contact.privacy}
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)'
              }}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">
                {t.footer.copyright}
              </span>
            </div>
            <div className="flex gap-4 text-sm">
              <button 
                onClick={() => setIsPrivacyOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer hover:underline"
              >
                {language === "en" ? "Privacy" : "Конфиденциальность"}
              </button>
              <button 
                onClick={() => setIsTermsOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer hover:underline"
              >
                {language === "en" ? "Terms" : "Условия"}
              </button>
              <button 
                onClick={() => setIsContactOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer hover:underline"
              >
                {language === "en" ? "Contact" : "Контакты"}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Services Modal - показывается после авторизации */}
      <ServicesModal
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
        onSelectService={handleServiceSelect}
        onContactUs={scrollToOrderForm}
        language={language}
      />

      {/* Login Modal */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.auth.loginTitle}</DialogTitle>
            <DialogDescription>{t.auth.loginDesc}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">{t.auth.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder={t.auth.emailPlaceholder}
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">{t.auth.password}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-password"
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-9 pr-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-lg hover:shadow-xl transition-shadow" style={{
              background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)',
              color: 'white'
            }}>
              {t.auth.signIn}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">{t.auth.noAccount}</span>
              <button
                type="button"
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setIsRegisterModalOpen(true);
                }}
                className="text-[#4f46e5] hover:underline"
              >
                {t.auth.signUp}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.auth.registerTitle}</DialogTitle>
            <DialogDescription>{t.auth.registerDesc}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-name">{t.auth.fullName}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-name"
                  type="text"
                  placeholder={language === "en" ? "John Doe" : "Иван Иванов"}
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email">{t.auth.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder={language === "en" ? "you@example.com" : "you@example.com"}
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-institution">{t.auth.institution}</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-institution"
                  type="text"
                  placeholder={language === "en" ? "Your School/University" : "Ваша школа/университет"}
                  value={registerForm.institution}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, institution: e.target.value }))}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password">{t.auth.password}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-password"
                  type={showRegPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-9 pr-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-confirm-password">{t.auth.confirmPassword}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pl-9 pr-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-lg hover:shadow-xl transition-shadow" style={{
              background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)',
              color: 'white'
            }}>
              {t.auth.register}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">{t.auth.haveAccount}</span>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterModalOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="text-[#4f46e5] hover:underline"
              >
                {t.auth.signIn}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <PrivacyPolicy
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        language={language}
      />

      {/* Terms of Service Modal */}
      <TermsOfService
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        language={language}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        language={language}
      />
    </div>
  );
}
