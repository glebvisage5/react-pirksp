import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { FileText, Shield, Users, CreditCard, AlertTriangle, Clock, Mail, BookOpen, CheckCircle2, XCircle, Calendar, Lock } from "lucide-react";

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export function TermsOfService({ isOpen, onClose, language }: TermsOfServiceProps) {
  const isRu = language === "ru";

  const content = {
    title: isRu ? "Условия использования" : "Terms of Service",
    lastUpdated: isRu ? "Последнее обновление: 1 февраля 2026" : "Last Updated: February 1, 2026",
    
    sections: {
      intro: {
        title: isRu ? "1. Введение" : "1. Introduction",
        content: isRu
          ? "Настоящие Условия использования регулируют доступ и использование платформы Avis и всех связанных с ней сервисов. Используя наши сервисы, вы соглашаетесь с этими условиями."
          : "These Terms of Service govern access and use of the Avis platform and all related services. By using our services, you agree to these terms.",
        items: [
          {
            label: isRu ? "Название компании:" : "Company Name:",
            value: "Avis"
          },
          {
            label: isRu ? "Дата вступления в силу:" : "Effective Date:",
            value: isRu ? "1 февраля 2026" : "February 1, 2026"
          }
        ]
      },
      
      definitions: {
        title: isRu ? "2. Определения" : "2. Definitions",
        items: [
          {
            term: isRu ? "Пользователь" : "User",
            definition: isRu
              ? "Физическое или юридическое лицо, зарегистрированное на платформе"
              : "An individual or entity registered on the platform"
          },
          {
            term: isRu ? "Администратор" : "Administrator",
            definition: isRu
              ? "Пользователь с расширенными правами управления сервисами"
              : "A user with extended service management rights"
          },
          {
            term: isRu ? "Сервис" : "Service",
            definition: isRu
              ? "Любой продукт или функция Avis (EduCRM, TeamHub, Admin Center и др.)"
              : "Any Avis product or feature (EduCRM, TeamHub, Admin Center, etc.)"
          },
          {
            term: isRu ? "Команда" : "Team",
            definition: isRu
              ? "Группа пользователей, работающих совместно в TeamHub"
              : "A group of users collaborating in TeamHub"
          },
          {
            term: isRu ? "Проект" : "Project",
            definition: isRu
              ? "Организационная единица в TeamHub для управления задачами и ТЗ"
              : "An organizational unit in TeamHub for task and specification management"
          },
          {
            term: isRu ? "ТЗ (Техническое задание)" : "Specification",
            definition: isRu
              ? "Документ, созданный с помощью блочного конструктора TeamHub"
              : "A document created using TeamHub's block-based builder"
          },
          {
            term: isRu ? "Контент" : "Content",
            definition: isRu
              ? "Любые данные, файлы, тексты, изображения, загруженные пользователем"
              : "Any data, files, texts, images uploaded by the user"
          }
        ]
      },
      
      registration: {
        title: isRu ? "3. Регистрация и аккаунт" : "3. Registration and Account",
        content: isRu
          ? "Для использования сервисов Avis вы должны создать аккаунт:"
          : "To use Avis services, you must create an account:",
        items: [
          {
            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
            label: isRu ? "Требования к аккаунту" : "Account Requirements",
            desc: isRu
              ? "Вы должны быть старше 18 лет или иметь разрешение законного представителя. Предоставьте точную и актуальную информацию."
              : "You must be at least 18 years old or have guardian permission. Provide accurate and up-to-date information."
          },
          {
            icon: <Lock className="h-5 w-5 text-blue-500" />,
            label: isRu ? "Ответственность за пароль" : "Password Responsibility",
            desc: isRu
              ? "Вы несёте ответственность за сохранность пароля и всех действий в вашем аккаунте."
              : "You are responsible for password security and all actions in your account."
          },
          {
            icon: <Shield className="h-5 w-5 text-purple-500" />,
            label: isRu ? "Двухфакторная аутентификация (2FA)" : "Two-Factor Authentication (2FA)",
            desc: isRu
              ? "Рекомендуем включить 2FA для повышения безопасности аккаунта."
              : "We recommend enabling 2FA to enhance account security."
          },
          {
            icon: <XCircle className="h-5 w-5 text-red-500" />,
            label: isRu ? "Блокировка аккаунта" : "Account Suspension",
            desc: isRu
              ? "Мы можем заблокировать аккаунт за нарушение условий использования."
              : "We may suspend accounts for violations of terms of service."
          }
        ]
      },
      
      serviceUsage: {
        title: isRu ? "4. Использование сервисов" : "4. Service Usage",
        services: [
          {
            name: "EduCRM",
            desc: isRu
              ? "Система управления образовательным процессом с дашбордом студента и администратора."
              : "Educational process management system with student and administrator dashboards."
          },
          {
            name: "TeamHub",
            desc: isRu
              ? "Платформа для командной работы с управлением проектами, задачами и блочным конструктором ТЗ."
              : "Team collaboration platform with project management, tasks, and block-based specification builder."
          },
          {
            name: "Admin Center",
            desc: isRu
              ? "Централизованная панель управления всеми сервисами Avis."
              : "Centralized management panel for all Avis services."
          }
        ],
        restrictions: {
          title: isRu ? "Ограничения и запрещённые действия" : "Restrictions and Prohibited Actions",
          items: [
            isRu ? "• Не использовать сервисы для незаконной деятельности" : "• Do not use services for illegal activities",
            isRu ? "• Не загружать вредоносное ПО, вирусы или опасный контент" : "• Do not upload malware, viruses, or dangerous content",
            isRu ? "• Не нарушать права интеллектуальной собственности" : "• Do not violate intellectual property rights",
            isRu ? "• Не пытаться получить несанкционированный доступ к системе" : "• Do not attempt unauthorized system access",
            isRu ? "• Не распространять спам, мошеннические материалы" : "• Do not distribute spam or fraudulent materials",
            isRu ? "• Не создавать несколько аккаунтов для злоупотребления" : "• Do not create multiple accounts for abuse",
            isRu ? "• Не перепродавать доступ к сервисам без разрешения" : "• Do not resell service access without permission"
          ]
        }
      },
      
      userContent: {
        title: isRu ? "5. Контент пользователя" : "5. User Content",
        ownership: {
          title: isRu ? "Права на контент" : "Content Ownership",
          desc: isRu
            ? "Вы сохраняете все права на контент, который загружаете на платформу. Предоставляя нам контент, вы даёте Avis лицензию на его использование для обеспечения работы сервисов."
            : "You retain all rights to content you upload to the platform. By providing content, you grant Avis a license to use it for service operation."
        },
        allowed: {
          title: isRu ? "Что можно публиковать" : "What You Can Publish",
          items: [
            isRu ? "• Образовательные материалы и курсы" : "• Educational materials and courses",
            isRu ? "• Проекты, задачи, технические задания" : "• Projects, tasks, specifications",
            isRu ? "• Файлы, документы, изображения для работы" : "• Files, documents, images for work",
            isRu ? "• Комментарии и обсуждения в рамках команд" : "• Comments and discussions within teams"
          ]
        },
        prohibited: {
          title: isRu ? "Что запрещено" : "What is Prohibited",
          items: [
            isRu ? "• Материалы с нарушением авторских прав" : "• Materials violating copyright",
            isRu ? "• Контент для взрослых, насилие, дискриминация" : "• Adult content, violence, discrimination",
            isRu ? "• Персональные данные третьих лиц без согласия" : "• Personal data of third parties without consent",
            isRu ? "• Спам, реклама без разрешения" : "• Spam, advertising without permission",
            isRu ? "• Материалы, нарушающие законодательство" : "• Materials violating legislation"
          ]
        },
        responsibility: {
          title: isRu ? "Ответственность за контент" : "Content Responsibility",
          desc: isRu
            ? "Вы несёте полную ответственность за контент, который публикуете. Avis не несёт ответственности за пользовательский контент, но может удалить материалы, нарушающие условия."
            : "You are fully responsible for content you publish. Avis is not responsible for user content but may remove materials violating terms."
        }
      },
      
      payments: {
        title: isRu ? "6. Платные услуги" : "6. Paid Services",
        content: isRu
          ? "В настоящее время основные сервисы Avis бесплатны. Если в будущем будут введены платные функции:"
          : "Currently, core Avis services are free. If paid features are introduced in the future:",
        items: [
          {
            label: isRu ? "Оплата" : "Payment",
            desc: isRu
              ? "Оплата осуществляется через защищённые платёжные системы."
              : "Payment processed through secure payment systems."
          },
          {
            label: isRu ? "Возвраты" : "Refunds",
            desc: isRu
              ? "Возвраты возможны в течение 14 дней при соблюдении условий."
              : "Refunds available within 14 days under conditions."
          },
          {
            label: isRu ? "Подписки" : "Subscriptions",
            desc: isRu
              ? "Подписки продлеваются автоматически, если не отменены заранее."
              : "Subscriptions renew automatically unless canceled in advance."
          }
        ]
      },
      
      liability: {
        title: isRu ? "7. Ограничение ответственности" : "7. Limitation of Liability",
        content: isRu
          ? "Сервисы Avis предоставляются «как есть». Мы не гарантируем бесперебойную работу и не несём ответственность за:"
          : "Avis services are provided «as is». We do not guarantee uninterrupted operation and are not responsible for:",
        items: [
          {
            icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
            label: isRu ? "Потеря данных" : "Data Loss",
            desc: isRu
              ? "Рекомендуем регулярно создавать резервные копии важных данных."
              : "We recommend regularly backing up important data."
          },
          {
            icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
            label: isRu ? "Сбои в работе" : "Service Outages",
            desc: isRu
              ? "Возможны технические перерывы для обслуживания."
              : "Technical interruptions may occur for maintenance."
          },
          {
            icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
            label: isRu ? "Действия пользователей" : "User Actions",
            desc: isRu
              ? "Мы не отвечаем за действия других пользователей платформы."
              : "We are not responsible for actions of other platform users."
          }
        ]
      },
      
      termination: {
        title: isRu ? "8. Прекращение использования" : "8. Termination",
        content: isRu
          ? "Вы можете прекратить использование сервисов в любое время:"
          : "You can stop using services at any time:",
        items: [
          {
            label: isRu ? "Удаление аккаунта" : "Account Deletion",
            desc: isRu
              ? "Удалите аккаунт через настройки профиля. Все ваши данные будут удалены."
              : "Delete account via profile settings. All your data will be deleted."
          },
          {
            label: isRu ? "Удаление команды" : "Team Deletion",
            desc: isRu
              ? "Владелец команды может удалить команду со всеми проектами и данными."
              : "Team owner can delete team with all projects and data."
          },
          {
            label: isRu ? "Удаление контента" : "Content Deletion",
            desc: isRu
              ? "Удаляйте файлы, проекты и ТЗ через соответствующие разделы."
              : "Delete files, projects, and specifications through relevant sections."
          }
        ]
      },
      
      changes: {
        title: isRu ? "9. Изменения условий" : "9. Changes to Terms",
        content: isRu
          ? "Мы оставляем за собой право изменять Условия использования. При внесении изменений мы уведомим вас по электронной почте или через платформу. Продолжение использования сервисов после изменений означает ваше согласие с новыми условиями."
          : "We reserve the right to modify Terms of Service. When making changes, we will notify you via email or through the platform. Continued use of services after changes indicates your agreement to new terms.",
        items: [
          {
            label: isRu ? "Способ уведомления" : "Notification Method",
            desc: isRu
              ? "Email, уведомления на платформе, баннер при входе"
              : "Email, platform notifications, login banner"
          },
          {
            label: isRu ? "Срок принятия" : "Acceptance Period",
            desc: isRu
              ? "30 дней с момента уведомления для ознакомления с изменениями"
              : "30 days from notification to review changes"
          }
        ]
      },
      
      contact: {
        title: isRu ? "10. Контакты" : "10. Contact",
        content: isRu
          ? "По вопросам, связанным с Условиями использования, свяжитесь с нами:"
          : "For questions about Terms of Service, contact us:",
        items: [
          {
            icon: <Mail className="h-5 w-5 text-blue-500" />,
            label: "Email:",
            value: "legal@Avis.com"
          },
          {
            icon: <Mail className="h-5 w-5 text-green-500" />,
            label: isRu ? "Поддержка:" : "Support:",
            value: "support@Avis.com"
          },
          {
            icon: <Users className="h-5 w-5 text-purple-500" />,
            label: "Telegram:",
            value: "@Avis_Support"
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
            <FileText className="h-6 w-6 text-blue-500" />
            {content.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {language === "en" 
              ? "Terms of Service and usage guidelines for Avis platform"
              : "Условия использования и руководство по платформе Avis"
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
                <BookOpen className="h-5 w-5 text-blue-500" />
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

            {/* Definitions */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-500" />
                {content.sections.definitions.title}
              </h3>
              <div className="space-y-2">
                {content.sections.definitions.items.map((item, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-3">
                    <p className="font-semibold text-sm">{item.term}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.definition}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Registration and Account */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                {content.sections.registration.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.sections.registration.content}
              </p>
              <div className="grid gap-3">
                {content.sections.registration.items.map((item, index) => (
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

            {/* Service Usage */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-500" />
                {content.sections.serviceUsage.title}
              </h3>
              <div className="space-y-2">
                {content.sections.serviceUsage.services.map((service, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-3">
                    <p className="font-semibold text-sm">{service.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{service.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-sm mb-2">{content.sections.serviceUsage.restrictions.title}</h4>
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-1">
                  {content.sections.serviceUsage.restrictions.items.map((item, index) => (
                    <p key={index} className="text-xs text-red-700 dark:text-red-300">{item}</p>
                  ))}
                </div>
              </div>
            </section>

            {/* User Content */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" />
                {content.sections.userContent.title}
              </h3>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">{content.sections.userContent.ownership.title}</h4>
                <p className="text-xs text-muted-foreground">{content.sections.userContent.ownership.desc}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2 text-green-700 dark:text-green-300">
                    {content.sections.userContent.allowed.title}
                  </h4>
                  <div className="space-y-1">
                    {content.sections.userContent.allowed.items.map((item, index) => (
                      <p key={index} className="text-xs text-green-600 dark:text-green-400">{item}</p>
                    ))}
                  </div>
                </div>
                
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2 text-red-700 dark:text-red-300">
                    {content.sections.userContent.prohibited.title}
                  </h4>
                  <div className="space-y-1">
                    {content.sections.userContent.prohibited.items.map((item, index) => (
                      <p key={index} className="text-xs text-red-600 dark:text-red-400">{item}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">{content.sections.userContent.responsibility.title}</h4>
                <p className="text-xs text-muted-foreground">{content.sections.userContent.responsibility.desc}</p>
              </div>
            </section>

            {/* Payments */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-500" />
                {content.sections.payments.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.sections.payments.content}
              </p>
              <div className="space-y-2">
                {content.sections.payments.items.map((item, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-3">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Liability */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                {content.sections.liability.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.sections.liability.content}
              </p>
              <div className="grid gap-3">
                {content.sections.liability.items.map((item, index) => (
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

            {/* Termination */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                {content.sections.termination.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.sections.termination.content}
              </p>
              <div className="space-y-2">
                {content.sections.termination.items.map((item, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-3">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                {content.sections.changes.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.sections.changes.content}
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {content.sections.changes.items.map((item, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-3">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                {content.sections.contact.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.sections.contact.content}
              </p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                {content.sections.contact.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground">{item.value}</span>
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
