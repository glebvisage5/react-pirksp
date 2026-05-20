import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Users, BookOpen, DollarSign, Award } from "lucide-react";

const enrollmentData = [
  { month: "Jan", students: 120 },
  { month: "Feb", students: 145 },
  { month: "Mar", students: 180 },
  { month: "Apr", students: 165 },
  { month: "May", students: 210 },
  { month: "Jun", students: 245 },
  { month: "Jul", students: 230 },
  { month: "Aug", students: 280 },
  { month: "Sep", students: 310 },
  { month: "Oct", students: 295 },
  { month: "Nov", students: 340 },
];

const revenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 67000 },
  { month: "Jul", revenue: 72000 },
  { month: "Aug", revenue: 68000 },
  { month: "Sep", revenue: 78000 },
  { month: "Oct", revenue: 82000 },
  { month: "Nov", revenue: 89000 },
];

const coursePerformanceData = [
  { course: "Web Dev", enrolled: 30, completed: 27, completion: 90 },
  { course: "Data Science", enrolled: 28, completed: 22, completion: 79 },
  { course: "Marketing", enrolled: 25, completed: 24, completion: 96 },
  { course: "Math", enrolled: 24, completed: 20, completion: 83 },
  { course: "Design", enrolled: 20, completed: 18, completion: 90 },
];

const categoryDistribution = [
  { name: "Technology", value: 35, color: "#3b82f6" },
  { name: "Business", value: 25, color: "#10b981" },
  { name: "Design", value: 20, color: "#f59e0b" },
  { name: "Mathematics", value: 15, color: "#ef4444" },
  { name: "Others", value: 5, color: "#6b7280" },
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, trend, icon }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className={`flex items-center text-xs mt-1 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
        {trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
        <span>{change} from last month</span>
      </div>
    </CardContent>
  </Card>
);

export function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Analytics & Reports</h2>
          <p className="text-muted-foreground">Insights and performance metrics</p>
        </div>
        <Select defaultValue="30days">
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="year">This year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$567,234"
          change="+18.2%"
          trend="up"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Active Students"
          value="1,234"
          change="+12.5%"
          trend="up"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Course Completions"
          value="342"
          change="+8.3%"
          trend="up"
          icon={<Award className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Active Courses"
          value="42"
          change="+5.0%"
          trend="up"
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Tabs defaultValue="enrollment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="enrollment">Enrollment Trends</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="performance">Course Performance</TabsTrigger>
          <TabsTrigger value="distribution">Category Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="enrollment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Enrollment Over Time</CardTitle>
              <p className="text-sm text-muted-foreground">Monthly student enrollment trends</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} name="Students" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">New Enrollments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">340</div>
                <p className="text-sm text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Retention Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">94%</div>
                <p className="text-sm text-muted-foreground mt-1">Students continuing</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Avg. Enrollment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">2.8</div>
                <p className="text-sm text-muted-foreground mt-1">Courses per student</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <p className="text-sm text-muted-foreground">Monthly revenue performance</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">$717K</div>
                <p className="text-sm text-muted-foreground mt-1">Year to date</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Avg. Course Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">$1,285</div>
                <p className="text-sm text-muted-foreground mt-1">Per enrollment</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Growth Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">+24%</div>
                <p className="text-sm text-muted-foreground mt-1">Year over year</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Completion Rates</CardTitle>
              <p className="text-sm text-muted-foreground">Student completion statistics by course</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={coursePerformanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="course" type="category" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="enrolled" fill="#3b82f6" name="Enrolled" />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coursePerformanceData.map((course) => (
                  <div key={course.course} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>{course.course}</span>
                      <span className="text-sm text-muted-foreground">{course.completion}% completion</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${course.completion}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Course Category Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">Breakdown by subject area</p>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryDistribution.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <span className="text-muted-foreground">{category.value}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Most Popular</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">Technology</div>
                <p className="text-sm text-muted-foreground mt-1">35% of enrollments</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fastest Growing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">Business</div>
                <p className="text-sm text-muted-foreground mt-1">+42% this quarter</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Highest Rated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">Design</div>
                <p className="text-sm text-muted-foreground mt-1">4.8/5.0 average</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
