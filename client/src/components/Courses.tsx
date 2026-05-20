import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Search, Plus, Users, Calendar, Clock, DollarSign, Edit, Trash2, BookOpen } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Course {
  id: string;
  name: string;
  description: string;
  instructor: string;
  duration: string;
  schedule: string;
  price: number;
  enrolled: number;
  capacity: number;
  status: "active" | "upcoming" | "completed";
  category: string;
  image: string;
}

const mockCourses: Course[] = [
  {
    id: "1",
    name: "Advanced Mathematics",
    description: "Comprehensive course covering advanced mathematical concepts including calculus, linear algebra, and differential equations.",
    instructor: "Dr. Smith",
    duration: "12 weeks",
    schedule: "Mon, Wed, Fri - 2:00 PM",
    price: 1200,
    enrolled: 24,
    capacity: 30,
    status: "active",
    category: "Mathematics",
    image: "https://images.unsplash.com/photo-1652766399415-aa89236590fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2NDUwODEzNnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "2",
    name: "Web Development",
    description: "Learn modern web development with HTML, CSS, JavaScript, React, and Node.js. Build real-world projects.",
    instructor: "Prof. Johnson",
    duration: "16 weeks",
    schedule: "Tue, Thu - 4:30 PM",
    price: 1600,
    enrolled: 30,
    capacity: 30,
    status: "active",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZ3xlbnwxfHx8fDE3NjQ0OTI4Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "3",
    name: "Digital Marketing",
    description: "Master digital marketing strategies including SEO, social media, content marketing, and analytics.",
    instructor: "Ms. Anderson",
    duration: "8 weeks",
    schedule: "Mon, Wed - 10:00 AM",
    price: 900,
    enrolled: 18,
    capacity: 25,
    status: "active",
    category: "Business",
    image: "https://images.unsplash.com/photo-1544191046-397b734b0891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc2NDQyNzQ2NHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "4",
    name: "Data Science Fundamentals",
    description: "Introduction to data science with Python, statistics, data visualization, and machine learning basics.",
    instructor: "Dr. Martinez",
    duration: "14 weeks",
    schedule: "Wed, Fri - 6:00 PM",
    price: 1500,
    enrolled: 22,
    capacity: 28,
    status: "active",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZ3xlbnwxfHx8fDE3NjQ0OTI4Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "5",
    name: "UI/UX Design",
    description: "Learn user interface and user experience design principles, tools, and best practices.",
    instructor: "Ms. Lee",
    duration: "10 weeks",
    schedule: "Tue, Thu - 2:00 PM",
    price: 1100,
    enrolled: 0,
    capacity: 20,
    status: "upcoming",
    category: "Design",
    image: "https://images.unsplash.com/photo-1544191046-397b734b0891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc2NDQyNzQ2NHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "6",
    name: "Business Analytics",
    description: "Data-driven decision making, business intelligence, and analytics tools for modern businesses.",
    instructor: "Prof. Williams",
    duration: "12 weeks",
    schedule: "Mon, Wed - 7:00 PM",
    price: 1300,
    enrolled: 15,
    capacity: 25,
    status: "active",
    category: "Business",
    image: "https://images.unsplash.com/photo-1652766399415-aa89236590fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2NDUwODEzNnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function Courses() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEnrollmentPercentage = (enrolled: number, capacity: number) => {
    return (enrolled / capacity) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Course Management</h2>
          <p className="text-muted-foreground">Manage courses, schedules, and enrollments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>Enter the course information below</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input id="courseName" placeholder="Introduction to Python" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Course description..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input id="instructor" placeholder="Dr. Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue="technology">
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" placeholder="12 weeks" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" placeholder="1200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" type="number" placeholder="30" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule</Label>
                <Input id="schedule" placeholder="Mon, Wed, Fri - 2:00 PM" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Add Course</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses by name or instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden" onClick={() => setSelectedCourse(course)}>
            <ImageWithFallback
              src={course.image}
              alt={course.name}
              className="w-full h-40 object-cover"
            />
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{course.name}</CardTitle>
                <Badge className={`${getStatusColor(course.status)} shrink-0`} variant="secondary">
                  {course.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Instructor</span>
                <span>{course.instructor}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span>${course.price}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Enrollment</span>
                  <span>{course.enrolled}/{course.capacity}</span>
                </div>
                <Progress value={getEnrollmentPercentage(course.enrolled, course.capacity)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course Details Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCourse && (
            <>
              <DialogHeader>
                <ImageWithFallback
                  src={selectedCourse.image}
                  alt={selectedCourse.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle>{selectedCourse.name}</DialogTitle>
                    <DialogDescription>{selectedCourse.description}</DialogDescription>
                  </div>
                  <Badge className={`${getStatusColor(selectedCourse.status)} shrink-0`} variant="secondary">
                    {selectedCourse.status}
                  </Badge>
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Instructor</p>
                            <p>{selectedCourse.instructor}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p>{selectedCourse.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Schedule</p>
                            <p>{selectedCourse.schedule}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="text-2xl">${selectedCourse.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Enrollment</p>
                            <p>{selectedCourse.enrolled}/{selectedCourse.capacity} students</p>
                            <Progress value={getEnrollmentPercentage(selectedCourse.enrolled, selectedCourse.capacity)} className="mt-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Course
                    </Button>
                    <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Course
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="students" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3>Enrolled Students</h3>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Enroll Student
                          </Button>
                        </div>
                        {selectedCourse.enrolled > 0 ? (
                          <p className="text-muted-foreground">
                            {selectedCourse.enrolled} students are currently enrolled in this course.
                          </p>
                        ) : (
                          <p className="text-muted-foreground">No students enrolled yet.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="schedule" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Class Schedule</p>
                            <p>{selectedCourse.schedule}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Course Duration</p>
                            <p>{selectedCourse.duration}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
