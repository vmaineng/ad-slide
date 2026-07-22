"use client";

import { SignalStage } from "../types/index";

const STAGES: { key: SignalStage; label: string }[] = [
  { key: "request", label: "REQUEST" },
  { key: "decision", label: "DECISION" },
  { key: "delivery", label: "DELIVERY" },
  { key: "tracking", label: "TRACKING" },
];

export default function SignalPath({
  activeStage,
}: {
  activeStage: SignalStage | null;
}) {
  const activeIndex = activeStage
    ? STAGES.findIndex((s) => s.key === activeStage)
    : -1;

  return (
    <div className="flex items-center mb-8">
      {STAGES.map((stage, i) => {
        const isActive = i === activeIndex;
        const isPast = i < activeIndex;
        return (
          <div
            key={stage.key}
            className={`flex items-center ${i < STAGES.length - 1 ? "flex-1" : ""}`}
          >
            <div className="flex flex-col items-center gap-2 min-w-[84px]">
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-signal shadow-[0_0_12px_2px_var(--color-signal)]"
                    : isPast
                      ? "bg-text-dim"
                      : "bg-line"
                }`}
              />
              <span
                className={`font-mono text-[11px] tracking-[0.12em] transition-colors duration-300 ${
                  isActive ? "text-signal" : "text-text-dim"
                }`}
              >
                {stage.label}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div
                className={`flex-1 h-px mb-5 transition-colors duration-300 ${
                  isPast || isActive ? "bg-signal-dim" : "bg-line"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
