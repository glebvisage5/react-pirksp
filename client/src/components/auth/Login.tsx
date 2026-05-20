import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft, Home } from "lucide-react";
import { useLanguage } from "../../lib/language-context";

interface Props {
  onLogin: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
  onBackToCompany?: () => void;
  onBackToLanding?: () => void;
}

export function Login({ onLogin, onSwitchToRegister, onSwitchToForgotPassword, onBackToCompany, onBackToLanding }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in production, validate credentials
    if (email && password) {
      onLogin();
    }
  };

  const t = {
    title: language === "en" ? "Login" : "Вход",
    description: language === "en" ? "Enter your credentials to access your account" : "Введите данные для входа в аккаунт",
    welcome: language === "en" ? "Welcome back! Please login to your account." : "Добро пожаловать! Войдите в ваш аккаунт.",
    email: language === "en" ? "Email" : "Электронная почта",
    password: language === "en" ? "Password" : "Пароль",
    rememberMe: language === "en" ? "Remember me" : "Запомнить меня",
    forgotPassword: language === "en" ? "Forgot password?" : "Забыли пароль?",
    signIn: language === "en" ? "Sign In" : "Войти",
    orContinue: language === "en" ? "Or continue with" : "Или продолжить с",
    noAccount: language === "en" ? "Don't have an account? " : "Нет аккаунта? ",
    signUp: language === "en" ? "Sign up" : "Зарегистрироваться",
    backToCompany: language === "en" ? "Back to Main" : "На главную",
    backToService: language === "en" ? "Back to EduCRM" : "В EduCRM"
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      {/* Navigation buttons */}
      <div className="fixed top-4 left-4 flex gap-2 z-50">
        {onBackToCompany && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToCompany}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">{t.backToCompany}</span>
          </Button>
        )}
        {onBackToLanding && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToLanding}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t.backToService}</span>
          </Button>
        )}
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <GraduationCap className="h-10 w-10 text-primary" />
            <span className="text-3xl">EduCRM</span>
          </div>
          <p className="text-muted-foreground">{t.welcome}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span>{t.rememberMe}</span>
                </label>
                <button
                  type="button"
                  onClick={onSwitchToForgotPassword}
                  className="text-sm text-primary hover:underline"
                >
                  {t.forgotPassword}
                </button>
              </div>

              <Button type="submit" className="w-full">
                {t.signIn}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">{t.orContinue}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button type="button" variant="outline">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button type="button" variant="outline">
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.916 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </Button>
              </div>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">{t.noAccount}</span>
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-primary hover:underline"
                >
                  {t.signUp}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}