import { useState, useRef, useEffect } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { useLanguage } from "../../../lib/language-context";
import { 
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Reply,
  Trash2,
  Edit2,
  Copy,
  CheckSquare,
  FileText,
  AtSign,
  Image as ImageIcon,
  File,
  X,
  ThumbsUp,
  Heart,
  Star,
  Zap,
  Search,
  Pin,
  Download
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover";
import { ScrollArea } from "../../ui/scroll-area";
import { toast } from "sonner@2.0.3";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface Message {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  edited?: boolean;
  attachments?: Attachment[];
  mentions?: string[];
  reactions?: Reaction[];
  replyTo?: string;
  pinned?: boolean;
  linkedTask?: {
    id: string;
    title: string;
  };
  linkedSpec?: {
    id: string;
    blockId: string;
    title: string;
  };
}

interface Attachment {
  id: string;
  name: string;
  type: "image" | "file";
  url: string;
  size: string;
}

interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

interface TeamChatProps {
  teamId: string;
  userRole?: "Team Leader" | "Moderator" | "Member" | "Viewer";
}

export function TeamChat({ teamId, userRole = "Team Leader" }: TeamChatProps) {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      author: {
        id: "user1",
        name: language === "en" ? "John Doe" : "Иван Петров",
      },
      content: language === "en" 
        ? "Hey team! I've uploaded the latest design mockups. Can someone review them?" 
        : "Привет команда! Я загрузил последние дизайн-макеты. Кто-нибудь может проверить?",
      timestamp: "2024-01-28 10:30",
      reactions: [
        { emoji: "👍", users: ["user2", "user3"], count: 2 },
        { emoji: "👀", users: ["user4"], count: 1 },
      ],
      attachments: [
        {
          id: "att1",
          name: "dashboard_mockup.png",
          type: "image",
          url: "#",
          size: "1.2 MB",
        },
      ],
    },
    {
      id: "2",
      author: {
        id: "user2",
        name: language === "en" ? "Jane Smith" : "Мария Сидорова",
      },
      content: language === "en"
        ? "@John Doe Looks great! I'll create a task for implementing this design."
        : "@Иван Петров Отлично выглядит! Я создам задачу для реализации этого дизайна.",
      timestamp: "2024-01-28 11:15",
      mentions: ["user1"],
      replyTo: "1",
      reactions: [
        { emoji: "❤️", users: ["user1"], count: 1 },
      ],
      linkedTask: {
        id: "task1",
        title: language === "en" ? "Implement new dashboard design" : "Реализовать новый дизайн панели",
      },
    },
    {
      id: "3",
      author: {
        id: "user3",
        name: language === "en" ? "Mike Johnson" : "Михаил Иванов",
      },
      content: language === "en"
        ? "I've added a new section to the spec about the authentication flow. Please check block #2.3"
        : "Я добавил новый раздел в ТЗ о процессе аутентификации. Пожалуйста, проверьте блок #2.3",
      timestamp: "2024-01-28 14:20",
      pinned: true,
      linkedSpec: {
        id: "spec1",
        blockId: "block-2.3",
        title: language === "en" ? "Mobile App Specification" : "Техническое задание мобильного приложения",
      },
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showSpecDialog, setShowSpecDialog] = useState(false);
  const [selectedMessageForAction, setSelectedMessageForAction] = useState<Message | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const t = {
    title: language === "en" ? "Team Chat" : "Чат команды",
    description: language === "en" 
      ? "Communicate asynchronously with your team members" 
      : "Общайтесь асинхронно с членами вашей команды",
    search: language === "en" ? "Search messages..." : "Поиск сообщений...",
    typeMessage: language === "en" ? "Type a message..." : "Введите сообщение...",
    send: language === "en" ? "Send" : "Отправить",
    attach: language === "en" ? "Attach file" : "Прикрепить файл",
    emoji: language === "en" ? "Add emoji" : "Добавить эмодзи",
    mention: language === "en" ? "Mention someone" : "Упомянуть кого-то",
    reply: language === "en" ? "Reply" : "Ответить",
    edit: language === "en" ? "Edit" : "Редактировать",
    delete: language === "en" ? "Delete" : "Удалить",
    copy: language === "en" ? "Copy text" : "Копировать текст",
    createTask: language === "en" ? "Create task" : "Создать задачу",
    linkSpec: language === "en" ? "Link to spec" : "Связать с ТЗ",
    pin: language === "en" ? "Pin message" : "Закрепить сообщение",
    unpin: language === "en" ? "Unpin message" : "Открепить сообщение",
    edited: language === "en" ? "edited" : "изменено",
    replyingTo: language === "en" ? "Replying to" : "Ответ на",
    cancel: language === "en" ? "Cancel" : "Отмена",
    update: language === "en" ? "Update" : "Обновить",
    pinned: language === "en" ? "Pinned" : "Закреплено",
    attachments: language === "en" ? "Attachments" : "Вложения",
    linkedTask: language === "en" ? "Linked Task" : "Связанная задача",
    linkedSpec: language === "en" ? "Linked Spec" : "Связанное ТЗ",
    viewTask: language === "en" ? "View task" : "Посмотреть задачу",
    viewSpec: language === "en" ? "View spec block" : "Посмотреть блок ТЗ",
    download: language === "en" ? "Download" : "Скачать",
    noMessages: language === "en" ? "No messages yet" : "Пока нет сообщений",
    startConversation: language === "en" 
      ? "Start a conversation with your team" 
      : "Начните общение с вашей командой",
    createTaskFromMessage: language === "en" ? "Create Task from Message" : "Создать задачу из сообщения",
    taskTitle: language === "en" ? "Task Title" : "Название задачи",
    taskDescription: language === "en" ? "Task Description" : "Описание задачи",
    taskPriority: language === "en" ? "Priority" : "Приоритет",
    create: language === "en" ? "Create" : "Создать",
    linkToSpec: language === "en" ? "Link to Specification" : "Связать с ТЗ",
    selectSpec: language === "en" ? "Select Specification" : "Выберите ТЗ",
    selectBlock: language === "en" ? "Select Block" : "Выберите блок",
    link: language === "en" ? "Link" : "Связать",
    messageSent: language === "en" ? "Message sent" : "Сообщение отправлено",
    messageUpdated: language === "en" ? "Message updated" : "Сообщение обновлено",
    messageDeleted: language === "en" ? "Message deleted" : "Сообщение удалено",
    messagePinned: language === "en" ? "Message pinned" : "Сообщение закреплено",
    messageUnpinned: language === "en" ? "Message unpinned" : "Сообщение откреплено",
    taskCreated: language === "en" ? "Task created from message" : "Задача создана из сообщения",
    specLinked: language === "en" ? "Spec block linked to message" : "Блок ТЗ привязан к сообщению",
    textCopied: language === "en" ? "Text copied to clipboard" : "Текст скопирован",
    low: language === "en" ? "Low" : "Низкий",
    medium: language === "en" ? "Medium" : "Средний",
    high: language === "en" ? "High" : "Высокий",
    viewerNoSend: language === "en" 
      ? "Viewers can read messages but cannot send" 
      : "Наблюдатели могут читать, но не могут отправлять сообщения",
  };

  // Mock team members for mentions
  const teamMembers = [
    { id: "user1", name: language === "en" ? "John Doe" : "Иван Петров" },
    { id: "user2", name: language === "en" ? "Jane Smith" : "Мария Сидорова" },
    { id: "user3", name: language === "en" ? "Mike Johnson" : "Михаил Иванов" },
    { id: "user4", name: language === "en" ? "Sarah Wilson" : "Анна Кузнецова" },
  ];

  // Mock specs for linking
  const availableSpecs = [
    { id: "spec1", title: language === "en" ? "Mobile App Specification" : "ТЗ мобильного приложения" },
    { id: "spec2", title: language === "en" ? "API Documentation" : "Документация API" },
    { id: "spec3", title: language === "en" ? "Dashboard Requirements" : "Требования к панели управления" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;
    
    if (userRole === "Viewer") {
      toast.error(t.viewerNoSend);
      return;
    }

    const attachments: Attachment[] = selectedFiles.map((file, index) => ({
      id: `att-${Date.now()}-${index}`,
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : "file",
      url: "#",
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    }));

    const mentions = newMessage.match(/@(\w+\s*\w+)/g)?.map(m => m.substring(1)) || [];

    const message: Message = {
      id: `msg-${Date.now()}`,
      author: {
        id: "current-user",
        name: language === "en" ? "Current User" : "Текущий пользователь",
      },
      content: newMessage,
      timestamp: new Date().toLocaleString(),
      attachments: attachments.length > 0 ? attachments : undefined,
      mentions: mentions.length > 0 ? mentions : undefined,
      replyTo: replyingTo?.id,
    };

    setMessages([...messages, message]);
    setNewMessage("");
    setReplyingTo(null);
    setSelectedFiles([]);
    toast.success(t.messageSent);
  };

  const handleUpdateMessage = () => {
    if (!editingMessage || !newMessage.trim()) return;

    setMessages(messages.map(msg => 
      msg.id === editingMessage.id 
        ? { ...msg, content: newMessage, edited: true }
        : msg
    ));
    
    setNewMessage("");
    setEditingMessage(null);
    toast.success(t.messageUpdated);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
    toast.success(t.messageDeleted);
  };

  const handlePinMessage = (message: Message) => {
    setMessages(messages.map(msg =>
      msg.id === message.id ? { ...msg, pinned: !msg.pinned } : msg
    ));
    toast.success(message.pinned ? t.messageUnpinned : t.messagePinned);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    const currentUserId = "current-user";
    
    setMessages(messages.map(msg => {
      if (msg.id !== messageId) return msg;
      
      const reactions = msg.reactions || [];
      const existingReaction = reactions.find(r => r.emoji === emoji);
      
      if (existingReaction) {
        const hasReacted = existingReaction.users.includes(currentUserId);
        
        if (hasReacted) {
          // Remove reaction
          const updatedUsers = existingReaction.users.filter(id => id !== currentUserId);
          if (updatedUsers.length === 0) {
            return {
              ...msg,
              reactions: reactions.filter(r => r.emoji !== emoji),
            };
          }
          return {
            ...msg,
            reactions: reactions.map(r =>
              r.emoji === emoji
                ? { ...r, users: updatedUsers, count: updatedUsers.length }
                : r
            ),
          };
        } else {
          // Add reaction
          return {
            ...msg,
            reactions: reactions.map(r =>
              r.emoji === emoji
                ? { ...r, users: [...r.users, currentUserId], count: r.count + 1 }
                : r
            ),
          };
        }
      } else {
        // New reaction
        return {
          ...msg,
          reactions: [...reactions, { emoji, users: [currentUserId], count: 1 }],
        };
      }
    }));
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t.textCopied);
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
    setNewMessage(message.content);
    textareaRef.current?.focus();
  };

  const handleCreateTaskFromMessage = (message: Message) => {
    setSelectedMessageForAction(message);
    setShowTaskDialog(true);
  };

  const handleLinkSpec = (message: Message) => {
    setSelectedMessageForAction(message);
    setShowSpecDialog(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleInsertMention = (member: { id: string; name: string }) => {
    setNewMessage(prev => prev + `@${member.name} `);
    setShowMentionSuggestions(false);
    textareaRef.current?.focus();
  };

  const filteredMessages = messages.filter(msg =>
    searchQuery === "" ||
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedMessages = filteredMessages.filter(msg => msg.pinned);
  const regularMessages = filteredMessages.filter(msg => !msg.pinned);

  const renderMessage = (message: Message) => {
    const isCurrentUser = message.author.id === "current-user";
    const replyToMessage = message.replyTo 
      ? messages.find(m => m.id === message.replyTo)
      : null;

    return (
      <div
        key={message.id}
        className={`flex gap-3 group ${message.pinned ? "bg-yellow-50 dark:bg-yellow-950/20 -mx-4 px-4 py-2" : ""}`}
      >
        {/* Avatar */}
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            {message.author.name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{message.author.name}</span>
            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
            {message.edited && (
              <Badge variant="outline" className="text-xs">
                {t.edited}
              </Badge>
            )}
            {message.pinned && (
              <Badge className="bg-yellow-500 text-white text-xs">
                <Pin className="h-3 w-3 mr-1" />
                {t.pinned}
              </Badge>
            )}
          </div>

          {/* Reply Reference */}
          {replyToMessage && (
            <div className="bg-muted/50 border-l-2 border-emerald-500 pl-3 py-1 mb-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Reply className="h-3 w-3" />
                <span className="font-medium">{replyToMessage.author.name}</span>
              </div>
              <p className="text-muted-foreground truncate">{replyToMessage.content}</p>
            </div>
          )}

          {/* Message Text */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map(attachment => (
                <Card key={attachment.id} className="p-3">
                  <div className="flex items-center gap-3">
                    {attachment.type === "image" ? (
                      <ImageIcon className="h-8 w-8 text-emerald-500" />
                    ) : (
                      <File className="h-8 w-8 text-blue-500" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{attachment.name}</p>
                      <p className="text-sm text-muted-foreground">{attachment.size}</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Linked Task */}
          {message.linkedTask && (
            <Card className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.linkedTask}</p>
                  <p className="text-sm text-muted-foreground">{message.linkedTask.title}</p>
                </div>
                <Button size="sm" variant="ghost">
                  {t.viewTask}
                </Button>
              </div>
            </Card>
          )}

          {/* Linked Spec */}
          {message.linkedSpec && (
            <Card className="mt-2 p-3 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.linkedSpec}</p>
                  <p className="text-sm text-muted-foreground">{message.linkedSpec.title}</p>
                  <p className="text-xs text-muted-foreground">Block: {message.linkedSpec.blockId}</p>
                </div>
                <Button size="sm" variant="ghost">
                  {t.viewSpec}
                </Button>
              </div>
            </Card>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => handleReaction(message.id, reaction.emoji)}
                >
                  <span className="mr-1">{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </Button>
              ))}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <Smile className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <div className="flex gap-1">
                    {["👍", "❤️", "😊", "🎉", "👀", "⭐"].map(emoji => (
                      <Button
                        key={emoji}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReaction(message.id, emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Actions Menu */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setReplyingTo(message)}>
                <Reply className="h-4 w-4 mr-2" />
                {t.reply}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCopyText(message.content)}>
                <Copy className="h-4 w-4 mr-2" />
                {t.copy}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleCreateTaskFromMessage(message)}>
                <CheckSquare className="h-4 w-4 mr-2" />
                {t.createTask}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLinkSpec(message)}>
                <FileText className="h-4 w-4 mr-2" />
                {t.linkSpec}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {(userRole === "Team Leader" || userRole === "Moderator" || isCurrentUser) && (
                <>
                  <DropdownMenuItem onClick={() => handlePinMessage(message)}>
                    <Pin className="h-4 w-4 mr-2" />
                    {message.pinned ? t.unpin : t.pin}
                  </DropdownMenuItem>
                  {isCurrentUser && (
                    <>
                      <DropdownMenuItem onClick={() => handleEditMessage(message)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        {t.edit}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteMessage(message.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t.delete}
                      </DropdownMenuItem>
                    </>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-emerald-500" />
            {t.title}
          </h2>
          <p className="text-muted-foreground">{t.description}</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Chat Container */}
      <Card className="flex flex-col h-[600px]">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {/* Pinned Messages */}
            {pinnedMessages.length > 0 && (
              <div className="space-y-4 pb-4 border-b">
                {pinnedMessages.map(renderMessage)}
              </div>
            )}

            {/* Regular Messages */}
            {regularMessages.length > 0 ? (
              <div className="space-y-4">
                {regularMessages.map(renderMessage)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">{t.noMessages}</h3>
                <p className="text-muted-foreground">{t.startConversation}</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Reply/Edit Banner */}
        {(replyingTo || editingMessage) && (
          <div className="px-4 py-2 bg-muted/50 border-t flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {replyingTo && (
                <>
                  <Reply className="h-4 w-4" />
                  <span>
                    {t.replyingTo} <strong>{replyingTo.author.name}</strong>
                  </span>
                </>
              )}
              {editingMessage && (
                <>
                  <Edit2 className="h-4 w-4" />
                  <span>{t.edit}</span>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReplyingTo(null);
                setEditingMessage(null);
                setNewMessage("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="px-4 py-2 bg-muted/50 border-t">
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-2">
                  <File className="h-3 w-3" />
                  <span className="text-xs">{file.name}</span>
                  <button
                    onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Textarea
                ref={textareaRef}
                placeholder={userRole === "Viewer" ? t.viewerNoSend : t.typeMessage}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (editingMessage) {
                      handleUpdateMessage();
                    } else {
                      handleSendMessage();
                    }
                  }
                }}
                disabled={userRole === "Viewer"}
                className="min-h-[80px] resize-none"
              />
              
              {/* Toolbar */}
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={userRole === "Viewer"}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <Popover open={showMentionSuggestions} onOpenChange={setShowMentionSuggestions}>
                  <PopoverTrigger asChild>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      disabled={userRole === "Viewer"}
                    >
                      <AtSign className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2">
                    <div className="space-y-1">
                      {teamMembers.map(member => (
                        <Button
                          key={member.id}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleInsertMention(member)}
                        >
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="text-xs">
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          {member.name}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button
              onClick={editingMessage ? handleUpdateMessage : handleSendMessage}
              disabled={(!newMessage.trim() && selectedFiles.length === 0) || userRole === "Viewer"}
              className="self-end"
            >
              <Send className="h-4 w-4 mr-2" />
              {editingMessage ? t.update : t.send}
            </Button>
          </div>
        </div>
      </Card>

      {/* Create Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.createTaskFromMessage}</DialogTitle>
            <DialogDescription>
              {selectedMessageForAction?.content}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t.taskTitle}</Label>
              <Input 
                placeholder={language === "en" ? "Enter task title" : "Введите название задачи"}
              />
            </div>
            <div>
              <Label>{t.taskDescription}</Label>
              <Textarea 
                placeholder={language === "en" ? "Enter task description" : "Введите описание задачи"}
                defaultValue={selectedMessageForAction?.content}
              />
            </div>
            <div>
              <Label>{t.taskPriority}</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t.low}</SelectItem>
                  <SelectItem value="medium">{t.medium}</SelectItem>
                  <SelectItem value="high">{t.high}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
              {t.cancel}
            </Button>
            <Button onClick={() => {
              toast.success(t.taskCreated);
              setShowTaskDialog(false);
            }}>
              {t.create}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Spec Dialog */}
      <Dialog open={showSpecDialog} onOpenChange={setShowSpecDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.linkToSpec}</DialogTitle>
            <DialogDescription>
              {selectedMessageForAction?.content}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t.selectSpec}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={language === "en" ? "Choose specification" : "Выберите ТЗ"} />
                </SelectTrigger>
                <SelectContent>
                  {availableSpecs.map(spec => (
                    <SelectItem key={spec.id} value={spec.id}>
                      {spec.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t.selectBlock}</Label>
              <Input placeholder="e.g., 2.3 или Block #5" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSpecDialog(false)}>
              {t.cancel}
            </Button>
            <Button onClick={() => {
              toast.success(t.specLinked);
              setShowSpecDialog(false);
            }}>
              {t.link}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
