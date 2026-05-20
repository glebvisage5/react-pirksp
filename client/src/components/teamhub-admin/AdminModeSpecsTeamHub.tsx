import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useLanguage } from "../../lib/language-context";
import { FileText, Eye, Clock, Activity, Download, TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { SpecBuilder } from "../teamhub/SpecBuilder";
import { SpecViewer } from "../teamhub/SpecViewer";
import { SpecVersions } from "../teamhub/SpecVersions";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

// This is the Admin version with enhanced management capabilities  
export function AdminModeSpecsTeamHub() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("viewer");

  const t = {
    title: language === "en" ? "Specifications Management" : "Управление ТЗ",
    subtitle: language === "en" ? "Manage all technical specifications with full administrative access" : "Управление всеми техническими заданиями с полным административным доступом",
    builder: language === "en" ? "Builder" : "Конструктор",
    viewer: language === "en" ? "Viewer" : "Просмотр",
    versions: language === "en" ? "Versions" : "Версии",
  };

  return (
    <div className="space-y-6">
      {/* Header with Admin Badge */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <Badge className="bg-red-600 text-white">Admin</Badge>
        </div>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">45</p>
              <p className="text-sm text-muted-foreground">{language === "en" ? "Total Specs" : "Всего ТЗ"}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">18</p>
              <p className="text-sm text-muted-foreground">{language === "en" ? "In Progress" : "В работе"}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">127</p>
              <p className="text-sm text-muted-foreground">{language === "en" ? "Versions" : "Версии"}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">234</p>
              <p className="text-sm text-muted-foreground">{language === "en" ? "Downloads" : "Скачиваний"}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Specs Management with Tabs */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="viewer" className="gap-2">
              <Eye className="h-4 w-4" />
              {t.viewer}
            </TabsTrigger>
            <TabsTrigger value="builder" className="gap-2">
              <FileText className="h-4 w-4" />
              {t.builder}
            </TabsTrigger>
            <TabsTrigger value="versions" className="gap-2">
              <Clock className="h-4 w-4" />
              {t.versions}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="viewer" className="mt-6">
            <SpecViewer onEdit={() => setActiveTab("builder")} />
          </TabsContent>
          <TabsContent value="builder" className="mt-6">
            <SpecBuilder onSave={() => setActiveTab("viewer")} />
          </TabsContent>
          <TabsContent value="versions" className="mt-6">
            <SpecVersions />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
