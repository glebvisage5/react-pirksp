import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, Send, Mail, MessageSquare, Users, Clock, CheckCheck, Plus } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: "inbox" | "sent";
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: "high" | "medium" | "low";
  recipients: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "Dr. Smith",
    recipient: "You",
    subject: "Assignment Deadline Extension",
    content: "The deadline for the Advanced Mathematics assignment has been extended to next Friday.",
    timestamp: "2 hours ago",
    read: false,
    type: "inbox",
  },
  {
    id: "2",
    sender: "Sarah Johnson",
    recipient: "You",
    subject: "Question about Course Material",
    content: "Hi, I have a question about the lecture from yesterday. Could we schedule a meeting?",
    timestamp: "5 hours ago",
    read: false,
    type: "inbox",
  },
  {
    id: "3",
    sender: "You",
    recipient: "Michael Chen",
    subject: "Re: Enrollment Confirmation",
    content: "Your enrollment has been confirmed. Welcome to the course!",
    timestamp: "1 day ago",
    read: true,
    type: "sent",
  },
  {
    id: "4",
    sender: "Prof. Johnson",
    recipient: "You",
    subject: "Guest Lecture Invitation",
    content: "We are hosting a guest lecture next week. Would you like to attend?",
    timestamp: "2 days ago",
    read: true,
    type: "inbox",
  },
];

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Winter Break Schedule",
    content: "Classes will be suspended from December 20th to January 5th. Have a great break!",
    author: "Administration",
    date: "2024-11-28",
    priority: "high",
    recipients: "All Students",
  },
  {
    id: "2",
    title: "New Course Registration Open",
    content: "Registration for Spring 2025 courses is now open. Please register before December 15th.",
    author: "Registrar Office",
    date: "2024-11-25",
    priority: "high",
    recipients: "All Students",
  },
  {
    id: "3",
    title: "Library Hours Extended",
    content: "The library will now be open until 10 PM on weekdays to support exam preparation.",
    author: "Library Staff",
    date: "2024-11-22",
    priority: "medium",
    recipients: "All Students",
  },
  {
    id: "4",
    title: "Career Fair Next Month",
    content: "Join us for the annual career fair on January 15th. Many companies will be attending!",
    author: "Career Services",
    date: "2024-11-20",
    priority: "medium",
    recipients: "All Students",
  },
];

export function Communications() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageType, setMessageType] = useState<"inbox" | "sent">("inbox");
  const [showCompose, setShowCompose] = useState(false);

  const filteredMessages = messages.filter((message) => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = message.type === messageType;
    return matchesSearch && matchesType;
  });

  const unreadCount = messages.filter(m => !m.read && m.type === "inbox").length;

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(m => 
      m.id === messageId ? { ...m, read: true } : m
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Communications</h2>
        <p className="text-muted-foreground">Messages, announcements, and notifications</p>
      </div>

      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="messages" className="relative">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="announcements">
            <Mail className="h-4 w-4 mr-2" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="compose">
            <Send className="h-4 w-4 mr-2" />
            Compose
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={messageType} onValueChange={(value) => setMessageType(value as "inbox" | "sent")}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbox">Inbox</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer ${
                      !message.read && message.type === "inbox" ? "bg-blue-50 border-blue-200" : ""
                    }`}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.read) markAsRead(message.id);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(message.sender)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <p className={!message.read && message.type === "inbox" ? "" : ""}>{message.sender}</p>
                            {!message.read && message.type === "inbox" && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">{message.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{message.subject}</p>
                        <p className="text-sm text-muted-foreground truncate mt-1">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Message Detail View */}
          {selectedMessage && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedMessage.subject}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(selectedMessage.sender)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">{selectedMessage.sender}</p>
                        <p className="text-xs text-muted-foreground">{selectedMessage.timestamp}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedMessage(null)}>Close</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                <div className="flex gap-2 mt-6">
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <Button variant="outline">Forward</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{announcements.length} announcements</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </div>

          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <Badge className={getPriorityColor(announcement.priority)} variant="secondary">
                          {announcement.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {announcement.recipients}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(announcement.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{announcement.content}</p>
                  <p className="text-sm text-muted-foreground mt-4">Posted by {announcement.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compose New Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm">To</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="individual">Individual Student</SelectItem>
                    <SelectItem value="course">Course Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm">Subject</label>
                <Input placeholder="Enter subject" />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Message</label>
                <Textarea placeholder="Write your message..." rows={8} />
              </div>
              <div className="flex gap-2">
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline">Save Draft</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
