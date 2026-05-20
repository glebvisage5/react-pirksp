import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Search,
  Filter,
  Mail,
  Phone,
  Building,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Download
} from "lucide-react";
import { useLanguage } from "../../../lib/language-context";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card } from "../../ui/card";
import { Textarea } from "../../ui/textarea";

interface Order {
  id: string;
  name: string;
  email: string;
  company: string;
  project: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  comments: string[];
}

const AdminOrders = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const orders: Order[] = [
    {
      id: "ORD-2024-001",
      name: "Иван Петров",
      email: "ivan@company.com",
      company: "Tech Solutions Ltd",
      project: "CRM System",
      description:
        "Нужна разработка CRM системы для управления клиентами и продажами. Требуется интеграция с 1C и телефонией.",
      status: "pending",
      createdAt: "2024-01-31 10:30",
      updatedAt: "2024-01-31 10:30",
      comments: []
    },
    {
      id: "ORD-2024-002",
      name: "Мария Сидорова",
      email: "maria@education.ru",
      company: "Образовательный центр",
      project: "LMS Platform",
      description:
        "Требуется платформа для онлайн-обучения с возможностью проведения вебинаров и тестирования студентов.",
      status: "in-progress",
      createdAt: "2024-01-30 14:20",
      updatedAt: "2024-01-31 09:15",
      comments: ["Начали разработку", "Выслали первый макет"]
    },
    {
      id: "ORD-2024-003",
      name: "Алексей Иванов",
      email: "alexey@startup.io",
      company: "StartupHub",
      project: "E-commerce",
      description:
        "Интернет-магазин с системой оплаты, доставки и личным кабинетом. Необходима мобильная версия.",
      status: "in-progress",
      createdAt: "2024-01-29 16:45",
      updatedAt: "2024-01-30 18:30",
      comments: ["Обсудили требования", "Готов прототип"]
    },
    {
      id: "ORD-2024-004",
      name: "Ольга Смирнова",
      email: "olga@consulting.com",
      company: "Business Consulting",
      project: "Corporate Website",
      description: "Корпоративный сайт с блогом и формами обратной связи.",
      status: "completed",
      createdAt: "2024-01-25 11:00",
      updatedAt: "2024-01-30 12:00",
      comments: ["Проект завершен", "Клиент доволен"]
    },
    {
      id: "ORD-2024-005",
      name: "Дмитрий Козлов",
      email: "dmitry@retail.ru",
      company: "Retail Chain",
      project: "Inventory System",
      description: "Система учета товаров и складских остатков.",
      status: "cancelled",
      createdAt: "2024-01-28 09:30",
      updatedAt: "2024-01-29 10:00",
      comments: ["Клиент отказался от проекта"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "in-progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    if (language === "en") {
      return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
    }
    switch (status) {
      case "pending":
        return "Ожидает";
      case "in-progress":
        return "В работе";
      case "completed":
        return "Завершен";
      case "cancelled":
        return "Отменен";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {language === "en" ? "Order Management" : "Управление заказами"}
        </h1>
        <p className="text-muted-foreground">
          {language === "en"
            ? "Manage client requests from website"
            : "Управление заявками клиентов с сайта"}
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                language === "en"
                  ? "Search by name, email, company..."
                  : "Поиск по имени, email, компании..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-md border bg-background"
            >
              <option value="all">
                {language === "en" ? "All Statuses" : "Все статусы"}
              </option>
              <option value="pending">
                {language === "en" ? "Pending" : "Ожидающие"}
              </option>
              <option value="in-progress">
                {language === "en" ? "In Progress" : "В работе"}
              </option>
              <option value="completed">
                {language === "en" ? "Completed" : "Завершенные"}
              </option>
              <option value="cancelled">
                {language === "en" ? "Cancelled" : "Отмененные"}
              </option>
            </select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Pending" : "Ожидают"}
              </p>
              <p className="text-2xl font-bold">
                {orders.filter((o) => o.status === "pending").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "In Progress" : "В работе"}
              </p>
              <p className="text-2xl font-bold">
                {orders.filter((o) => o.status === "in-progress").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Completed" : "Завершены"}
              </p>
              <p className="text-2xl font-bold">
                {orders.filter((o) => o.status === "completed").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Total" : "Всего"}
              </p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders */}
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedOrder(order)}
              className={`cursor-pointer ${
                selectedOrder?.id === order.id ? "ring-2 ring-[#4f46e5]" : ""
              }`}
            >
              <Card className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{order.name}</h3>
                    <p className="text-sm text-muted-foreground">{order.id}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {order.email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    {order.company}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    {order.project}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {order.createdAt}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Order Details */}
        <Card className="p-6 lg:sticky lg:top-6 h-fit">
          {selectedOrder ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedOrder.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.id}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOrder.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOrder.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOrder.project}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  {language === "en" ? "Description" : "Описание"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  {language === "en" ? "Status" : "Статус"}
                </h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    // Handle status change
                    console.log("Status changed to:", e.target.value);
                  }}
                  className="w-full px-4 py-2 rounded-md border bg-background"
                >
                  <option value="pending">
                    {language === "en" ? "Pending" : "Ожидает"}
                  </option>
                  <option value="in-progress">
                    {language === "en" ? "In Progress" : "В работе"}
                  </option>
                  <option value="completed">
                    {language === "en" ? "Completed" : "Завершен"}
                  </option>
                  <option value="cancelled">
                    {language === "en" ? "Cancelled" : "Отменен"}
                  </option>
                </select>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  {language === "en" ? "Comments" : "Комментарии"}
                </h3>
                <Textarea
                  placeholder={
                    language === "en"
                      ? "Add a comment..."
                      : "Добавить комментарий..."
                  }
                  className="mb-2"
                />
                {selectedOrder.comments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedOrder.comments.map((comment, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-muted text-sm"
                      >
                        {comment}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? "No comments yet" : "Комментариев пока нет"}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  {language === "en" ? "Save Changes" : "Сохранить"}
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {language === "en"
                  ? "Select an order to view details"
                  : "Выберите заказ для просмотра деталей"}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminOrders;
