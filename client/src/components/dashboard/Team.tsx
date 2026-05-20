import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useLanguage } from "../../lib/language-context";
import { Users, Plus, Crown, Edit, Trash2, UserPlus, ClipboardList, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "leader" | "member";
}

interface TeamTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "completed";
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  project: string;
  status: "active" | "completed" | "planning";
  tasks: TeamTask[];
}

const availableStudents = [
  { id: "1", name: "Sarah Johnson", email: "sarah.johnson@email.com" },
  { id: "2", name: "Michael Chen", email: "michael.chen@email.com" },
  { id: "3", name: "Emma Davis", email: "emma.davis@email.com" },
  { id: "4", name: "James Wilson", email: "james.wilson@email.com" },
  { id: "5", name: "Olivia Brown", email: "olivia.brown@email.com" },
  { id: "6", name: "William Taylor", email: "william.taylor@email.com" },
  { id: "7", name: "Sophia Martinez", email: "sophia.martinez@email.com" },
  { id: "8", name: "Daniel Anderson", email: "daniel.anderson@email.com" },
];

const mockTeams: Team[] = [
  {
    id: "1",
    name: "Web Dev Warriors",
    description: "Building a full-stack e-commerce platform",
    project: "E-commerce Platform",
    status: "active",
    members: [
      { id: "1", name: "Sarah Johnson", email: "sarah.johnson@email.com", role: "leader" },
      { id: "2", name: "Michael Chen", email: "michael.chen@email.com", role: "member" },
      { id: "3", name: "Emma Davis", email: "emma.davis@email.com", role: "member" },
    ],
    tasks: [
      {
        id: "task-1",
        title: "Design Database Schema",
        description: "Create the database structure for the e-commerce platform",
        assignedTo: ["2"],
        dueDate: "Dec 10, 2024",
        priority: "high",
        status: "in-progress",
      },
      {
        id: "task-2",
        title: "Create UI Mockups",
        description: "Design mockups for all main pages",
        assignedTo: ["3"],
        dueDate: "Dec 8, 2024",
        priority: "medium",
        status: "completed",
      },
    ],
  },
  {
    id: "2",
    name: "Data Scientists",
    description: "Machine learning project for predictive analytics",
    project: "ML Prediction Model",
    status: "active",
    members: [
      { id: "4", name: "James Wilson", email: "james.wilson@email.com", role: "leader" },
      { id: "5", name: "Olivia Brown", email: "olivia.brown@email.com", role: "member" },
    ],
    tasks: [
      {
        id: "task-3",
        title: "Data Collection",
        description: "Gather and prepare training data",
        assignedTo: ["5"],
        dueDate: "Dec 15, 2024",
        priority: "high",
        status: "todo",
      },
    ],
  },
  {
    id: "3",
    name: "Marketing Mavericks",
    description: "Digital marketing campaign for local business",
    project: "Social Media Campaign",
    status: "planning",
    members: [
      { id: "6", name: "William Taylor", email: "william.taylor@email.com", role: "leader" },
      { id: "7", name: "Sophia Martinez", email: "sophia.martinez@email.com", role: "member" },
      { id: "8", name: "Daniel Anderson", email: "daniel.anderson@email.com", role: "member" },
    ],
    tasks: [],
  },
];

export function Team() {
  const { language } = useLanguage();
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isViewTasksDialogOpen, setIsViewTasksDialogOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    project: "",
  });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [teamLeader, setTeamLeader] = useState<string>("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: [] as string[],
    dueDate: undefined as Date | undefined,
    priority: "medium" as "low" | "medium" | "high",
  });

  const t = {
    teams: language === "en" ? "Teams" : "Команды",
    subtitle: language === "en" ? "Create and manage project teams" : "Создавайте и управляйте командами проектов",
    createTeam: language === "en" ? "Create Team" : "Создать команду",
    createNewTeam: language === "en" ? "Create New Team" : "Создать новую команду",
    setupNewTeam: language === "en" ? "Set up a new team for your project" : "Создайте новую команду для вашего проекта",
    teamName: language === "en" ? "Team Name" : "Название команды",
    project: language === "en" ? "Project" : "Проект",
    description: language === "en" ? "Description" : "Описание",
    selectTeamMembers: language === "en" ? "Select Team Members" : "Выберите участников команды",
    assignTeamLeader: language === "en" ? "Assign Team Leader" : "Назначить лидера команды",
    selectLeader: language === "en" ? "Select a leader" : "Выберите лидера",
    cancel: language === "en" ? "Cancel" : "Отмена",
    totalTeams: language === "en" ? "Total Teams" : "Всего команд",
    activeTeams: language === "en" ? "Active Teams" : "Активных команд",
    totalTasks: language === "en" ? "Total Tasks" : "Всего задач",
    teamMembers: language === "en" ? "Team Members" : "Участники команды",
    teamTasks: language === "en" ? "Team Tasks" : "Задачи команды",
    noTasksYet: language === "en" ? "No tasks yet" : "Задач пока нет",
    noTeamsCreated: language === "en" ? "No teams created yet" : "Команды еще не созданы",
    createFirstTeam: language === "en" ? "Create Your First Team" : "Создать первую команду",
    createTeamTask: language === "en" ? "Create Team Task" : "Создать задачу для команды",
    createNewTask: language === "en" ? "Create a new task for" : "Создать новую задачу для",
    taskTitle: language === "en" ? "Task Title" : "Название задачи",
    priority: language === "en" ? "Priority" : "Приоритет",
    dueDate: language === "en" ? "Due Date" : "Срок выполнения",
    pickDate: language === "en" ? "Pick a date" : "Выберите дату",
    assignTo: language === "en" ? "Assign to" : "Назначить на",
    createTask: language === "en" ? "Create Task" : "Создать задачу",
    viewAllTasks: language === "en" ? "View all" : "Посмотреть все",
    tasks: language === "en" ? "tasks" : "задач",
    member: language === "en" ? "Member" : "Участник",
    leader: language === "en" ? "Leader" : "Лидер",
    active: language === "en" ? "active" : "активна",
    completed: language === "en" ? "completed" : "завершена",
    planning: language === "en" ? "planning" : "планирование",
    low: language === "en" ? "Low" : "Низкий",
    medium: language === "en" ? "Medium" : "Средний",
    high: language === "en" ? "High" : "Высокий",
    todo: language === "en" ? "todo" : "к выполнению",
    inProgress: language === "en" ? "in-progress" : "в процессе",
    taskCompleted: language === "en" ? "completed" : "завершена",
    due: language === "en" ? "Due" : "Срок",
    editTeam: language === "en" ? "Edit Team" : "Редактировать команду",
    updateTeamDetails: language === "en" ? "Update team information" : "Обновите информацию о команде",
    saveChanges: language === "en" ? "Save Changes" : "Сохранить изменения",
    allTasks: language === "en" ? "All Tasks" : "Все задачи",
    viewManageTasks: language === "en" ? "View and manage all tasks for" : "Просмотр и управление задачами для",
    status: language === "en" ? "Status" : "Статус",
    assignedTo: language === "en" ? "Assigned to" : "Назначено",
    nobody: language === "en" ? "Nobody" : "Никто",
    updateStatus: language === "en" ? "Update Status" : "Обновить статус"
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500";
      case "planning": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500";
      case "todo": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500";
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-4 w-4" />;
      case "in-progress": return <Clock className="h-4 w-4" />;
      case "todo": return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleCreateTeam = () => {
    if (newTeam.name && selectedMembers.length > 0) {
      const members: TeamMember[] = selectedMembers.map(id => {
        const student = availableStudents.find(s => s.id === id)!;
        return {
          ...student,
          role: id === teamLeader ? "leader" : "member"
        };
      });

      const team: Team = {
        id: (teams.length + 1).toString(),
        ...newTeam,
        members,
        status: "planning",
        tasks: [],
      };

      setTeams([...teams, team]);
      setNewTeam({ name: "", description: "", project: "" });
      setSelectedMembers([]);
      setTeamLeader("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleCreateTask = () => {
    if (selectedTeam && newTask.title) {
      const task: TeamTask = {
        id: `task-${Date.now()}`,
        title: newTask.title,
        description: newTask.description,
        assignedTo: newTask.assignedTo,
        dueDate: newTask.dueDate ? format(newTask.dueDate, "MMM dd, yyyy") : "",
        priority: newTask.priority,
        status: "todo",
      };

      setTeams(teams.map(team =>
        team.id === selectedTeam.id
          ? { ...team, tasks: [...team.tasks, task] }
          : team
      ));

      setNewTask({
        title: "",
        description: "",
        assignedTo: [],
        dueDate: undefined,
        priority: "medium",
      });
      setIsTaskDialogOpen(false);
    }
  };

  const handleDeleteTeam = (id: string) => {
    setTeams(teams.filter(t => t.id !== id));
    if (selectedTeam?.id === id) {
      setSelectedTeam(null);
    }
  };

  const handleEditTeam = () => {
    if (selectedTeam && newTeam.name && newTeam.project) {
      const updatedTeam: Team = {
        ...selectedTeam,
        name: newTeam.name,
        description: newTeam.description,
        project: newTeam.project,
        members: [
          ...(teamLeader ? [{ 
            id: teamLeader, 
            ...availableStudents.find(s => s.id === teamLeader)!, 
            role: "leader" as const 
          }] : []),
          ...selectedMembers
            .filter(id => id !== teamLeader)
            .map(id => ({
              id,
              ...availableStudents.find(s => s.id === id)!,
              role: "member" as const
            }))
        ]
      };
      
      setTeams(teams.map(t => t.id === selectedTeam.id ? updatedTeam : t));
      setNewTeam({ name: "", description: "", project: "" });
      setSelectedMembers([]);
      setTeamLeader("");
      setSelectedTeam(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleToggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleToggleTaskAssignee = (memberId: string) => {
    setNewTask({
      ...newTask,
      assignedTo: newTask.assignedTo.includes(memberId)
        ? newTask.assignedTo.filter(id => id !== memberId)
        : [...newTask.assignedTo, memberId]
    });
  };

  const handleChangeLeader = (teamId: string, newLeaderId: string) => {
    setTeams(teams.map(team =>
      team.id === teamId
        ? {
            ...team,
            members: team.members.map(m => ({
              ...m,
              role: m.id === newLeaderId ? "leader" : "member"
            }))
          }
        : team
    ));
  };

  const handleUpdateTaskStatus = (teamId: string, taskId: string, newStatus: "todo" | "in-progress" | "completed") => {
    setTeams(teams.map(team =>
      team.id === teamId
        ? {
            ...team,
            tasks: team.tasks.map(task =>
              task.id === taskId ? { ...task, status: newStatus } : task
            )
          }
        : team
    ));
  };

  const handleDeleteTask = (teamId: string, taskId: string) => {
    setTeams(teams.map(team =>
      team.id === teamId
        ? { ...team, tasks: team.tasks.filter(task => task.id !== taskId) }
        : team
    ));
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-[1800px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-center sm:text-left w-full sm:w-auto">
          <h2 className="text-xl sm:text-2xl">{t.teams}</h2>
          <p className="text-muted-foreground text-sm sm:text-base">{t.subtitle}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t.createTeam}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t.createNewTeam}</DialogTitle>
              <DialogDescription>{t.setupNewTeam}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  placeholder="Web Dev Warriors"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Input
                  id="project"
                  placeholder="E-commerce Platform"
                  value={newTeam.project}
                  onChange={(e) => setNewTeam({ ...newTeam, project: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Building a full-stack application..."
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Select Team Members</Label>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                  {availableStudents.map((student) => (
                    <div key={student.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={student.id}
                        checked={selectedMembers.includes(student.id)}
                        onCheckedChange={() => handleToggleMember(student.id)}
                      />
                      <label htmlFor={student.id} className="flex-1 text-sm cursor-pointer">
                        {student.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {selectedMembers.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="leader">Assign Team Leader</Label>
                  <Select value={teamLeader} onValueChange={setTeamLeader}>
                    <SelectTrigger id="leader">
                      <SelectValue placeholder="Select a leader" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedMembers.map((memberId) => {
                        const student = availableStudents.find(s => s.id === memberId);
                        return student ? (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ) : null;
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateTeam} className="flex-1">
                  Create Team
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Teams</p>
                <div className="text-2xl">{teams.length}</div>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Teams</p>
                <div className="text-2xl text-green-600">
                  {teams.filter(t => t.status === "active").length}
                </div>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <div className="text-2xl">
                  {teams.reduce((sum, team) => sum + team.tasks.length, 0)}
                </div>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teams Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle>{team.name}</CardTitle>
                    <Badge className={getStatusColor(team.status)} variant="secondary">
                      {team.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{team.project}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTeam(team);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTeam(team.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{team.description}</p>
              
              {/* Team Members */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm">Team Members ({team.members.length})</p>
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg border"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm truncate">{member.name}</p>
                          {member.role === "leader" && (
                            <Crown className="h-4 w-4 text-yellow-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.email}
                        </p>
                      </div>
                      <Select
                        value={member.role}
                        onValueChange={(value) => {
                          if (value === "leader") {
                            handleChangeLeader(team.id, member.id);
                          }
                        }}
                      >
                        <SelectTrigger className="w-24 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="leader">Leader</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Tasks */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm">Team Tasks ({team.tasks.length})</p>
                  <div className="flex gap-2">
                    {team.tasks.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTeam(team);
                          setIsViewTasksDialogOpen(true);
                        }}
                      >
                        <ClipboardList className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTeam(team);
                        setIsTaskDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {team.tasks.length > 0 ? (
                  <div className="space-y-2">
                    {team.tasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-lg border"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm">{task.title}</p>
                              <Badge className={getPriorityColor(task.priority)} variant="secondary">
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Due: {task.dueDate}
                            </p>
                          </div>
                          <Badge className={getTaskStatusColor(task.status)} variant="secondary">
                            <div className="flex items-center gap-1">
                              {getTaskStatusIcon(task.status)}
                              <span className="text-xs">{task.status}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {team.tasks.length > 2 && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => {
                          setSelectedTeam(team);
                          setIsViewTasksDialogOpen(true);
                        }}
                        className="w-full"
                      >
                        View all {team.tasks.length} tasks
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No tasks yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teams.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No teams created yet</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Team
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Team Task</DialogTitle>
            <DialogDescription>
              Create a new task for {selectedTeam?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="taskTitle">Task Title</Label>
              <Input
                id="taskTitle"
                placeholder="Design Database Schema"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskDescription">Description</Label>
              <Textarea
                id="taskDescription"
                placeholder="Describe the task..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskPriority">Priority</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value: "low" | "medium" | "high") => 
                  setNewTask({ ...newTask, priority: value })
                }
              >
                <SelectTrigger id="taskPriority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newTask.dueDate ? format(newTask.dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newTask.dueDate}
                    onSelect={(date) => setNewTask({ ...newTask, dueDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Assign To</Label>
              <div className="border rounded-lg p-4 max-h-40 overflow-y-auto space-y-2">
                {selectedTeam?.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`assign-${member.id}`}
                      checked={newTask.assignedTo.includes(member.id)}
                      onCheckedChange={() => handleToggleTaskAssignee(member.id)}
                    />
                    <label htmlFor={`assign-${member.id}`} className="flex-1 text-sm cursor-pointer">
                      {member.name}
                      {member.role === "leader" && (
                        <Crown className="inline-block ml-2 h-3 w-3 text-yellow-500" />
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsTaskDialogOpen(false);
                  setNewTask({
                    title: "",
                    description: "",
                    assignedTo: [],
                    dueDate: undefined,
                    priority: "medium",
                  });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateTask} className="flex-1">
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Tasks Dialog */}
      <Dialog open={isViewTasksDialogOpen} onOpenChange={setIsViewTasksDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTeam?.name} - All Tasks</DialogTitle>
            <DialogDescription>
              Manage all tasks for this team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            {selectedTeam?.tasks.map((task) => {
              const assignedMembers = selectedTeam.members.filter(m => 
                task.assignedTo.includes(m.id)
              );
              
              return (
                <Card key={task.id}>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4>{task.title}</h4>
                            <Badge className={getPriorityColor(task.priority)} variant="secondary">
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {task.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(selectedTeam.id, task.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Due:</span>
                          <span>{task.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Status:</span>
                          <Select
                            value={task.status}
                            onValueChange={(value: "todo" | "in-progress" | "completed") =>
                              handleUpdateTaskStatus(selectedTeam.id, task.id, value)
                            }
                          >
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todo">To Do</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {assignedMembers.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Assigned to:</p>
                          <div className="flex flex-wrap gap-2">
                            {assignedMembers.map(member => (
                              <Badge key={member.id} variant="outline">
                                {member.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {selectedTeam?.tasks.length === 0 && (
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tasks yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (open && selectedTeam) {
          // Populate form with existing team data
          setNewTeam({
            name: selectedTeam.name,
            description: selectedTeam.description,
            project: selectedTeam.project,
          });
          setSelectedMembers(selectedTeam.members.map(m => m.id));
          setTeamLeader(selectedTeam.members.find(m => m.role === "leader")?.id || "");
        } else {
          // Reset form
          setNewTeam({ name: "", description: "", project: "" });
          setSelectedMembers([]);
          setTeamLeader("");
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>Update team information and members</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="editTeamName">Team Name</Label>
              <Input
                id="editTeamName"
                placeholder="Web Dev Warriors"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editProject">Project</Label>
              <Input
                id="editProject"
                placeholder="E-commerce Platform"
                value={newTeam.project}
                onChange={(e) => setNewTeam({ ...newTeam, project: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Input
                id="editDescription"
                placeholder="Building a full-stack application..."
                value={newTeam.description}
                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Select Team Members</Label>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {availableStudents.map((student) => (
                  <div key={student.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${student.id}`}
                      checked={selectedMembers.includes(student.id)}
                      onCheckedChange={() => handleToggleMember(student.id)}
                    />
                    <label htmlFor={`edit-${student.id}`} className="flex-1 text-sm cursor-pointer">
                      {student.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {selectedMembers.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="editLeader">Assign Team Leader</Label>
                <Select value={teamLeader} onValueChange={setTeamLeader}>
                  <SelectTrigger id="editLeader">
                    <SelectValue placeholder="Select a leader" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedMembers.map((memberId) => {
                      const student = availableStudents.find(s => s.id === memberId);
                      return student ? (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ) : null;
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleEditTeam} className="flex-1">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}