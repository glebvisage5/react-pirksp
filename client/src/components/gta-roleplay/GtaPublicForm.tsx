import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../lib/language-context";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { api, ApiError } from "../../api/client";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  required: boolean;
  options?: string[];
}

interface PublicForm {
  orgName: string;
  fields: FormField[];
}

type Status = "loading" | "ready" | "not-found" | "submitting" | "submitted" | "error";

export function GtaPublicForm() {
  const { token } = useParams<{ token: string }>();
  const { language } = useLanguage();
  const [status, setStatus] = useState<Status>("loading");
  const [form, setForm] = useState<PublicForm | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState("");

  const t = {
    submit: language === "en" ? "Submit" : "Отправить",
    notFound: language === "en" ? "This form is not available." : "Эта форма недоступна.",
    thanksTitle: language === "en" ? "Application sent" : "Заявка отправлена",
    thanksBody: language === "en"
      ? "Thank you! Your application has been submitted for review."
      : "Спасибо! Ваша заявка отправлена на рассмотрение.",
    fillRequired: language === "en" ? "Fill in all required fields" : "Заполните все обязательные поля",
    selectPlaceholder: language === "en" ? "Select..." : "Выберите...",
    genericError: language === "en" ? "Something went wrong. Please try again." : "Что-то пошло не так. Попробуйте ещё раз.",
  };

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setForm(await api.get<PublicForm>(`/api/gta/public/forms/${token}`));
      setStatus("ready");
    } catch {
      setStatus("not-found");
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const setAnswer = (id: string, value: string) => setAnswers((a) => ({ ...a, [id]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !token) return;

    const missing = form.fields.filter((f) => f.required && !(answers[f.id] ?? "").trim());
    if (missing.length > 0) {
      setErrorMessage(t.fillRequired);
      return;
    }

    setStatus("submitting");
    setErrorMessage("");
    try {
      await api.post(`/api/gta/public/forms/${token}/submissions`, { answers });
      setStatus("submitted");
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : t.genericError);
      setStatus("ready");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg p-6 bg-card border">
        {status === "loading" && (
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-muted rounded" style={{ width: "66%" }} />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-full" />
          </div>
        )}

        {status === "not-found" && (
          <div className="text-center py-8 space-y-2">
            <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="text-foreground">{t.notFound}</p>
          </div>
        )}

        {status === "submitted" && (
          <div className="text-center py-8 space-y-2">
            <CheckCircle2 className="h-10 w-10 mx-auto text-green-600 dark:text-green-400" />
            <h2 className="text-lg font-semibold text-foreground">{t.thanksTitle}</h2>
            <p className="text-muted-foreground text-sm">{t.thanksBody}</p>
          </div>
        )}

        {(status === "ready" || status === "submitting") && form && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-xl font-bold text-foreground">{form.orgName}</h1>
            {form.fields.map((field) => (
              <div key={field.id} className="space-y-1">
                <Label className="text-sm">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.type === "text" && (
                  <Input value={answers[field.id] ?? ""} onChange={(e) => setAnswer(field.id, e.target.value)} />
                )}
                {field.type === "number" && (
                  <Input type="number" value={answers[field.id] ?? ""} onChange={(e) => setAnswer(field.id, e.target.value)} />
                )}
                {field.type === "date" && (
                  <Input type="date" value={answers[field.id] ?? ""} onChange={(e) => setAnswer(field.id, e.target.value)} />
                )}
                {field.type === "select" && (
                  <select value={answers[field.id] ?? ""} onChange={(e) => setAnswer(field.id, e.target.value)}
                    className="w-full h-9 px-3 rounded-md border text-sm bg-background text-foreground">
                    <option value="">{t.selectPlaceholder}</option>
                    {(field.options || []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                )}
              </div>
            ))}
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
            <Button type="submit" className="w-full text-white hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #e0015b, #f43f5e)" }}
              disabled={status === "submitting"}>
              {t.submit}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
