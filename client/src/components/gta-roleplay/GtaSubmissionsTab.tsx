import { useState, useEffect, useCallback } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Check, X, Archive, Inbox } from "lucide-react";
import { api } from "../../api/client";

interface Submission {
  id: string;
  section_id: string | null;
  answers: Record<string, string>;
  status: "pending" | "approved" | "rejected";
  reviewed_via: string | null;
  reviewed_at: string | null;
  created_at: string;
}

interface Tab {
  id: string;
  name: string;
}

interface Section {
  id: string;
  type: "members" | "text" | "form" | "document";
  config: Record<string, unknown>;
}

interface FormField {
  id: string;
  label: string;
}

type StatusFilter = "all" | "pending" | "approved" | "rejected";

const STATUS_STYLES: Record<Submission["status"], string> = {
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  approved: "text-green-600 dark:text-green-400",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
};
// bg-green-500/10 isn't in this project's prebuilt stylesheet — fall back to an inline background for that one status
const STATUS_BG: Partial<Record<Submission["status"], { backgroundColor: string }>> = {
  approved: { backgroundColor: "rgba(34, 197, 94, 0.1)" },
};

export function GtaSubmissionsTab({ orgId, tabs, language }: { orgId: string; tabs: Tab[]; language: string }) {
  const [view, setView] = useState<"live" | "archive">("live");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [fieldLabels, setFieldLabels] = useState<Map<string, Map<string, string>>>(new Map());
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const t = {
    live: language === "en" ? "Submissions" : "Заявки",
    archive: language === "en" ? "Archive" : "Архив",
    all: language === "en" ? "All" : "Все",
    pending: language === "en" ? "Pending" : "На рассмотрении",
    approved: language === "en" ? "Approved" : "Одобрено",
    rejected: language === "en" ? "Rejected" : "Отклонено",
    approve: language === "en" ? "Approve" : "Одобрить",
    reject: language === "en" ? "Reject" : "Отклонить",
    noSubmissions: language === "en" ? "No submissions yet" : "Заявок пока нет",
    noArchived: language === "en" ? "Archive is empty" : "Архив пуст",
    archiveNotice: language === "en"
      ? "Read-only. Will be permanently deleted 30 days after archiving."
      : "Только просмотр. Будет удалено навсегда через 30 дней после архивации.",
    approvedToast: language === "en" ? "Submission approved" : "Заявка одобрена",
    rejectedToast: language === "en" ? "Submission rejected" : "Заявка отклонена",
  };

  const loadFieldLabels = useCallback(async () => {
    const map = new Map<string, Map<string, string>>();
    await Promise.all(tabs.map(async (tab) => {
      const sections = await api.get<Section[]>(`/api/gta/tabs/${tab.id}/sections`);
      for (const sec of sections) {
        if (sec.type !== "form") continue;
        const fields = (sec.config as { fields?: FormField[] }).fields || [];
        map.set(sec.id, new Map(fields.map((f) => [f.id, f.label])));
      }
    }));
    setFieldLabels(map);
  }, [tabs]);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const path = view === "live"
        ? `/api/gta/orgs/${orgId}/submissions`
        : `/api/gta/orgs/${orgId}/submissions/archive`;
      setSubmissions(await api.get<Submission[]>(path));
    } finally {
      setLoading(false);
    }
  }, [orgId, view]);

  useEffect(() => { loadFieldLabels(); }, [loadFieldLabels]);
  useEffect(() => { loadSubmissions(); }, [loadSubmissions]);

  const handleReview = async (id: string, status: "approved" | "rejected") => {
    setReviewingId(id);
    try {
      await api.patch(`/api/gta/submissions/${id}`, { status });
      toast.success(status === "approved" ? t.approvedToast : t.rejectedToast);
      loadSubmissions();
    } finally {
      setReviewingId(null);
    }
  };

  const labelFor = (sectionId: string | null, fieldId: string): string => {
    if (!sectionId) return fieldId;
    return fieldLabels.get(sectionId)?.get(fieldId) ?? fieldId;
  };

  const filtered = statusFilter === "all" ? submissions : submissions.filter((s) => s.status === statusFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1 rounded-lg border p-1 bg-muted/30">
          <Button variant={view === "live" ? "default" : "ghost"} size="sm"
            className={`text-xs h-7 ${view === "live" ? "text-white" : ""}`}
            style={view === "live" ? { background: "#e0015b" } : undefined}
            onClick={() => setView("live")}>
            <Inbox className="h-3 w-3 mr-1" /> {t.live}
          </Button>
          <Button variant={view === "archive" ? "default" : "ghost"} size="sm"
            className={`text-xs h-7 ${view === "archive" ? "text-white" : ""}`}
            style={view === "archive" ? { background: "#e0015b" } : undefined}
            onClick={() => setView("archive")}>
            <Archive className="h-3 w-3 mr-1" /> {t.archive}
          </Button>
        </div>

        {view === "live" && (
          <div className="flex gap-1">
            {(["all", "pending", "approved", "rejected"] as StatusFilter[]).map((f) => (
              <Button key={f} variant={statusFilter === f ? "outline" : "ghost"} size="sm"
                className="text-xs h-7" onClick={() => setStatusFilter(f)}>
                {t[f]}
              </Button>
            ))}
          </div>
        )}
      </div>

      {view === "archive" && (
        <p className="text-xs text-muted-foreground">{t.archiveNotice}</p>
      )}

      {loading ? (
        <Card className="h-20 bg-card border animate-pulse" />
      ) : filtered.length === 0 ? (
        <Card className="p-8 bg-card border text-center">
          <p className="text-muted-foreground">{view === "live" ? t.noSubmissions : t.noArchived}</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((sub) => {
            const expanded = expandedId === sub.id;
            return (
              <Card key={sub.id} className="bg-card border overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedId(expanded ? null : sub.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs shrink-0 ${STATUS_STYLES[sub.status]}`} style={STATUS_BG[sub.status]}>
                      {t[sub.status]}
                    </span>
                    <span className="text-sm text-muted-foreground truncate">
                      {new Date(sub.created_at).toLocaleString(language === "en" ? "en-US" : "ru-RU")}
                    </span>
                  </div>
                  {expanded ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
                </button>

                {expanded && (
                  <div className="px-4 pb-4 space-y-3 border-t pt-3">
                    <div className="space-y-2">
                      {Object.entries(sub.answers).map(([fieldId, value]) => (
                        <div key={fieldId} className="text-sm">
                          <span className="text-muted-foreground">{labelFor(sub.section_id, fieldId)}: </span>
                          <span className="text-foreground">{value || "—"}</span>
                        </div>
                      ))}
                    </div>
                    {view === "live" && sub.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" className="text-white hover:opacity-90" style={{ background: "#16a34a" }}
                          disabled={reviewingId === sub.id}
                          onClick={() => handleReview(sub.id, "approved")}>
                          <Check className="h-3.5 w-3.5 mr-1" /> {t.approve}
                        </Button>
                        <Button size="sm" variant="destructive"
                          disabled={reviewingId === sub.id}
                          onClick={() => handleReview(sub.id, "rejected")}>
                          <X className="h-3.5 w-3.5 mr-1" /> {t.reject}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
