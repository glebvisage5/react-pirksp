import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Mail, Send, User, MessageSquare, Phone, Clock, Globe } from "lucide-react";
import { toast } from "sonner";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export function ContactModal({ isOpen, onClose, language }: ContactModalProps) {
  const isRu = language === "ru";
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const content = {
    title: isRu ? "Контакты" : "Contact Us",
    description: isRu
      ? "Свяжитесь с нами любым удобным способом. Мы ответим в течение 24 часов."
      : "Contact us through any convenient method. We'll respond within 24 hours.",
    
    form: {
      name: {
        label: isRu ? "Ваше имя" : "Your Name",
        placeholder: isRu ? "Введите ваше имя" : "Enter your name",
        required: isRu ? "обязательно" : "required"
      },
      email: {
        label: isRu ? "Email" : "Email",
        placeholder: isRu ? "your@email.com" : "your@email.com",
        required: isRu ? "обязательно" : "required"
      },
      message: {
        label: isRu ? "Сообщение" : "Message",
        placeholder: isRu
          ? "Опишите ваш вопрос или предложение..."
          : "Describe your question or suggestion...",
        required: isRu ? "обязательно" : "required"
      },
      submit: isRu ? "Отправить сообщение" : "Send Message"
    },

    contactInfo: {
      title: isRu ? "Основная информация" : "Main Information",
      items: [
        {
          icon: <Mail className="h-5 w-5 text-blue-500" />,
          label: isRu ? "Email поддержки" : "Support Email",
          value: "support@innovatecrm.com",
          link: "mailto:support@innovatecrm.com"
        },
        {
          icon: <Mail className="h-5 w-5 text-purple-500" />,
          label: isRu ? "Общие вопросы" : "General Inquiries",
          value: "info@innovatecrm.com",
          link: "mailto:info@innovatecrm.com"
        },
        {
          icon: <Globe className="h-5 w-5 text-green-500" />,
          label: "Telegram",
          value: "@InnovateCRM_Support",
          link: "https://t.me/InnovateCRM_Support"
        },
        {
          icon: <Clock className="h-5 w-5 text-orange-500" />,
          label: isRu ? "Часы работы" : "Working Hours",
          value: isRu ? "Пн-Пт: 9:00 - 18:00 (GMT+3)" : "Mon-Fri: 9:00 AM - 6:00 PM (GMT+3)",
          link: null
        }
      ]
    },

    socialMedia: {
      title: isRu ? "Социальные сети" : "Social Media",
      items: [
        {
          name: "Telegram",
          icon: "📱",
          link: "https://t.me/InnovateCRM"
        },
        {
          name: "GitHub",
          icon: "💻",
          link: "https://github.com/innovatecrm"
        },
        {
          name: isRu ? "Канал новостей" : "News Channel",
          icon: "📢",
          link: "https://t.me/InnovateCRM_News"
        }
      ]
    },

    validation: {
      nameRequired: isRu ? "Пожалуйста, введите ваше имя" : "Please enter your name",
      nameMin: isRu ? "Имя должно содержать минимум 2 символа" : "Name must be at least 2 characters",
      emailRequired: isRu ? "Пожалуйста, введите email" : "Please enter your email",
      emailInvalid: isRu ? "Пожалуйста, введите корректный email" : "Please enter a valid email",
      messageRequired: isRu ? "Пожалуйста, введите сообщение" : "Please enter your message",
      messageMin: isRu ? "Сообщение должно содержать минимум 10 символов" : "Message must be at least 10 characters",
      success: isRu 
        ? "Сообщение отправлено! Мы свяжемся с вами в ближайшее время."
        : "Message sent! We'll contact you soon."
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error(content.validation.nameRequired, {
        duration: 3000,
        className: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      });
      return;
    }

    if (formData.name.trim().length < 2) {
      toast.error(content.validation.nameMin, {
        duration: 3000,
        className: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      });
      return;
    }

    if (!formData.email.trim()) {
      toast.error(content.validation.emailRequired, {
        duration: 3000,
        className: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      });
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error(content.validation.emailInvalid, {
        duration: 3000,
        className: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      });
      return;
    }

    if (!formData.message.trim()) {
      toast.error(content.validation.messageRequired, {
        duration: 3000,
        className: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      });
      return;
    }

    if (formData.message.trim().length < 10) {
      toast.error(content.validation.messageMin, {
        duration: 3000,
        className: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      });
      return;
    }

    // Success
    toast.success(content.validation.success, {
      duration: 3000,
      className: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
    });

    // Reset form and close
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => onClose(), 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Mail className="h-6 w-6 text-blue-500" />
            {content.title}
          </DialogTitle>
          <DialogDescription>
            {content.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Contact Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              {isRu ? "Форма обратной связи" : "Contact Form"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">
                  {content.form.name.label} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact-name"
                    placeholder={content.form.name.placeholder}
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">
                  {content.form.email.label} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder={content.form.email.placeholder}
                    value={formData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message">
                  {content.form.message.label} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="contact-message"
                  placeholder={content.form.message.placeholder}
                  value={formData.message}
                  onChange={(e) => handleFormChange("message", e.target.value)}
                  className="min-h-[120px] resize-none"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 via-indigo-600 to-green-500 hover:opacity-90"
              >
                <Send className="h-4 w-4 mr-2" />
                {content.form.submit}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Main Contact Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-500" />
                {content.contactInfo.title}
              </h3>
              <div className="space-y-2">
                {content.contactInfo.items.map((item, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-3 flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">{item.label}</p>
                      {item.link ? (
                        <a 
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-500" />
                {content.socialMedia.title}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {content.socialMedia.items.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted/50 rounded-lg p-3 flex items-center gap-3 hover:bg-muted transition-colors"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {isRu 
                  ? "💡 Для срочных вопросов используйте Telegram — мы отвечаем быстрее!"
                  : "💡 For urgent matters, use Telegram — we respond faster!"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
