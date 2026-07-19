/**
 * Text Animation Controls Component
 *
 * UI controls for applying entrance and exit animations to text clips.
 * Uses handleUpdate/handleUpdateMultiple props to integrate with the
 * undo/redo history system (TransformClipCommand).
 */

import React, { useCallback } from "react";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TextClip, TextAnimation } from "@/types";
import { ENTRANCE_PRESETS, EXIT_PRESETS, createDefaultAnimation } from "@/lib/text/textAnimation";
import { PropertySlider } from "./primitives/PropertySlider";
import { PropertySelect } from "./primitives/PropertySelect";
import { PropertySection } from "./primitives/PropertySection";

interface TextAnimationControlsProps {
  clip: TextClip;
  handleUpdate: (key: string, value: any) => void;
  handleUpdateMultiple: (fields: Record<string, any>) => void;
}

export const TextAnimationControls: React.FC<TextAnimationControlsProps> = ({ clip, handleUpdate }) => {
  const { t } = useTranslation("editor");
  const EASING_OPTIONS = [
    { value: "linear", label: t("linear") },
    { value: "ease-in", label: t("easeIn") },
    { value: "ease-out", label: t("easeOut") },
    { value: "ease-in-out", label: t("easeInOutFull") },
  ];
  const handleEntranceChange = useCallback(
    (type: string) => {
      const animation = type === "none" ? undefined : createDefaultAnimation(type as TextAnimation["type"]);
      handleUpdate("entranceAnimation", animation);
    },
    [handleUpdate],
  );

  const handleExitChange = useCallback(
    (type: string) => {
      const animation = type === "none" ? undefined : createDefaultAnimation(type as TextAnimation["type"]);
      handleUpdate("exitAnimation", animation);
    },
    [handleUpdate],
  );

  const handleEntranceDurationChange = useCallback(
    (duration: number) => {
      if (clip.entranceAnimation) {
        handleUpdate("entranceAnimation", {
          ...clip.entranceAnimation,
          duration: Math.max(0.1, Math.min(duration, clip.duration / 2)),
        });
      }
    },
    [clip.entranceAnimation, clip.duration, handleUpdate],
  );

  const handleExitDurationChange = useCallback(
    (duration: number) => {
      if (clip.exitAnimation) {
        handleUpdate("exitAnimation", {
          ...clip.exitAnimation,
          duration: Math.max(0.1, Math.min(duration, clip.duration / 2)),
        });
      }
    },
    [clip.exitAnimation, clip.duration, handleUpdate],
  );

  const handleEntranceEasingChange = useCallback(
    (easing: string) => {
      if (clip.entranceAnimation) {
        handleUpdate("entranceAnimation", {
          ...clip.entranceAnimation,
          easing: easing as TextAnimation["easing"],
        });
      }
    },
    [clip.entranceAnimation, handleUpdate],
  );

  const handleExitEasingChange = useCallback(
    (easing: string) => {
      if (clip.exitAnimation) {
        handleUpdate("exitAnimation", {
          ...clip.exitAnimation,
          easing: easing as TextAnimation["easing"],
        });
      }
    },
    [clip.exitAnimation, handleUpdate],
  );

  const entranceOptions = ENTRANCE_PRESETS.map((p) => ({ value: p.type, label: p.name }));
  const exitOptions = EXIT_PRESETS.map((p) => ({ value: p.type, label: p.name }));

  return (
    <PropertySection title={t("textAnimations")} icon={<Sparkles className="w-3.5 h-3.5" />}>
      <div className="space-y-4">
        {/* Entrance Animation */}
        <div className="space-y-2.5">
          <PropertySelect label={t("entrance")} value={clip.entranceAnimation?.type || "none"} options={entranceOptions} onChange={handleEntranceChange} />

          {clip.entranceAnimation && clip.entranceAnimation.type !== "none" && (
            <div className="space-y-2.5 pl-2.5 border-l-2 border-accent/25">
              <PropertySlider label={t("duration")} value={clip.entranceAnimation.duration} min={0.1} max={Math.max(clip.duration / 2, 0.2)} step={0.1} suffix="s" onChange={handleEntranceDurationChange} />
              <PropertySelect label={t("easing")} value={clip.entranceAnimation.easing} options={EASING_OPTIONS} onChange={handleEntranceEasingChange} />
            </div>
          )}
        </div>

        {/* Exit Animation */}
        <div className="space-y-2.5">
          <PropertySelect label={t("exit")} value={clip.exitAnimation?.type || "none"} options={exitOptions} onChange={handleExitChange} />

          {clip.exitAnimation && clip.exitAnimation.type !== "none" && (
            <div className="space-y-2.5 pl-2.5 border-l-2 border-accent/25">
              <PropertySlider label={t("duration")} value={clip.exitAnimation.duration} min={0.1} max={Math.max(clip.duration / 2, 0.2)} step={0.1} suffix="s" onChange={handleExitDurationChange} />
              <PropertySelect label={t("easing")} value={clip.exitAnimation.easing} options={EASING_OPTIONS} onChange={handleExitEasingChange} />
            </div>
          )}
        </div>

        {/* Animation Info */}
        {(clip.entranceAnimation?.type !== "none" || clip.exitAnimation?.type !== "none") && <div className="text-[10px] text-text-muted/60 italic pt-2 border-t border-border/20 select-none">{t("animationsPreviewDuringPlayback")}</div>}
      </div>
    </PropertySection>
  );
};
