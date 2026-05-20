import { useState } from "react";
import { Button } from "./ui/button";
import { GraduationCap, Menu, X, ArrowLeft, Globe } from "lucide-react";
import { useTheme } from "../lib/theme-context";
import { useLanguage } from "../lib/language-context";
import { Moon, Sun } from "lucide-react";

interface Props {
  onLogin: () => void;
  onRegister: () => void;
  onBackToServices?: () => void;
}

export function Header({ onLogin, onRegister, onBackToServices }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  const t = {
    features: language === "en" ? "Features" : "Возможности",
    howItWorks: language === "en" ? "How It Works" : "Как это работает",
    about: language === "en" ? "About" : "О нас",
    login: language === "en" ? "Login" : "Войти",
    getStarted: language === "en" ? "Register" : "Регистрация",
    allServices: language === "en" ? "All Services" : "Все сервисы"
  };

  const navLinks = [
    { label: t.features, href: "#features" },
    { label: t.howItWorks, href: "#how-it-works" },
    { label: t.about, href: "#about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 flex items-center justify-center shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-green-600 dark:from-purple-400 dark:via-indigo-400 dark:to-green-400 bg-clip-text text-transparent">EduCRM</h1>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {onBackToServices && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToServices}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.allServices}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="rounded-full"
            >
              <Globe className="h-5 w-5" />
            </Button>
            <Button onClick={onRegister} className="text-white shadow-lg hover:shadow-xl transition-shadow" style={{
              background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)',
              color: 'white'
            }}>
              {t.getStarted}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="rounded-full"
            >
              <Globe className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            {onBackToServices && (
              <div className="px-4 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBackToServices}
                  className="w-full gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t.allServices}
                </Button>
              </div>
            )}
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-2 mt-4 px-4">
              <Button onClick={onRegister} className="w-full text-white shadow-lg hover:shadow-xl transition-shadow" style={{
                background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)',
                color: 'white'
              }}>
                {t.getStarted}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}