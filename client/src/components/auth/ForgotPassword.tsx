import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { GraduationCap, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useLanguage } from "../../lib/language-context";

interface Props {
  onBackToLogin: () => void;
}

export function ForgotPassword({ onBackToLogin }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { language } = useLanguage();

  const t = {
    title: language === "en" ? "Forgot Password?" : "Забыли пароль?",
    description: language === "en" 
      ? "Enter your email address and we'll send you a link to reset your password"
      : "Введите ваш email и мы отправим вам ссылку для сброса пароля",
    email: language === "en" ? "Email" : "Электронная почта",
    sendResetLink: language === "en" ? "Send Reset Link" : "Отправить ссылку",
    backToLogin: language === "en" ? "Back to Login" : "Вернуться к входу",
    checkEmail: language === "en" ? "Check your email" : "Проверьте вашу почту",
    emailSent: language === "en" 
      ? "We've sent a password reset link to"
      : "Мы отправили ссылку для сброса пароля на",
    didntReceive: language === "en"
      ? "Didn't receive the email? Check your spam folder or try again."
      : "Не получили письмо? Проверьте папку спам или попробуйте снова.",
    tryAgain: language === "en" ? "Try Again" : "Попробовать снова"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password reset - in production, send reset email
    if (email) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <GraduationCap className="h-10 w-10 text-primary" />
              <span className="text-3xl">EduCRM</span>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
              </div>
              <div className="space-y-2">
                <h3>{t.checkEmail}</h3>
                <p className="text-muted-foreground">
                  {t.emailSent} <strong>{email}</strong>
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.didntReceive}
              </p>
              <div className="flex flex-col gap-2 pt-4">
                <Button onClick={onBackToLogin}>{t.backToLogin}</Button>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  {t.tryAgain}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <GraduationCap className="h-10 w-10 text-primary" />
            <span className="text-3xl">EduCRM</span>
          </div>
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>
              {t.description}
            </CardDescription>
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

              <Button type="submit" className="w-full">
                {t.sendResetLink}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={onBackToLogin}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backToLogin}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}