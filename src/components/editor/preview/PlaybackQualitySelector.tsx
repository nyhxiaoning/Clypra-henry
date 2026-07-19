import React from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaybackQualitySelectorProps {
  previewQuality: "full" | "high" | "medium" | "low";
  qualityMenuOpen: boolean;
  setQualityMenuOpen: (open: boolean) => void;
  setPreviewQuality: (quality: "full" | "high" | "medium" | "low") => void;
}

export const PlaybackQualitySelector: React.FC<PlaybackQualitySelectorProps> = ({
  previewQuality,
  qualityMenuOpen,
  setQualityMenuOpen,
  setPreviewQuality,
}) => {
  const { t } = useTranslation("editor");
  return (
    <div className="relative">
      <button
        onClick={() => setQualityMenuOpen(!qualityMenuOpen)}
        className="flex items-center gap-1 px-2 h-6 rounded text-[10px] font-medium text-text-muted hover:text-text-primary hover:bg-white/6 transition-colors cursor-pointer"
        title={t("playbackQuality")}
        aria-expanded={qualityMenuOpen}
      >
        <span className="max-w-18 truncate capitalize">{previewQuality}</span>
        <ChevronDown className="h-3 w-3 shrink-0 opacity-70" />
      </button>
      {qualityMenuOpen && (
        <div
          className="absolute bottom-full left-0 z-50 mb-1 w-[300px] overflow-hidden rounded-lg border border-border bg-surface py-1.5 text-text-primary shadow-xl"
          role="listbox"
        >
          <div className="px-1.5 space-y-0.5">
            {[
              {
                value: "full",
                label: t("fullQuality"),
                description: t("fullQualityDesc"),
              },
              {
                value: "high",
                label: t("highQuality"),
                description: t("highQualityDesc"),
              },
              {
                value: "medium",
                label: t("mediumQuality"),
                description: t("mediumQualityDesc"),
              },
              {
                value: "low",
                label: t("lowQuality"),
                description: t("lowQualityDesc"),
              },
            ].map((q) => (
              <button
                key={q.value}
                type="button"
                role="option"
                aria-selected={previewQuality === q.value}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded px-2 py-2 text-left hover:bg-surface-raised transition-colors duration-150 cursor-pointer",
                  previewQuality === q.value && "bg-surface-raised"
                )}
                onClick={() => {
                  setPreviewQuality(q.value as any);
                  setQualityMenuOpen(false);
                }}
              >
                <span className="flex w-4 shrink-0 justify-center pt-0.5">
                  {previewQuality === q.value ? (
                    <Check className="h-3.5 h-3.5 text-accent" />
                  ) : null}
                </span>
                <div className="flex flex-col min-w-0 flex-1 leading-none">
                  <span className="text-xs font-semibold text-text-primary">
                    {q.label}
                  </span>
                  <span className="text-[10px] text-text-muted mt-1 leading-normal whitespace-normal">
                    {q.description}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
