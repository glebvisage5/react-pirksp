import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, BookOpen, DollarSign, TrendingUp, Calendar, Bell } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: "up" | "down";
}

const StatCard = ({ title, value, change, icon, trend }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className={`text-xs ${trend === "up" ? "text-green-600" : "text-red-600"} mt-1`}>
        <TrendingUp className="inline h-3 w-3 mr-1" />
        {change} from last month
      </p>
    </CardContent>
  </Card>
);

interface RecentActivity {
  id: string;
  student: string;
  action: string;
  time: string;
  type: "enrollment" | "completion" | "payment";
}

const recentActivities: RecentActivity[] = [
  { id: "1", student: "Sarah Johnson", action: "Enrolled in Advanced Mathematics", time: "2 hours ago", type: "enrollment" },
  { id: "2", student: "Michael Chen", action: "Completed Web Development Course", time: "5 hours ago", type: "completion" },
  { id: "3", student: "Emma Davis", action: "Payment received for Winter Semester", time: "1 day ago", type: "payment" },
  { id: "4", student: "James Wilson", action: "Enrolled in Digital Marketing", time: "1 day ago", type: "enrollment" },
  { id: "5", student: "Olivia Brown", action: "Completed Data Science Fundamentals", time: "2 days ago", type: "completion" },
];

interface UpcomingClass {
  id: string;
  name: string;
  instructor: string;
  time: string;
  students: number;
  image: string;
}

const upcomingClasses: UpcomingClass[] = [
  { id: "1", name: "Advanced Mathematics", instructor: "Dr. Smith", time: "Today, 2:00 PM", students: 24, image: "https://images.unsplash.com/photo-1652766399415-aa89236590fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2NDUwODEzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "2", name: "Web Development", instructor: "Prof. Johnson", time: "Today, 4:30 PM", students: 30, image: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZ3xlbnwxfHx8fDE3NjQ0OTI4Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "3", name: "Digital Marketing", instructor: "Ms. Anderson", time: "Tomorrow, 10:00 AM", students: 18, image: "https://images.unsplash.com/photo-1544191046-397b734b0891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc2NDQyNzQ2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2>Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your school today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value="1,234"
          change="+12%"
          trend="up"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Active Courses"
          value="42"
          change="+5%"
          trend="up"
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Revenue (MTD)"
          value="$45,231"
          change="+18%"
          trend="up"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Completion Rate"
          value="87%"
          change="+3%"
          trend="up"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent transition-colors">
                <ImageWithFallback
                  src={classItem.image}
                  alt={classItem.name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate">{classItem.name}</p>
                    <Badge variant="outline" className="shrink-0">{classItem.students} students</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{classItem.instructor}</p>
                  <p className="text-xs text-muted-foreground">{classItem.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">View All Classes</Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === "enrollment" ? "bg-blue-500" :
                  activity.type === "completion" ? "bg-green-500" :
                  "bg-yellow-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{activity.student}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">View All Activity</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
