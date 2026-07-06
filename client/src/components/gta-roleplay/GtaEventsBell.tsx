import { useState, useEffect, useCallback } from "react";
import { Bell, Server, Building2, Layers, Inbox } from "lucide-react";
import { Button } from "../ui/button";
import { api } from "../../api/client";
import { useLanguage } from "../../lib/language-context";

interface GtaEvent {
  id: string;
  type: string;
  server_id: string | null;
  org_id: string | null;
  summary: string;
  created_at: string;
}

function iconFor(type: string) {
  if (type.startsWith("server.")) return Server;
  if (type.startsWith("org.")) return Building2;
  if (type.startsWith("tab.") || type.startsWith("section.")) return Layers;
  if (type.startsWith("submission.")) return Inbox;
  return Bell;
}

export function GtaEventsBell() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<GtaEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const t = {
    title: language === "en" ? "Activity" : "События",
    empty: language === "en" ? "No events yet" : "Событий пока нет",
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setEvents(await api.get<GtaEvent[]>("/api/gta/events?limit=20"));
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !loaded) load();
  }, [isOpen, loaded, load]);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-background border rounded-lg shadow-lg z-50 max-h-[calc(100vh-120px)] flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold">{t.title}</h3>
            </div>

            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="divide-y">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="p-4 h-16 animate-pulse bg-muted/30" />
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>{t.empty}</p>
                </div>
              ) : (
                <div className="divide-y">
                  {events.map((ev) => {
                    const Icon = iconFor(ev.type);
                    return (
                      <div key={ev.id} className="p-4 flex gap-3">
                        <div className="p-2 h-fit rounded-lg bg-muted shrink-0" style={{ color: "#e0015b" }}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{ev.summary}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(ev.created_at).toLocaleString(language === "en" ? "en-US" : "ru-RU")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
