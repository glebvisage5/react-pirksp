import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Card } from "../ui/card";
import { GraduationCap, BarChart3, Users, ShoppingCart, ArrowRight, Sparkles, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useUser } from "../../lib/user-context";

interface Service {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  descriptionRu: string;
  icon: React.ReactNode;
  color: string;
  status: "active" | "coming-soon";
  statusRu: string;
}

const services: Service[] = [
  {
    id: "educrm",
    name: "EduCRM",
    nameRu: "EduCRM",
    description: "Comprehensive educational management system for schools and learning centers",
    descriptionRu: "Комплексная система управления образованием для школ и учебных центров",
    icon: <GraduationCap className="w-8 h-8" />,
    color: "from-purple-500 via-indigo-600 to-green-500",
    status: "active",
    statusRu: "Доступно"
  },
  {
    id: "analytics",
    name: "AnalyticsPro",
    nameRu: "AnalyticsPro",
    description: "Advanced business analytics and reporting platform",
    descriptionRu: "Продвинутая платформа для бизнес-аналитики и отчётности",
    icon: <BarChart3 className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-600",
    status: "coming-soon",
    statusRu: "Скоро"
  },
  {
    id: "teamhub",
    name: "TeamHub",
    nameRu: "TeamHub",
    description: "Complete HR management and team collaboration solution",
    descriptionRu: "Полное решение для управления персоналом и командной работы",
    icon: <Users className="w-8 h-8" />,
    color: "from-emerald-500 to-teal-600",
    status: "active",
    statusRu: "Доступно"
  },
  {
    id: "ecommerce",
    name: "ShopFlow",
    nameRu: "ShopFlow",
    description: "E-commerce platform with inventory and order management",
    descriptionRu: "E-commerce платформа с управлением товарами и заказами",
    icon: <ShoppingCart className="w-8 h-8" />,
    color: "from-orange-500 to-red-600",
    status: "coming-soon",
    statusRu: "Скоро"
  }
];

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceId: string) => void;
  onContactUs?: () => void;
  language: "en" | "ru";
}

export function ServicesModal({ isOpen, onClose, onSelectService, onContactUs, language }: ServicesModalProps) {
  const { isAdmin } = useUser();
  
  const t = {
    title: language === "en" ? "Choose Your Service" : "Выберите сервис",
    subtitle: language === "en" ? "Select a service to get started" : "Выберите сервис для начала работы",
    comingSoon: language === "en" ? "Coming Soon" : "Скоро"
  };
  
  // Администраторский сервис
  const adminService: Service = {
    id: "admin-center",
    name: "Admin Center",
    nameRu: "Админ-панель",
    description: "Global platform administration and management",
    descriptionRu: "Глобальное администрирование и управление платформой",
    icon: <Shield className="w-8 h-8" />,
    color: "from-red-600 via-purple-600 to-indigo-700",
    status: "active",
    statusRu: "Доступно"
  };
  
  // Объединяем сервисы - админский сервис первым для админов
  const displayedServices = isAdmin ? [adminService, ...services] : services;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto bg-background">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <DialogTitle className="text-center text-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-green-600 dark:from-purple-400 dark:via-indigo-400 dark:to-green-400 bg-clip-text text-transparent">
              {t.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-center text-sm">
            {t.subtitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {displayedServices.map((service) => (
            <Card
              key={service.id}
              className={`
                p-5 transition-all duration-300 cursor-pointer border-2
                ${service.status === "active" 
                  ? "hover:shadow-xl hover:scale-[1.02] hover:border-primary/50" 
                  : "opacity-60 cursor-not-allowed"
                }
              `}
              onClick={() => service.status === "active" && onSelectService(service.id)}
            >
              <div className="flex flex-col gap-4">
                {/* Icon with gradient background */}
                <div className={`
                  w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} 
                  flex items-center justify-center text-white
                  shadow-lg transition-all
                `}>
                  {service.icon}
                </div>

                {/* Service info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl">
                      {language === "en" ? service.name : service.nameRu}
                    </h3>
                    {service.status === "coming-soon" && (
                      <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs whitespace-nowrap">
                        {language === "en" ? "Coming Soon" : service.statusRu}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {language === "en" ? service.description : service.descriptionRu}
                  </p>
                </div>

                {/* Action button */}
                {service.status === "active" && (
                  <Button 
                    className="w-full justify-between group text-white shadow-lg hover:shadow-xl transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7, #4f46e5, #22c55e)',
                      color: 'white'
                    }}
                  >
                    <span className="text-sm">{language === "en" ? "Launch Service" : "Запустить сервис"}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Custom service section */}
        <div className="mt-6 p-5 border-2 rounded-xl bg-muted/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <h4 className="text-lg">
                  {language === "en" ? "Need a Custom Solution?" : "Нужно индивидуальное решение?"}
                </h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === "en" 
                  ? "We create custom CRM systems tailored to your specific requirements"
                  : "Мы создаём CRM системы по вашим индивидуальным требованиям"}
              </p>
            </div>
            <Button 
              variant="outline" 
              className="whitespace-nowrap border-2 border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5]/10 px-5 py-2" 
              onClick={onContactUs}
            >
              {language === "en" ? "Contact Us" : "Связаться с нами"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
