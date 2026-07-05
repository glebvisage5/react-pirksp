import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

interface LinkifiedTextProps {
  text: string;
  language: "en" | "ru";
  className?: string;
}

export function LinkifiedText({ text, language, className }: LinkifiedTextProps) {
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  const t = {
    title: language === "en" ? "Open this link?" : "Перейти по ссылке?",
    description: language === "en"
      ? "This link was added by the creator of this organization inside the service. We are not responsible for the destination - proceed only if you trust it."
      : "Эта ссылка была вставлена создателем данной организации в сервисе. Мы не несём ответственности за переход по ней - открывайте, только если доверяете источнику.",
    cancel: language === "en" ? "Cancel" : "Отмена",
    proceed: language === "en" ? "Go to link" : "Перейти",
  };

  const parts = text.split(URL_REGEX);

  return (
    <>
      <span className={className}>
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <button
              key={i}
              type="button"
              className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:opacity-80 break-all"
              onClick={(e) => { e.stopPropagation(); setPendingUrl(part); }}
            >
              {part}
            </button>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>

      <AlertDialog open={!!pendingUrl} onOpenChange={(open: boolean) => { if (!open) setPendingUrl(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.title}</AlertDialogTitle>
            <AlertDialogDescription className="break-all">{t.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              className="text-white hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #e0015b, #f43f5e)' }}
              onClick={() => {
                if (pendingUrl) window.open(pendingUrl, "_blank", "noopener,noreferrer");
                setPendingUrl(null);
              }}
            >
              {t.proceed}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
