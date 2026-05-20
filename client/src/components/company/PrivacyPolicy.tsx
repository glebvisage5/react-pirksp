import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Shield, Lock, Database, Users, FileText, AlertCircle, Cookie, Calendar } from "lucide-react";

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export function PrivacyPolicy({ isOpen, onClose, language }: PrivacyPolicyProps) {
  const isRu = language === "ru";

  const content = {
    title: isRu ? "Политика конфиденциальности" : "Privacy Policy",
    lastUpdated: isRu ? "Последнее обновление: 1 февраля 2026" : "Last Updated: February 1, 2026",
    
    sections: {
      intro: {
        title: isRu ? "1. Введение" : "1. Introduction",
        content: isRu 
          ? "Добро пожаловать в Avis. Настоящая Политика конфиденциальности объясняет, как мы собираем, используем и защищаем вашу персональную информацию при использовании наших сервисов, включая EduCRM, TeamHub и Admin Center."
          : "Welcome to Avis. This Privacy Policy explains how we collect, use, and protect your personal information when using our services, including EduCRM, TeamHub, and Admin Center.",
        items: [
          {
            label: isRu ? "Название компании/проекта:" : "Company/Project Name:",
            value: "Avis"
          },
          {
            label: isRu ? "Цель документа:" : "Document Purpose:",
            value: isRu 
              ? "Объяснить пользователям, какие данные собираются, как используются и как защищаются"
              : "Explain to users what data is collected, how it is used, and how it is protected"
          },
          {
            label: isRu ? "Контакты для вопросов о данных:" : "Contact for Data Questions:",
            value: "privacy@innovatecrm.com"
          }
        ]
      },
      
      dataCollection: {
        title: isRu ? "2. Какие данные собираются" : "2. Data We Collect",
        content: isRu
          ? "Мы собираем различные типы информации для предоставления и улучшения наших сервисов:"
          : "We collect various types of information to provide and improve our services:",
        items: [
          {
            icon: <Users className="h-5 w-5 text-blue-500" />,
            label: isRu ? "Личные данные" : "Personal Data",
            desc: isRu 
              ? "Имя, адрес электронной почты, номер телефона, название учреждения"
              : "Name, email address, phone number, institution name"
          },
          {
            icon: <Lock className="h-5 w-5 text-purple-500" />,
            label: isRu ? "Данные аккаунта" : "Account Data",
            desc: isRu
              ? "Логин, пароль (зашифрованный), настройки 2FA, настройки профиля"
              : "Login, password (encrypted), 2FA settings, profile preferences"
          },
          {
            icon: <Database className="h-5 w-5 text-green-500" />,
            label: isRu ? "Данные об использовании" : "Usage Data",
            desc: isRu
              ? "Информация о вашей активности в EduCRM, TeamHub, создании команд, проектов и ТЗ"
              : "Information about your activity in EduCRM, TeamHub, team creation, projects, and specifications"
          },
          {
            icon: <Cookie className="h-5 w-5 text-orange-500" />,
            label: isRu ? "Cookies и технические данные" : "Cookies & Technical Data",
            desc: isRu
              ? "IP-адрес, тип устройства, браузер, операционная система, cookies"
              : "IP address, device type, browser, operating system, cookies"
          },
          {
            icon: <FileText className="h-5 w-5 text-indigo-500" />,
            label: isRu ? "Данные из Telegram-бота" : "Telegram Bot Data",
            desc: isRu
              ? "Telegram ID, имя пользователя (если привязан к аккаунту)"
              : "Telegram ID, username (if linked to account)"
          }
        ]
      },
      
      dataUsage: {
        title: isRu ? "3. Как используются данные" : "3. How We Use Your Data",
        content: isRu
          ? "Мы используем собранную информацию для следующих целей:"
          : "We use the collected information for the following purposes:",
        items: [
          isRu ? "• Авторизация и аутентификация пользователей" : "• User authorization and authentication",
          isRu ? "• Улучшение и персонализация сервисов" : "• Service improvement and personalization",
          isRu ? "• Отправка уведомлений о задачах, проектах и обновлениях" : "• Sending notifications about tasks, projects, and updates",
          isRu ? "• Обеспечение безопасности платформы" : "• Platform security assurance",
          isRu ? "• Аналитика использования для улучшения UX" : "• Usage analytics for UX improvement",
          isRu ? "• Техническая поддержка пользователей" : "• User technical support",
          isRu ? "• Соблюдение юридических требований" : "• Legal compliance"
        ]
      },
      
      dataSharing: {
        title: isRu ? "4. Передача данных третьим лицам" : "4. Data Sharing with Third Parties",
        content: isRu
          ? "Мы можем передавать ваши данные следующим третьим лицам:"
          : "We may share your data with the following third parties:",
        items: [
          {
            label: isRu ? "Хостинг-провайдеры" : "Hosting Providers",
            desc: isRu 
              ? "Для хранения данных и работы платформы"
              : "For data storage and platform operation"
          },
          {
            label: isRu ? "Платёжные системы" : "Payment Systems",
            desc: isRu
              ? "Для обработки платежей (если применимо)"
              : "For payment processing (if applicable)"
          },
          {
            label: isRu ? "Telegram API" : "Telegram API",
            desc: isRu
              ? "Для интеграции с ботом уведомлений"
              : "For notification bot integration"
          },
          {
            label: isRu ? "Аналитические сервисы" : "Analytics Services",
            desc: isRu
              ? "Для анализа использования платформы (анонимно)"
              : "For platform usage analysis (anonymously)"
          },
          {
            label: isRu ? "Юридические требования" : "Legal Requirements",
            desc: isRu
              ? "При необходимости выполнения законодательных требований"
              : "When legally required"
          }
        ]
      },
      
      dataProtection: {
        title: isRu ? "5. Хранение и защита данных" : "5. Data Storage and Protection",
        content: isRu
          ? "Мы применяем современные меры безопасности для защиты ваших данных:"
          : "We implement modern security measures to protect your data:",
        items: [
          {
            icon: <Shield className="h-5 w-5 text-green-500" />,
            label: isRu ? "Шифрование" : "Encryption",
            desc: isRu
              ? "Все пароли зашифрованы, данные передаются по HTTPS"
              : "All passwords are encrypted, data transmitted via HTTPS"
          },
          {
            icon: <Lock className="h-5 w-5 text-blue-500" />,
            label: isRu ? "Ограничение доступа" : "Access Control",
            desc: isRu
              ? "Доступ к данным имеют только авторизованные сотрудники"
              : "Only authorized personnel have access to data"
          },
          {
            icon: <FileText className="h-5 w-5 text-purple-500" />,
            label: isRu ? "Логи безопасности" : "Security Logs",
            desc: isRu
              ? "Ведём журналы активности для обнаружения угроз"
              : "We maintain activity logs for threat detection"
          },
          {
            icon: <Calendar className="h-5 w-5 text-orange-500" />,
            label: isRu ? "Сроки хранения" : "Retention Period",
            desc: isRu
              ? "Данные хранятся до удаления аккаунта или по запросу пользователя"
              : "Data stored until account deletion or user request"
          }
        ]
      },
      
      userRights: {
        title: isRu ? "6. Права пользователя" : "6. User Rights",
        content: isRu
          ? "Вы имеете следующие права в отношении ваших данных:"
          : "You have the following rights regarding your data:",
        items: [
          isRu ? "• Право на удаление данных — вы можете удалить свой аккаунт в любое время" : "• Right to deletion — you can delete your account at any time",
          isRu ? "• Право на изменение данных — обновляйте информацию профиля через настройки" : "• Right to modification — update profile information via settings",
          isRu ? "• Право на отключение 2FA — управление через настройки безопасности" : "• Right to disable 2FA — manage via security settings",
          isRu ? "• Право на экспорт данных — запросите копию ваших данных" : "• Right to data export — request a copy of your data",
          isRu ? "• Право на отзыв согласия — отпишитесь от уведомлений в любое время" : "• Right to withdraw consent — unsubscribe from notifications at any time",
          isRu ? "• Право на обращение — свяжитесь с нами по вопросам конфиденциальности" : "• Right to contact — reach out to us about privacy concerns"
        ]
      },
      
      cookies: {
        title: isRu ? "7. Cookies" : "7. Cookies",
        content: isRu
          ? "Мы используем cookies для улучшения вашего опыта:"
          : "We use cookies to enhance your experience:",
        items: [
          {
            label: isRu ? "Необходимые cookies" : "Essential Cookies",
            desc: isRu
              ? "Для авторизации и работы основных функций"
              : "For authentication and core functionality"
          },
          {
            label: isRu ? "Функциональные cookies" : "Functional Cookies",
            desc: isRu
              ? "Для запоминания настроек (язык, тема)"
              : "For remembering preferences (language, theme)"
          },
          {
            label: isRu ? "Аналитические cookies" : "Analytics Cookies",
            desc: isRu
              ? "Для анализа использования (можно отключить)"
              : "For usage analysis (can be disabled)"
          },
          {
            label: isRu ? "Как отключить" : "How to Disable",
            desc: isRu
              ? "Настройте cookies в браузере или через наши настройки"
              : "Configure cookies in your browser or via our settings"
          }
        ]
      },
      
      changes: {
        title: isRu ? "8. Изменения политики" : "8. Policy Changes",
        content: isRu
          ? "Мы можем обновлять эту Политику конфиденциальности. При внесении изменений мы уведомим вас по электронной почте или через платформу. Дата последнего обновления указана в начале документа."
          : "We may update this Privacy Policy. When we make changes, we will notify you via email or through the platform. The last update date is indicated at the beginning of the document."
      },
      
      contact: {
        title: isRu ? "9. Контакты" : "9. Contact",
        content: isRu
          ? "Если у вас есть вопросы о нашей Политике конфиденциальности, свяжитесь с нами:"
          : "If you have questions about our Privacy Policy, contact us:",
        items: [
          {
            label: isRu ? "Email для вопросов о данных:" : "Data Privacy Email:",
            value: "privacy@innovatecrm.com"
          },
          {
            label: isRu ? "Общая поддержка:" : "General Support:",
            value: "support@innovatecrm.com"
          },
          {
            label: isRu ? "Telegram:" : "Telegram:",
            value: "@InnovateCRM_Support"
          }
        ]
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            {content.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {language === "en" 
              ? "Privacy Policy and data protection information for Avis platform"
              : "Политика конфиденциальности и информация о защите данных платформы Avis"
            }
          </DialogDescription>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
            <Calendar className="h-4 w-4" />
            {content.lastUpdated}
          </p>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(85vh-8rem)] pr-4">
          <div className="space-y-6">
            {/* Introduction */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                {content.sections.intro.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.sections.intro.content}
              </p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                {content.sections.intro.items.map((item, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{item.label}</span>
                    <span className="ml-2 text-muted-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Data Collection */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Database className="h-5 w-5 text-green-500" />
                {content.sections.dataCollection.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.sections.dataCollection.content}
              </p>
              <div className="grid gap-3">
                {content.sections.dataCollection.items.map((item, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-4 flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Data Usage */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                {content.sections.dataUsage.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.sections.dataUsage.content}
              </p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                {content.sections.dataUsage.items.map((item, index) => (
                  <p key={index} className="text-sm">{item}</p>
                ))}
              </div>
            </section>

            {/* Data Sharing */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                {content.sections.dataSharing.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.sections.dataSharing.content}
              </p>
              <div className="space-y-3">
                {content.sections.dataSharing.items.map((item, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-4">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Data Protection */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                {content.sections.dataProtection.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.sections.dataProtection.content}
              </p>
              <div className="grid gap-3">
                {content.sections.dataProtection.items.map((item, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-4 flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* User Rights */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-500" />
                {content.sections.userRights.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.sections.userRights.content}
              </p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                {content.sections.userRights.items.map((item, index) => (
                  <p key={index} className="text-sm">{item}</p>
                ))}
              </div>
            </section>

            {/* Cookies */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Cookie className="h-5 w-5 text-orange-500" />
                {content.sections.cookies.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.sections.cookies.content}
              </p>
              <div className="space-y-3">
                {content.sections.cookies.items.map((item, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-4">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Policy Changes */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                {content.sections.changes.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.sections.changes.content}
              </p>
            </section>

            {/* Contact */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                {content.sections.contact.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.sections.contact.content}
              </p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                {content.sections.contact.items.map((item, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{item.label}</span>
                    <span className="ml-2 text-muted-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
