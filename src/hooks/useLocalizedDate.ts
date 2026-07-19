import { useTranslation } from "react-i18next";

type UseLocalizedDateOptions = {
  includeToday?: boolean;
  includeYesterday?: boolean;
  daysAgoMax?: number;
};

const DEFAULT_OPTIONS: UseLocalizedDateOptions = {
  includeToday: true,
  includeYesterday: true,
  daysAgoMax: 7,
};

export const useLocalizedDate = (options: UseLocalizedDateOptions = DEFAULT_OPTIONS) => {
  const { t, i18n } = useTranslation("launch");
  const { includeToday = true, includeYesterday = true, daysAgoMax = 7 } = { ...DEFAULT_OPTIONS, ...options };

  return (dateStr: string | number) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0 && includeToday) return t("today");
    if (diffDays === 1 && includeYesterday) return t("yesterday");
    if (diffDays > 0 && diffDays < daysAgoMax) return t("daysAgo", { count: diffDays });

    return date.toLocaleDateString(i18n.language === "zh" ? "zh-CN" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
};
