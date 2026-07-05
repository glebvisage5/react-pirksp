import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { uploadGtaIcon, gtaIconUrl, isGtaIconImage } from "../../api/gta";

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  defaultIcon: string;
  language: "en" | "ru";
}

export function IconPicker({ value, onChange, defaultIcon, language }: IconPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const t = {
    upload: language === "en" ? "Upload image" : "Загрузить изображение",
    remove: language === "en" ? "Remove" : "Удалить",
    tooBig: language === "en" ? "Image must be under 5 MB" : "Изображение должно быть меньше 5 МБ",
    failed: language === "en" ? "Upload failed" : "Не удалось загрузить изображение",
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error(t.tooBig); return; }
    setUploading(true);
    try {
      const { url } = await uploadGtaIcon(file);
      onChange(url);
    } catch {
      toast.error(t.failed);
    } finally {
      setUploading(false);
    }
  };

  const isImage = isGtaIconImage(value);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative w-16 h-16 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-[#e0015b]/50 flex items-center justify-center overflow-hidden bg-muted/30 transition-colors shrink-0"
      >
        {uploading ? (
          <div className="h-5 w-5 border-2 border-[#e0015b] border-t-transparent rounded-full animate-spin" />
        ) : isImage ? (
          <img src={gtaIconUrl(value)} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl">{value}</span>
        )}
      </button>
      <div className="flex flex-col gap-1.5">
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
          <Upload className="h-3.5 w-3.5 mr-1.5" />
          {t.upload}
        </Button>
        {isImage && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
            onClick={() => onChange(defaultIcon)}
          >
            <X className="h-3.5 w-3.5 mr-1.5" />
            {t.remove}
          </Button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}
